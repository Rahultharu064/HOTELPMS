import React from 'react';
import { PlusCircle, UserPlus, UserMinus, Bed, Zap } from 'lucide-react';

const actions = [
  { label: 'New Booking',    Icon: PlusCircle, variant: 'primary' as const },
  { label: 'Check-in Guest', Icon: UserPlus,   variant: 'secondary' as const },
  { label: 'Check-out',      Icon: UserMinus,  variant: 'outline' as const },
  { label: 'View Rooms',     Icon: Bed,        variant: 'outline'  as const },
];

const variantClasses = {
  primary: 'bg-[#1F7A3A] text-white hover:bg-[#14532D] shadow-lg shadow-green-900/10 border border-[#14532D]/20',
  secondary: 'bg-[#F59E0B] text-white hover:bg-[#D97706] shadow-lg shadow-orange-900/10 border border-[#D97706]/20',
  outline: 'bg-white text-gray-600 border border-gray-100 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-900 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]',
};

const QuickActions: React.FC = () => {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
          <Zap size={16} className="text-[#F59E0B] fill-[#F59E0B]/20" />
          Quick Actions
        </h3>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Shortcut panel</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, idx) => {
          const Icon = action.Icon;
          return (
            <button
              key={idx}
              className={`flex flex-col items-center justify-center gap-3 h-24 rounded-[16px] text-xs font-bold transition-all duration-300 active:scale-[0.97] group cursor-pointer ${variantClasses[action.variant]}`}
            >
              <div className={`p-2 rounded-xl bg-black/5 group-hover:scale-110 transition-transform ${action.variant === 'outline' ? 'bg-gray-50' : ''}`}>
                 <Icon size={20} strokeWidth={2.5} />
              </div>
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
