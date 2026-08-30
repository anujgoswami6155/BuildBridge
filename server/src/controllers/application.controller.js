import { applyToProject, getApplications } from "../services/application.services.js";

const applyController = async (req, res) => {
    try {
        const projectId = req.body.projectId;
        const userId = req.userId; // Retrieved from authMiddleware

        // Call the applyToProject service function
        const application = await applyToProject(projectId, userId);

        res.status(201).json(application);

    } catch (error) {
        res.status(400).json({ 
            message: error.message 
        });
    }
}

const getApplicationsController = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        // Call the getApplications service function
        const applications = await getApplications(projectId);

        res.status(200).json(applications);

    } catch (error) {
        res.status(500).json({ 
            message: error.message 
        });
    }
}

export { applyController, getApplicationsController };