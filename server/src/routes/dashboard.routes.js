import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import { getDashboardController } from "../controllers/dashboard.controller.js";

const dashboardRouter = express.Router();

dashboardRouter.get(
    "/",
    authMiddleware,
    getDashboardController
);

export default dashboardRouter;