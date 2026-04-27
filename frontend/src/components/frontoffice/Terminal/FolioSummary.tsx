import React from 'react';
import { Receipt, Printer, Calendar, User } from 'lucide-react';

interface FolioSummaryProps {
  folio: any;
  onPrint: () => void;
}

export const FolioSummary: React.FC<FolioSummaryProps> = ({ folio, onPrint }) => {
  const guestInitials = folio.guestName
    ? folio.guestName.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : 'G';

  return (
    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/20 flex flex-col sm:flex-row items-center justify-between gap-8 group hover:border-emerald-500/20 transition-all duration-700 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-full bg-[#111827]" />
      
      <div className="flex items-center gap-6 relative z-10">
        <div className="relative">
          <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-[#111827] to-[#1f2937] flex items-center justify-center text-white shadow-2xl shadow-[#111827]/20 group-hover:scale-105 transition-transform duration-700">
            <span className="text-xl font-black tracking-tighter">{guestInitials}</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-emerald-500 border-4 border-white flex items-center justify-center text-white shadow-lg">
            <User size={14} strokeWidth={3} />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#111827]">Account Folio</h3>
            <div className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-emerald-100/50">
              Active
            </div>
          </div>
          
          <h2 className="text-2xl font-black text-[#111827] tracking-tighter leading-tight">
            Room {folio.roomNumber} <span className="text-gray-300 mx-2">/</span> {folio.guestName}
          </h2>
          
          <div className="flex items-center gap-4 pt-1">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={14} className="text-[#111827]" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Stay Period: {folio.checkInDate || 'N/A'} - {folio.checkOutDate || 'Today'}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-200" />
            <div className="flex items-center gap-2 text-gray-400">
               <Receipt size={14} className="text-[#111827]" />
               <span className="text-[10px] font-bold uppercase tracking-widest">{folio.extraServices?.length + folio.posServiceOrders?.length || 0} Incidentals</span>
            </div>
          </div>
        </div>
      </div>
      
      <button 
        onClick={onPrint}
        className="h-14 px-8 bg-[#111827] text-white hover:bg-emerald-600 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all duration-500 shadow-2xl shadow-[#111827]/20 active:scale-95 group/btn overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
        <Printer size={18} strokeWidth={2.5} className="relative z-10" /> 
        <span className="relative z-10">Export Invoice</span>
      </button>
    </div>
  );
};
