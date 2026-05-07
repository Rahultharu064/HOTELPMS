import { motion } from "framer-motion";
import { Activity, LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  trend: string;
  positive: boolean;
}

export function StatCard({ label, value, icon: Icon, color, bg, trend, positive }: StatCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group bg-white p-8 rounded-[40px] border border-gray-100 hover:border-[#14532D]/20 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
    >
      <div className="flex items-start justify-between relative z-10">
        <div className={`w-16 h-16 rounded-[24px] ${bg} ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={28} strokeWidth={2.5} />
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-[10px] font-black ${positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
          <Activity size={12} strokeWidth={3} />
          {trend}
        </div>
      </div>
      <div className="mt-8 relative z-10">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</h3>
        <p className="text-4xl font-black text-[#111827] mt-1 tracking-tighter truncate">{value}</p>
      </div>
      {/* Subtle background decoration */}
      <div className={`absolute -bottom-6 -right-6 w-32 h-32 ${bg} opacity-0 group-hover:opacity-40 rounded-full blur-3xl transition-opacity duration-500`} />
    </motion.div>
  );
}
