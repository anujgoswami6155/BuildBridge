import express from "express";

const projectRouter = express.Router();

import authMiddleware from "../middlewares/auth.middleware.js";
import ownerCheckMiddleware from "../middlewares/ownercheck.middleware.js";
import teamMemberMiddleware from "../middlewares/teammember.middleware.js";

import {
    createProjectController,
    updateProjectController,
    getProjectController,
    getProjectsController,
    removeMemberController,
    leaveProjectController,
    getWorkspaceController
} from "../controllers/project.controller.js";

// Create a new project
projectRouter.post(
    "/create",
    authMiddleware,
    createProjectController
);

// Update an existing project
projectRouter.put(
    "/:projectId",
    authMiddleware,
    ownerCheckMiddleware,
    updateProjectController
);

// Get project workspace (members, tasks, etc.)
projectRouter.get(
    "/:projectId/workspace",
    authMiddleware,
    teamMemberMiddleware,
    getWorkspaceController
);

// Get a specific project by ID
projectRouter.get(
    "/:projectId",
    getProjectController
);

// Get all projects for the authenticated user
projectRouter.get(
    "/",
    getProjectsController
);


// Member leaves project
projectRouter.delete(
    "/:projectId/members/me",
    authMiddleware,
    leaveProjectController
);

// Owner removes member
projectRouter.delete(
    "/:projectId/members/:userId",
    authMiddleware,
    ownerCheckMiddleware,
    removeMemberController
);

export default projectRouter;