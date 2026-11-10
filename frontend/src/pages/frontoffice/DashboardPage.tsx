import React, { Suspense, lazy } from "react";
import StatsCards from "../../components/frontoffice/Dashboard/StatsCards";
import { SectionLoader } from "../../components/ui/PageLoader";

const QuickActions = lazy(() => import("../../components/frontoffice/Dashboard/QuickActions"));
const BookingsTable = lazy(() => import("../../components/frontoffice/Dashboard/BookingsTable"));
const CheckInOutForm = lazy(() => import("../../components/frontoffice/Dashboard/CheckInOutForm"));
const GuestManagement = lazy(() => import("../../components/frontoffice/Dashboard/GuestManagement"));

const DashboardHome: React.FC = () => {
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-primary-dark">Front office</h1>
        <p className="mt-1 text-sm text-neutral-text-secondary">Today’s arrivals, departures, room readiness and payments.</p>
      </div>

      {/* Stats Section */}
      <StatsCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="space-y-6 lg:col-span-2">
          <Suspense fallback={<SectionLoader />}>
            <QuickActions />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <BookingsTable />
          </Suspense>
        </div>

        {/* Sidebar Sections */}
        <div className="space-y-6">
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
