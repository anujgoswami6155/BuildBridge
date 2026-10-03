import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "../components/common/Layout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/dashboard/Dashboard";
import Projects from "../pages/projects/Projects";


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