import { createTask } from "../services/tasks.services.js";

const createTaskController = async(req, res) => {
    try {
        const {projectId} = req.params;

        const task = await createTask(projectId, req.body);

        return res.status(201).json({message: "Task created successfully.", task});
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
};

export {createTaskController};