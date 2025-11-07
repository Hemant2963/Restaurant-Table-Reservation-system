import app from "./app.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// ✅ Render provides its own PORT automatically
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(
    `✅ Server is running on port ${PORT} ${
      process.env.RENDER
        ? "(Render Deployment)"
        : `(Local: http://localhost:${PORT})`
    }`
  );
});
