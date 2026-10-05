import api from "./api";

const createTask = async (projectId, taskData) => {
    const response = await api.post(
        `/tasks/${projectId}`,
        taskData
    );

    return response.data;
};

const getTasks = async (projectId) => {
    const response = await api.get(
        `/tasks/${projectId}`
    );

    return response.data;
};

const getKanban = async (projectId) => {
    const response = await api.get(
        `/tasks/${projectId}/kanban`
    );

    return response.data;
};

const updateTask = async (
    projectId,
    taskId,
    taskData
) => {
    const response = await api.patch(
        `/tasks/${projectId}/${taskId}`,
        taskData
    );

    return response.data;
};

const deleteTask = async (
    projectId,
    taskId
) => {
    const response = await api.delete(
        `/tasks/${projectId}/${taskId}`
    );

    return response.data;
};

export {
    createTask,
    getTasks,
    getKanban,
    updateTask,
    deleteTask
};