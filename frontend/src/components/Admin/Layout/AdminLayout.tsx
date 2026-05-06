import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

const pageTitles: Record<string, string> = {
  "/admin": "Superuser Dashboard",
  "/admin/dashboard": "Superuser Dashboard",
  "/admin/users": "User & Access Management",
  "/admin/rooms": "Global Asset Tracking",
  "/admin/room-types": "Room Category Config",
  "/admin/financials": "Master Financial View",
  "/admin/reports": "Advanced System Analytics",
  "/admin/settings": "Global System Config",
  "/admin/profile": "Root User Settings",
};

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Auto-close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const title = pageTitles[location.pathname] || "Admin Control Center";

  return (
    <div className="flex min-h-screen w-full bg-[#FAFBFF] font-sans selection:bg-[#1E40AF]/10 selection:text-[#1E40AF]">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-500`}>
        <Header title={title} onMobileMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 p-10 md:p-12 lg:p-14 relative overflow-x-hidden">
          {/* Subtle background decorative blur (Premium feel) */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-900/5 rounded-full blur-[120px] pointer-events-none -ml-64 -mb-64" />

          <div className="relative z-10 max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>

        {/* Footer info for internal dash */}
        <footer className="px-10 py-6 border-t border-gray-100 flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white/50 backdrop-blur-md">
          <p>© 2026 Antigravity Hotel PMS - Administrative Core V4.0.1</p>
          <div className="flex items-center gap-6">
            <button className="hover:text-blue-600 transition-colors">Core Engine: Stable</button>
            <button className="hover:text-blue-600 transition-colors">System Logs</button>
            <button className="hover:text-blue-600 transition-colors">Audit DB</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
