import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  UserCheck,
  Users,
  BedDouble,
  CreditCard,
  BarChart3,
  LogOut,
  X,
  Building2,
  ChevronRight,
  HelpCircle,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

const mainMenu = [
  { name: 'Dashboard',          icon: LayoutDashboard, path: '/frontoffice' },
  { name: 'Bookings',           icon: CalendarDays,    path: '/frontoffice/bookings' },
  { name: 'Check-in / Out',     icon: UserCheck,       path: '/frontoffice/check-in-out' },
  { name: 'Guests',             icon: Users,           path: '/frontoffice/guests' },
  { name: 'Rooms',              icon: BedDouble,       path: '/frontoffice/availability' },
  { name: 'Payments',           icon: CreditCard,      path: '/frontoffice/payments' },
  { name: 'Reports',            icon: BarChart3,       path: '/frontoffice/reports' },
];

const bottomMenu = [
  { name: 'Settings', icon: Settings, path: '/frontoffice/settings' },
  { name: 'Help',     icon: HelpCircle, path: '/frontoffice/help' },
];

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  return (
    <aside className="h-full w-[272px] bg-[#0C1F15] text-white flex flex-col overflow-hidden">
      {/* ── Logo Area ── */}
      <div className="h-[72px] flex items-center justify-between px-6 shrink-0">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#F97316] flex items-center justify-center shadow-lg shadow-orange-900/30 group-hover:scale-105 transition-transform">
            <Building2 size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-bold text-white tracking-tight">Itahari Namuna</p>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#F59E0B]/80">College PMS</p>
          </div>
        </Link>
        <button
          onClick={onClose}
          title="Close sidebar"
          className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Divider ── */}
      <div className="mx-5 border-t border-white/[0.06]" />

      {/* ── Section Label ── */}
      <div className="px-6 pt-6 pb-2">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25">Main Menu</p>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-1 pb-4">
        {mainMenu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/frontoffice'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#1F7A3A] text-white shadow-lg shadow-green-900/30 font-semibold'
                    : 'text-white/50 hover:bg-white/[0.06] hover:text-white/80'
                }`
              }
              onClick={onClose}
            >
              <Icon size={18} strokeWidth={1.8} className="shrink-0" />
              <span className="flex-1">{item.name}</span>
              <ChevronRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-40 group-hover:translate-x-0 transition-all" />
            </NavLink>
          );
        })}
      </nav>

      {/* ── Bottom Section ── */}
      <div className="shrink-0 border-t border-white/[0.06]">
        {/* Bottom links */}
        <div className="px-4 py-3 space-y-0.5">
          <p className="px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/25">Support</p>
          {bottomMenu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/[0.08] text-white/90'
                      : 'text-white/40 hover:bg-white/[0.04] hover:text-white/60'
                  }`
                }
                onClick={onClose}
              >
                <Icon size={16} strokeWidth={1.8} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* User Card */}
        <div className="px-4 pb-5 pt-2">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1F7A3A] to-[#14532D] flex items-center justify-center text-white text-xs font-bold shadow-md shrink-0">
              AD
            </div>
            <div className="flex-1 min-w-0 leading-tight">
              <p className="text-[12px] font-semibold text-white/90 truncate">Admin User</p>
              <p className="text-[10px] text-white/30 font-medium">Receptionist</p>
            </div>
            <button title="Sign out" className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-white/[0.06] transition-colors cursor-pointer">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
