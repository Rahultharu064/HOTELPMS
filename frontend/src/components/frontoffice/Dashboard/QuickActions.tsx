import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlus, ClipboardList, BedDouble } from 'lucide-react';

const actions = [
  { label: 'Manage bookings', Icon: CalendarPlus, to: '/frontoffice/bookings' },
  { label: 'Arrivals & departures', Icon: ClipboardList, to: '/frontoffice/checkin' },
  { label: 'Room status', Icon: BedDouble, to: '/frontoffice/rooms' },
];

const QuickActions: React.FC = () => {
  return (
    <section className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-neutral-text-primary">Quick links</h2>
        <p className="mt-1 text-sm text-neutral-text-secondary">Go to a common front-office task.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="flex min-h-14 items-center gap-3 rounded-lg border border-neutral-border px-4 py-3 text-sm font-medium text-neutral-text-primary transition-colors hover:border-primary-green/40 hover:bg-primary-green/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green"
          >
            <action.Icon size={18} className="text-primary-green" />
            <span>{action.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
