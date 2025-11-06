import mongoose from "mongoose";
import validator from "validator";

const reservationSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: [true, "First name is required"],
        minLength: [3, "First name must be at least 3 characters long"],
        maxLength: [30, "First name must be at most 30 characters long"]
    },
    lastName:{
        type: String,
        required: [true, "Last name is required"],
        minLength: [3, "Last name must be at least 3 characters long"],
        maxLength: [30, "Last name must be at most 30 characters long"]
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: validator.isEmail,
            message: "Please provide a valid email address"
        }
    },
    phoneNumber:{
        type: String,
        required: [true, "Phone number is required"],
        minLength: [10, "Phone number must contain only 10 digits"],
        maxLength: [10, "Phone number must contain only 10 digits"],
    },
    time:{
        type: String,
        required: [true, "Time is required"]
    },
    date:{
        type: String,
        required: [true, "Date is required"]
    }
});


export const Reservation = mongoose.model("Reservation", reservationSchema);