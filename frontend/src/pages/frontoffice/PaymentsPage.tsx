import React, { useState, useEffect } from "react";
import { 
  Search, 
  Download, Filter, Plus, 
  CheckCircle2, AlertCircle,
  MoreVertical, Landmark,
  Receipt, Utensils,
  ArrowRight, Hash,
  TrendingUp, Activity, PieChart
} from "lucide-react";
import { bookingService } from "../../services/bookingService";
import { extraService } from "../../services/extraService";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const payStatusStyles: Record<string, { bg: string, text: string, dot: string }> = {
  paid: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-600" },
  partial: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-600" },
  unpaid: { bg: "bg-rose-100", text: "text-rose-700", dot: "bg-rose-600" },
  pending: { bg: "bg-orange-100", text: "text-[#D97706]", dot: "bg-[#F59E0B]" },
  failed: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

const PaymentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"accommodation" | "services">("accommodation");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalReceivable: 0,
    totalCollected: 0,
    totalOutstanding: 0
  });
  const navigate = useNavigate();

  const fetchSettlements = async () => {
    try {
      setLoading(true);
      if (activeTab === "accommodation") {
        const res = await bookingService.getAllBookings({ limit: 100, search: searchQuery });
        if (res.success) {
          const settlements = res.data.bookings.map((b: any) => {
            const paid = b.payments?.filter((p: any) => p.status === 'completed').reduce((acc: number, curr: any) => acc + Number(curr.amount), 0) || 0;
            const total = Number(b.totalAmount);
            let status = "unpaid";
            if (paid >= total) status = "paid";
            else if (paid > 0) status = "partial";
            
            return {
              id: b.id,
              identifier: b.bookingNumber,
              recipient: `${b.guest?.firstName} ${b.guest?.lastName}`,
              totalAmount: total,
              paidAmount: paid,
              balance: total - paid,
              status,
              date: b.createdAt,
              type: "Accommodation",
              room: b.room?.roomNumber
            };
          });
          setData(settlements);
          calculateStats(settlements);
        }
      } else {
        const res = await extraService.getOrders({ limit: 100, search: searchQuery });
        if (res.success) {
          const settlements = res.data.map((o: any) => {
            const paid = o.payments?.filter((p: any) => p.status === 'completed').reduce((acc: number, curr: any) => acc + Number(curr.amount), 0) || 0;
            const total = Number(o.totalAmount);
            let status = "unpaid";
            if (paid >= total) status = "paid";
            else if (paid > 0) status = "partial";

            return {
              id: o.id,
              identifier: o.orderNumber,
              recipient: o.requestedBy || "Walk-in Guest",
              totalAmount: total,
              paidAmount: paid,
              balance: total - paid,
              status,
              date: o.createdAt,
              type: "Service Order",
              room: o.room?.roomNumber || "N/A"
            };
          });
          setData(settlements);
          calculateStats(settlements);
        }
      }
    } catch (error) {
      toast.error("Failed to synchronize with financial cloud");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (settlements: any[]) => {
    const totalRec = settlements.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const totalColl = settlements.reduce((acc, curr) => acc + curr.paidAmount, 0);
    setStats({
      totalReceivable: totalRec,
      totalCollected: totalColl,
      totalOutstanding: totalRec - totalColl
    });
  };

  useEffect(() => {
    fetchSettlements();
  }, [activeTab, searchQuery]);

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* ── HEADER & KPI CARDS ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-[#14532D] flex items-center justify-center text-white shadow-xl shadow-green-900/20">
              <Landmark size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#111827] tracking-tighter uppercase italic">Treasury Ledger</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Real-time Financial Audit</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-[#111827] transition-all shadow-sm group">
              <Download size={14} strokeWidth={3} className="group-hover:translate-y-0.5 transition-transform" /> Export Sheet
           </button>
           <button className="flex items-center gap-2 px-8 py-4 bg-[#111827] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#1F7A3A] transition-all shadow-2xl shadow-black/20">
              <Plus size={14} strokeWidth={3} /> New Entry
           </button>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group"
        >
          <div className="relative z-10">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Total Receivable</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-[#111827]">Rs. {stats.totalReceivable.toLocaleString()}</h3>
              <span className="text-[10px] font-bold text-blue-500 flex items-center gap-1">
                <TrendingUp size={12} /> +4.2%
              </span>
            </div>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] text-gray-50 group-hover:text-blue-50 transition-colors">
            <Activity size={120} strokeWidth={4} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#14532D] p-8 rounded-[40px] shadow-2xl shadow-green-900/20 relative overflow-hidden group"
        >
          <div className="relative z-10">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-4 text-emerald-200">Collected Revenue</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-white">Rs. {stats.totalCollected.toLocaleString()}</h3>
              <div className="px-2 py-0.5 rounded-lg bg-white/10 text-[9px] font-black text-emerald-300">SECURE</div>
            </div>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] text-white/5">
            <CheckCircle2 size={120} strokeWidth={4} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-rose-600 p-8 rounded-[40px] shadow-2xl shadow-rose-900/20 relative overflow-hidden group"
        >
          <div className="relative z-10">
            <p className="text-[10px] font-black text-rose-200 uppercase tracking-[0.3em] mb-4">Net Outstanding</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-white">Rs. {stats.totalOutstanding.toLocaleString()}</h3>
              <span className="text-[10px] font-bold text-rose-200 flex items-center gap-1">
                <AlertCircle size={12} /> Critical
              </span>
            </div>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] text-white/5">
            <PieChart size={120} strokeWidth={4} />
          </div>
        </motion.div>
      </div>

      {/* ── CONTROL & TABS ── */}
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="flex gap-2 p-1.5 bg-gray-100 rounded-[24px] w-full lg:w-fit">
          <button 
            onClick={() => setActiveTab("accommodation")}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-widest transition-all
              ${activeTab === "accommodation" ? "bg-white text-[#111827] shadow-xl shadow-black/5" : "text-gray-400 hover:text-gray-600"}`}
          >
            <BedDoubleIcon size={16} /> Accommodation Folios
          </button>
          <button 
            onClick={() => setActiveTab("services")}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-widest transition-all
              ${activeTab === "services" ? "bg-white text-[#111827] shadow-xl shadow-black/5" : "text-gray-400 hover:text-gray-600"}`}
          >
            <Utensils size={16} /> Service Settlements
          </button>
        </div>

        <div className="flex-1 w-full relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2.5} />
          <input 
            placeholder={`Search by identifier, recipient or room...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-16 pl-16 pr-8 bg-white border border-gray-100 rounded-[28px] text-[13px] font-bold focus:ring-4 focus:ring-[#14532D]/5 transition-all outline-none shadow-sm" 
          />
        </div>
        
        <button className="h-16 px-8 bg-white border border-gray-100 rounded-[28px] text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-[#111827] transition-all shadow-sm flex items-center gap-3">
          <Filter size={16} strokeWidth={2.5} /> Advanced Audit
        </button>
      </div>

      {/* ── DATA TABLE ── */}
      <div className="bg-white rounded-[48px] border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-gray-100 border-t-[#14532D] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-[#14532D]/10 rounded-full animate-pulse" />
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Synchronizing Ledger...</p>
          </div>
        ) : data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Reference</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Recipient & Unit</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Total Valuation</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Collected</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Balance Due</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Status</th>
                  <th className="px-10 py-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map((item, i) => {
                  const style = payStatusStyles[item.status] || payStatusStyles.pending;
                  
                  return (
                    <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        key={item.identifier} 
                        className="hover:bg-gray-50/50 transition-all group"
                    >
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${activeTab === 'accommodation' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                            <Receipt size={20} strokeWidth={2.5} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-[#111827] leading-none mb-1.5 uppercase italic tracking-tighter">{item.identifier}</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{new Date(item.date).toLocaleDateString()} • {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 border border-gray-200">
                             {item.recipient.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-[13px] font-black text-[#111827] uppercase">{item.recipient}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                               <Hash size={10} className="text-blue-500" />
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Room {item.room}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <p className="text-base font-black text-[#111827] tracking-tighter">Rs. {item.totalAmount.toLocaleString()}</p>
                      </td>
                      <td className="px-10 py-8">
                        <p className="text-sm font-black text-emerald-600 tracking-tighter">Rs. {item.paidAmount.toLocaleString()}</p>
                      </td>
                      <td className="px-10 py-8">
                        <p className={`text-base font-black tracking-tighter ${item.balance > 0 ? 'text-rose-600' : 'text-gray-300'}`}>
                           Rs. {item.balance.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-10 py-8">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.1em] ${style.bg} ${style.text} shadow-sm`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {item.status}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                             onClick={() => navigate(`/frontoffice/folio?id=${item.id}`)}
                             className="p-3 rounded-xl bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                             title="View Detailed Folio"
                           >
                             <ArrowRight size={18} strokeWidth={2.5} />
                           </button>
                           <button className="p-3 rounded-xl hover:bg-gray-100 text-gray-300 hover:text-[#111827] transition-all">
                             <MoreVertical size={18} />
                           </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-48 flex flex-col items-center justify-center text-gray-300 gap-6 opacity-30">
            <div className="w-24 h-24 rounded-[40px] bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200">
               <Receipt size={40} strokeWidth={1.5} />
            </div>
            <div className="text-center">
                <p className="text-[11px] font-black uppercase tracking-[0.4em]">Vault Ledger is Empty</p>
                <p className="text-xs font-bold mt-2">No {activeTab} records found for the current query</p>
            </div>
            <button 
              onClick={() => setSearchQuery("")}
              className="px-8 py-3 bg-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-200 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
        
        {data.length > 0 && (
            <div className="p-10 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Audit Stream v2.1</p>
                  <p className="text-[9px] font-bold text-gray-300 mt-1 uppercase">Showing {data.length} records</p>
                </div>
                <div className="flex gap-3">
                    <button className="h-12 px-8 rounded-2xl bg-white border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 disabled:opacity-30 shadow-sm transition-all hover:border-[#14532D] hover:text-[#14532D]">
                        Previous Page
                    </button>
                    <button className="h-12 px-10 rounded-2xl bg-[#111827] text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/10 transition-all hover:bg-[#14532D]">
                        Next Segment
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

function BedDoubleIcon(props: any) {
    return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" /><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" /><path d="M12 4v6" /><path d="M2 18h20" />
      </svg>
    );
}

export default PaymentsPage;
