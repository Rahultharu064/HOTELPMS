import React, { useEffect, useState } from 'react';
import {
  CalendarDays,
  UserPlus,
  DoorOpen,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { bookingService } from '../../../services/bookingService';
import type { BookingStatistics } from '../../../services/bookingService';
import { roomService } from '../../../services/roomService';
import { paymentService } from '../../../services/paymentService';

const cardShellClass = "bg-white rounded-[40px] p-10 border border-neutral-border/40 shadow-sm animate-pulse";

const StatsCards: React.FC = () => {
  const [stats, setStats] = useState<BookingStatistics | null>(null);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [totalRooms, setTotalRooms] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [statsRes, roomsRes, paymentsRes] = await Promise.all([
          bookingService.getStatistics(),
          roomService.getAllRooms(),
          paymentService.getAllPayments({ status: 'completed', limit: 150 }),
        ]);
        if (cancelled) return;

        if (statsRes.success) setStats(statsRes.data);

        if (roomsRes.success) {
          setTotalRooms(roomsRes.data.length);
          setAvailableRooms(roomsRes.data.filter((r) => r.status === 'available').length);
        }

        if (paymentsRes.success) {
          const today = new Date().toDateString();
          const sum = paymentsRes.data.payments
            .filter((p) => new Date(p.createdAt).toDateString() === today)
            .reduce((acc, p) => acc + Number(p.amount), 0);
          setTodayRevenue(sum);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={cardShellClass}>
            <div className="w-14 h-14 rounded-2xl bg-neutral-light mb-8" />
            <div className="h-8 w-16 bg-neutral-light rounded-lg mb-2" />
            <div className="h-3 w-24 bg-neutral-light rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Bookings',
      value: String(stats?.totalBookings ?? 0),
      hint: `${stats?.pendingBookings ?? 0} awaiting confirmation`,
      icon: CalendarDays,
      color: 'text-primary-green',
      bg: 'bg-primary-green/10',
    },
    {
      label: 'Check-ins Today',
      value: String(stats?.todayCheckIns ?? 0),
      hint: `${stats?.todayCheckOuts ?? 0} checking out`,
      icon: UserPlus,
      color: 'text-primary-gold',
      bg: 'bg-primary-gold/10',
    },
    {
      label: 'Available Rooms',
      value: String(availableRooms),
      hint: `of ${totalRooms} total rooms`,
      icon: DoorOpen,
      color: 'text-primary-orange',
      bg: 'bg-primary-orange/10',
    },
    {
      label: "Today's Revenue",
      value: `Rs. ${todayRevenue.toLocaleString()}`,
      hint: `Rs. ${Number(stats?.totalRevenue ?? 0).toLocaleString()} all-time`,
      icon: TrendingUp,
      color: 'text-primary-green',
      bg: 'bg-primary-green/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {cards.map((stat, idx) => (
        <motion.div
          key={idx}
          whileHover={{ y: -8, scale: 1.02 }}
          className="bg-white rounded-[40px] p-10 border border-neutral-border/40 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-green/5 rounded-bl-[40px] pointer-events-none group-hover:bg-primary-green/10 transition-colors duration-500" />

          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-lg shadow-black/5 group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon size={26} strokeWidth={3} />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-primary-dark tracking-tighter mb-1">{stat.value}</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-text-secondary">{stat.label}</p>
            <p className="text-[10px] font-medium text-neutral-text-secondary/70 mt-2">{stat.hint}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
