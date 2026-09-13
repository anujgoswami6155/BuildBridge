import express from "express";

const projectRouter = express.Router();

import authMiddleware from "../middlewares/auth.middleware.js";
import ownerCheckMiddleware from "../middlewares/ownercheck.middleware.js";
import teamMemberMiddleware from "../middlewares/teamMember.middleware.js";

import {
    createProjectController,
    updateProjectController,
    getProjectController,
    getProjectsController,
    removeMemberController,
    leaveProjectController,
    getWorkspaceController,
    deleteProjectController,
    getProjectProgressController
} from "../controllers/project.controller.js";


// Create a new project
projectRouter.post(
    "/create",
    authMiddleware,
    createProjectController
);


// Get all projects
projectRouter.get(
    "/",
    getProjectsController
);


// Get project workspace
projectRouter.get(
    "/:projectId/workspace",
    authMiddleware,
    teamMemberMiddleware,
    getWorkspaceController
);


// Get project progress
projectRouter.get(
    "/:projectId/progress",
    authMiddleware,
    teamMemberMiddleware,
    getProjectProgressController
);


// Get a specific project by ID
projectRouter.get(
    "/:projectId",
    getProjectController
);


// Update an existing project
projectRouter.put(
    "/:projectId",
    authMiddleware,
    ownerCheckMiddleware,
    updateProjectController
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


// Delete the project
projectRouter.delete(
    "/:projectId",
    authMiddleware,
    ownerCheckMiddleware,
    deleteProjectController
);


export default projectRouter;