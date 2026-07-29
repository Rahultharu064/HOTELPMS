import { useLocation, Link } from "react-router-dom";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { getImageUrl } from "../../../services/api";
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  ChevronLeft,
  Menu,
  Building2,
  LogOut,
  CreditCard,
  Warehouse,
  Zap,
  ShieldCheck,
  Images,
  CalendarCheck,
} from "lucide-react";
import { Button } from "../../ui/Button";

/** `roles` restricts an item to specific admin roles; omit to show it to everyone with panel access. */
const navGroups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Front Desk",
    items: [
      { title: "Bookings", url: "/admin/bookings", icon: CalendarCheck },
      { title: "Guests", url: "/admin/guests", icon: Users },
      { title: "Room Inventory", url: "/admin/rooms", icon: Warehouse },
      { title: "Room Types", url: "/admin/room-types", icon: Building2 },
    ],
  },
  {
    label: "Experience",
    items: [
      { title: "Extra Services", url: "/admin/extra-services", icon: Zap },
      { title: "Gallery & Venues", url: "/admin/gallery", icon: Images },
    ],
  },
  {
    label: "Management",
    items: [
      { title: "Financials", url: "/admin/financials", icon: CreditCard, roles: ["superadmin", "admin"] },
      { title: "System Analytics", url: "/admin/reports", icon: BarChart3 },
      { title: "Staff Management", url: "/admin/users", icon: ShieldCheck, roles: ["superadmin", "admin"] },
      { title: "Settings", url: "/admin/settings", icon: Settings, roles: ["superadmin", "admin"] },
    ],
  },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: AppSidebarProps) {
  const location = useLocation();

  const { adminLogout, admin } = useAdminAuth();

  const handleLogout = () => {
    adminLogout();
    window.location.href = '/admin/login'; // Force full redirect to clear any lingering memory state
  };

  const visibleGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.roles || (admin?.role && item.roles.includes(admin.role))),
    }))
    .filter((group) => group.items.length > 0);

  const isActive = (url: string) =>
    location.pathname === url || (url === "/admin" && location.pathname === "/admin/dashboard");

  const sidebarContent = (
    <div className={`flex flex-col h-full bg-primary-dark text-white transition-all duration-300 ${collapsed ? "w-[72px]" : "w-[264px]"}`}>
      {/* Brand */}
      <div className={`flex items-center gap-3 h-20 border-b border-white/10 ${collapsed ? "justify-center px-0" : "px-6"}`}>
        <img src="/Logos1.png" alt="Logo" className="w-9 h-9 object-contain rounded-lg shrink-0" />
        {!collapsed && (
          <div className="overflow-hidden min-w-0">
            <h1 className="font-bold text-[13px] leading-tight truncate">Itahari Namuna</h1>
            <p className="text-[10px] text-white/50 truncate">Management Panel</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 custom-scrollbar">
        {visibleGroups.map((group, gi) => (
          <div key={group.label} className={gi > 0 ? "mt-6" : ""}>
            {!collapsed && (
              <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-2">{group.label}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.url);
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={onMobileClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors relative group
                      ${collapsed ? "justify-center" : ""}
                      ${active ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"}
                    `}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4/5 rounded-r-full bg-primary-gold" />
                    )}
                    <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? "text-primary-gold" : ""}`} strokeWidth={2} />
                    {!collapsed && <span className="truncate">{item.title}</span>}

                    {collapsed && (
                      <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-foreground text-white text-[11px] font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-[60] shadow-xl whitespace-nowrap">
                        {item.title}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Account */}
      <div className="p-3 border-t border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-1 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
              {admin?.avatar ? (
                <img src={getImageUrl(admin.avatar)} alt={admin.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] font-bold text-primary-gold">
                  {admin?.name ? admin.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??'}
                </span>
              )}
            </div>
            <div className="overflow-hidden min-w-0 flex-1">
              <h4 className="text-[12px] font-semibold text-white leading-tight truncate">{admin?.name || 'Super Admin'}</h4>
              <p className="text-[10px] text-white/40 truncate capitalize">{admin?.role?.replace('_', ' ') || 'Online'}</p>
            </div>
            <button
              onClick={onToggle}
              className="w-6 h-6 rounded-md flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {collapsed && (
          <button
            onClick={onToggle}
            className="w-full h-8 mb-1 rounded-md flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            title="Expand sidebar"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </button>
        )}

        <button
          onClick={handleLogout}
          className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-white/60 hover:text-white hover:bg-error-red/80 transition-colors ${collapsed ? "justify-center" : ""}`}
          title="Logout"
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-shrink-0 h-screen sticky top-0 z-50">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="relative z-10 h-full shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      type="button"
      className="lg:hidden h-11 w-11 rounded-xl bg-white border border-neutral-border/50 text-foreground shadow-md hover:shadow-lg transition-all active:scale-95"
    >
      <Menu className="w-5 h-5" strokeWidth={2.5} />
    </Button>
  );
}
