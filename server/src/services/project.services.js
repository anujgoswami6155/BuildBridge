import Project from "../models/Project.models.js";
import Application from "../models/Application.models.js";
import Task from "../models/Task.models.js";
import Comment from "../models/Comment.models.js";

// Create a new project
const createProject = async (projectData, userId) => {

    const {
        title,
        description,
        category,
        requiredSkills,
        techStack,
        resources,
        teamSize,
        recruitmentStatus
    } = projectData;

    const project = new Project({
        title,
        description,
        category,
        requiredSkills,
        techStack,
        resources,
        teamSize,
        recruitmentStatus,

        // Always use the authenticated user
        owner: userId,

        // A newly created project starts with no members
        teamMembers: []
    });

    return await project.save();
};

// Update an existing project by its ID
const updateProject = async (projectId, projectData) => {

    const allowedFields = [
        "title",
        "description",
        "category",
        "requiredSkills",
        "techStack",
        "resources",
        "teamSize",
        "recruitmentStatus"
    ];

    const updateData = {};

    // Only allow approved fields to be updated
    for (const field of allowedFields) {
        if (projectData[field] !== undefined) {
            updateData[field] = projectData[field];
        }
    }

    // Make sure at least one valid field was provided
    if (Object.keys(updateData).length === 0) {
        throw new Error("No valid fields provided for update");
    }

    // Validate resources if they are being updated
    if (updateData.resources !== undefined) {

        if (!Array.isArray(updateData.resources)) {
            throw new Error("Resources must be an array");
        }

        for (const resource of updateData.resources) {

            if (
                typeof resource !== "object" ||
                resource === null
            ) {
                throw new Error("Each resource must be an object");
            }

            if (
                typeof resource.title !== "string" ||
                resource.title.trim().length === 0
            ) {
                throw new Error("Resource title is required");
            }

            if (
                typeof resource.url !== "string" ||
                resource.url.trim().length === 0
            ) {
                throw new Error("Resource URL is required");
            }
        }
    }

    const project = await Project.findByIdAndUpdate(
        projectId,
        updateData,
        {
            new: true,
            runValidators: true
        }
    );

    if (!project) {
        throw new Error("Project not found");
    }

    return project;
};


// Get a project by its ID
const getProject = async (projectId) => {

    const project = await Project.findById(projectId).exec();

    if (!project) {
        throw new Error("Project not found");
    }

    return project;
};


// Get all projects with optional filters
const getProjects = async (filters) => {

    const query = {};

    // Search by title, description, required skills, or tech stack
    if (filters.search) {
        query.$or = [
            {
                title: {
                    $regex: filters.search,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: filters.search,
                    $options: "i"
                }
            },
            {
                requiredSkills: {
                    $regex: filters.search,
                    $options: "i"
                }
            },
            {
                techStack: {
                    $regex: filters.search,
                    $options: "i"
                }
            }
        ];
    }

    // Filter by category
    if (filters.category) {
        query.category = filters.category;
    }

    return await Project.find(query).exec();
};


// Remove a team member from a project
const removeMember = async (projectId, userId) => {

    const project = await Project.findById(projectId).exec();

    if (!project) {
        throw new Error("Project not found");
    }

    // Project owner cannot be removed
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


// Leave a project
const leaveProject = async (projectId, userId) => {

    const project = await Project.findById(projectId).exec();

    if (!project) {
        throw new Error("Project not found");
    }

    // Project owner cannot leave
    if (project.owner.toString() === userId.toString()) {
        throw new Error("Project owner cannot leave the project");
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


// Get project workspace
const getWorkspace = async (projectId) => {

    const project = await Project.findById(projectId)
        .populate("owner", "name email")
        .populate("teamMembers", "name email")
        .exec();

    if (!project) {
        throw new Error("Project not found");
    }

    return project;
};


// Get project progress
const getProjectProgress = async (projectId) => {

    // First verify that the project exists
    const project = await Project.findById(projectId).exec();

    if (!project) {
        throw new Error("Project not found");
    }

    // Count all tasks belonging to this project
    const totalTasks = await Task.countDocuments({
        project: projectId
    });

    // Count completed tasks
    const completedTasks = await Task.countDocuments({
        project: projectId,
        status: "completed"
    });

    // Calculate progress percentage
    const progress =
        totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);

    return {
        totalTasks,
        completedTasks,
        progress
    };
};


// Delete a project and its associated data
const deleteProject = async (projectId) => {

    const project = await Project.findById(projectId).exec();

    if (!project) {
        throw new Error("Project not found");
    }

    // Delete associated applications
    await Application.deleteMany({
        project: projectId
    });

    // Delete associated comments
    await Comment.deleteMany({
        project: projectId
    });

    // Delete associated tasks
    await Task.deleteMany({
        project: projectId
    });

    await Project.findByIdAndDelete(projectId);

    return true;
};


export {
    createProject,
    updateProject,
    getProject,
    getProjects,
    removeMember,
    leaveProject,
    getWorkspace,
    getProjectProgress,
    deleteProject
};