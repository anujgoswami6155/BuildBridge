import Project from "../models/Project.models.js";
import { isValidObjectId } from "../utils/validators.js";

const teamMemberMiddleware = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const userId = req.userId;

        if (!isValidObjectId(projectId)) {
            return res.status(400).json({ message: "Invalid project ID" });
        }

        // Check if the user is a team member or owner of the project
        const project = await Project.findById(projectId).exec();

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        req.project = project;

        const ownerId = project.owner.toString();
        if (ownerId === userId.toString()) {
            return next();
        }

        const isTeamMember = project.teamMembers.some(
            (member) => member.toString() === userId.toString()
        );

        if (!isTeamMember) {
            return res
                .status(403)
                .json({ message: "You are not a team member of this project." });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export default teamMemberMiddleware;
