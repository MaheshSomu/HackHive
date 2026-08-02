import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

function AuthCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
    >
      <Card
        className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-10"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
        <div className="relative z-10">
          {children}
        </div>
      </Card>
    </motion.div>
  );
}

export default AuthCard;