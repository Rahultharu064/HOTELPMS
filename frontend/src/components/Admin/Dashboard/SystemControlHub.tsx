import { ShieldCheck, Search, Zap, Settings, FileText } from "lucide-react";

export function SystemControlHub() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#14532D] to-[#1F7A3A] p-5 rounded-2xl text-white relative overflow-hidden group border border-white/5 shadow-sm">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#F59E0B]/10 rounded-full blur-[40px] pointer-events-none group-hover:scale-150 transition-transform duration-[2000ms]" />
        <ShieldCheck className="text-[#F59E0B] mb-3" size={20} />
        <h3 className="text-lg font-black mb-1 leading-tight">Admin Portal<br /><span className="text-white/40 italic font-medium text-xs">Quick Access</span></h3>
        <p className="text-white/40 text-[9px] font-bold uppercase tracking-wider leading-relaxed mb-4">Authorized access required for system modifications and settings.</p>
        <button className="w-full py-2.5 bg-[#F59E0B] text-[#14532D] rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-white hover:text-[#14532D] transition-all shadow-lg shadow-black/20 active:scale-95">
          Verify Identity
        </button>
      </div>
      
      <div className="p-4 bg-white rounded-2xl border border-neutral-border/30 shadow-sm relative overflow-hidden group">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-7 h-7 rounded-xl bg-neutral-light flex items-center justify-center text-primary-dark">
            <Zap size={14} strokeWidth={2.5} />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-tighter text-primary-dark">Quick Actions</h4>
        </div>
        <div className="space-y-2">
          <button className="w-full px-3 py-2.5 bg-neutral-light/50 hover:bg-[#14532D]/10 text-left rounded-xl text-[10px] font-bold text-primary-dark hover:text-[#14532D] transition-all flex items-center gap-3">
            <Search size={12} />
            <span>Search Records</span>
          </button>
          <button className="w-full px-3 py-2.5 bg-neutral-light/50 hover:bg-[#14532D]/10 text-left rounded-xl text-[10px] font-bold text-primary-dark hover:text-[#14532D] transition-all flex items-center gap-3">
            <Settings size={12} />
            <span>System Settings</span>
          </button>
          <button className="w-full px-3 py-2.5 bg-neutral-light/50 hover:bg-[#14532D]/10 text-left rounded-xl text-[10px] font-bold text-primary-dark hover:text-[#14532D] transition-all flex items-center gap-3">
            <FileText size={12} />
            <span>Quick Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}
