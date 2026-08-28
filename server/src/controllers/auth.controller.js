import { registerUser, loginUser, getCurrentUser } from "../services/auth.services.js";

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

export { loginController, registerController, meController };