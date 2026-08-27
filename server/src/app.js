import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authrouter from "./routes/auth.routes.js";

dotenv.config();

// Create an Express Application   
const app = express();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

//JSON Body parsing
app.use(express.json());

// Register route
//If a request comes to "/", execute this function
app.get("/", (req, res) => {
    res.send("BuildBridge Server is running!");
});

//If a request comes to "/auth"
app.use('/api/auth', authrouter);

// Starts the server and tells it to listen to the incoming requests
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});