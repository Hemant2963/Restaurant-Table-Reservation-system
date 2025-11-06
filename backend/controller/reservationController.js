import ErrorHandler from "../utils/errorHandler.js";
import { Reservation } from "../models/reservationSchema.js";
import { sendEmail } from "../utils/sendEmail.js"; // ✅ Import email utility

export const sendReservation = async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber, time, date } = req.body;

  // 🧩 Validate required fields
  if (!firstName || !lastName || !email || !phoneNumber || !time || !date) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    // 🗃️ Create new reservation in DB
    const newReservation = await Reservation.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      time,
      date,
    });

    // ✉️ Compose confirmation email
    const message = `
      Dear ${firstName} ${lastName},

      Your reservation has been successfully received!

      📅 Date: ${date}
      🕒 Time: ${time}

      Thank you for choosing our restaurant.
      We look forward to serving you!

      Warm regards,
      🍽️ Tasty Food Restaurant
    `;

    // ✅ Send confirmation email to customer
    await sendEmail(email, "Reservation Confirmation - Tasty Food", message);

    // ✅ (Optional) Send copy to restaurant admin
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
      `
    );

    // ✅ Success response
    res.status(200).json({
      success: true,
      message: "Reservation sent successfully & email confirmation sent",
      data: newReservation,
    });
  } catch (error) {
    console.error("❌ Error saving reservation:", error);

    // ⚠️ Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return next(new ErrorHandler(validationErrors.join(", "), 400));
    }

    // ⚠️ Handle all other errors
    return next(
      new ErrorHandler("Server error while saving reservation", 500)
    );
  }
};
