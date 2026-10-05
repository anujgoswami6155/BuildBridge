import { useEffect, useState } from "react";
import {
    getProfile,
    updateProfile
} from "../../services/profile.service";

import "./Profile.css";

function Profile() {
    const [profile, setProfile] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        skills: [],
        education: "",
        github: "",
        linkedIn: ""
    });

    const [skillInput, setSkillInput] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const user = await getProfile();

                setProfile(user);

                setFormData({
                    name: user.name || "",
                    bio: user.bio || "",
                    skills: user.skills || [],
                    education: user.education || "",
                    github: user.github || "",
                    linkedIn: user.linkedIn || ""
                });
            } catch (error) {
                console.error(
                    "Failed to fetch profile:",
                    error.response?.data || error.message
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load profile."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleAddSkill = () => {
        const skill = skillInput.trim();

        if (!skill) {
            return;
        }

        if (formData.skills.includes(skill)) {
            setSkillInput("");
            return;
        }

        setFormData((previous) => ({
            ...previous,
            skills: [...previous.skills, skill]
        }));

        setSkillInput("");
    };

    const handleSkillKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleAddSkill();
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData((previous) => ({
            ...previous,
            skills: previous.skills.filter(
                (skill) => skill !== skillToRemove
            )
        }));
    };

    const handleSave = async (event) => {
        event.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const updatedUser = await updateProfile(formData);

            setProfile(updatedUser);

            setFormData({
                name: updatedUser.name || "",
                bio: updatedUser.bio || "",
                skills: updatedUser.skills || [],
                education: updatedUser.education || "",
                github: updatedUser.github || "",
                linkedIn: updatedUser.linkedIn || ""
            });

            setIsEditing(false);
            setSuccess("Profile updated successfully.");
        } catch (error) {
            console.error(
                "Failed to update profile:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to update profile."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: profile?.name || "",
            bio: profile?.bio || "",
            skills: profile?.skills || [],
            education: profile?.education || "",
            github: profile?.github || "",
            linkedIn: profile?.linkedIn || ""
        });

        setError("");
        setSuccess("");
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="profile-state">
                <p>Loading profile...</p>
            </div>
        );
    }

    if (error && !profile) {
        return (
            <div className="profile-state profile-error">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">

                <div className="profile-page-header">
                    <div>
                        <p className="profile-eyebrow">
                            ACCOUNT
                        </p>

                        <h1>My Profile</h1>

                        <p>
                            Manage your personal information and
                            showcase your developer profile.
                        </p>
                    </div>

                    {!isEditing && (
                        <button
                            className="profile-edit-button"
                            onClick={() => {
                                setError("");
                                setSuccess("");
                                setIsEditing(true);
                            }}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {success && (
                    <div className="profile-message profile-success">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="profile-message profile-error-message">
                        {error}
                    </div>
                )}

                {!isEditing ? (
                    <div className="profile-content">

                        <section className="profile-card profile-overview">
                            <div className="profile-avatar">
                                {profile.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div className="profile-overview-info">
                                <h2>{profile.name}</h2>

                                <p className="profile-email">
                                    {profile.email}
                                </p>

                                <p className="profile-member">
                                    Member since{" "}
                                    {new Date(
                                        profile.createdAt
                                    ).toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "long",
                                            year: "numeric"
                                        }
                                    )}
                                </p>
                            </div>
                        </section>

                        <section className="profile-card">
                            <div className="profile-section-header">
                                <h2>About</h2>
                            </div>

                            <p className="profile-bio">
                                {profile.bio ||
                                    "No bio added yet."}
                            </p>
                        </section>

                        <section className="profile-card">
                            <div className="profile-section-header">
                                <h2>Education</h2>
                            </div>

                            <p className="profile-detail">
                                {profile.education ||
                                    "No education information added yet."}
                            </p>
                        </section>

                        <section className="profile-card">
                            <div className="profile-section-header">
                                <h2>Skills</h2>
                            </div>

                            {profile.skills?.length > 0 ? (
                                <div className="profile-skills">
                                    {profile.skills.map((skill) => (
                                        <span
                                            className="profile-skill"
                                            key={skill}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="profile-empty">
                                    No skills added yet.
                                </p>
                            )}
                        </section>

                        <section className="profile-card">
                            <div className="profile-section-header">
                                <h2>Developer Links</h2>
                            </div>

                            <div className="profile-links">

                                <div className="profile-link-item">
                                    <span className="profile-link-label">
                                        GitHub
                                    </span>

                                    {profile.github ? (
                                        <a
                                            href={profile.github}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {profile.github}
                                        </a>
                                    ) : (
                                        <span className="profile-link-empty">
                                            Not added
                                        </span>
                                    )}
                                </div>

                                <div className="profile-link-item">
                                    <span className="profile-link-label">
                                        LinkedIn
                                    </span>

                                    {profile.linkedIn ? (
                                        <a
                                            href={profile.linkedIn}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {profile.linkedIn}
                                        </a>
                                    ) : (
                                        <span className="profile-link-empty">
                                            Not added
                                        </span>
                                    )}
                                </div>

                            </div>
                        </section>
                    </div>
                ) : (
                    <form
                        className="profile-card profile-form"
                        onSubmit={handleSave}
                    >
                        <div className="profile-form-header">
                            <div>
                                <h2>Edit Profile</h2>

                                <p>
                                    Update the information shown
                                    on your BuildBridge profile.
                                </p>
                            </div>
                        </div>

                        <div className="profile-form-grid">

                            <div className="profile-form-group">
                                <label htmlFor="name">
                                    Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    minLength={3}
                                    maxLength={50}
                                    required
                                />
                            </div>

                            <div className="profile-form-group">
                                <label htmlFor="email">
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={profile.email}
                                    disabled
                                />

                                <span className="profile-input-hint">
                                    Email cannot be changed.
                                </span>
                            </div>

                            <div className="profile-form-group profile-form-full">
                                <label htmlFor="bio">
                                    Bio
                                </label>

                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    maxLength={500}
                                    rows={5}
                                    placeholder="Tell other developers a little about yourself..."
                                />

                                <span className="profile-character-count">
                                    {formData.bio.length}/500
                                </span>
                            </div>

                            <div className="profile-form-group profile-form-full">
                                <label htmlFor="education">
                                    Education
                                </label>

                                <input
                                    id="education"
                                    type="text"
                                    name="education"
                                    value={formData.education}
                                    onChange={handleChange}
                                    maxLength={200}
                                    placeholder="e.g. B.Tech in Computer Science"
                                />
                            </div>

                            <div className="profile-form-group profile-form-full">
                                <label htmlFor="skill">
                                    Skills
                                </label>

                                <div className="profile-skill-input">
                                    <input
                                        id="skill"
                                        type="text"
                                        value={skillInput}
                                        onChange={(event) =>
                                            setSkillInput(
                                                event.target.value
                                            )
                                        }
                                        onKeyDown={
                                            handleSkillKeyDown
                                        }
                                        placeholder="Enter a skill"
                                    />

                                    <button
                                        type="button"
                                        onClick={handleAddSkill}
                                    >
                                        Add
                                    </button>
                                </div>

                                {formData.skills.length > 0 && (
                                    <div className="profile-edit-skills">
                                        {formData.skills.map(
                                            (skill) => (
                                                <span
                                                    className="profile-edit-skill"
                                                    key={skill}
                                                >
                                                    {skill}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveSkill(
                                                                skill
                                                            )
                                                        }
                                                        aria-label={`Remove ${skill}`}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="profile-form-group">
                                <label htmlFor="github">
                                    GitHub
                                </label>

                                <input
                                    id="github"
                                    type="text"
                                    name="github"
                                    value={formData.github}
                                    onChange={handleChange}
                                    placeholder="https://github.com/username"
                                />
                            </div>

                            <div className="profile-form-group">
                                <label htmlFor="linkedIn">
                                    LinkedIn
                                </label>

                                <input
                                    id="linkedIn"
                                    type="text"
                                    name="linkedIn"
                                    value={formData.linkedIn}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>

                        </div>

                        <div className="profile-form-actions">
                            <button
                                type="button"
                                className="profile-cancel-button"
                                onClick={handleCancel}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="profile-save-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Profile;