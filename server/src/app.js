import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

// Create an Express Application   
const app = express();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Register route
//If a request comes to "/", execute this function
app.get("/", (req, res) => {
    res.send("BuildBridge Server is running!");
});

// Starts the server and tells it to listen to the incoming requests
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});