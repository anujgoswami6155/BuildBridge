import {
    createTask,
    getTasks,
    updateTask,
    deleteTask
} from "../services/tasks.services.js";

const createTaskController = async (req, res) => {
    try {
        const { projectId } = req.params;

        const task = await createTask(projectId, req.body);

        return res.status(201).json({
            message: "Task created successfully.",
            task
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

const getTasksController = async (req, res) => {
    try {
        const { projectId } = req.params;

        const tasks = await getTasks(projectId);

        return res.status(200).json({
            message: "Tasks retrieved successfully.",
            tasks
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

const updateTaskController = async (req, res) => {
    try {
        const { title, description, assignedTo, status } = req.body;

        const allowedFields = ["title", "description", "assignedTo", "status"];
        const requestedFields = Object.keys(req.body);

        // Reject unknown fields
        const hasInvalidField = requestedFields.some(
            field => !allowedFields.includes(field)
        );

        if (hasInvalidField) {
            return res.status(400).json({
                message: "Invalid field provided."
            });
        }

        // Assigned member can only update status
        if (!req.isOwner) {
            if (requestedFields.length !== 1 || !requestedFields.includes("status")) {
                return res.status(403).json({
                    message: "Team members can only update task status."
                });
            }
        }

        const updateData = {};

        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
        if (status !== undefined) updateData.status = status;

        const task = await updateTask(req.task._id, updateData);

        return res.status(200).json({
            message: "Task updated successfully.",
            task
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

const deleteTaskController = async (req, res) => {
    try {
        const { projectId, taskId } = req.params;

        await deleteTask(projectId, taskId);

        return res.status(200).json({
            message: "Task deleted successfully."
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

export {
    createTaskController,
    getTasksController,
    updateTaskController,
    deleteTaskController
};