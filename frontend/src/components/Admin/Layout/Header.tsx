import { useState } from "react";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { getImageUrl } from "../../../services/api";
import {
  Search,
  Bell,
  User,
  ChevronDown,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";

interface HeaderProps {
  onMobileMenuClick: () => void;
}

export function Header({ onMobileMenuClick }: HeaderProps) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { admin, adminLogout } = useAdminAuth();

  const handleLogout = () => {
    adminLogout();
    window.location.href = '/admin/login';
  };

  return (
    <header className="h-20 bg-white border-b border-neutral-border/30 sticky top-0 z-40 flex items-center justify-between px-8 lg:px-12">
      {/* Left Section - Search & Breadcrumb */}
      <div className="flex items-center gap-6 flex-1">
        {/* Mobile Menu Button */}
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden w-10 h-10 rounded-xl bg-neutral-light flex items-center justify-center text-primary-dark hover:bg-primary-green hover:text-white transition-all"
        >
          <Menu size={20} strokeWidth={2.5} />
        </button>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-text-secondary" strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Search guests, rooms, bookings..."
              className="w-full pl-12 pr-4 py-3 bg-neutral-light/50 border border-neutral-border/30 rounded-xl text-sm font-medium text-primary-dark placeholder:text-neutral-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all"
            />
          </div>
        </div>
      </div>

      {/* Right Section - Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative w-10 h-10 rounded-xl bg-neutral-light/50 border border-neutral-border/30 flex items-center justify-center text-primary-dark hover:bg-primary-green/10 hover:border-primary-green/30 transition-all group"
          >
            <Bell size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Notification Dropdown */}
          {notificationOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-neutral-border/30 overflow-hidden animate-fadeIn z-50">
              <div className="p-4 border-b border-neutral-border/30">
                <h3 className="text-sm font-bold text-primary-dark">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="p-4 border-b border-neutral-border/20 hover:bg-neutral-light/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-primary-green flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-primary-dark">New booking received</p>
                        <p className="text-[10px] text-neutral-text-secondary mt-1">Guest John Doe booked Room 101</p>
                        <p className="text-[9px] text-neutral-text-secondary mt-2">2 minutes ago</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-neutral-border/30">
                <button className="w-full py-2 text-[10px] font-bold text-primary-green hover:text-primary-dark transition-all">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-neutral-light/50 border border-neutral-border/30 hover:bg-primary-green/10 hover:border-primary-green/30 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-primary-green/10 flex items-center justify-center overflow-hidden border border-primary-green/20">
              {admin?.avatar ? (
                <img src={getImageUrl(admin.avatar)} alt={admin.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-[10px] font-black text-primary-green">
                  {admin?.name ? admin.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'SA'}
                </div>
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-primary-dark">{admin?.name || 'Super Admin'}</p>
              <p className="text-[9px] font-bold text-primary-green uppercase tracking-wider">{admin?.role?.replace('_', ' ') || 'Administrator'}</p>
            </div>
            <ChevronDown size={14} strokeWidth={2.5} className="text-neutral-text-secondary group-hover:text-primary-green transition-colors" />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-neutral-border/30 overflow-hidden animate-fadeIn z-50">
              <div className="p-4 border-b border-neutral-border/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-green/10 flex items-center justify-center overflow-hidden border border-primary-green/20">
                    {admin?.avatar ? (
                      <img src={getImageUrl(admin.avatar)} alt={admin.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-[11px] font-black text-primary-green">
                        {admin?.name ? admin.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'SA'}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary-dark">{admin?.name || 'Super Admin'}</p>
                    <p className="text-[9px] font-bold text-primary-green uppercase tracking-wider">{admin?.role?.replace('_', ' ') || 'Administrator'}</p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-bold text-primary-dark hover:bg-neutral-light/50 transition-all">
                  <User size={14} strokeWidth={2.5} />
                  <span>My Profile</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-bold text-primary-dark hover:bg-neutral-light/50 transition-all">
                  <Settings size={14} strokeWidth={2.5} />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-bold text-red-600 hover:bg-red-50 transition-all mt-1"
                >
                  <LogOut size={14} strokeWidth={2.5} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
