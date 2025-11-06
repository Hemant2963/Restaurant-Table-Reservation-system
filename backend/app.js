import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./error/error.js"; // ✅ correct folder
import reservationRoute from "./routes/reservationRoute.js";

dotenv.config({ path: "./config/config.env" });

const app = express();

// Enable CORS
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST"],
    credentials: true,
  })
);

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/v1/reservation", reservationRoute);

// Connect Database
dbConnection();

// Error Middleware (should be after routes)
app.use(errorMiddleware);

export default app;
