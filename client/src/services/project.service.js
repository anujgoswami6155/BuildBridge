import api from "./api";

const getProjects = async () => {
    const response = await api.get("/projects");
    return response.data;
};

const getProject = async (projectId) => {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
};

export {
    getProjects,
    getProject
};