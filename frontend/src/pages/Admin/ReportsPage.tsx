import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { CalendarCheck, Clock3, BedDouble, DollarSign } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import type { BookingStatistics } from '../../services/bookingService';
import { roomService } from '../../services/roomService';
import type { RoomStatus } from '../../services/roomService';
import { StatCard } from '../../components/Admin/Dashboard/StatCard';
import { DonutChart } from '../../components/ui/Chart';
import { AdminStatCardsSkeleton } from '../../components/ui/skeletons/AdminSkeletons';

const ROOM_STATUS_LABEL: Record<RoomStatus, string> = {
  available: 'Available',
  occupied: 'Occupied',
  cleaning: 'Cleaning',
  reserved: 'Reserved',
  maintenance: 'Maintenance',
  out_of_service: 'Out of Service',
};

const ROOM_STATUS_COLOR: Record<RoomStatus, string> = {
  available: '#1F7A3A',
  occupied: '#F59E0B',
  cleaning: '#3B82F6',
  reserved: '#8B5CF6',
  maintenance: '#F97316',
  out_of_service: '#DC2626',
};

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BookingStatistics | null>(null);
  const [roomCounts, setRoomCounts] = useState<Record<RoomStatus, number>>({
    available: 0,
    occupied: 0,
    cleaning: 0,
    reserved: 0,
    maintenance: 0,
    out_of_service: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, roomsRes] = await Promise.all([
          bookingService.getStatistics(),
          roomService.getAllRooms(),
        ]);
        if (statsRes.success) setStats(statsRes.data);
        if (roomsRes.success) {
          const counts: Record<RoomStatus, number> = { available: 0, occupied: 0, cleaning: 0, reserved: 0, maintenance: 0, out_of_service: 0 };
          roomsRes.data.forEach((room) => {
            counts[room.status] = (counts[room.status] || 0) + 1;
          });
          setRoomCounts(counts);
        }
      } catch {
        toast.error('Failed to load report data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRooms = Object.values(roomCounts).reduce((a, b) => a + b, 0);
  const occupancyRate = totalRooms > 0 ? Math.round((roomCounts.occupied / totalRooms) * 100) : 0;
  const donutData = (Object.keys(roomCounts) as RoomStatus[])
    .filter((status) => roomCounts[status] > 0)
    .map((status) => ({ label: ROOM_STATUS_LABEL[status], value: roomCounts[status], color: ROOM_STATUS_COLOR[status] }));

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight uppercase flex items-center gap-4">
          <div className="w-2 h-8 bg-primary-gold rounded-full" />
          System Analytics
        </h1>
        <p className="text-[11px] font-black text-neutral-text-secondary uppercase tracking-[0.2em] mt-2 ml-6">Operational snapshot</p>
      </div>

      {loading ? (
        <AdminStatCardsSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Bookings" value={String(stats?.totalBookings ?? 0)} icon={CalendarCheck} color="text-primary-green" bg="bg-primary-green/10" />
          <StatCard label="Active Stays" value={String(stats?.activeStays ?? 0)} icon={BedDouble} color="text-primary-gold" bg="bg-primary-gold/10" />
          <StatCard label="Pending Bookings" value={String(stats?.pendingBookings ?? 0)} icon={Clock3} color="text-blue-600" bg="bg-blue-600/10" />
          <StatCard label="Total Revenue" value={`Rs. ${Number(stats?.totalRevenue ?? 0).toLocaleString()}`} icon={DollarSign} color="text-primary-orange" bg="bg-primary-orange/10" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-neutral-border/40 shadow-sm">
          <h3 className="text-sm font-bold text-primary-dark mb-2">Room Occupancy</h3>
          <p className="text-[10px] font-medium text-neutral-text-secondary mb-6">{totalRooms} rooms total &middot; {occupancyRate}% occupied</p>
          {loading ? (
            <div className="h-40 rounded-2xl skeleton-shimmer" />
          ) : donutData.length > 0 ? (
            <DonutChart data={donutData} label={<span className="text-lg font-black text-primary-dark">{occupancyRate}%</span>} />
          ) : (
            <p className="text-xs font-medium text-neutral-text-secondary">No rooms found</p>
          )}
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-neutral-border/40 shadow-sm">
          <h3 className="text-sm font-bold text-primary-dark mb-6">Today</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-text-secondary">Check-ins</span>
              <span className="text-sm font-black text-primary-dark">{stats?.todayCheckIns ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-text-secondary">Check-outs</span>
              <span className="text-sm font-black text-primary-dark">{stats?.todayCheckOuts ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
