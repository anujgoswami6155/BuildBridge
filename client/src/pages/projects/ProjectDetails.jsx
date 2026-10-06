import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
    getProject,
    deleteProject
} from "../../services/project.service";

import {
    applyToProject,
    getApplications,
    updateApplicationStatus
} from "../../services/application.service";

import {
    createComment,
    getComments,
    updateComment,
    deleteComment
} from "../../services/comment.service";

import {
    ArrowLeft,
    KanbanSquare,
    Edit3,
    Trash2,
    Send,
    Users,
    Code2,
    Layers,
    ExternalLink,
    MessageSquare,
    Clock,
    Check,
    X,
    UserCheck,
    AlertCircle,
    CheckCircle2
} from "lucide-react";

import "./ProjectDetails.css";

function ProjectDetails() {
    const { projectId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Applications
    const [applicationLoading, setApplicationLoading] = useState(false);
    const [applicationStatus, setApplicationStatus] = useState("");
    const [applicationError, setApplicationError] = useState("");
    const [applications, setApplications] = useState([]);
    const [applicationsLoading, setApplicationsLoading] = useState(false);
    const [applicationActionLoading, setApplicationActionLoading] = useState("");

    // Comments
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentContent, setCommentContent] = useState("");
    const [commentError, setCommentError] = useState("");
    const [commentSuccess, setCommentSuccess] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentContent, setEditingCommentContent] = useState("");
    const [commentActionLoading, setCommentActionLoading] = useState("");

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProject(projectId);
                setProject(data);

                const isProjectOwner =
                    user &&
                    data?.owner &&
                    String(data.owner._id || data.owner) === String(user._id);

                if (isProjectOwner) {
                    setApplicationsLoading(true);
                    try {
                        const appData = await getApplications(projectId);
                        setApplications(appData);
                    } catch (appErr) {
                        console.error("Failed to load applications:", appErr);
                    } finally {
                        setApplicationsLoading(false);
                    }
                }

                const isTeamMember =
                    user &&
                    data?.teamMembers?.some(
                        (member) => String(member?._id || member) === String(user._id)
                    );

                if (isProjectOwner || isTeamMember) {
                    setCommentsLoading(true);
                    try {
                        const commentData = await getComments(projectId);
                        setComments(commentData.comments || []);
                    } catch (commErr) {
                        console.error("Failed to load comments:", commErr);
                    } finally {
                        setCommentsLoading(false);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch project:", err);
                setError(
                    err.response?.data?.message ||
                    "Project not found or failed to load."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId, user]);

    const handleDeleteProject = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project? This action cannot be undone."
        );
        if (!confirmed) return;

        try {
            await deleteProject(projectId);
            navigate("/projects");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete project.");
        }
    };

    const handleApply = async () => {
        setApplicationLoading(true);
        setApplicationError("");
        setApplicationStatus("");

        try {
            await applyToProject(projectId);
            setApplicationStatus("Application submitted successfully! The owner has been notified.");
        } catch (err) {
            setApplicationError(
                err.response?.data?.message || "Failed to submit application. Please try again."
            );
        } finally {
            setApplicationLoading(false);
        }
    };

    const handleApplicationStatus = async (applicationId, status) => {
        setApplicationActionLoading(applicationId);
        setApplicationError("");

        try {
            await updateApplicationStatus(applicationId, status);
            const updatedApps = await getApplications(projectId);
            setApplications(updatedApps);

            const updatedProject = await getProject(projectId);
            setProject(updatedProject);
        } catch (err) {
            setApplicationError(
                err.response?.data?.message || "Failed to update application status."
            );
        } finally {
            setApplicationActionLoading("");
        }
    };

    const handleCreateComment = async (event) => {
        event.preventDefault();
        const trimmed = commentContent.trim();
        if (!trimmed) return;

        try {
            setCommentLoading(true);
            setCommentError("");
            setCommentSuccess("");

            await createComment(projectId, trimmed);
            const updatedComments = await getComments(projectId);
            setComments(updatedComments.comments || []);
            setCommentContent("");
            setCommentSuccess("Comment posted.");
        } catch (err) {
            setCommentError(err.response?.data?.message || "Failed to post comment.");
        } finally {
            setCommentLoading(false);
        }
    };

    const handleUpdateComment = async (event, commentId) => {
        event.preventDefault();
        const trimmed = editingCommentContent.trim();
        if (!trimmed) return;

        try {
            setCommentActionLoading(commentId);
            setCommentError("");
            await updateComment(commentId, trimmed);
            const updated = await getComments(projectId);
            setComments(updated.comments || []);
            setEditingCommentId(null);
            setEditingCommentContent("");
        } catch (err) {
            setCommentError(err.response?.data?.message || "Failed to edit comment.");
        } finally {
            setCommentActionLoading("");
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;

        try {
            setCommentActionLoading(commentId);
            await deleteComment(commentId);
            const updated = await getComments(projectId);
            setComments(updated.comments || []);
            if (editingCommentId === commentId) {
                setEditingCommentId(null);
            }
        } catch (err) {
            setCommentError(err.response?.data?.message || "Failed to delete comment.");
        } finally {
            setCommentActionLoading("");
        }
    };

    if (loading) {
        return (
            <div className="page-loader">
                <div className="spinner spinner-primary" style={{ width: "32px", height: "32px", borderWidth: "3px" }}></div>
                <p>Loading project details...</p>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="project-details-page">
                <Link to="/projects" className="back-to-projects">
                    <ArrowLeft size={16} />
                    <span>Back to Projects</span>
                </Link>
                <div className="auth-error" style={{ maxWidth: "600px", margin: "40px auto" }}>
                    <AlertCircle size={18} />
                    <span>{error || "Project not found"}</span>
                </div>
            </div>
        );
    }

    const isOwner =
        user &&
        project?.owner &&
        String(project.owner._id || project.owner) === String(user._id);

    const isTeamMember =
        user &&
        project?.teamMembers?.some(
            (member) => String(member?._id || member) === String(user._id)
        );

    const canComment = isOwner || isTeamMember;

    return (
        <div className="project-details-page">
            <Link to="/projects" className="back-to-projects">
                <ArrowLeft size={16} />
                <span>Back to Projects</span>
            </Link>

            {/* Header */}
            <section className="project-details-header">
                <div className="project-details-header-main">
                    <div className="project-details-meta">
                        <span className="project-category-badge">
                            {project.category || "General"}
                        </span>
                        <span className={`badge-status-pill ${project.recruitmentStatus}`}>
                            <span className="badge-status-dot"></span>
                            {project.recruitmentStatus}
                        </span>
                    </div>

                    <h1 className="project-details-title">{project.title}</h1>
                    <p className="project-details-description">{project.description}</p>
                </div>

                <div className="project-details-actions">
                    <Link to={`/projects/${projectId}/tasks`} className="btn-tasks-action">
                        <KanbanSquare size={16} />
                        <span>Workspace & Tasks</span>
                    </Link>

                    {isOwner ? (
                        <>
                            <Link to={`/projects/${projectId}/edit`} className="btn-edit-action">
                                <Edit3 size={15} />
                                <span>Edit Project</span>
                            </Link>

                            <button onClick={handleDeleteProject} className="btn-delete-action">
                                <Trash2 size={15} />
                                <span>Delete</span>
                            </button>
                        </>
                    ) : isTeamMember ? (
                        <div className="member-pill-badge">
                            <UserCheck size={16} />
                            <span>Team Member</span>
                        </div>
                    ) : project.recruitmentStatus !== "open" ? (
                        <div className="member-pill-badge" style={{ background: "var(--bg-subtle)", borderColor: "var(--border-light)", color: "var(--text-muted)" }}>
                            <span>Recruitment Closed</span>
                        </div>
                    ) : (
                        <button
                            className="btn-apply-action"
                            onClick={handleApply}
                            disabled={applicationLoading}
                        >
                            {applicationLoading ? (
                                <>
                                    <span className="spinner" style={{ width: "16px", height: "16px" }}></span>
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={15} />
                                    <span>Apply to Join</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </section>

            {/* Notifications */}
            {applicationStatus && (
                <div className="auth-success" style={{ marginBottom: "24px" }}>
                    <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                    <span>{applicationStatus}</span>
                </div>
            )}

            {applicationError && (
                <div className="auth-error" style={{ marginBottom: "24px" }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{applicationError}</span>
                </div>
            )}

            {/* Two-Column Grid */}
            <div className="project-details-grid">
                {/* Main Column */}
                <div className="details-main-column">
                    {/* Project Overview Numbers */}
                    <div className="details-card">
                        <div className="card-title-bar">
                            <h2>
                                <Layers size={18} />
                                <span>Project Overview</span>
                            </h2>
                        </div>
                        <div className="project-overview-grid">
                            <div className="overview-stat-box">
                                <span>Category</span>
                                <strong>{project.category || "General"}</strong>
                            </div>
                            <div className="overview-stat-box">
                                <span>Target Team Size</span>
                                <strong>{project.teamSize} members</strong>
                            </div>
                            <div className="overview-stat-box">
                                <span>Active Members</span>
                                <strong>{project.teamMembers?.length || 0} joined</strong>
                            </div>
                            <div className="overview-stat-box">
                                <span>Recruitment</span>
                                <strong style={{ textTransform: "capitalize" }}>{project.recruitmentStatus}</strong>
                            </div>
                        </div>
                    </div>

                    {/* Team Members */}
                    <div className="details-card">
                        <div className="card-title-bar">
                            <h2>
                                <Users size={18} />
                                <span>Team Members ({project.teamMembers?.length || 0})</span>
                            </h2>
                        </div>

                        {project.teamMembers?.length > 0 ? (
                            <div className="team-members-grid">
                                {project.teamMembers.map((member) => (
                                    <div className="team-member-row" key={member._id || member}>
                                        <div className="team-member-avatar">
                                            {typeof member === "object" && member.name
                                                ? member.name.charAt(0).toUpperCase()
                                                : "U"}
                                        </div>
                                        <div className="team-member-info">
                                            <strong>
                                                {typeof member === "object" ? member.name : "Builder"}
                                            </strong>
                                            {typeof member === "object" && member.email && (
                                                <span>{member.email}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "14px" }}>
                                No team members joined yet.
                            </p>
                        )}
                    </div>

                    {/* Applications (Project Owner Only) */}
                    {isOwner && (
                        <div className="details-card">
                            <div className="card-title-bar">
                                <h2>
                                    <Users size={18} />
                                    <span>Applications Received ({applications.length})</span>
                                </h2>
                            </div>

                            {applicationsLoading ? (
                                <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading applications...</p>
                            ) : applications.length === 0 ? (
                                <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "14px" }}>
                                    No applications received yet.
                                </p>
                            ) : (
                                <div className="applications-list">
                                    {applications.map((app) => (
                                        <div className="application-row" key={app._id}>
                                            <div className="applicant-profile">
                                                <div className="applicant-avatar">
                                                    {app.applicant?.name?.charAt(0).toUpperCase() || "A"}
                                                </div>
                                                <div className="applicant-info">
                                                    <strong>{app.applicant?.name || "Applicant"}</strong>
                                                    <span>{app.applicant?.email || "No email"}</span>
                                                </div>
                                            </div>

                                            <div className="application-status-actions">
                                                <span className={`badge-status-pill ${app.status}`}>
                                                    <span className="badge-status-dot"></span>
                                                    {app.status}
                                                </span>

                                                {app.status === "pending" && (
                                                    <>
                                                        <button
                                                            className="btn-app-accept"
                                                            onClick={() => handleApplicationStatus(app._id, "accepted")}
                                                            disabled={applicationActionLoading === app._id}
                                                        >
                                                            <Check size={13} />
                                                            <span>Accept</span>
                                                        </button>

                                                        <button
                                                            className="btn-app-reject"
                                                            onClick={() => handleApplicationStatus(app._id, "rejected")}
                                                            disabled={applicationActionLoading === app._id}
                                                        >
                                                            <X size={13} />
                                                            <span>Reject</span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Discussion & Comments */}
                    <div className="details-card">
                        <div className="card-title-bar">
                            <h2>
                                <MessageSquare size={18} />
                                <span>Team Discussion ({comments.length})</span>
                            </h2>
                        </div>

                        {canComment ? (
                            <>
                                <form onSubmit={handleCreateComment} className="comment-input-form">
                                    <textarea
                                        value={commentContent}
                                        onChange={(e) => setCommentContent(e.target.value)}
                                        placeholder="Write an update, question, or note for the team..."
                                        maxLength={500}
                                        rows={3}
                                        disabled={commentLoading}
                                    />
                                    <div className="comment-footer-actions">
                                        <span className="char-counter">
                                            {commentContent.length}/500
                                        </span>
                                        <button
                                            type="submit"
                                            className="btn-submit-comment"
                                            disabled={commentLoading || !commentContent.trim()}
                                        >
                                            <Send size={13} />
                                            <span>Post Update</span>
                                        </button>
                                    </div>
                                </form>

                                {commentSuccess && (
                                    <div className="auth-success" style={{ marginBottom: "16px", padding: "8px 12px" }}>
                                        <CheckCircle2 size={15} />
                                        <span>{commentSuccess}</span>
                                    </div>
                                )}

                                {commentError && (
                                    <div className="auth-error" style={{ marginBottom: "16px", padding: "8px 12px" }}>
                                        <AlertCircle size={15} />
                                        <span>{commentError}</span>
                                    </div>
                                )}

                                <div className="comments-timeline">
                                    {commentsLoading ? (
                                        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading discussion...</p>
                                    ) : comments.length === 0 ? (
                                        <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "8px 0" }}>
                                            No messages yet. Start the team discussion above!
                                        </p>
                                    ) : (
                                        comments.map((comm) => {
                                            const isAuthor =
                                                user &&
                                                comm.author &&
                                                String(comm.author._id || comm.author) === String(user._id);
                                            const isEditing = editingCommentId === comm._id;

                                            return (
                                                <div className="comment-item" key={comm._id}>
                                                    <div className="comment-avatar-bubble">
                                                        {comm.author?.name ? comm.author.name.charAt(0).toUpperCase() : "U"}
                                                    </div>
                                                    <div className="comment-body-area">
                                                        <div className="comment-header-row">
                                                            <strong>{comm.author?.name || "Team Member"}</strong>
                                                            <span className="comment-timestamp">
                                                                <Clock size={11} style={{ display: "inline", verticalAlign: "middle", marginRight: "3px" }} />
                                                                {new Date(comm.createdAt).toLocaleString()}
                                                            </span>
                                                        </div>

                                                        {isEditing ? (
                                                            <form onSubmit={(e) => handleUpdateComment(e, comm._id)}>
                                                                <textarea
                                                                    value={editingCommentContent}
                                                                    onChange={(e) => setEditingCommentContent(e.target.value)}
                                                                    maxLength={500}
                                                                    rows={2}
                                                                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-light)" }}
                                                                />
                                                                <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                                                                    <button
                                                                        type="submit"
                                                                        className="btn-submit-comment"
                                                                        style={{ padding: "4px 10px", fontSize: "12px" }}
                                                                        disabled={commentActionLoading === comm._id}
                                                                    >
                                                                        Save
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn-edit-action"
                                                                        style={{ padding: "4px 10px", fontSize: "12px" }}
                                                                        onClick={() => setEditingCommentId(null)}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        ) : (
                                                            <p className="comment-message-text">{comm.content}</p>
                                                        )}

                                                        {isAuthor && !isEditing && (
                                                            <div className="comment-item-actions">
                                                                <button
                                                                    type="button"
                                                                    className="btn-text-action"
                                                                    onClick={() => {
                                                                        setEditingCommentId(comm._id);
                                                                        setEditingCommentContent(comm.content);
                                                                    }}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <span>•</span>
                                                                <button
                                                                    type="button"
                                                                    className="btn-text-action delete"
                                                                    onClick={() => handleDeleteComment(comm._id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </>
                        ) : (
                            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "14px" }}>
                                Team discussions are reserved for project collaborators. Apply to join this project to participate.
                            </p>
                        )}
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="details-sidebar-column">
                    {/* Tech Stack */}
                    <div className="details-card">
                        <div className="card-title-bar">
                            <h2>
                                <Code2 size={16} />
                                <span>Tech Stack</span>
                            </h2>
                        </div>
                        {project.techStack?.length > 0 ? (
                            <div className="tag-cloud">
                                {project.techStack.map((tech) => (
                                    <span key={tech}>{tech}</span>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>
                                No tech stack specified.
                            </p>
                        )}
                    </div>

                    {/* Required Skills */}
                    <div className="details-card">
                        <div className="card-title-bar">
                            <h2>
                                <Layers size={16} />
                                <span>Required Skills</span>
                            </h2>
                        </div>
                        {project.requiredSkills?.length > 0 ? (
                            <div className="tag-cloud">
                                {project.requiredSkills.map((skill) => (
                                    <span key={skill}>{skill}</span>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>
                                Open to all skill levels.
                            </p>
                        )}
                    </div>

                    {/* Project Resources */}
                    <div className="details-card">
                        <div className="card-title-bar">
                            <h2>
                                <ExternalLink size={16} />
                                <span>Resources & Links</span>
                            </h2>
                        </div>
                        {project.resources?.length > 0 ? (
                            <div className="resource-links-list">
                                {project.resources.map((res, index) => (
                                    <a
                                        key={res._id || index}
                                        href={res.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="resource-link-item"
                                    >
                                        <div className="resource-icon-box">
                                            <ExternalLink size={15} />
                                        </div>
                                        <div className="resource-text-content">
                                            <strong>{res.title || "External Resource"}</strong>
                                            <span>{res.url}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>
                                No resources linked yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectDetails;