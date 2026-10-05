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

import "./ProjectDetails.css";


function ProjectDetails() {

    const { projectId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();


    const [project, setProject] = useState(null);

    const [loading, setLoading] = useState(true);

    const [applicationLoading, setApplicationLoading] =
        useState(false);

    const [applicationStatus, setApplicationStatus] =
        useState("");

    const [applicationError, setApplicationError] =
        useState("");

    const [applications, setApplications] =
        useState([]);

    const [applicationsLoading, setApplicationsLoading] =
        useState(false);

    const [applicationActionLoading, setApplicationActionLoading] =
        useState("");

    const [error, setError] = useState("");


    useEffect(() => {

        const fetchProject = async () => {

            try {

                const data = await getProject(projectId);

                setProject(data);

                /*
                 * Fetch applications only if the
                 * logged-in user is the project owner.
                 */
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


            /*
             * Refresh applications after
             * accepting/rejecting an application.
             */
            const updatedApplications =
                await getApplications(projectId);

            setApplications(updatedApplications);


            /*
             * Refresh project so that:
             * - Current member count updates
             * - Newly accepted member appears
             */
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


    if (loading) {

        return (
            <div className="project-details-state">
                <p>Loading project...</p>
            </div>
        );
    }


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
        String(project.owner._id) === String(user._id);


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
                            className={`project-details-status ${
                                project.recruitmentStatus
                            }`}
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

                            {applications.map((application) => (

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


                                        {application.status === "pending" && (

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

                            ))}

                        </div>

                    )}

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

                        {project.requiredSkills.map((skill) => (

                            <span key={skill}>
                                {skill}
                            </span>

                        ))}

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

                        {project.techStack.map((technology) => (

                            <span key={technology}>
                                {technology}
                            </span>

                        ))}

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

                        {project.teamMembers.map((member) => (

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

                        ))}

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