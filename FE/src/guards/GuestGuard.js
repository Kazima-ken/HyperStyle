import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "../config/CookiesRequest";

const GuestGuard = ({ children, requiredRole }) => {

        const token = getCookie("accessToken");

    if (!token) {
        return children;
    }

    try {
        const user = jwtDecode(token);
        const userRoles = user.roles || [];

        if (user.exp * 1000 < Date.now()) {
            sessionStorage.removeItem("accessToken");
            return children;
        } else if (requiredRole === "ROLE_ADMIN") {
            return <Navigate to="/dashboard" replace />;
        }

        return <Navigate to="/home" replace />;
    } catch (error) {
        sessionStorage.removeItem("accessToken");
        return children;
    }
};

export default GuestGuard;
