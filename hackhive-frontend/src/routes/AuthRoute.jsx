import { Navigate, Outlet } from "react-router-dom";
import AuthLoader from "../components/auth/AuthLoader";
import useAuth from "../hooks/useAuth";
import { getDashboardPath } from "../utils/authRoutes";

function AuthRoute() {
    const { user, initializing } = useAuth();

    if (initializing) {
        return <AuthLoader label="Loading your workspace..." />;
    }

    if (user) {
        return <Navigate to={getDashboardPath(user.role)} replace />;
    }

    return <Outlet />;
}

export default AuthRoute;
