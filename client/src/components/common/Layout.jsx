import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { Layers } from "lucide-react";

function Layout({ children }) {
    return (
        <div className="app">
            <Navbar />

            <main className="main-content">
                {children}
            </main>

            <footer className="site-footer">
                <div className="footer-container">
                    <div className="footer-brand">
                        <span className="brand-icon-wrapper" style={{ width: "26px", height: "26px" }}>
                            <Layers size={15} strokeWidth={2.5} />
                        </span>
                        <span>BuildBridge</span>
                    </div>

                    <p className="footer-copy">
                        &copy; {new Date().getFullYear()} BuildBridge. Connect, collaborate, and build ambitious projects together.
                    </p>

                    <div className="footer-links">
                        <Link to="/projects">Explore Projects</Link>
                        <Link to="/dashboard">Dashboard</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Layout;