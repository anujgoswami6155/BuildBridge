import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getProject } from "../../services/project.service";

import "./ProjectDetails.css";

function ProjectDetails() {
    const { projectId } = useParams();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await getProject(projectId);

                setProject(data);
            } catch (error) {
                console.error(
                    "Failed to fetch project:",
                    error.response?.data || error.message
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
    }, [projectId]);

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

                <button
                    className="apply-button"
                    disabled={
                        project.recruitmentStatus !== "open"
                    }
                >
                    {project.recruitmentStatus === "open"
                        ? "Apply to Join"
                        : "Recruitment Closed"}
                </button>

            </section>

            {/* Required Skills */}
            <section className="project-details-card">
                <div className="section-heading">
                    <h2>Required Skills</h2>
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
                    <h2>Project Information</h2>
                </div>

                <div className="project-info-grid">

                    <div>
                        <span>Team Size</span>
                        <strong>
                            👥 {project.teamSize}
                        </strong>
                    </div>

                    <div>
                        <span>Current Members</span>
                        <strong>
                            👤 {project.teamMembers.length}
                        </strong>
                    </div>

                    <div>
                        <span>Category</span>
                        <strong>
                            {project.category}
                        </strong>
                    </div>

                    <div>
                        <span>Recruitment</span>
                        <strong className="capitalize">
                            {project.recruitmentStatus}
                        </strong>
                    </div>

                </div>

            </section>

            {/* Tech Stack */}
            <section className="project-details-card">

                <div className="section-heading">
                    <h2>Tech Stack</h2>
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
                    <h2>Team Members</h2>
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
                    <h2>Resources</h2>
                </div>

                {project.resources.length > 0 ? (
                    <div className="resources-list">

                        {project.resources.map((resource, index) => (
                            <a
                                key={resource._id || index}
                                href={resource.url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <span>🔗</span>

                                <div>
                                    <strong>
                                        {resource.title}
                                    </strong>

                                    <span>
                                        {resource.url}
                                    </span>
                                </div>
                            </a>
                        ))}

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