import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and uses Bearer scheme
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authorization header missing or invalid"
        });
    }

    // Extract JWT from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    try {
        // Verify JWT using our secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Store authenticated user's ID in the request
        req.userId = decoded.userId;

        // Allow request to continue
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

export default authMiddleware;