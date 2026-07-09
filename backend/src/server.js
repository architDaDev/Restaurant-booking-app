import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import connectDB from './config/db.config.js';

// Load environmental profiles

// Fire up database connector
connectDB();

const PORT = process.env.PORT || 5080;

const server = app.listen(PORT, () => {
  console.log(`[Server] Running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Graceful breakdown handling for unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`\x1b[31m%s\x1b[0m`, `[Unhandled Error]: ${err.message}`);
  server.close(() => process.exit(1));
});