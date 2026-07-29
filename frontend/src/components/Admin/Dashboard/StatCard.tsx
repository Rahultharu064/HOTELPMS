import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  /** Optional period-over-period comparison — omit when no historical baseline is available */
  trend?: string;
  trendValue?: string;
  positive?: boolean;
}

export function StatCard({ label, value, icon: Icon, color, bg, trend, trendValue, positive }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-white p-5 rounded-2xl border border-neutral-border/30 hover:border-primary-dark/30 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
    >
      <div className="flex items-start justify-between relative z-10">
        <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        {trendValue && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${positive ? "bg-primary-dark/10 text-primary-dark" : "bg-red-50 text-red-600"}`}>
            {positive ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
            {trendValue}
          </div>
        )}
      </div>
      <div className="mt-3 relative z-10">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-text-secondary">{label}</h3>
        <p className="text-xl font-black text-primary-dark mt-1 tracking-tight">{value}</p>
        {trend && (
          <p className={`text-[9px] font-medium mt-1 ${positive ? "text-primary-dark" : "text-red-600"}`}>{trend}</p>
        )}
      </div>
    </motion.div>
  );
}
