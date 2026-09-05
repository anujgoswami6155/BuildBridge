import express from "express";

import {
    createTaskController,
    getTasksController,
    updateTaskController,
    deleteTaskController,
    getKanbanController
} from "../controllers/tasks.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

import ownercheckMiddleware from "../middlewares/ownercheck.middleware.js";

import teamMemberMiddleware from "../middlewares/teamMember.middleware.js";

import updateTaskMiddleware from "../middlewares/taskUpdate.middleware.js";

const tasksRouter = express.Router();

tasksRouter.post(
    "/:projectId",
    authMiddleware,
    ownercheckMiddleware,
    createTaskController
);

tasksRouter.get(
    "/:projectId",
    authMiddleware,
    teamMemberMiddleware,
    getTasksController
);

// Kanban board
tasksRouter.get(
    "/:projectId/kanban",
    authMiddleware,
    teamMemberMiddleware,
    getKanbanController
);

tasksRouter.patch(
    "/:projectId/:taskId",
    authMiddleware,
    updateTaskMiddleware,
    updateTaskController
);

tasksRouter.delete(
    "/:projectId/:taskId",
    authMiddleware,
    ownercheckMiddleware,
    deleteTaskController
);

export default tasksRouter;