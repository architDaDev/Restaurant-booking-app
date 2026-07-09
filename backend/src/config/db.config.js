/**
 * @name connectDb
 * @description This script handles the asynchronous handshake with your database, 
 * @access private
 */




import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log("Database URI inside process.env:", process.env.MONGO_URI);

   mongoose.connect(process.env.MONGO_URI)
   .then(() => console.log("[Database] Connected to MongoDB successfully!"))
   .catch((err) => console.error("MongoDB connection error:", err));
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;