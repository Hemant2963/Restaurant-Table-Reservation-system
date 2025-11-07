import ErrorHandler from "../utils/errorHandler.js";
import { Reservation } from "../models/reservationSchema.js";
import { sendEmail } from "../utils/sendEmail.js";

// ✅ Total number of tables in the restaurant
const TOTAL_TABLES = 10;

/* =========================================================
   📩 Controller: Handle new reservation requests
   Endpoint: POST /api/v1/reservation
   ========================================================= */
export const sendReservation = async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber, time, date, specialRequest } = req.body;

  // 🧩 Validate required fields
  if (!firstName || !lastName || !email || !phoneNumber || !time || !date) {
    return res.status(400).json({ message: "Please fill all required fields." });
  }

  try {
    // 🧮 Count existing bookings for the same date/time
    const existingReservations = await Reservation.countDocuments({ date, time });

    // ❌ All tables are booked for that time
    if (existingReservations >= TOTAL_TABLES) {
      return res.status(400).json({
        success: false,
        message: "Sorry, all tables are booked for this time slot.",
      });
    }

    // ✅ Assign next available table
    const tableNumber = existingReservations + 1;
    const vacantTables = TOTAL_TABLES - existingReservations - 1;

    // 🗃️ Save reservation
    const newReservation = await Reservation.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      time,
      date,
      tableNumber,
      specialRequest,
      status: "Booked",
    });

    // ✉️ Confirmation email message
    const message = `
      Dear ${firstName} ${lastName},

      Your reservation has been successfully received!

      📅 Date: ${date}
      🕒 Time: ${time}
      🍽️ Table Number: ${tableNumber}

      Thank you for choosing Tasty Food Restaurant.
      We look forward to serving you!

      Warm regards,
      🍴 Tasty Food Restaurant
    `;

    // ✅ Send confirmation email to customer
    await sendEmail(email, "Reservation Confirmation - Tasty Food", message);

    // ✅ Send copy to restaurant admin
    await sendEmail(
      process.env.EMAIL_USER,
      `New Reservation from ${firstName} ${lastName}`,
      `
        A new reservation has been made:

        👤 Name: ${firstName} ${lastName}
        📧 Email: ${email}
        📞 Phone: ${phoneNumber}
        📅 Date: ${date}
        🕒 Time: ${time}
        🍽️ Table Number: ${tableNumber}
      `
    );

    // ✅ Respond to frontend
    res.status(200).json({
      success: true,
      message: `Reservation successful! Table No. ${tableNumber} confirmed.`,
      vacantTables,
      data: newReservation,
    });
  } catch (error) {
    console.error("❌ Error saving reservation:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return next(new ErrorHandler(validationErrors.join(", "), 400));
    }

    return next(new ErrorHandler("Server error while saving reservation", 500));
  }
};

/* =========================================================
   📅 Controller: Get booked time slots for a date
   Endpoint: GET /api/v1/reservation/booked/:date
   ========================================================= */
export const getBookedSlots = async (req, res, next) => {
  const { date } = req.params;

  // 🧩 Validate that a date is provided
  if (!date) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid date in the request URL.",
    });
  }

  try {
    // 🔍 Find all reservations for the given date
    const reservations = await Reservation.find({ date }).sort({ time: 1 });
    const bookedSlots = reservations.map((r) => ({
      time: r.time,
      tableNumber: r.tableNumber,
    }));

    // 🧾 Return response
    res.status(200).json({
      success: true,
      totalBooked: bookedSlots.length,
      totalVacant: TOTAL_TABLES - bookedSlots.length,
      bookedSlots,
    });
  } catch (error) {
    console.error("❌ Error fetching booked slots:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching booked slots.",
    });
  }
};
