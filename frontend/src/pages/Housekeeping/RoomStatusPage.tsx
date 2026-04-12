import React, { useState } from "react";
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  Hammer,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const rooms = [
  { number: "101", floor: 1, type: "Standard", status: "Clean", lastCleaned: "2 hrs ago", assigned: "N/A" },
  { number: "102", floor: 1, type: "Deluxe", status: "Dirty", lastCleaned: "5 hrs ago", assigned: "Sunita K." },
  { number: "103", floor: 1, type: "Standard", status: "Clean", lastCleaned: "1 hr ago", assigned: "N/A" },
  { number: "104", floor: 1, type: "Suite", status: "Maintenance", lastCleaned: "1 day ago", assigned: "Maint. Team" },
  { number: "201", floor: 2, type: "Standard", status: "Dirty", lastCleaned: "10 hrs ago", assigned: "Ram T." },
  { number: "202", floor: 2, type: "Deluxe", status: "Clean", lastCleaned: "30 mins ago", assigned: "N/A" },
  { number: "203", floor: 2, type: "Standard", status: "Dirty", lastCleaned: "4 hrs ago", assigned: "Geeta G." },
  { number: "204", floor: 2, type: "Suite", status: "Maintenance", lastCleaned: "6 hrs ago", assigned: "Maint. Team" },
];

const statusStyles = {
  Clean: { bg: "bg-green-50", text: "text-green-600", border: "border-green-100", dot: "bg-green-500", icon: CheckCircle2 },
  Dirty: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", dot: "bg-amber-500", icon: Clock },
  Maintenance: { bg: "bg-red-50", text: "text-red-600", border: "border-red-100", dot: "bg-red-500", icon: Hammer },
};

const RoomStatusPage: React.FC = () => {
  const [filter, setFilter] = useState("All");

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight uppercase">Room Status Inventory</h1>
          <p className="text-neutral-text-secondary text-[11px] font-black uppercase tracking-[0.2em] mt-2">REAL-TIME ROOM OCCUPANCY AND CLEANLINESS TRACKING</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-neutral-text-secondary hover:text-primary-green hover:bg-gray-50 transition-all shadow-sm">
            Generate Status Report
          </button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto no-scrollbar">
          {["All", "Clean", "Dirty", "Maintenance"].map((f) => (
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
            placeholder="Search room number or floor..." 
            className="w-full pl-14 pr-4 py-4 bg-gray-50/50 border border-transparent rounded-[24px] text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-green/5 focus:border-primary-green/20 focus:bg-white transition-all shadow-inner" 
          />
        </div>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {rooms.map((room, i) => {
          const style = statusStyles[room.status as keyof typeof statusStyles];
          return (
            <motion.div 
               whileHover={{ y: -8 }}
               key={i} 
               className="group bg-white p-8 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative flex flex-col items-center text-center"
            >
              <div className={`absolute top-8 right-10 w-2.5 h-2.5 rounded-full ${style.dot} ${room.status === 'Clean' ? 'shadow-[0_0_10px_#1F7A3A]' : ''}`} />
              
              <div className={`w-20 h-20 rounded-[32px] ${style.bg} ${style.text} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <style.icon size={32} strokeWidth={2.5} />
              </div>
              
              <h3 className="text-3xl font-black text-[#111827] tracking-tighter shrink-0 mb-1">Room {room.number}</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F59E0B] mb-8">{room.type} Tier</p>
              
              <div className="space-y-4 w-full pt-8 border-t border-gray-50">
                <div className="flex items-center justify-between px-2">
                   <div className="text-left">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Last Activity</p>
                      <p className="text-[12px] font-bold text-[#111827]">{room.lastCleaned}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Assigned To</p>
                      <p className="text-[12px] font-bold text-[#111827]">{room.assigned}</p>
                   </div>
                </div>
                
                <Link 
                  to={`/housekeeping/rooms/${room.number}`}
                  className={`w-full py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all text-center ${
                    room.status === "Clean" ? "bg-gray-100 text-[#111827] hover:bg-white hover:shadow-md" : "bg-[#14532D] text-white hover:bg-[#1F7A3A] shadow-xl shadow-[#1F7A3A]/20"
                  }`}
                >
                  {room.status === "Clean" ? "View Details" : "Start Cleaning"}
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomStatusPage;
