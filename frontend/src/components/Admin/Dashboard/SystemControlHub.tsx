import { Search, Zap, Settings, FileText } from "lucide-react";

export function SystemControlHub() {
  return (
    <div className="space-y-5">
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
