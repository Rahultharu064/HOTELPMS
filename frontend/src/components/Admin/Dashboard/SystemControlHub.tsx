import { Link } from "react-router-dom";
import { Search, Settings, FileText } from "lucide-react";

const actions = [
  { label: "Search Guests", to: "/admin/guests", icon: Search },
  { label: "System Settings", to: "/admin/settings", icon: Settings },
  { label: "View Reports", to: "/admin/reports", icon: FileText },
];

export function SystemControlHub() {
  return (
    <div className="space-y-5">
      <div className="p-4 bg-white rounded-2xl border border-neutral-border/30 shadow-sm relative overflow-hidden group">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-7 h-7 rounded-xl bg-neutral-light flex items-center justify-center text-primary-dark">
            <Settings size={14} strokeWidth={2.5} />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-tighter text-primary-dark">Quick Actions</h4>
        </div>
        <div className="space-y-2">
          {actions.map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className="w-full px-3 py-2.5 bg-neutral-light/50 hover:bg-primary-dark/10 text-left rounded-xl text-[10px] font-bold text-primary-dark hover:text-primary-dark transition-all flex items-center gap-3"
            >
              <action.icon size={12} />
              <span>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
