const createTaskController = async(req, res) => {
    try {
        const {projectId} = req.params;

        const task = await createTask(projectId, req.body);

        return res.status(201).json({message: "Task created successfully.", task});
    } catch (error) {
        console.error("Error creating task:", error);
        return res.status(500).json({message: "Internal server error."});
    }
};

export {createTaskController};