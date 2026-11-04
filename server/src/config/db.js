import mongoose from "mongoose";

const connectDB = async (uri = process.env.MONGO_URI) => {
    if (!uri) {
        throw new Error("MongoDB connection URI is not configured");
    }

    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
};

export default connectDB;