import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthRoute from "./AuthRoute";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

import StudentDashboard from "../pages/student/StudentDashboard";
import OrganizerDashboard from "../pages/organizer/OrganizerDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

import NotFound from "../pages/common/NotFound";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AuthRoute />}>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
                    <Route path="/student/dashboard" element={<StudentDashboard />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["ORGANIZER"]} />}>
                    <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Route>

                <Route path="*" element={<NotFound />} />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;