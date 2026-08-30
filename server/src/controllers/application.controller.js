import { applyToProject } from "../services/application.services.js";

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

export { applyController };