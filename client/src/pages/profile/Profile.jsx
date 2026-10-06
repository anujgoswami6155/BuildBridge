import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../services/profile.service";
import { 
    User, 
    Mail, 
    Calendar, 
    Code2, 
    GraduationCap, 
    Edit3, 
    Save, 
    X, 
    CheckCircle2, 
    AlertCircle, 
    ExternalLink,
    Plus
} from "lucide-react";
import "./Profile.css";

const GithubIcon = ({ size = 15 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
);

const LinkedinIcon = ({ size = 15 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

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
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setError(
                    err.response?.data?.message || "Failed to load developer profile."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddSkill = () => {
        const skill = skillInput.trim();
        if (!skill) return;

        if (formData.skills.includes(skill)) {
            setSkillInput("");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            skills: [...prev.skills, skill]
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
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((skill) => skill !== skillToRemove)
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
        } catch (err) {
            console.error("Failed to update profile:", err);
            setError(
                err.response?.data?.message || "Failed to update profile."
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
            <div className="page-loader">
                <div className="spinner spinner-primary" style={{ width: "32px", height: "32px", borderWidth: "3px" }}></div>
                <p>Loading developer profile...</p>
            </div>
        );
    }

    if (error && !profile) {
        return (
            <div className="profile-page">
                <div className="auth-error" style={{ maxWidth: "600px", margin: "40px auto" }}>
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-page-header">
                    <div>
                        <p className="profile-eyebrow">DEVELOPER ACCOUNT</p>
                        <h1>My Profile</h1>
                        <p>Manage your public persona, tech stack, and portfolio links across BuildBridge.</p>
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
                            <Edit3 size={15} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
                            <span>Edit Profile</span>
                        </button>
                    )}
                </div>

                {success && (
                    <div className="auth-success" style={{ marginBottom: "20px" }}>
                        <CheckCircle2 size={16} />
                        <span>{success}</span>
                    </div>
                )}

                {error && (
                    <div className="auth-error" style={{ marginBottom: "20px" }}>
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                {!isEditing ? (
                    <div className="profile-content">
                        {/* Profile Overview Card */}
                        <section className="profile-card profile-overview">
                            <div className="profile-avatar">
                                {profile.name?.charAt(0).toUpperCase() || "U"}
                            </div>

                            <div className="profile-overview-info">
                                <h2>{profile.name}</h2>
                                <p className="profile-email">
                                    <Mail size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
                                    {profile.email}
                                </p>
                                <p className="profile-member">
                                    <Calendar size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
                                    Member since {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                                </p>
                            </div>
                        </section>

                        {/* About Card */}
                        <section className="profile-card">
                            <div className="profile-section-header">
                                <h2>
                                    <User size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
                                    <span>About & Bio</span>
                                </h2>
                            </div>
                            <p className="profile-bio">
                                {profile.bio || "No bio added yet. Tell other developers about your background and interests."}
                            </p>
                        </section>

                        {/* Education Card */}
                        <section className="profile-card">
                            <div className="profile-section-header">
                                <h2>
                                    <GraduationCap size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
                                    <span>Education</span>
                                </h2>
                            </div>
                            <p className="profile-detail">
                                {profile.education || "No education information added yet."}
                            </p>
                        </section>

                        {/* Skills Card */}
                        <section className="profile-card">
                            <div className="profile-section-header">
                                <h2>
                                    <Code2 size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
                                    <span>Skills & Expertise</span>
                                </h2>
                            </div>
                            {profile.skills?.length > 0 ? (
                                <div className="profile-skills">
                                    {profile.skills.map((skill) => (
                                        <span className="profile-skill" key={skill}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="profile-empty">No skills listed yet. Add skills to get matched with projects.</p>
                            )}
                        </section>

                        {/* Developer Links Card */}
                        <section className="profile-card">
                            <div className="profile-section-header">
                                <h2>
                                    <ExternalLink size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
                                    <span>Developer Links</span>
                                </h2>
                            </div>

                            <div className="profile-links">
                                <div className="profile-link-item">
                                    <span className="profile-link-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <GithubIcon size={15} />
                                        <span>GitHub</span>
                                    </span>
                                    {profile.github ? (
                                        <a href={profile.github} target="_blank" rel="noreferrer">
                                            {profile.github}
                                        </a>
                                    ) : (
                                        <span className="profile-link-empty">Not added</span>
                                    )}
                                </div>

                                <div className="profile-link-item">
                                    <span className="profile-link-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <LinkedinIcon size={15} />
                                        <span>LinkedIn</span>
                                    </span>
                                    {profile.linkedIn ? (
                                        <a href={profile.linkedIn} target="_blank" rel="noreferrer">
                                            {profile.linkedIn}
                                        </a>
                                    ) : (
                                        <span className="profile-link-empty">Not added</span>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                ) : (
                    /* Edit Form */
                    <form className="profile-card profile-form" onSubmit={handleSave}>
                        <div className="profile-form-header">
                            <h2>Edit Developer Profile</h2>
                            <p>Update personal information, experience, and profile links.</p>
                        </div>

                        <div className="profile-form-grid">
                            <div className="profile-form-group">
                                <label htmlFor="name">Full Name</label>
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
                                <label htmlFor="email">Email (Immutable)</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={profile.email}
                                    disabled
                                />
                                <span className="profile-input-hint">Email address cannot be changed.</span>
                            </div>

                            <div className="profile-form-group profile-form-full">
                                <label htmlFor="bio">Bio</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    maxLength={500}
                                    rows={4}
                                    placeholder="Tell other builders about yourself, your stack, and project interests..."
                                />
                                <span className="profile-character-count">
                                    {formData.bio.length}/500
                                </span>
                            </div>

                            <div className="profile-form-group profile-form-full">
                                <label htmlFor="education">Education / Background</label>
                                <input
                                    id="education"
                                    type="text"
                                    name="education"
                                    value={formData.education}
                                    onChange={handleChange}
                                    maxLength={200}
                                    placeholder="e.g. B.S. in Computer Science, Self-taught Engineer"
                                />
                            </div>

                            <div className="profile-form-group profile-form-full">
                                <label htmlFor="skill">Skills</label>
                                <div className="profile-skill-input">
                                    <input
                                        id="skill"
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={handleSkillKeyDown}
                                        placeholder="Add a skill and press Enter or click Add"
                                    />
                                    <button type="button" onClick={handleAddSkill}>
                                        <Plus size={14} style={{ display: "inline", verticalAlign: "middle" }} />
                                        <span>Add</span>
                                    </button>
                                </div>

                                {formData.skills.length > 0 && (
                                    <div className="profile-edit-skills">
                                        {formData.skills.map((skill) => (
                                            <span className="profile-edit-skill" key={skill}>
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSkill(skill)}
                                                    aria-label={`Remove ${skill}`}
                                                >
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="profile-form-group">
                                <label htmlFor="github">GitHub Profile URL</label>
                                <input
                                    id="github"
                                    type="url"
                                    name="github"
                                    value={formData.github}
                                    onChange={handleChange}
                                    placeholder="https://github.com/username"
                                />
                            </div>

                            <div className="profile-form-group">
                                <label htmlFor="linkedIn">LinkedIn Profile URL</label>
                                <input
                                    id="linkedIn"
                                    type="url"
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
                                {saving ? (
                                    <>
                                        <span className="spinner"></span>
                                        <span>Saving Changes...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={15} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
                                        <span>Save Profile</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Profile;