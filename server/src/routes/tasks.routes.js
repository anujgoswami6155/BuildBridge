import express from "express";

import { createTaskController } from "../controllers/tasks.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import ownercheckMiddleware from "../middlewares/ownercheck.middleware.js";


const tasksRouter = express.Router();

tasksRouter.post("/:projectId", authMiddleware, ownercheckMiddleware, createTaskController);

export default tasksRouter;