import {
    createProject,
    updateProject,
    getProject,
    getProjects,
    removeMember,
    leaveProject,
    getWorkspace,
    deleteProject,
    getProjectProgress
} from "../services/project.services.js";


const createProjectController = async (req, res) => {
    try {
        const userId = req.userId;

        const project = await createProject(req.body, userId);

        return res.status(201).json(project);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};


const updateProjectController = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await updateProject(projectId, req.body);

        return res.status(200).json(project);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};


const getProjectController = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await getProject(projectId);

        return res.status(200).json(project);

    } catch (error) {
        return res.status(404).json({
            message: error.message
        });
    }
};


const getProjectsController = async (req, res) => {
    try {
        const filters = req.query;

        const projects = await getProjects(filters);

        return res.status(200).json(projects);

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


const removeMemberController = async (req, res) => {
    try {
        const { projectId, userId } = req.params;

        await removeMember(projectId, userId);

        return res.status(200).json({
            message: "Team member removed successfully"
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};


const leaveProjectController = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.userId;

        await leaveProject(projectId, userId);

        return res.status(200).json({
            message: "You have left the project successfully"
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};


const getWorkspaceController = async (req, res) => {
    try {
        const { projectId } = req.params;

        const workspace = await getWorkspace(projectId);

        return res.status(200).json(workspace);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};


const getProjectProgressController = async (req, res) => {
    try {
        const { projectId } = req.params;

        const progress = await getProjectProgress(projectId);

        return res.status(200).json(progress);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};


const deleteProjectController = async (req, res) => {
    try {
        const { projectId } = req.params;

        await deleteProject(projectId);

        return res.status(200).json({
            message: "Project deleted successfully"
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};


export {
    createProjectController,
    updateProjectController,
    getProjectController,
    getProjectsController,
    removeMemberController,
    leaveProjectController,
    getWorkspaceController,
    getProjectProgressController,
    deleteProjectController
};