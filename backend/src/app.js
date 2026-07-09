//This is where your express instance is configured, incoming global middlewares (like CORS and JSON parsers) are registered, and base routing maps are declared

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js'; 

const app = express();

// Global Middlewares
app.use(cors({ origin: true, credentials: true })); // Allows secure cookie transport across origins
app.use(express.json());
app.use(cookieParser()); 


app.use('/api/v1/auth', authRoutes);


app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the Restaurant Booking System API Engine'
  });
});


export default app;