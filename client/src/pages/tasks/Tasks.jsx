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
import { 
    ArrowLeft, 
    Plus, 
    Edit3, 
    Trash2, 
    User, 
    CheckCircle2, 
    AlertCircle, 
    X,
    Save,
    ArrowRight,
    Check,
    Lock
} from "lucide-react";
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
        assignedTo: ""
    });

    // Quick status transition loading state
    const [statusLoadingId, setStatusLoadingId] = useState("");

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
                setKanban(kanbanData.kanban || { todo: [], inProgress: [], completed: [] });
            } catch (err) {
                console.error("Failed to fetch task data:", err);
                setError(
                    err.response?.data?.message ||
                    "Failed to load workspace tasks. Please refresh and try again."
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
        String(project.owner._id || project.owner) === String(user._id);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
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

            // New tasks always start in To Do without prompting for options
            await createTask(projectId, {
                title: formData.title.trim(),
                description: formData.description.trim(),
                assignedTo: formData.assignedTo || null
            });

            const updatedKanban = await getKanban(projectId);
            setKanban(updatedKanban.kanban);

            setFormData({
                title: "",
                description: "",
                assignedTo: ""
            });

            setCreateSuccess("Task created in To Do.");
            setShowCreateForm(false);
        } catch (err) {
            setCreateError(
                err.response?.data?.message || "Failed to create task."
            );
        } finally {
            setCreateLoading(false);
        }
    };

    const handleQuickStatusChange = async (task, nextStatus) => {
        // Enforce transition rules
        if (task.status === "completed") {
            setError("Completed tasks are final and cannot change status.");
            return;
        }

        if (task.status === "in-progress" && nextStatus === "todo") {
            setError("Tasks in progress cannot be moved back to To Do.");
            return;
        }

        try {
            setStatusLoadingId(task._id);
            setError("");
            setCreateSuccess("");

            await updateTask(projectId, task._id, { status: nextStatus });
            const updatedKanban = await getKanban(projectId);
            setKanban(updatedKanban.kanban);
            setCreateSuccess(`Task moved to ${nextStatus === "in-progress" ? "In Progress" : "Completed"}.`);
        } catch (err) {
            console.error("Failed to update status:", err);
            setError(err.response?.data?.message || "Failed to update task status.");
        } finally {
            setStatusLoadingId("");
        }
    };

    const startEditingTask = (task) => {
        setEditingTaskId(task._id);
        setEditFormData({
            title: task.title || "",
            description: task.description || "",
            assignedTo: task.assignedTo?._id || task.assignedTo || "",
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
        setEditFormData((prev) => ({
            ...prev,
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

        // Rule: In-progress cannot move back to todo
        if (task.status === "in-progress" && editFormData.status === "todo") {
            setEditError("Tasks in progress cannot be moved back to To Do.");
            return;
        }

        // Rule: Completed tasks cannot change status
        if (task.status === "completed" && editFormData.status !== "completed") {
            setEditError("Completed tasks are final and cannot change status.");
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

            await updateTask(projectId, task._id, updateData);
            const updatedKanban = await getKanban(projectId);
            setKanban(updatedKanban.kanban);

            setCreateSuccess("Task updated successfully.");
            cancelEditingTask();
        } catch (err) {
            setEditError(
                err.response?.data?.message || "Failed to update task."
            );
        } finally {
            setEditLoading(false);
        }
    };

    const handleDeleteTask = async (task) => {
        const confirmed = window.confirm(`Delete task "${task.title}"?`);
        if (!confirmed) return;

        try {
            setDeleteLoading(task._id);
            setDeleteError("");
            setCreateSuccess("");

            await deleteTask(projectId, task._id);
            const updatedKanban = await getKanban(projectId);
            setKanban(updatedKanban.kanban);

            setCreateSuccess("Task deleted successfully.");
        } catch (err) {
            setDeleteError(
                err.response?.data?.message || "Failed to delete task."
            );
        } finally {
            setDeleteLoading("");
        }
    };

    if (loading) {
        return (
            <div className="page-loader">
                <div
                    className="spinner spinner-primary"
                    style={{ width: "32px", height: "32px", borderWidth: "3px" }}
                ></div>
                <p>Loading project workspace...</p>
            </div>
        );
    }

    if (error && !project) {
        return (
            <div className="tasks-page">
                <Link to="/projects" className="back-to-projects">
                    <ArrowLeft size={16} />
                    <span>Back to Projects</span>
                </Link>

                <div className="auth-error" style={{ maxWidth: "600px", margin: "40px auto" }}>
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    const kanbanColumns = [
        {
            id: "todo",
            title: "To Do",
            badgeClass: "badge-todo",
            tasks: kanban.todo || []
        },
        {
            id: "inProgress",
            title: "In Progress",
            badgeClass: "badge-in-progress",
            tasks: kanban.inProgress || []
        },
        {
            id: "completed",
            title: "Completed",
            badgeClass: "badge-completed",
            tasks: kanban.completed || []
        }
    ];

    return (
        <div className="tasks-page">
            {/* Top Navigation Back Link */}
            <div style={{ marginBottom: "20px" }}>
                <Link to={`/projects/${projectId}`} className="back-to-projects">
                    <ArrowLeft size={16} />
                    <span>Back to Project Details</span>
                </Link>
            </div>

            {/* Header */}
            <div className="tasks-header-row">
                <div>
                    <p className="tasks-eyebrow">PROJECT WORKSPACE</p>
                    <h1>{project?.title} — Tasks</h1>
                    <p>Track sprints, manage backlog items, and ship deliverables together.</p>
                </div>

                {isOwner && (
                    <button
                        className="btn-create-task-toggle"
                        onClick={() => {
                            setShowCreateForm((prev) => !prev);
                            setCreateError("");
                            setCreateSuccess("");
                        }}
                    >
                        {showCreateForm ? (
                            <>
                                <X size={16} />
                                <span>Close Form</span>
                            </>
                        ) : (
                            <>
                                <Plus size={16} />
                                <span>Assign New Task</span>
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Feedback Notifications */}
            {createSuccess && (
                <div className="auth-success" style={{ marginBottom: "20px" }}>
                    <CheckCircle2 size={16} />
                    <span>{createSuccess}</span>
                </div>
            )}

            {(error || deleteError) && (
                <div className="auth-error" style={{ marginBottom: "20px" }}>
                    <AlertCircle size={16} />
                    <span>{error || deleteError}</span>
                </div>
            )}

            {/* Create Task Panel (Owner only) */}
            {isOwner && showCreateForm && (
                <div className="create-task-panel">
                    <h2 className="panel-title">Assign New Task (Starts in To Do)</h2>

                    {createError && (
                        <div className="auth-error" style={{ marginBottom: "16px" }}>
                            <AlertCircle size={16} />
                            <span>{createError}</span>
                        </div>
                    )}

                    <form onSubmit={handleCreateTask} className="task-form-grid">
                        <div className="field-group">
                            <label htmlFor="title">Task Title</label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Implement user authentication middleware"
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="description">Task Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Outline requirements, acceptance criteria, or technical notes..."
                                rows={3}
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="assignedTo">Assign Teammate</label>
                            <select
                                id="assignedTo"
                                name="assignedTo"
                                value={formData.assignedTo}
                                onChange={handleChange}
                            >
                                <option value="">Unassigned</option>
                                {project?.owner && (
                                    <option value={project.owner._id || project.owner}>
                                        {project.owner.name || "Owner"} (Project Owner)
                                    </option>
                                )}
                                {project?.teamMembers?.map((member) => (
                                    <option key={member._id || member} value={member._id || member}>
                                        {member.name || "Member"} ({member.email || "Member"})
                                    </option>
                                ))}
                            </select>
                            <span style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                                New tasks will automatically start in <strong>To Do</strong>.
                            </span>
                        </div>

                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                            <button
                                type="button"
                                className="btn-form-cancel"
                                onClick={() => setShowCreateForm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-form-submit"
                                disabled={createLoading}
                            >
                                {createLoading ? (
                                    <>
                                        <span className="spinner"></span>
                                        <span>Saving Task...</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus size={15} />
                                        <span>Create in To Do</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Kanban Columns */}
            <div className="kanban-board-grid">
                {kanbanColumns.map((column) => (
                    <div className="kanban-col" key={column.id}>
                        <div className="kanban-col-header">
                            <div className="kanban-col-title-group">
                                <h2>{column.title}</h2>
                                <span className={`kanban-count-pill ${column.badgeClass}`}>
                                    {column.tasks.length}
                                </span>
                            </div>
                        </div>

                        <div className="kanban-task-list">
                            {column.tasks.length === 0 ? (
                                <div className="kanban-empty-notice">
                                    No tasks in {column.title}
                                </div>
                            ) : (
                                column.tasks.map((task) => {
                                    const isEditing = editingTaskId === task._id;

                                    return (
                                        <div className="kanban-task-card" key={task._id}>
                                            {!isEditing ? (
                                                <>
                                                    <h3 className="task-card-title">{task.title}</h3>
                                                    {task.description && (
                                                        <p className="task-card-desc">{task.description}</p>
                                                    )}

                                                    <div className="task-card-footer">
                                                        {task.assignedTo ? (
                                                            <span className="task-assignee-chip">
                                                                <User size={12} />
                                                                <span>{task.assignedTo.name || "Member"}</span>
                                                            </span>
                                                        ) : (
                                                            <span style={{ fontSize: "11px", color: "var(--text-faint)" }}>
                                                                Unassigned
                                                            </span>
                                                        )}

                                                        <div className="task-card-button-row">
                                                            {/* Quick Advance Forward Actions */}
                                                            {task.status === "todo" && (
                                                                <button
                                                                    type="button"
                                                                    className="btn-task-advance"
                                                                    onClick={() => handleQuickStatusChange(task, "in-progress")}
                                                                    disabled={statusLoadingId === task._id}
                                                                    title="Start task (Move to In Progress)"
                                                                >
                                                                    <span>Start</span>
                                                                    <ArrowRight size={11} />
                                                                </button>
                                                            )}

                                                            {task.status === "in-progress" && (
                                                                <button
                                                                    type="button"
                                                                    className="btn-task-advance success"
                                                                    onClick={() => handleQuickStatusChange(task, "completed")}
                                                                    disabled={statusLoadingId === task._id}
                                                                    title="Mark as completed (Final)"
                                                                >
                                                                    <span>Complete</span>
                                                                    <Check size={11} strokeWidth={2.5} />
                                                                </button>
                                                            )}

                                                            {task.status === "completed" && (
                                                                <span className="task-completed-badge" title="Completed — Final status">
                                                                    <CheckCircle2 size={12} />
                                                                    <span>Done</span>
                                                                </span>
                                                            )}

                                                            {/* Edit button: shown if not completed OR if owner */}
                                                            {(task.status !== "completed" || isOwner) && (
                                                                <button
                                                                    className="btn-task-action-icon"
                                                                    onClick={() => startEditingTask(task)}
                                                                    title={task.status === "completed" ? "Edit Details (Status Locked)" : "Edit Task"}
                                                                >
                                                                    {task.status === "completed" ? <Lock size={12} /> : <Edit3 size={13} />}
                                                                </button>
                                                            )}

                                                            {isOwner && (
                                                                <button
                                                                    className="btn-task-action-icon danger"
                                                                    onClick={() => handleDeleteTask(task)}
                                                                    disabled={deleteLoading === task._id}
                                                                    title="Delete Task"
                                                                >
                                                                    <Trash2 size={13} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <form
                                                    onSubmit={(e) => handleUpdateTask(e, task)}
                                                    className="task-inline-edit"
                                                >
                                                    {isOwner && (
                                                        <>
                                                            <input
                                                                type="text"
                                                                name="title"
                                                                value={editFormData.title}
                                                                onChange={handleEditChange}
                                                                placeholder="Task title"
                                                                required
                                                            />
                                                            <textarea
                                                                name="description"
                                                                value={editFormData.description}
                                                                onChange={handleEditChange}
                                                                placeholder="Description"
                                                                rows={2}
                                                            />
                                                            <select
                                                                name="assignedTo"
                                                                value={editFormData.assignedTo}
                                                                onChange={handleEditChange}
                                                            >
                                                                <option value="">Unassigned</option>
                                                                {project?.owner && (
                                                                    <option value={project.owner._id || project.owner}>
                                                                        {project.owner.name || "Owner"} (Project Owner)
                                                                    </option>
                                                                )}
                                                                {project?.teamMembers?.map((member) => (
                                                                    <option key={member._id || member} value={member._id || member}>
                                                                        {member.name || "Member"}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </>
                                                    )}

                                                    <div className="field-group" style={{ margin: "4px 0" }}>
                                                        <label htmlFor={`edit-status-${task._id}`} style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)" }}>
                                                            Status {task.status === "completed" && "(Final / Locked)"}
                                                        </label>
                                                        <select
                                                            id={`edit-status-${task._id}`}
                                                            name="status"
                                                            value={editFormData.status}
                                                            onChange={handleEditChange}
                                                            disabled={task.status === "completed"}
                                                        >
                                                            {task.status === "todo" && (
                                                                <>
                                                                    <option value="todo">To Do</option>
                                                                    <option value="in-progress">In Progress</option>
                                                                    <option value="completed">Completed</option>
                                                                </>
                                                            )}
                                                            {task.status === "in-progress" && (
                                                                <>
                                                                    <option value="in-progress">In Progress</option>
                                                                    <option value="completed">Completed</option>
                                                                </>
                                                            )}
                                                            {task.status === "completed" && (
                                                                <option value="completed">Completed (Final)</option>
                                                            )}
                                                        </select>
                                                        {task.status === "in-progress" && (
                                                            <span style={{ fontSize: "11px", color: "var(--text-faint)", marginTop: "2px" }}>
                                                                Cannot move back to To Do
                                                            </span>
                                                        )}
                                                        {task.status === "completed" && (
                                                            <span style={{ fontSize: "11px", color: "var(--text-faint)", marginTop: "2px" }}>
                                                                Completed tasks are final
                                                            </span>
                                                        )}
                                                    </div>

                                                    {editError && (
                                                        <p style={{ color: "var(--danger)", fontSize: "11px", margin: 0 }}>
                                                            {editError}
                                                        </p>
                                                    )}

                                                    <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                                                        <button
                                                            type="submit"
                                                            className="btn-submit-comment"
                                                            style={{ padding: "5px 10px", fontSize: "12px" }}
                                                            disabled={editLoading}
                                                        >
                                                            <Save size={12} />
                                                            <span>Save</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn-form-cancel"
                                                            style={{ padding: "5px 10px", fontSize: "12px" }}
                                                            onClick={cancelEditingTask}
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
    );
}

export default Tasks;