import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Sparkles,
  Command
} from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title = 'Dashboard' }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const notifications = [
    { id: 1, text: 'New booking — Mr. Rahul Tharu, Deluxe 204', time: '2 min ago', type: 'booking' as const },
    { id: 2, text: 'Check-in completed — Room 301',              time: '15 min ago', type: 'checkin' as const },
    { id: 3, text: 'Payment received — NPR 45,000',              time: '1 hr ago', type: 'payment' as const },
  ];

  const dotColor = { booking: 'bg-[#1F7A3A]', checkin: 'bg-[#F59E0B]', payment: 'bg-[#F97316]' };

  return (
    <header className="h-[76px] bg-white border-b border-gray-100 sticky top-0 z-30 shrink-0">
      <div className="h-full px-5 sm:px-6 lg:px-8 flex items-center gap-5">
        
        {/* Mobile Hamburger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          <Menu size={22} />
        </button>

        {/* Page Title (breadcrumb style) */}
        <div className="mr-auto hidden sm:block">
          <h1 className="text-lg font-bold text-[#111827] leading-tight flex items-center gap-2.5">
            {title}
            {title === 'Dashboard' && <Sparkles size={16} className="text-[#F59E0B]" />}
          </h1>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-400 mt-1">
            <span>Front Office</span>
            <span className="text-gray-300">/</span>
            <span className="text-[#1F7A3A]">{title}</span>
          </div>
        </div>

        {/* Global Search */}
        <div className="hidden md:flex flex-1 max-w-[360px] items-center relative group">
          <Search size={16} className="absolute left-3.5 text-gray-400 group-focus-within:text-[#1F7A3A] transition-colors" />
          <input
            type="text"
            placeholder="Search bookings, guests, rooms..."
            className="w-full h-10 pl-10 pr-12 text-[13px] font-medium bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-[#1F7A3A]/30 focus:ring-4 focus:ring-[#1F7A3A]/5 transition-all"
          />
          <div className="absolute right-3 flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-white border border-gray-100 px-1.5 py-0.5 rounded-md shadow-sm">
            <Command size={10} /> K
          </div>
        </div>

        {/* Actions Context */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto sm:ml-0 border-l border-gray-100 pl-4 sm:pl-6">
          
          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-[#1F7A3A] hover:bg-[#1F7A3A]/5 transition-all border border-transparent hover:border-[#1F7A3A]/10"
            >
              <Bell size={18} strokeWidth={2.5} />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#F59E0B] rounded-full border-2 border-white" />
            </button>

            {/* Notification Dropdown */}
            <div className={`absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50 transition-all origin-top-right ${showNotifications ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <span className="text-[13px] font-bold text-[#111827]">Notifications</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-white bg-[#1F7A3A] px-2 py-1 rounded-md shadow-sm shadow-green-900/10">
                  {notifications.length} New
                </span>
              </div>
              <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-50">
                {notifications.map((n) => (
                  <button key={n.id} className="w-full px-5 py-3.5 text-left hover:bg-gray-50/80 transition-colors flex gap-3.5 group">
                    <div className="mt-1 flex items-center justify-center relative">
                       <span className={`absolute w-3 h-3 rounded-full opacity-20 group-hover:animate-ping ${dotColor[n.type]}`} />
                       <span className={`w-2 h-2 rounded-full relative z-10 ${dotColor[n.type]}`} />
                    </div>
                    <div>
                      <p className="text-[13px] text-gray-700 font-medium leading-relaxed group-hover:text-[#111827]">{n.text}</p>
                      <span className="text-[10px] font-bold text-gray-400 mt-1 block uppercase tracking-widest">{n.time}</span>
                    </div>
                  </button>
                ))}
              </div>
              <button className="w-full px-5 py-3 text-[11px] font-bold text-[#1F7A3A] bg-gray-50/50 hover:bg-gray-100 transition-colors border-t border-gray-50 uppercase tracking-widest text-center">
                View All Activity
              </button>
            </div>
          </div>

          {/* User Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className="flex items-center gap-3 p-1 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
            >
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#1F7A3A] to-[#14532D] flex items-center justify-center shadow-inner shadow-white/20">
                <span className="text-xs font-black text-white uppercase">AD</span>
              </div>
              <div className="hidden lg:block text-left mr-1">
                <p className="text-[13px] font-bold text-[#111827] leading-none mb-1">Admin</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">Receptionist</p>
              </div>
              <ChevronDown
                size={14}
                className={`hidden lg:block text-gray-400 transition-transform duration-300 ${showProfile ? 'rotate-180' : ''}`}
                strokeWidth={3}
              />
            </button>

            {/* Profile Dropdown */}
            <div className={`absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50 p-2 transition-all origin-top-right ${showProfile ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              <div className="px-3 py-3 mb-1 border-b border-gray-50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1F7A3A] to-[#14532D] flex items-center justify-center text-white font-black">AD</div>
                <div className="flex-1 min-w-0">
                   <p className="text-[13px] font-bold text-[#111827] truncate">Admin User</p>
                   <p className="text-[11px] font-medium text-gray-400 truncate">admin@hotel.com</p>
                </div>
              </div>
              
              <div className="space-y-0.5">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold text-gray-600 hover:text-[#111827] hover:bg-gray-50 rounded-xl transition-colors">
                  <User size={16} className="text-gray-400" /> My Profile
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold text-gray-600 hover:text-[#111827] hover:bg-gray-50 rounded-xl transition-colors">
                  <Settings size={16} className="text-gray-400" /> Account Settings
                </button>
              </div>

              <div className="border-t border-gray-50 my-1 font-bold" />
              
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                <LogOut size={16} className="text-red-500" /> Sign Out
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </header>
  );
};

export default Header;
