import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Visitor {
  id: number;
  name: string;
  date: string;
  avatar?: string;
}

const upcomingVisitors: Visitor[] = [
  { id: 1, name: "Don Norman", date: "05 Oct, 2024", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
  { id: 2, name: "Sarah Johnson", date: "12 Oct, 2024", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
  { id: 3, name: "Michael Chen", date: "18 Oct, 2024", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
];

export function DashboardSidebar() {
  const [currentMonth] = React.useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const highlightedDays = [5, 12, 18, 25, 28];

  return (
    <div className="space-y-5">
      {/* Calendar Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl border border-neutral-border/30 shadow-sm p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-primary-dark tracking-tight">Trip Listing</h3>
          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-neutral-light rounded-lg transition-colors">
              <ChevronLeft size={14} className="text-neutral-text-secondary" />
            </button>
            <button className="p-1 hover:bg-neutral-light rounded-lg transition-colors">
              <ChevronRight size={14} className="text-neutral-text-secondary" />
            </button>
          </div>
        </div>
        
        <div className="text-center mb-3">
          <p className="text-[10px] font-bold text-[#14532D] uppercase tracking-wider">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </p>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-[9px] font-bold text-neutral-text-secondary uppercase">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isHighlighted = highlightedDays.includes(day);
            return (
              <div
                key={day}
                className={`aspect-square flex items-center justify-center text-[10px] font-bold rounded-lg cursor-pointer transition-all
                  ${isHighlighted 
                    ? "bg-[#14532D] text-white hover:bg-[#1F7A3A]" 
                    : "text-neutral-text-secondary hover:bg-neutral-light"
                  }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Upcoming Visitors */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-neutral-border/30 shadow-sm p-4"
      >
        <h3 className="text-xs font-bold text-primary-dark tracking-tight mb-3">Upcoming Visitors</h3>
        
        <div className="space-y-2">
          {upcomingVisitors.map((visitor) => (
            <div
              key={visitor.id}
              className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-neutral-light/50 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#14532D]/20">
                <img
                  src={visitor.avatar}
                  alt={visitor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-primary-dark truncate">{visitor.name}</p>
                <p className="text-[9px] font-medium text-neutral-text-secondary">{visitor.date}</p>
              </div>
              <button className="px-2 py-1 bg-[#14532D]/10 text-[#14532D] text-[9px] font-bold uppercase tracking-wider rounded-lg hover:bg-[#14532D] hover:text-white transition-all">
                Details
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
