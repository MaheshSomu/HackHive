import { motion } from "framer-motion";
import Logo from "./Logo";

function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-100">

            <div className="grid min-h-screen lg:grid-cols-2">

                {/* LEFT PANEL */}

                <div className="relative hidden overflow-hidden lg:flex">

                    {/* Background */}

                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-slate-900 to-black" />

                    {/* Blur Circles */}

                    <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

                    <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

                    {/* Content */}

                    <div className="relative z-10 flex h-full flex-col justify-between p-16">

                        <Logo />

                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <h1 className="text-6xl font-black leading-tight text-white">

                                Build.

                                <br />

                                Collaborate.

                                <br />

                                Win.

                            </h1>

                            <p className="mt-8 max-w-lg text-lg leading-8 text-slate-300">

                                One platform to manage hackathons,
                                build teams, collaborate on projects,
                                and showcase innovation.

                            </p>
                        </motion.div>

                        <p className="text-slate-400">

                            © 2026 HackHive

                        </p>

                    </div>

                </div>

                {/* RIGHT PANEL */}

                <div className="flex items-center justify-center p-8">

                    <div className="w-full max-w-md">

                        {children}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AuthLayout;