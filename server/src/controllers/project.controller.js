import createProject from "../services/project.services.js";

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

export default createProjectController;