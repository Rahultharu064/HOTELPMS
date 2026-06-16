import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  BedDouble, 
  Wind, 
  Tv, 
  Hammer,
  Plus,
} from "lucide-react";
import { housekeepingService } from "../../services/housekeepingService";
import { toast } from "react-hot-toast";
import { Button } from "../../components/ui/Button";
import { AdminDetailPageSkeleton } from "../../components/ui/skeletons/AdminSkeletons";

const RoomDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [room, setRoom] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsRes, logsRes] = await Promise.all([
        housekeepingService.getRoomStatuses(), // We'll find the specific room in the list
        housekeepingService.getLogs({ roomId: Number(id) })
      ]);
      
      if (roomsRes.success) {
        const found = roomsRes.data.find((r: any) => r.id === Number(id));
        setRoom(found);
      }
      if (logsRes.success) setLogs(logsRes.data);
    } catch (error) {
      toast.error("Failed to load room details");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkClean = async () => {
    if (!room) return;
    try {
      toast.loading('Marking room as clean...', { id: 'room-clean' });
      const res = await housekeepingService.updateRoomStatus(room.id, {
        status: 'available',
        type: 'general',
        notes: 'Room marked as clean via details page'
      });
      if (res.success) {
        toast.success('Room is now ready for guests', { id: 'room-clean' });
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to update room');
    }
  };

  if (loading) {
    return <AdminDetailPageSkeleton />;
  }

  if (!room) return <div className="p-20 text-center font-black uppercase tracking-widest">Room Not Found</div>;

  const isDirty = room.status === 'cleaning';
  const isClean = room.status === 'available';

  return (
    <div className="space-y-12 animate-fade-in pb-14">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-8">
           <Link to="/housekeeping" className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#14532D] transition-all group">
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
           </Link>
           <div>
              <h1 className="text-3xl font-black text-[#111827] tracking-tight">Room {room.roomNumber} Details</h1>
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mt-2">View and manage cleaning history for this unit</p>
           </div>
        </div>
        <div className="flex items-center gap-4">
           {isDirty && (
             <button 
              onClick={handleMarkClean}
              className="px-8 py-4 bg-[#14532D] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-[#14532D]/20 flex items-center gap-2"
             >
                <Sparkles size={16} strokeWidth={3} /> Mark As Clean
             </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
                 <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center">
                       <Clock size={24} />
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      isClean ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>{room.status}</span>
                 </div>
                 <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Current Unit Status</h3>
                 <p className="text-2xl font-black text-[#111827] mt-1">{isClean ? 'Ready for Guest' : 'Awaiting Service'}</p>
              </div>
              
              <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
                 <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center">
                       <User size={24} />
                    </div>
                 </div>
                 <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Primary Assignment</h3>
                 <p className="text-2xl font-black text-[#111827] mt-1">{logs[0]?.staffId || 'Not Assigned'}</p>
                 <div className="mt-8 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Status</span>
                 </div>
              </div>
           </div>

           {/* Amenities Summary */}
           <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
              <h2 className="text-xl font-black text-[#111827] mb-8 uppercase tracking-tight">Standard Checklist</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   { name: "Linens & Bedding", icon: BedDouble },
                   { name: "Toiletries", icon: Sparkles },
                   { name: "Electronics", icon: Tv },
                   { name: "HVAC System", icon: Wind }
                 ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 border border-transparent hover:border-[#14532D]/20 transition-all">
                       <div className="flex items-center gap-4">
                          <item.icon size={18} className="text-gray-400" />
                          <span className="text-sm font-black text-[#111827]">{item.name}</span>
                       </div>
                       <CheckCircle2 size={16} className="text-emerald-500" />
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Column */}
        <div className="space-y-10">
           <div className="bg-[#111827] p-10 rounded-[48px] text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#14532D] rounded-full blur-[80px] opacity-20" />
              <AlertCircle className="text-[#F59E0B] mb-6" size={32} />
              <h3 className="text-xl font-black mb-4 uppercase tracking-tight">Cleaning Notes</h3>
              <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-10">
                 {logs[0]?.notes || "No special instructions provided for this cleaning cycle."}
              </p>
              <button className="w-full py-4 bg-[#F59E0B] text-[#111827] rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all">
                 Update Notes
              </button>
           </div>

           <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                 <Hammer className="text-red-500" size={24} />
                 <h4 className="text-[13px] font-black uppercase tracking-widest text-[#111827]">Maintenance History</h4>
              </div>
              <div className="space-y-6">
                 {room.status === 'maintenance' ? (
                   <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600">
                      <p className="text-[11px] font-black uppercase">Active Maintenance Issue</p>
                      <p className="text-[10px] font-bold mt-1">Reported: {new Date(room.updatedAt).toLocaleDateString()}</p>
                   </div>
                 ) : (
                   <p className="text-[10px] font-black uppercase text-gray-300">No active maintenance issues</p>
                 )}
                 <button className="w-full py-3 border border-dashed border-gray-200 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-red-600 hover:border-red-600 transition-all">Report Issue</button>
              </div>
           </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm overflow-hidden">
         <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-[#111827] uppercase tracking-tight">Action Logs</h2>
            <Button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#111827] hover:text-white transition-all">
               <Plus size={18} />
            </Button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-gray-50/50">
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Date & Time</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Staff</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Activity</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Result</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {logs.map((h, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-all group">
                       <td className="px-8 py-6">
                          <span className="text-[13px] font-black text-[#111827]">{new Date(h.createdAt).toLocaleString()}</span>
                       </td>
                       <td className="px-8 py-6">
                          <span className="text-[12px] font-bold text-gray-600 uppercase tracking-widest">{h.staffId || 'System'}</span>
                       </td>
                       <td className="px-8 py-6 text-[12px] font-bold text-gray-400 uppercase tracking-widest italic">{h.type.replace('_', ' ')}</td>
                       <td className="px-8 py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            h.status === 'available' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>{h.status}</span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
         {logs.length === 0 && (
           <div className="p-10 text-center text-gray-300 font-black uppercase text-[11px] tracking-widest">No logs recorded for this room</div>
         )}
      </div>
    </div>
  );
};

export default RoomDetailsPage;
