import React, { Suspense, lazy } from "react";
import StatsCards from "../../components/frontoffice/Dashboard/StatsCards";
import { SectionLoader } from "../../components/ui/PageLoader";

const QuickActions = lazy(() => import("../../components/frontoffice/Dashboard/QuickActions"));
const BookingsTable = lazy(() => import("../../components/frontoffice/Dashboard/BookingsTable"));
const CheckInOutForm = lazy(() => import("../../components/frontoffice/Dashboard/CheckInOutForm"));
const GuestManagement = lazy(() => import("../../components/frontoffice/Dashboard/GuestManagement"));

const DashboardHome: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white/60 backdrop-blur-sm p-8 rounded-[40px] border border-neutral-border/40 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-green/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-primary-dark tracking-tight">Management Dashboard</h1>
          <p className="text-neutral-text-secondary text-[11px] font-bold uppercase tracking-[0.2em] mt-2">Real-time property intelligence overview</p>
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <button className="px-6 py-4 bg-white border border-neutral-border/50 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-neutral-text-secondary hover:text-primary-green hover:bg-neutral-light transition-all shadow-sm">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-12">
          <Suspense fallback={<SectionLoader />}>
            <QuickActions />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <BookingsTable />
          </Suspense>
        </div>

        {/* Sidebar Sections */}
        <div className="space-y-12">
          <Suspense fallback={<SectionLoader />}>
            <CheckInOutForm />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <GuestManagement />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
