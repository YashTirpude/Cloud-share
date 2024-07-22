import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DBConnection = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error while connecting database", error.message);
  }
};

export default DBConnection;
