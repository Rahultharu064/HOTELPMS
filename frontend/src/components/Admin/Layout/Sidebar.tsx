import { useLocation, Link } from "react-router-dom";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { getImageUrl } from "../../../services/api";
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  ChevronLeft,
  Menu,
  Building2,
  LogOut,
  CreditCard,
  Warehouse,
  Zap,
  ShieldCheck,
  Images,
  CalendarCheck,
} from "lucide-react";

const menuItems = [
  { title: "Dashboard",        url: "/admin",                icon: LayoutDashboard },
  { title: "Bookings",         url: "/admin/bookings",       icon: CalendarCheck },
  { title: "Guests",           url: "/admin/guests",         icon: Users },
  { title: "Staff",            url: "/admin/users",          icon: ShieldCheck },
  { title: "Room Types",       url: "/admin/room-types",     icon: Building2 },
  { title: "Rooms",            url: "/admin/rooms",          icon: Warehouse },
  { title: "Extra Services",   url: "/admin/extra-services", icon: Zap },
  { title: "Gallery",          url: "/admin/gallery",        icon: Images },
  { title: "Financials",       url: "/admin/financials",     icon: CreditCard },
  { title: "Reports",          url: "/admin/reports",        icon: BarChart3 },
  { title: "Settings",         url: "/admin/settings",       icon: Settings },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: AppSidebarProps) {
  const location = useLocation();
  const { adminLogout, admin } = useAdminAuth();

  const handleLogout = () => {
    adminLogout();
    window.location.href = '/admin/login';
  };

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const sidebarContent = (
    <div
      className="flex flex-col h-full transition-all duration-200"
      style={{
        background: 'var(--color-ink)',
        width: collapsed ? '64px' : '240px',
      }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-3 border-b"
        style={{
          padding: collapsed ? '20px 0' : '20px 20px',
          borderColor: 'rgba(255,255,255,0.06)',
          justifyContent: collapsed ? 'center' : 'flex-start',
          minHeight: '64px',
        }}
      >
        <img
          src="/Logos1.png"
          alt="Logo"
          style={{ width: '30px', height: '30px', objectFit: 'contain', borderRadius: '6px', flexShrink: 0 }}
        />
        {!collapsed && (
          <div>
            <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              Itahari Namuna
            </h1>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', fontWeight: 500, color: 'var(--color-accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '3px' }}>
              Admin Panel
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar-dark" style={{ padding: collapsed ? '12px 8px' : '12px 10px' }}>
        {!collapsed && (
          <p
            style={{
              padding: '12px 8px 6px',
              fontFamily: 'var(--font-ui)',
              fontSize: '10px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.30)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
          >
            Management
          </p>
        )}

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {menuItems.map((item) => {
            const active =
              location.pathname === item.url ||
              (item.url === '/admin' && location.pathname === '/admin/dashboard');

            return (
              <Link
                key={item.title}
                to={item.url}
                onClick={onMobileClose}
                title={collapsed ? item.title : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  height: '40px',
                  padding: collapsed ? '0' : '0 10px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13px',
                  fontWeight: active ? 600 : 500,
                  color: active ? '#FFFFFF' : 'rgba(255,255,255,0.60)',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  background: active ? 'rgba(45,106,79,0.9)' : 'transparent',
                  borderLeft: active ? '3px solid var(--color-accent)' : '3px solid transparent',
                  transition: 'background 100ms ease, color 100ms ease',
                }}
                className="admin-sidebar-item"
              >
                <item.icon
                  size={16}
                  strokeWidth={2}
                  style={{ color: active ? '#FFFFFF' : 'rgba(255,255,255,0.50)', flexShrink: 0 }}
                />
                {!collapsed && <span className="truncate">{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom — user + logout */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: collapsed ? '10px 8px' : '12px 10px',
        }}
      >
        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            width: '100%',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-end',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.30)',
            borderRadius: '6px',
            marginBottom: '6px',
            transition: 'color 100ms ease',
            paddingRight: collapsed ? '0' : '4px',
          }}
          className="admin-collapse-btn"
        >
          <ChevronLeft
            size={14}
            style={{ transition: 'transform 200ms ease', transform: collapsed ? 'rotate(180deg)' : 'none' }}
          />
        </button>

        {!collapsed && admin && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px',
              borderRadius: '6px',
              marginBottom: '6px',
              background: 'rgba(255,255,255,0.04)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '5px',
                background: 'rgba(255,255,255,0.10)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-ui)',
                fontSize: '10px',
                fontWeight: 700,
                color: 'var(--color-accent)',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              {admin.avatar ? (
                <img src={getImageUrl(admin.avatar)} alt={admin.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                getInitials(admin.name || 'SA')
              )}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', fontWeight: 600, color: '#FFFFFF', lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {admin.name}
              </p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', fontWeight: 500, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>
                {admin.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '0' : '0 8px',
            background: 'rgba(192,57,43,0.08)',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'var(--font-ui)',
            fontSize: '12px',
            fontWeight: 600,
            color: '#E57373',
            transition: 'background 150ms ease, color 150ms ease',
          }}
          className="admin-logout-btn"
        >
          <LogOut size={14} strokeWidth={2} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Sign Out</span>}
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
          <div
            className="absolute inset-0"
            style={{ background: 'var(--color-overlay)', backdropFilter: 'blur(4px)' }}
            onClick={onMobileClose}
          />
          <aside className="relative z-10 h-full shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      <style>{`
        .admin-sidebar-item:hover {
          background: rgba(255,255,255,0.06) !important;
          color: #FFFFFF !important;
        }
        .admin-collapse-btn:hover { color: rgba(255,255,255,0.65) !important; }
        .admin-logout-btn:hover {
          background: rgba(192,57,43,0.18) !important;
          color: #FFFFFF !important;
        }
      `}</style>
    </>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
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
      }}
      aria-label="Open navigation menu"
    >
      <Menu size={18} />
    </button>
  );
}
