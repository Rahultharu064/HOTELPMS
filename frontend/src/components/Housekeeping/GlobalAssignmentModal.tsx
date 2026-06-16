import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { housekeepingService } from '../../services/housekeepingService';
import { toast } from 'react-hot-toast';
import { AdminSectionSkeleton } from '../ui/skeletons/AdminSkeletons';

export const GlobalAssignmentModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);

  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");

  useEffect(() => {
    const handleTrigger = () => {
      setIsOpen(true);
      fetchData();
    };

    window.addEventListener('trigger-global-assignment', handleTrigger);
    return () => window.removeEventListener('trigger-global-assignment', handleTrigger);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsRes, staffRes] = await Promise.all([
        housekeepingService.getRoomStatuses(),
        housekeepingService.getStaff()
      ]);
      // Show rooms that are NOT available and NOT occupied (i.e., those that need cleaning or maintenance)
      if (roomsRes.success) setRooms(roomsRes.data.filter((r: any) => r.status !== 'available' && r.status !== 'occupied'));
      if (staffRes.success) setStaff(staffRes.data.filter((s: any) => s.status === 'on_duty'));

    } catch (error) {
      toast.error("Failed to sync assignment data");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedRoomId || !selectedStaffId) {
      toast.error("Please select both a room and staff member");
      return;
    }

    try {
      toast.loading('Assigning task...', { id: 'global-assign' });
      const res = await housekeepingService.updateRoomStatus(Number(selectedRoomId), {
        status: 'cleaning',
        staffId: selectedStaffId,
        type: 'general',
        notes: 'Assigned via Global Command'
      });
      if (res.success) {
        toast.success('Task assigned successfully', { id: 'global-assign' });
        setIsOpen(false);
        setSelectedRoomId("");
        setSelectedStaffId("");
        // Reload page data if on dashboard
        window.dispatchEvent(new CustomEvent('housekeeping-data-updated'));
      }
    } catch (error) {
      toast.error('Assignment failed');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Global Task Assignment">
      <div className="space-y-8 p-2">
        {loading ? (
          <AdminSectionSkeleton />
        ) : (
          <>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">1. Select Available Room</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {rooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id.toString())}
                    className={`p-4 rounded-2xl border transition-all text-center ${selectedRoomId === room.id.toString()
                        ? "bg-[#14532D] border-[#14532D] text-white shadow-lg"
                        : "bg-white border-gray-100 text-[#111827] hover:border-[#14532D]/30"
                      }`}
                  >
                    <p className="text-sm font-black">{room.roomNumber}</p>
                    <p className={`text-[8px] font-bold uppercase mt-1 ${selectedRoomId === room.id.toString() ? "text-white/40" : "text-gray-400"}`}>{room.floor}F</p>
                  </button>
                ))}
                {rooms.length === 0 && <p className="col-span-full py-6 text-center text-[10px] font-black uppercase text-gray-300">No rooms need cleaning</p>}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">2. Assign Personnel</label>
              <div className="grid grid-cols-1 gap-2">
                {staff.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStaffId(s.staffId)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedStaffId === s.staffId
                        ? "bg-[#111827] border-[#111827] text-white shadow-xl translate-x-1"
                        : "bg-white border-gray-100 text-gray-500 hover:border-[#14532D]/30"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-black ${selectedStaffId === s.staffId ? "bg-white/10" : "bg-gray-50"
                        }`}>{s.name.slice(0, 2).toUpperCase()}</div>
                      <div className="text-left">
                        <p className="text-[12px] font-black uppercase leading-none">{s.name}</p>
                        <p className={`text-[9px] font-bold uppercase mt-1 ${selectedStaffId === s.staffId ? "text-white/40" : "text-gray-400"}`}>{s.role}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
              <button onClick={() => setIsOpen(false)} className="flex-1 py-4 border border-gray-100 rounded-2xl text-[11px] font-black uppercase text-gray-400 hover:bg-gray-50">Discard</button>
              <button
                onClick={handleAssign}
                disabled={!selectedRoomId || !selectedStaffId}
                className="flex-[2] py-4 bg-[#14532D] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#111827] disabled:opacity-50 shadow-xl shadow-[#14532D]/20"
              >
                Confirm Assignment
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
