import Comment from "../models/Comment.models.js";
import Project from "../models/Project.models.js";
import { isValidObjectId } from "../utils/validators.js";

const createComment = async (projectId, content, author) => {
    if (!isValidObjectId(projectId)) {
        throw new Error("Invalid project ID");
    }

    if (!content || typeof content !== "string" || content.trim().length === 0) {
        throw new Error("Comment content cannot be empty");
    }

    const project = await Project.findById(projectId).exec();

    if (!project) {
        throw new Error("Project not found");
    }

    const comment = new Comment({
        content: content.trim(),
        author,
        project: projectId
    });

    const savedComment = await comment.save();
    return await savedComment.populate("author", "name email");
};

const getComments = async (projectId) => {
    if (!isValidObjectId(projectId)) {
        throw new Error("Invalid project ID");
    }

    const project = await Project.findById(projectId).exec();

    if (!project) {
        throw new Error("Project not found");
    }

    const comments = await Comment.find({ project: projectId })
        .populate("author", "name email")
        .sort({ createdAt: 1 })
        .exec();

    return comments;
};

const updateComment = async (commentId, content) => {
    if (!isValidObjectId(commentId)) {
        throw new Error("Invalid comment ID");
    }

    if (!content || typeof content !== "string" || content.trim().length === 0) {
        throw new Error("Comment content cannot be empty");
    }

    const comment = await Comment.findById(commentId).exec();

    if (!comment) {
        throw new Error("Comment not found");
    }

    comment.content = content.trim();

    const savedComment = await comment.save();
    return await savedComment.populate("author", "name email");
};

const deleteComment = async (commentId) => {
    if (!isValidObjectId(commentId)) {
        throw new Error("Invalid comment ID");
    }

    const comment = await Comment.findByIdAndDelete(commentId).exec();

    if (!comment) {
        throw new Error("Comment not found");
    }

    return comment;
};

export {
    createComment,
    getComments,
    updateComment,
    deleteComment
};