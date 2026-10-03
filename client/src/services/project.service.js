import api from "./api";

const getProjects = async () => {
    const response = await api.get("/projects");
    return response.data;
};

export {
    getProjects
};