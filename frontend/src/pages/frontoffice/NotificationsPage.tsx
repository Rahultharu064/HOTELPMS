import React, { useState } from "react";
import { 
  Bell, CheckCircle2, 
  MoreVertical, Calendar, 
  Smartphone, CreditCard, 
  User, Search, AlertCircle,
  Download, Archive, Trash2,
  ChevronRight, MessageSquare,
  Zap
} from "lucide-react";

const allNotifications = [
  { id: 1, text: "New booking: Room 204 – Rajesh Sharma", time: "2 min ago", type: "booking", unread: true, timestamp: "Today, 10:45 AM" },
  { id: 2, text: "Check-in completed: Room 105 – Sita Devi", time: "15 min ago", type: "checkin", unread: true, timestamp: "Today, 10:32 AM" },
  { id: 3, text: "Payment received: $150 – Room 302", time: "1 hr ago", type: "payment", unread: false, timestamp: "Today, 09:45 AM" },
  { id: 4, text: "Booking cancelled: Room 401 – Hari Prasad", time: "2 hrs ago", type: "cancel", unread: false, timestamp: "Today, 08:30 AM" },
  { id: 5, text: "Maintenance finished: Room 201 AC regular check-up", time: "Yesterday", type: "maintenance", unread: false, timestamp: "Yesterday, 04:15 PM" },
  { id: 6, text: "Daily Revenue Report is ready for review.", time: "Yesterday", type: "report", unread: false, timestamp: "Yesterday, 06:00 PM" },
];

const NotifTypeStyles: Record<string, { bg: string, text: string, icon: any }> = {
  booking: { bg: "bg-[#1F7A3A]/10", text: "text-[#1F7A3A]", icon: Calendar },
  checkin: { bg: "bg-blue-50", text: "text-blue-600", icon: User },
  payment: { bg: "bg-[#F59E0B]/10", text: "text-[#D97706]", icon: CreditCard },
  cancel: { bg: "bg-red-50", text: "text-red-600", icon: Trash2 },
  maintenance: { bg: "bg-gray-100", text: "text-gray-500", icon: Smartphone },
  report: { bg: "bg-indigo-50", text: "text-indigo-600", icon: Zap },
};

const NotificationsPage: React.FC = () => {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = allNotifications.filter(n => {
    const matchesFilter = filter === "All" || (filter === "Unread" && n.unread);
    const matchesSearch = n.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-[#111827] tracking-tight text-center sm:text-left">Communication Hub</h1>
            <span className="px-2.5 py-1 rounded-full bg-[#14532D] text-white text-[10px] font-black uppercase tracking-widest hidden sm:inline-block">
              {allNotifications.filter(n => n.unread).length} New
            </span>
          </div>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest text-center sm:text-left">Live system updates and message logs</p>
        </div>
        <div className="flex items-center justify-center sm:justify-end gap-3">
          <button className="hidden sm:flex px-5 py-3 bg-white border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-[#111827] hover:bg-gray-50 transition-all shadow-sm">
            Mark all read
          </button>
          <button className="px-6 py-4 bg-[#14532D] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#1F7A3A] transition-all shadow-xl shadow-[#1F7A3A]/20 flex items-center gap-2">
            <CheckCircle2 size={16} strokeWidth={3} /> Clear Center
          </button>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto custom-scrollbar">
          {["All", "Unread", "Bookings", "System"].map((f) => (
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
            placeholder="Search within alert history..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-4 py-4 bg-gray-50/50 border border-transparent rounded-[24px] text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#1F7A3A]/5 focus:border-[#1F7A3A]/20 focus:bg-white transition-all shadow-inner" 
          />
        </div>
      </div>

      {/* Notifications Management Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 space-y-4">
          {filtered.length > 0 ? filtered.map((n, i) => {
            const style = NotifTypeStyles[n.type] || NotifTypeStyles.maintenance;
            return (
              <div key={i} className={`group p-8 rounded-[40px] border transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6 relative shadow-sm hover:shadow-xl ${
                n.unread ? "bg-white border-[#1F7A3A]/20" : "bg-gray-50/50 border-transparent hover:bg-white hover:border-gray-100"
              }`}>
                {/* Visual Unread Glow */}
                {n.unread && <div className="absolute top-8 right-8 w-2 h-2 rounded-full bg-[#1F7A3A] animate-pulse" />}
                
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-black/5 group-hover:scale-110 transition-transform ${style.bg} ${style.text}`}>
                    <style.icon size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className={`text-[15px] leading-tight mb-1.5 ${n.unread ? "font-black text-[#111827]" : "font-bold text-gray-500"}`}>
                      {n.text}
                    </h3>
                    <div className="flex items-center gap-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#F59E0B] flex items-center gap-1.5">
                        <ClockIcon size={12} strokeWidth={3} /> {n.time}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sent: {n.timestamp}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="px-5 py-2.5 rounded-xl border border-gray-100 hover:border-[#111827] text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#111827] transition-all bg-white" title="Archive this notification">
                    Archive
                  </button>
                  <button className="w-10 h-10 rounded-xl hover:bg-[#14532D] hover:text-white border border-transparent flex items-center justify-center text-gray-300 transition-all hover:shadow-xl group/btn" title="More options">
                    <MoreVertical size={18} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            );
          }) : (
            <div className="p-20 bg-white rounded-[56px] border border-gray-100 text-center space-y-6">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <Bell size={40} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#111827] tracking-tight">System All Clear</h3>
                <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mt-1">No pending notifications found in your history.</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Communication Activity */}
        <div className="space-y-10">
          <div className="bg-[#14532D] rounded-[56px] p-12 text-white relative overflow-hidden group min-h-[400px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1F7A3A]/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
            
            <div>
              <MessageSquare className="text-[#F59E0B] mb-8" size={40} />
              <h2 className="text-3xl font-black mb-4 leading-tight">Emergency<br /><span className="text-white/40">Alerts</span></h2>
              <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-12">Critical system and safety alerts center.</p>

              <div className="space-y-6">
                <div className="p-6 rounded-[32px] bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all group/card cursor-pointer">
                  <h4 className="text-[12px] font-black uppercase tracking-widest text-red-500 mb-2 flex items-center gap-2">
                    <AlertCircle size={14} strokeWidth={3} /> Backup Needed
                  </h4>
                  <p className="text-white/40 text-[11px] font-medium leading-relaxed uppercase tracking-widest">Main database sync failed 5 mins ago. Automatic retry in progress.</p>
                </div>
              </div>
            </div>

            <button className="relative z-10 w-full flex items-center justify-between p-6 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 rounded-[32px] group/btn transition-all mt-10">
              <span className="text-[13px] font-black uppercase tracking-widest">View System Logs</span>
              <ChevronRight size={20} strokeWidth={3} className="group-hover/btn:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="p-10 rounded-[48px] bg-gray-50 border border-gray-100">
             <div className="flex items-center gap-3 mb-6">
                <Archive className="text-[#1F7A3A]" size={24} />
                <h3 className="text-lg font-black text-[#111827] uppercase tracking-tight">Recent Archives</h3>
             </div>
             <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 group cursor-pointer hover:border-[#1F7A3A]/30 transition-all">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black uppercase tracking-widest text-[#111827]">Log #4192{i}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase">Archived 2 days ago</span>
                    </div>
                    <Download size={14} className="text-gray-300 group-hover:text-[#1F7A3A]" strokeWidth={3} />
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function ClockIcon(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export default NotificationsPage;
