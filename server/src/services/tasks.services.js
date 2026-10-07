import Task from "../models/Task.models.js";
import Project from "../models/Project.models.js";
import { isValidObjectId } from "../utils/validators.js";

const createTask = async (projectId, taskData) => {
    if (!isValidObjectId(projectId)) {
        throw new Error("Invalid project ID");
    }

    const project = await Project.findById(projectId).exec();

    if (!project) {
        throw new Error("Project not found");
    }

    if (!taskData.title || typeof taskData.title !== "string" || taskData.title.trim().length === 0) {
        throw new Error("Task title is required");
    }

    let assignedTo = taskData.assignedTo;
    if (assignedTo === "" || assignedTo === undefined) {
        assignedTo = null;
    }

    if (assignedTo !== null) {
        if (!isValidObjectId(assignedTo)) {
            throw new Error("Invalid assigned user ID");
        }

        const isOwnerOrMember =
            project.owner.toString() === assignedTo.toString() ||
            project.teamMembers.some(
                member => member.toString() === assignedTo.toString()
            );

        if (!isOwnerOrMember) {
            throw new Error(
                "Assigned user is not the owner or a team member of the project"
            );
        }
    }

    // Newly assigned/created tasks strictly default to "todo"
    const status = "todo";

    const task = new Task({
        title: taskData.title.trim(),
        description: taskData.description || "",
        status,
        assignedTo,
        project: projectId
    });

    const savedTask = await task.save();
    return await savedTask.populate("assignedTo", "name email");
};


const getTasks = async (projectId) => {
    if (!isValidObjectId(projectId)) {
        throw new Error("Invalid project ID");
    }

    const project = await Project.findById(projectId).exec();

    if (!project) {
        throw new Error("Project not found");
    }

    return await Task.find({ project: projectId })
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 })
        .exec();
};


const updateTask = async (taskId, updateData) => {
    if (!isValidObjectId(taskId)) {
        throw new Error("Invalid task ID");
    }

    const task = await Task.findById(taskId).exec();

    if (!task) {
        throw new Error("Task not found");
    }

    // Status transition rules
    if (updateData.status !== undefined && updateData.status !== task.status) {
        // Rule 1: When a task is completed, it is final and cannot change status
        if (task.status === "completed") {
            throw new Error("This task is completed. Completed tasks are final and their status cannot be changed.");
        }

        // Rule 2: When a task is in-progress, it cannot go back to todo
        if (task.status === "in-progress" && updateData.status === "todo") {
            throw new Error("Tasks in progress cannot be moved back to To Do.");
        }

        const validStatuses = ["todo", "in-progress", "completed"];
        if (!validStatuses.includes(updateData.status)) {
            throw new Error("Invalid status. Must be todo, in-progress, or completed");
        }

        task.status = updateData.status;
    }

    // Validate assignedTo if it's being updated
    if (updateData.assignedTo !== undefined) {
        if (updateData.assignedTo === null || updateData.assignedTo === "") {
            task.assignedTo = null;
        } else {
            if (!isValidObjectId(updateData.assignedTo)) {
                throw new Error("Invalid assigned user ID");
            }

            const project = await Project.findById(task.project).exec();

            if (!project) {
                throw new Error("Project not found");
            }

            const isOwnerOrMember =
                project.owner.toString() === updateData.assignedTo.toString() ||
                project.teamMembers.some(
                    member => member.toString() === updateData.assignedTo.toString()
                );

            if (!isOwnerOrMember) {
                throw new Error(
                    "Assigned user is not the owner or a team member of the project"
                );
            }

            task.assignedTo = updateData.assignedTo;
        }
    }

    if (updateData.title !== undefined) {
        if (typeof updateData.title !== "string" || updateData.title.trim().length === 0) {
            throw new Error("Task title cannot be empty");
        }
        task.title = updateData.title.trim();
    }

    if (updateData.description !== undefined) {
        task.description = updateData.description;
    }

    const savedTask = await task.save();
    return await savedTask.populate("assignedTo", "name email");
};


const deleteTask = async (projectId, taskId) => {
    if (!isValidObjectId(projectId) || !isValidObjectId(taskId)) {
        throw new Error("Invalid project ID or task ID");
    }

    const project = await Project.findById(projectId).exec();

    if (!project) {
        throw new Error("Project not found");
    }

    const task = await Task.findById(taskId).exec();

    if (!task) {
        throw new Error("Task not found");
    }

    if (task.project.toString() !== projectId.toString()) {
        throw new Error("Task does not belong to the specified project");
    }

    await Task.deleteOne({ _id: taskId }).exec();
    return task;
};


// Get tasks grouped by status for the Kanban board
const getKanban = async (projectId) => {
    if (!isValidObjectId(projectId)) {
        throw new Error("Invalid project ID");
    }

    const project = await Project.findById(projectId).exec();

    if (!project) {
        throw new Error("Project not found");
    }

    const tasks = await Task.find({ project: projectId })
        .populate("assignedTo", "name email")
        .sort({ updatedAt: -1 })
        .exec();

    return {
        todo: tasks.filter(task => task.status === "todo"),
        inProgress: tasks.filter(task => task.status === "in-progress"),
        completed: tasks.filter(task => task.status === "completed")
    };
};


export {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    getKanban
};