import React, { useState, useEffect } from "react";
import {
  Search,
  CheckCircle2,
  Clock,
  Hammer,
  Loader2,
  RefreshCcw
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { housekeepingService } from "../../services/housekeepingService";
import { toast } from "react-hot-toast";
import { Button } from "../../components/ui/Button";

const RoomStatusPage: React.FC = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await housekeepingService.getRoomStatuses();
      if (res.success) setRooms(res.data);
    } catch (error) {
      toast.error("Failed to load room status");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (roomId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'cleaning' ? 'available' : 'cleaning';
    try {
      toast.loading('Processing...', { id: 'room-action' });
      const res = await housekeepingService.updateRoomStatus(roomId, {
        status: nextStatus,
        type: 'general',
        notes: `Updated from Room Status Board`
      });
      if (res.success) {
        toast.success(`Room status updated to ${nextStatus}`, { id: 'room-action' });
        fetchRooms();
      }
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const filteredRooms = rooms.filter(r => {
    const matchesFilter = filter === "All" ||
      (filter === "Clean" && r.status === "available") ||
      (filter === "Dirty" && r.status === "cleaning") ||
      (filter === "Maintenance" && r.status === "maintenance") ||
      (filter === "Occupied" && r.status === "occupied");
    const matchesSearch = r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#14532D]" />
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Syncing Status Board...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight uppercase flex items-center gap-4">
            <div className="w-2 h-8 bg-[#14532D] rounded-full" />
            Room Status Inventory
          </h1>
          <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] mt-2 ml-6">Track real-time room occupancy and cleaning cycles</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={fetchRooms}
            className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#14532D] transition-all shadow-sm"
          >
            <RefreshCcw size={18} />
          </Button>
          <Button className="px-6 py-4 bg-[#111827] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#14532D] transition-all shadow-xl shadow-black/10">
            Status Report
          </Button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto no-scrollbar">
          {["All", "Clean", "Dirty", "Occupied", "Maintenance"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${filter === f
                  ? "bg-[#14532D] text-white shadow-lg shadow-black/10"
                  : "text-gray-400 hover:text-[#111827] hover:bg-gray-50"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" strokeWidth={2.5} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search room number..."
            className="w-full pl-14 pr-4 py-4 bg-gray-50/50 border border-transparent rounded-[24px] text-sm font-medium focus:outline-none focus:border-[#14532D]/20 focus:bg-white transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredRooms.map((room) => {
          const isDirty = room.status === 'cleaning';
          const isClean = room.status === 'available';
          const isOccupied = room.status === 'occupied';
          const isMaintenance = room.status === 'maintenance';

          return (
            <motion.div
              whileHover={{ y: -8 }}
              key={room.id}
              className="group bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative flex flex-col items-center text-center"
            >
              <div className={`absolute top-8 right-10 w-2.5 h-2.5 rounded-full ${isClean ? 'bg-emerald-500' : isDirty ? 'bg-amber-500' : isOccupied ? 'bg-blue-500' : 'bg-red-500'
                }`} />

              <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ${isClean ? 'bg-emerald-50 text-emerald-600' : isDirty ? 'bg-amber-50 text-amber-600' : isOccupied ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                }`}>
                {isClean ? <CheckCircle2 size={32} /> : isDirty ? <Clock size={32} /> : isMaintenance ? <Hammer size={32} /> : <CheckCircle2 size={32} />}
              </div>

              <h3 className="text-3xl font-black text-[#111827] tracking-tighter shrink-0 mb-1">Room {room.roomNumber}</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#F59E0B] mb-8">Floor {room.floor || 'G'}</p>

              <div className="space-y-4 w-full pt-8 border-t border-gray-50">
                <div className="flex items-center justify-between px-2">
                  <div className="text-left">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Last Activity</p>
                    <p className="text-[11px] font-bold text-[#111827]">
                      {room.housekeepingLogs?.[0] ? new Date(room.housekeepingLogs[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'None'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                    <p className="text-[11px] font-bold text-[#111827] uppercase">{room.status}</p>
                  </div>
                </div>

                {isDirty ? (
                  <button
                    onClick={() => handleAction(room.id, room.status)}
                    className="w-full py-4 rounded-[20px] bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all"
                  >
                    Mark Ready
                  </button>
                ) : isClean ? (
                  <button
                    onClick={() => handleAction(room.id, room.status)}
                    className="w-full py-4 rounded-[20px] bg-[#111827] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#14532D] transition-all"
                  >
                    Set To Cleaning
                  </button>
                ) : (
                  <Link
                    to={`/housekeeping/rooms/${room.id}`}
                    className="w-full block py-4 rounded-[20px] bg-gray-100 text-[#111827] text-[10px] font-black uppercase tracking-widest hover:bg-white hover:shadow-md transition-all text-center"
                  >
                    View Details
                  </Link>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomStatusPage;
