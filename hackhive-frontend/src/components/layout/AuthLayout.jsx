import { motion } from "framer-motion";
import Logo from "./Logo";

const highlights = [
  "Discover focused hackathons without noise.",
  "Build teams and ship with clarity.",
  "Keep your workspace clean and fast.",
];

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f8fafc_0%,#ffffff_42%,#eef2ff_100%)]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden overflow-hidden border-r border-slate-200/70 bg-slate-950 lg:flex">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.96))]" />
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.9) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

          <div className="relative z-10 flex h-full flex-col justify-between p-14 xl:p-16">
            <Logo />

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="max-w-xl"
            >
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-400">
                HackHive workspace
              </p>

              <h1 className="mt-5 text-5xl font-semibold tracking-tight text-white xl:text-6xl">
                Built for teams that move with intent.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-8 text-slate-300">
                A calm, focused space for discovering hackathons, forming teams,
                and turning ideas into shipped work.
              </p>

              <div className="mt-10 space-y-4">
                {highlights.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                    <span className="size-2 rounded-full bg-indigo-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <p className="text-sm text-slate-500">© 2026 HackHive</p>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-[460px]"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;