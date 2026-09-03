import express from "express";

import {
    createCommentController,
    getCommentsController,
    updateCommentController,
    deleteCommentController
} from "../controllers/comments.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import commentAuthorMiddleware from "../middlewares/commentAuthor.middleware.js";
import teamMemberMiddleware from "../middlewares/teamMember.middleware.js";

const commentsRouter = express.Router();

commentsRouter.post(
    "/:projectId",
    authMiddleware,
    teamMemberMiddleware,
    createCommentController
);

commentsRouter.get(
    "/:projectId",
    authMiddleware,
    teamMemberMiddleware,
    getCommentsController
);

commentsRouter.patch(
    "/:commentId",
    authMiddleware,
    commentAuthorMiddleware,
    updateCommentController
);

commentsRouter.delete(
    "/:commentId",
    authMiddleware,
    commentAuthorMiddleware,
    deleteCommentController
);

export default commentsRouter;