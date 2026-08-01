import { Hexagon } from "lucide-react";

function Logo() {
    return (
        <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg">

                <Hexagon
                    size={24}
                    color="white"
                    strokeWidth={2.5}
                />

            </div>

            <div>

                <h1 className="text-2xl font-black tracking-tight">

                    HackHive

                </h1>

                <p className="text-xs text-slate-500">

                    Build • Collaborate • Win

                </p>

            </div>

        </div>
    );
}

export default Logo;