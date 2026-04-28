import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  DoorOpen, 
  Hammer, 
  Clock, 
  ArrowUpRight,
  CheckCircle2,
  UserSquare2,
  Loader2,
  RefreshCcw,
  AlertCircle,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import { housekeepingService } from "../../services/housekeepingService";
import { toast } from "react-hot-toast";
import { Modal } from "../../components/ui/Modal";

const DashboardPage: React.FC = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  
  // Assignment Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [selectedStaffId, setSelectedStaffId] = useState("");

  useEffect(() => {
    fetchData();
    
    // Listen for global updates (e.g. from sidebar assignment)
    window.addEventListener('housekeeping-data-updated', fetchData);
    
    const interval = setInterval(fetchData, 30000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('housekeeping-data-updated', fetchData);
    };
  }, []);


  const fetchData = async () => {
    try {
      const [roomsRes, statsRes, staffRes] = await Promise.all([
        housekeepingService.getRoomStatuses(),
        housekeepingService.getStats(),
        housekeepingService.getStaff()
      ]);
      if (roomsRes.success) setRooms(roomsRes.data);
      if (statsRes.success) setStats(statsRes.data);
      if (staffRes.success) setStaff(staffRes.data);
    } catch (error) {
      console.error("Failed to sync", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCleaning = (room: any) => {
    setSelectedRoom(room);
    setIsAssignModalOpen(true);
  };

  const confirmAssignment = async () => {
    if (!selectedRoom || !selectedStaffId) {
      toast.error("Please select a staff member");
      return;
    }

    try {
      toast.loading('Assigning task...', { id: 'assign-task' });
      const res = await housekeepingService.updateRoomStatus(selectedRoom.id, {
        status: 'cleaning',
        staffId: selectedStaffId,
        type: 'general',
        notes: `Task assigned to ${selectedStaffId}`
      });
      if (res.success) {
        toast.success(`Room ${selectedRoom.roomNumber} assigned successfully`, { id: 'assign-task' });
        setIsAssignModalOpen(false);
        setSelectedStaffId("");
        fetchData();
      }
    } catch (error) {
      toast.error('Assignment failed');
    }
  };

  const handleMarkClean = async (roomId: number) => {
    try {
      toast.loading('Updating status...', { id: 'status-update' });
      const res = await housekeepingService.updateRoomStatus(roomId, {
        status: 'available',
        type: 'general',
        notes: `Room marked as clean and ready`
      });
      if (res.success) {
        toast.success(`Room marked as Ready`, { id: 'status-update' });
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to update room');
    }
  };

  const filteredRooms = rooms.filter(r => {
    if (filter === "All") return true;
    if (filter === "Dirty") return r.status === "cleaning";
    if (filter === "Clean") return r.status === "available";
    if (filter === "Occupied") return r.status === "occupied";
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#14532D]" />
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Syncing Housekeeping Command...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight">Housekeeping Command</h1>
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mt-2">Live operational control for room turnover</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#14532D] transition-all">
            <RefreshCcw size={18} />
          </button>
          <button className="px-6 py-4 bg-[#111827] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#14532D] transition-all">
            Daily Log Report
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Ready", value: stats?.available || 0, icon: CheckCircle2, light: "bg-emerald-50", text: "text-emerald-600" },
          { label: "Dirty", value: stats?.cleaning || 0, icon: Clock, light: "bg-amber-50", text: "text-amber-600" },
          { label: "Occupied", value: stats?.occupied || 0, icon: DoorOpen, light: "bg-blue-50", text: "text-blue-600" },
          { label: "In Maintenance", value: stats?.maintenance || 0, icon: Hammer, light: "bg-red-50", text: "text-red-600" },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div className={`w-14 h-14 rounded-2xl ${s.light} ${s.text} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <s.icon size={26} strokeWidth={2.5} />
              </div>
              <div className="text-right">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">{s.label}</h3>
                <p className="text-3xl font-black text-[#111827] mt-1">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-black text-[#111827] flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#14532D] rounded-full" />
              Room Grid
            </h2>
            <div className="flex items-center bg-gray-100 p-1 rounded-xl">
              {["All", "Dirty", "Clean", "Occupied"].map(f => (
                <button 
                  key={f} 
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? "bg-white text-[#111827] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {filteredRooms.map((room) => {
              const isDirty = room.status === 'cleaning';
              const isClean = room.status === 'available';
              const isOccupied = room.status === 'occupied';

              return (
                <div key={room.id} className="bg-white p-5 rounded-[28px] border border-gray-100 hover:shadow-xl transition-all relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 w-12 h-12 rounded-bl-[20px] ${
                    isClean ? 'bg-emerald-50' : isDirty ? 'bg-amber-50' : 'bg-blue-50'
                  }`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Floor {room.floor}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        isClean ? 'bg-emerald-500' : isDirty ? 'bg-amber-500' : 'bg-blue-500'
                      }`} />
                    </div>
                    <h4 className="text-2xl font-black text-[#111827] leading-none mb-1">{room.roomNumber}</h4>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{room.status}</p>

                    <div className="mt-6 flex flex-col gap-2">
                       {isDirty ? (
                         <button onClick={() => handleMarkClean(room.id)} className="w-full py-2 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all">
                           Mark Ready
                         </button>
                       ) : isClean ? (
                         <button onClick={() => handleStartCleaning(room)} className="w-full py-2 bg-[#111827] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#14532D] transition-all">
                           Assign Task
                         </button>
                       ) : (
                         <div className="w-full py-2 bg-blue-50 text-blue-600 rounded-xl text-[8px] font-black uppercase tracking-widest text-center">Guest In Unit</div>
                       )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Recent Activity */}
        <div className="xl:col-span-4 space-y-8">
           <div className="bg-[#111827] p-8 rounded-[40px] text-white relative overflow-hidden">
              <UserSquare2 className="text-[#F59E0B] mb-4" size={32} />
              <h3 className="text-xl font-black mb-1">Staff Control</h3>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-8">Manage active cleaning shifts</p>
              <div className="space-y-3">
                 {staff.slice(0, 3).map((s: any) => (
                   <div key={s.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <span className="text-[11px] font-black uppercase">{s.name}</span>
                      <span className="text-[9px] font-bold text-emerald-400 uppercase">On Duty</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="space-y-6">
              <h2 className="text-xl font-black text-[#111827] flex items-center gap-3">
                <div className="w-1.5 h-6 bg-[#F59E0B] rounded-full" />
                Recent Logs
              </h2>
              <div className="space-y-3">
                 {rooms.filter(r => r.housekeepingLogs?.length > 0).slice(0, 4).map((room, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                          <Clock size={18} />
                       </div>
                       <div className="flex-1">
                          <p className="text-[11px] font-black text-[#111827]">Room {room.roomNumber}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{room.housekeepingLogs[0].staffId || 'System'}</p>
                       </div>
                       <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${
                          room.housekeepingLogs[0].status === 'available' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                       }`}>{room.housekeepingLogs[0].status}</div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Assignment Modal */}
      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title="Assign Cleaning Task">
         <div className="space-y-6 p-2">
            <div className="p-6 bg-[#14532D]/5 rounded-3xl border border-[#14532D]/10">
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Room to assign</p>
               <h3 className="text-2xl font-black text-[#111827]">Unit {selectedRoom?.roomNumber}</h3>
               <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{selectedRoom?.roomType}</p>
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Select Available Staff</label>
               <div className="grid grid-cols-1 gap-2">
                  {staff.filter(s => s.status === 'on_duty').map((s: any) => (
                    <button 
                      key={s.id}
                      onClick={() => setSelectedStaffId(s.staffId)}
                      className={`flex items-center justify-between p-5 rounded-[24px] border transition-all ${
                        selectedStaffId === s.staffId 
                          ? "bg-[#111827] border-[#111827] text-white shadow-xl translate-x-1" 
                          : "bg-white border-gray-100 text-gray-500 hover:border-[#14532D]/30"
                      }`}
                    >
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-black ${
                            selectedStaffId === s.staffId ? "bg-white/10" : "bg-gray-50"
                          }`}>{s.name.slice(0, 2).toUpperCase()}</div>
                          <div className="text-left">
                             <p className="text-[13px] font-black uppercase leading-none">{s.name}</p>
                             <p className={`text-[9px] font-bold uppercase mt-1 ${selectedStaffId === s.staffId ? "text-white/40" : "text-gray-400"}`}>{s.role}</p>
                          </div>
                       </div>
                       {selectedStaffId === s.staffId && <div className="w-2 h-2 rounded-full bg-[#F59E0B] shadow-[0_0_8px_#F59E0B]" />}
                    </button>
                  ))}
                  {staff.length === 0 && (
                    <p className="p-8 text-center text-[11px] font-black uppercase text-gray-300">No staff members found. Please add staff first.</p>
                  )}
               </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
               <button onClick={() => setIsAssignModalOpen(false)} className="flex-1 py-4 border border-gray-100 rounded-2xl text-[11px] font-black uppercase text-gray-400 hover:bg-gray-50">Cancel</button>
               <button 
                onClick={confirmAssignment}
                disabled={!selectedStaffId}
                className="flex-[2] py-4 bg-[#14532D] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#111827] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-[#14532D]/20"
               >
                 Confirm Assignment
               </button>
            </div>
         </div>
      </Modal>
    </motion.div>
  );
};

export default DashboardPage;
