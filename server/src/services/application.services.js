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

const getApplications = async (projectId) => {
    // Check if the project exists
    const project = await Project.findById(projectId).exec();

    if (!project) {
        throw new Error("Project not found");
    }

    // Get all applications for the project
    const applications = await Application.find({ project: projectId })
    .populate("applicant", "name email")
    .exec();

    return applications;
};

const updateApplicationStatus = async (applicationId, status) => {
    // Check if the application exists
    const application = await Application.findById(applicationId).exec();

    if (!application) {
        throw new Error("Application not found");
    }

    // Check if the application has already been processed
    if (application.status !== "pending") {
        throw new Error("Application has already been processed.");
    }

    application.status = status;

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

        project.teamMembers.push(application.applicant);

        await project.save();
    }

    return await application.save();
};

export { applyToProject, getApplications, updateApplicationStatus };