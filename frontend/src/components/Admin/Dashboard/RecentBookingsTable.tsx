import { TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { AdminTableSkeleton } from "../../ui/skeletons/AdminSkeletons";

interface RecentBookingsTableProps {
  bookings: any[];
  loading: boolean;
}

export function RecentBookingsTable({ bookings, loading }: RecentBookingsTableProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-primary-dark tracking-tight flex items-center gap-3">
            <TrendingUp className="text-primary-gold" size={20} /> Recent Bookings
          </h2>
        </div>
        <AdminTableSkeleton rows={5} cols={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-primary-dark tracking-tight flex items-center gap-3">
          <TrendingUp className="text-primary-gold" size={20} /> Recent Bookings
        </h2>
        <button className="text-[11px] font-bold text-primary-green hover:text-primary-dark uppercase tracking-wider transition-colors">
          See All
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-neutral-border/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-light/50">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-text-secondary">Guest Name</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-text-secondary">Room Info</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-text-secondary">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-text-secondary text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-border/10">
              {bookings.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-light/50 transition-all group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-[12px] text-primary-dark">{(log as any).guest?.firstName} {(log as any).guest?.lastName}</span>
                      <span className="text-[10px] font-medium text-neutral-text-secondary">{(log as any).guest?.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-[11px] text-neutral-text-secondary uppercase tracking-wider">{(log as any).room?.name}</span>
                      <span className="text-[10px] font-bold text-primary-green">No. {(log as any).room?.roomNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[12px] font-bold tracking-tight text-primary-dark">Rs. {Number(log.totalAmount).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                      log.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {log.status === 'confirmed' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                      {log.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-[10px] font-bold uppercase tracking-wider text-neutral-text-secondary/50">
                    No recent activity found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
