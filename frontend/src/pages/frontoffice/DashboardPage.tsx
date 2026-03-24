import React from 'react';
import FrontOfficeLayout from '../../components/frontoffice/Layout/FrontOfficeLayout';
import StatsCards from '../../components/frontoffice/Dashboard/StatsCards';
import QuickActions from '../../components/frontoffice/Dashboard/QuickActions';
import BookingsTable from '../../components/frontoffice/Dashboard/BookingsTable';
import CheckInOutForm from '../../components/frontoffice/Dashboard/CheckInOutForm';
import GuestManagement from '../../components/frontoffice/Dashboard/GuestManagement';

const DashboardPage: React.FC = () => {
  return (
    <FrontOfficeLayout>
      {/* ── Greeting ── */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
        <div>
          <h2 className="text-2xl lg:text-[28px] font-extrabold text-[#111827] leading-tight mb-1.5 tracking-tight">
            Good Morning, <span className="text-[#1F7A3A]">Admin User</span> 👋
          </h2>
          <p className="text-[13px] font-medium text-gray-400">
            Overview of today's activities at <span className="font-bold text-gray-700">Itahari Namuna College PMS</span>.
          </p>
        </div>

        {/* Staff / System Health Indicator */}
        <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] shrink-0">
          <div className="flex -space-x-2.5">
            {[21, 22, 23].map((n) => (
              <img
                key={n}
                src={`https://ui-avatars.com/api/?name=Staff+${n}&background=f3f4f6&color=111827`}
                alt="Staff"
                className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm bg-gray-100"
              />
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-[#1F7A3A] to-[#14532D] text-white flex items-center justify-center text-[9px] font-black shadow-sm">
              +12
            </div>
          </div>
          <div className="leading-tight border-l border-gray-100 pl-4">
            <p className="text-[12px] font-bold text-[#111827]">15 On Duty</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-[#1F7A3A] mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A3A] animate-pulse" />
              Active Now
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <StatsCards />

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Left column */}
        <div className="xl:col-span-8 flex flex-col gap-6 lg:gap-8">
          <QuickActions />
          <BookingsTable />
        </div>

        {/* Right column */}
        <div className="xl:col-span-4 flex flex-col gap-6 lg:gap-8">
          <CheckInOutForm />
          <GuestManagement />
        </div>

      </div>
    </FrontOfficeLayout>
  );
};

export default DashboardPage;
