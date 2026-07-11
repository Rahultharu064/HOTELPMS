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
} from "lucide-react";
import { Button } from "../../ui/Button";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Guests", url: "/admin/guests", icon: Users },
  { title: "Staff Management", url: "/admin/users", icon: ShieldCheck },
  { title: "Room Types", url: "/admin/room-types", icon: Building2 },
  { title: "Room Inventory", url: "/admin/rooms", icon: Warehouse },
  { title: "Financials", url: "/admin/financials", icon: CreditCard },
  { title: "System Analytics", url: "/admin/reports", icon: BarChart3 },
  { title: "Settings", url: "/admin/settings", icon: Settings },
  { title: "Extra Services", url: "/admin/extra-services", icon: Zap },
  { title: "Gallery & Venues", url: "/admin/gallery", icon: Images },
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

  const sidebarContent = (
    <div className={`flex flex-col h-full bg-[#14532D] text-white transition-all duration-300 ${collapsed ? "w-[70px]" : "w-[260px]"}`}>
      {/* Brand Section */}
      <div className="flex items-center gap-3 px-6 py-8 border-b border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-[#F59E0B]/10 rounded-full blur-[30px] -mr-10 -mt-10 transition-all duration-500 group-hover:scale-150 group-hover:bg-[#F59E0B]/20" />
        
        <img 
          src="/Logos1.png" 
          alt="Logo" 
          className="w-10 h-10 object-contain rounded-xl relative z-10" 
        />
        
        {!collapsed && (
          <div className="overflow-hidden relative z-10 transition-all duration-500 delay-100">
            <h1 className="font-black text-[12px] leading-none tracking-tight uppercase">Itahari Namuna</h1>
            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#F59E0B] mt-1 opacity-90">Management Panel</p>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1 custom-scrollbar">
        {!collapsed && (
          <p className="px-3 text-[8px] font-black uppercase tracking-[0.4em] text-white/20 mb-6">Navigation Menu</p>
        )}
        
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const active = location.pathname === item.url || (item.url === "/admin" && location.pathname === "/admin/dashboard");
            return (
              <Link
                key={item.title}
                to={item.url}
                onClick={onMobileClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-bold transition-all duration-300 relative group
                  ${active
                    ? "bg-[#1F7A3A] text-white shadow-lg shadow-black/10"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
              >
                {/* Active Indicator Bar */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#F59E0B] rounded-full shadow-[0_0_8px_#F59E0B]" />
                )}

                <item.icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${active ? "text-[#F59E0B]" : ""}`} strokeWidth={2} />
                {!collapsed && (
                  <span className="truncate">{item.title}</span>
                )}
                
                {/* Tooltip for collapsed mode */}
                {collapsed && (
                  <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-3 py-2 bg-[#111827] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60] shadow-2xl whitespace-nowrap">
                    {item.title}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout / Bottom Action */}
      <div className="p-4 border-t border-white/5 bg-black/20">
        {!collapsed && (
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 transition-all overflow-hidden relative">
                {admin?.avatar ? (
                  <img src={getImageUrl(admin.avatar)} alt={admin.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-[9px] font-black text-[#F59E0B]">
                    {admin?.name ? admin.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??'}
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-[11px] font-bold text-white leading-none truncate w-[100px]">{admin?.name || 'Super Admin'}</h4>
                <p className="text-[9px] font-bold text-[#F59E0B]/80 uppercase mt-0.5 tracking-wider opacity-80">{admin?.role.replace('_', ' ') || 'Online'}</p>
              </div>
            </div>
            <button 
              onClick={onToggle}
              className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-[#F59E0B] hover:bg-white/10 transition-all"
              title="Collapse sidebar"
            >
              <ChevronLeft className={`w-3.5 h-3.5 transition-transform duration-500 ${collapsed ? "rotate-180" : ""}`} />
            </button>
          </div>
        )}
        
        {collapsed && (
          <button 
            onClick={onToggle}
            className="w-full h-9 mb-3 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-[#F59E0B] hover:bg-white/10 transition-all"
            title="Expand sidebar"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-500 rotate-180`} />
          </button>
        )}
        
        <button 
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-xl bg-[#DC2626]/10 text-red-400 hover:bg-[#DC2626] hover:text-white transition-all duration-300 group ${collapsed ? "justify-center" : ""}`}
          title="Logout"
        >
          <LogOut size={18} className="shrink-0 transition-transform group-hover:-translate-x-1" />
          {!collapsed && <span className="text-[10px] font-black uppercase tracking-[0.2em]">Logout</span>}
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
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-all duration-500" onClick={onMobileClose} />
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
      className="lg:hidden h-12 w-12 rounded-2xl bg-white border border-gray-100 text-[#111827] shadow-xl hover:shadow-2xl transition-all active:scale-95"
    >
      <Menu className="w-6 h-6" strokeWidth={2.5} />
    </Button>
  );
}
