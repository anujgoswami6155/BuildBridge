import { createContext, useContext, useEffect, useState } from "react";

import {
    getCurrentUser,
    loginUser,
    logoutUser
} from "../services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [loading, setLoading] = useState(true);


    // Restore authentication when the application starts
    useEffect(() => {

        const restoreUser = async () => {

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const currentUser = await getCurrentUser();

                setUser(currentUser);

            } catch (error) {

                console.error(
                    "Failed to restore user:",
                    error.response?.data || error.message
                );

                localStorage.removeItem("token");
                setToken(null);
                setUser(null);

            } finally {
                setLoading(false);
            }
        };

        restoreUser();

    }, [token]);


    // Login
    const login = async (credentials) => {

        const response = await loginUser(credentials);

        const receivedToken = response.token;

        localStorage.setItem("token", receivedToken);

        setToken(receivedToken);

        // Fetch the authenticated user's information
        const currentUser = await getCurrentUser();

        setUser(currentUser);

        return currentUser;
    };


    // Logout
    const logout = async () => {

        try {
            await logoutUser();
        } catch (error) {

            console.error(
                "Logout request failed:",
                error.response?.data || error.message
            );

        } finally {

            localStorage.removeItem("token");

            setToken(null);
            setUser(null);
        }
    };


    const isAuthenticated = !!user;


    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAuthenticated,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};