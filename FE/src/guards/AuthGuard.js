import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { deleteCookie, getCookie } from "../config/CookiesRequest";

const AuthGuard = ({ children, requiredRole }) => {
    const location = useLocation();
    const token = getCookie("accessToken");

    if (!token && requiredRole === "ROLE_ADMIN") {
        return <Navigate to="/login-management" state={{ from: location }} replace />;
    } else if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    try {
        const user = jwtDecode(token);
        const userRoles = user.roles || [];

        if (user.exp * 1000 < Date.now() && requiredRole === "ROLE_ADMIN") {
            deleteCookie("accessToken");
            return <Navigate to="/login-management" state={{ from: location }} replace />;
        } else if (user.exp * 1000 < Date.now()) {
            deleteCookie("accessToken");
            return <Navigate to="/login" state={{ from: location }} replace />;
        }

        if (requiredRole) {
            const hasRole = userRoles.includes(requiredRole);

            if (!hasRole) {
                return <Navigate to="/home" replace />;
            }
        }

        return children;

    } catch (error) {
        console.log("Token invalid:", error);
        deleteCookie("accessToken");
        return <Navigate to="/login" replace />;
    }
};

export default AuthGuard;