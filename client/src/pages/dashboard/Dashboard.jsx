import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboard } from "../../services/dashboard.service";
import { 
    FolderGit2, 
    Users, 
    CheckSquare, 
    Activity, 
    Plus, 
    Compass, 
    ChevronRight, 
    Code2, 
    MessageSquare, 
    Clock, 
    AlertCircle 
} from "lucide-react";
import "./Dashboard.css";

function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const data = await getDashboard();
                setDashboard(data.dashboard);
            } catch (error) {
                console.error(
                    "Failed to fetch dashboard:",
                    error.response?.data || error.message
                );
                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard data. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="page-loader">
                <div className="spinner spinner-primary" style={{ width: "32px", height: "32px", borderWidth: "3px" }}></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-page">
                <div className="auth-error" style={{ maxWidth: "600px", margin: "40px auto" }}>
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    const ownedProjects = dashboard.projects?.owned || [];
    const joinedProjects = dashboard.projects?.memberOf || [];
    const tasks = dashboard.tasks || [];
    const recentActivity = dashboard.recentActivity || [];
    const skills = dashboard.user?.skills || [];

    return (
        <div className="dashboard-page">
            {/* Header */}
            <section className="dashboard-header">
                <div>
                    <p className="dashboard-eyebrow">DASHBOARD OVERVIEW</p>
                    <h1>
                        Welcome back, <span>{dashboard.user?.name}</span>
                    </h1>
                    <p className="dashboard-subtitle">
                        Track your projects, team collaborations, and assigned tasks in one place.
                    </p>
                </div>

                <div className="dashboard-header-actions">
                    <Link to="/projects/create" className="btn-dashboard-action">
                        <Plus size={16} strokeWidth={2.5} />
                        <span>Create Project</span>
                    </Link>
                    <Link to="/projects" className="btn-dashboard-secondary">
                        <Compass size={16} />
                        <span>Explore Projects</span>
                    </Link>
                </div>
            </section>

            {/* Statistics */}
            <section className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon-wrapper blue">
                        <FolderGit2 size={22} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Owned Projects</span>
                        <span className="stat-value">{ownedProjects.length}</span>
                        <span className="stat-hint">Created by you</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper green">
                        <Users size={22} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Joined Projects</span>
                        <span className="stat-value">{joinedProjects.length}</span>
                        <span className="stat-hint">Active memberships</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper purple">
                        <CheckSquare size={22} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Assigned Tasks</span>
                        <span className="stat-value">{tasks.length}</span>
                        <span className="stat-hint">Pending action items</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper amber">
                        <Activity size={22} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Recent Updates</span>
                        <span className="stat-value">{recentActivity.length}</span>
                        <span className="stat-hint">Activity log items</span>
                    </div>
                </div>
            </section>

            {/* Main Dashboard Grid */}
            <section className="dashboard-grid">
                {/* Owned Projects */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <div className="card-header-left">
                            <span className="card-header-icon">
                                <FolderGit2 size={16} />
                            </span>
                            <h2>My Projects ({ownedProjects.length})</h2>
                        </div>
                        <Link to="/projects" className="card-link">
                            View all
                            <ChevronRight size={14} />
                        </Link>
                    </div>

                    {ownedProjects.length > 0 ? (
                        <div className="dashboard-project-list">
                            {ownedProjects.slice(0, 4).map((project) => (
                                <Link 
                                    to={`/projects/${project._id}`} 
                                    key={project._id} 
                                    className="dashboard-project-item"
                                >
                                    <div className="dashboard-project-item-left">
                                        <span className="dashboard-project-item-title">
                                            {project.title}
                                        </span>
                                        <div className="dashboard-project-item-meta">
                                            <span>{project.category || "General"}</span>
                                            <span>•</span>
                                            <span>
                                                <Users size={12} />
                                                {(project.teamMembers?.length || 0)} / {project.teamSize} members
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span className={`badge-status-pill ${project.recruitmentStatus}`}>
                                            <span className="badge-status-dot"></span>
                                            {project.recruitmentStatus}
                                        </span>
                                        <ChevronRight size={16} color="var(--text-faint)" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state-box">
                            <div className="empty-state-icon">
                                <FolderGit2 size={22} />
                            </div>
                            <h3>No projects created yet</h3>
                            <p>
                                Start a new project to assemble your dream team and ship your vision.
                            </p>
                            <Link to="/projects/create" className="btn-empty-action">
                                <Plus size={14} />
                                <span>Create Project</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Joined Projects */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <div className="card-header-left">
                            <span className="card-header-icon">
                                <Users size={16} />
                            </span>
                            <h2>Projects I'm a Member Of ({joinedProjects.length})</h2>
                        </div>
                        <Link to="/projects" className="card-link">
                            Explore
                            <ChevronRight size={14} />
                        </Link>
                    </div>

                    {joinedProjects.length > 0 ? (
                        <div className="dashboard-project-list">
                            {joinedProjects.slice(0, 4).map((project) => (
                                <Link 
                                    to={`/projects/${project._id}`} 
                                    key={project._id} 
                                    className="dashboard-project-item"
                                >
                                    <div className="dashboard-project-item-left">
                                        <span className="dashboard-project-item-title">
                                            {project.title}
                                        </span>
                                        <div className="dashboard-project-item-meta">
                                            <span>{project.category || "General"}</span>
                                            <span>•</span>
                                            <span>
                                                <Users size={12} />
                                                {(project.teamMembers?.length || 0)} members
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} color="var(--text-faint)" />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state-box">
                            <div className="empty-state-icon">
                                <Users size={22} />
                            </div>
                            <h3>No joined projects yet</h3>
                            <p>
                                Explore community projects and apply to join teams that match your skillset.
                            </p>
                            <Link to="/projects" className="btn-empty-action">
                                <Compass size={14} />
                                <span>Explore Projects</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* My Skills */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <div className="card-header-left">
                            <span className="card-header-icon">
                                <Code2 size={16} />
                            </span>
                            <h2>My Skills ({skills.length})</h2>
                        </div>
                        <Link to="/profile" className="card-link">
                            Manage profile
                            <ChevronRight size={14} />
                        </Link>
                    </div>

                    {skills.length > 0 ? (
                        <div className="skills-wrapper">
                            {skills.map((skill) => (
                                <span key={skill} className="skill-tag">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state-box">
                            <div className="empty-state-icon">
                                <Code2 size={22} />
                            </div>
                            <h3>No skills listed</h3>
                            <p>
                                Add your tech stack to showcase your superpowers and get invited to teams.
                            </p>
                            <Link to="/profile" className="btn-empty-action">
                                <span>Add Skills</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <div className="card-header-left">
                            <span className="card-header-icon">
                                <Activity size={16} />
                            </span>
                            <h2>Recent Activity</h2>
                        </div>
                    </div>

                    {recentActivity.length > 0 ? (
                        <div className="activity-list">
                            {recentActivity.slice(0, 4).map((activity) => (
                                <div className="activity-item" key={activity._id}>
                                    <div className="activity-icon">
                                        <MessageSquare size={14} />
                                    </div>
                                    <div className="activity-details">
                                        <p>
                                            Commented on{" "}
                                            <strong>{activity.project?.title || "Project"}</strong>: "
                                            {activity.content?.length > 70 
                                                ? `${activity.content.substring(0, 70)}...` 
                                                : activity.content}
                                            "
                                        </p>
                                        <span className="activity-date">
                                            <Clock size={11} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                                            {new Date(activity.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state-box">
                            <div className="empty-state-icon">
                                <Activity size={22} />
                            </div>
                            <h3>No recent activity</h3>
                            <p>
                                Activity from task assignments, discussions, and updates will be logged here.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Dashboard;