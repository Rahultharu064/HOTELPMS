import React, { useState } from "react";
import { 
  User, Bed, Calendar, Hash, 
  ChevronRight, Utensils, Shirt, Flower, 
  Plus, ArrowRight, Receipt, CreditCard, 
  Wallet, DollarSign, Download, Printer,
  CheckCircle2, AlertCircle, Trash2, 
  Smartphone, Banknote, Menu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Mock Data ---
const MOCK_GUEST = {
  name: "Rahul Tharu",
  room: "202 - Deluxe",
  checkIn: "Apr 12, 2026",
  checkOut: "Apr 15, 2026",
  folioId: "FL-29104",
  status: "OPEN"
};

const MOCK_CHARGES = [
  { id: 1, date: "2026-04-12", description: "Room Charge (2 Nights)", type: "Accommodation", amount: 15000, category: "room" },
  { id: 2, date: "2026-04-12", description: "Dinner - In-room Dining", type: "Food & Beverage", amount: 1250, category: "food" },
  { id: 3, date: "2026-04-13", description: "Laundry Service - Express", type: "Laundry", amount: 450, category: "laundry" },
  { id: 4, date: "2026-04-13", description: "Spa - Swedish Massage", type: "Wellness", amount: 3500, category: "spa" },
];

const GuestFolioPage: React.FC = () => {
  const [activeFolio, setActiveFolio] = useState(MOCK_GUEST);
  const [charges, setCharges] = useState(MOCK_CHARGES);

  const subtotal = charges.reduce((acc, curr) => acc + curr.amount, 0);
  const tax = subtotal * 0.13;
  const totalAmount = subtotal + tax;
  const paidAmount = 10000;
  const balanceDue = totalAmount - paidAmount;

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 animate-fade-in px-4 md:px-0">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pt-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-[#111827] tracking-tight">Guest Folio</h1>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              activeFolio.status === "OPEN" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
            }`}>
              {activeFolio.status} LEDGER
            </span>
          </div>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Comprehensive billing & financial audit for {activeFolio.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-[#111827] transition-all shadow-sm">
            <Printer size={14} strokeWidth={3} /> Print Statement
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-[#111827] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#1F7A3A] transition-all shadow-xl shadow-black/10">
            <Download size={14} strokeWidth={3} /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── 1. BOOKING INFO PANEL (LEFT) ── */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 flex flex-col gap-6"
        >
          <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm">
            <div className="bg-blue-600 p-8 text-white relative overflow-hidden">
               <div className="relative z-10">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">Primary Guest</p>
                 <h2 className="text-2xl font-black uppercase tracking-tight">{activeFolio.name}</h2>
               </div>
               {/* Decorative Circle */}
               <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            <div className="p-8 space-y-6">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Bed size={20} strokeWidth={2.5} />
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unit Assigned</p>
                   <p className="text-sm font-black text-[#111827]">{activeFolio.room}</p>
                 </div>
               </div>
               
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Calendar size={20} strokeWidth={2.5} />
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stay Period</p>
                   <p className="text-sm font-black text-[#111827]">{activeFolio.checkIn} — {activeFolio.checkOut}</p>
                 </div>
               </div>

               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Hash size={20} strokeWidth={2.5} />
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Folio Reference</p>
                   <p className="text-sm font-black text-[#111827]">{activeFolio.folioId}</p>
                 </div>
               </div>
            </div>
          </div>

          {/* ── 5. PAYMENTS SECTION (Below Booking Info for better balance) ── */}
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm border-t-4 border-t-orange-500">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#111827]">Settle Payment</h3>
                <CreditCard size={18} className="text-orange-500" strokeWidth={2.5} />
             </div>
             
             <div className="grid grid-cols-2 gap-3 mb-8">
                <button className="p-4 rounded-[20px] border-2 border-gray-50 flex flex-col items-center gap-2 hover:border-[#60BB46] hover:bg-[#60BB46]/5 transition-all group">
                  <div className="w-10 h-10 bg-[#60BB46] rounded-xl flex items-center justify-center text-white font-black text-[10px] shadow-lg shadow-[#60BB46]/20 group-hover:scale-110 transition-transform">eSewa</div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#60BB46]">eSewa</span>
                </button>
                <button className="p-4 rounded-[20px] border-2 border-gray-50 flex flex-col items-center gap-2 hover:border-[#5C2D91] hover:bg-[#5C2D91]/5 transition-all group">
                  <div className="w-10 h-10 bg-[#5C2D91] rounded-xl flex items-center justify-center text-white font-black text-[8px] shadow-lg shadow-[#5C2D91]/20 group-hover:scale-110 transition-transform uppercase">Khalti</div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#5C2D91]">Khalti</span>
                </button>
                <button className="p-4 rounded-[20px] border-2 border-gray-50 flex flex-col items-center gap-2 hover:border-[#111827] hover:bg-gray-50 transition-all group lg:col-span-2">
                  <Banknote size={24} className="text-gray-400 group-hover:text-[#111827] group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#111827]">Cash Settlement</span>
                </button>
             </div>

             <div className="space-y-4 pt-4 border-t border-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Previously Paid</span>
                  <span className="text-sm font-black text-orange-600">Rs. {paidAmount.toLocaleString()}</span>
                </div>
                <button className="w-full py-4 bg-orange-500 text-white rounded-[20px] text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-200">
                  Process New Payment
                </button>
             </div>
          </div>
        </motion.div>

        {/* ── CENTER & RIGHT SECTIONS ── */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* ── 2. SERVICE ORDERS SECTION (TOP CENTER) ── */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-blue-500 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-colors">
                  <Utensils size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Add Food</p>
                  <p className="text-xs font-black text-[#111827]">Dining Order</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-blue-500 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                  <Shirt size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Add Service</p>
                  <p className="text-xs font-black text-[#111827]">Laundry Dept</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-blue-500 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-fuchsia-50 flex items-center justify-center text-fuchsia-600 group-hover:bg-fuchsia-100 transition-colors">
                  <Flower size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Book Spa</p>
                  <p className="text-xs font-black text-[#111827]">Wellness Hub</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
          </motion.div>

          {/* ── 3. FOLIO SUMMARY CARD (CENTER HIGHLIGHT) ── */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-600 rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-emerald-200 relative overflow-hidden"
          >
            <div className="relative z-10 flex-1 border-r border-white/20 md:pr-10">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Gross Indebtedness</p>
               <h3 className="text-4xl font-black tracking-tighter">Rs. {totalAmount.toLocaleString()}</h3>
            </div>
            
            <div className="relative z-10 flex-1 border-r border-white/20 md:px-10">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Paid Aggregate</p>
               <h3 className="text-4xl font-black tracking-tighter">Rs. {paidAmount.toLocaleString()}</h3>
            </div>

            <div className="relative z-10 flex-1 md:pl-10">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-200 mb-2">Net Outstanding</p>
               <h3 className="text-4xl font-black tracking-tighter">Rs. {balanceDue.toLocaleString()}</h3>
            </div>

            {/* Background Accent */}
            <div className="absolute bottom-[-50px] left-[-20px] w-64 h-64 bg-white/10 rounded-full blur-[100px]"></div>
          </motion.div>

          {/* ── 4. CHARGES TABLE (BOTTOM WIDE) ── */}
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-10 py-7 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#111827]">Transaction Ledger</h3>
              <div className="flex items-center gap-2">
                 <button className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 transition-all">
                    <Trash2 size={16} />
                 </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Service Date</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Description</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Valuation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {charges.map((charge, idx) => (
                    <motion.tr 
                      key={charge.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="hover:bg-gray-50/50 transition-all group"
                    >
                      <td className="px-10 py-6 text-sm font-bold text-gray-400 font-mono italic">{charge.date}</td>
                      <td className="px-10 py-6">
                        <p className="text-[13px] font-black text-[#111827] uppercase">{charge.description}</p>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                          charge.category === 'room' ? 'bg-blue-50 text-blue-600' :
                          charge.category === 'food' ? 'bg-amber-50 text-amber-600' :
                          charge.category === 'laundry' ? 'bg-emerald-50 text-emerald-600' :
                          'bg-fuchsia-50 text-fuchsia-600'
                        }`}>
                          {charge.type}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <p className="text-base font-black text-[#111827] tracking-tight">Rs. {charge.amount.toLocaleString()}</p>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Empty space or additional info */}
            <div></div>

            {/* ── 6. BILLING SUMMARY (BOTTOM RIGHT) ── */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm"
            >
               <h3 className="text-xs font-black uppercase tracking-widest text-[#111827] mb-8 pb-4 border-b border-gray-50">Financial Reconciliation</h3>
               
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-gray-400">
                    <span className="text-[10px] font-black uppercase tracking-widest">Base Accommodation</span>
                    <span className="text-sm font-bold">Rs. {charges.find(c => c.category === 'room')?.amount.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-400">
                    <span className="text-[10px] font-black uppercase tracking-widest">Operational Services</span>
                    <span className="text-sm font-bold">Rs. {charges.filter(c => c.category !== 'room').reduce((a,b) => a + b.amount, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-400">
                    <span className="text-[10px] font-black uppercase tracking-widest">Subtotal (Net)</span>
                    <span className="text-sm font-bold">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-600">
                    <span className="text-[10px] font-black uppercase tracking-widest">Tax Provision (13%)</span>
                    <span className="text-sm font-black">+ Rs. {tax.toLocaleString()}</span>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-gray-100">
                     <div className="flex justify-between items-center mb-1">
                        <span className="text-[12px] font-black uppercase tracking-widest text-[#111827]">Total Receivable</span>
                        <span className="text-xl font-black text-[#111827]">Rs. {totalAmount.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center mb-8">
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Already Settled</span>
                        <span className="text-sm font-black text-orange-500">- Rs. {paidAmount.toLocaleString()}</span>
                     </div>
                  </div>

                  <div className="p-6 rounded-[24px] bg-[#111827] text-white flex items-center justify-between shadow-xl shadow-black/10">
                     <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Balance Due</span>
                     <span className="text-lg font-black italic">Rs. {balanceDue.toLocaleString()}</span>
                  </div>
               </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GuestFolioPage;
