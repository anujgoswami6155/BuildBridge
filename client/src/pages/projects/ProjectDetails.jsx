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

import "./ProjectDetails.css";

function ProjectDetails() {
    const { projectId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ================================
    // Applications
    // ================================

    const [applicationLoading, setApplicationLoading] = useState(false);
    const [applicationStatus, setApplicationStatus] = useState("");
    const [applicationError, setApplicationError] = useState("");

    const [applications, setApplications] = useState([]);
    const [applicationsLoading, setApplicationsLoading] = useState(false);
    const [applicationActionLoading, setApplicationActionLoading] =
        useState("");

    // ================================
    // Comments
    // ================================

    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);

    const [commentContent, setCommentContent] = useState("");
    const [commentError, setCommentError] = useState("");
    const [commentSuccess, setCommentSuccess] = useState("");

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentContent, setEditingCommentContent] = useState("");
    const [commentActionLoading, setCommentActionLoading] = useState("");

    // ================================
    // Fetch Project
    // ================================

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProject(projectId);

                setProject(data);

                // ================================
                // Fetch Applications
                // ================================

                const isProjectOwner =
                    user &&
                    data?.owner &&
                    String(data.owner._id) === String(user._id);

                if (isProjectOwner) {
                    setApplicationsLoading(true);

                    try {
                        const applicationData =
                            await getApplications(projectId);

                        setApplications(applicationData);
                    } catch (applicationError) {
                        console.error(
                            "Failed to fetch applications:",
                            applicationError.response?.data ||
                                applicationError.message
                        );

                        setApplicationError(
                            applicationError.response?.data?.message ||
                                "Failed to load applications."
                        );
                    } finally {
                        setApplicationsLoading(false);
                    }
                }

                // ================================
                // Fetch Comments
                // ================================

                const isTeamMember =
                    user &&
                    data?.teamMembers?.some(
                        (member) =>
                            String(member?._id || member) ===
                            String(user._id)
                    );

                if (isProjectOwner || isTeamMember) {
                    setCommentsLoading(true);

                    try {
                        const commentData = await getComments(projectId);

                        setComments(commentData.comments);
                    } catch (commentFetchError) {
                        console.error(
                            "Failed to fetch comments:",
                            commentFetchError.response?.data ||
                                commentFetchError.message
                        );

                        setCommentError(
                            commentFetchError.response?.data?.message ||
                                "Failed to load comments."
                        );
                    } finally {
                        setCommentsLoading(false);
                    }
                }
            } catch (error) {
                console.error(
                    "Failed to fetch project:",
                    error.response?.data ||
                        error.message
                );

                setError(
                    error.response?.data?.message ||
                        "Failed to load project."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId, user]);

    // ================================
    // Project Delete
    // ================================

    const handleDeleteProject = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project? This action cannot be undone."
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteProject(projectId);

            navigate("/projects");
        } catch (error) {
            console.error(
                "Failed to delete project:",
                error.response?.data ||
                    error.message
            );

            setError(
                error.response?.data?.message ||
                    "Failed to delete project."
            );
        }
    };

    // ================================
    // Apply
    // ================================

    const handleApply = async () => {
        setApplicationLoading(true);
        setApplicationError("");
        setApplicationStatus("");

        try {
            await applyToProject(projectId);

            setApplicationStatus(
                "Application submitted successfully."
            );
        } catch (error) {
            console.error(
                "Failed to apply to project:",
                error.response?.data ||
                    error.message
            );

            setApplicationError(
                error.response?.data?.message ||
                    "Failed to submit application."
            );
        } finally {
            setApplicationLoading(false);
        }
    };

    // ================================
    // Application Status
    // ================================

    const handleApplicationStatus = async (
        applicationId,
        status
    ) => {
        setApplicationActionLoading(applicationId);
        setApplicationError("");

        try {
            await updateApplicationStatus(
                applicationId,
                status
            );

            const updatedApplications =
                await getApplications(projectId);

            setApplications(updatedApplications);

            const updatedProject =
                await getProject(projectId);

            setProject(updatedProject);
        } catch (error) {
            console.error(
                "Failed to update application:",
                error.response?.data ||
                    error.message
            );

            setApplicationError(
                error.response?.data?.message ||
                    "Failed to update application."
            );
        } finally {
            setApplicationActionLoading("");
        }
    };

    // ================================
    // Create Comment
    // ================================

    const handleCreateComment = async (event) => {
        event.preventDefault();

        const trimmedContent = commentContent.trim();

        if (!trimmedContent) {
            setCommentError("Comment content is required.");
            return;
        }

        if (trimmedContent.length > 500) {
            setCommentError(
                "Comment cannot exceed 500 characters."
            );
            return;
        }

        try {
            setCommentLoading(true);
            setCommentError("");
            setCommentSuccess("");

            await createComment(
                projectId,
                trimmedContent
            );

            const updatedComments =
                await getComments(projectId);

            setComments(updatedComments.comments);

            setCommentContent("");
            setCommentSuccess(
                "Comment added successfully."
            );
        } catch (error) {
            console.error(
                "Failed to create comment:",
                error.response?.data ||
                    error.message
            );

            setCommentError(
                error.response?.data?.message ||
                    "Failed to add comment."
            );
        } finally {
            setCommentLoading(false);
        }
    };

    // ================================
    // Start Edit Comment
    // ================================

    const startEditingComment = (comment) => {
        setEditingCommentId(comment._id);
        setEditingCommentContent(comment.content);
        setCommentError("");
        setCommentSuccess("");
    };

    // ================================
    // Cancel Edit Comment
    // ================================

    const cancelEditingComment = () => {
        setEditingCommentId(null);
        setEditingCommentContent("");
    };

    // ================================
    // Update Comment
    // ================================

    const handleUpdateComment = async (
        event,
        commentId
    ) => {
        event.preventDefault();

        const trimmedContent =
            editingCommentContent.trim();

        if (!trimmedContent) {
            setCommentError(
                "Comment content is required."
            );
            return;
        }

        if (trimmedContent.length > 500) {
            setCommentError(
                "Comment cannot exceed 500 characters."
            );
            return;
        }

        try {
            setCommentActionLoading(commentId);
            setCommentError("");
            setCommentSuccess("");

            await updateComment(
                commentId,
                trimmedContent
            );

            const updatedComments =
                await getComments(projectId);

            setComments(updatedComments.comments);

            cancelEditingComment();

            setCommentSuccess(
                "Comment updated successfully."
            );
        } catch (error) {
            console.error(
                "Failed to update comment:",
                error.response?.data ||
                    error.message
            );

            setCommentError(
                error.response?.data?.message ||
                    "Failed to update comment."
            );
        } finally {
            setCommentActionLoading("");
        }
    };

    // ================================
    // Delete Comment
    // ================================

    const handleDeleteComment = async (comment) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this comment?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setCommentActionLoading(comment._id);
            setCommentError("");
            setCommentSuccess("");

            await deleteComment(comment._id);

            const updatedComments =
                await getComments(projectId);

            setComments(updatedComments.comments);

            if (editingCommentId === comment._id) {
                cancelEditingComment();
            }

            setCommentSuccess(
                "Comment deleted successfully."
            );
        } catch (error) {
            console.error(
                "Failed to delete comment:",
                error.response?.data ||
                    error.message
            );

            setCommentError(
                error.response?.data?.message ||
                    "Failed to delete comment."
            );
        } finally {
            setCommentActionLoading("");
        }
    };

    // ================================
    // Loading
    // ================================

    if (loading) {
        return (
            <div className="project-details-state">
                <p>Loading project...</p>
            </div>
        );
    }

    // ================================
    // Error
    // ================================

    if (error) {
        return (
            <div className="project-details-state project-details-error">
                <p>{error}</p>

                <Link to="/projects">
                    Back to Projects
                </Link>
            </div>
        );
    }

    const isOwner =
        user &&
        project?.owner &&
        String(project.owner._id) ===
            String(user._id);

    const isTeamMember =
        user &&
        project?.teamMembers?.some(
            (member) =>
                String(member?._id || member) ===
                String(user._id)
        );

    const canComment = isOwner || isTeamMember;

    return (
        <div className="project-details-page">

            {/* Back */}

            <Link
                to="/projects"
                className="back-to-projects"
            >
                ← Back to Projects
            </Link>

            {/* Header */}

            <section className="project-details-header">

                <div>

                    <div className="project-details-meta">

                        <span className="project-details-category">
                            {project.category}
                        </span>

                        <span
                            className={`project-details-status ${project.recruitmentStatus}`}
                        >
                            ● {project.recruitmentStatus}
                        </span>

                    </div>

                    <h1>{project.title}</h1>

                    <p>
                        {project.description}
                    </p>

                </div>

                <div className="project-details-actions">

                    <Link
                        to={`/projects/${projectId}/tasks`}
                        className="tasks-button"
                    >
                        View Tasks
                    </Link>

                    {isOwner && (
                        <Link
                            to={`/projects/${projectId}/edit`}
                            className="edit-project-button"
                        >
                            Edit Project
                        </Link>
                    )}

                    {isOwner && (
                        <button
                            className="delete-project-button"
                            onClick={handleDeleteProject}
                        >
                            Delete Project
                        </button>
                    )}

                    {isOwner ? (
                        <button
                            className="apply-button"
                            disabled
                        >
                            You own this project
                        </button>
                    ) : project.recruitmentStatus !== "open" ? (
                        <button
                            className="apply-button"
                            disabled
                        >
                            Recruitment Closed
                        </button>
                    ) : (
                        <button
                            className="apply-button"
                            onClick={handleApply}
                            disabled={applicationLoading}
                        >
                            {applicationLoading
                                ? "Applying..."
                                : "Apply to Join"}
                        </button>
                    )}

                </div>

            </section>

            {/* Application Messages */}

            {applicationStatus && (
                <div className="application-success-message">
                    {applicationStatus}
                </div>
            )}

            {applicationError && (
                <div className="application-error-message">
                    {applicationError}
                </div>
            )}

            {/* Applications */}

            {isOwner && (
                <section className="project-details-card applications-section">

                    <div className="section-heading">
                        <h2>
                            Applications
                        </h2>
                    </div>

                    {applicationsLoading ? (
                        <p className="details-muted">
                            Loading applications...
                        </p>
                    ) : applications.length === 0 ? (
                        <p className="details-muted">
                            No applications received yet.
                        </p>
                    ) : (
                        <div className="applications-list">

                            {applications.map(
                                (application) => (
                                    <div
                                        className="application-card"
                                        key={application._id}
                                    >

                                        <div className="application-info">

                                            <div className="application-avatar">
                                                {application.applicant?.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div>

                                                <strong>
                                                    {application.applicant?.name ||
                                                        "Unknown Applicant"}
                                                </strong>

                                                <span>
                                                    {application.applicant?.email ||
                                                        "No email available"}
                                                </span>

                                            </div>

                                        </div>

                                        <div className="application-actions">

                                            <span
                                                className={`application-status ${application.status}`}
                                            >
                                                {application.status}
                                            </span>

                                            {application.status ===
                                                "pending" && (
                                                <div className="application-buttons">

                                                    <button
                                                        className="accept-application-button"
                                                        onClick={() =>
                                                            handleApplicationStatus(
                                                                application._id,
                                                                "accepted"
                                                            )
                                                        }
                                                        disabled={
                                                            applicationActionLoading ===
                                                            application._id
                                                        }
                                                    >
                                                        {applicationActionLoading ===
                                                        application._id
                                                            ? "Updating..."
                                                            : "Accept"}
                                                    </button>

                                                    <button
                                                        className="reject-application-button"
                                                        onClick={() =>
                                                            handleApplicationStatus(
                                                                application._id,
                                                                "rejected"
                                                            )
                                                        }
                                                        disabled={
                                                            applicationActionLoading ===
                                                            application._id
                                                        }
                                                    >
                                                        Reject
                                                    </button>

                                                </div>
                                            )}

                                        </div>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </section>
            )}

            {/* Comments */}

            {canComment && (
                <section className="project-details-card comments-section">

                    <div className="section-heading">
                        <h2>
                            Comments
                        </h2>
                    </div>

                    {/* Add Comment */}

                    <form
                        className="comment-form"
                        onSubmit={handleCreateComment}
                    >
                        <textarea
                            value={commentContent}
                            onChange={(event) =>
                                setCommentContent(
                                    event.target.value
                                )
                            }
                            placeholder="Write a comment..."
                            maxLength={500}
                            rows={3}
                            disabled={commentLoading}
                        />

                        <div className="comment-form-footer">

                            <span className="comment-character-count">
                                {commentContent.length}/500
                            </span>

                            <button
                                type="submit"
                                className="comment-submit-button"
                                disabled={commentLoading}
                            >
                                {commentLoading
                                    ? "Posting..."
                                    : "Post Comment"}
                            </button>

                        </div>
                    </form>

                    {commentSuccess && (
                        <div className="comment-success-message">
                            {commentSuccess}
                        </div>
                    )}

                    {commentError && (
                        <div className="comment-error-message">
                            {commentError}
                        </div>
                    )}

                    {/* Comments List */}

                    <div className="comments-list">

                        {commentsLoading ? (
                            <p className="details-muted">
                                Loading comments...
                            </p>
                        ) : comments.length === 0 ? (
                            <p className="details-muted">
                                No comments yet. Start the discussion.
                            </p>
                        ) : (
                            comments.map((comment) => {

                                const isCommentAuthor =
                                    user &&
                                    comment.author &&
                                    String(
                                        comment.author._id
                                    ) ===
                                        String(user._id);

                                const isEditing =
                                    editingCommentId ===
                                    comment._id;

                                return (
                                    <div
                                        className="comment-card"
                                        key={comment._id}
                                    >

                                        <div className="comment-avatar">
                                            {comment.author?.name
                                                ?.charAt(0)
                                                .toUpperCase() || "U"}
                                        </div>

                                        <div className="comment-body">

                                            <div className="comment-header">

                                                <div>
                                                    <strong>
                                                        {comment.author?.name ||
                                                            "Unknown User"}
                                                    </strong>

                                                    <span className="comment-date">
                                                        {new Date(
                                                            comment.createdAt
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>

                                                {isCommentAuthor &&
                                                    !isEditing && (
                                                        <div className="comment-actions">

                                                            <button
                                                                className="comment-edit-button"
                                                                onClick={() =>
                                                                    startEditingComment(
                                                                        comment
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                className="comment-delete-button"
                                                                onClick={() =>
                                                                    handleDeleteComment(
                                                                        comment
                                                                    )
                                                                }
                                                                disabled={
                                                                    commentActionLoading ===
                                                                    comment._id
                                                                }
                                                            >
                                                                {commentActionLoading ===
                                                                comment._id
                                                                    ? "Deleting..."
                                                                    : "Delete"}
                                                            </button>

                                                        </div>
                                                    )}

                                            </div>

                                            {isEditing ? (
                                                <form
                                                    className="comment-edit-form"
                                                    onSubmit={(event) =>
                                                        handleUpdateComment(
                                                            event,
                                                            comment._id
                                                        )
                                                    }
                                                >

                                                    <textarea
                                                        value={
                                                            editingCommentContent
                                                        }
                                                        onChange={(event) =>
                                                            setEditingCommentContent(
                                                                event.target
                                                                    .value
                                                            )
                                                        }
                                                        maxLength={500}
                                                        rows={3}
                                                        disabled={
                                                            commentActionLoading ===
                                                            comment._id
                                                        }
                                                    />

                                                    <div className="comment-edit-actions">

                                                        <button
                                                            type="submit"
                                                            className="comment-save-button"
                                                            disabled={
                                                                commentActionLoading ===
                                                                comment._id
                                                            }
                                                        >
                                                            {commentActionLoading ===
                                                            comment._id
                                                                ? "Saving..."
                                                                : "Save"}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="comment-cancel-button"
                                                            onClick={
                                                                cancelEditingComment
                                                            }
                                                            disabled={
                                                                commentActionLoading ===
                                                                comment._id
                                                            }
                                                        >
                                                            Cancel
                                                        </button>

                                                    </div>

                                                </form>
                                            ) : (
                                                <p className="comment-content">
                                                    {comment.content}
                                                </p>
                                            )}

                                        </div>

                                    </div>
                                );
                            })
                        )}

                    </div>

                </section>
            )}

            {/* Required Skills */}

            <section className="project-details-card">

                <div className="section-heading">
                    <h2>
                        Required Skills
                    </h2>
                </div>

                {project.requiredSkills.length > 0 ? (
                    <div className="details-skills">

                        {project.requiredSkills.map(
                            (skill) => (
                                <span key={skill}>
                                    {skill}
                                </span>
                            )
                        )}

                    </div>
                ) : (
                    <p className="details-muted">
                        No specific skills listed.
                    </p>
                )}

            </section>

            {/* Project Information */}

            <section className="project-details-card">

                <div className="section-heading">
                    <h2>
                        Project Information
                    </h2>
                </div>

                <div className="project-info-grid">

                    <div>
                        <span>
                            Team Size
                        </span>

                        <strong>
                            👥 {project.teamSize}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Current Members
                        </span>

                        <strong>
                            👤 {project.teamMembers.length}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Category
                        </span>

                        <strong>
                            {project.category}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Recruitment
                        </span>

                        <strong className="capitalize">
                            {project.recruitmentStatus}
                        </strong>
                    </div>

                </div>

            </section>

            {/* Tech Stack */}

            <section className="project-details-card">

                <div className="section-heading">
                    <h2>
                        Tech Stack
                    </h2>
                </div>

                {project.techStack.length > 0 ? (
                    <div className="details-skills">

                        {project.techStack.map(
                            (technology) => (
                                <span key={technology}>
                                    {technology}
                                </span>
                            )
                        )}

                    </div>
                ) : (
                    <p className="details-muted">
                        No tech stack specified yet.
                    </p>
                )}

            </section>

            {/* Team */}

            <section className="project-details-card">

                <div className="section-heading">
                    <h2>
                        Team Members
                    </h2>
                </div>

                {project.teamMembers.length > 0 ? (
                    <div className="team-members">

                        {project.teamMembers.map(
                            (member) => (
                                <div
                                    className="team-member"
                                    key={member._id || member}
                                >

                                    <div className="member-avatar">
                                        {typeof member === "object"
                                            ? member.name
                                                ?.charAt(0)
                                                .toUpperCase()
                                            : "U"}
                                    </div>

                                    <div>

                                        <strong>
                                            {typeof member === "object"
                                                ? member.name
                                                : "Team Member"}
                                        </strong>

                                        {typeof member === "object" &&
                                            member.email && (
                                                <span>
                                                    {member.email}
                                                </span>
                                            )}

                                    </div>

                                </div>
                            )
                        )}

                    </div>
                ) : (
                    <p className="details-muted">
                        No team members yet.
                    </p>
                )}

            </section>

            {/* Resources */}

            <section className="project-details-card">

                <div className="section-heading">
                    <h2>
                        Resources
                    </h2>
                </div>

                {project.resources.length > 0 ? (
                    <div className="resources-list">

                        {project.resources.map(
                            (resource, index) => (
                                <a
                                    key={
                                        resource._id ||
                                        index
                                    }
                                    href={resource.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >

                                    <span>
                                        🔗
                                    </span>

                                    <div>

                                        <strong>
                                            {resource.title}
                                        </strong>

                                        <span>
                                            {resource.url}
                                        </span>

                                    </div>

                                </a>
                            )
                        )}

                    </div>
                ) : (
                    <p className="details-muted">
                        No resources added yet.
                    </p>
                )}

            </section>

        </div>
    );
}

export default ProjectDetails;