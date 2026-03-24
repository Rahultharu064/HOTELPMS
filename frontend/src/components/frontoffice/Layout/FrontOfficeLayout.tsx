import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface FrontOfficeLayoutProps {
  children: React.ReactNode;
}

const FrontOfficeLayout: React.FC<FrontOfficeLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F5F6F8] font-['Inter']">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed on all sizes, slides in on mobile */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-[272px] transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main wrapper — pushed right on desktop by sidebar width */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-[272px]">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FrontOfficeLayout;
