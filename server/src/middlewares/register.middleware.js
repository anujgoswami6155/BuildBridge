const registerMiddleware = (req, res, next) => {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email and password are required"
        });
    }

    const trimmedName = typeof name === "string" ? name.trim() : "";
    if (trimmedName.length < 3 || trimmedName.length > 50) {
        return res.status(400).json({
            message: "Name must be at least 3 characters long and not exceed 50 characters"
        });
    }

    const trimmedEmail = typeof email === "string" ? email.trim() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        return res.status(400).json({
            message: "Invalid email format"
        });
    }

    if (typeof password !== "string" || password.length < 8 || password.length > 100) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long and not exceed 100 characters"
        });
    }

    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>_\-+=~`]/.test(password)) {
        return res.status(400).json({
            message: "Password must contain at least one letter, one number, and one special character"
        });
    }

    next();
};

export default registerMiddleware;