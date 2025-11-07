import express from "express";
import {
  sendReservation,
  getBookedSlots, // ✅ import the new controller function
} from "../controller/reservationController.js";

const router = express.Router();

/*  
📩 POST /api/v1/reservation  
   → Creates a new reservation and sends confirmation email
*/
router.post("/", sendReservation);

/*  
📅 GET /api/v1/reservation/booked/:date  
   → Fetch all booked tables for a specific date  
   Example: /api/v1/reservation/booked/2025-11-08
*/
router.get("/booked/:date", getBookedSlots);

export default router;
