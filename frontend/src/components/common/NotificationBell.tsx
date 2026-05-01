import React, { useState, useRef, useEffect } from 'react';
import { Bell, ShieldCheck, Zap, Info } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'security': return <ShieldCheck size={16} />;
      case 'system': return <Zap size={16} />;
      default: return <Info size={16} />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setNotifOpen(!notifOpen)}
        aria-label="Toggle notifications"
        title="Toggle notifications"
        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all relative group ${notifOpen ? "bg-[#1F7A3A] text-white shadow-xl shadow-[#1F7A3A]/20" : "text-gray-400 hover:text-[#1F7A3A] hover:bg-[#1F7A3A]/5"}`}
      >
        <Bell size={18} strokeWidth={2.5} className={notifOpen ? "animate-none" : "group-hover:rotate-12 transition-transform"} />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm" />
        )}
      </button>

      <AnimatePresence>
        {notifOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-4 w-[380px] bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden z-[60]"
          >
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#111827]">Live Updates</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{unreadCount} New Alerts</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] font-black uppercase tracking-widest text-[#1F7A3A] hover:text-[#14532D] mr-2"
                  title="Mark all as read"
                >
                  Mark Read
                </button>
                <button
                  onClick={clearNotifications}
                  className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700"
                  title="Clear all"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto px-2 py-4 space-y-2 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm font-medium">No new notifications</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => !n.read && markAsRead(n.id)}
                    className={`p-4 rounded-2xl transition-all flex gap-4 group cursor-pointer ${!n.read ? "bg-[#1F7A3A]/5 border border-[#1F7A3A]/10" : "hover:bg-gray-50 border border-transparent"}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!n.read ? "bg-[#F59E0B]/20 text-[#F59E0B]" : "bg-gray-100 text-gray-400"}`}>
                      {getIcon(n.type)}
                    </div>
                    <div>
                      <h4 className={`text-[13px] leading-relaxed ${!n.read ? "text-[#111827] font-bold" : "text-gray-500 font-medium"}`}>
                        {n.title}
                      </h4>
                      <p className="text-[12px] text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-gray-50 bg-gray-50/50">
              <button
                className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#111827] transition-colors"
                title="View all notifications"
              >
                Global Audit Log
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
