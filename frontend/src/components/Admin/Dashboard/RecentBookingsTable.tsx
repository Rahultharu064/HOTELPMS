import { TrendingUp, CheckCircle2, Clock } from "lucide-react";

interface RecentBookingsTableProps {
  bookings: any[];
  loading: boolean;
}

export function RecentBookingsTable({ bookings, loading }: RecentBookingsTableProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-[#111827] tracking-tighter uppercase flex items-center gap-3">
          <TrendingUp className="text-[#F59E0B]" size={24} /> Recent Bookings
        </h2>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">LATEST 5 ENTRIES</p>
      </div>
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Guest Name</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Room Info</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Amount</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-all group cursor-pointer">
                  <td className="px-10 py-8">
                    <div className="flex flex-col">
                      <span className="font-black text-[13px] text-[#111827] uppercase tracking-tight">{(log as any).guest?.firstName} {(log as any).guest?.lastName}</span>
                      <span className="text-[10px] font-bold text-gray-400">{(log as any).guest?.email}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col">
                      <span className="font-bold text-[12px] text-gray-500 uppercase tracking-widest">{(log as any).room?.name}</span>
                      <span className="text-[10px] font-black text-[#14532D]">No. {(log as any).room?.roomNumber}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-[13px] font-black tracking-tight text-[#111827]">Rs. {Number(log.totalAmount).toLocaleString()}</td>
                  <td className="px-10 py-8 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      log.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {log.status === 'confirmed' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                      {log.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="px-10 py-20 text-center text-[10px] font-black uppercase tracking-widest text-gray-300">
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
