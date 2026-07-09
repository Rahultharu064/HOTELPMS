import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Auto-close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen w-full bg-[#FAFAF8] font-sans selection:bg-primary-green/10 selection:text-primary-dark">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-500`}>
        <Header onMobileMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 p-10 md:p-12 lg:p-14 relative overflow-x-hidden">
          {/* Subtle background decorative blur (Premium feel) */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-green/5 rounded-full blur-[120px] pointer-events-none -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-gold/5 rounded-full blur-[120px] pointer-events-none -ml-64 -mb-64" />

          <div className="relative z-10 max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>

        {/* Footer info for internal dash */}
        <footer className="px-10 py-6 border-t border-neutral-border/40 flex items-center justify-between text-[10px] font-bold text-neutral-text-secondary uppercase tracking-widest bg-white/50 backdrop-blur-md">
          <p>© 2026 Itahari Namuna College PMS — Administrative Core</p>
          <div className="flex items-center gap-6">
            <button className="hover:text-primary-green transition-colors">Core Engine: Stable</button>
            <button className="hover:text-primary-green transition-colors">System Logs</button>
            <button className="hover:text-primary-green transition-colors">Audit DB</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
