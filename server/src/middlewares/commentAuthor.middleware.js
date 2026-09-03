import Comment from "../models/Comment.models.js";

const commentAuthorMiddleware = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const userId = req.userId;

        const comment = await Comment.findById(commentId).exec();

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not the author of this comment"
            });
        }

        req.comment = comment;

        next();

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export default commentAuthorMiddleware;