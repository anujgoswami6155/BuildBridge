import Project from "../models/Project.models.js";

// Create a new project and associate it with the user
const createProject = async (projectData, userId) => {

    // Create a new project instance and set the owner to the userId
    const project = new Project({
        ...projectData,
        owner: userId
    });
    return await project.save();
};

const updateProject = async (projectId, projectData) => {
    // Find the project by ID and update it
    const project = await Project.findByIdAndUpdate(projectId, projectData, { new: true });

    if (!project) {
        throw new Error("Project not found");
    }

    return project;
};

const getProject = async (projectId) => {
    // Find the project by ID
    const project = await Project.findById(projectId).exec();

    if (!project) {
        throw new Error("Project not found");
    }

    return project;
};

const getProjects = async (filters) => {
    // Build the query object based on filters
    const query = {};

    if (filters.search) {
        query.$or = [
            { title: { $regex: filters.search, $options: "i" } },
            { description: { $regex: filters.search, $options: "i" } },
            { requiredSkills: { $regex: filters.search, $options: "i" } },
            { techStack: { $regex: filters.search, $options: "i" } }
        ];
    }

    if (filters.category) {
        query.category = filters.category;
    }

    return await Project.find(query).exec();
};

export { createProject, updateProject, getProject, getProjects };