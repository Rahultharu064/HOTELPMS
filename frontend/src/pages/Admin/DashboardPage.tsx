import React, { useState, useEffect, Suspense, lazy } from "react";
import { 
  CreditCard, 
  Activity,
  Plus,
  Hotel,
  Users,
  LayoutDashboard
} from "lucide-react";
import { bookingService } from "../../services/bookingService";
import { toast } from "react-hot-toast";
import { StatCard } from "../../components/Admin/Dashboard/StatCard";
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
      positive: true 
    },
    { 
      label: "Total Bookings", 
      value: stats ? stats.totalBookings.toString() : "0", 
      icon: Hotel, 
      color: "text-amber-600", 
      bg: "bg-amber-50", 
      trend: `${stats?.pendingBookings || 0} Pending`, 
      positive: true 
    },
    { 
      label: "Active Stays", 
      value: stats ? stats.activeStays.toString() : "0", 
      icon: Users, 
      color: "text-blue-600", 
      bg: "bg-blue-50", 
      trend: "Live", 
      positive: true 
    },
    { 
      label: "Today's Flow", 
      value: stats ? (stats.todayCheckIns + stats.todayCheckOuts).toString() : "0", 
      icon: Activity, 
      color: "text-rose-600", 
      bg: "bg-rose-50", 
      trend: `${stats?.todayCheckIns || 0} In / ${stats?.todayCheckOuts || 0} Out`, 
      positive: true 
    },
  ];

  if (loading && !stats) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="space-y-12 animate-fade-in pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white/60 backdrop-blur-sm p-8 rounded-[40px] border border-neutral-border/40 shadow-sm relative overflow-hidden group">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-green/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-all duration-1000 group-hover:scale-150" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-primary-green to-primary-dark flex items-center justify-center shadow-2xl shadow-primary-dark/20 text-white transform hover:rotate-6 transition-transform">
            <LayoutDashboard size={32} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-black text-primary-dark tracking-tight truncate">System Intelligence</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-primary-green animate-pulse" />
              <p className="text-[10px] font-bold text-neutral-text-secondary uppercase tracking-[0.2em]">
                Command Center Overview
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <button 
            onClick={fetchDashboardData} 
            className="px-6 h-14 bg-white border border-neutral-border/50 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-neutral-text-secondary hover:text-primary-dark hover:bg-neutral-light transition-all shadow-sm flex items-center gap-3 active:scale-95"
          >
            <Activity size={18} className="text-primary-gold" /> 
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
          <button className="px-8 h-14 bg-primary-dark text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-primary-green transition-all shadow-xl shadow-primary-dark/20 flex items-center gap-3 active:scale-95">
            <Plus size={18} strokeWidth={3} /> 
            <span>New Action</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statsConfig.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <Suspense fallback={<SectionLoader />}>
            <RecentBookingsTable bookings={recentLogs} loading={loading} />
          </Suspense>
        </div>

        <Suspense fallback={<SectionLoader />}>
          <SystemControlHub />
        </Suspense>
      </div>
    </div>
  );
};

export default AdminDashboard;
