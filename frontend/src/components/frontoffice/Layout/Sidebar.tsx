import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { getImageUrl } from "../../../services/api";
import {
  LayoutDashboard,
  CalendarCheck,
  LogIn,
  Users,
  BedDouble,
  CreditCard,
  BarChart3,
  ChevronLeft,
  Menu,
  LogOut
} from "lucide-react";
import { Button } from "../../ui/Button";

const menuItems = [
  { title: "Dashboard", url: "/frontoffice", icon: LayoutDashboard },
  { title: "Bookings", url: "/frontoffice/bookings", icon: CalendarCheck },
  { title: "Check-in / Out", url: "/frontoffice/checkin", icon: LogIn },
  { title: "Guests", url: "/frontoffice/guests", icon: Users },
  { title: "Rooms Availability", url: "/frontoffice/rooms", icon: BedDouble },
  { title: "Payments", url: "/frontoffice/payments", icon: CreditCard },
  { title: "Reports", url: "/frontoffice/reports", icon: BarChart3 },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, adminLogout } = useAdminAuth();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  const sidebarContent = (
    <div className={`flex flex-col h-full bg-[#14532D] text-white transition-all duration-300 ${collapsed ? "w-[80px]" : "w-[280px]"}`}>
      {/* Brand Section */}
      <div className="flex items-center gap-4 px-8 py-10 border-b border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#F59E0B]/10 rounded-full blur-[40px] -mr-12 -mt-12 transition-all duration-500 group-hover:scale-150 group-hover:bg-[#F59E0B]/20" />
        
        <img 
          src="/LOGOS.png" 
          alt="Logo" 
          className="w-12 h-12 object-contain rounded-xl relative z-10 brightness-0 invert" 
        />
        
        {!collapsed && (
          <div className="overflow-hidden relative z-10 transition-all duration-500 delay-100">
            <h1 className="font-black text-[13px] leading-none tracking-tight uppercase">Antigravity</h1>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#F59E0B] mt-1.5 opacity-90">College PMS</p>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-6 py-10 space-y-2 custom-scrollbar">
        {!collapsed && (
          <p className="px-4 text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-8">Main Management</p>
        )}
        
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const active = location.pathname === item.url || (item.url === "/frontoffice" && location.pathname === "/frontoffice/dashboard");
            return (
              <Link
                key={item.title}
                to={item.url}
                onClick={onMobileClose}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 relative group
                  ${active
                    ? "bg-[#1F7A3A] text-white shadow-xl shadow-black/10 translate-x-1"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
              >
                {/* Active Indicator Bar */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#F59E0B] rounded-full shadow-[0_0_12px_#F59E0B]" />
                )}

                <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${active ? "text-[#F59E0B]" : ""}`} strokeWidth={2.2} />
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
      <div className="p-6 border-t border-white/5 bg-[#111827]/20">
        {!collapsed && (
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-[10px] font-black text-[#F59E0B] overflow-hidden">
                {admin?.avatar ? (
                  <img src={getImageUrl(admin.avatar)} alt={admin.name} className="w-full h-full object-cover" />
                ) : (
                  admin ? getInitials(admin.name) : '??'
                )}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-[12px] font-bold text-white leading-none truncate w-[120px]">{admin?.name || 'Guest Admin'}</h4>
                <p className="text-[10px] font-bold text-[#F59E0B]/80 uppercase mt-1 tracking-wider opacity-80">{admin?.role.replace('_', ' ')}</p>
              </div>
            </div>
            <button 
              onClick={onToggle}
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-[#F59E0B] hover:bg-white/10 transition-all"
              title="Collapse sidebar"
            >
              <ChevronLeft className={`w-4 h-4 transition-transform duration-500 ${collapsed ? "rotate-180" : ""}`} />
            </button>
          </div>
        )}
        
        {collapsed && (
          <button 
            onClick={onToggle}
            className="w-full h-10 mb-4 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-[#F59E0B] hover:bg-white/10 transition-all"
            title="Expand sidebar"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform duration-500 rotate-180`} />
          </button>
        )}
        
        <button 
          onClick={handleLogout}
          className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl bg-[#DC2626]/10 text-red-400 hover:bg-[#DC2626] hover:text-white transition-all duration-300 group ${collapsed ? "justify-center" : ""}`}
          title="Logout session"
        >
          <LogOut size={20} className="shrink-0 transition-transform group-hover:-translate-x-1" />
          {!collapsed && <span className="text-[11px] font-black uppercase tracking-[0.2em]">Logout</span>}
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
          <div className="absolute inset-0 bg-[#0C2012]/80 backdrop-blur-sm transition-all duration-500" onClick={onMobileClose} />
          <aside className="relative z-10 h-full animate-slide-in-left shadow-2xl">
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
