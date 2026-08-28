import express from "express";

import {registerController, loginController} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middlewares.js";

const authrouter = express.Router();

authrouter.post("/register", authMiddleware, registerController);

authrouter.post("/login", loginController);

export default authrouter;