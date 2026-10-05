import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "../components/common/Layout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/dashboard/Dashboard";
import Projects from "../pages/projects/Projects";
import ProjectDetails from "../pages/projects/ProjectDetails";
import CreateProject from "../pages/projects/CreateProject";
import EditProject from "../pages/projects/EditProject";

function AppRoutes() {
    return (
        <BrowserRouter>

            <Layout>

                <Routes>

                    {/* Public Routes */}

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


                    {/* Protected Routes */}

                    <Route element={<ProtectedRoute />}>

                        <Route
                            path="/dashboard"
                            element={
                                <Dashboard />
                            }
                        />

                        <Route
                            path="/projects"
                            element={
                                <Projects />
                            }
                        />

                        <Route
                            path="/projects/:projectId"
                            element={<ProjectDetails />}
                        />

                        <Route
                            path="/projects/:projectId/edit"
                            element={<EditProject />}
                        />

    
<Route
    path="/projects/create"
    element={<CreateProject />}
    />

                        <Route
                            path="/profile"
                            element={
                                <h1>Profile</h1>
                            }
                        />

                    </Route>

                </Routes>

            </Layout>

        </BrowserRouter>
    );
}

export default AppRoutes;