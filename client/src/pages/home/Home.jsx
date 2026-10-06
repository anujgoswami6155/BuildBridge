import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import heroImg from "../../assets/hero.png";
import { 
    Sparkles, 
    ArrowRight, 
    FolderGit2, 
    KanbanSquare, 
    Users, 
    Code2, 
    ShieldCheck, 
    Zap 
} from "lucide-react";
import "./Home.css";

function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <Sparkles size={14} />
                        <span>The Developer Collaboration Hub</span>
                    </div>

                    <h1 className="hero-title">
                        Where Ambitious Developers <span className="hero-title-highlight">Build Together</span>
                    </h1>

                    <p className="hero-description">
                        Connect with talented builders, join exciting projects, organize tasks with intuitive Kanban boards, and bring ideas to reality.
                    </p>

                    <div className="hero-actions">
                        <Link to="/projects" className="btn-hero-primary">
                            <span>Explore Projects</span>
                            <ArrowRight size={16} />
                        </Link>

                        {isAuthenticated ? (
                            <Link to="/dashboard" className="btn-hero-secondary">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <Link to="/register" className="btn-hero-secondary">
                                Join as a Builder
                            </Link>
                        )}
                    </div>

                    <div className="hero-stats">
                        <div className="hero-stat-item">
                            <h3>100%</h3>
                            <p>Free & Open Community</p>
                        </div>
                        <div className="hero-stat-item">
                            <h3>Real-time</h3>
                            <p>Kanban Workspaces</p>
                        </div>
                        <div className="hero-stat-item">
                            <h3>Skill-based</h3>
                            <p>Role Matching</p>
                        </div>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="hero-glow"></div>
                    <div className="hero-image-wrapper">
                        <img 
                            src={heroImg} 
                            alt="BuildBridge Platform Visual" 
                            className="hero-image"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-tag">Powerful Features</span>
                        <h2>Everything you need to ship projects</h2>
                        <p>
                            From initial idea recruitment to sprint tracking and deployment, BuildBridge streamlines team collaboration.
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon-box">
                                <FolderGit2 size={24} />
                            </div>
                            <h3>Project Matchmaking</h3>
                            <p>
                                Post projects with custom tech stacks and target skills, or explore open projects that fit your experience.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon-box">
                                <KanbanSquare size={24} />
                            </div>
                            <h3>Agile Kanban Boards</h3>
                            <p>
                                Break complex goals into actionable tasks. Assign members, track status, and coordinate development velocity.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon-box">
                                <Users size={24} />
                            </div>
                            <h3>Team Recruitment</h3>
                            <p>
                                Accept applications with one click, manage team roles, and keep discussions organized in dedicated project threads.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon-box">
                                <Code2 size={24} />
                            </div>
                            <h3>Developer Profiles</h3>
                            <p>
                                Showcase your bio, tech stack, GitHub, and LinkedIn so project leads know exactly what you bring to the table.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon-box">
                                <Zap size={24} />
                            </div>
                            <h3>Quick Project Setup</h3>
                            <p>
                                Define team size, required competencies, repository links, and resource docs in seconds without friction.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon-box">
                                <ShieldCheck size={24} />
                            </div>
                            <h3>Role-Based Access</h3>
                            <p>
                                Secure ownership controls allow project creators to manage team membership, task delegation, and settings safely.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta-section">
                <div className="cta-banner">
                    <h2>Ready to build something impactful?</h2>
                    <p>
                        Join hundreds of developers collaborating on next-generation web apps, open-source utilities, and developer tools.
                    </p>
                    <div className="cta-buttons">
                        <Link to={isAuthenticated ? "/projects/create" : "/register"} className="btn-cta-white">
                            <span>Get Started Now</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
