import { Link } from "react-router-dom";

function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar-container">

                <Link to="/" className="navbar-brand">
                    BuildBridge
                </Link>

                <nav className="navbar-links">
                    <Link to="/projects">Projects</Link>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/profile">Profile</Link>
                </nav>

                <div className="navbar-actions">
                    <Link to="/login" className="navbar-login">
                        Login
                    </Link>

                    <Link to="/register" className="navbar-register">
                        Register
                    </Link>
                </div>

            </div>
        </header>
    );
}

export default Navbar;