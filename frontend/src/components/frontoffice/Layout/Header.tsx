import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ChevronDown, LogOut, User, Bell, Menu } from "lucide-react";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { getImageUrl } from "../../../services/api";

interface HeaderProps {
  title: string;
  onMobileMenuClick: () => void;
}

export function Header({ title, onMobileMenuClick }: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { admin, adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <header
      style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        padding: '0 32px',
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuClick}
        className="lg:hidden"
        style={{
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          color: 'var(--color-muted)',
          cursor: 'pointer',
          flexShrink: 0,
        }}
        aria-label="Open navigation menu"
      >
        <Menu size={18} />
      </button>

      {/* Page title */}
      <div>
        <h1
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--color-ink)',
            lineHeight: 1,
          }}
        >
          {title}
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--color-success)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--color-success)',
            }}
          >
            System Online
          </span>
        </div>
      </div>

      {/* Search (desktop only) */}
      <div className="flex-1 max-w-md hidden lg:block">
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search bookings, guests, rooms..."
            className="input-field"
            style={{
              width: '100%',
              paddingLeft: '36px',
              paddingRight: '60px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          >
            <kbd
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '2px 6px',
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                fontFamily: 'var(--font-ui)',
                fontSize: '11px',
                fontWeight: 500,
                color: 'var(--color-muted)',
              }}
            >
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right side: notifications + profile */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Notifications */}
        <button
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            borderRadius: '8px',
            color: 'var(--color-muted)',
            cursor: 'pointer',
            position: 'relative',
          }}
          className="hover:bg-gray-100 transition-colors"
          title="Notifications"
        >
          <Bell size={18} strokeWidth={2} />
          {/* Notification dot */}
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--color-danger)',
            }}
          />
        </button>

        {/* Profile dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            className="hover:bg-gray-100 transition-colors"
          >
            {/* Avatar */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: 'var(--color-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-ui)',
                fontSize: '12px',
                fontWeight: 700,
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {admin?.avatar ? (
                <img
                  src={getImageUrl(admin.avatar)}
                  alt={admin.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                getInitials(admin?.name || 'Staff')
              )}
            </div>

            {/* Name + role (desktop only) */}
            <div className="hidden sm:block text-left">
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--color-ink)',
                  lineHeight: 1,
                }}
              >
                {admin?.name || 'Staff Member'}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'var(--color-muted)',
                  marginTop: '2px',
                  textTransform: 'capitalize',
                }}
              >
                {admin?.role?.replace('_', ' ') || 'Staff'}
              </p>
            </div>

            <ChevronDown
              size={14}
              className="hidden sm:block"
              style={{
                color: 'var(--color-muted)',
                transform: profileOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 150ms ease',
              }}
            />
          </button>

          {/* Dropdown menu */}
          {profileOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '240px',
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-lg)',
                padding: '8px',
                zIndex: 50,
              }}
            >
              <div
                style={{
                  padding: '12px',
                  borderBottom: '1px solid var(--color-border)',
                  marginBottom: '8px',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--color-ink)',
                  }}
                >
                  {admin?.name || 'Staff Member'}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '12px',
                    color: 'var(--color-muted)',
                    marginTop: '2px',
                  }}
                >
                  {admin?.email || 'staff@hotel.com'}
                </p>
              </div>

              <Link
                to="/frontoffice/profile"
                onClick={() => setProfileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 12px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--color-ink)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
                className="hover:bg-gray-50 transition-colors"
              >
                <User size={16} />
                <span>My Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 12px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--color-danger)',
                  cursor: 'pointer',
                  marginTop: '4px',
                }}
                className="hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {profileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 30,
          }}
          onClick={() => setProfileOpen(false)}
        />
      )}
    </header>
  );
}