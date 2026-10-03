import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getProjects } from "../../services/project.service";

import "./Projects.css";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (error) {
                console.error(
                    "Failed to fetch projects:",
                    error.response?.data || error.message
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load projects."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const filteredProjects = projects.filter((project) => {
        const searchTerm = search.toLowerCase();

        return (
            project.title.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm) ||
            project.category.toLowerCase().includes(searchTerm) ||
            project.requiredSkills.some((skill) =>
                skill.toLowerCase().includes(searchTerm)
            )
        );
    });

    if (loading) {
        return (
            <div className="projects-state">
                <p>Loading projects...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="projects-state projects-error">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="projects-page">
            <section className="projects-header">
                <div>
                    <p className="projects-label">PROJECTS</p>

                    <h1>Find your next project</h1>

                    <p>
                        Discover projects, find teammates, and
                        build something great together.
                    </p>
                </div>

                <Link
                    to="/projects/create"
                    className="create-project-button"
                >
                    + Create Project
                </Link>
            </section>

            <section className="projects-toolbar">
                <input
                    type="text"
                    placeholder="Search projects, skills, or categories..."
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                />
            </section>

            {filteredProjects.length === 0 ? (
                <div className="projects-empty">
                    <div className="projects-empty-icon">
                        📁
                    </div>

                    <h2>
                        {search
                            ? "No projects found"
                            : "No projects yet"}
                    </h2>

                    <p>
                        {search
                            ? "Try a different search term."
                            : "Create a project and start building with other developers."}
                    </p>
                </div>
            ) : (
                <section className="projects-grid">
                    {filteredProjects.map((project) => (
                        <article
                            className="project-card"
                            key={project._id}
                        >
                            <div className="project-card-header">
                                <span className="project-category">
                                    {project.category}
                                </span>

                                <span
                                    className={`project-status ${
                                        project.recruitmentStatus
                                    }`}
                                >
                                    ●{" "}
                                    {project.recruitmentStatus}
                                </span>
                            </div>

                            <h2>{project.title}</h2>

                            <p className="project-description">
                                {project.description}
                            </p>

                            <div className="project-skills">
                                {project.requiredSkills.map(
                                    (skill) => (
                                        <span key={skill}>
                                            {skill}
                                        </span>
                                    )
                                )}
                            </div>

                            <div className="project-meta">
                                <span>
                                    👥{" "}
                                    {project.teamMembers.length} /{" "}
                                    {project.teamSize}
                                </span>

                                <span>
                                    Team members
                                </span>
                            </div>

                            <Link
                                to={`/projects/${project._id}`}
                                className="project-link"
                            >
                                View Project →
                            </Link>
                        </article>
                    ))}
                </section>
            )}
        </div>
    );
}

export default Projects;