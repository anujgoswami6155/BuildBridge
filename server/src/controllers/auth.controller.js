import registerUser from "../services/auth.services.js";

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

export default registerController;