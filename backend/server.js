import app from './app.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Define a fallback port (in case PORT isn’t in your .env file)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

