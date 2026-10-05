import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createProject } from "../../services/project.service";

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
            [name]: name === "teamSize"
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
            techStack: previous.techStack.filter(
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
        } catch (error) {
            console.error(
                "Failed to create project:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to create project."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-project-page">

            <div className="create-project-header">
                <div>
                    <p className="create-project-label">
                        CREATE PROJECT
                    </p>

                    <h1>Start something great</h1>

                    <p>
                        Share your idea, define your requirements,
                        and find the right people to build it with.
                    </p>
                </div>
            </div>

            {error && (
                <div className="create-project-error">
                    {error}
                </div>
            )}

            <form
                className="create-project-form"
                onSubmit={handleSubmit}
            >

                {/* Basic Information */}

                <section className="create-project-card">
                    <div className="create-section-heading">
                        <h2>Basic Information</h2>
                        <p>
                            Tell potential collaborators what your
                            project is about.
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
                            placeholder="e.g. BuildBridge"
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
                            placeholder="Describe your project..."
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
                                placeholder="e.g. Web Development"
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

                {/* Skills */}

                <section className="create-project-card">
                    <div className="create-section-heading">
                        <h2>Required Skills</h2>
                        <p>
                            What skills are you looking for in
                            collaborators?
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
                        {formData.requiredSkills.map((skill) => (
                            <span key={skill}>
                                {skill}

                                <button
                                    type="button"
                                    onClick={() =>
                                        removeSkill(skill)
                                    }
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </section>

                {/* Tech Stack */}

                <section className="create-project-card">
                    <div className="create-section-heading">
                        <h2>Tech Stack</h2>
                        <p>
                            What technologies will this project use?
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
                        {formData.techStack.map((technology) => (
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
                        ))}
                    </div>
                </section>

                {/* Recruitment */}

                <section className="create-project-card">
                    <div className="create-section-heading">
                        <h2>Recruitment</h2>
                        <p>
                            Decide whether people can currently
                            apply to join your project.
                        </p>
                    </div>

                    <div className="form-field">
                        <label htmlFor="recruitmentStatus">
                            Recruitment Status
                        </label>

                        <select
                            id="recruitmentStatus"
                            name="recruitmentStatus"
                            value={formData.recruitmentStatus}
                            onChange={handleChange}
                        >
                            <option value="open">
                                Open — Accepting applications
                            </option>

                            <option value="closed">
                                Closed — Not accepting applications
                            </option>
                        </select>
                    </div>
                </section>

                {/* Resources */}

                <section className="create-project-card">
                    <div className="create-section-heading">
                        <h2>Resources</h2>
                        <p>
                            Add useful links such as GitHub,
                            documentation, or design files.
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
                                        key={`${item.title}-${index}`}
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

                {/* Submit */}

                <div className="create-project-actions">

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => navigate("/projects")}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="submit-project-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Project..."
                            : "Create Project"}
                    </button>

                </div>

            </form>
        </div>
    );
}

export default CreateProject;