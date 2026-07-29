import { useEffect, useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { StatCard } from "../../components/Admin/Dashboard/StatCard";
import { SystemControlHub } from "../../components/Admin/Dashboard/SystemControlHub";
import { RecentBookingsTable } from "../../components/Admin/Dashboard/RecentBookingsTable";
import { LineChart, DonutChart } from "../../components/ui/Chart";
import { AdminDashboardSkeleton } from "../../components/ui/skeletons/AdminSkeletons";
import { bookingService } from "../../services/bookingService";
import type { Booking, BookingStatistics } from "../../services/bookingService";
import { paymentService } from "../../services/paymentService";
import { roomService } from "../../services/roomService";
import type { RoomStatus } from "../../services/roomService";
import { toast } from "react-hot-toast";
import {
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  LogIn,
  Building2,
} from "lucide-react";

const ROOM_STATUS_META: Record<RoomStatus, { label: string; color: string }> = {
  available: { label: "Available", color: "#1F7A3A" },
  occupied: { label: "Occupied", color: "#F59E0B" },
  cleaning: { label: "Cleaning", color: "#3B82F6" },
  reserved: { label: "Reserved", color: "#8B5CF6" },
  maintenance: { label: "Maintenance", color: "#F97316" },
  out_of_service: { label: "Out of Service", color: "#DC2626" },
};

export function DashboardPage() {
  const { admin } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BookingStatistics | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [roomCounts, setRoomCounts] = useState<Record<RoomStatus, number>>({
    available: 0,
    occupied: 0,
    cleaning: 0,
    reserved: 0,
    maintenance: 0,
    out_of_service: 0,
  });
  const [revenueByDay, setRevenueByDay] = useState<{ label: string; value: number }[]>([]);
  const [todayRevenue, setTodayRevenue] = useState(0);

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
          const counts: Record<RoomStatus, number> = { available: 0, occupied: 0, cleaning: 0, reserved: 0, maintenance: 0, out_of_service: 0 };
          roomsRes.data.forEach((room) => {
            counts[room.status] = (counts[room.status] || 0) + 1;
          });
          setRoomCounts(counts);
        }

        if (paymentsRes.success) {
          const today = new Date().toDateString();
          const days: { key: string; label: string; value: number }[] = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            d.setDate(d.getDate() - (6 - i));
            return { key: d.toDateString(), label: d.toLocaleDateString("en-US", { weekday: "short" }), value: 0 };
          });
          let todaySum = 0;
          paymentsRes.data.payments.forEach((payment) => {
            const key = new Date(payment.createdAt).toDateString();
            const day = days.find((d) => d.key === key);
            if (day) day.value += Number(payment.amount);
            if (key === today) todaySum += Number(payment.amount);
          });
          setRevenueByDay(days.map(({ label, value }) => ({ label, value })));
          setTodayRevenue(todaySum);
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
  const donutData = (Object.keys(roomCounts) as RoomStatus[])
    .filter((status) => roomCounts[status] > 0)
    .map((status) => ({ label: ROOM_STATUS_META[status].label, value: roomCounts[status], color: ROOM_STATUS_META[status].color }));

  const firstName = admin?.name?.split(' ')[0];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary-dark tracking-tight">
          {firstName ? `Welcome back, ${firstName}` : "Dashboard"}
        </h1>
        <p className="text-sm text-neutral-text-secondary mt-1">
          Here's what's happening at your property on {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Bookings"
          value={String(stats?.totalBookings ?? 0)}
          icon={Calendar}
          color="text-primary-green"
          bg="bg-primary-green/10"
          hint={`${stats?.pendingBookings ?? 0} awaiting confirmation`}
        />
        <StatCard
          label="Active Stays"
          value={String(stats?.activeStays ?? 0)}
          icon={Users}
          color="text-primary-gold"
          bg="bg-primary-gold/10"
          hint={`${occupancyRate}% of rooms occupied`}
        />
        <StatCard
          label="Total Revenue"
          value={`Rs. ${Number(stats?.totalRevenue ?? 0).toLocaleString()}`}
          icon={DollarSign}
          color="text-primary-orange"
          bg="bg-primary-orange/10"
          hint={`Rs. ${todayRevenue.toLocaleString()} collected today`}
        />
        <StatCard
          label="Check-ins Today"
          value={String(stats?.todayCheckIns ?? 0)}
          icon={LogIn}
          color="text-blue-600"
          bg="bg-blue-600/10"
          hint={`${stats?.todayCheckOuts ?? 0} checking out`}
        />
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-neutral-border/60 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-primary-green/10 flex items-center justify-center text-primary-green">
              <TrendingUp size={18} strokeWidth={2.25} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-primary-dark">Revenue trend</h3>
              <p className="text-[11px] text-neutral-text-secondary">Last 7 days, completed payments</p>
            </div>
          </div>
          <LineChart data={revenueByDay} height={220} color="#1F7A3A" />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-border/60 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary-gold/10 flex items-center justify-center text-primary-gold">
              <Building2 size={18} strokeWidth={2.25} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-primary-dark">Room occupancy</h3>
              <p className="text-[11px] text-neutral-text-secondary">{totalRooms} rooms total</p>
            </div>
          </div>
          {donutData.length > 0 ? (
            <DonutChart
              data={donutData}
              size={140}
              label={<span className="text-xl font-bold text-primary-dark">{occupancyRate}%</span>}
            />
          ) : (
            <p className="text-xs text-neutral-text-secondary text-center py-8">No rooms found</p>
          )}
        </div>
      </div>

      {/* Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RecentBookingsTable bookings={recentBookings} loading={false} />
        </div>
        <div>
          <SystemControlHub />
        </div>
      </div>
    </div>
  );
}
