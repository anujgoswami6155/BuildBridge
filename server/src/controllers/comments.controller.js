import { createComment } from "../services/comments.services.js";

const createCommentController = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { content } = req.body;
        const author = req.userId;

        const comment = await createComment(projectId, content, author);

        return res.status(201).json({
            message: "Comment created successfully",
            comment
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

export { createCommentController };