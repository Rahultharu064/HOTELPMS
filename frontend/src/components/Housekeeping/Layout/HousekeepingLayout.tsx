import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { GlobalAssignmentModal } from "../GlobalAssignmentModal";

const pageTitles: Record<string, string> = {
  "/housekeeping": "Operations Dashboard",
  "/housekeeping/dashboard": "Operations Dashboard",
  "/housekeeping/room-status": "Room Inventory Status",
  "/housekeeping/cleaning-tasks": "Cleaning Operations",
  "/housekeeping/staff-assignment": "Staff & Duty Assignment",
  "/housekeeping/profile": "Supervisor Profile",
  "/housekeeping/settings": "System Preferences",
};

export function HousekeepingLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Auto-close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const title = pageTitles[location.pathname] || "Housekeeping Central Control";

  return (
    <div className="flex min-h-screen w-full bg-[#F9FAFB] font-sans selection:bg-[#1F7A3A]/10 selection:text-[#1F7A3A]">
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
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1F7A3A]/5 rounded-full blur-[120px] pointer-events-none -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#F59E0B]/5 rounded-full blur-[120px] pointer-events-none -ml-64 -mb-64" />
          
          <div className="relative z-10 max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
        
        {/* Footer info for internal dash */}
        <footer className="px-10 py-6 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white/50 backdrop-blur-md">
          <p>© 2026 Itahari Namuna College PMS - Operations Module</p>
          <div className="flex items-center gap-6">
            <button className="hover:text-[#1F7A3A] transition-colors">Server Status: Online</button>
            <button className="hover:text-[#1F7A3A] transition-colors">Documentation</button>
          </div>
        </footer>
      </div>

      {/* Global Modals */}
      <GlobalAssignmentModal />
    </div>
  );
}

