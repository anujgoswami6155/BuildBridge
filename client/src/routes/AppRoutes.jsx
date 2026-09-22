import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/common/Layout";

function AppRoutes() {
    return (
        <BrowserRouter>

            <Layout>

                <Routes>

                    <Route
                        path="/"
                        element={
                            <h1>BuildBridge Home</h1>
                        }
                    />

                    <Route
                        path="/login"
                        element={
                            <h1>Login Page</h1>
                        }
                    />

                    <Route
                        path="/register"
                        element={
                            <h1>Register Page</h1>
                        }
                    />

                    <Route
                        path="/dashboard"
                        element={
                            <h1>Dashboard</h1>
                        }
                    />

                    <Route
                        path="/projects"
                        element={
                            <h1>Projects</h1>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <h1>Profile</h1>
                        }
                    />

                </Routes>

            </Layout>

        </BrowserRouter>
    );
}

export default AppRoutes;