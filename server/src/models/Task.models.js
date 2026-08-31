import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    status: {
        type: String,
        enum: ["todo", "in-progress", "completed"],
        default: "todo"
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    }
},{
    timestamps: true
});

const Task = mongoose.model("Task", taskSchema);

export default Task;