import mongoose from "mongoose";
import validator from "validator";

const reservationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    minLength: [3, "First name must be at least 3 characters long"],
    maxLength: [30, "First name must be at most 30 characters long"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    minLength: [3, "Last name must be at least 3 characters long"],
    maxLength: [30, "Last name must be at most 30 characters long"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email address",
    },
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    minLength: [10, "Phone number must contain 10 digits"],
    maxLength: [10, "Phone number must contain 10 digits"],
  },
  date: {
    type: String,
    required: [true, "Date is required"],
  },
  time: {
    type: String,
    required: [true, "Time is required"],
  },

  // ✅ New field: Table number assigned automatically
  tableNumber: {
    type: Number,
    required: false,
  },

  // ✅ New field: Reservation status (Booked, Cancelled, Completed)
  status: {
    type: String,
    enum: ["Booked", "Cancelled", "Completed"],
    default: "Booked",
  },

  // ✅ Optional note or message from the user
  specialRequest: {
    type: String,
    maxLength: [100, "Special request must be under 100 characters"],
  },

  // ✅ Timestamp for record creation
}, { timestamps: true });

// ✅ Indexing (Optional): Helps quickly check booked slots for a date/time
reservationSchema.index({ date: 1, time: 1 });

export const Reservation = mongoose.model("Reservation", reservationSchema);
