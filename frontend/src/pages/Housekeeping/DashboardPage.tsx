import React, { useState, useEffect } from "react";
import {
  Sparkles,
  DoorOpen,
  Hammer,
  Clock,
  CheckCircle2,
  UserSquare2,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import { housekeepingService } from "../../services/housekeepingService";
import { toast } from "react-hot-toast";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";

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
          <h1 className="text-3xl font-black text-[#111827] tracking-tight uppercase flex items-center gap-4">
            <div className="w-2 h-8 bg-[#14532D] rounded-full" />
            Housekeeping Command
          </h1>
          <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] mt-2 ml-6">Live operational control for room turnover</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={fetchData} className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#14532D] transition-all shadow-sm">
            <RefreshCcw size={18} />
          </Button>
          <Button className="px-6 py-4 bg-[#111827] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#14532D] transition-all shadow-xl shadow-black/10">
            Daily Log Report
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Ready", value: stats?.available || 0, icon: CheckCircle2, light: "bg-emerald-50", text: "text-emerald-600" },
          { label: "Dirty", value: stats?.cleaning || 0, icon: Clock, light: "bg-amber-50", text: "text-amber-600" },
          { label: "Occupied", value: stats?.occupied || 0, icon: DoorOpen, light: "bg-blue-50", text: "text-blue-600" },
          { label: "Maintenance", value: stats?.maintenance || 0, icon: Hammer, light: "bg-red-50", text: "text-red-600" },
        ].map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
            <div className="flex items-start justify-between">
              <div className={`w-14 h-14 rounded-2xl ${s.light} ${s.text} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <s.icon size={26} strokeWidth={2.5} />
              </div>
              <div className="text-right">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">{s.label}</h3>
                <p className="text-4xl font-black text-[#111827] mt-1 tracking-tighter">{s.value}</p>
              </div>
            </div>
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 ${s.light} opacity-0 group-hover:opacity-40 rounded-full blur-3xl transition-opacity duration-500`} />
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        <div className="xl:col-span-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-black text-[#111827] flex items-center gap-3 tracking-tighter uppercase">
               <Sparkles className="text-[#F59E0B]" size={24} /> Room Command Center
            </h2>
            <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
              {["All", "Dirty", "Clean", "Occupied"].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? "bg-white text-[#14532D] shadow-md border border-gray-100" : "text-gray-400 hover:text-gray-600"}`}
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
                <div key={room.id} className="bg-white p-7 rounded-[40px] border border-gray-100 hover:shadow-2xl transition-all relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-[32px] ${isClean ? 'bg-emerald-50' : isDirty ? 'bg-amber-50' : 'bg-blue-50'
                    } opacity-40 group-hover:scale-110 transition-transform duration-500`} />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">FLOOR {room.floor}</span>
                      <div className={`w-2.5 h-2.5 rounded-full ${isClean ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : isDirty ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                        }`} />
                    </div>
                    <h4 className="text-3xl font-black text-[#111827] leading-none mb-1 tracking-tighter">{room.roomNumber}</h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{room.status}</p>

                    <div className="mt-8 flex flex-col gap-3">
                      {isDirty ? (
                        <button onClick={() => handleMarkClean(room.id)} className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10 active:scale-95">
                          Mark Ready
                        </button>
                      ) : isClean ? (
                        <button onClick={() => handleStartCleaning(room)} className="w-full py-4 bg-[#14532D] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#111827] transition-all shadow-lg shadow-[#14532D]/10 active:scale-95">
                          Assign Task
                        </button>
                      ) : (
                        <div className="w-full py-4 bg-blue-50 text-blue-600 rounded-2xl text-[9px] font-black uppercase tracking-widest text-center border border-blue-100">Guest In Unit</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Recent Activity */}
        <div className="xl:col-span-4 space-y-12">
          <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] p-10 rounded-[48px] text-white relative overflow-hidden group border border-white/5 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F59E0B]/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-[2000ms]" />
            <UserSquare2 className="text-[#F59E0B] mb-8" size={32} />
            <h3 className="text-3xl font-black mb-2 leading-tight">Staff Core</h3>
            <p className="text-white/40 text-[11px] font-black uppercase tracking-widest mb-10 leading-relaxed">Manage active cleaning shifts and assignments.</p>
            <div className="space-y-4">
              {staff.slice(0, 3).map((s: any) => (
                <div key={s.id} className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/10 group/item hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[11px] font-black">{s.name.slice(0, 2).toUpperCase()}</div>
                    <span className="text-[12px] font-black uppercase">{s.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active</span>
                </div>
              ))}
              {staff.length === 0 && <p className="text-center py-6 text-white/20 text-[10px] font-black uppercase tracking-widest">No staff online</p>}
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-xl font-black text-[#111827] flex items-center gap-3 tracking-tighter uppercase">
              <Clock className="text-[#F59E0B]" size={24} /> Real-time Logs
            </h2>
            <div className="space-y-4">
              {rooms.filter(r => r.housekeepingLogs?.length > 0).slice(0, 4).map((room, i) => (
                <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center gap-5 hover:shadow-xl transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#14532D] transition-colors">
                    <Clock size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-black text-[#111827] uppercase">Room {room.roomNumber}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{room.housekeepingLogs[0].staffId || 'System'}</p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${room.housekeepingLogs[0].status === 'available' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
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
                  className={`flex items-center justify-between p-5 rounded-[24px] border transition-all ${selectedStaffId === s.staffId
                      ? "bg-[#111827] border-[#111827] text-white shadow-xl translate-x-1"
                      : "bg-white border-gray-100 text-gray-500 hover:border-[#14532D]/30"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-black ${selectedStaffId === s.staffId ? "bg-white/10" : "bg-gray-50"
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
