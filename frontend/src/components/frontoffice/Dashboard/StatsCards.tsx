import React, { useEffect, useState } from 'react';
import {
  CalendarDays,
  LogOut,
  BedDouble,
  Banknote,
} from 'lucide-react';
import { frontOfficeService } from '../../../services/frontofficeService';

type DashboardStats = {
  overview: {
    arrivalsToday: number;
    departuresToday: number;
    revenueToday: number;
  };
  inventory: Record<string, number>;
};

const StatsCards: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    let active = true;
    frontOfficeService.getDashboardStats()
      .then((response) => {
        if (active && response.success) setStats(response.data);
      })
      .catch((error) => console.error('Unable to load front-office dashboard stats:', error));

    return () => { active = false; };
  }, []);

  const cards = [
    { label: 'Arrivals', value: stats?.overview.arrivalsToday, icon: CalendarDays, color: 'text-primary-green', bg: 'bg-primary-green/10' },
    { label: 'Departures', value: stats?.overview.departuresToday, icon: LogOut, color: 'text-primary-orange', bg: 'bg-primary-orange/10' },
    { label: 'Rooms ready', value: stats?.inventory.available, icon: BedDouble, color: 'text-primary-green', bg: 'bg-primary-green/10' },
    { label: 'Payments received today', value: stats ? `Rs. ${stats.overview.revenueToday.toLocaleString()}` : undefined, icon: Banknote, color: 'text-primary-gold', bg: 'bg-primary-gold/10' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((stat) => (
        <section key={stat.label} className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-neutral-text-secondary">{stat.label}</p>
              <p className="mt-3 text-2xl font-semibold tabular-nums text-primary-dark">
                {stat.value === undefined ? <span className="text-neutral-text-secondary">—</span> : stat.value}
              </p>
            </div>
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={20} strokeWidth={2} />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default StatsCards;
