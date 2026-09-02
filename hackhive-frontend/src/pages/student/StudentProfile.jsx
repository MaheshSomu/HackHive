import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
    Award,
    BookOpen,
    Briefcase,
    Building2,
    Calendar,
    Code,
    Download,
    Edit2,
    ExternalLink,
    FileText,
    Globe,
    GraduationCap,
    Mail,
    MapPin,
    Phone,
    Plus,
    Sparkles,
    Trash2,
    UserCheck,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { studentProfileService } from "../../services/studentProfileService";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import DashboardSection from "../../components/student-dashboard/DashboardSection";
import { DashboardPageSkeleton, EmptyState } from "../../components/student-dashboard/DashboardStates";

// Modals
import PersonalInfoModal from "../../components/profile/PersonalInfoModal";
import SkillModal from "../../components/profile/SkillModal";
import EducationModal from "../../components/profile/EducationModal";
import ExperienceModal from "../../components/profile/ExperienceModal";
import ProjectModal from "../../components/profile/ProjectModal";
import CertificationModal from "../../components/profile/CertificationModal";
import SocialLinkModal from "../../components/profile/SocialLinkModal";
import ResumeUploadModal from "../../components/profile/ResumeUploadModal";

export default function StudentProfile() {
    const { user: authUser } = useAuth();

    // Data State
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [skills, setSkills] = useState([]);
    const [education, setEducation] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [projects, setProjects] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [socialLinks, setSocialLinks] = useState([]);
    const [resume, setResume] = useState(null);

    // Modal Active States
    const [activeModal, setActiveModal] = useState(null); // 'personal' | 'skill' | 'education' | 'experience' | 'project' | 'certification' | 'social' | 'resume'
    const [editItem, setEditItem] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch all student profile data
    const fetchProfileData = useCallback(async () => {
        try {
            setLoading(true);
            const results = await Promise.allSettled([
                studentProfileService.getProfile(),
                studentProfileService.getSkills(),
                studentProfileService.getEducation(),
                studentProfileService.getExperiences(),
                studentProfileService.getProjects(),
                studentProfileService.getCertifications(),
                studentProfileService.getSocialLinks(),
                studentProfileService.getResume(),
            ]);

            setProfile(results[0].status === "fulfilled" ? results[0].value : null);
            setSkills(results[1].status === "fulfilled" && Array.isArray(results[1].value) ? results[1].value : []);
            setEducation(results[2].status === "fulfilled" && Array.isArray(results[2].value) ? results[2].value : []);
            setExperiences(results[3].status === "fulfilled" && Array.isArray(results[3].value) ? results[3].value : []);
            setProjects(results[4].status === "fulfilled" && Array.isArray(results[4].value) ? results[4].value : []);
            setCertifications(results[5].status === "fulfilled" && Array.isArray(results[5].value) ? results[5].value : []);
            setSocialLinks(results[6].status === "fulfilled" && Array.isArray(results[6].value) ? results[6].value : []);
            setResume(results[7].status === "fulfilled" ? results[7].value : null);
        } catch {
            toast.error("Failed to load profile data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

    const closeModal = () => {
        setActiveModal(null);
        setEditItem(null);
    };

    // 1. Personal Information Submit
    const handleUpdatePersonal = async (data) => {
        try {
            setActionLoading(true);
            const updated = await studentProfileService.updateProfile(data);
            setProfile(updated);
            toast.success("Personal information updated!");
            closeModal();
        } catch {
            toast.error("Failed to update personal information.");
        } finally {
            setActionLoading(false);
        }
    };

    // 2. Skills Submit & Delete
    const handleSaveSkill = async (data) => {
        try {
            setActionLoading(true);
            if (editItem) {
                const updated = await studentProfileService.updateSkill(editItem.id, data);
                setSkills((prev) => prev.map((s) => (s.id === editItem.id ? updated : s)));
                toast.success("Skill updated!");
            } else {
                const created = await studentProfileService.addSkill(data);
                setSkills((prev) => [...prev, created]);
                toast.success("Skill added!");
            }
            closeModal();
        } catch {
            toast.error("Failed to save skill.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteSkill = async (id) => {
        try {
            await studentProfileService.deleteSkill(id);
            setSkills((prev) => prev.filter((s) => s.id !== id));
            toast.success("Skill deleted!");
        } catch {
            toast.error("Failed to delete skill.");
        }
    };

    // 3. Education Submit & Delete
    const handleSaveEducation = async (data) => {
        try {
            setActionLoading(true);
            if (editItem) {
                const updated = await studentProfileService.updateEducation(editItem.id, data);
                setEducation((prev) => prev.map((e) => (e.id === editItem.id ? updated : e)));
                toast.success("Education updated!");
            } else {
                const created = await studentProfileService.addEducation(data);
                setEducation((prev) => [...prev, created]);
                toast.success("Education added!");
            }
            closeModal();
        } catch {
            toast.error("Failed to save education.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteEducation = async (id) => {
        try {
            await studentProfileService.deleteEducation(id);
            setEducation((prev) => prev.filter((e) => e.id !== id));
            toast.success("Education deleted!");
        } catch {
            toast.error("Failed to delete education.");
        }
    };

    // 4. Experience Submit & Delete
    const handleSaveExperience = async (data) => {
        try {
            setActionLoading(true);
            if (editItem) {
                const updated = await studentProfileService.updateExperience(editItem.id, data);
                setExperiences((prev) => prev.map((exp) => (exp.id === editItem.id ? updated : exp)));
                toast.success("Experience updated!");
            } else {
                const created = await studentProfileService.addExperience(data);
                setExperiences((prev) => [...prev, created]);
                toast.success("Experience added!");
            }
            closeModal();
        } catch {
            toast.error("Failed to save experience.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteExperience = async (id) => {
        try {
            await studentProfileService.deleteExperience(id);
            setExperiences((prev) => prev.filter((exp) => exp.id !== id));
            toast.success("Experience deleted!");
        } catch {
            toast.error("Failed to delete experience.");
        }
    };

    // 5. Projects Submit & Delete
    const handleSaveProject = async (data) => {
        try {
            setActionLoading(true);
            if (editItem) {
                const updated = await studentProfileService.updateProject(editItem.id, data);
                setProjects((prev) => prev.map((p) => (p.id === editItem.id ? updated : p)));
                toast.success("Project updated!");
            } else {
                const created = await studentProfileService.addProject(data);
                setProjects((prev) => [...prev, created]);
                toast.success("Project added!");
            }
            closeModal();
        } catch {
            toast.error("Failed to save project.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteProject = async (id) => {
        try {
            await studentProfileService.deleteProject(id);
            setProjects((prev) => prev.filter((p) => p.id !== id));
            toast.success("Project deleted!");
        } catch {
            toast.error("Failed to delete project.");
        }
    };

    // 6. Certifications Submit & Delete
    const handleSaveCertification = async (data) => {
        try {
            setActionLoading(true);
            if (editItem) {
                const updated = await studentProfileService.updateCertification(editItem.id, data);
                setCertifications((prev) => prev.map((c) => (c.id === editItem.id ? updated : c)));
                toast.success("Certification updated!");
            } else {
                const created = await studentProfileService.addCertification(data);
                setCertifications((prev) => [...prev, created]);
                toast.success("Certification added!");
            }
            closeModal();
        } catch {
            toast.error("Failed to save certification.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteCertification = async (id) => {
        try {
            await studentProfileService.deleteCertification(id);
            setCertifications((prev) => prev.filter((c) => c.id !== id));
            toast.success("Certification deleted!");
        } catch {
            toast.error("Failed to delete certification.");
        }
    };

    // 7. Social Links Submit & Delete
    const handleSaveSocialLink = async (data) => {
        try {
            setActionLoading(true);
            if (editItem) {
                const updated = await studentProfileService.updateSocialLink(editItem.id, data);
                setSocialLinks((prev) => prev.map((s) => (s.id === editItem.id ? updated : s)));
                toast.success("Social link updated!");
            } else {
                const created = await studentProfileService.addSocialLink(data);
                setSocialLinks((prev) => [...prev, created]);
                toast.success("Social link added!");
            }
            closeModal();
        } catch {
            toast.error("Failed to save social link.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteSocialLink = async (id) => {
        try {
            await studentProfileService.deleteSocialLink(id);
            setSocialLinks((prev) => prev.filter((s) => s.id !== id));
            toast.success("Social link deleted!");
        } catch {
            toast.error("Failed to delete social link.");
        }
    };

    // 8. Resume Upload & Delete
    const handleUploadResume = async (file) => {
        try {
            setActionLoading(true);
            const res = await studentProfileService.uploadResume(file);
            setResume(res);
            toast.success("Resume uploaded successfully!");
            closeModal();
        } catch {
            toast.error("Failed to upload resume.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleViewResume = async () => {
        try {
            setActionLoading(true);
            const blob = await studentProfileService.downloadResumeBlob();
            const fileURL = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
            window.open(fileURL, "_blank");
        } catch {
            toast.error("Failed to view resume.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteResume = async () => {
        try {
            await studentProfileService.deleteResume();
            setResume(null);
            toast.success("Resume deleted!");
        } catch {
            toast.error("Failed to delete resume.");
        }
    };

    if (loading) {
        return <DashboardPageSkeleton />;
    }

    const studentName = profile?.fullName || authUser?.fullName || "Student";
    const studentEmail = authUser?.email || profile?.email || "student@hackhive.com";
    const initials = studentName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

    return (
        <div className="space-y-8 pb-16">
            {/* Header Hero Banner / Profile Summary Card */}
            <Card className="overflow-hidden border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="h-28 bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 dark:from-indigo-950 dark:via-slate-900 dark:to-blue-950" />
                <CardContent className="relative px-6 pb-6 pt-0 sm:px-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between -mt-12 mb-4">
                        <div className="flex items-end gap-4">
                            <div className="flex size-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-slate-900 text-2xl font-extrabold text-white shadow-md dark:border-slate-900 dark:bg-indigo-600">
                                {initials}
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                                    {studentName}
                                </h1>
                                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                    {profile?.degree && profile?.branch ? `${profile.degree} in ${profile.branch}` : "Student Portfolio"}
                                </p>
                            </div>
                        </div>

                        <Button
                            type="button"
                            onClick={() => setActiveModal("personal")}
                            className="rounded-xl bg-slate-900 text-xs font-medium text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                            size="sm"
                        >
                            <Edit2 className="mr-1.5 size-3.5" />
                            Edit Profile Info
                        </Button>
                    </div>

                    {/* Quick Info Bar */}
                    <div className="grid gap-3 pt-2 text-xs text-slate-600 dark:text-slate-400 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-center gap-2">
                            <Mail className="size-4 text-slate-400" />
                            <span className="truncate">{studentEmail}</span>
                        </div>
                        {profile?.location && (
                            <div className="flex items-center gap-2">
                                <MapPin className="size-4 text-slate-400" />
                                <span className="truncate">{profile.location}</span>
                            </div>
                        )}
                        {profile?.college && (
                            <div className="flex items-center gap-2">
                                <Building2 className="size-4 text-slate-400" />
                                <span className="truncate">{profile.college}</span>
                            </div>
                        )}
                        {profile?.graduationYear && (
                            <div className="flex items-center gap-2">
                                <GraduationCap className="size-4 text-slate-400" />
                                <span>Class of {profile.graduationYear}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* 1. Personal Information Section */}
            <DashboardSection
                id="personal"
                eyebrow="Personal"
                title="Personal Information"
                description="Core academic, location, and bio details visible on your workspace profile."
                action={
                    <Button type="button" variant="outline" size="sm" onClick={() => setActiveModal("personal")}>
                        <Edit2 className="mr-1.5 size-3.5" /> Edit
                    </Button>
                }
            >
                <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <CardContent className="p-6 space-y-4">
                        {profile?.bio && (
                            <div className="space-y-1">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Bio</p>
                                <p className="text-xs leading-6 text-slate-700 dark:text-slate-300">{profile.bio}</p>
                            </div>
                        )}

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
                            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                                <p className="text-[10px] font-semibold text-slate-400 uppercase">University</p>
                                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{profile?.university || "Not added"}</p>
                            </div>
                            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                                <p className="text-[10px] font-semibold text-slate-400 uppercase">College</p>
                                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{profile?.college || "Not added"}</p>
                            </div>
                            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                                <p className="text-[10px] font-semibold text-slate-400 uppercase">Degree & Branch</p>
                                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                                    {profile?.degree || profile?.branch ? `${profile.degree || ""} ${profile.branch ? `(${profile.branch})` : ""}` : "Not added"}
                                </p>
                            </div>
                            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                                <p className="text-[10px] font-semibold text-slate-400 uppercase">Graduation & CGPA</p>
                                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                                    {profile?.graduationYear ? `Year: ${profile.graduationYear}` : "Graduation year not listed"}
                                    {profile?.cgpa ? ` • CGPA: ${profile.cgpa}` : ""}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </DashboardSection>

            {/* 2. Skills Section */}
            <DashboardSection
                id="skills"
                eyebrow="Skills"
                title="Technical & Core Skills"
                description="Showcase your tech stack and proficiency levels to recruiters and teammates."
                action={
                    <Button type="button" size="sm" onClick={() => { setEditItem(null); setActiveModal("skill"); }}>
                        <Plus className="mr-1.5 size-3.5" /> Add Skill
                    </Button>
                }
            >
                <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <CardContent className="p-6">
                        {skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2.5">
                                {skills.map((skill) => (
                                    <div
                                        key={skill.id}
                                        className="group relative flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 transition hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200"
                                    >
                                        <span>{skill.skillName}</span>
                                        <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold text-indigo-600 shadow-2xs dark:bg-slate-900 dark:text-indigo-400">
                                            {skill.skillLevel}
                                        </span>

                                        <div className="ml-1 flex items-center gap-1 opacity-80 group-hover:opacity-100">
                                            <button
                                                type="button"
                                                onClick={() => { setEditItem(skill); setActiveModal("skill"); }}
                                                className="text-slate-400 hover:text-indigo-600"
                                                title="Edit skill"
                                            >
                                                <Edit2 className="size-3" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteSkill(skill.id)}
                                                className="text-slate-400 hover:text-rose-600"
                                                title="Delete skill"
                                            >
                                                <Trash2 className="size-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={<Sparkles className="size-5" />}
                                title="No skills added yet"
                                description="Add your technical skills, programming languages, and frameworks to complete your profile."
                                action={
                                    <Button type="button" variant="outline" size="sm" onClick={() => { setEditItem(null); setActiveModal("skill"); }}>
                                        Add First Skill
                                    </Button>
                                }
                            />
                        )}
                    </CardContent>
                </Card>
            </DashboardSection>

            {/* 3. Education Section */}
            <DashboardSection
                id="education"
                eyebrow="Education"
                title="Education"
                description="List your degrees, schools, coursework, and academic qualifications."
                action={
                    <Button type="button" size="sm" onClick={() => { setEditItem(null); setActiveModal("education"); }}>
                        <Plus className="mr-1.5 size-3.5" /> Add Education
                    </Button>
                }
            >
                <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <CardContent className="p-6 space-y-4">
                        {education.length > 0 ? (
                            education.map((edu) => (
                                <div
                                    key={edu.id}
                                    className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 sm:flex-row sm:items-start sm:justify-between dark:border-slate-800 dark:bg-slate-800/40"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <GraduationCap className="size-4 text-indigo-600 dark:text-indigo-400" />
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{edu.institution}</h4>
                                        </div>
                                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                                        </p>
                                        <p className="text-[11px] text-slate-500">
                                            {edu.startYear} - {edu.endYear || "Present"} {edu.cgpa ? `• CGPA: ${edu.cgpa}` : ""}
                                        </p>
                                        {edu.description && (
                                            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">{edu.description}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-auto">
                                        <button
                                            type="button"
                                            onClick={() => { setEditItem(edu); setActiveModal("education"); }}
                                            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                                        >
                                            <Edit2 className="size-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteEducation(edu.id)}
                                            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-rose-950/40"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <EmptyState
                                icon={<GraduationCap className="size-5" />}
                                title="No education listed"
                                description="Add your university, college degree, or high school details."
                                action={
                                    <Button type="button" variant="outline" size="sm" onClick={() => { setEditItem(null); setActiveModal("education"); }}>
                                        Add Education
                                    </Button>
                                }
                            />
                        )}
                    </CardContent>
                </Card>
            </DashboardSection>

            {/* 4. Experience Section */}
            <DashboardSection
                id="experience"
                eyebrow="Experience"
                title="Work & Internship Experience"
                description="List your professional history, internships, software roles, and contributions."
                action={
                    <Button type="button" size="sm" onClick={() => { setEditItem(null); setActiveModal("experience"); }}>
                        <Plus className="mr-1.5 size-3.5" /> Add Experience
                    </Button>
                }
            >
                <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <CardContent className="p-6 space-y-4">
                        {experiences.length > 0 ? (
                            experiences.map((exp) => (
                                <div
                                    key={exp.id}
                                    className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 sm:flex-row sm:items-start sm:justify-between dark:border-slate-800 dark:bg-slate-800/40"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="size-4 text-indigo-600 dark:text-indigo-400" />
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{exp.role}</h4>
                                            {exp.currentlyWorking && (
                                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            {exp.company} {exp.employmentType ? `• ${exp.employmentType}` : ""} {exp.location ? `(${exp.location})` : ""}
                                        </p>
                                        <p className="text-[11px] text-slate-500">
                                            {exp.startDate} - {exp.currentlyWorking ? "Present" : exp.endDate || "N/A"}
                                        </p>
                                        {exp.description && (
                                            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">{exp.description}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-auto">
                                        <button
                                            type="button"
                                            onClick={() => { setEditItem(exp); setActiveModal("experience"); }}
                                            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                                        >
                                            <Edit2 className="size-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteExperience(exp.id)}
                                            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-rose-950/40"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <EmptyState
                                icon={<Briefcase className="size-5" />}
                                title="No work experience listed"
                                description="Add internships, freelance work, or full-time roles you've completed."
                                action={
                                    <Button type="button" variant="outline" size="sm" onClick={() => { setEditItem(null); setActiveModal("experience"); }}>
                                        Add Experience
                                    </Button>
                                }
                            />
                        )}
                    </CardContent>
                </Card>
            </DashboardSection>

            {/* 5. Projects Section */}
            <DashboardSection
                id="projects"
                eyebrow="Projects"
                title="Projects & Portfolio"
                description="Highlight software projects, open source tools, and hackathon builds."
                action={
                    <Button type="button" size="sm" onClick={() => { setEditItem(null); setActiveModal("project"); }}>
                        <Plus className="mr-1.5 size-3.5" /> Add Project
                    </Button>
                }
            >
                {projects.length > 0 ? (
                    <div className="grid gap-5 md:grid-cols-2">
                        {projects.map((proj) => (
                            <Card key={proj.id} className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                                <CardContent className="p-5 flex flex-col justify-between h-full">
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{proj.title}</h4>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => { setEditItem(proj); setActiveModal("project"); }}
                                                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                                >
                                                    <Edit2 className="size-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteProject(proj.id)}
                                                    className="p-1 text-slate-400 hover:text-rose-600"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        {proj.techStack && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {proj.techStack.split(",").map((tech, i) => (
                                                    <span key={i} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                        {tech.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {proj.description && (
                                            <p className="text-xs text-slate-600 leading-5 dark:text-slate-400 line-clamp-3">{proj.description}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-4 dark:border-slate-800">
                                        {proj.githubUrl && (
                                            <a
                                                href={proj.githubUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                                            >
                                                <Code className="size-3.5" /> Code
                                            </a>
                                        )}
                                        {proj.liveUrl && (
                                            <a
                                                href={proj.liveUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                                            >
                                                <ExternalLink className="size-3.5" /> Live Demo
                                            </a>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <CardContent className="p-6">
                            <EmptyState
                                icon={<Code className="size-5" />}
                                title="No projects added yet"
                                description="Add web apps, open source repos, or hackathon projects to showcase your portfolio."
                                action={
                                    <Button type="button" variant="outline" size="sm" onClick={() => { setEditItem(null); setActiveModal("project"); }}>
                                        Add Project
                                    </Button>
                                }
                            />
                        </CardContent>
                    </Card>
                )}
            </DashboardSection>

            {/* 6. Certifications Section */}
            <DashboardSection
                id="certifications"
                eyebrow="Certifications"
                title="Certifications & Licenses"
                description="Verified professional credentials, courses, and exam certificates."
                action={
                    <Button type="button" size="sm" onClick={() => { setEditItem(null); setActiveModal("certification"); }}>
                        <Plus className="mr-1.5 size-3.5" /> Add Certification
                    </Button>
                }
            >
                <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <CardContent className="p-6 space-y-4">
                        {certifications.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {certifications.map((cert) => (
                                    <div
                                        key={cert.id}
                                        className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Award className="size-4 text-indigo-600 dark:text-indigo-400" />
                                                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{cert.name}</h4>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => { setEditItem(cert); setActiveModal("certification"); }}
                                                        className="p-1 text-slate-400 hover:text-slate-700"
                                                    >
                                                        <Edit2 className="size-3" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteCertification(cert.id)}
                                                        className="p-1 text-slate-400 hover:text-rose-600"
                                                    >
                                                        <Trash2 className="size-3" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                {cert.issuingOrganization}
                                            </p>
                                            {cert.issueDate && (
                                                <p className="text-[11px] text-slate-500">
                                                    Issued: {cert.issueDate} {cert.expirationDate ? `• Expires: ${cert.expirationDate}` : ""}
                                                </p>
                                            )}
                                        </div>

                                        {cert.credentialUrl && (
                                            <a
                                                href={cert.credentialUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                                            >
                                                <ExternalLink className="size-3" /> Verify Credential
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={<Award className="size-5" />}
                                title="No certifications listed"
                                description="Add certificates from AWS, Coursera, Meta, Google, or university awards."
                                action={
                                    <Button type="button" variant="outline" size="sm" onClick={() => { setEditItem(null); setActiveModal("certification"); }}>
                                        Add Certification
                                    </Button>
                                }
                            />
                        )}
                    </CardContent>
                </Card>
            </DashboardSection>

            {/* 7. Social Links Section */}
            <DashboardSection
                id="socials"
                eyebrow="Links"
                title="Social & Coding Profiles"
                description="Connect GitHub, LinkedIn, LeetCode, Codeforces, and personal portfolio links."
                action={
                    <Button type="button" size="sm" onClick={() => { setEditItem(null); setActiveModal("social"); }}>
                        <Plus className="mr-1.5 size-3.5" /> Add Link
                    </Button>
                }
            >
                <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <CardContent className="p-6">
                        {socialLinks.length > 0 ? (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {socialLinks.map((link) => (
                                    <div
                                        key={link.id}
                                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <Globe className="size-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{link.platform}</p>
                                                <a
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="truncate text-[11px] text-slate-500 hover:text-indigo-600 block max-w-[160px]"
                                                >
                                                    {link.url}
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => { setEditItem(link); setActiveModal("social"); }}
                                                className="p-1 text-slate-400 hover:text-slate-700"
                                            >
                                                <Edit2 className="size-3" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteSocialLink(link.id)}
                                                className="p-1 text-slate-400 hover:text-rose-600"
                                            >
                                                <Trash2 className="size-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={<Globe className="size-5" />}
                                title="No social links added"
                                description="Add links to your GitHub, LinkedIn, LeetCode, or personal site."
                                action={
                                    <Button type="button" variant="outline" size="sm" onClick={() => { setEditItem(null); setActiveModal("social"); }}>
                                        Add Social Link
                                    </Button>
                                }
                            />
                        )}
                    </CardContent>
                </Card>
            </DashboardSection>

            {/* 8. Resume Management Section */}
            <DashboardSection
                id="resume"
                eyebrow="Resume"
                title="Resume Management"
                description="Upload, preview, replace, or delete your latest resume file."
            >
                <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <CardContent className="p-6">
                        {resume && (resume.resumeUrl || resume.fileUrl) ? (
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                        <FileText className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                            {resume.fileName || "Uploaded_Resume.pdf"}
                                        </h4>
                                        <p className="text-[11px] text-slate-500">Resume attached to your profile</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleViewResume}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                    >
                                        <ExternalLink className="size-3.5" /> View Resume
                                    </button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setActiveModal("resume")}
                                    >
                                        Replace
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleDeleteResume}
                                        className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <EmptyState
                                icon={<FileText className="size-5" />}
                                title="No resume uploaded"
                                description="Upload your PDF resume to complete your application profile for hackathons and teams."
                                action={
                                    <Button type="button" size="sm" onClick={() => setActiveModal("resume")}>
                                        <FileText className="mr-1.5 size-3.5" /> Upload Resume
                                    </Button>
                                }
                            />
                        )}
                    </CardContent>
                </Card>
            </DashboardSection>

            {/* Modals Container */}
            <PersonalInfoModal
                isOpen={activeModal === "personal"}
                onClose={closeModal}
                initialData={profile}
                onSubmit={handleUpdatePersonal}
                isLoading={actionLoading}
            />

            <SkillModal
                isOpen={activeModal === "skill"}
                onClose={closeModal}
                initialData={editItem}
                onSubmit={handleSaveSkill}
                isLoading={actionLoading}
            />

            <EducationModal
                isOpen={activeModal === "education"}
                onClose={closeModal}
                initialData={editItem}
                onSubmit={handleSaveEducation}
                isLoading={actionLoading}
            />

            <ExperienceModal
                isOpen={activeModal === "experience"}
                onClose={closeModal}
                initialData={editItem}
                onSubmit={handleSaveExperience}
                isLoading={actionLoading}
            />

            <ProjectModal
                isOpen={activeModal === "project"}
                onClose={closeModal}
                initialData={editItem}
                onSubmit={handleSaveProject}
                isLoading={actionLoading}
            />

            <CertificationModal
                isOpen={activeModal === "certification"}
                onClose={closeModal}
                initialData={editItem}
                onSubmit={handleSaveCertification}
                isLoading={actionLoading}
            />

            <SocialLinkModal
                isOpen={activeModal === "social"}
                onClose={closeModal}
                initialData={editItem}
                onSubmit={handleSaveSocialLink}
                isLoading={actionLoading}
            />

            <ResumeUploadModal
                isOpen={activeModal === "resume"}
                onClose={closeModal}
                onUpload={handleUploadResume}
                isLoading={actionLoading}
            />
        </div>
    );
}
