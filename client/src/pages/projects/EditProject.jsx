import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getProject, updateProject } from "../../services/project.service";
import { 
    ArrowLeft, 
    Plus, 
    X, 
    Trash2, 
    AlertCircle, 
    Save 
} from "lucide-react";
import "./CreateProject.css";

function EditProject() {
    const { projectId } = useParams();
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

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await getProject(projectId);
                setFormData({
                    title: data.title || "",
                    description: data.description || "",
                    category: data.category || "",
                    requiredSkills: data.requiredSkills || [],
                    techStack: data.techStack || [],
                    teamSize: data.teamSize || 2,
                    recruitmentStatus: data.recruitmentStatus || "open",
                    resources: data.resources || []
                });
            } catch (err) {
                console.error("Failed to fetch project:", err);
                setError(
                    err.response?.data?.message ||
                    "Failed to load project details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

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
        setSaving(true);

        try {
            await updateProject(projectId, formData);
            navigate(`/projects/${projectId}`);
        } catch (err) {
            console.error("Failed to update project:", err);
            setError(
                err.response?.data?.message ||
                "Failed to update project."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="page-loader">
                <div className="spinner spinner-primary" style={{ width: "32px", height: "32px", borderWidth: "3px" }}></div>
                <p>Loading project settings...</p>
            </div>
        );
    }

    return (
        <div className="project-form-page">
            <Link to={`/projects/${projectId}`} className="back-to-projects">
                <ArrowLeft size={16} />
                <span>Back to Project</span>
            </Link>

            <div className="form-header-section">
                <p className="form-eyebrow">EDIT PROJECT</p>
                <h1>Update Project Details</h1>
                <p>Keep your project information accurate and up-to-date for your team and prospective applicants.</p>
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
                        <p>Core metadata and description.</p>
                    </div>

                    <div className="field-group">
                        <label htmlFor="title">Project Title</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="description">Description & Scope</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
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
                        <p>Update competencies you want in prospective collaborators.</p>
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
                            placeholder="Add a skill (press Enter)"
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
                        <p>Technologies and tools used across this repository.</p>
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
                            placeholder="Add a technology (press Enter)"
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
                        <h2>4. Recruitment Settings</h2>
                        <p>Toggle whether new applicants can submit applications.</p>
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
                        <p>Manage external repository, design, and reference links.</p>
                    </div>

                    <div className="resource-input-grid">
                        <input
                            name="title"
                            type="text"
                            value={resource.title}
                            onChange={handleResourceChange}
                            placeholder="Resource label"
                        />
                        <input
                            name="url"
                            type="url"
                            value={resource.url}
                            onChange={handleResourceChange}
                            placeholder="https://..."
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

                {/* Actions */}
                <div className="form-action-bar">
                    <button
                        type="button"
                        className="btn-form-cancel"
                        onClick={() => navigate(`/projects/${projectId}`)}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="btn-form-submit"
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <span className="spinner"></span>
                                <span>Saving Changes...</span>
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProject;