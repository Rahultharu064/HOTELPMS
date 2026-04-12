import React, { useState } from "react";
import { 
  Users, Search, 
  MoreVertical, 
  Clock, ShieldCheck, 
  Zap, ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const staff = [
  { id: "HK-501", name: "Sunita Karki", role: "Team Lead", status: "On Duty", tasks: 4, avatar: "SK" },
  { id: "HK-502", name: "Ram Thapa", role: "Sr. Attendant", status: "On Duty", tasks: 2, avatar: "RT" },
  { id: "HK-503", name: "Geeta Gurung", role: "Attendant", status: "On Duty", tasks: 0, avatar: "GG" },
  { id: "HK-504", name: "Bikash Lama", role: "Attendant", status: "Break", tasks: 1, avatar: "BL" },
  { id: "HK-505", name: "Sabin Rai", role: "Jr. Attendant", status: "Off Duty", tasks: 0, avatar: "SR" },
];

const StaffAssignmentPage: React.FC = () => {
  const [filter, setFilter] = useState("All");

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight uppercase">Staff & Assignment Control</h1>
          <p className="text-neutral-text-secondary text-[11px] font-black uppercase tracking-[0.2em] mt-2">MANAGE PERSONNEL ALLOCATION AND FLOOR ROSTERS</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-neutral-text-secondary hover:text-primary-green hover:bg-gray-50 transition-all shadow-sm">
            Generate Roster Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Left Area: Roster Listing */}
        <div className="lg:col-span-3 space-y-10">
          <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2.5} />
              <input 
                placeholder="Search staff by name, role or ID..." 
                className="w-full pl-14 pr-4 py-4 bg-gray-50/50 border border-transparent rounded-[24px] text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-green/5 focus:border-primary-green/20 focus:bg-white transition-all shadow-inner" 
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto no-scrollbar">
              {["All", "On Duty", "Off Duty"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                    filter === f 
                      ? "bg-[#14532D] text-white shadow-lg" 
                      : "text-gray-400 hover:text-[#111827] hover:bg-gray-50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {staff.map((s, i) => (
              <motion.div 
                 whileHover={{ y: -6 }}
                 key={i} 
                 className="group bg-white p-10 rounded-[56px] border border-gray-100 hover:border-primary-green/20 shadow-sm hover:shadow-2xl transition-all duration-500 relative flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                <div className="flex items-start justify-between mb-10">
                   <div className="w-16 h-16 rounded-[28px] bg-[#14532D] text-white flex items-center justify-center text-[16px] font-black uppercase tracking-widest shadow-2xl shadow-black/20 group-hover:scale-110 transition-all duration-500 relative overflow-hidden">
                      <span className="relative z-10">{s.avatar}</span>
                      <div className="absolute top-0 right-0 w-8 h-8 bg-primary-gold opacity-20 rounded-full blur-lg" />
                   </div>
                   <div className="flex flex-col items-end">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest mb-3 ${
                        s.status === 'On Duty' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                         <div className={`w-1.5 h-1.5 rounded-full ${s.status === 'On Duty' ? 'bg-green-500 shadow-[0_0_8px_white]' : 'bg-red-500'}`} />
                         {s.status}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F59E0B]">{s.role}</p>
                   </div>
                </div>

                <div>
                   <h3 className="text-xl font-black text-[#111827] leading-none mb-4 group-hover:text-primary-green transition-colors">{s.name}</h3>
                   <div className="flex items-center justify-between p-5 rounded-3xl bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:shadow-md transition-all">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Tasks</span>
                        <span className="text-2xl font-black text-[#111827] tracking-tighter">{s.tasks} <span className="text-[10px] text-gray-400 uppercase">Units</span></span>
                      </div>
                      <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#14532D] hover:text-primary-green transition-all group/btn">
                         Quick Assign <ArrowRight size={14} className="group-hover/btn:translate-x-1.5 transition-transform" />
                      </button>
                   </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-300" strokeWidth={2.5} />
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Last Activity: 15 mins ago</p>
                   </div>
                   <button 
                     className="w-11 h-11 rounded-2xl hover:bg-[#14532D] group/btn flex items-center justify-center text-gray-300 transition-all shadow-sm hover:shadow-lg"
                     title="More options"
                   >
                     <MoreVertical size={18} className="group-hover/btn:scale-110 group-hover/btn:text-white transition-all" />
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Ops Section */}
        <div className="space-y-10">
          <div className="bg-[#14532D] rounded-[56px] p-12 text-white relative overflow-hidden group min-h-[400px] flex flex-col justify-between border border-white/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-gold/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
            
            <div className="relative z-10">
              <Zap className="text-primary-gold mb-8" size={32} />
              <h2 className="text-3xl font-black mb-4 leading-tight">Batch<br /><span className="text-white/40">Assignment</span></h2>
              <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-10">Assign entire floors or room blocks instantly.</p>
              
              <div className="grid grid-cols-2 gap-4">
                 {[1, 2, 3, 4].map(f => (
                   <button key={f} className="p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary-gold/30 hover:text-primary-gold transition-all text-center">
                     <p className="text-[12px] font-black">Floor {f}</p>
                   </button>
                 ))}
              </div>
            </div>

            <button 
              className="relative z-10 w-full flex items-center justify-between p-6 bg-primary-gold rounded-[32px] text-[#14532D] group/btn transition-all mt-10 active:scale-95 shadow-xl shadow-black/20"
            >
              <span className="text-[13px] font-black uppercase tracking-widest">Save Assignments</span>
              <ShieldCheck size={20} className="group-hover/btn:scale-125 transition-transform" />
            </button>
          </div>

          <div className="p-10 rounded-[48px] bg-white border border-gray-100 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <Users className="text-primary-green" size={24} />
                <h3 className="text-lg font-black text-[#111827] uppercase tracking-tight">On-Call Staff</h3>
             </div>
             <div className="space-y-4">
                {[
                  { name: "Meena Karki", dist: "2 min away" },
                  { name: "Anita Gurung", dist: "15 min away" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-3xl bg-gray-50/50 border border-gray-100 transition-all hover:border-primary-gold cursor-pointer">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#111827]">{s.name}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#F59E0B] italic">{s.dist}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAssignmentPage;
