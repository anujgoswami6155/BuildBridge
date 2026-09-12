import {
    registerUser,
    loginUser,
    getCurrentUser,
    updateUserProfile,
    getPublicProfile
} from "../services/auth.services.js";


const registerController = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const result = await registerUser(name, email, password);

        res.status(201).json({
            message: result
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


const loginController = async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await loginUser(email, password);

        res.status(200).json({
            message: "Login successful",
            token: token
        });

    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
};


const meController = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await getCurrentUser(userId);

        res.status(200).json({
            message: "Authenticated user",
            user: user
        });

    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};


const updateProfileController = async (req, res) => {
    const userId = req.userId;
    const { name, bio, skills, education, github, linkedIn } = req.body;

    try {
        const user = await updateUserProfile(
            userId,
            {
                name,
                bio,
                skills,
                education,
                github,
                linkedIn
            }
        );

        res.status(200).json({
            message: "Profile updated successfully",
            user: user
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const getPublicProfileController = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await getPublicProfile(userId);

        res.status(200).json({
            message: "Public profile retrieved successfully",
            user: user
        });

    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

export {
    loginController,
    registerController,
    meController,
    updateProfileController,
    getPublicProfileController
};