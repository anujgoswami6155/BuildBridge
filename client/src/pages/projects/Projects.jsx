import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../../services/project.service";
import { 
    Search, 
    Plus, 
    Users, 
    ArrowRight, 
    FolderGit2, 
    AlertCircle, 
    X 
} from "lucide-react";
import "./Projects.css";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
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
                    "Failed to load projects. Please refresh and try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Extract unique categories
    const categories = useMemo(() => {
        const set = new Set();
        projects.forEach(p => {
            if (p.category) set.add(p.category);
        });
        return Array.from(set);
    }, [projects]);

    const filteredProjects = projects.filter((project) => {
        const searchTerm = search.toLowerCase().trim();
        const matchesSearch = 
            !searchTerm ||
            project.title.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm) ||
            project.category.toLowerCase().includes(searchTerm) ||
            project.requiredSkills.some((skill) =>
                skill.toLowerCase().includes(searchTerm)
            );

        const matchesCategory = 
            selectedCategory === "all" || 
            project.category?.toLowerCase() === selectedCategory.toLowerCase();

        const matchesStatus = 
            selectedStatus === "all" || 
            project.recruitmentStatus?.toLowerCase() === selectedStatus.toLowerCase();

        return matchesSearch && matchesCategory && matchesStatus;
    });

    if (loading) {
        return (
            <div className="page-loader">
                <div className="spinner spinner-primary" style={{ width: "32px", height: "32px", borderWidth: "3px" }}></div>
                <p>Loading projects...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="projects-page">
                <div className="auth-error" style={{ maxWidth: "600px", margin: "40px auto" }}>
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="projects-page">
            <section className="projects-header">
                <div>
                    <p className="projects-eyebrow">EXPLORE DIRECTORY</p>
                    <h1>Find your next project</h1>
                    <p>
                        Discover collaborative projects, connect with teammates, and build together.
                    </p>
                </div>

                <Link to="/projects/create" className="btn-create-project">
                    <Plus size={16} strokeWidth={2.5} />
                    <span>Create Project</span>
                </Link>
            </section>

            <section className="projects-toolbar">
                <div className="search-input-container">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search projects by title, category, or required skills..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    {search && (
                        <button 
                            type="button" 
                            onClick={() => setSearch("")}
                            style={{ 
                                position: "absolute", 
                                right: "14px", 
                                background: "none", 
                                border: "none", 
                                cursor: "pointer", 
                                color: "var(--text-muted)",
                                display: "flex",
                                alignItems: "center"
                            }}
                            title="Clear search"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Filter chips */}
                <div className="filter-chips-row">
                    <button 
                        className={`filter-chip ${selectedCategory === "all" ? "active" : ""}`}
                        onClick={() => setSelectedCategory("all")}
                    >
                        All Categories
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`filter-chip ${selectedCategory === cat ? "active" : ""}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}

                    <span style={{ color: "var(--border-light)", margin: "0 4px" }}>|</span>

                    <button
                        className={`filter-chip ${selectedStatus === "all" ? "active" : ""}`}
                        onClick={() => setSelectedStatus("all")}
                    >
                        All Status
                    </button>
                    <button
                        className={`filter-chip ${selectedStatus === "open" ? "active" : ""}`}
                        onClick={() => setSelectedStatus("open")}
                    >
                        Open Only
                    </button>
                    <button
                        className={`filter-chip ${selectedStatus === "closed" ? "active" : ""}`}
                        onClick={() => setSelectedStatus("closed")}
                    >
                        Closed
                    </button>
                </div>
            </section>

            {filteredProjects.length === 0 ? (
                <div className="projects-empty">
                    <div className="projects-empty-icon">
                        <FolderGit2 size={28} />
                    </div>
                    <h2>No matching projects found</h2>
                    <p>
                        {search || selectedCategory !== "all" || selectedStatus !== "all"
                            ? "Try adjusting your search query or filters to discover projects."
                            : "Be the first to create a project and invite developers to collaborate!"}
                    </p>
                    {(search || selectedCategory !== "all" || selectedStatus !== "all") && (
                        <button 
                            className="btn-create-project"
                            style={{ padding: "8px 16px", fontSize: "13px" }}
                            onClick={() => {
                                setSearch("");
                                setSelectedCategory("all");
                                setSelectedStatus("all");
                            }}
                        >
                            Reset Filters
                        </button>
                    )}
                </div>
            ) : (
                <section className="projects-grid">
                    {filteredProjects.map((project) => (
                        <article className="project-card" key={project._id}>
                            <div className="project-card-header">
                                <span className="project-category-badge">
                                    {project.category || "General"}
                                </span>

                                <span className={`badge-status-pill ${project.recruitmentStatus}`}>
                                    <span className="badge-status-dot"></span>
                                    {project.recruitmentStatus}
                                </span>
                            </div>

                            <h2 className="project-title">{project.title}</h2>

                            <p className="project-description">
                                {project.description}
                            </p>

                            <div className="project-skills">
                                {project.requiredSkills?.map((skill) => (
                                    <span key={skill} className="project-skill-tag">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <div className="project-footer">
                                <div className="project-team-count">
                                    <Users size={15} />
                                    <span>
                                        {project.teamMembers?.length || 0} / {project.teamSize} members
                                    </span>
                                </div>

                                <Link
                                    to={`/projects/${project._id}`}
                                    className="btn-view-project"
                                >
                                    <span>View Project</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </div>
    );
}

export default Projects;