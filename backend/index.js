import app from './src/app.js';
import { connectDB } from './src/config/db.js';

// Vercel Serverless Function entry point
export default async (req, res) => {
  try {
    // Ensure DB is connected for every request (using the idempotent check)
    await connectDB();
    
    // Pass the request to the Express app
    return app(req, res);
  } catch (error) {
    console.error('SERVERLESS_ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Critical server initialization failure',
      error: error.message
    });
  }
};
