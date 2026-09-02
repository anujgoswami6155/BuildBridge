import Task from "../models/tasks.model.js";
import Project from "../models/projects.model.js";

const updateTaskMiddleware = async (req, res, next) => {
    try {
        const { projectId, taskId } = req.params;
        const userId = req.userId;

        // Find project
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found."
            });
        }

        // Find task
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        // Make sure the task belongs to the specified project
        if (task.project.toString() !== projectId) {
            return res.status(400).json({
                message: "Task does not belong to the specified project."
            });
        }

        // Check if requester is the project owner
        const isOwner = project.owner.toString() === userId.toString();

        // Check if requester is assigned to this task
        const isAssignedMember =
            task.assignedTo &&
            task.assignedTo.toString() === userId.toString();

        // Only owner or assigned member can update
        if (!isOwner && !isAssignedMember) {
            return res.status(403).json({
                message: "You do not have permission to update this task."
            });
        }

        // Store information for the controller
        req.task = task;
        req.project = project;
        req.isOwner = isOwner;

        next();

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error."
        });
    }
};

export default updateTaskMiddleware;