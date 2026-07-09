import React, { useState, useEffect, Suspense, lazy } from "react";
import { 
  CreditCard, 
  Activity,
  Hotel,
  Users,
  Search,
  Bell,
  User
} from "lucide-react";
import { bookingService } from "../../services/bookingService";
import { toast } from "react-hot-toast";
import { StatCard } from "../../components/Admin/Dashboard/StatCard";
import { DashboardSidebar } from "../../components/Admin/Dashboard/DashboardSidebar";
import { SectionLoader } from "../../components/ui/PageLoader";
import { AdminDashboardSkeleton } from "../../components/ui/skeletons/AdminSkeletons";

const RecentBookingsTable = lazy(() =>
  import("../../components/Admin/Dashboard/RecentBookingsTable").then((m) => ({ default: m.RecentBookingsTable }))
);
const SystemControlHub = lazy(() =>
  import("../../components/Admin/Dashboard/SystemControlHub").then((m) => ({ default: m.SystemControlHub }))
);

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, logsRes] = await Promise.all([
        bookingService.getStatistics(),
        bookingService.getAllBookings({ limit: 5 }) // Using bookings as activity for now
      ]);

      if (statsRes.success) {
        setStats(statsRes.data);
      }
      if (logsRes.success) {
        setRecentLogs(logsRes.data.bookings);
      }
    } catch (error) {
      toast.error("Failed to synchronize enterprise intelligence");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statsConfig = [
    { 
      label: "Total Revenue", 
      value: stats ? `Rs. ${Number(stats.totalRevenue).toLocaleString()}` : "Rs. 0", 
      icon: CreditCard, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50", 
      trend: "Operational", 
      trendValue: "+2.5%",
      positive: true 
    },
    { 
      label: "Total Bookings", 
      value: stats ? stats.totalBookings.toString() : "0", 
      icon: Hotel, 
      color: "text-amber-600", 
      bg: "bg-amber-50", 
      trend: `${stats?.pendingBookings || 0} Pending`, 
      trendValue: "+1.3%",
      positive: true 
    },
    { 
      label: "Active Stays", 
      value: stats ? stats.activeStays.toString() : "0", 
      icon: Users, 
      color: "text-blue-600", 
      bg: "bg-blue-50", 
      trend: "Live", 
      trendValue: "+1.6%",
      positive: true 
    },
    { 
      label: "Today's Flow", 
      value: stats ? (stats.todayCheckIns + stats.todayCheckOuts).toString() : "0", 
      icon: Activity, 
      color: "text-rose-600", 
      bg: "bg-rose-50", 
      trend: `${stats?.todayCheckIns || 0} In / ${stats?.todayCheckOuts || 0} Out`, 
      trendValue: "+0.6%",
      positive: true 
    },
  ];

  if (loading && !stats) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-primary-dark tracking-tight">Dashboard</h1>
          <p className="text-[11px] font-bold text-neutral-text-secondary uppercase tracking-[0.2em] mt-1">
            Command Center Overview
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-text-secondary w-4 h-4" />
            <input 
              type="text"
              placeholder="Search places..."
              className="pl-10 pr-4 py-2.5 bg-white border border-neutral-border/30 rounded-xl text-[12px] font-medium outline-none focus:border-primary-green/50 w-64 transition-all"
            />
          </div>
          
          <button className="w-10 h-10 rounded-xl bg-white border border-neutral-border/30 flex items-center justify-center text-neutral-text-secondary hover:text-primary-green hover:border-primary-green/30 transition-all relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary-gold rounded-full" />
          </button>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-white border border-neutral-border/30 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-primary-green/10 flex items-center justify-center">
              <User size={16} className="text-primary-green" />
            </div>
            <div className="hidden sm:block">
              <p className="text-[12px] font-bold text-primary-dark">Admin User</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsConfig.map((s, i) => (
              <StatCard key={i} {...s} />
            ))}
          </div>

          {/* Recent Bookings Table */}
          <Suspense fallback={<SectionLoader />}>
            <RecentBookingsTable bookings={recentLogs} loading={loading} />
          </Suspense>

          {/* System Control Hub */}
          <Suspense fallback={<SectionLoader />}>
            <SystemControlHub />
          </Suspense>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-3">
          <DashboardSidebar />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
