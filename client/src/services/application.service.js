import api from "./api";

const applyToProject = async (projectId) => {
    const response = await api.post("/applications", {
        projectId
    });

    return response.data;
};

const getApplications = async (projectId) => {
    const response = await api.get(
        `/applications/${projectId}`
    );

    return response.data;
};

const updateApplicationStatus = async (
    applicationId,
    status
) => {
    const response = await api.patch(
        `/applications/${applicationId}`,
        {
            status
        }
    );

    return response.data;
};

export {
    applyToProject,
    getApplications,
    updateApplicationStatus
};