import React, { useState } from "react";
import { 
  Search, CreditCard, DollarSign, 
  ArrowUpRight, ArrowDownRight, 
  Download, Filter, Plus, 
  CheckCircle2, Clock, AlertCircle,
  MoreVertical, Landmark, Wallet,
  Receipt, Calendar
} from "lucide-react";

const payments = [
  { id: "PAY-01024", guest: "Rajesh Sharma", room: "204", amount: "$120.00", method: "UPI / QR", date: "Mar 24, 2026", status: "Completed", avatar: "RS" },
  { id: "PAY-01025", guest: "Sita Devi", room: "105", amount: "$45.50", method: "Cash", date: "Mar 24, 2026", status: "Pending", avatar: "SD" },
  { id: "PAY-01026", guest: "Anita Gurung", room: "302", amount: "$230.00", method: "Card Terminal", date: "Mar 24, 2026", status: "Completed", avatar: "AG" },
  { id: "PAY-01027", guest: "Meena Karki", room: "210", amount: "$1,250.00", method: "Bank Transfer", date: "Mar 23, 2026", status: "Completed", avatar: "MK" },
  { id: "PAY-01028", guest: "Bikash Thapa", room: "108", amount: "$35.00", method: "UPI / QR", date: "Mar 25, 2026", status: "Failed", avatar: "BT" },
];

const payStatusStyles: Record<string, { bg: string, text: string, icon: any, dot: string }> = {
  Completed: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, dot: "bg-green-600" },
  Pending: { bg: "bg-orange-100", text: "text-[#D97706]", icon: Clock, dot: "bg-[#F59E0B]" },
  Failed: { bg: "bg-red-50", text: "text-red-700", icon: AlertCircle, dot: "bg-red-500" },
};

const methodIcons: Record<string, any> = {
  "UPI / QR": SmartphoneIcon,
  "Cash": Wallet,
  "Card Terminal": CreditCard,
  "Bank Transfer": Landmark,
};

function SmartphoneIcon(props: any) {
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
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}

const PaymentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPayments = payments.filter(p => 
    p.guest.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.room.includes(searchQuery)
  );

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-[#111827] tracking-tight">Financial Transactions</h1>
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest">
              FY 2026-27
            </span>
          </div>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Track revenue, pending bills and settlements</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex px-5 py-3 bg-white border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-[#111827] hover:bg-gray-50 transition-all shadow-sm gap-2">
            <Download size={14} strokeWidth={3} /> Reconciliation Report
          </button>
          <button className="px-6 py-3 bg-[#14532D] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#1F7A3A] transition-all shadow-xl shadow-[#1F7A3A]/20 flex items-center gap-2">
            <Plus size={16} strokeWidth={3} /> Post Charge
          </button>
        </div>
      </div>

      {/* Financial Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Net Revenue Today", value: "$4,250", trend: "+12.4%", trendUp: true, color: "bg-primary-green", textColor: "text-primary-green", icon: DollarSign },
          { label: "Pending Settlements", value: "$1,120", trend: "+$240 today", trendUp: false, color: "bg-primary-gold", textColor: "text-primary-gold", icon: Clock },
          { label: "Total Receivables", value: "$18,400", trend: "from 24 guests", trendUp: true, color: "bg-[#14532D]", textColor: "text-[#14532D]", icon: Receipt },
        ].map((s, i) => (
          <div key={i} className="group bg-white p-8 rounded-[40px] border border-gray-100 hover:border-[#F59E0B]/30 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden">
            <div className="flex items-start justify-between relative z-10">
              <div className={`w-14 h-14 rounded-2xl ${s.color} text-white flex items-center justify-center shadow-lg shadow-black/10 group-hover:scale-110 transition-transform`}>
                <s.icon size={24} strokeWidth={2.5} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full ${s.trendUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                {s.trendUp ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
                {s.trend.split(" ")[0]}
              </div>
            </div>
            <div className="mt-8 relative z-10">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">{s.label}</h3>
              <p className="text-4xl font-black text-[#111827] mt-1 tracking-tighter">{s.value}</p>
              <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">{s.trend.includes(" ") ? s.trend : "vs. average"}</p>
            </div>
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 ${s.color} opacity-5 rounded-full blur-3xl`} />
          </div>
        ))}
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2.5} />
          <input 
            placeholder="Search by transaction ID, guest name or room..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-4 py-4 bg-gray-50/50 border border-transparent rounded-[24px] text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#1F7A3A]/5 focus:border-[#1F7A3A]/20 focus:bg-white transition-all shadow-inner" 
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-[20px] bg-gray-100 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-200 transition-all">
            <Filter size={16} strokeWidth={2.5} /> Filter Date
          </button>
        </div>
      </div>

      {/* Transactions Table Section */}
      <div className="bg-white rounded-[48px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Transaction Details</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Guest & Room</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Payment Gateway</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Gross Amount</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPayments.map((p, i) => {
                const style = payStatusStyles[p.status];
                const MethodIcon = methodIcons[p.method] || CreditCard;
                return (
                  <tr key={i} className="hover:bg-gray-50/50 transition-all duration-300 group">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#1F7A3A] group-hover:bg-[#1F7A3A]/5 transition-all">
                          <Receipt size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#111827] leading-none mb-1">{p.id}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Calendar size={10} /> {p.date}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#14532D] text-white flex items-center justify-center text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/10 group-hover:scale-110 transition-transform">
                          {p.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#111827]">{p.guest}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">RM {p.room}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[14px] bg-gray-50 flex items-center justify-center text-gray-400">
                          <MethodIcon size={18} strokeWidth={2.5} />
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-gray-500">{p.method}</p>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <p className="text-base font-black text-[#1F7A3A] tracking-tighter">{p.amount}</p>
                    </td>
                    <td className="px-10 py-7">
                      <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${style.bg} ${style.text}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        {p.status}
                      </span>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#111827] hover:bg-gray-100 transition-all">Details</button>
                        <button 
                          className="w-11 h-11 rounded-xl hover:bg-[#14532D] group/btn flex items-center justify-center text-gray-400 transition-all shadow-sm hover:shadow-lg"
                          aria-label="Transaction options"
                          title="More options for this payment"
                        >
                          <MoreVertical size={18} className="group-hover/btn:text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-8 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Showing page 1 of 12</p>
          <div className="flex items-center gap-2">
            {[1, 2, 3, "...", 12].map((n, i) => (
              <button key={i} className={`w-9 h-9 rounded-xl text-[10px] font-black flex items-center justify-center transition-all ${n === 1 ? "bg-[#14532D] text-white shadow-lg" : "text-gray-400 hover:text-[#111827] hover:bg-white"}`}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
