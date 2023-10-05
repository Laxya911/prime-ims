import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO;
    if (!mongoURI) {
      throw new Error("MongoDB connection URI is not defined.");
    }
    
    await mongoose.connect(mongoURI);
    // console.log("Connected to MongoDB");
  } catch (error) {
    throw new Error("Connection failed!");
  }
};

export default connectDB;
