import React, { useState, useEffect } from "react";
import { 
  Search, 
  MoreVertical, 
  Activity,
  Clock3,
  Loader2,
  RefreshCcw,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import { housekeepingService } from "../../services/housekeepingService";
import { toast } from "react-hot-toast";

const CleaningTasksPage: React.FC = () => {
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
      toast.error("Failed to load cleaning tasks");
    } finally {
      setLoading(false);
    }
  };

  const getPriority = (status: string) => {
    if (status === 'cleaning') return 'High';
    if (status === 'maintenance') return 'Urgent';
    return 'Normal';
  };

  const getLifecycle = (status: string) => {
    if (status === 'cleaning') return 'In Progress';
    if (status === 'available') return 'Ready';
    if (status === 'occupied') return 'Stay Over';
    return status;
  };

  const filteredRooms = rooms.filter(r => {
    const statusLabel = getLifecycle(r.status);
    const matchesFilter = filter === "All" || statusLabel === filter;
    const matchesSearch = r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (r.housekeepingLogs?.[0]?.staffId || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#14532D]" />
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Loading Operations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight">Cleaning Operations</h1>
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mt-2">Manage daily room cleaning and maintenance cycles</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchRooms}
            className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#14532D] transition-all"
          >
            <RefreshCcw size={18} />
          </button>
          <button className="px-6 py-4 bg-[#111827] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#14532D] transition-all shadow-lg shadow-black/10">
            Export Task List
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto no-scrollbar">
          {["All", "In Progress", "Ready", "Stay Over"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                filter === f 
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
            placeholder="Search by Room Number or Staff ID..." 
            className="w-full pl-14 pr-4 py-4 bg-gray-50/50 border border-transparent rounded-[24px] text-sm font-medium focus:outline-none focus:border-[#14532D]/20 focus:bg-white transition-all shadow-inner" 
          />
        </div>
      </div>

      {/* Task Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Reference</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Room Info</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Last Action By</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Priority</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRooms.map((room) => {
                const log = room.housekeepingLogs?.[0];
                const priority = getPriority(room.status);
                const statusLabel = getLifecycle(room.status);

                return (
                  <tr key={room.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-[#14532D] group-hover:text-white transition-all">
                          <Activity size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#111827]">HK-{room.roomNumber}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                             <Clock3 size={10} /> {log ? new Date(log.createdAt).toLocaleTimeString() : 'No History'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <p className="text-[14px] font-black text-[#111827]">Room {room.roomNumber}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Floor {room.floor || 'G'}</p>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#111827] text-white flex items-center justify-center text-[10px] font-black uppercase">
                          {log?.staffId ? log.staffId.slice(0, 2).toUpperCase() : '??'}
                        </div>
                        <p className="text-[12px] font-bold text-gray-600 uppercase tracking-widest">{log?.staffId || 'Not Assigned'}</p>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                        priority === 'Urgent' ? 'bg-red-50 text-red-600' : priority === 'High' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {priority}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                        statusLabel === 'Ready' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/housekeeping/rooms/${room.id}`}
                          className="px-4 py-2 rounded-xl bg-[#111827] text-white text-[9px] font-black uppercase tracking-widest hover:bg-[#14532D] transition-all shadow-md"
                        >
                          Logs
                        </Link>
                        <button className="w-9 h-9 rounded-xl border border-gray-100 flex items-center justify-center text-gray-300 hover:text-[#111827] transition-all">
                           <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredRooms.length === 0 && (
          <div className="p-20 text-center text-gray-400 uppercase tracking-widest font-black text-[11px]">
             No operations matching your filter
          </div>
        )}
      </div>
    </div>
  );
};

export default CleaningTasksPage;
