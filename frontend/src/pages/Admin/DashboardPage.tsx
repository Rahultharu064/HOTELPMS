import { useEffect, useState } from "react";
import { StatCard } from "../../components/Admin/Dashboard/StatCard";
import { SystemControlHub } from "../../components/Admin/Dashboard/SystemControlHub";
import { RecentBookingsTable } from "../../components/Admin/Dashboard/RecentBookingsTable";
import { BarChart } from "../../components/ui/Chart";
import { AdminDashboardSkeleton } from "../../components/ui/skeletons/AdminSkeletons";
import { bookingService } from "../../services/bookingService";
import type { Booking, BookingStatistics } from "../../services/bookingService";
import { paymentService } from "../../services/paymentService";
import { roomService } from "../../services/roomService";
import type { RoomStatus } from "../../services/roomService";
import { toast } from "react-hot-toast";
import {
  Users,
  Building2,
  DollarSign,
  Calendar,
  TrendingUp,
  Building,
  Clock,
  CheckCircle,
} from "lucide-react";

const ROOM_STATUS_META: Record<RoomStatus, { label: string; dot: string }> = {
  available: { label: "Available", dot: "bg-primary-green" },
  occupied: { label: "Occupied", dot: "bg-primary-gold" },
  maintenance: { label: "Maintenance", dot: "bg-primary-orange" },
  out_of_service: { label: "Out of Service", dot: "bg-red-500" },
};

export function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BookingStatistics | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [roomCounts, setRoomCounts] = useState<Record<RoomStatus, number>>({
    available: 0,
    occupied: 0,
    maintenance: 0,
    out_of_service: 0,
  });
  const [revenueByDay, setRevenueByDay] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [statsRes, bookingsRes, roomsRes, paymentsRes] = await Promise.all([
          bookingService.getStatistics(),
          bookingService.getAllBookings({ limit: 5 }),
          roomService.getAllRooms(),
          paymentService.getAllPayments({ status: "completed", limit: 150 }),
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (bookingsRes.success) setRecentBookings(bookingsRes.data.bookings);

        if (roomsRes.success) {
          const counts: Record<RoomStatus, number> = { available: 0, occupied: 0, maintenance: 0, out_of_service: 0 };
          roomsRes.data.forEach((room) => {
            counts[room.status] = (counts[room.status] || 0) + 1;
          });
          setRoomCounts(counts);
        }

        if (paymentsRes.success) {
          const days: { key: string; label: string; value: number }[] = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            d.setDate(d.getDate() - (6 - i));
            return { key: d.toDateString(), label: d.toLocaleDateString("en-US", { weekday: "short" }), value: 0 };
          });
          paymentsRes.data.payments.forEach((payment) => {
            const key = new Date(payment.createdAt).toDateString();
            const day = days.find((d) => d.key === key);
            if (day) day.value += Number(payment.amount);
          });
          setRevenueByDay(days.map(({ label, value }) => ({ label, value })));
        }
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  const totalRooms = Object.values(roomCounts).reduce((a, b) => a + b, 0);
  const occupancyRate = totalRooms > 0 ? Math.round((roomCounts.occupied / totalRooms) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-primary-dark tracking-tight">Dashboard</h1>
          <p className="text-sm font-medium text-neutral-text-secondary mt-2">
            Hotel overview and activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-primary-green/10 border border-primary-green/20 rounded-xl">
            <p className="text-[10px] font-bold text-primary-green uppercase tracking-wider">Status</p>
            <p className="text-xs font-bold text-primary-dark mt-0.5">Online</p>
          </div>
          <div className="px-4 py-2 bg-primary-gold/10 border border-primary-gold/20 rounded-xl">
            <p className="text-[10px] font-bold text-primary-gold uppercase tracking-wider">Date</p>
            <p className="text-xs font-bold text-primary-dark mt-0.5">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Bookings"
          value={String(stats?.totalBookings ?? 0)}
          icon={Calendar}
          color="text-primary-green"
          bg="bg-primary-green/10"
        />
        <StatCard
          label="Active Stays"
          value={String(stats?.activeStays ?? 0)}
          icon={Users}
          color="text-primary-gold"
          bg="bg-primary-gold/10"
        />
        <StatCard
          label="Total Revenue"
          value={`Rs. ${Number(stats?.totalRevenue ?? 0).toLocaleString()}`}
          icon={DollarSign}
          color="text-primary-orange"
          bg="bg-primary-orange/10"
        />
        <StatCard
          label="Pending Bookings"
          value={String(stats?.pendingBookings ?? 0)}
          icon={Building2}
          color="text-blue-600"
          bg="bg-blue-600/10"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Charts & Analytics */}
        <div className="lg:col-span-2 space-y-8">
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-border/30 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-green/10 flex items-center justify-center text-primary-green">
                <TrendingUp size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-primary-dark">Revenue</h3>
                <p className="text-[10px] font-medium text-neutral-text-secondary">Last 7 days, completed payments</p>
              </div>
            </div>
            <BarChart data={revenueByDay} height={220} color="#1F7A3A" />
          </div>

          {/* Recent Bookings Table */}
          <RecentBookingsTable bookings={recentBookings} loading={false} />
        </div>

        {/* Right Column - System Controls & Quick Actions */}
        <div className="space-y-8">
          <SystemControlHub />

          {/* Room Status */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-border/30 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-green/10 flex items-center justify-center text-primary-green">
                <Building2 size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-primary-dark">Rooms</h3>
                <p className="text-[10px] font-medium text-neutral-text-secondary">Current status</p>
              </div>
            </div>

            <div className="space-y-4">
              {(Object.keys(ROOM_STATUS_META) as RoomStatus[]).map((status) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${ROOM_STATUS_META[status].dot}`} />
                    <span className="text-xs font-medium text-primary-dark">{ROOM_STATUS_META[status].label}</span>
                  </div>
                  <span className="text-xs font-bold text-primary-dark">{roomCounts[status]}</span>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-neutral-text-secondary">Occupancy Rate</span>
                <span className="text-[10px] font-bold text-primary-green">{occupancyRate}%</span>
              </div>
              <div className="h-2 bg-neutral-light rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-green to-primary-gold rounded-full" style={{ width: `${occupancyRate}%` }} />
              </div>
            </div>
          </div>

          {/* Today at a Glance */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-border/30 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-gold/10 flex items-center justify-center text-primary-gold">
                <Building size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-primary-dark">Today</h3>
                <p className="text-[10px] font-medium text-neutral-text-secondary">Check-in / check-out activity</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-primary-green/10 border border-primary-green/20 rounded-xl flex items-start gap-3">
                <CheckCircle size={14} className="text-primary-green flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <div>
                  <p className="text-[11px] font-bold text-primary-dark">Check-ins today</p>
                  <p className="text-[9px] text-neutral-text-secondary mt-1">{stats?.todayCheckIns ?? 0} guests</p>
                </div>
              </div>
              <div className="p-3 bg-primary-gold/10 border border-primary-gold/30 rounded-xl flex items-start gap-3">
                <Clock size={14} className="text-primary-gold flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <div>
                  <p className="text-[11px] font-bold text-primary-dark">Check-outs today</p>
                  <p className="text-[9px] text-neutral-text-secondary mt-1">{stats?.todayCheckOuts ?? 0} guests</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
