const registerMiddleware = (req, res, next) => {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email and password are required"
        });
    }

    if(name.length < 3 || name.length > 50) {
        return res.status(400).json({
            message: "Name must be at least 3 characters long and not exceed 50 characters"
        });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            message: "Invalid email format"
        });
    }

    if(password.length < 8 || password.length > 15) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long and not exceed 15 characters"
        });
    }

    if(!/[A-Za-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return res.status(400).json({
            message: "Password must contain at least one letter, one number, and one special character"
        });
    }

    next();
};

export default registerMiddleware;