import Application from "../models/Application.models.js";
import Project from "../models/Project.models.js";

const applyToProject = async (projectId, userId) => {

    // Check if the project exists
    const project = await Project.findById(projectId).exec();

    if (!project) {
        throw new Error("Project not found");
    }

    // Check if the recuitment is still open
    if (project.recruitmentStatus !== "open") {
        throw new Error("Recruitment for this project is closed.");
    }

    // Check if the user has already applied
    const existingApplication = await Application.findOne({
        applicant: userId,
        project: projectId
    }).exec();

    if (existingApplication) {
        throw new Error("You have already applied to this project.");
    }

    // Create a new application
    const newApplication = new Application({
        applicant: userId,
        project: projectId,
        status: "pending"
    });

    return await newApplication.save();
};

export { applyToProject };