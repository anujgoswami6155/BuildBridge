import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getProject,
    updateProject
} from "../../services/project.service";

import "./EditProject.css";

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
                    recruitmentStatus:
                        data.recruitmentStatus || "open",
                    resources: data.resources || []
                });
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

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]:
                name === "teamSize"
                    ? Number(value)
                    : value
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
            requiredSkills: [
                ...previous.requiredSkills,
                skill
            ]
        }));

        setSkillInput("");
    };

    const removeSkill = (skillToRemove) => {
        setFormData((previous) => ({
            ...previous,
            requiredSkills:
                previous.requiredSkills.filter(
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
            techStack: [
                ...previous.techStack,
                technology
            ]
        }));

        setTechInput("");
    };

    const removeTechnology = (technologyToRemove) => {
        setFormData((previous) => ({
            ...previous,
            techStack:
                previous.techStack.filter(
                    (technology) =>
                        technology !== technologyToRemove
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
            resources: [
                ...previous.resources,
                {
                    title,
                    url
                }
            ]
        }));

        setResource({
            title: "",
            url: ""
        });
    };

    const removeResource = (indexToRemove) => {
        setFormData((previous) => ({
            ...previous,
            resources:
                previous.resources.filter(
                    (_, index) =>
                        index !== indexToRemove
                )
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSaving(true);

        try {
            await updateProject(
                projectId,
                formData
            );

            navigate(`/projects/${projectId}`);
        } catch (error) {
            console.error(
                "Failed to update project:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to update project."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="edit-project-state">
                <p>Loading project...</p>
            </div>
        );
    }

    if (error && !formData.title) {
        return (
            <div className="edit-project-state edit-project-error">
                <p>{error}</p>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/projects/${projectId}`
                        )
                    }
                >
                    Back to Project
                </button>
            </div>
        );
    }

    return (
        <div className="edit-project-page">

            <div className="edit-project-header">
                <p className="edit-project-label">
                    EDIT PROJECT
                </p>

                <h1>Update your project</h1>

                <p>
                    Keep your project information accurate so
                    collaborators know what you're building.
                </p>
            </div>

            {error && (
                <div className="edit-project-error">
                    {error}
                </div>
            )}

            <form
                className="edit-project-form"
                onSubmit={handleSubmit}
            >

                {/* Basic Information */}

                <section className="edit-project-card">

                    <div className="edit-section-heading">
                        <h2>Basic Information</h2>
                        <p>
                            Update the core details of your project.
                        </p>
                    </div>

                    <div className="form-field">
                        <label htmlFor="title">
                            Project Title
                        </label>

                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="description">
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="5"
                            required
                        />
                    </div>

                    <div className="form-row">

                        <div className="form-field">
                            <label htmlFor="category">
                                Category
                            </label>

                            <input
                                id="category"
                                name="category"
                                type="text"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="teamSize">
                                Team Size
                            </label>

                            <input
                                id="teamSize"
                                name="teamSize"
                                type="number"
                                min="1"
                                value={formData.teamSize}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>

                </section>

                {/* Required Skills */}

                <section className="edit-project-card">

                    <div className="edit-section-heading">
                        <h2>Required Skills</h2>
                        <p>
                            Update the skills you're looking for.
                        </p>
                    </div>

                    <div className="tag-input-row">
                        <input
                            type="text"
                            value={skillInput}
                            onChange={(event) =>
                                setSkillInput(event.target.value)
                            }
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    addSkill();
                                }
                            }}
                            placeholder="e.g. React"
                        />

                        <button
                            type="button"
                            onClick={addSkill}
                        >
                            Add
                        </button>
                    </div>

                    <div className="tag-list">
                        {formData.requiredSkills.map(
                            (skill) => (
                                <span key={skill}>
                                    {skill}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeSkill(
                                                skill
                                            )
                                        }
                                    >
                                        ×
                                    </button>
                                </span>
                            )
                        )}
                    </div>

                </section>

                {/* Tech Stack */}

                <section className="edit-project-card">

                    <div className="edit-section-heading">
                        <h2>Tech Stack</h2>
                        <p>
                            Update the technologies used in
                            the project.
                        </p>
                    </div>

                    <div className="tag-input-row">
                        <input
                            type="text"
                            value={techInput}
                            onChange={(event) =>
                                setTechInput(event.target.value)
                            }
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    addTechnology();
                                }
                            }}
                            placeholder="e.g. MongoDB"
                        />

                        <button
                            type="button"
                            onClick={addTechnology}
                        >
                            Add
                        </button>
                    </div>

                    <div className="tag-list">
                        {formData.techStack.map(
                            (technology) => (
                                <span key={technology}>
                                    {technology}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeTechnology(
                                                technology
                                            )
                                        }
                                    >
                                        ×
                                    </button>
                                </span>
                            )
                        )}
                    </div>

                </section>

                {/* Recruitment */}

                <section className="edit-project-card">

                    <div className="edit-section-heading">
                        <h2>Recruitment</h2>
                        <p>
                            Control whether new members can
                            apply to join.
                        </p>
                    </div>

                    <div className="form-field">
                        <label htmlFor="recruitmentStatus">
                            Recruitment Status
                        </label>

                        <select
                            id="recruitmentStatus"
                            name="recruitmentStatus"
                            value={
                                formData.recruitmentStatus
                            }
                            onChange={handleChange}
                        >
                            <option value="open">
                                Open — Accepting applications
                            </option>

                            <option value="closed">
                                Closed — Not accepting
                                applications
                            </option>
                        </select>
                    </div>

                </section>

                {/* Resources */}

                <section className="edit-project-card">

                    <div className="edit-section-heading">
                        <h2>Resources</h2>
                        <p>
                            Update useful project links.
                        </p>
                    </div>

                    <div className="resource-input-grid">

                        <input
                            name="title"
                            type="text"
                            value={resource.title}
                            onChange={handleResourceChange}
                            placeholder="Resource title"
                        />

                        <input
                            name="url"
                            type="url"
                            value={resource.url}
                            onChange={handleResourceChange}
                            placeholder="https://..."
                        />

                        <button
                            type="button"
                            onClick={addResource}
                        >
                            Add Resource
                        </button>

                    </div>

                    {formData.resources.length > 0 && (
                        <div className="resource-list">

                            {formData.resources.map(
                                (item, index) => (
                                    <div
                                        className="resource-item"
                                        key={
                                            item._id ||
                                            `${item.title}-${index}`
                                        }
                                    >
                                        <div>
                                            <strong>
                                                {item.title}
                                            </strong>

                                            <span>
                                                {item.url}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeResource(
                                                    index
                                                )
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )
                            )}

                        </div>
                    )}

                </section>

                {/* Actions */}

                <div className="edit-project-actions">

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() =>
                            navigate(
                                `/projects/${projectId}`
                            )
                        }
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="submit-project-button"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving Changes..."
                            : "Save Changes"}
                    </button>

                </div>

            </form>
        </div>
    );
}

export default EditProject;