import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Layers, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(formData);
            navigate("/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed. Please verify your credentials and try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo-badge">
                        <Layers size={24} strokeWidth={2.5} />
                    </div>
                    <h1>Welcome back</h1>
                    <p>Enter your details to sign in to your BuildBridge account.</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <AlertCircle size={16} style={{ flexShrink: 0 }} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-with-icon">
                            <Mail size={16} className="input-icon" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                autoComplete="email"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-with-icon">
                            <Lock size={16} className="input-icon" />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>Don't have an account?</span>
                    <Link to="/register">Create an account</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;