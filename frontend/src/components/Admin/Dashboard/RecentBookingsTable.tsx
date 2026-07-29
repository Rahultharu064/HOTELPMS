import { Link } from "react-router-dom";
import { AdminTableSkeleton } from "../../ui/skeletons/AdminSkeletons";
import { Badge } from "../../ui/Badge";
import type { BadgeVariant } from "../../ui/Badge";
import type { Booking, BookingStatus } from "../../../services/bookingService";

interface RecentBookingsTableProps {
  bookings: Booking[];
  loading: boolean;
}

const statusVariant: Record<BookingStatus, BadgeVariant> = {
  confirmed: "success",
  pending: "warning",
  checked_in: "info",
  checked_out: "default",
  cancelled: "danger",
};

export function RecentBookingsTable({ bookings, loading }: RecentBookingsTableProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-primary-dark">Recent bookings</h2>
        <AdminTableSkeleton rows={5} cols={4} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary-dark">Recent bookings</h2>
        <Link to="/admin/bookings" className="text-[12px] font-medium text-primary-green hover:text-primary-dark transition-colors">
          View all
        </Link>
      </div>
      <div className="bg-white rounded-2xl border border-neutral-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-light/60">
                <th className="px-5 py-3 text-[11px] font-medium text-neutral-text-secondary">Guest</th>
                <th className="px-5 py-3 text-[11px] font-medium text-neutral-text-secondary">Room</th>
                <th className="px-5 py-3 text-[11px] font-medium text-neutral-text-secondary">Amount</th>
                <th className="px-5 py-3 text-[11px] font-medium text-neutral-text-secondary text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-border/40">
              {bookings.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-light/40 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-[13px] text-primary-dark">{log.guest?.firstName} {log.guest?.lastName}</span>
                      <span className="text-[11px] text-neutral-text-secondary">{log.guest?.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-[12px] text-neutral-text-secondary">{log.room?.name}</span>
                      <span className="text-[11px] text-primary-dark">No. {log.room?.roomNumber}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[13px] font-semibold text-primary-dark">Rs. {Number(log.totalAmount).toLocaleString()}</td>
                  <td className="px-5 py-3 text-right">
                    <Badge variant={statusVariant[log.status]}>{log.status.replace('_', ' ')}</Badge>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-14 text-center text-[12px] text-neutral-text-secondary">
                    No recent bookings
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
