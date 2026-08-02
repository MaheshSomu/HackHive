import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthLoader from "../components/auth/AuthLoader";
import useAuth from "../hooks/useAuth";
import { getDashboardPath } from "../utils/authRoutes";

function ProtectedRoute({ allowedRoles }) {
    const { user, initializing } = useAuth();
    const location = useLocation();

    if (initializing) {
        return <AuthLoader label="Checking your session..." />;
    }

    if (!user) {
        return <Navigate to="/" replace state={{ from: location.pathname }} />;
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to={getDashboardPath(user.role)} replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;