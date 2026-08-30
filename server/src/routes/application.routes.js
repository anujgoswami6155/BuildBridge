import express from 'express';

import { applyController } from '../controllers/application.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const applicationRouter = express.Router();

applicationRouter.post("/", authMiddleware, applyController);

export default applicationRouter;