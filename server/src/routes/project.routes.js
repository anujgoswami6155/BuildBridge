import express from "express";

const projectRouter = express.Router();

import authMiddleware from "../middlewares/auth.middleware.js";
import createProjectController from "../controllers/project.controller.js";

projectRouter.post("/create", authMiddleware, createProjectController);

export default projectRouter;