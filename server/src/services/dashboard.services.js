import User from "../models/User.models.js";
import Project from "../models/Project.models.js";
import Task from "../models/Task.models.js";
import Comment from "../models/Comment.models.js";


export const getDashboard = async (userId) => {

    // Check if the user exists
    const user = await User.findById(userId)
        .select("name bio skills education github linkedIn createdAt")
        .exec();

    if (user === null) {
        throw new Error("User not found");
    }


    // Find projects owned by the user
    const ownedProjects = await Project.find({
        owner: userId
    })
        .select("title description category recruitmentStatus teamSize teamMembers createdAt updatedAt")
        .exec();


    // Find projects where the user is a team member
    const memberProjects = await Project.find({
        teamMembers: userId
    })
        .select("title description category recruitmentStatus teamSize teamMembers createdAt updatedAt")
        .exec();


    // Find tasks assigned to the user
    const tasks = await Task.find({
        assignedTo: userId
    })
        .select("title description project status assignedTo createdAt updatedAt")
        .populate("project", "title")
        .exec();


    // Find recent comments made by the user
    const recentActivity = await Comment.find({
        author: userId
    })
        .select("content project author createdAt")
        .populate("project", "title")
        .sort({ createdAt: -1 })
        .limit(10)
        .exec();


    return {
        user: user,
        projects: {
            owned: ownedProjects,
            memberOf: memberProjects
        },
        tasks: tasks,
        recentActivity: recentActivity
    };
};