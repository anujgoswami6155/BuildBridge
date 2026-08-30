import express from "express";

const projectRouter = express.Router();

import authMiddleware from "../middlewares/auth.middleware.js";
import ownerCheckMiddleware from "../middlewares/ownercheck.middleware.js";
import {createProjectController, updateProjectController, getProjectController, getProjectsController} from "../controllers/project.controller.js";

projectRouter.post("/create", authMiddleware, createProjectController);

projectRouter.put("/:projectId", authMiddleware, ownerCheckMiddleware, updateProjectController);

projectRouter.get("/:projectId", getProjectController);

projectRouter.get("/", getProjectsController);

export default projectRouter;