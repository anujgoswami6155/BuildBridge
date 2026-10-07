import Application from "../models/Application.models.js";
import Project from "../models/Project.models.js";
import { isValidObjectId } from "../utils/validators.js";

// Apply to a project
const applyToProject = async (projectId, userId) => {
    if (!isValidObjectId(projectId)) {
        throw new Error("Invalid project ID");
    }

    // Check if the project exists
    const project = await Project.findById(projectId).exec();

    if (!project) {
        throw new Error("Project not found");
    }

    // Check if the recruitment is still open
    if (project.recruitmentStatus !== "open") {
        throw new Error("Recruitment for this project is closed.");
    }

    // Check if team is already full
    if (project.teamMembers.length >= project.teamSize) {
        throw new Error("This project has reached its maximum team capacity.");
    }

    // Check if the user is the owner of the project
    if (project.owner.toString() === userId.toString()) {
        throw new Error("Project owner cannot apply to their own project");
    }

    // Check if the user is already a member
    const isMember = project.teamMembers.some(
        member => member.toString() === userId.toString()
    );

    if (isMember) {
        throw new Error("You are already a team member of this project.");
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

    const savedApplication = await newApplication.save();
    return await savedApplication.populate([
        { path: "applicant", select: "name email" },
        { path: "project", select: "title" }
    ]);
};

// Get all applications for a specific project
const getApplications = async (projectId) => {
    if (!isValidObjectId(projectId)) {
        throw new Error("Invalid project ID");
    }

    // Check if the project exists
    const project = await Project.findById(projectId).exec();

    if (!project) {
        throw new Error("Project not found");
    }

    // Get all applications for the project
    const applications = await Application.find({ project: projectId })
        .populate("applicant", "name email bio skills education")
        .sort({ createdAt: -1 })
        .exec();

    return applications;
};

// Update the status of an application (accept or reject)
const updateApplicationStatus = async (applicationId, status) => {
    if (!isValidObjectId(applicationId)) {
        throw new Error("Invalid application ID");
    }

    // Check if the application exists
    const application = await Application.findById(applicationId).exec();

    if (!application) {
        throw new Error("Application not found");
    }

    // Check if the application has already been processed
    if (application.status !== "pending") {
        throw new Error("Application has already been processed.");
    }

    // If the application is accepted, add the applicant to the project's team
    if (status === "accepted") {
        const project = await Project.findById(application.project).exec();

        if (!project) {
            throw new Error("Project not found");
        }

        const alreadyMember = project.teamMembers.some(
            member => member.toString() === application.applicant.toString()
        );

        if (alreadyMember) {
            throw new Error("Applicant is already a team member of this project.");
        }

        if (project.teamMembers.length >= project.teamSize) {
            throw new Error("Project team is already at maximum capacity.");
        }

        project.teamMembers.push(application.applicant);

        // Auto close recruitment if team reaches full capacity
        if (project.teamMembers.length >= project.teamSize) {
            project.recruitmentStatus = "closed";
        }

        await project.save();
    }

    application.status = status;
    const savedApplication = await application.save();

    return await savedApplication.populate([
        { path: "applicant", select: "name email" },
        { path: "project", select: "title" }
    ]);
};

export { applyToProject, getApplications, updateApplicationStatus };