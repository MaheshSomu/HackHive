import { Hexagon } from "lucide-react";

function Logo() {

    return (

        <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/30">

                <Hexagon
                    className="text-white"
                    size={28}
                    strokeWidth={2.6}
                />

            </div>

            <div>

                <h1 className="text-3xl font-black tracking-tight text-white">

                    HackHive

                </h1>

                <p className="text-sm text-slate-300">

                    Build • Collaborate • Win

                </p>

            </div>

        </div>

    );

}

export default Logo;