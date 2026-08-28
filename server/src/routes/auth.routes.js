import express from "express";

import {registerController, loginController, meController} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middlewares.js";
import registerMiddleware from "../middlewares/register.middleware.js";

const authrouter = express.Router();

authrouter.post("/register", registerMiddleware, registerController);

authrouter.post("/login", loginController);

authrouter.get("/me", authMiddleware, meController);

export default authrouter;