const profileMiddleware = (req, res, next) => {
    const allowedFields = [
        "name",
        "bio",
        "skills",
        "education",
        "github",
        "linkedIn"
    ];

    const providedFields = Object.keys(req.body);

    // Reject unknown fields
    for (const field of providedFields) {
        if (!allowedFields.includes(field)) {
            return res.status(400).json({
                error: `Invalid profile field: ${field}`
            });
        }
    }

    const { name, bio, skills, education, github, linkedIn } = req.body;

    // Validate name
    if (name !== undefined) {
        if (typeof name !== "string" || name.trim().length < 3 || name.trim().length > 50) {
            return res.status(400).json({
                error: "Name must be between 3 and 50 characters"
            });
        }
    }

    // Validate bio
    if (bio !== undefined) {
        if (typeof bio !== "string" || bio.trim().length > 500) {
            return res.status(400).json({
                error: "Bio must be a string with a maximum of 500 characters"
            });
        }
    }

    // Validate skills
    if (skills !== undefined) {
        if (
            !Array.isArray(skills) ||
            !skills.every(skill => typeof skill === "string")
        ) {
            return res.status(400).json({
                error: "Skills must be an array of strings"
            });
        }
    }

    // Validate education
    if (education !== undefined) {
        if (
            typeof education !== "string" ||
            education.trim().length > 200
        ) {
            return res.status(400).json({
                error: "Education must be a string with a maximum of 200 characters"
            });
        }
    }

    // Validate GitHub
    if (github !== undefined) {
        if (typeof github !== "string") {
            return res.status(400).json({
                error: "GitHub must be a string"
            });
        }
    }

    // Validate LinkedIn
    if (linkedIn !== undefined) {
        if (typeof linkedIn !== "string") {
            return res.status(400).json({
                error: "LinkedIn must be a string"
            });
        }
    }

    // Make sure at least one field is provided
    if (providedFields.length === 0) {
        return res.status(400).json({
            error: "At least one profile field is required"
        });
    }

    next();
};

export default profileMiddleware;