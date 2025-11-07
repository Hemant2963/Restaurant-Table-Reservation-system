import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const Reservation = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const [availability, setAvailability] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false); // 🌀 for loading state
  const navigate = useNavigate();

  // 🧭 Check availability handler
  const checkAvailability = async () => {
    if (!date) {
      toast.error("Please select a date first!");
      return;
    }

    try {
      setLoading(true);
      console.log("📅 Checking availability for:", date);

      const res = await axios.get(
        `http://localhost:4000/api/v1/reservation/booked/${date}`
      );

      if (res.data.success) {
        setAvailability({
          totalBooked: res.data.totalBooked,
          totalVacant: res.data.totalVacant,
        });
        setBookedSlots(res.data.bookedSlots);
        toast.success("Availability updated!");
      } else {
        toast.error("Could not fetch availability");
      }
    } catch (error) {
      console.error("❌ Error fetching availability:", error);
      toast.error(
        error.response?.data?.message || "Error fetching availability."
      );
    } finally {
      setLoading(false);
    }
  };

  // 🧾 Submit handler
  const handleReservation = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/reservation",
        {
          firstName,
          lastName,
          email,
          phoneNumber: phone,
          date,
          time,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      toast.success(data.message);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setDate("");
      setTime("");
      setAvailability(null);
      setBookedSlots([]);
      navigate("/success");
    } catch (error) {
      console.error("❌ Reservation Error:", error);
      toast.error(error.response?.data?.message || "Reservation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="reservation" id="reservation">
      <div className="container">
        <div className="banner">
          <img src="/reservation.png" alt="reservation banner" />
        </div>

        <div className="banner">
          <div className="reservation_form_box">
            <h1>BOOK YOUR TABLE</h1>
            <p>Fill the details below to reserve your spot</p>

            <form onSubmit={handleReservation}>
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>

              {/* 🔍 Check availability */}
              <button
                type="button"
                disabled={loading}
                onClick={checkAvailability}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Checking..." : "Check Availability"}
              </button>

              {/* 📊 Availability info */}
              {availability && (
                <div
                  style={{
                    marginBottom: "15px",
                    textAlign: "left",
                    border: "1px solid #ddd",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "#fafafa",
                  }}
                >
                  <p>📅 Total Booked Tables: {availability.totalBooked}</p>
                  <p>✅ Tables Still Available: {availability.totalVacant}</p>

                  {bookedSlots.length > 0 ? (
                    <>
                      <p>🕒 Booked Slots:</p>
                      <ul>
                        {bookedSlots.map((slot, index) => (
                          <li key={index}>
                            Table {slot.tableNumber} → {slot.time}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p>🎉 All slots are free for this date!</p>
                  )}
                </div>
              )}

              <button type="submit" disabled={loading}>
                {loading ? "Processing..." : "RESERVE NOW"}{" "}
                <span>
                  <HiOutlineArrowNarrowRight />
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reservation;
