import {createProject, updateProject} from "../services/project.services.js";

const createProjectController = async (req, res) => {
    try {
        const userId = req.userId;

        const project = await createProject(req.body, userId);

        res.status(201).json(project);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const updateProjectController = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        // Update the project
        const project = await updateProject(projectId, req.body);

        res.status(200).json(project);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

export { createProjectController, updateProjectController };