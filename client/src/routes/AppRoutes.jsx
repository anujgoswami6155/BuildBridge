import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/common/Layout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

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
    element={<Login />}
/>

<Route
    path="/register"
    element={<Register />}
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