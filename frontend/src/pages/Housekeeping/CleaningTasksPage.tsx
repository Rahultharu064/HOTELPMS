import React, { useState } from "react";
import { 
  Search, 
  MoreVertical, 
  Activity,
  Clock3
} from "lucide-react";
import { Link } from "react-router-dom";

const tasks = [
  { id: "HK-1024", room: "102", type: "Full Turn-Over", staff: "Sunita Karki", priority: "High", status: "In Progress", time: "Started 15m ago" },
  { id: "HK-1025", room: "201", type: "Deep Cleaning", staff: "Ram Thapa", priority: "Normal", status: "Assigned", time: "Due in 2 hrs" },
  { id: "HK-1026", room: "305", type: "Stay Over", staff: "Geeta Gurung", priority: "Normal", status: "Pending", time: "Next in Queue" },
  { id: "HK-1027", room: "401", type: "Full Turn-Over", staff: "Bikash Lama", priority: "High", status: "Completed", time: "Finished 1 hr ago" },
];

const CleaningTasksPage: React.FC = () => {
  const [filter, setFilter] = useState("All");

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight uppercase">Cleaning Operations</h1>
          <p className="text-neutral-text-secondary text-[11px] font-black uppercase tracking-[0.2em] mt-2">MANAGE ACTIVE DUTY CYCLES AND TASK PRIORITIZATION</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-neutral-text-secondary hover:text-primary-green hover:bg-gray-50 transition-all shadow-sm">
            Generate Operational Report
          </button>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto no-scrollbar">
          {["All", "In Progress", "Pending", "Completed"].map((f) => (
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
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2.5} />
          <input 
            placeholder="Search by Room, Staff or Task ID..." 
            className="w-full pl-14 pr-4 py-4 bg-gray-50/50 border border-transparent rounded-[24px] text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-green/5 focus:border-primary-green/20 focus:bg-white transition-all shadow-inner" 
          />
        </div>
      </div>

      {/* Modern Table Layout */}
      <div className="bg-white rounded-[56px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Operational ID</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Assigned Staff</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Room & Type</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Priority</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Lifecycle</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tasks.map((task, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-all duration-500 group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#14532D]/5 text-[#14532D] flex items-center justify-center transition-all group-hover:scale-110">
                        <Activity size={20} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#111827] leading-none mb-1">{task.id}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary-gold flex items-center gap-1.5 opacity-60">
                           <Clock3 size={10} strokeWidth={3} /> {task.time}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-[#14532D] text-white flex items-center justify-center text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/10">
                        {task.staff.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <p className="text-[12px] font-black text-gray-500 uppercase tracking-widest group-hover:text-[#111827] transition-colors">{task.staff}</p>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                      <p className="text-[15px] font-black text-[#111827]">RM {task.room}</p>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{task.type}</p>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest ${
                      task.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${task.priority === 'High' ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-blue-500 shadow-[0_0_8px_blue]'}`} />
                      {task.priority} Priority
                    </span>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest text-[#D97706] italic bg-amber-50 group-hover:bg-[#14532D] group-hover:text-white transition-all`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Link 
                         to={`/housekeeping/rooms/${task.room}`}
                         className="px-5 py-2.5 rounded-xl border border-gray-100 hover:bg-[#14532D] hover:text-white hover:border-[#14532D] text-[10px] font-black uppercase tracking-widest text-gray-400 transition-all shadow-sm"
                       >
                         Details
                       </Link>
                       <button 
                         className="w-11 h-11 rounded-xl hover:bg-[#14532D] group/btn flex items-center justify-center text-gray-300 transition-all"
                         title="Archive or Modify Task"
                       >
                         <MoreVertical size={18} className="group-hover/btn:scale-110 group-hover/btn:text-white transition-all" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-10 bg-gray-50/50 border-t border-gray-50 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Live monitoring enabled - Updated 2ms ago</p>
        </div>
      </div>
    </div>
  );
};

export default CleaningTasksPage;
