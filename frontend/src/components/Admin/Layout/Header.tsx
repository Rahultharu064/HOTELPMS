import { useState, useEffect, useRef } from "react";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { getImageUrl } from "../../../services/api";
import { bookingService } from "../../../services/bookingService";
import type { Booking } from "../../../services/bookingService";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  User,
  ChevronDown,
  Settings,
  LogOut,
  Menu,
  Clock,
} from "lucide-react";

interface HeaderProps {
  onMobileMenuClick: () => void;
}

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function Header({ onMobileMenuClick }: HeaderProps) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const { admin, adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    adminLogout();
    window.location.href = '/admin/login';
  };

  useEffect(() => {
    let cancelled = false;
    const fetchPending = async () => {
      try {
        setNotifLoading(true);
        const res = await bookingService.getAllBookings({ status: "pending", limit: 5 });
        if (!cancelled && res.success) setPendingBookings(res.data.bookings);
      } catch {
        // Silent — notifications are a convenience, not critical path
      } finally {
        if (!cancelled) setNotifLoading(false);
      }
    };
    fetchPending();
    const interval = setInterval(fetchPending, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/admin/bookings`);
  };

  return (
    <header className="h-16 bg-white border-b border-neutral-border/60 sticky top-0 z-40 flex items-center justify-between px-6 lg:px-8 gap-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden w-9 h-9 rounded-lg bg-neutral-light flex items-center justify-center text-primary-dark hover:bg-primary-green hover:text-white transition-colors shrink-0"
        >
          <Menu size={18} strokeWidth={2.5} />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-text-secondary" strokeWidth={2} />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guests, rooms, bookings..."
            className="w-full pl-9 pr-3 h-9 bg-neutral-light border border-transparent rounded-lg text-[13px] font-medium text-primary-dark placeholder:text-neutral-text-secondary/70 focus:outline-none focus:bg-white focus:border-primary-green/40 transition-colors"
          />
        </form>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen((v) => !v)}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-neutral-text-secondary hover:bg-neutral-light hover:text-primary-dark transition-colors"
          >
            <Bell size={17} strokeWidth={2} />
            {pendingBookings.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary-gold rounded-full ring-2 ring-white" />
            )}
          </button>

          {notificationOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotificationOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-neutral-border/60 overflow-hidden animate-fadeIn z-50">
                <div className="px-4 py-3 border-b border-neutral-border/50 flex items-center justify-between">
                  <h3 className="text-[13px] font-semibold text-primary-dark">Pending bookings</h3>
                  {pendingBookings.length > 0 && (
                    <span className="text-[10px] font-semibold text-primary-gold bg-primary-gold/10 px-2 py-0.5 rounded-full">{pendingBookings.length}</span>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifLoading ? (
                    <div className="p-6 text-center text-[12px] text-neutral-text-secondary">Loading…</div>
                  ) : pendingBookings.length > 0 ? (
                    pendingBookings.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => { setNotificationOpen(false); navigate('/admin/bookings'); }}
                        className="w-full text-left p-4 border-b border-neutral-border/30 hover:bg-neutral-light/50 transition-colors last:border-0"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 mt-1.5 rounded-full bg-primary-gold flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-primary-dark truncate">
                              {b.guest ? `${b.guest.firstName} ${b.guest.lastName}` : b.bookingNumber} — awaiting confirmation
                            </p>
                            <p className="text-[11px] text-neutral-text-secondary mt-0.5 truncate">
                              {b.room?.name ? `${b.room.name} · ` : ''}Rs. {Number(b.totalAmount).toLocaleString()}
                            </p>
                            <p className="text-[10px] text-neutral-text-secondary/70 mt-1 flex items-center gap-1">
                              <Clock size={10} /> {timeAgo(b.createdAt)}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-6 text-center text-[12px] text-neutral-text-secondary">Nothing needs your attention</div>
                  )}
                </div>
                <div className="p-2 border-t border-neutral-border/50">
                  <button
                    onClick={() => { setNotificationOpen(false); navigate('/admin/bookings'); }}
                    className="w-full py-1.5 text-[11px] font-semibold text-primary-green hover:text-primary-dark transition-colors"
                  >
                    View all bookings
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 pl-1.5 pr-2.5 h-9 rounded-lg hover:bg-neutral-light transition-colors group"
          >
            <div className="w-7 h-7 rounded-full bg-primary-green/10 flex items-center justify-center overflow-hidden border border-primary-green/20 shrink-0">
              {admin?.avatar ? (
                <img src={getImageUrl(admin.avatar)} alt={admin.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[9px] font-bold text-primary-green">
                  {admin?.name ? admin.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'SA'}
                </span>
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[12px] font-semibold text-primary-dark leading-tight">{admin?.name || 'Super Admin'}</p>
            </div>
            <ChevronDown size={14} className="text-neutral-text-secondary group-hover:text-primary-dark transition-colors" />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-border/60 overflow-hidden animate-fadeIn z-50">
                <div className="p-4 border-b border-neutral-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-green/10 flex items-center justify-center overflow-hidden border border-primary-green/20">
                      {admin?.avatar ? (
                        <img src={getImageUrl(admin.avatar)} alt={admin.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold text-primary-green">
                          {admin?.name ? admin.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'SA'}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-primary-dark truncate">{admin?.name || 'Super Admin'}</p>
                      <p className="text-[10px] text-neutral-text-secondary capitalize truncate">{admin?.role?.replace('_', ' ') || 'Administrator'}</p>
                    </div>
                  </div>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/admin/settings'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium text-primary-dark hover:bg-neutral-light transition-colors"
                  >
                    <User size={14} />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/admin/settings'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium text-primary-dark hover:bg-neutral-light transition-colors"
                  >
                    <Settings size={14} />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium text-red-600 hover:bg-red-50 transition-colors mt-0.5"
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
