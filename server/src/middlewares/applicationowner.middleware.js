import Project from "../models/Project.models.js";
import Application from "../models/Application.models.js";

const applicationOwnerMiddleware = async (req, res, next) => {
    const userId = req.userId;
    const applicationId = req.params.applicationId;

    try {
        const application = await Application.findById(applicationId).exec();

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        const project = await Project.findById(application.project).exec();

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (project.owner.toString() !== userId) {
            return res.status(403).json({
                message: "You are not the owner of this project"
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            message: "Error checking application ownership"
        });
    }
};

export default applicationOwnerMiddleware;