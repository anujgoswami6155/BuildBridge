import Task from "../models/Task.models.js";
import Project from "../models/Project.models.js";

const createTask = async (projectId, taskData) => {
    const project = await Project.findById(projectId).exec();

    if (!project) {
        throw new Error("Project not found");
    }

    const assignedTo = taskData.assignedTo || null;

    if (assignedTo) {
        const isTeamMember = project.teamMembers.some(
            member => member.toString() === assignedTo.toString()
        );

        if (!isTeamMember) {
            throw new Error(
                "Assigned user is not a team member of the project"
            );
        }
    }

    const task = new Task({
        ...taskData,
        project: projectId
    });

    return await task.save();
};

const getTasks = async (projectId) => {
    const project = await Project.findById(projectId).exec();

    if (!project) {
        throw new Error("Project not found");
    }

    return await Task.find({ project: projectId }).exec();
};

const updateTask = async (taskId, updateData) => {
    const task = await Task.findById(taskId).exec();

    if (!task) {
        throw new Error("Task not found");
    }

    // Validate assignedTo if it's being updated
    if (updateData.assignedTo !== undefined && updateData.assignedTo !== null) {
        const project = await Project.findById(task.project).exec();

        if (!project) {
            throw new Error("Project not found");
        }

        const isTeamMember = project.teamMembers.some(
            member => member.toString() === updateData.assignedTo.toString()
        );

        if (!isTeamMember) {
            throw new Error(
                "Assigned user is not a team member of the project"
            );
        }
    }

    Object.assign(task, updateData);

    return await task.save();
};

const deleteTask = async (projectId, taskId) => {
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

    return await Task.deleteOne({ _id: taskId }).exec();
};

export { createTask, getTasks, updateTask, deleteTask };