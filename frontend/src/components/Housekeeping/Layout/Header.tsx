import { useState } from "react";
import { Bell, Search, ChevronDown, Settings, LogOut, User, MessageSquare, Zap } from "lucide-react";
import { MobileMenuButton } from "./Sidebar";

const notifications = [
  { id: 1, text: "Room 102 marked as Dirty", time: "2 min ago", type: "dirty", unread: true },
  { id: 2, text: "Cleaning Task Completed: Room 305", time: "15 min ago", type: "completed", unread: true },
  { id: 3, text: "Staff Assigned: Ram Thapa to Floor 2", time: "1 hr ago", type: "assignment", unread: false },
  { id: 4, text: "Maintenance Alert: Room 401 Water Leak", time: "2 hrs ago", type: "alert", unread: false },
];

interface HeaderProps {
  title: string;
  onMobileMenuClick: () => void;
}

export function Header({ title, onMobileMenuClick }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[40] transition-all duration-300 px-10 h-24 flex items-center gap-10 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <MobileMenuButton onClick={onMobileMenuClick} />

      {/* Title & Page Status */}
      <div className="flex flex-col h-full justify-center">
        <div className="flex items-center gap-2">
          <h2 className="font-black text-xl text-[#111827] tracking-tight">{title}</h2>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1F7A3A]/5 text-[#1F7A3A] text-[10px] font-black uppercase tracking-widest border border-[#1F7A3A]/10">
            <div className="w-1 h-1 rounded-full bg-[#1F7A3A] animate-pulse" />
            Operations Active
          </div>
        </div>
        <p className="hidden md:block text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Housekeeping Workspace</p>
      </div>

      {/* Central Search with premium field */}
      <div className="flex-1 max-w-xl hidden lg:block">
        <div className="group relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#1F7A3A]" strokeWidth={2.5} />
          </div>
          <input
            type="text"
            placeholder="Search rooms, staff, tasks..."
            className="block w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#1F7A3A]/5 focus:border-[#1F7A3A]/20 focus:bg-white transition-all duration-300"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-lg border border-gray-200 bg-white text-[10px] font-black tracking-widest text-gray-400 uppercase">
              ⌘ K
            </kbd>
          </div>
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Quick Help / AI Suggestion (Premium Touch) */}
        <button
          className="hidden sm:flex w-10 h-10 items-center justify-center rounded-xl text-gray-400 hover:text-[#1F7A3A] hover:bg-[#1F7A3A]/5 transition-all relative group"
          aria-label="Quick Insights"
          title="View quick insights"
        >
          <Zap size={18} strokeWidth={2.5} />
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-2xl">
            Quick Insights
          </div>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            aria-label="Toggle notifications"
            title="Toggle notifications"
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all relative group ${notifOpen ? "bg-[#1F7A3A] text-white shadow-xl shadow-[#1F7A3A]/20" : "text-gray-400 hover:text-[#1F7A3A] hover:bg-[#1F7A3A]/5"
              }`}
          >
            <Bell size={18} strokeWidth={2.5} className={notifOpen ? "animate-none" : "group-hover:rotate-12 transition-transform"} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-4 w-[380px] bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden animate-fade-down z-[60]">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#111827]">Notifications</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">2 New Updates</p>
                </div>
                <button
                  className="text-[10px] font-black uppercase tracking-widest text-[#1F7A3A] hover:text-[#14532D]"
                  title="Mark all notifications as read"
                >
                  Mark all as read
                </button>
              </div>
              <div className="max-h-[400px] overflow-y-auto px-2 py-4 space-y-2 custom-scrollbar">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 rounded-2xl transition-all flex gap-4 group cursor-pointer ${n.unread ? "bg-[#1F7A3A]/5 border border-[#1F7A3A]/10" : "hover:bg-gray-50 border border-transparent"}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.unread ? "bg-[#F59E0B]/20 text-[#D97706]" : "bg-gray-100 text-gray-400"
                      }`}>
                      {n.type === 'dirty' ? <Zap size={16} /> : <MessageSquare size={16} />}
                    </div>
                    <div>
                      <p className={`text-[13px] leading-relaxed ${n.unread ? "text-[#111827] font-bold" : "text-gray-500 font-medium"}`}>
                        {n.text}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-50 bg-gray-50/50">
                <button
                  className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#111827] transition-colors"
                  title="Show all notifications in a separate page"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative ml-2">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            aria-label="Toggle user menu"
            title="Toggle user menu"
            className={`flex items-center gap-3 p-1 rounded-2xl transition-all ${profileOpen ? "bg-gray-100 shadow-inner" : "hover:bg-gray-50"
              }`}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1F7A3A] to-[#14532D] p-0.5 shadow-lg group-hover:scale-105 transition-all">
              <div className="w-full h-full rounded-[10px] overflow-hidden border-2 border-white/20">
                <img src="/avatar-placeholder.png" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="text-left hidden sm:block pr-2">
              <p className="text-[12px] font-black text-[#111827] leading-none">Supervisor</p>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#F59E0B] mt-1 opacity-80">Full Access</p>
            </div>
            <ChevronDown size={14} className={`text-gray-400 transition-transform hidden sm:block duration-500 ${profileOpen ? "rotate-180" : ""}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-4 w-64 bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden animate-fade-down z-[60]">
              <div className="p-6 border-b border-gray-50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
                  <User size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#111827]">Supervisor Settings</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Personalize profile</p>
                </div>
              </div>
              <div className="p-2">
                {[
                  { label: "My Profile", icon: User },
                  { label: "Settings", icon: Settings },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[12px] font-bold text-gray-500 hover:text-[#111827] hover:bg-gray-50 rounded-2xl transition-all"
                    title={`Go to ${item.label}`}
                  >
                    <item.icon size={16} strokeWidth={2.5} />
                    {item.label}
                  </button>
                ))}
                <div className="h-px bg-gray-50 my-2 mx-4" />
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-[12px] font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                  title="Sign out of the system"
                >
                  <LogOut size={16} strokeWidth={2.5} />
                  Logout Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
