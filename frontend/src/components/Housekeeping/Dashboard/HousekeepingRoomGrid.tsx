import React from 'react';
import { Sparkles } from 'lucide-react';

interface HousekeepingRoomGridProps {
  rooms: any[];
  filter: string;
  onFilterChange: (filter: string) => void;
  onMarkClean: (roomId: number) => void;
  onStartCleaning: (room: any) => void;
}

const HousekeepingRoomGrid: React.FC<HousekeepingRoomGridProps> = ({
  rooms,
  filter,
  onFilterChange,
  onMarkClean,
  onStartCleaning,
}) => {
  const filteredRooms = rooms.filter((r) => {
    if (filter === 'All') return true;
    if (filter === 'Dirty') return r.status === 'cleaning';
    if (filter === 'Clean') return r.status === 'available';
    if (filter === 'Occupied') return r.status === 'occupied';
    return true;
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-black text-[#111827] flex items-center gap-3 tracking-tighter uppercase">
          <Sparkles className="text-[#F59E0B]" size={24} /> Room Command Center
        </h2>
        <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
          {['All', 'Dirty', 'Clean', 'Occupied'].map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f
                  ? 'bg-white text-[#14532D] shadow-md border border-gray-100'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredRooms.map((room) => {
          const isDirty = room.status === 'cleaning';
          const isClean = room.status === 'available';

          return (
            <div
              key={room.id}
              className="bg-white p-7 rounded-[40px] border border-gray-100 hover:shadow-2xl transition-all relative overflow-hidden group"
            >
              <div
                className={`absolute top-0 right-0 w-16 h-16 rounded-bl-[32px] ${
                  isClean ? 'bg-emerald-50' : isDirty ? 'bg-amber-50' : 'bg-blue-50'
                } opacity-40 group-hover:scale-110 transition-transform duration-500`}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    FLOOR {room.floor}
                  </span>
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      isClean
                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                        : isDirty
                          ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                          : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                    }`}
                  />
                </div>
                <h4 className="text-3xl font-black text-[#111827] leading-none mb-1 tracking-tighter">
                  {room.roomNumber}
                </h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{room.status}</p>

                <div className="mt-8 flex flex-col gap-3">
                  {isDirty ? (
                    <button
                      onClick={() => onMarkClean(room.id)}
                      className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
                    >
                      Mark Ready
                    </button>
                  ) : isClean ? (
                    <button
                      onClick={() => onStartCleaning(room)}
                      className="w-full py-4 bg-[#14532D] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#111827] transition-all shadow-lg shadow-[#14532D]/10 active:scale-95"
                    >
                      Assign Task
                    </button>
                  ) : (
                    <div className="w-full py-4 bg-blue-50 text-blue-600 rounded-2xl text-[9px] font-black uppercase tracking-widest text-center border border-blue-100">
                      Guest In Unit
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HousekeepingRoomGrid;
