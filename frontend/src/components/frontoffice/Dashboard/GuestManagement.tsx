import React from 'react';
import { ArrowRight, Star, MoreHorizontal, Users, ShieldCheck } from 'lucide-react';

const guests = [
  { name: 'Rahul Tharu', type: 'VIP', stayCount: 8, rating: 5, bg: 'from-orange-400 to-[#F59E0B]' },
  { name: 'Maya Sharma',  type: 'Regular', stayCount: 3, rating: 4, bg: 'from-[#1F7A3A] to-[#14532D]' },
  { name: 'Bibek Magar',  type: 'Regular', stayCount: 1, rating: 5, bg: 'from-[#3B82F6] to-blue-800' },
];

const GuestManagement: React.FC = () => {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] p-6 lg:p-7 relative overflow-hidden flex flex-col h-full">
      {/* Decorative Blob */}
      <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-[#F59E0B]/[0.02] blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-7 relative z-10">
        <div>
          <h3 className="text-[15px] font-extrabold text-[#111827] flex items-center gap-2 mb-1">
            <Users size={18} className="text-[#F59E0B]" />
            Guest Activity
          </h3>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-6">Recent profiles</p>
        </div>
        <button className="p-2 rounded-xl text-gray-400 bg-gray-50 border border-gray-100 hover:text-[#111827] hover:bg-white shadow-sm transition-colors cursor-pointer group">
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Guest list */}
      <div className="space-y-4 relative z-10 flex-1">
        {guests.map((guest, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-4 rounded-[16px] border border-gray-100 bg-white hover:border-[#1F7A3A]/20 hover:bg-gray-50/50 shadow-sm transition-all group cursor-pointer"
          >
            {/* Avatar */}
            <div className={`w-12 h-12 rounded-[14px] bg-gradient-to-br ${guest.bg} text-white flex items-center justify-center text-[13px] font-black shadow-inner shadow-white/20 shrink-0 group-hover:scale-105 transition-transform duration-300`}>
              {guest.name.split(' ').map((n) => n[0]).join('')}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-[#111827] truncate group-hover:text-[#1F7A3A] transition-colors">{guest.name}</p>
              <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                {guest.type === 'VIP' ? (
                  <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-md">
                    <ShieldCheck size={10} /> {guest.type}
                  </span>
                ) : (
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
                    {guest.type}
                  </span>
                )}
                
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{guest.stayCount} <span className="text-gray-300">Stays</span></span>
                
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-md">
                  <Star size={10} className="fill-[#F59E0B] text-[#F59E0B]" />
                  {guest.rating}.0
                </span>
              </div>
            </div>

            {/* Action Menu */}
            <button
               type="button"
               title="Guest options"
               className="w-8 h-8 rounded-[10px] flex items-center justify-center text-gray-300 hover:text-[#1F7A3A] hover:bg-[#1F7A3A]/5 transition-colors shrink-0 bg-white border border-gray-100 shadow-sm"
               onClick={(e) => { e.stopPropagation(); }}
            >
               <MoreHorizontal size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuestManagement;
