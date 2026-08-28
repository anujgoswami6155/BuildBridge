const registerMiddleware = (req, res, next) => {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email and password are required"
        });
    }

    next();
};

export default registerMiddleware;