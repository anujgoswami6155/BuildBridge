import Project from "../models/Project.models.js";

const createProject = async (projectData, userId) => {
    const project = new Project({
        ...projectData,
        owner: userId
    });
    return await project.save();
};

export default createProject;