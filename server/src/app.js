import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
    res.send("BuildBridge Server is running!");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});