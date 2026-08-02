import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, ShieldAlert } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";

export default function Unauthorized() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <Card className="w-full max-w-md border-slate-200/80 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-8 text-center space-y-6">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                        <ShieldAlert className="size-8" />
                    </div>

                    <div className="space-y-2">
                        <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                            Access Denied 403
                        </span>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                            Unauthorized Access
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-5">
                            You do not have the required permissions or role authorization to view this resource.
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(-1)}
                            className="rounded-xl text-xs font-semibold"
                        >
                            <ArrowLeft className="mr-1.5 size-3.5" /> Go Back
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => navigate("/")}
                            className="rounded-xl bg-slate-900 text-xs font-bold text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                        >
                            <Home className="mr-1.5 size-3.5" /> Return Home
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
