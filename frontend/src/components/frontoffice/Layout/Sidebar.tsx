import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { getImageUrl } from "../../../services/api";
import {
  LayoutDashboard,
  CalendarCheck,
  LogIn,
  Users,
  BedDouble,
  CreditCard,
  BarChart3,
  ChevronLeft,
  Menu,
  LogOut,
  ShoppingBag,
  FileText,
  Settings,
  Bell,
} from "lucide-react";
import { Button } from "../../ui/Button";

const menuItems = [
  { title: "Dashboard",         url: "/frontoffice",               icon: LayoutDashboard },
  { title: "Bookings",          url: "/frontoffice/bookings",       icon: CalendarCheck },
  { title: "Check-in / Out",    url: "/frontoffice/checkin",        icon: LogIn },
  { title: "Guests",            url: "/frontoffice/guests",         icon: Users },
  { title: "Rooms",             url: "/frontoffice/rooms",          icon: BedDouble },
  { title: "Services & POS",    url: "/frontoffice/services-pos",   icon: ShoppingBag },
  { title: "Payments",          url: "/frontoffice/payments",       icon: CreditCard },
  { title: "Guest Folio",       url: "/frontoffice/folio",          icon: FileText },
  { title: "Reports",           url: "/frontoffice/reports",        icon: BarChart3 },
  { title: "Notifications",     url: "/frontoffice/notifications",  icon: Bell },
  { title: "Settings",          url: "/frontoffice/settings",       icon: Settings },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, adminLogout } = useAdminAuth();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
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
          padding: collapsed ? '24px 0' : '24px 20px',
          borderColor: 'rgba(255,255,255,0.06)',
          justifyContent: collapsed ? 'center' : 'flex-start',
          minHeight: '72px',
        }}
      >
        <img
          src="/Logos1.png"
          alt="Logo"
          style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '6px', flexShrink: 0 }}
        />
        {!collapsed && (
          <div>
            <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              Itahari Namuna
            </h1>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', fontWeight: 500, color: 'var(--color-accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '3px' }}>
              College PMS
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar-dark" style={{ padding: collapsed ? '16px 8px' : '16px 12px' }}>
        {!collapsed && (
          <p className="sidebar-section-label" style={{ marginBottom: '4px' }}>Main Navigation</p>
        )}

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {menuItems.map((item) => {
            const active =
              location.pathname === item.url ||
              (item.url === '/frontoffice' && location.pathname === '/frontoffice/dashboard');

            return (
              <Link
                key={item.title}
                to={item.url}
                onClick={onMobileClose}
                title={collapsed ? item.title : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  height: '44px',
                  padding: collapsed ? '0' : '0 12px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '14px',
                  fontWeight: active ? 600 : 500,
                  color: active ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  background: active ? 'rgba(45,106,79,0.9)' : 'transparent',
                  borderLeft: active ? '3px solid var(--color-accent)' : '3px solid transparent',
                  transition: 'background 100ms ease, color 100ms ease',
                  position: 'relative',
                }}
                className="sidebar-nav-item"
              >
                <item.icon
                  size={18}
                  strokeWidth={2}
                  style={{ color: active ? '#FFFFFF' : 'rgba(255,255,255,0.55)', flexShrink: 0 }}
                />
                {!collapsed && <span className="truncate">{item.title}</span>}

                {/* Tooltip in collapsed mode */}
                {collapsed && (
                  <div
                    className="pointer-events-none sidebar-tooltip"
                    style={{
                      position: 'absolute',
                      left: 'calc(100% + 10px)',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      padding: '6px 12px',
                      background: '#111827',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontFamily: 'var(--font-ui)',
                      fontWeight: 500,
                      borderRadius: '6px',
                      whiteSpace: 'nowrap',
                      opacity: 0,
                      zIndex: 60,
                      boxShadow: 'var(--shadow-lg)',
                    }}
                  >
                    {item.title}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom — user + collapse toggle + logout */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: collapsed ? '12px 8px' : '16px 12px',
        }}
      >
        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            width: '100%',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-end',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.35)',
            borderRadius: '6px',
            marginBottom: '8px',
            transition: 'color 100ms ease, background 100ms ease',
            paddingRight: collapsed ? '0' : '4px',
          }}
          className="sidebar-toggle-btn"
        >
          <ChevronLeft
            size={16}
            strokeWidth={2}
            style={{ transition: 'transform 200ms ease', transform: collapsed ? 'rotate(180deg)' : 'none' }}
          />
        </button>

        {!collapsed && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '8px',
              background: 'rgba(255,255,255,0.04)',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.10)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-ui)',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--color-accent)',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              {admin?.avatar ? (
                <img src={getImageUrl(admin.avatar)} alt={admin.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                getInitials(admin?.name || 'GA')
              )}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 600, color: '#FFFFFF', lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {admin?.name || 'Staff Member'}
              </p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', fontWeight: 500, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '3px' }}>
                {admin?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          aria-label="Log out"
          style={{
            width: '100%',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '0' : '0 10px',
            background: 'rgba(192,57,43,0.08)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            fontWeight: 600,
            color: '#E57373',
            transition: 'background 150ms ease, color 150ms ease',
          }}
          className="logout-btn"
        >
          <LogOut size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-shrink-0 h-screen sticky top-0 z-50">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
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
        .sidebar-nav-item:hover {
          background: rgba(255,255,255,0.06) !important;
          color: #FFFFFF !important;
        }
        .sidebar-nav-item:hover .sidebar-tooltip {
          opacity: 1 !important;
        }
        .sidebar-toggle-btn:hover {
          background: rgba(255,255,255,0.06) !important;
          color: rgba(255,255,255,0.7) !important;
        }
        .logout-btn:hover {
          background: rgba(192,57,43,0.18) !important;
          color: #FFFFFF !important;
        }
      `}</style>
    </>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      type="button"
      className="lg:hidden h-10 w-10 rounded-lg bg-white border border-gray-100 text-gray-600 shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center"
      aria-label="Open navigation menu"
    >
      <Menu className="w-5 h-5" strokeWidth={2} />
    </Button>
  );
}
