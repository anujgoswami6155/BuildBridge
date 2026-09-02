import express from "express";

import { createTaskController, getTasksController, updateTaskController } from "../controllers/tasks.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import ownercheckMiddleware from "../middlewares/ownercheck.middleware.js";
import teamMemberMiddleware from "../middlewares/teamMember.middleware.js";


const tasksRouter = express.Router();

tasksRouter.post("/:projectId", authMiddleware, ownercheckMiddleware, createTaskController);

tasksRouter.get("/:projectId", authMiddleware, teamMemberMiddleware, getTasksController);

tasksRouter.patch("/:projectId/:taskId", authMiddleware, updateTaskMiddleware, updateTaskController);
export default tasksRouter;