import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getProject } from "../../services/project.service";
import {
    createTask,
    getKanban,
    updateTask,
    deleteTask
} from "../../services/task.service";
import "./Tasks.css";

function Tasks() {
    const { projectId } = useParams();
    const { user } = useAuth();

    const [project, setProject] = useState(null);
    const [kanban, setKanban] = useState({
        todo: [],
        inProgress: [],
        completed: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Create task state
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState("");
    const [createSuccess, setCreateSuccess] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        assignedTo: "",
        status: "todo"
    });

    // Edit task state
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState("");

    const [editFormData, setEditFormData] = useState({
        title: "",
        description: "",
        assignedTo: "",
        status: "todo"
    });

    // Delete task state
    const [deleteLoading, setDeleteLoading] = useState("");
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
        const fetchTaskData = async () => {
            try {
                setLoading(true);
                setError("");

                const [projectData, kanbanData] = await Promise.all([
                    getProject(projectId),
                    getKanban(projectId)
                ]);

                setProject(projectData);
                setKanban(kanbanData.kanban);
            } catch (error) {
                console.error(
                    "Failed to fetch task data:",
                    error.response?.data || error.message
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load tasks."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTaskData();
    }, [projectId]);

    const isOwner =
        user &&
        project?.owner &&
        String(project.owner._id) === String(user._id);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleCreateTask = async (event) => {
        event.preventDefault();

        setCreateError("");
        setCreateSuccess("");

        if (!formData.title.trim()) {
            setCreateError("Task title is required.");
            return;
        }

        try {
            setCreateLoading(true);

            await createTask(projectId, {
                title: formData.title.trim(),
                description: formData.description.trim(),
                assignedTo: formData.assignedTo || null,
                status: formData.status
            });

            const updatedKanban = await getKanban(projectId);

            setKanban(updatedKanban.kanban);

            setFormData({
                title: "",
                description: "",
                assignedTo: "",
                status: "todo"
            });

            setCreateSuccess("Task created successfully.");
            setShowCreateForm(false);
        } catch (error) {
            console.error(
                "Failed to create task:",
                error.response?.data || error.message
            );

            setCreateError(
                error.response?.data?.message ||
                "Failed to create task."
            );
        } finally {
            setCreateLoading(false);
        }
    };

    const startEditingTask = (task) => {
        setEditingTaskId(task._id);

        setEditFormData({
            title: task.title || "",
            description: task.description || "",
            assignedTo:
                task.assignedTo?._id ||
                task.assignedTo ||
                "",
            status: task.status || "todo"
        });

        setEditError("");
        setCreateSuccess("");
        setDeleteError("");
    };

    const cancelEditingTask = () => {
        setEditingTaskId(null);
        setEditError("");

        setEditFormData({
            title: "",
            description: "",
            assignedTo: "",
            status: "todo"
        });
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;

        setEditFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleUpdateTask = async (event, task) => {
        event.preventDefault();

        setEditError("");
        setCreateSuccess("");

        if (isOwner && !editFormData.title.trim()) {
            setEditError("Task title is required.");
            return;
        }

        try {
            setEditLoading(true);

            let updateData;

            if (isOwner) {
                updateData = {
                    title: editFormData.title.trim(),
                    description: editFormData.description.trim(),
                    assignedTo: editFormData.assignedTo || null,
                    status: editFormData.status
                };
            } else {
                updateData = {
                    status: editFormData.status
                };
            }

            await updateTask(
                projectId,
                task._id,
                updateData
            );

            const updatedKanban = await getKanban(projectId);

            setKanban(updatedKanban.kanban);

            setCreateSuccess("Task updated successfully.");

            cancelEditingTask();
        } catch (error) {
            console.error(
                "Failed to update task:",
                error.response?.data || error.message
            );

            setEditError(
                error.response?.data?.message ||
                "Failed to update task."
            );
        } finally {
            setEditLoading(false);
        }
    };

    const handleDeleteTask = async (task) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${task.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleteLoading(task._id);
            setDeleteError("");
            setCreateSuccess("");

            await deleteTask(projectId, task._id);

            const updatedKanban = await getKanban(projectId);

            setKanban(updatedKanban.kanban);

            if (editingTaskId === task._id) {
                cancelEditingTask();
            }

            setCreateSuccess("Task deleted successfully.");
        } catch (error) {
            console.error(
                "Failed to delete task:",
                error.response?.data || error.message
            );

            setDeleteError(
                error.response?.data?.message ||
                "Failed to delete task."
            );
        } finally {
            setDeleteLoading("");
        }
    };

    if (loading) {
        return (
            <div className="tasks-state">
                <p>Loading tasks...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="tasks-state tasks-error">
                <p>{error}</p>

                <Link to={`/projects/${projectId}`}>
                    Back to Project
                </Link>
            </div>
        );
    }

    const columns = [
        {
            key: "todo",
            title: "To Do",
            tasks: kanban.todo
        },
        {
            key: "inProgress",
            title: "In Progress",
            tasks: kanban.inProgress
        },
        {
            key: "completed",
            title: "Completed",
            tasks: kanban.completed
        }
    ];

    return (
        <div className="tasks-page">
            <div className="tasks-container">

                <Link
                    to={`/projects/${projectId}`}
                    className="tasks-back-link"
                >
                    ← Back to Project
                </Link>

                <div className="tasks-header">
                    <div>
                        <p className="tasks-eyebrow">
                            PROJECT WORKSPACE
                        </p>

                        <h1>Tasks</h1>

                        <p>
                            Track project work and manage task progress.
                        </p>
                    </div>

                    {isOwner && (
                        <button
                            className="create-task-button"
                            onClick={() => {
                                setShowCreateForm((previous) => !previous);
                                setCreateError("");
                                setCreateSuccess("");
                            }}
                        >
                            {showCreateForm
                                ? "Cancel"
                                : "+ Create Task"}
                        </button>
                    )}
                </div>

                {createSuccess && (
                    <div className="task-success-message">
                        {createSuccess}
                    </div>
                )}

                {createError && !showCreateForm && (
                    <div className="task-error-message">
                        {createError}
                    </div>
                )}

                {deleteError && (
                    <div className="task-error-message">
                        {deleteError}
                    </div>
                )}

                {isOwner && showCreateForm && (
                    <div className="create-task-section">
                        <div className="create-task-header">
                            <h2>Create Task</h2>

                            <p>
                                Add a new task to this project.
                            </p>
                        </div>

                        {createError && (
                            <div className="task-error-message">
                                {createError}
                            </div>
                        )}

                        <form
                            className="create-task-form"
                            onSubmit={handleCreateTask}
                        >
                            <div className="form-group">
                                <label htmlFor="title">
                                    Title
                                </label>

                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter task title"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">
                                    Description
                                </label>

                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the task"
                                    rows="4"
                                />
                            </div>

                            <div className="form-row">

                                <div className="form-group">
                                    <label htmlFor="assignedTo">
                                        Assign To
                                    </label>

                                    <select
                                        id="assignedTo"
                                        name="assignedTo"
                                        value={formData.assignedTo}
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            Unassigned
                                        </option>

                                        {project?.teamMembers?.map(
                                            (member) => (
                                                <option
                                                    key={member._id}
                                                    value={member._id}
                                                >
                                                    {member.name}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="status">
                                        Status
                                    </label>

                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="todo">
                                            To Do
                                        </option>

                                        <option value="in-progress">
                                            In Progress
                                        </option>

                                        <option value="completed">
                                            Completed
                                        </option>
                                    </select>
                                </div>

                            </div>

                            <button
                                type="submit"
                                className="submit-task-button"
                                disabled={createLoading}
                            >
                                {createLoading
                                    ? "Creating..."
                                    : "Create Task"}
                            </button>
                        </form>
                    </div>
                )}

                <div className="kanban-board">

                    {columns.map((column) => (
                        <div
                            className="kanban-column"
                            key={column.key}
                        >
                            <div className="kanban-column-header">
                                <h2>{column.title}</h2>

                                <span>
                                    {column.tasks.length}
                                </span>
                            </div>

                            <div className="kanban-tasks">

                                {column.tasks.length === 0 ? (
                                    <div className="kanban-empty">
                                        No tasks
                                    </div>
                                ) : (
                                    column.tasks.map((task) => {

                                        const isEditing =
                                            editingTaskId === task._id;

                                        return (
                                            <div
                                                className="task-card"
                                                key={task._id}
                                            >

                                                {!isEditing ? (
                                                    <>
                                                        <div className="task-card-content">
                                                            <h3>
                                                                {task.title}
                                                            </h3>

                                                            {task.description && (
                                                                <p>
                                                                    {task.description}
                                                                </p>
                                                            )}

                                                            {task.assignedTo && (
                                                                <div className="task-assignee">
                                                                    Assigned to{" "}
                                                                    {task.assignedTo.name ||
                                                                        "Team Member"}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="task-card-actions">

                                                            <button
                                                                className="edit-task-button"
                                                                onClick={() =>
                                                                    startEditingTask(task)
                                                                }
                                                            >
                                                                Edit
                                                            </button>

                                                            {isOwner && (
                                                                <button
                                                                    className="delete-task-button"
                                                                    onClick={() =>
                                                                        handleDeleteTask(task)
                                                                    }
                                                                    disabled={
                                                                        deleteLoading ===
                                                                        task._id
                                                                    }
                                                                >
                                                                    {deleteLoading ===
                                                                    task._id
                                                                        ? "Deleting..."
                                                                        : "Delete"}
                                                                </button>
                                                            )}

                                                        </div>
                                                    </>
                                                ) : (
                                                    <form
                                                        className="edit-task-form"
                                                        onSubmit={(event) =>
                                                            handleUpdateTask(
                                                                event,
                                                                task
                                                            )
                                                        }
                                                    >

                                                        {isOwner ? (
                                                            <>
                                                                <div className="form-group">
                                                                    <label>
                                                                        Title
                                                                    </label>

                                                                    <input
                                                                        type="text"
                                                                        name="title"
                                                                        value={
                                                                            editFormData.title
                                                                        }
                                                                        onChange={
                                                                            handleEditChange
                                                                        }
                                                                        required
                                                                    />
                                                                </div>

                                                                <div className="form-group">
                                                                    <label>
                                                                        Description
                                                                    </label>

                                                                    <textarea
                                                                        name="description"
                                                                        value={
                                                                            editFormData.description
                                                                        }
                                                                        onChange={
                                                                            handleEditChange
                                                                        }
                                                                        rows="3"
                                                                    />
                                                                </div>

                                                                <div className="form-group">
                                                                    <label>
                                                                        Assign To
                                                                    </label>

                                                                    <select
                                                                        name="assignedTo"
                                                                        value={
                                                                            editFormData.assignedTo
                                                                        }
                                                                        onChange={
                                                                            handleEditChange
                                                                        }
                                                                    >
                                                                        <option value="">
                                                                            Unassigned
                                                                        </option>

                                                                        {project?.teamMembers?.map(
                                                                            (member) => (
                                                                                <option
                                                                                    key={
                                                                                        member._id
                                                                                    }
                                                                                    value={
                                                                                        member._id
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        member.name
                                                                                    }
                                                                                </option>
                                                                            )
                                                                        )}
                                                                    </select>
                                                                </div>
                                                            </>
                                                        ) : null}

                                                        <div className="form-group">
                                                            <label>
                                                                Status
                                                            </label>

                                                            <select
                                                                name="status"
                                                                value={
                                                                    editFormData.status
                                                                }
                                                                onChange={
                                                                    handleEditChange
                                                                }
                                                            >
                                                                <option value="todo">
                                                                    To Do
                                                                </option>

                                                                <option value="in-progress">
                                                                    In Progress
                                                                </option>

                                                                <option value="completed">
                                                                    Completed
                                                                </option>
                                                            </select>
                                                        </div>

                                                        {editError && (
                                                            <div className="task-error-message">
                                                                {editError}
                                                            </div>
                                                        )}

                                                        <div className="edit-task-actions">
                                                            <button
                                                                type="submit"
                                                                className="save-task-button"
                                                                disabled={
                                                                    editLoading
                                                                }
                                                            >
                                                                {editLoading
                                                                    ? "Saving..."
                                                                    : "Save"}
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="cancel-edit-button"
                                                                onClick={
                                                                    cancelEditingTask
                                                                }
                                                                disabled={
                                                                    editLoading
                                                                }
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>

                                                    </form>
                                                )}

                                            </div>
                                        );
                                    })
                                )}

                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}

export default Tasks;