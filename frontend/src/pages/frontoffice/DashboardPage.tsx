import React from "react";
import StatsCards from "../../components/frontoffice/Dashboard/StatsCards";
import QuickActions from "../../components/frontoffice/Dashboard/QuickActions";
import BookingsTable from "../../components/frontoffice/Dashboard/BookingsTable";
import CheckInOutForm from "../../components/frontoffice/Dashboard/CheckInOutForm";
import GuestManagement from "../../components/frontoffice/Dashboard/GuestManagement";

const DashboardHome: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight uppercase">Management Dashboard</h1>
          <p className="text-neutral-text-secondary text-[11px] font-black uppercase tracking-[0.2em] mt-2">REAL-TIME PROPERTY INTELLIGENCE OVERVIEW</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-neutral-text-secondary hover:text-primary-green hover:bg-gray-50 transition-all shadow-sm">
            Generate Intelligence Report
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-12">
          {/* Quick Actions Panel */}
          <QuickActions />

          {/* Bookings Table Section */}
          <BookingsTable />
        </div>

        {/* Sidebar Sections */}
        <div className="space-y-12">
          {/* Check-in / Out Form */}
          <CheckInOutForm />

          {/* Guest Management Section */}
          <GuestManagement />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
