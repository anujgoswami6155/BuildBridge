import Comment from "../models/Comment.models.js";
import Project from "../models/Project.models.js";

const createComment = async (projectId, content, author) => {

    // Check if the project exists
    const project = await Project.findById(projectId).exec();
    if (!project) {
        throw new Error("Project not found");
    }

    // Create a new comment
    const comment = new Comment({
        content,
        author,
        project: projectId
    });

    return await comment.save();
};

const getComments = async (projectId) => {
    const project = await Project.findById(projectId).exec();

    if (!project) {
        throw new Error("Project not found");
    }

    const comments = await Comment.find({ project: projectId })
        .populate("author", "name")
        .exec();

    return comments;
};

const updateComment = async (commentId, content) => {
    const comment = await Comment.findById(commentId).exec();

    if (!comment) {
        throw new Error("Comment not found");
    }

    comment.content = content;
    return await comment.save();
};

export { createComment, getComments, updateComment };