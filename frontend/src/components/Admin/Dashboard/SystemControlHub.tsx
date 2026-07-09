import { ShieldCheck, Search, Zap } from "lucide-react";

export function SystemControlHub() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-primary-dark to-primary-green p-6 rounded-2xl text-white relative overflow-hidden group border border-white/5 shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-gold/10 rounded-full blur-[60px] pointer-events-none group-hover:scale-150 transition-transform duration-[2000ms]" />
        <ShieldCheck className="text-primary-gold mb-4" size={24} />
        <h3 className="text-xl font-black mb-2 leading-tight">Admin Portal<br /><span className="text-white/40 italic font-medium text-sm">Quick Access</span></h3>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider leading-relaxed mb-6">Authorized access required for system modifications and settings.</p>
        <button className="w-full py-3 bg-primary-gold text-primary-dark rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-white hover:text-primary-dark transition-all shadow-lg shadow-black/20 active:scale-95">
          Verify Identity
        </button>
      </div>
      
      <div className="p-5 bg-white rounded-2xl border border-neutral-border/30 shadow-sm relative overflow-hidden group">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-neutral-light flex items-center justify-center text-primary-dark">
            <Zap size={16} strokeWidth={2.5} />
          </div>
          <h4 className="text-sm font-bold uppercase tracking-tighter text-primary-dark">Quick Actions</h4>
        </div>
        <div className="space-y-3">
          <button className="w-full px-4 py-3 bg-neutral-light/50 hover:bg-primary-green/10 text-left rounded-xl text-[11px] font-bold text-primary-dark hover:text-primary-green transition-all flex items-center gap-3">
            <Search size={14} />
            <span>Search Records</span>
          </button>
          <button className="w-full px-4 py-3 bg-neutral-light/50 hover:bg-primary-green/10 text-left rounded-xl text-[11px] font-bold text-primary-dark hover:text-primary-green transition-all flex items-center gap-3">
            <ShieldCheck size={14} />
            <span>System Settings</span>
          </button>
          <button className="w-full px-4 py-3 bg-neutral-light/50 hover:bg-primary-green/10 text-left rounded-xl text-[11px] font-bold text-primary-dark hover:text-primary-green transition-all flex items-center gap-3">
            <Zap size={14} />
            <span>Quick Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}
