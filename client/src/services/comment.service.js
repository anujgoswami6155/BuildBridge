import api from "./api";

const createComment = async (projectId, content) => {
    const response = await api.post(`/comments/${projectId}`, {
        content
    });

    return response.data;
};

const getComments = async (projectId) => {
    const response = await api.get(`/comments/${projectId}`);

    return response.data;
};

const updateComment = async (commentId, content) => {
    const response = await api.patch(`/comments/${commentId}`, {
        content
    });

    return response.data;
};

const deleteComment = async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);

    return response.data;
};

export {
    createComment,
    getComments,
    updateComment,
    deleteComment
};