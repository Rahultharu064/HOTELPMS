import React, { useState, useEffect, Suspense, lazy } from "react";
import {
  DoorOpen,
  Hammer,
  Clock,
  CheckCircle2,
  RefreshCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import { housekeepingService } from "../../services/housekeepingService";
import { toast } from "react-hot-toast";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { SectionLoader } from "../../components/ui/PageLoader";
import { PortalDashboardSkeleton } from "../../components/ui/skeletons/AdminSkeletons";

const HousekeepingRoomGrid = lazy(() => import("../../components/Housekeeping/Dashboard/HousekeepingRoomGrid"));
const HousekeepingStaffPanel = lazy(() => import("../../components/Housekeeping/Dashboard/HousekeepingStaffPanel"));

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

  if (loading) {
    return <PortalDashboardSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white/60 backdrop-blur-sm p-8 rounded-[40px] border border-neutral-border/40 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-green/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-primary-dark tracking-tight flex items-center gap-4">
            <div className="w-2 h-8 bg-primary-green rounded-full" />
            Housekeeping Command
          </h1>
          <p className="text-neutral-text-secondary text-[11px] font-bold uppercase tracking-[0.2em] mt-2 ml-6">Live operational control for room turnover</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Button onClick={fetchData} className="p-4 bg-white border border-neutral-border/50 rounded-2xl text-neutral-text-secondary hover:text-primary-dark transition-all shadow-sm">
            <RefreshCcw size={18} />
          </Button>
          <Button className="px-6 py-4 bg-primary-dark text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-primary-green transition-all shadow-xl shadow-primary-dark/10">
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
          <div key={i} className="bg-white p-8 rounded-[40px] border border-neutral-border/40 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
            <div className="flex items-start justify-between">
              <div className={`w-14 h-14 rounded-2xl ${s.light} ${s.text} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <s.icon size={26} strokeWidth={2.5} />
              </div>
              <div className="text-right">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-text-secondary">{s.label}</h3>
                <p className="text-4xl font-black text-primary-dark mt-1 tracking-tighter">{s.value}</p>
              </div>
            </div>
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 ${s.light} opacity-0 group-hover:opacity-40 rounded-full blur-3xl transition-opacity duration-500`} />
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        <div className="xl:col-span-8">
          <Suspense fallback={<SectionLoader />}>
            <HousekeepingRoomGrid
              rooms={rooms}
              filter={filter}
              onFilterChange={setFilter}
              onMarkClean={handleMarkClean}
              onStartCleaning={handleStartCleaning}
            />
          </Suspense>
        </div>

        <div className="xl:col-span-4">
          <Suspense fallback={<SectionLoader />}>
            <HousekeepingStaffPanel staff={staff} rooms={rooms} />
          </Suspense>
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
