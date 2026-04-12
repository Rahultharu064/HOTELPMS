import React from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  History, 
  User, 
  BedDouble, 
  Wind, 
  Coffee, 
  Tv, 
  Hammer,
  MoreVertical,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";

const RoomDetailsPage: React.FC = () => {
  const { id = "102" } = useParams();

  // Mock data for the room
  const roomInfo = {
    number: id,
    type: "Deluxe Suite",
    floor: 1,
    status: "Dirty",
    lastCleaned: "2026-03-27 10:00 AM",
    nextCleaning: "Pending - Scheduled for 2:00 PM",
    assignedTo: "Sunita Karki",
    notes: "Guest requested extra hypoallergenic pillows. All linens must be triple-bleached.",
  };

  const amenities = [
    { name: "Linens & Bedding", status: "Needs Change", icon: BedDouble },
    { name: "Toiletries & Towels", status: "Restocked", icon: Sparkles },
    { name: "Mini Bar", status: "Pending Audit", icon: Coffee },
    { name: "Electronics (TV/AC)", status: "Operational", icon: Tv },
    { name: "HVAC Filter", status: "Due for Check", icon: Wind },
  ];

  const cleaningHistory = [
    { type: "Full Turnover", staff: "Ram Thapa", date: "Mar 26, 2026", duration: "45m", rating: "Excellent" },
    { type: "Daily Service", staff: "Sunita K.", date: "Mar 25, 2026", duration: "15m", rating: "Pass" },
    { type: "Deep Clean", staff: "Bikash Lama", date: "Mar 20, 2026", duration: "2h 30m", rating: "Audit Level" },
  ];

  const maintenanceHistory = [
    { issue: "Leaking Faucet", status: "Fixed", date: "Mar 10, 2026", cost: "$45" },
    { issue: "AC Remote Battery", status: "Replaced", date: "Feb 28, 2026", cost: "$5" },
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-14">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-8">
           <Link to="/housekeeping/room-status" className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary-green hover:shadow-xl transition-all active:scale-95 group">
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
           </Link>
           <div>
              <h1 className="text-3xl font-black text-[#111827] tracking-tight uppercase">Room {roomInfo.number} Intelligence</h1>
              <p className="text-neutral-text-secondary text-[11px] font-black uppercase tracking-[0.2em] mt-2">DETAILED OPERATIONAL AUDIT & STATUS TRACKING</p>
           </div>
        </div>
        <div className="flex items-center gap-4">
           <button className="px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-[#111827] hover:bg-gray-50 transition-all shadow-sm">
              Operational Export
           </button>
           <button className="px-8 py-4 bg-[#14532D] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-primary-green transition-all shadow-xl shadow-primary-green/20 flex items-center gap-2">
              <Sparkles size={16} strokeWidth={3} /> Mark As Pristine
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Room Status Overview & Amenities */}
        <div className="lg:col-span-2 space-y-12">
           {/* Quick Status Cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[56px] border border-gray-100 shadow-sm relative overflow-hidden group">
                 <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                       <Clock size={24} strokeWidth={2.5} />
                    </div>
                    <span className="px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-100 italic">DIRTY</span>
                 </div>
                 <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Next Scheduled Task</h3>
                 <p className="text-2xl font-black text-[#111827] mt-1 leading-tight tracking-tight">Full Turnover Sanitize</p>
                 <div className="mt-8 flex items-center gap-2">
                    <History size={14} className="text-gray-300" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Est. Duration: 45 Mins</span>
                 </div>
              </div>
              
              <div className="bg-white p-10 rounded-[56px] border border-gray-100 shadow-sm relative overflow-hidden group">
                 <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-[#14532D]/5 text-[#14532D] flex items-center justify-center">
                       <User size={24} strokeWidth={2.5} />
                    </div>
                 </div>
                 <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Assigned Personnel</h3>
                 <p className="text-2xl font-black text-[#111827] mt-1 leading-tight tracking-tight">{roomInfo.assignedTo}</p>
                 <div className="mt-8 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active On Floor 1</span>
                 </div>
              </div>
           </div>

           {/* Amenities Audit Checklist */}
           <div className="bg-white p-12 rounded-[64px] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                 <h2 className="text-xl font-black text-[#111827] tracking-tight uppercase">Amenities Audit Flow</h2>
                 <button className="text-[10px] font-black tracking-widest uppercase text-primary-gold hover:text-[#14532D] transition-colors">Audit All Nodes</button>
              </div>
              <div className="space-y-4">
                 {amenities.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-gray-50/50 hover:bg-white hover:shadow-xl hover:border-primary-green/20 border border-transparent transition-all group cursor-pointer">
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-primary-green group-hover:bg-primary-green/5 transition-all">
                             <item.icon size={20} />
                          </div>
                          <div>
                             <p className="text-sm font-black text-[#111827]">{item.name}</p>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Lifecycle Tracking Enabled</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <span className={`text-[9px] font-black uppercase tracking-widest ${
                             item.status === 'Restocked' || item.status === 'Operational' ? 'text-green-600' : 'text-amber-600'
                          }`}>
                             {item.status}
                          </span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                             item.status === 'Restocked' || item.status === 'Operational' ? 'border-green-500 bg-green-500 text-white' : 'border-gray-200'
                          }`}>
                            {(item.status === 'Restocked' || item.status === 'Operational') && <CheckCircle2 size={12} strokeWidth={3} />}
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Column: History & Actions */}
        <div className="space-y-12">
           {/* Detailed Notes */}
           <div className="bg-[#14532D] p-12 rounded-[56px] text-white relative overflow-hidden group border border-white/5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-gold/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-[4000ms]" />
              <AlertCircle className="text-primary-gold mb-8" size={32} />
              <h3 className="text-3xl font-black mb-6 leading-tight tracking-tight uppercase">Special Instructions</h3>
              <p className="text-white/60 text-[11px] font-black uppercase tracking-[0.2em] leading-relaxed mb-12">
                 {roomInfo.notes}
              </p>
              <button className="w-full flex items-center justify-between p-6 bg-primary-gold rounded-[32px] text-[#14532D] group/btn transition-all active:scale-95 shadow-2xl shadow-black/30">
                 <span className="text-[12px] font-black uppercase tracking-widest">Edit Directives</span>
                 <ArrowLeft className="rotate-180 group-hover/btn:translate-x-1.5 transition-transform" />
              </button>
           </div>

           {/* Maintenance History Sidebar */}
           <div className="bg-white p-10 rounded-[56px] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                 <Hammer className="text-red-500" size={24} />
                 <h4 className="text-[13px] font-black uppercase tracking-[0.1em] text-[#111827]">Maintenance History</h4>
              </div>
              <div className="space-y-6">
                 {maintenanceHistory.map((m, i) => (
                    <div key={i} className="flex gap-4 group">
                       <div className="w-px bg-gray-100 relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-500" />
                       </div>
                       <div className="pb-6">
                          <p className="text-[12px] font-black text-[#111827]">{m.issue}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{m.date} - Resolved</p>
                       </div>
                    </div>
                 ))}
                 <button className="w-full py-4 border border-dashed border-gray-200 rounded-3xl text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-red-600 hover:border-red-600 transition-all">Report New Fault</button>
              </div>
           </div>

           {/* Quick Stats Mini */}
           <div className="p-10 rounded-[48px] bg-gray-50/50 border border-gray-100 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-green/5 rounded-full blur-3xl pointer-events-none" />
              <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6">Cleaning ROI Insight</h4>
              <div className="flex items-end gap-3 translate-y-1">
                 <span className="text-5xl font-black text-[#111827] tracking-tighter">45</span>
                 <span className="text-[14px] font-black text-primary-green uppercase mb-2">Mins Avg</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#F59E0B] mt-1 opacity-80">9.4% Efficiency Gain</p>
           </div>
        </div>
      </div>

      {/* Full width: Cleaning Audit Timeline */}
      <div className="bg-white p-12 rounded-[64px] border border-gray-100 shadow-sm relative overflow-hidden">
         <div className="flex items-center justify-between mb-12">
            <div>
               <h2 className="text-2xl font-black text-[#111827] tracking-tight uppercase">Operational Logs</h2>
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Historic activity & Staff performance audit</p>
            </div>
            <button 
              className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#14532D] hover:text-white transition-all"
              title="Add New Log Entry"
            >
               <Plus size={20} strokeWidth={3} />
            </button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left order-collapse">
               <thead>
                  <tr className="bg-gray-50/50">
                     <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Service Period</th>
                     <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Execution Staff</th>
                     <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Task Type</th>
                     <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Audit Score</th>
                     <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {cleaningHistory.map((h, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-all group cursor-pointer">
                       <td className="px-10 py-8">
                          <div className="flex items-center gap-3">
                             <Clock size={16} className="text-gray-300" />
                             <span className="text-[13px] font-black text-[#111827]">{h.date}</span>
                          </div>
                       </td>
                       <td className="px-10 py-8">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-primary-green/10 text-primary-green flex items-center justify-center text-[10px] font-black">{h.staff[0]}</div>
                             <span className="text-[12px] font-black text-gray-500 uppercase tracking-widest group-hover:text-[#111827] transition-all">{h.staff}</span>
                          </div>
                       </td>
                       <td className="px-10 py-8 text-[12px] font-bold text-gray-400 uppercase tracking-widest italic">{h.type}</td>
                       <td className="px-10 py-8">
                          <span className="px-4 py-1.5 rounded-full bg-green-50 text-green-600 text-[9px] font-black uppercase tracking-widest border border-green-100">{h.rating}</span>
                       </td>
                       <td className="px-10 py-8 text-right">
                          <button 
                            className="w-10 h-10 rounded-xl hover:bg-white hover:shadow-lg flex items-center justify-center text-gray-300 transition-all"
                            title="More Options"
                          >
                             <MoreVertical size={18} />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;
