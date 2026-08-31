import LandingNavbar from "../../components/landing/LandingNavbar";
import HeroSection from "../../components/landing/HeroSection";
import HowItWorksSection from "../../components/landing/HowItWorksSection";
import OnePlatformTwoExperiencesSection from "../../components/landing/OnePlatformTwoExperiencesSection";
import WhyHackHiveSection from "../../components/landing/WhyHackHiveSection";
import CompletePlatformWorkflowSection from "../../components/landing/CompletePlatformWorkflowSection";
import FinalCtaSection from "../../components/landing/FinalCtaSection";
import LandingFooter from "../../components/landing/LandingFooter";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-600 selection:text-white">
            <LandingNavbar />
            <main>
                <HeroSection />
                <HowItWorksSection />
                <OnePlatformTwoExperiencesSection />
                <WhyHackHiveSection />
                <CompletePlatformWorkflowSection />
                <FinalCtaSection />
            </main>
            <LandingFooter />
        </div>
    );
}
