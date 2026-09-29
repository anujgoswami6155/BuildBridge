import api from "./api";

const registerUser = async (userData) => {
    const response = await api.post("/auth/register", userData);

    return response.data;
};


const loginUser = async (credentials) => {
    const response = await api.post("/auth/login", credentials);

    return response.data;
};


const getCurrentUser = async () => {
    const response = await api.get("/auth/me");

    return response.data;
};


const logoutUser = async () => {
    const response = await api.post("/auth/logout");

    return response.data;
};


export {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser
};