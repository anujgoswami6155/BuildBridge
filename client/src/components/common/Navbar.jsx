import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
    Layers, 
    LayoutDashboard, 
    FolderGit2, 
    User, 
    LogOut, 
    Sparkles, 
    Plus
} from "lucide-react";

function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <header className="navbar">
            <div className="navbar-container">
                <div className="navbar-left">
                    <Link to="/" className="navbar-brand">
                        <span className="brand-icon-wrapper">
                            <Layers size={20} strokeWidth={2.5} />
                        </span>
                        <span className="brand-text">BuildBridge</span>
                    </Link>

                    <nav className="navbar-links">
                        <NavLink 
                            to="/projects" 
                            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                        >
                            <FolderGit2 size={16} />
                            <span>Explore Projects</span>
                        </NavLink>

                        {isAuthenticated && (
                            <>
                                <NavLink 
                                    to="/dashboard" 
                                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                                >
                                    <LayoutDashboard size={16} />
                                    <span>Dashboard</span>
                                </NavLink>

                                <NavLink 
                                    to="/profile" 
                                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                                >
                                    <User size={16} />
                                    <span>Profile</span>
                                </NavLink>
                            </>
                        )}
                    </nav>
                </div>

                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <>
                            <Link to="/projects/create" className="btn-nav-register" style={{ padding: "8px 14px", fontSize: "13px" }}>
                                <Plus size={15} strokeWidth={2.5} />
                                <span>New Project</span>
                            </Link>

                            <div className="user-badge" title={user?.email || ""}>
                                <div className="user-avatar-mini">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                                </div>
                                <span className="user-name-mini">
                                    {user?.name || "Builder"}
                                </span>
                            </div>

                            <button 
                                onClick={handleLogout} 
                                className="btn-logout"
                                title="Sign out"
                            >
                                <LogOut size={15} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-nav-login">
                                Log in
                            </Link>
                            <Link to="/register" className="btn-nav-register">
                                <Sparkles size={15} />
                                <span>Get Started</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Navbar;