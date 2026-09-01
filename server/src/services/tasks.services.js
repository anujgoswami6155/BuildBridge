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

export { createTask, getTasks };