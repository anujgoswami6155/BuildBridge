import {
    applyToProject,
    getApplications,
    updateApplicationStatus
} from "../services/application.services.js";

const applyController = async (req, res) => {
    try {
        const projectId = req.body.projectId;
        const userId = req.userId;

        const application = await applyToProject(projectId, userId);

        res.status(201).json(application);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const getApplicationsController = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        const applications = await getApplications(projectId);

        res.status(200).json(applications);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateApplicationStatusController = async (req, res) => {
    try {
        const applicationId = req.params.applicationId;
        const { status } = req.body;

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Status must be accepted or rejected"
            });
        }

        const application = await updateApplicationStatus(
            applicationId,
            status
        );

        res.status(200).json(application);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

export {
    applyController,
    getApplicationsController,
    updateApplicationStatusController
};