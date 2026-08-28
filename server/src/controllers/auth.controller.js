import { registerUser, loginUser } from "../services/auth.services.js";

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
        await loginUser(email, password);

        res.status(200).json({
            message: "Login successful"
        });

    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
};

export { loginController, registerController };