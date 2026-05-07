import { ShieldCheck, Search } from "lucide-react";

export function SystemControlHub() {
  return (
    <div className="space-y-12">
      <div className="bg-gradient-to-br from-[#14532D] to-[#111827] p-12 rounded-[48px] text-white relative overflow-hidden group border border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F59E0B]/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-[2000ms]" />
        <ShieldCheck className="text-[#F59E0B] mb-8" size={32} />
        <h3 className="text-3xl font-black mb-4 leading-tight">Admin Portal<br /><span className="text-white/40 italic font-medium text-xl">Quick Access</span></h3>
        <p className="text-white/40 text-[11px] font-black uppercase tracking-widest leading-relaxed mb-12">Authorized access required for system modifications and settings.</p>
        <button className="w-full py-5 bg-[#F59E0B] text-[#14532D] rounded-[24px] text-[12px] font-black uppercase tracking-widest hover:bg-white hover:text-[#14532D] transition-all shadow-2xl shadow-black/20 active:scale-95">
          Verify Identity
        </button>
      </div>
      
      <div className="p-10 bg-white rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#111827]">
            <Search size={18} strokeWidth={3} />
          </div>
          <h4 className="text-sm font-black uppercase tracking-tighter">Quick Search</h4>
        </div>
        <div className="space-y-4">
          <input 
            placeholder="Search by ID or Name..." 
            className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:border-[#14532D]/20 focus:bg-white rounded-2xl text-[12px] font-medium outline-none transition-all shadow-inner"
          />
          <button className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-[#14532D] hover:bg-[#14532D]/5 transition-colors rounded-2xl">
            Search Records
          </button>
        </div>
      </div>
    </div>
  );
}
