// backend/testMail.js
import { sendEmail } from "./utils/sendEmail.js";

(async () => {
  try {
    await sendEmail(
      "yourtestrecipient@gmail.com",
      "Test email from Food app",
      "Hello — this is a test email sent from the reservation app."
    );
    console.log("Test email function completed");
  } catch (err) {
    console.error("Test failed:", err);
  }
})();
