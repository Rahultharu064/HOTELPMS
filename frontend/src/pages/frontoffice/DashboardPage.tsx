import React, { Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { FileBarChart } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import StatsCards from "../../components/frontoffice/Dashboard/StatsCards";
import { SectionLoader } from "../../components/ui/PageLoader";

const QuickActions = lazy(() => import("../../components/frontoffice/Dashboard/QuickActions"));
const BookingsTable = lazy(() => import("../../components/frontoffice/Dashboard/BookingsTable"));
const CheckInOutForm = lazy(() => import("../../components/frontoffice/Dashboard/CheckInOutForm"));
const GuestManagement = lazy(() => import("../../components/frontoffice/Dashboard/GuestManagement"));

const DashboardHome: React.FC = () => {
  const { admin } = useAdminAuth();
  const navigate = useNavigate();
  const firstName = admin?.name?.split(' ')[0];

  return (
    <div className="space-y-12 animate-fade-in pb-10">
      <div className="pms-hero-banner relative overflow-hidden rounded-[40px] px-8 py-10 md:px-12 md:py-12 shadow-[0_20px_40px_-16px_rgba(20,83,45,0.35)] flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.28em] text-primary-gold mb-4">
            <span className="h-px w-8 bg-primary-gold" />
            Front Desk
          </span>
          <h1 className="font-georgia text-3xl md:text-4xl font-bold text-white tracking-tight">
            {firstName ? `Welcome back, ${firstName}` : "Management Dashboard"}
          </h1>
          <p className="text-white/70 text-[11px] font-bold uppercase tracking-[0.2em] mt-3">Real-time property intelligence overview</p>
        </div>
        <div className="flex items-center gap-4 relative z-10 shrink-0">
          <button
            onClick={() => navigate('/frontoffice/reports')}
            className="flex items-center gap-2.5 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-white hover:bg-white hover:text-primary-dark transition-all shadow-sm"
          >
            <FileBarChart size={16} strokeWidth={2.5} />
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
