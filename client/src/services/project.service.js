import api from "./api";

const getProjects = async () => {
    const response = await api.get("/projects");
    return response.data;
};

const getProject = async (projectId) => {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
};

const createProject = async (projectData) => {
    const response = await api.post("/projects", projectData);
    return response.data;
};

const updateProject = async (projectId, projectData) => {
    const response = await api.put(
        `/projects/${projectId}`,
        projectData
    );

    return response.data;
};

const deleteProject = async (projectId) => {
    const response = await api.delete(
        `/projects/${projectId}`
    );

    return response.data;
};

export {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
};