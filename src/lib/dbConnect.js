import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log("Using existing MongoDB connection");
      return;
    }

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI, {});

    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default dbConnect;
