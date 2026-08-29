import Project from "../models/Project.models.js";

const ownerCheckMiddleware = async (req, res, next) => {
    const userId = req.userId;
    const projectId = req.params.projectId;

    // Check if the user is the owner of the project
    try {

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }
        
        // Check if the user is the owner of the project
        // project.owner is an ObjectId, so we need to convert it to string for comparison
        if(userId.toString() !== project.owner.toString()) {
            return res.status(403).json({
                message: "You are not the owner of this project."
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export default ownerCheckMiddleware;