import { Link } from "react-router-dom";
import { Users, Warehouse, Settings, BarChart3, ArrowUpRight } from "lucide-react";

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
      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="group relative flex flex-col gap-2.5 p-3.5 rounded-xl border border-neutral-border/60 hover:border-primary-green/30 bg-neutral-light/50 hover:bg-primary-dark transition-all duration-200"
          >
            <ArrowUpRight
              size={13}
              strokeWidth={2.5}
              className="absolute top-3 right-3 text-neutral-text-secondary/40 group-hover:text-primary-gold opacity-0 group-hover:opacity-100 transition-all"
            />
            <div className="w-9 h-9 rounded-lg bg-primary-dark group-hover:bg-primary-gold/15 flex items-center justify-center transition-colors">
              <action.icon size={16} className="text-primary-gold" strokeWidth={2} />
            </div>
            <span className="text-[12px] font-semibold text-primary-dark group-hover:text-white leading-tight transition-colors">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
