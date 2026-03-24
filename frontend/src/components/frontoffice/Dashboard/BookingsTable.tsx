import React from 'react';
import {
  MoreVertical,
  Search,
  Filter,
  ArrowRight,
  Clock,
  BedDouble,
  FileText
} from 'lucide-react';

const bookings = [
  { id: 'BK-1001', guest: 'Rahul Tharu',       room: 'Deluxe 204',    date: '2026-03-24', time: '12:00 PM', status: 'Confirmed' as const, price: 'Rs. 22,000' },
  { id: 'BK-1002', guest: 'Maya Sharma',        room: 'Suite 301',     date: '2026-03-24', time: '2:00 PM',  status: 'Pending'   as const, price: 'Rs. 45,000' },
  { id: 'BK-1003', guest: 'Siddharth Khanal',   room: 'Standard 102',  date: '2026-03-25', time: '11:00 AM', status: 'Cancelled' as const, price: 'Rs. 12,000' },
  { id: 'BK-1004', guest: 'Anjali Pandey',      room: 'Deluxe 205',    date: '2026-03-25', time: '1:00 PM',  status: 'Confirmed' as const, price: 'Rs. 22,000' },
  { id: 'BK-1005', guest: 'Bibek Magar',        room: 'Standard 105',  date: '2026-03-26', time: '3:00 PM',  status: 'Confirmed' as const, price: 'Rs. 12,000' },
];

const statusStyles = {
  Confirmed: 'bg-[#1F7A3A]/10 text-[#1F7A3A] border-[#1F7A3A]/20',
  Pending:   'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  Cancelled: 'bg-red-50 text-red-600 border-red-100',
};

const BookingsTable: React.FC = () => {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
      {/* ── Header ── */}
      <div className="px-6 py-5 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
             <FileText size={16} className="text-[#1F7A3A]" />
             Recent Bookings
          </h3>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mt-1">Showing latest 5 of 24 entries</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1F7A3A]" />
            <input
              type="text"
              placeholder="Search..."
              className="h-10 w-full sm:w-56 pl-8 pr-4 text-[13px] font-medium bg-gray-50 border border-gray-100 rounded-xl
                         focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1F7A3A]/5 focus:border-[#1F7A3A]/30 transition-all"
            />
          </div>
          <button
            type="button"
            className="h-10 px-3.5 flex items-center justify-center gap-1.5 text-[12px] font-bold text-gray-500 bg-white border border-gray-100 rounded-xl hover:text-[#111827] hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
          >
            <Filter size={14} />
            <span className="hidden sm:inline uppercase tracking-wider">Filter</span>
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[750px]">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-50">
              {['Guest Details', 'Room Assigned', 'Date & Time', 'Total Amount', 'Status', ''].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3.5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bookings.map((b) => (
              <tr key={b.id} className="group hover:bg-gray-50/50 transition-colors">
                {/* Guest */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1F7A3A]/10 to-[#1F7A3A]/5 text-[#1F7A3A] flex items-center justify-center text-[12px] font-black border border-[#1F7A3A]/10 shrink-0">
                      {b.guest.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#111827] group-hover:text-[#1F7A3A] transition-colors">{b.guest}</p>
                      <p className="text-[10px] font-bold text-gray-400 mt-0.5 tracking-wider uppercase">{b.id}</p>
                    </div>
                  </div>
                </td>
                {/* Room */}
                <td className="px-6 py-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-xl text-[12px] font-semibold text-gray-600 shadow-sm">
                    <BedDouble size={14} className="text-[#1F7A3A]" />
                    {b.room}
                  </div>
                </td>
                {/* Date */}
                <td className="px-6 py-4">
                  <p className="text-[13px] font-bold text-[#111827]">{b.date}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mt-1">
                    <Clock size={12} className="text-[#1F7A3A]/60" /> {b.time}
                  </p>
                </td>
                {/* Amount */}
                <td className="px-6 py-4">
                  <span className="text-[14px] font-black text-[#1F7A3A]">{b.price}</span>
                </td>
                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-[8px] border text-[10px] font-black uppercase tracking-widest ${statusStyles[b.status]}`}
                  >
                    {b.status}
                  </span>
                </td>
                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    title="More options"
                    className="p-2 rounded-xl text-gray-400 hover:text-[#111827] hover:bg-gray-100 transition-colors bg-white border border-gray-100 cursor-pointer shadow-sm"
                  >
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total 24 Bookings today</span>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 text-[11px] font-black uppercase tracking-widest text-[#111827] hover:border-[#1F7A3A] transition-colors group cursor-pointer shadow-sm">
          View All Records <ArrowRight size={14} className="text-[#1F7A3A] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default BookingsTable;
