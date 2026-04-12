import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  DoorOpen,
  Sparkles,
  UserSquare2,
  ChevronLeft,
  Menu,
  Building2,
  LogOut,
  Plus,
} from "lucide-react";
import { Button } from "../../ui/Button";

const menuItems = [
  { title: "Dashboard", url: "/housekeeping", icon: LayoutDashboard },
  { title: "Room Status", url: "/housekeeping/room-status", icon: DoorOpen },
  { title: "Cleaning Tasks", url: "/housekeeping/cleaning-tasks", icon: Sparkles },
  { title: "Staff Assignment", url: "/housekeeping/staff-assignment", icon: UserSquare2 },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: AppSidebarProps) {
  const location = useLocation();

  const sidebarContent = (
    <div className={`flex flex-col h-full bg-[#14532D] text-white transition-all duration-300 ${collapsed ? "w-[80px]" : "w-[280px]"}`}>
      {/* Brand Section */}
      <div className="flex items-center gap-4 px-8 py-10 border-b border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#F59E0B]/10 rounded-full blur-[40px] -mr-12 -mt-12 transition-all duration-500 group-hover:scale-150 group-hover:bg-[#F59E0B]/20" />
        
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1F7A3A] via-[#14532D] to-[#1F7A3A] flex items-center justify-center shadow-lg flex-shrink-0 relative z-10 border border-white/10">
          <Building2 size={24} className="text-white" strokeWidth={3} />
        </div>
        
        {!collapsed && (
          <div className="overflow-hidden relative z-10 transition-all duration-500 delay-100">
            <h1 className="font-black text-[13px] leading-none tracking-tight uppercase">Itahari Namuna</h1>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#F59E0B] mt-1.5 opacity-90">College PMS</p>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-6 py-10 space-y-2 custom-scrollbar">
        {!collapsed && (
          <p className="px-4 text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-8">Operations Unit</p>
        )}
        
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const active = location.pathname === item.url || (item.url === "/housekeeping" && location.pathname === "/housekeeping/dashboard");
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

        {/* Quick Action in Sidebar */}
        {!collapsed && (
          <div className="mt-10 px-4">
            <button className="w-full flex items-center gap-3 p-4 bg-[#F59E0B] text-[#14532D] rounded-2xl hover:bg-white transition-all group shadow-xl shadow-black/10">
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Assign Task</span>
            </button>
          </div>
        )}
      </div>

      {/* Logout / Bottom Action */}
      <div className="p-6 border-t border-white/5 bg-[#111827]/20">
        {!collapsed && (
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 p-1 flex items-center justify-center border border-white/10 transition-all overflow-hidden relative">
                <img src="/avatar-placeholder.png" alt="Supervisor" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-[12px] font-bold text-white leading-none">Supervisor</h4>
                <p className="text-[10px] font-bold text-[#F59E0B]/80 uppercase mt-1 tracking-wider opacity-80">Housekeeping</p>
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
        
        <Link 
          to="/logout"
          className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl bg-[#DC2626]/10 text-red-400 hover:bg-[#DC2626] hover:text-white transition-all duration-300 group ${collapsed ? "justify-center" : ""}`}
          title="Logout session"
        >
          <LogOut size={20} className="shrink-0 transition-transform group-hover:-translate-x-1" />
          {!collapsed && <span className="text-[11px] font-black uppercase tracking-[0.2em]">Logout</span>}
        </Link>
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
