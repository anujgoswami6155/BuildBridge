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

// Update an existing project by its ID
const updateProject = async (projectId, projectData) => {
    // Find the project by ID and update it
    const project = await Project.findByIdAndUpdate(projectId, projectData, { new: true });

    if (!project) {
        throw new Error("Project not found");
    }

    return project;
};

// Get a project by its ID
const getProject = async (projectId) => {
    // Find the project by ID
    const project = await Project.findById(projectId).exec();

    if (!project) {
        throw new Error("Project not found");
    }

    return project;
};

// Get all projects with optional filters
const getProjects = async (filters) => {
    // Build the query object based on filters
    const query = {};

    // If a search term is provided, use it to filter projects by title, description, required skills, or tech stack
    if (filters.search) {
        query.$or = [
            { title: { $regex: filters.search, $options: "i" } },
            { description: { $regex: filters.search, $options: "i" } },
            { requiredSkills: { $regex: filters.search, $options: "i" } },
            { techStack: { $regex: filters.search, $options: "i" } }
        ];
    }

    // If a category filter is provided, add it to the query
    if (filters.category) {
        query.category = filters.category;
    }

    return await Project.find(query).exec();
};

const removeMember = async (projectId, userId) => {
    const project = await Project.findById(projectId).exec();

    if (!project) {
        throw new Error("Project not found");
    }

    if (project.owner.toString() === userId.toString()) {
        throw new Error("Project owner cannot be removed");
    }

    const isMember = project.teamMembers.some(
        member => member.toString() === userId.toString()
    );

    if (!isMember) {
        throw new Error("User is not a team member");
    }

    project.teamMembers = project.teamMembers.filter(
        member => member.toString() !== userId.toString()
    );

    return await project.save();
};

export { createProject, updateProject, getProject, getProjects, removeMember };