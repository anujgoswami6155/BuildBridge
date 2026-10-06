import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createProject } from "../../services/project.service";
import { 
    ArrowLeft, 
    Plus, 
    X, 
    Trash2, 
    AlertCircle, 
    Sparkles 
} from "lucide-react";
import "./CreateProject.css";

function CreateProject() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        requiredSkills: [],
        techStack: [],
        teamSize: 2,
        recruitmentStatus: "open",
        resources: []
    });

    const [skillInput, setSkillInput] = useState("");
    const [techInput, setTechInput] = useState("");

    const [resource, setResource] = useState({
        title: "",
        url: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({
            ...previous,
            [name]: name === "teamSize" ? Number(value) : value
        }));
    };

    const addSkill = () => {
        const skill = skillInput.trim();
        if (!skill) return;

        if (formData.requiredSkills.includes(skill)) {
            setSkillInput("");
            return;
        }

        setFormData((previous) => ({
            ...previous,
            requiredSkills: [...previous.requiredSkills, skill]
        }));
        setSkillInput("");
    };

    const removeSkill = (skillToRemove) => {
        setFormData((previous) => ({
            ...previous,
            requiredSkills: previous.requiredSkills.filter(
                (skill) => skill !== skillToRemove
            )
        }));
    };

    const addTechnology = () => {
        const technology = techInput.trim();
        if (!technology) return;

        if (formData.techStack.includes(technology)) {
            setTechInput("");
            return;
        }

        setFormData((previous) => ({
            ...previous,
            techStack: [...previous.techStack, technology]
        }));
        setTechInput("");
    };

    const removeTechnology = (techToRemove) => {
        setFormData((previous) => ({
            ...previous,
            techStack: previous.techStack.filter(
                (tech) => tech !== techToRemove
            )
        }));
    };

    const handleResourceChange = (event) => {
        const { name, value } = event.target;
        setResource((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const addResource = () => {
        const title = resource.title.trim();
        const url = resource.url.trim();
        if (!title || !url) return;

        setFormData((previous) => ({
            ...previous,
            resources: [...previous.resources, { title, url }]
        }));
        setResource({ title: "", url: "" });
    };

    const removeResource = (indexToRemove) => {
        setFormData((previous) => ({
            ...previous,
            resources: previous.resources.filter(
                (_, index) => index !== indexToRemove
            )
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await createProject(formData);
            const projectId = data.project?._id;
            if (projectId) {
                navigate(`/projects/${projectId}`);
            } else {
                navigate("/projects");
            }
        } catch (err) {
            console.error("Failed to create project:", err);
            setError(
                err.response?.data?.message ||
                "Failed to create project. Please verify inputs."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="project-form-page">
            <Link to="/projects" className="back-to-projects">
                <ArrowLeft size={16} />
                <span>Back to Projects</span>
            </Link>

            <div className="form-header-section">
                <p className="form-eyebrow">PROJECT BUILDER</p>
                <h1>Launch a new project</h1>
                <p>
                    Define your project scope, target competencies, and stack to recruit the right collaborators.
                </p>
            </div>

            {error && (
                <div className="auth-error" style={{ marginBottom: "24px" }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="project-card-form">
                {/* Basic Info */}
                <div className="form-section-card">
                    <div className="form-section-heading">
                        <h2>1. Project Overview</h2>
                        <p>Essential details to introduce your idea to prospective teammates.</p>
                    </div>

                    <div className="field-group">
                        <label htmlFor="title">Project Title</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Realtime Code Collaboration Suite"
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="description">Description & Goals</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe what you are building, the problem it solves, and current progress..."
                            rows={4}
                            required
                        />
                    </div>

                    <div className="field-grid-2">
                        <div className="field-group">
                            <label htmlFor="category">Category</label>
                            <input
                                id="category"
                                name="category"
                                type="text"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="e.g. Web Development, AI, Mobile"
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="teamSize">Target Team Size</label>
                            <input
                                id="teamSize"
                                name="teamSize"
                                type="number"
                                min="1"
                                max="50"
                                value={formData.teamSize}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className="form-section-card">
                    <div className="form-section-heading">
                        <h2>2. Desired Skills</h2>
                        <p>Key developer specialties needed for this project.</p>
                    </div>

                    <div className="tag-entry-row">
                        <input
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addSkill();
                                }
                            }}
                            placeholder="e.g. TypeScript, UI/UX, GraphQL (press Enter)"
                        />
                        <button type="button" onClick={addSkill} className="btn-tag-add">
                            <Plus size={14} />
                            <span>Add</span>
                        </button>
                    </div>

                    <div className="tags-display-container">
                        {formData.requiredSkills.map((skill) => (
                            <span key={skill} className="removable-tag">
                                {skill}
                                <button type="button" onClick={() => removeSkill(skill)}>
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Tech Stack */}
                <div className="form-section-card">
                    <div className="form-section-heading">
                        <h2>3. Technology Stack</h2>
                        <p>Frameworks, databases, and libraries powering this project.</p>
                    </div>

                    <div className="tag-entry-row">
                        <input
                            type="text"
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addTechnology();
                                }
                            }}
                            placeholder="e.g. React, Node.js, PostgreSQL (press Enter)"
                        />
                        <button type="button" onClick={addTechnology} className="btn-tag-add">
                            <Plus size={14} />
                            <span>Add</span>
                        </button>
                    </div>

                    <div className="tags-display-container">
                        {formData.techStack.map((tech) => (
                            <span key={tech} className="removable-tag">
                                {tech}
                                <button type="button" onClick={() => removeTechnology(tech)}>
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Recruitment Status */}
                <div className="form-section-card">
                    <div className="form-section-heading">
                        <h2>4. Recruitment Preferences</h2>
                        <p>Control whether developers can currently submit applications to join.</p>
                    </div>

                    <div className="field-group">
                        <label htmlFor="recruitmentStatus">Recruitment Status</label>
                        <select
                            id="recruitmentStatus"
                            name="recruitmentStatus"
                            value={formData.recruitmentStatus}
                            onChange={handleChange}
                        >
                            <option value="open">Open — Actively accepting applications</option>
                            <option value="closed">Closed — Team is currently full</option>
                        </select>
                    </div>
                </div>

                {/* Resources */}
                <div className="form-section-card">
                    <div className="form-section-heading">
                        <h2>5. Resources & Documentation</h2>
                        <p>Link GitHub repos, Figma prototypes, architecture docs, or specs.</p>
                    </div>

                    <div className="resource-input-grid">
                        <input
                            name="title"
                            type="text"
                            value={resource.title}
                            onChange={handleResourceChange}
                            placeholder="Resource label (e.g. GitHub Repository)"
                        />
                        <input
                            name="url"
                            type="url"
                            value={resource.url}
                            onChange={handleResourceChange}
                            placeholder="https://github.com/..."
                        />
                        <button type="button" onClick={addResource} className="btn-tag-add">
                            <Plus size={14} />
                            <span>Add Link</span>
                        </button>
                    </div>

                    {formData.resources.length > 0 && (
                        <div className="added-resources-list">
                            {formData.resources.map((item, index) => (
                                <div className="added-resource-row" key={`${item.title}-${index}`}>
                                    <div className="added-resource-info">
                                        <strong>{item.title}</strong>
                                        <span>{item.url}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeResource(index)}
                                        className="btn-remove-resource"
                                        title="Remove resource"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Form Action Buttons */}
                <div className="form-action-bar">
                    <button
                        type="button"
                        className="btn-form-cancel"
                        onClick={() => navigate("/projects")}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="btn-form-submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                <span>Publishing Project...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles size={16} />
                                <span>Publish Project</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateProject;