import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboard } from "../../services/dashboard.service";
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
                    "Failed to load dashboard."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-state">
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-state dashboard-error">
                <p>{error}</p>
            </div>
        );
    }

    const ownedProjects = dashboard.projects.owned.length;
    const joinedProjects = dashboard.projects.memberOf.length;
    const tasks = dashboard.tasks.length;
    const recentActivity = dashboard.recentActivity.length;

    return (
        <div className="dashboard-page">
            {/* Header */}
            <section className="dashboard-header">
                <div>
                    <p className="dashboard-label">DASHBOARD</p>

                    <h1>
                        Welcome back,{" "}
                        <span>{dashboard.user.name}</span> 👋
                    </h1>

                    <p className="dashboard-subtitle">
                        Here's an overview of your BuildBridge activity.
                        Keep building and collaborating!
                    </p>
                </div>

                <div className="dashboard-quote">
                    <p>
                        "Great things are built together."
                    </p>
                    <span>— BuildBridge</span>
                </div>
            </section>

            {/* Statistics */}
            <section className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon blue">📁</div>

                    <div>
                        <p>Owned Projects</p>
                        <h2>{ownedProjects}</h2>
                        <span>Projects you created</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon green">👥</div>

                    <div>
                        <p>Projects Joined</p>
                        <h2>{joinedProjects}</h2>
                        <span>Projects you're a member of</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon purple">✓</div>

                    <div>
                        <p>Tasks</p>
                        <h2>{tasks}</h2>
                        <span>Tasks assigned to you</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon orange">⌁</div>

                    <div>
                        <p>Recent Activity</p>
                        <h2>{recentActivity}</h2>
                        <span>Latest updates</span>
                    </div>
                </div>
            </section>

            {/* Main Dashboard Grid */}
            <section className="dashboard-grid">

                {/* Skills */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <div>
                            <span className="card-icon">◆</span>
                            <h2>My Skills</h2>
                        </div>

                        <Link to="/profile">
                            Edit Profile
                        </Link>
                    </div>

                    <div className="empty-state">
                        <div className="empty-icon">{"</>"}</div>

                        {dashboard.user.skills.length > 0 ? (
                            <div className="skills-list">
                                {dashboard.user.skills.map((skill) => (
                                    <span key={skill}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <>
                                <h3>No skills added yet.</h3>

                                <p>
                                    Add your skills to showcase your
                                    expertise and get discovered by
                                    other builders.
                                </p>

                                <Link
                                    to="/profile"
                                    className="primary-button"
                                >
                                    Add Skills
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <div>
                            <span className="card-icon">◷</span>
                            <h2>Recent Activity</h2>
                        </div>

                        <span className="view-link">
                            View All
                        </span>
                    </div>

                    <div className="empty-state">
                        <div className="empty-icon activity-icon">
                            ☷
                        </div>

                        {recentActivity > 0 ? (
                            <p>
                                Recent activity will appear here.
                            </p>
                        ) : (
                            <>
                                <h3>No recent activity.</h3>

                                <p>
                                    Your recent project updates,
                                    task assignments and
                                    collaborations will appear here.
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* My Projects */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <div>
                            <span className="card-icon">▱</span>
                            <h2>My Projects</h2>
                        </div>

                        <Link to="/projects">
                            View All
                        </Link>
                    </div>

                    <div className="empty-state horizontal-empty">
                        {ownedProjects > 0 ? (
                            <p>
                                Your projects will appear here.
                            </p>
                        ) : (
                            <>
                                <div className="large-empty-icon">
                                    📁
                                </div>

                                <div>
                                    <h3>
                                        You haven't created any
                                        projects yet.
                                    </h3>

                                    <p>
                                        Start a new project to find
                                        teammates and bring your
                                        ideas to life.
                                    </p>

                                    <Link
                                        to="/projects"
                                        className="primary-button"
                                    >
                                        Create Project
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Joined Projects */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <div>
                            <span className="card-icon">♙</span>
                            <h2>Projects I'm a Member Of</h2>
                        </div>

                        <Link to="/projects">
                            View All
                        </Link>
                    </div>

                    <div className="empty-state horizontal-empty">
                        {joinedProjects > 0 ? (
                            <p>
                                Your joined projects will appear here.
                            </p>
                        ) : (
                            <>
                                <div className="large-empty-icon">
                                    👥
                                </div>

                                <div>
                                    <h3>
                                        You haven't joined any
                                        projects yet.
                                    </h3>

                                    <p>
                                        Explore projects and
                                        collaborate with talented
                                        developers.
                                    </p>

                                    <Link
                                        to="/projects"
                                        className="primary-button"
                                    >
                                        Explore Projects
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>

            </section>
        </div>
    );
}

export default Dashboard;