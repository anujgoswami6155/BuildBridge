import { createComment, getComments } from "../services/comments.services.js";

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

const getCommentsController = async (req, res) => {
    try {
        const { projectId } = req.params;

        const comments = await getComments(projectId);

        return res.status(200).json({
            message: "Comments retrieved successfully",
            comments
        });
        
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

export { createCommentController, getCommentsController };