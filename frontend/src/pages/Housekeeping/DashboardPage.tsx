import React, { useState } from "react";
import { 
  Sparkles, 
  DoorOpen, 
  Hammer, 
  Clock, 
  ArrowUpRight,
  CheckCircle2,
  UserSquare2,
} from "lucide-react";
import { motion } from "framer-motion";

// Mock Data
const stats = [
  { label: "Clean Rooms", value: "24", icon: CheckCircle2, color: "bg-green-500", light: "bg-green-50", text: "text-green-600", trend: "+2" },
  { label: "Dirty Rooms", value: "12", icon: Clock, color: "bg-primary-gold", light: "bg-amber-50", text: "text-amber-600", trend: "-4" },
  { label: "Maintenance", value: "3", icon: Hammer, color: "bg-red-500", light: "bg-red-50", text: "text-red-600", trend: "Stable" },
  { label: "Pending Tasks", value: "8", icon: Sparkles, color: "bg-primary-green", light: "bg-green-50", text: "text-primary-green", trend: "High Priority" },
];

const roomsData = [
  { id: "101", status: "Clean", floor: 1, type: "Standard" },
  { id: "102", status: "Dirty", floor: 1, type: "Deluxe" },
  { id: "103", status: "Clean", floor: 1, type: "Standard" },
  { id: "104", status: "Maintenance", floor: 1, type: "Suite" },
  { id: "201", status: "Dirty", floor: 2, type: "Standard" },
  { id: "202", status: "Clean", floor: 2, type: "Deluxe" },
  { id: "203", status: "Dirty", floor: 2, type: "Standard" },
  { id: "204", status: "Maintenance", floor: 2, type: "Suite" },
  { id: "301", status: "Clean", floor: 3, type: "Standard" },
  { id: "302", status: "Dirty", floor: 3, type: "Deluxe" },
  { id: "303", status: "Clean", floor: 3, type: "Standard" },
  { id: "401", status: "Dirty", floor: 4, type: "Pres." },
];

const tasks = [
  { id: "T-102", room: "102", staff: "Sunita Karki", status: "In Progress", priority: "High" },
  { id: "T-201", room: "201", staff: "Ram Thapa", status: "Assigned", priority: "Normal" },
  { id: "T-203", room: "203", staff: "Geeta Gurung", status: "Pending", priority: "Normal" },
];

const DashboardPage: React.FC = () => {
  const [filter, setFilter] = useState("All");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight uppercase">Operations Dashboard</h1>
          <p className="text-neutral-text-secondary text-[11px] font-black uppercase tracking-[0.2em] mt-2">HOUSEKEEPING STATUS & OPERATIONAL COMMAND</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-neutral-text-secondary hover:text-primary-green hover:bg-gray-50 transition-all shadow-sm">
            Generate Operations Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="group bg-white p-6 rounded-[32px] border border-gray-100 hover:border-primary-green/20 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden">
            <div className="flex items-start justify-between relative z-10">
              <div className={`w-14 h-14 rounded-2xl ${s.light} ${s.text} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                <s.icon size={26} strokeWidth={2.5} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full ${s.trend === "Stable" ? "bg-gray-100 text-gray-500" : "bg-green-50 text-green-600"}`}>
                <ArrowUpRight size={10} strokeWidth={3} />
                {s.trend}
              </div>
            </div>
            <div className="mt-8 relative z-10">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">{s.label}</h3>
              <p className="text-4xl font-black text-[#111827] mt-1 tracking-tighter">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Room Status Board */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary-gold rounded-full" />
              <h2 className="text-xl font-black text-neutral-text-primary tracking-tight">Room Status Grid</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                 {["All", "Dirty", "Clean"].map(f => (
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
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
            {roomsData.map((room, i) => (
              <div key={i} className="group bg-white p-5 rounded-[28px] border border-gray-100 hover:shadow-2xl transition-all duration-500 relative cursor-pointer overflow-hidden">
                <div className={`absolute top-0 right-0 w-12 h-12 rounded-bl-[20px] transition-colors ${
                  room.status === "Clean" ? "bg-green-500/10" : room.status === "Dirty" ? "bg-primary-gold/10" : "bg-red-500/10"
                }`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Room</span>
                    <div className={`w-2 h-2 rounded-full shadow-lg ${
                      room.status === "Clean" ? "bg-green-500" : room.status === "Dirty" ? "bg-primary-gold" : "bg-red-500"
                    }`} />
                  </div>
                  <h4 className="text-2xl font-black text-neutral-text-primary group-hover:text-primary-green transition-colors leading-none">{room.id}</h4>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">{room.type} Tier</p>
                  
                  <button className={`mt-6 w-full py-2.5 rounded-xl border transition-all text-[9px] font-black uppercase tracking-widest ${
                    room.status === "Clean" 
                      ? "border-green-100 text-green-600 hover:bg-green-50" 
                      : room.status === "Dirty" 
                      ? "border-amber-100 text-amber-600 hover:bg-amber-50" 
                      : "border-red-100 text-red-600 hover:bg-red-50"
                  }`}>
                    {room.status === "Clean" ? "Inspect" : room.status === "Dirty" ? "Mark Clean" : "Fix Alert"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cleaning Tasks & Staff Sidebar */}
        <div className="space-y-10">
          <div className="space-y-6">
            <h2 className="text-xl font-black text-neutral-text-primary tracking-tight flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary-green rounded-full" />
              Active Sub-Tasks
            </h2>
            <div className="space-y-3">
              {tasks.map((task, i) => (
                <div key={i} className="group p-5 bg-white border border-gray-100 rounded-[32px] hover:shadow-xl transition-all duration-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary-gold">
                      <DoorOpen size={20} strokeWidth={2.5} />
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                      task.priority === "High" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                    }`}>
                      {task.priority} Priority
                    </span>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-black text-neutral-text-primary uppercase tracking-tight">Room {task.room} - Fully Sanitize</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Staff: {task.staff}</p>
                  </div>
                  <div className="mt-5 flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#D97706] bg-amber-50 px-3 py-1 rounded-lg italic">
                      {task.status}
                    </span>
                    <button className="text-primary-green hover:underline text-[9px] font-black uppercase tracking-widest">
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 border border-dashed border-gray-300 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-[24px] hover:border-primary-green hover:text-primary-green transition-all">
              Schedule Extra Duty
            </button>
          </div>

          <div className="bg-[#14532D] p-10 rounded-[56px] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-gold/10 rounded-full blur-[60px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
            <UserSquare2 className="text-primary-gold mb-6" size={32} />
            <h3 className="text-2xl font-black mb-2 leading-tight">Staff Assignment</h3>
            <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-10 leading-relaxed">Allocate cleaning duties to online staff members.</p>
            <button className="w-full py-4 bg-primary-gold text-[#14532D] rounded-[24px] text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-black/20">
              Open Assignment Tool
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
