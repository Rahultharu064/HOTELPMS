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
    <div className="flex min-h-screen w-full bg-neutral-light font-sans selection:bg-primary-green/10 selection:text-primary-dark">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>

        <footer className="px-6 lg:px-10 py-4 border-t border-neutral-border/50 text-[11px] font-medium text-neutral-text-secondary">
          © {new Date().getFullYear()} Itahari Namuna Hotel — Property Management System
        </footer>
      </div>
    </div>
  );
}
