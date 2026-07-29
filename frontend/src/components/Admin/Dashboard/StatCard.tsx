import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  /** Short factual context line, e.g. "3 pending" — never a fabricated trend */
  hint?: string;
}

export function StatCard({ label, value, icon: Icon, color, bg, hint }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white p-5 rounded-2xl border border-neutral-border/60 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center mb-4`}>
        <Icon size={19} strokeWidth={2.25} />
      </div>
      <p className="text-[12px] font-medium text-neutral-text-secondary">{label}</p>
      <p className="text-2xl font-bold text-primary-dark mt-0.5 tracking-tight">{value}</p>
      {hint && <p className="text-[11px] text-neutral-text-secondary/80 mt-1.5">{hint}</p>}
    </motion.div>
  );
}
