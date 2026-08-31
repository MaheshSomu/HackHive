import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { Button } from "../ui/Button";

export default function FinalCtaSection() {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const handleExploreClick = () => {
        if (isAuthenticated && user?.role === "STUDENT") {
            navigate("/student/events");
        } else if (isAuthenticated && user?.role === "ORGANIZER") {
            navigate("/organizer/events");
        } else {
            navigate("/login");
        }
    };

    return (
        <section className="py-16 lg:py-20 bg-slate-900 text-white border-t border-slate-800">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                    Ready to build something worth showing?
                </h2>

                <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                    Discover your next hackathon, build your team, and turn your idea into a real project with HackHive.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={handleExploreClick}
                        className="w-full sm:w-auto rounded-lg border-slate-700 bg-slate-800 text-white hover:bg-slate-700 font-semibold px-6 py-2.5 text-xs sm:text-sm"
                    >
                        Explore Hackathons →
                    </Button>

                    <Link to="/register" className="w-full sm:w-auto">
                        <Button
                            type="button"
                            variant="primary"
                            size="lg"
                            className="w-full sm:w-auto rounded-lg font-semibold gap-1.5 px-6 py-2.5 text-xs sm:text-sm"
                        >
                            <span>Join HackHive</span>
                            <ArrowRight className="size-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
