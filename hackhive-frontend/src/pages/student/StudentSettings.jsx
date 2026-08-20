import { useState } from "react";
import { Sliders } from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { Card } from "../../components/ui/Card";

import StudentProfileSummaryCard from "../../components/student/settings/StudentProfileSummaryCard";
import StudentSettingsSidebar from "../../components/student/settings/StudentSettingsSidebar";
import StudentAccountSection from "../../components/student/settings/StudentAccountSection";
import StudentSecuritySection from "../../components/student/settings/StudentSecuritySection";
import StudentNotificationsSection from "../../components/student/settings/StudentNotificationsSection";
import StudentPreferencesSection from "../../components/student/settings/StudentPreferencesSection";
import StudentPrivacySection from "../../components/student/settings/StudentPrivacySection";
import StudentDangerZoneSection from "../../components/student/settings/StudentDangerZoneSection";

export default function StudentSettings() {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState("account");

    return (
        <div className="space-y-8 pb-20 w-full max-w-6xl mx-auto">
            {/* Top Page Banner */}
            <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/60">
                        <Sliders className="size-3.5 text-indigo-600 dark:text-indigo-400" />
                        Account Controls
                    </span>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                        Student Settings
                    </h1>
                    <p className="max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                        Manage your student profile account details, security credentials, notification preferences, display options, and privacy controls.
                    </p>
                </div>
            </Card>

            <div className="space-y-8">
                {/* Section 1: Top Profile Summary Hero Card */}
                <StudentProfileSummaryCard user={user} />

                {/* Section 2: Main SaaS Settings Layout (Sidebar Navigation + Active Panel) */}
                <div className="flex flex-col lg:flex-row items-start gap-8">
                    {/* Sidebar Menu */}
                    <StudentSettingsSidebar
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    />

                    {/* Active Settings Panel */}
                    <main className="w-full flex-1 min-w-0">
                        {activeSection === "account" && <StudentAccountSection user={user} />}

                        {activeSection === "security" && <StudentSecuritySection user={user} />}

                        {activeSection === "notifications" && <StudentNotificationsSection />}

                        {activeSection === "preferences" && <StudentPreferencesSection />}

                        {activeSection === "privacy" && <StudentPrivacySection />}

                        {activeSection === "danger" && <StudentDangerZoneSection />}
                    </main>
                </div>
            </div>
        </div>
    );
}
