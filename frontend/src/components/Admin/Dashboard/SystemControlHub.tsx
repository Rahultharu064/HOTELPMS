import { Link } from "react-router-dom";
import { Users, Warehouse, Settings, BarChart3 } from "lucide-react";

const actions = [
  { label: "Guests", to: "/admin/guests", icon: Users },
  { label: "Room Inventory", to: "/admin/rooms", icon: Warehouse },
  { label: "System Analytics", to: "/admin/reports", icon: BarChart3 },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export function SystemControlHub() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-border/60 shadow-sm h-full">
      <h3 className="text-sm font-semibold text-primary-dark mb-4">Quick actions</h3>
      <div className="space-y-1">
        {actions.map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="w-full px-3 py-2.5 hover:bg-neutral-light text-left rounded-lg text-[13px] font-medium text-primary-dark transition-colors flex items-center gap-3"
          >
            <action.icon size={16} className="text-neutral-text-secondary" strokeWidth={2} />
            <span>{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
