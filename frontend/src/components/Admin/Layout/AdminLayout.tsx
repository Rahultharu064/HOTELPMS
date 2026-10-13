import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div
      className="flex min-h-screen w-full font-sans"
      style={{ background: 'var(--color-surface)' }}
    >
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-200">
        <Header onMobileMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 relative overflow-x-hidden" style={{ padding: '32px' }}>
          <div className="relative z-10 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        <footer
          className="flex items-center justify-between"
          style={{
            padding: '16px 32px',
            borderTop: '1px solid var(--color-border)',
            background: 'var(--color-card)',
            fontFamily: 'var(--font-ui)',
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--color-muted)',
          }}
        >
          <p>© 2026 Itahari Namuna College — Property Management System</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }} />
              System online
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
