import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service";
import { Layers, User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

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
        setSuccess("");
        setLoading(true);

        try {
            const response = await registerUser(formData);
            setSuccess(response.message || "Registration successful! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
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
                    <h1>Create your account</h1>
                    <p>Join the BuildBridge builder network today.</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <AlertCircle size={16} style={{ flexShrink: 0 }} />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="auth-success">
                        <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                        <span>{success}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <div className="input-with-icon">
                            <User size={16} className="input-icon" />
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Alex Morgan"
                                autoComplete="name"
                                required
                            />
                        </div>
                    </div>

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
                                placeholder="Create a strong password"
                                autoComplete="new-password"
                                minLength={6}
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
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            <>
                                <span>Get Started</span>
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>Already have an account?</span>
                    <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;