import React from 'react';
import {
  CalendarDays,
  UserPlus,
  DoorOpen,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const stats = [
  {
    label: 'Total Bookings',
    value: '24',
    change: '+12%',
    isUp: true,
    icon: CalendarDays,
    color: '#1F7A3A',
    bg: 'bg-[#1F7A3A]/10',
  },
  {
    label: 'Check-ins Today',
    value: '18',
    change: '+4%',
    isUp: true,
    icon: UserPlus,
    color: '#F59E0B',
    bg: 'bg-[#F59E0B]/10',
  },
  {
    label: 'Available Rooms',
    value: '35',
    change: '-2',
    isUp: false,
    icon: DoorOpen,
    color: '#3B82F6',
    bg: 'bg-blue-50',
  },
  {
    label: 'Revenue Today',
    value: 'Rs.45,000',
    change: '+8%',
    isUp: true,
    icon: TrendingUp,
    color: '#8B5CF6',
    bg: 'bg-purple-50',
  },
];

const StatsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-7 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="group bg-white rounded-[24px] border border-gray-100 p-6 lg:p-7 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
          >
            {/* Background decorative glow */}
            <div
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700"
              style={{ backgroundColor: stat.color }}
            />

            {/* Top row: icon + badge */}
            <div className="flex items-start justify-between mb-5 relative z-10">
              <div
                className={`w-12 h-12 rounded-[14px] ${stat.bg} flex items-center justify-center 
                            group-hover:scale-110 transition-transform duration-500`}
                style={{ color: stat.color }}
              >
                <Icon size={22} strokeWidth={2.5} />
              </div>
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${
                  stat.isUp ? 'text-[#1F7A3A] bg-[#1F7A3A]/10' : 'text-red-600 bg-red-50'
                }`}
              >
                {stat.isUp ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
                {stat.change}
              </span>
            </div>

            {/* Value + label */}
            <div className="relative z-10">
              <h3 className="text-3xl lg:text-[32px] font-black text-[#111827] tracking-tight leading-none mb-2">
                {stat.value}
              </h3>
              <p className="text-[12px] text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
