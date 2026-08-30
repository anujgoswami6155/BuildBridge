import express from "express";

import {
    applyController,
    getApplicationsController
} from "../controllers/application.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import ownerCheckMiddleware from "../middlewares/ownercheck.middleware.js";

const applicationRouter = express.Router();

applicationRouter.post("/", authMiddleware, applyController);

applicationRouter.get(
    "/:projectId",
    authMiddleware,
    ownerCheckMiddleware,
    getApplicationsController
);

export default applicationRouter;