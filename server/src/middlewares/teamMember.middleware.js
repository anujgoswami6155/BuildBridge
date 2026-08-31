import Project from "../models/Project.models.js";

const teamMemberMiddleware = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    // Check if the user is a team member of the project
    const project = await Project.findById(projectId).exec();

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const ownerId = project.owner.toString();
    if (ownerId === userId.toString()) {
      return next();
    }

    const isTeamMember = project.teamMembers.some(
      (member) => member.toString() === userId.toString(),
    );

    if (!isTeamMember) {
      res
        .status(403)
        .json({ message: "You are not a team member of this project." });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default teamMemberMiddleware;
