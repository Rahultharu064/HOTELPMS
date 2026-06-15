import React from 'react';
import { Clock, UserSquare2 } from 'lucide-react';

interface HousekeepingStaffPanelProps {
  staff: any[];
  rooms: any[];
}

const HousekeepingStaffPanel: React.FC<HousekeepingStaffPanelProps> = ({ staff, rooms }) => (
  <div className="space-y-12">
    <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] p-10 rounded-[48px] text-white relative overflow-hidden group border border-white/5 shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F59E0B]/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-[2000ms]" />
      <UserSquare2 className="text-[#F59E0B] mb-8" size={32} />
      <h3 className="text-3xl font-black mb-2 leading-tight">Staff Core</h3>
      <p className="text-white/40 text-[11px] font-black uppercase tracking-widest mb-10 leading-relaxed">
        Manage active cleaning shifts and assignments.
      </p>
      <div className="space-y-4">
        {staff.slice(0, 3).map((s: any) => (
          <div
            key={s.id}
            className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/10 group/item hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[11px] font-black">
                {s.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-[12px] font-black uppercase">{s.name}</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active</span>
          </div>
        ))}
        {staff.length === 0 && (
          <p className="text-center py-6 text-white/20 text-[10px] font-black uppercase tracking-widest">
            No staff online
          </p>
        )}
      </div>
    </div>

    <div className="space-y-8">
      <h2 className="text-xl font-black text-[#111827] flex items-center gap-3 tracking-tighter uppercase">
        <Clock className="text-[#F59E0B]" size={24} /> Real-time Logs
      </h2>
      <div className="space-y-4">
        {rooms
          .filter((r) => r.housekeepingLogs?.length > 0)
          .slice(0, 4)
          .map((room, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center gap-5 hover:shadow-xl transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#14532D] transition-colors">
                <Clock size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-black text-[#111827] uppercase">Room {room.roomNumber}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  {room.housekeepingLogs[0].staffId || 'System'}
                </p>
              </div>
              <div
                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  room.housekeepingLogs[0].status === 'available'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-amber-50 text-amber-600'
                }`}
              >
                {room.housekeepingLogs[0].status}
              </div>
            </div>
          ))}
      </div>
    </div>
  </div>
);

export default HousekeepingStaffPanel;
