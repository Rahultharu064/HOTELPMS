import React from 'react';
import { PlusCircle, UserPlus, UserMinus, Command } from 'lucide-react';
import { motion } from 'framer-motion';

const actions = [
  { label: 'New Booking', Icon: PlusCircle, bg: 'bg-primary-green', hoverBg: 'hover:bg-primary-dark' },
  { label: 'Check-in Guest', Icon: UserPlus, bg: 'bg-primary-orange', hoverBg: 'hover:bg-primary-dark' },
  { label: 'Check-out Guest', Icon: UserMinus, bg: 'bg-primary-gold', hoverBg: 'hover:bg-primary-dark' },
];

const QuickActions: React.FC = () => {
  return (
    <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm overflow-hidden relative group">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-neutral-text-primary flex items-center gap-3 uppercase tracking-tight">
          <div className="w-10 h-10 rounded-2xl bg-primary-green/10 flex items-center justify-center text-primary-green">
            <Command size={20} strokeWidth={3} />
          </div>
          Operational Fast-Track
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {actions.map((action, idx) => (
          <motion.button
            key={idx}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center justify-center gap-4 px-8 py-5 rounded-[24px] text-white font-black uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-black/10 ${action.bg} ${action.hoverBg}`}
          >
            <action.Icon size={18} strokeWidth={3} />
            <span>{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
