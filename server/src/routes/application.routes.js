import express from "express";

import {
    applyController,
    getApplicationsController,
    updateApplicationStatusController
} from "../controllers/application.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import ownerCheckMiddleware from "../middlewares/ownercheck.middleware.js";
import applicationOwnerMiddleware from "../middlewares/applicationowner.middleware.js";

const applicationRouter = express.Router();

applicationRouter.post("/", authMiddleware, applyController);

applicationRouter.get(
    "/:projectId",
    authMiddleware,
    ownerCheckMiddleware,
    getApplicationsController
);

applicationRouter.patch(
    "/:applicationId",
    authMiddleware,
    applicationOwnerMiddleware,
    updateApplicationStatusController
);

export default applicationRouter;