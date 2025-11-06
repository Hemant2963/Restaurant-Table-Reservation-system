import express from 'express';
import{sendReservation}from '../controller/reservationController.js';

const router = express.Router();

/*router.post('/send', (req, res, next) => {
console.log("📩 Received POST /reservation:", req.body);
next();
}, sendReservation);
*/
router.post("/", sendReservation);
export default router;
