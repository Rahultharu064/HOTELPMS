import React, { useState, useEffect } from "react";
import { 
  Search, CreditCard, DollarSign, 
  ArrowUpRight, ArrowDownRight, 
  Download, Filter, Plus, 
  CheckCircle2, Clock, AlertCircle,
  MoreVertical, Landmark, Wallet,
  Receipt, Calendar, Loader2, Utensils
} from "lucide-react";
import { paymentService } from "../../services/paymentService";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const payStatusStyles: Record<string, { bg: string, text: string, dot: string }> = {
  completed: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-600" },
  pending: { bg: "bg-orange-100", text: "text-[#D97706]", dot: "bg-[#F59E0B]" },
  failed: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

const methodIcons: Record<string, any> = {
  "esewa": SmartphoneIcon,
  "khalti": SmartphoneIcon,
  "cash": Wallet,
  "card": CreditCard,
  "bank_transfer": Landmark,
};

function SmartphoneIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" />
    </svg>
  );
}

const PaymentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"booking" | "service">("booking");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const fetchPayments = async (page: number = 1) => {
    try {
      setLoading(true);
      const res = await paymentService.getAllPayments({
        page,
        limit: 10,
        type: activeTab,
        search: searchQuery
      });
      if (res.success) {
        setData(res.data.payments);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      toast.error("Cloud synchronization failure");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [activeTab, searchQuery]);

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-[#111827] tracking-tight">Financial Treasury</h1>
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest">
              Live Ledger
            </span>
          </div>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Segregated revenue tracking & operational settlements</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex px-5 py-3 bg-white border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-[#111827] transition-all shadow-sm gap-2">
            <Download size={14} strokeWidth={3} /> Reconciliation
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-gray-100 rounded-[24px] w-fit">
        <button 
          onClick={() => setActiveTab("booking")}
          className={`flex items-center gap-3 px-8 py-3.5 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all
            ${activeTab === "booking" ? "bg-white text-[#111827] shadow-xl shadow-black/5" : "text-gray-400 hover:text-gray-600"}`}
        >
          <BedDoubleIcon size={16} /> Accommodation Folios
        </button>
        <button 
          onClick={() => setActiveTab("service")}
          className={`flex items-center gap-3 px-8 py-3.5 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all
            ${activeTab === "service" ? "bg-white text-[#111827] shadow-xl shadow-black/5" : "text-gray-400 hover:text-gray-600"}`}
        >
          <Utensils size={16} /> Service Settlements
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2.5} />
          <input 
            placeholder={`Search ${activeTab === 'booking' ? 'Folio ID, Guest or Room...' : 'Service ID, Name or Order...'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-14 pr-6 bg-gray-50/50 border border-transparent rounded-[20px] text-[13px] font-bold focus:bg-white focus:ring-4 focus:ring-primary-green/5 transition-all outline-none" 
          />
        </div>
        <button className="w-full md:w-auto px-8 h-14 bg-[#111827] text-white rounded-[20px] text-[11px] font-black uppercase tracking-widest hover:bg-[#1F7A3A] transition-all shadow-xl shadow-black/10">
          <Filter size={16} className="inline mr-2" /> Extended Filters
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
            <div className="py-40 flex flex-col items-center justify-center gap-4 text-gray-400">
                <Loader2 className="animate-spin" size={40} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Querying Ledger...</p>
            </div>
        ) : data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{activeTab === 'booking' ? 'Folio Identifier' : 'Order Identifier'}</th>
                  <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{activeTab === 'booking' ? 'Patron & Unit' : 'Recipient'}</th>
                  <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Mechanism</th>
                  <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Valuation</th>
                  <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                  <th className="px-10 py-7"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map((p, i) => {
                  const style = payStatusStyles[p.status.toLowerCase()] || payStatusStyles.pending;
                  const MethodIcon = methodIcons[p.method] || CreditCard;
                  const identifier = activeTab === 'booking' ? p.booking?.bookingNumber : p.serviceOrder?.orderNumber;
                  const recipient = activeTab === 'booking' 
                    ? `${p.booking?.guest?.firstName} ${p.booking?.guest?.lastName}` 
                    : p.serviceOrder?.requestedBy;
                  
                  return (
                    <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={p.id} 
                        className="hover:bg-gray-50/50 transition-all group"
                    >
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${activeTab === 'booking' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                            <Receipt size={18} strokeWidth={2.5} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-[#111827] leading-none mb-1">{identifier}</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{new Date(p.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${activeTab === 'booking' ? 'bg-[#14532D]' : 'bg-[#111827]'}`}>
                            {recipient?.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-[13px] font-black text-[#111827] uppercase">{recipient}</p>
                            {activeTab === 'booking' && <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unit Assigned</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-[14px] bg-gray-50 flex items-center justify-center text-gray-400">
                            <MethodIcon size={18} strokeWidth={2.5} />
                          </div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{p.method.replace('_', ' ')}</p>
                        </div>
                      </td>
                      <td className="px-10 py-7">
                        <p className="text-base font-black text-[#1F7A3A] tracking-tighter">Rs. {Number(p.amount).toLocaleString()}</p>
                      </td>
                      <td className="px-10 py-7">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] ${style.bg} ${style.text}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {p.status}
                        </span>
                      </td>
                      <td className="px-10 py-7 text-right">
                        <button className="p-3 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-[#111827] transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-40 flex flex-col items-center justify-center text-gray-300 gap-4 opacity-40">
            <Landmark size={64} strokeWidth={1.5} />
            <div className="text-center">
                <p className="text-[11px] font-black uppercase tracking-[0.3em]">Vault is Empty</p>
                <p className="text-xs font-bold mt-2">No {activeTab} settlements found for this period</p>
            </div>
          </div>
        )}
        
        {data.length > 0 && (
            <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Audit Page {pagination.page} of {pagination.totalPages}</p>
                <div className="flex gap-2">
                    <button 
                        disabled={pagination.page === 1}
                        onClick={() => fetchPayments(pagination.page - 1)}
                        className="h-10 px-6 rounded-xl bg-white border border-gray-100 text-[10px] font-black uppercase tracking-widest disabled:opacity-30"
                    >
                        Prev
                    </button>
                    <button 
                         disabled={pagination.page === pagination.totalPages}
                         onClick={() => fetchPayments(pagination.page + 1)}
                         className="h-10 px-6 rounded-xl bg-[#111827] text-white text-[10px] font-black uppercase tracking-widest disabled:opacity-30 shadow-lg shadow-black/10"
                    >
                        Next
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
