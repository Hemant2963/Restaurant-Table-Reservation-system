import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./error/error.js";
import reservationRoute from "./routes/reservationRoute.js";

// Load environment variables
dotenv.config();


const app = express();

// -------------------------------------------------------------------
// 🟢 CORS SETUP (Smart for both local and Render)
const allowedOrigins = [
  "http://localhost:5173", // Local frontend
  process.env.FRONTEND_URL, // Render frontend domain (set in env vars)
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// -------------------------------------------------------------------
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------------------------------------------------
// 🧩 API Routes
app.use("/api/v1/reservation", reservationRoute);

// -------------------------------------------------------------------
// 🧱 Database Connection
dbConnection();

// -------------------------------------------------------------------
// 🧩 Serve Frontend (for Render Deployment)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// -------------------------------------------------------------------
// 🧩 Error Middleware (Always after routes)
app.use(errorMiddleware);

// -------------------------------------------------------------------
export default app;
