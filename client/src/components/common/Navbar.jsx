import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <nav>
            <Link to="/">BuildBridge</Link>

            <div>
                {isAuthenticated ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/projects">Projects</Link>
                        <Link to="/profile">Profile</Link>

                        <span>Hi, {user?.name}</span>

                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;