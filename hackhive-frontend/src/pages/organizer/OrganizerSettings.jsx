import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { AlertCircle, RotateCcw, Building2 } from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { organizerService } from "../../services/organizerService";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DashboardPageSkeleton } from "../../components/student-dashboard/DashboardStates";

import ProfileSummaryCard from "../../components/organizer/settings/ProfileSummaryCard";
import SettingsSidebar from "../../components/organizer/settings/SettingsSidebar";
import GeneralSection from "../../components/organizer/settings/GeneralSection";
import ContactSection from "../../components/organizer/settings/ContactSection";
import BrandingSection from "../../components/organizer/settings/BrandingSection";
import SocialLinksSection from "../../components/organizer/settings/SocialLinksSection";
import NotificationsSection from "../../components/organizer/settings/NotificationsSection";
import SecuritySection from "../../components/organizer/settings/SecuritySection";

export default function OrganizerSettings() {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState("general");

    // Profile state & API states
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isError, setIsError] = useState(false);

    // Fetch Organizer Profile from existing Backend API
    const fetchOrganizerProfile = useCallback(async () => {
        setLoading(true);
        setIsError(false);
        try {
            const data = await organizerService.getProfile();
            setProfileData(data);
        } catch (err) {
            console.error("Failed to load organizer profile:", err);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrganizerProfile();
    }, [fetchOrganizerProfile]);

    // Update Profile handler using existing backend PUT /organizer/profile API
    const handleUpdateProfile = async (updatedFields) => {
        setSaving(true);
        try {
            const payload = {
                organizationName: profileData?.organizationName || "",
                organizationType: profileData?.organizationType || "",
                description: profileData?.description || "",
                websiteUrl: profileData?.websiteUrl || "",
                contactEmail: profileData?.contactEmail || "",
                contactPhone: profileData?.contactPhone || "",
                location: profileData?.location || "",
                logoUrl: profileData?.logoUrl || "",
                ...updatedFields,
            };

            const updated = await organizerService.updateProfile(payload);
            setProfileData(updated);
            toast.success("Organizer profile updated successfully!");
        } catch (err) {
            console.error("Failed to update organizer profile:", err);
            toast.error(
                err.response?.data?.message || "Failed to update settings. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 pb-20 w-full max-w-6xl mx-auto">
            {/* Top Page Banner */}
            <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-100 dark:border-purple-900/60">
                        <Building2 className="size-3.5 text-purple-600" />
                        Host Controls & SaaS Settings
                    </span>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                        Organizer Settings
                    </h1>
                    <p className="max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                        Manage your organization's public branding, contact info, security credentials, and platform preferences.
                    </p>
                </div>
            </Card>

            {/* Error State with Retry Button */}
            {isError ? (
                <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-8 text-center text-rose-900 dark:border-rose-950 dark:bg-rose-950/40 dark:text-rose-300 space-y-4 shadow-xs">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300">
                        <AlertCircle className="size-6" />
                    </div>
                    <div className="space-y-1 max-w-md mx-auto">
                        <h4 className="text-base font-bold">Failed to load organizer profile</h4>
                        <p className="text-xs text-rose-600/80 dark:text-rose-400 leading-relaxed font-medium">
                            There was an issue communicating with the HackHive servers to fetch your organization profile. Please check your network connection and try again.
                        </p>
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        onClick={fetchOrganizerProfile}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs inline-flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-xs"
                    >
                        <RotateCcw className="size-4" /> Retry Loading Profile
                    </Button>
                </div>
            ) : loading ? (
                /* Loading Skeleton */
                <DashboardPageSkeleton />
            ) : (
                <div className="space-y-8">
                    {/* Section 1: Top Profile Summary Hero Card */}
                    <ProfileSummaryCard profileData={profileData} user={user} />

                    {/* Section 2: Main SaaS Settings Layout (Sidebar Navigation + Active Panel) */}
                    <div className="flex flex-col lg:flex-row items-start gap-8">
                        {/* Sidebar Menu */}
                        <SettingsSidebar
                            activeSection={activeSection}
                            setActiveSection={setActiveSection}
                        />

                        {/* Active Settings Panel */}
                        <main className="w-full flex-1 min-w-0">
                            {activeSection === "general" && (
                                <GeneralSection
                                    profileData={profileData}
                                    onSave={handleUpdateProfile}
                                    saving={saving}
                                />
                            )}

                            {activeSection === "contact" && (
                                <ContactSection
                                    profileData={profileData}
                                    onSave={handleUpdateProfile}
                                    saving={saving}
                                />
                            )}

                            {activeSection === "branding" && (
                                <BrandingSection
                                    profileData={profileData}
                                    onSave={handleUpdateProfile}
                                    saving={saving}
                                    onProfileUpdated={(updated) => setProfileData(updated)}
                                />
                            )}

                            {activeSection === "social" && <SocialLinksSection />}

                            {activeSection === "notifications" && <NotificationsSection />}

                            {activeSection === "security" && <SecuritySection user={user} />}
                        </main>
                    </div>
                </div>
            )}
        </div>
    );
}
