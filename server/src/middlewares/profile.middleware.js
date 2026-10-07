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
            const msg = `Invalid profile field: ${field}`;
            return res.status(400).json({
                message: msg,
                error: msg
            });
        }
    }

    const { name, bio, skills, education, github, linkedIn } = req.body;

    // Validate name
    if (name !== undefined) {
        if (typeof name !== "string" || name.trim().length < 3 || name.trim().length > 50) {
            const msg = "Name must be between 3 and 50 characters";
            return res.status(400).json({
                message: msg,
                error: msg
            });
        }
    }

    // Validate bio
    if (bio !== undefined) {
        if (typeof bio !== "string" || bio.trim().length > 500) {
            const msg = "Bio must be a string with a maximum of 500 characters";
            return res.status(400).json({
                message: msg,
                error: msg
            });
        }
    }

    // Validate skills
    if (skills !== undefined) {
        if (
            !Array.isArray(skills) ||
            !skills.every(skill => typeof skill === "string")
        ) {
            const msg = "Skills must be an array of strings";
            return res.status(400).json({
                message: msg,
                error: msg
            });
        }
    }

    // Validate education
    if (education !== undefined) {
        if (
            typeof education !== "string" ||
            education.trim().length > 200
        ) {
            const msg = "Education must be a string with a maximum of 200 characters";
            return res.status(400).json({
                message: msg,
                error: msg
            });
        }
    }

    // Validate GitHub
    if (github !== undefined) {
        if (typeof github !== "string") {
            const msg = "GitHub must be a string";
            return res.status(400).json({
                message: msg,
                error: msg
            });
        }
    }

    // Validate LinkedIn
    if (linkedIn !== undefined) {
        if (typeof linkedIn !== "string") {
            const msg = "LinkedIn must be a string";
            return res.status(400).json({
                message: msg,
                error: msg
            });
        }
    }

    // Make sure at least one field is provided
    if (providedFields.length === 0) {
        const msg = "At least one profile field is required";
        return res.status(400).json({
            message: msg,
            error: msg
        });
    }

    next();
};

export default profileMiddleware;