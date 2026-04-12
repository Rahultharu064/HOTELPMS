import React, { useState } from "react";
import { 
  Search, Plus, Calendar, 
  CheckCircle2, Clock, 
  AlertCircle, MoreVertical, Download,
  LayoutGrid, List, ChevronRight,
  BedDouble, CreditCard
} from "lucide-react";
import { CreateOfflineReservationModal } from "../../components/Admin/Dashboard/CreateOfflineReservationModal";
import { AnimatePresence } from "framer-motion";

const allBookings = [
  { id: "BK0102", guest: "Rajesh Sharma", type: "Standard", room: "204", checkIn: "Mar 24, 2026", checkOut: "Mar 26, 2026", status: "Confirmed", amount: "$240", avatar: "RS" },
  { id: "BK0103", guest: "Sita Devi", type: "Deluxe", room: "105", checkIn: "Mar 24, 2026", checkOut: "Mar 25, 2026", status: "Pending", amount: "$150", avatar: "SD" },
  { id: "BK0104", guest: "Hari Prasad", type: "Suite", room: "401", checkIn: "Mar 25, 2026", checkOut: "Mar 28, 2026", status: "Cancelled", amount: "$1,350", avatar: "HP" },
  { id: "BK0105", guest: "Anita Gurung", type: "Standard", room: "302", checkIn: "Mar 24, 2026", checkOut: "Mar 27, 2026", status: "Confirmed", amount: "$360", avatar: "AG" },
  { id: "BK0106", guest: "Bikash Thapa", type: "Deluxe", room: "108", checkIn: "Mar 25, 2026", checkOut: "Mar 26, 2026", status: "Pending", amount: "$150", avatar: "BT" },
  { id: "BK0107", guest: "Meena Karki", room: "210", checkIn: "Mar 25, 2026", checkOut: "Mar 29, 2026", status: "Confirmed", amount: "$1,800", avatar: "MK" },
];

const statusStyles: Record<string, { bg: string, text: string, icon: any, dot: string }> = {
  Confirmed: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, dot: "bg-green-600" },
  Pending: { bg: "bg-orange-100", text: "text-[#D97706]", icon: Clock, dot: "bg-[#F59E0B]" },
  Cancelled: { bg: "bg-red-50", text: "text-red-700", icon: AlertCircle, dot: "bg-red-500" },
};

const BookingsPage: React.FC = () => {
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = allBookings.filter(b => {
    const matchesFilter = filter === "All" || b.status === filter;
    const matchesSearch = b.guest.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.room.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-[#111827] tracking-tight">Reservations</h1>
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest">
              {filtered.length} Totals
            </span>
          </div>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Manage and track all guest stays</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex px-5 py-3 bg-white border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-[#111827] hover:bg-gray-50 transition-all shadow-sm gap-2 items-center">
            <Download size={14} strokeWidth={3} /> Export CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-[#111827] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#1F7A3A] transition-all shadow-xl shadow-[#1F7A3A]/20 flex items-center gap-2"
          >
            <Plus size={16} strokeWidth={3} />
            Add Reservation
          </button>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-white p-4 rounded-[32px] border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 lg:pb-0 w-full lg:w-auto custom-scrollbar">
          {["All", "Confirmed", "Pending", "Cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                filter === f 
                  ? "bg-[#111827] text-white shadow-lg shadow-black/10" 
                  : "text-gray-400 hover:text-[#111827] hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2.5} />
            <input 
              placeholder="Search by name, ID or room..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-transparent rounded-[20px] text-[13px] font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#1F7A3A]/5 focus:border-[#1F7A3A]/20 focus:bg-white transition-all" 
            />
          </div>
          
          <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl">
            <button 
              onClick={() => setView("list")}
              aria-label="List view"
              title="Switch to list view"
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${view === "list" ? "bg-white text-[#111827] shadow-md" : "text-gray-400 hover:text-gray-600"}`}
            >
              <List size={18} strokeWidth={2.5} />
            </button>
            <button 
              onClick={() => setView("grid")}
              aria-label="Grid view"
              title="Switch to grid view"
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${view === "grid" ? "bg-white text-[#111827] shadow-md" : "text-gray-400 hover:text-gray-600"}`}
            >
              <LayoutGrid size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Areas */}
      {view === "list" ? (
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Guest Details</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Room Info</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Check In/Out</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total Price</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((b, i) => {
                  const style = statusStyles[b.status];
                  return (
                    <tr key={i} className="hover:bg-gray-50/50 transition-all duration-300 group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-[#14532D] text-white flex items-center justify-center text-[11px] font-black uppercase tracking-widest shadow-xl shadow-black/10 group-hover:scale-110 transition-transform">
                            {b.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-black text-[#111827] leading-none mb-1">{b.guest}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ORDER #{b.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#1F7A3A] transition-colors">
                            <BedDouble size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-[#111827]">Room {b.room}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tier Level</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                            <Calendar size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#111827] truncate max-w-[150px]">{b.checkIn} - {b.checkOut}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Business Stay</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-[#1F7A3A]">
                          <CreditCard size={14} strokeWidth={2.5} />
                          <p className="text-base font-black tracking-tight">{b.amount}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${style.bg} ${style.text}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {b.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#1F7A3A] hover:bg-[#1F7A3A]/5 transition-all">Details</button>
                          <button 
                            className="w-9 h-9 rounded-xl hover:bg-[#0C2012] group/btn flex items-center justify-center text-gray-400 transition-all"
                            aria-label="More actions"
                            title="More actions"
                          >
                            <MoreVertical size={16} className="group-hover/btn:text-white" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((b, i) => {
            const style = statusStyles[b.status];
            return (
              <div key={i} className="group bg-white p-8 rounded-[40px] border border-gray-100 hover:border-[#1F7A3A]/20 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#14532D] text-white flex items-center justify-center text-[12px] font-black uppercase tracking-widest shadow-xl shadow-black/10">
                      {b.avatar}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#111827]">{b.guest}</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{b.id}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${style.bg} ${style.text}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                    {b.status}
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-3xl bg-gray-50/50 border border-gray-100/50">
                    <div className="flex items-center gap-3">
                      <BedDouble size={18} className="text-[#F59E0B]" strokeWidth={2.5} />
                      <p className="text-sm font-black text-[#111827]">Room {b.room}</p>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Premium Tier</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-3xl border border-gray-100 group-hover:bg-gray-50 transition-colors">
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Check In</p>
                      <p className="text-sm font-black text-[#111827]">{b.checkIn}</p>
                    </div>
                    <div className="p-4 rounded-3xl border border-gray-100 group-hover:bg-gray-50 transition-colors">
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Check Out</p>
                      <p className="text-sm font-black text-[#111827]">{b.checkOut}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Net Payable</span>
                    <span className="text-xl font-black text-[#1F7A3A] tracking-tighter">{b.amount}</span>
                  </div>
                  <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#111827] hover:text-[#1F7A3A] transition-all group/btn">
                    Manage Booking <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <CreateOfflineReservationModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={() => {
               // In a real app we'd refresh the list
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingsPage;
