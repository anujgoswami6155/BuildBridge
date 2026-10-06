import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "../components/common/Layout";

import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/dashboard/Dashboard";
import Projects from "../pages/projects/Projects";
import ProjectDetails from "../pages/projects/ProjectDetails";
import CreateProject from "../pages/projects/CreateProject";
import EditProject from "../pages/projects/EditProject";

import Profile from "../pages/profile/Profile";
import Tasks from "../pages/tasks/Tasks";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/projects" element={<Projects />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/projects/create" element={<CreateProject />} />
                        <Route path="/projects/:projectId" element={<ProjectDetails />} />
                        <Route path="/projects/:projectId/edit" element={<EditProject />} />
                        <Route path="/projects/:projectId/tasks" element={<Tasks />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>

                    {/* Fallback to Home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default AppRoutes;