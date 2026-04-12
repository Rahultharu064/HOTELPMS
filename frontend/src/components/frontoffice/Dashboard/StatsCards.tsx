import React from 'react';
import {
  CalendarDays,
  UserPlus,
  DoorOpen,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  {
    label: 'Total Bookings Today',
    value: '24',
    icon: CalendarDays,
    color: 'text-primary-green',
    bg: 'bg-primary-green/10',
  },
  {
    label: 'Check-ins Today',
    value: '18',
    icon: UserPlus,
    color: 'text-primary-gold',
    bg: 'bg-primary-gold/10',
  },
  {
    label: 'Available Rooms',
    value: '35',
    icon: DoorOpen,
    color: 'text-primary-orange',
    bg: 'bg-primary-orange/10',
  },
  {
    label: 'Revenue Today',
    value: 'Rs. 45,500',
    icon: TrendingUp,
    color: 'text-primary-green',
    bg: 'bg-primary-green/10',
  },
];

const StatsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          whileHover={{ y: -8, scale: 1.02 }}
          className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-[40px] pointer-events-none group-hover:bg-primary-green/5 transition-colors duration-500" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-lg shadow-black/5 group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon size={26} strokeWidth={3} />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-[#111827] tracking-tighter mb-1">{stat.value}</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
