import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./error/error.js";
import reservationRoute from "./routes/reservationRoute.js";

// ---------------------------------------------
// Load environment variables FIRST
dotenv.config();

// DEBUG: Check if MONGO_URI is loading
console.log("DEBUG → MONGO_URI =", process.env.MONGO_URI);
console.log("DEBUG → FRONTEND_URL =", process.env.FRONTEND_URL);
console.log("DEBUG → PORT =", process.env.PORT);

const app = express();

// ---------------------------------------------
// CORS
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ---------------------------------------------
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------
// API Routes
app.use("/api/v1/reservation", reservationRoute);

// ---------------------------------------------
// Database Connection
dbConnection();

// ---------------------------------------------
// Serve Frontend (Express 5 Safe Version)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// DO NOT USE "*" IN EXPRESS 5
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ---------------------------------------------
// Error Middleware
app.use(errorMiddleware);

export default app;
