import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthRoute from "./AuthRoute";
import ProtectedRoute from "./ProtectedRoute";
import { DashboardPageSkeleton } from "../components/student-dashboard/DashboardStates";

// Lazy Loaded Pages
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPasswordPage"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPasswordPage"));
const PasswordResetSuccess = lazy(() => import("../pages/auth/PasswordResetSuccessPage"));
const EmailVerified = lazy(() => import("../pages/auth/EmailVerifiedPage"));
const EmailVerificationFailed = lazy(() => import("../pages/auth/EmailVerificationFailedPage"));
const VerifyEmailHandler = lazy(() => import("../pages/auth/VerifyEmailHandlerPage"));
const OAuthCompleteRegistration = lazy(() => import("../pages/auth/OAuthCompleteRegistrationPage"));
const OAuthSuccess = lazy(() => import("../pages/auth/OAuthSuccessPage"));
const ReactivateAccount = lazy(() => import("../pages/auth/ReactivateAccountPage"));




const StudentLayout = lazy(() => import("../components/layout/StudentLayout"));
const StudentDashboard = lazy(() => import("../pages/student/StudentDashboard"));
const StudentProfile = lazy(() => import("../pages/student/StudentProfile"));
const StudentEvents = lazy(() => import("../pages/student/StudentEvents"));
const StudentTeams = lazy(() => import("../pages/student/StudentTeams"));
const StudentWorkspace = lazy(() => import("../pages/student/StudentWorkspace"));
const StudentSettings = lazy(() => import("../pages/student/StudentSettings"));

const OrganizerLayout = lazy(() => import("../components/layout/OrganizerLayout"));
const OrganizerDashboard = lazy(() => import("../pages/organizer/OrganizerDashboard"));
const OrganizerProfile = lazy(() => import("../pages/organizer/OrganizerProfile"));
const OrganizerEvents = lazy(() => import("../pages/organizer/OrganizerEvents"));
const OrganizerRegistrations = lazy(() => import("../pages/organizer/OrganizerRegistrations"));
const OrganizerAnalytics = lazy(() => import("../pages/organizer/OrganizerAnalytics"));
const OrganizerSettings = lazy(() => import("../pages/organizer/OrganizerSettings"));

const AdminLayout = lazy(() => import("../components/layout/AdminLayout"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminUserManagement = lazy(() => import("../pages/admin/AdminUserManagement"));
const AdminStudentManagement = lazy(() => import("../pages/admin/AdminStudentManagement"));
const AdminOrganizerManagement = lazy(() => import("../pages/admin/AdminOrganizerManagement"));
const AdminEventManagement = lazy(() => import("../pages/admin/AdminEventManagement"));
const AdminReports = lazy(() => import("../pages/admin/AdminReports"));
const AdminSettings = lazy(() => import("../pages/admin/AdminSettings"));

const NotFound = lazy(() => import("../pages/common/NotFound"));

function StudentPagePlaceholder({ title, description }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{title}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    );
}

function PageFallback() {
    return <DashboardPageSkeleton />;
}

function AppRoutes() {
    return (
        <BrowserRouter>
            <Suspense fallback={<PageFallback />}>
                <Routes>
                    <Route element={<AuthRoute />}>
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/oauth-complete-registration" element={<OAuthCompleteRegistration />} />
                        <Route path="/oauth-success" element={<OAuthSuccess />} />
                    </Route>

                    {/* Unprotected Reset Password & Verification Callback Routes */}
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
                    <Route path="/email-verified" element={<EmailVerified />} />
                    <Route path="/email-verification-failed" element={<EmailVerificationFailed />} />
                    <Route path="/verify-email" element={<VerifyEmailHandler />} />
                    <Route path="/reactivate-account" element={<ReactivateAccount />} />




                    <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
                        <Route element={<StudentLayout />}>
                            <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
                            <Route path="/student/dashboard" element={<StudentDashboard />} />
                            <Route path="/student/profile" element={<StudentProfile />} />
                            <Route path="/student/events" element={<StudentEvents />} />
                            <Route path="/student/teams" element={<StudentTeams />} />
                            <Route path="/student/workspace" element={<StudentWorkspace />} />
                            <Route path="/student/settings" element={<StudentSettings />} />
                        </Route>
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={["ORGANIZER"]} />}>
                        <Route element={<OrganizerLayout />}>
                            <Route path="/organizer" element={<Navigate to="/organizer/dashboard" replace />} />
                            <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
                            <Route path="/organizer/profile" element={<OrganizerProfile />} />
                            <Route path="/organizer/events" element={<OrganizerEvents />} />
                            <Route path="/organizer/registrations" element={<OrganizerRegistrations />} />
                            <Route path="/organizer/submissions" element={<OrganizerRegistrations defaultTab="submissions" />} />
                            <Route path="/organizer/analytics" element={<OrganizerAnalytics />} />
                            <Route path="/organizer/settings" element={<OrganizerSettings />} />
                        </Route>
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                        <Route element={<AdminLayout />}>
                            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/users" element={<AdminUserManagement />} />
                            <Route path="/admin/students" element={<AdminStudentManagement />} />
                            <Route path="/admin/organizers" element={<AdminOrganizerManagement />} />
                            <Route path="/admin/events" element={<AdminEventManagement />} />
                            <Route path="/admin/reports" element={<AdminReports />} />
                            <Route path="/admin/settings" element={<AdminSettings />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default AppRoutes;