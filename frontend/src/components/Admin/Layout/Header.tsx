import { useState } from "react";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { getImageUrl } from "../../../services/api";
import { Search, Bell, ChevronDown, Settings, LogOut, Menu } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  onMobileMenuClick: () => void;
}

export function Header({ onMobileMenuClick }: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { admin, adminLogout } = useAdminAuth();

  const handleLogout = () => {
    adminLogout();
    window.location.href = '/admin/login';
  };

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header
      style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        padding: '0 32px',
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Left: mobile menu + search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden"
          style={{
            width: '40px', height: '40px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'var(--color-card)', border: '1px solid var(--color-border)',
            borderRadius: '8px', color: 'var(--color-muted)', cursor: 'pointer', flexShrink: 0,
          }}
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>

        {/* Search */}
        <div className="hidden lg:block relative" style={{ maxWidth: '400px', width: '100%' }}>
          <Search
            size={15}
            style={{
              position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--color-muted)', pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search guests, rooms, bookings..."
            className="input-field"
            style={{
              width: '100%', paddingLeft: '34px',
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              fontSize: '13px',
            }}
          />
        </div>
      </div>

      {/* Right: notifications + profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          style={{
            width: '36px', height: '36px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none',
            borderRadius: '8px', color: 'var(--color-muted)',
            cursor: 'pointer', position: 'relative',
          }}
          className="hover:bg-gray-100 transition-colors"
          title="Notifications"
        >
          <Bell size={17} strokeWidth={2} />
          <span
            style={{
              position: 'absolute', top: '6px', right: '6px',
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'var(--color-danger)',
            }}
          />
        </button>

        {/* Profile */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '5px', background: 'transparent', border: 'none',
              borderRadius: '8px', cursor: 'pointer',
            }}
            className="hover:bg-gray-100 transition-colors"
          >
            <div
              style={{
                width: '30px', height: '30px', borderRadius: '6px',
                background: 'var(--color-primary)', color: '#FFFFFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-ui)', fontSize: '11px', fontWeight: 700,
                overflow: 'hidden', flexShrink: 0,
              }}
            >
              {admin?.avatar ? (
                <img src={getImageUrl(admin.avatar)} alt={admin.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : getInitials(admin?.name || 'SA')}
            </div>
            <div className="hidden sm:block text-left">
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1 }}>
                {admin?.name || 'Administrator'}
              </p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--color-muted)', marginTop: '2px', textTransform: 'capitalize' }}>
                {admin?.role?.replace('_', ' ') || 'Admin'}
              </p>
            </div>
            <ChevronDown size={13} className="hidden sm:block" style={{ color: 'var(--color-muted)', transition: 'transform 150ms ease', transform: profileOpen ? 'rotate(180deg)' : 'none' }} />
          </button>

          {profileOpen && (
            <div
              style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                width: '220px', background: 'var(--color-card)',
                border: '1px solid var(--color-border)', borderRadius: '12px',
                boxShadow: 'var(--shadow-lg)', padding: '8px', zIndex: 50,
              }}
            >
              <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border)', marginBottom: '6px' }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 600, color: 'var(--color-ink)' }}>
                  {admin?.name || 'Administrator'}
                </p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--color-muted)', marginTop: '2px' }}>
                  {admin?.email || 'admin@hotel.com'}
                </p>
              </div>

              <Link
                to="/admin/settings"
                onClick={() => setProfileOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                  padding: '8px 10px', background: 'transparent', border: 'none',
                  borderRadius: '6px', fontFamily: 'var(--font-ui)', fontSize: '13px',
                  fontWeight: 500, color: 'var(--color-ink)', textDecoration: 'none', cursor: 'pointer',
                }}
                className="hover:bg-gray-50 transition-colors"
              >
                <Settings size={14} />
                <span>Settings</span>
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                  padding: '8px 10px', background: 'transparent', border: 'none',
                  borderRadius: '6px', fontFamily: 'var(--font-ui)', fontSize: '13px',
                  fontWeight: 500, color: 'var(--color-danger)', cursor: 'pointer', marginTop: '2px',
                }}
                className="hover:bg-red-50 transition-colors"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {profileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 30 }} onClick={() => setProfileOpen(false)} />
      )}
    </header>
  );
}
