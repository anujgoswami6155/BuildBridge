import express from "express";

import registerController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middlewares.js";

const authrouter = express.Router();

authrouter.post("/register", authMiddleware, registerController);

export default authrouter;