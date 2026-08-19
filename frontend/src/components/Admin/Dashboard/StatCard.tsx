import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  /** CSS gradient used for the top accent bar and icon ring on hover */
  accent?: string;
  /** Short factual context line, e.g. "3 pending" — never a fabricated trend */
  hint?: string;
}

export function StatCard({ label, value, icon: Icon, color, bg, accent, hint }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      style={accent ? ({ "--stat-accent": accent } as React.CSSProperties) : undefined}
      className="admin-stat-card bg-white p-5 rounded-2xl border border-neutral-border/60 shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      <div className={`w-11 h-11 rounded-xl ${bg} ${color} flex items-center justify-center mb-4`}>
        <Icon size={20} strokeWidth={2.25} />
      </div>
      <p className="text-[12px] font-medium text-neutral-text-secondary">{label}</p>
      <p className="text-2xl font-bold text-primary-dark mt-0.5 tracking-tight">{value}</p>
      {hint && <p className="text-[11px] text-neutral-text-secondary/80 mt-1.5">{hint}</p>}
    </motion.div>
  );
}
