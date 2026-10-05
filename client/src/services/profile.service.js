import api from "./api";

const getProfile = async () => {
    const response = await api.get("/auth/me");
    return response.data.user;
};

const updateProfile = async (profileData) => {
    const response = await api.put(
        "/auth/profile",
        profileData
    );

    return response.data.user;
};

const getPublicProfile = async (userId) => {
    const response = await api.get(
        `/auth/profile/${userId}`
    );

    return response.data.user;
};

export {
    getProfile,
    updateProfile,
    getPublicProfile
};