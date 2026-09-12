import express from "express";

import {registerController, loginController, meController, updateProfileController, getPublicProfileController} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import registerMiddleware from "../middlewares/register.middleware.js";
import loginMiddleware from "../middlewares/login.middleware.js";
import profileMiddleware from "../middlewares/profile.middleware.js";

const authrouter = express.Router();

authrouter.post("/register", registerMiddleware, registerController);

authrouter.post("/login", loginMiddleware, loginController);

authrouter.get("/me", authMiddleware, meController);

authrouter.get("/profile/:userId", getPublicProfileController);

authrouter.patch("/profile", authMiddleware, profileMiddleware, updateProfileController);

export default authrouter;