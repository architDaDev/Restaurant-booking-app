// //This is where your express instance is configured, incoming global middlewares (like CORS and JSON parsers) are registered, and base routing maps are declared

// import express from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import authRoutes from './routes/auth.route.js'; 

// const app = express();

// // Global Middlewares
// app.use(cors({ origin: true, credentials: true })); // Allows secure cookie transport across origins
// app.use(express.json());
// app.use(cookieParser()); 


// app.use('/api/v1/auth', authRoutes);


// app.get('/', (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'Welcome to the Restaurant Booking System API Engine'
//   });
// });


// export default app;



// backend/src/app.js (Partial update snippet)
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import restaurantRoutes from './routes/restaurant.route.js'; // 1. Import restaurant routes

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Mount Core REST Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/restaurants', restaurantRoutes); // 2. Mount restaurant endpoints

app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Welcome to the Restaurant Booking System API Engine' });
});



export default app;