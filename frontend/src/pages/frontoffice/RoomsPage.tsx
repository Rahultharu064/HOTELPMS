import React, { useState, useEffect } from "react";
import { 
  Search, BedDouble, CheckCircle2, 
  Plus, User, Hammer, Sparkles, RefreshCw
} from "lucide-react";
import { frontOfficeService } from "../../services/frontofficeService";
import { toast } from "react-hot-toast";
import { CreateOfflineReservationModal } from "../../components/Admin/Dashboard/CreateOfflineReservationModal";
import { PortalRoomGridSkeleton } from "../../components/ui/skeletons/AdminSkeletons";

const roomStatusStyles: Record<string, { bg: string, text: string, icon: any, dot: string, border: string }> = {
  vacant: { bg: "bg-green-50", text: "text-green-700", icon: CheckCircle2, dot: "bg-green-500", border: "border-green-100" },
  occupied: { bg: "bg-red-50", text: "text-red-700", icon: User, dot: "bg-red-500", border: "border-red-100" },
  reserved: { bg: "bg-blue-50", text: "text-blue-700", icon: Sparkles, dot: "bg-blue-500", border: "border-blue-100" },
  maintenance: { bg: "bg-amber-50", text: "text-amber-700", icon: Hammer, dot: "bg-amber-500", border: "border-amber-100" },
  cleaning: { bg: "bg-purple-50", text: "text-purple-700", icon: Sparkles, dot: "bg-purple-500", border: "border-purple-100" },
};

const RoomsPageFO: React.FC = () => {
  const [activeFloor, setActiveFloor] = useState<number | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | undefined>(undefined);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await frontOfficeService.getRoomBoard();
      if (res.success) setRooms(res.data);
    } catch (error: any) {
      toast.error(error.message || "Failed to synchronize room intelligence ledger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter(r => {
    const matchesFloor = activeFloor === "All" || r.floor === activeFloor;
    const matchesSearch = r.roomNumber.includes(searchQuery) || r.roomType?.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFloor && matchesSearch;
  });

  const stats = {
    vacant: rooms.filter(r => r.occupancyStatus === "vacant").length,
    occupied: rooms.filter(r => r.occupancyStatus === "occupied").length,
    reserved: rooms.filter(r => r.occupancyStatus === "reserved").length,
  };

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight">Room Inventory</h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Real-time room occupancy and maintenance monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchRooms} className="px-5 py-3 bg-white border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-[#111827] transition-all">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Sync Ledger
          </button>
          <button 
            onClick={() => {
              setSelectedRoomId(undefined);
              setIsModalOpen(true);
            }}
            className="px-6 py-3 bg-[#14532D] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#1F7A3A] transition-all shadow-xl shadow-[#1F7A3A]/20 flex items-center gap-2"
          >
            <Plus size={16} strokeWidth={3} /> New Reservation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Vacant Units", count: stats.vacant, style: roomStatusStyles.vacant },
          { label: "Active Presence", count: stats.occupied, style: roomStatusStyles.occupied },
          { label: "Confirmed Arrivals", count: stats.reserved, style: roomStatusStyles.reserved },
        ].map((s, i) => (
          <div key={i} className={`p-6 rounded-[32px] border ${s.style.border} ${s.style.bg} relative overflow-hidden group hover:shadow-lg transition-all`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] ${s.style.text}`}>{s.label}</h3>
              <s.style.icon size={18} className={s.style.text} strokeWidth={2.5} />
            </div>
            <p className={`text-4xl font-black ${s.style.text} tracking-tight`}>{s.count}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 lg:pb-0 w-full lg:w-auto">
          {["All", 1, 2, 3, 4, 5, 6].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFloor(f as any)}
              className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeFloor === f ? "bg-[#111827] text-white shadow-lg" : "text-gray-400 hover:text-[#111827]"}`}
            >
              Floor {f === "All" ? "All" : f}
            </button>
          ))}
        </div>
        <div className="relative flex-1 lg:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input placeholder="Filter rooms..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50/50 rounded-[20px] text-[13px]" />
        </div>
      </div>

      {loading ? (
        <PortalRoomGridSkeleton count={12} />
      ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {filteredRooms.map((r, i) => {
          const style = roomStatusStyles[r.occupancyStatus] || roomStatusStyles.vacant;
          return (
            <div key={i} className="group bg-white p-8 rounded-[40px] border border-gray-100 hover:shadow-xl transition-all relative flex flex-col items-center text-center">
              <div className={`absolute top-6 right-6 w-2 h-2 rounded-full ${style.dot} ${r.occupancyStatus === 'vacant' ? 'animate-pulse' : ''}`} />
              <div className={`w-14 h-14 rounded-2xl ${style.bg} ${style.text} flex items-center justify-center mb-4 mx-auto`}><BedDouble size={24} /></div>
              <h4 className="text-2xl font-black text-[#111827] tracking-tighter">Room {r.roomNumber}</h4>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F59E0B] mt-1">{r.roomType?.name}</p>

              <div className="mt-auto pt-6 border-t border-gray-50 w-full">
                 <div className="mb-4">
                    {r.currentBooking ? (
                        <div className="flex flex-col items-center">
                            <p className="text-[10px] font-black text-[#111827] truncate w-full uppercase">{r.currentBooking.guest?.firstName} {r.currentBooking.guest?.lastName}</p>
                            <p className="text-[8px] font-bold text-gray-400 uppercase">Check-out: {new Date(r.currentBooking.checkOut).toLocaleDateString()}</p>
                        </div>
                    ) : <p className="text-[10px] font-bold text-gray-300 uppercase">Available</p>}
                 </div>
                 <div className={`px-2 py-2 rounded-xl border border-transparent ${style.bg} group/btn transition-all relative`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${style.text} group-hover/btn:opacity-0 transition-opacity`}>{r.occupancyStatus}</p>
                    {r.occupancyStatus === 'vacant' && (
                        <button 
                            onClick={() => {
                                setSelectedRoomId(r.id);
                                setIsModalOpen(true);
                            }}
                            className="absolute inset-0 flex items-center justify-center bg-green-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest opacity-0 group-hover/btn:opacity-100 transition-opacity"
                        >
                            Book Room
                        </button>
                    )}
                  </div>
              </div>
            </div>
          );
        })}
      </div>
      )}
      <CreateOfflineReservationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchRooms();
        }}
        initialRoomId={selectedRoomId}
      />
    </div>
  );
};

export default RoomsPageFO;
