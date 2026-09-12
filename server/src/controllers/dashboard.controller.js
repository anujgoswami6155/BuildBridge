import { getDashboard } from "../services/dashboard.services.js";

const getDashboardController = async (req, res) => {
    const userId = req.userId;

    try {
        const dashboard = await getDashboard(userId);

        return res.status(200).json({
            message: "Dashboard retrieved successfully",
            dashboard: dashboard
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

export {
    getDashboardController
};