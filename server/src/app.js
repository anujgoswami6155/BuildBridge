import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authrouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";
import applicationRouter from "./routes/application.routes.js";
import tasksRouter from "./routes/tasks.routes.js";
import commentsRouter from "./routes/comment.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

dotenv.config();

// Create an Express Application   
const app = express();

const PORT = process.env.PORT || 5000;

// JSON Body parsing
app.use(express.json());

// Enable CORS for frontend clients
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000"
];

if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps, curl, Postman)
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            // Allow all local dev ports if needed
            if (/^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
                return callback(null, true);
            }
            return callback(null, true);
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

// Health check and root route
app.get("/", (req, res) => {
    res.json({
        name: "BuildBridge API",
        status: "online",
        message: "BuildBridge Server is running!"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authrouter);
app.use('/api/projects', projectRouter);
app.use('/api/applications', applicationRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/dashboard', dashboardRouter);

// 404 handler for unhandled routes
app.use((req, res) => {
    res.status(404).json({
        message: `Route ${req.method} ${req.originalUrl} not found`
    });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(err.status || 500).json({
        message: err.message || "Internal server error"
    });
});

// Starts the server if run directly (and not during tests)
const isMain = process.argv[1] && path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();

if (process.env.NODE_ENV !== "test" && isMain) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
} else if (process.env.NODE_ENV !== "test_no_db" && !isMain) {
    connectDB();
}

export default app;