import {createProject, updateProject, getProject, getProjects, removeMember, leaveProject, getWorkspace} from "../services/project.services.js";

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

const getProjectController = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        // Get the project
        const project = await getProject(projectId);

        res.status(200).json(project);

    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

const getProjectsController = async (req, res) => {
    try {
        const filters = req.query;

        const projects = await getProjects(filters);

        res.status(200).json(projects);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const removeMemberController = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const userId = req.params.userId;

        await removeMember(projectId, userId);

        res.status(200).json({
            message: "Team member removed successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const leaveProjectController = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.userId;

        await leaveProject(projectId, userId);

        res.status(200).json({
            message: "You have left the project successfully"
        });
    } catch (error) {
        res.status(400).json({
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

export { createProjectController, updateProjectController, getProjectController, getProjectsController, removeMemberController, leaveProjectController, getWorkspaceController };