import React, { useState } from 'react';
import FrontOfficeLayout from '../../components/frontoffice/Layout/FrontOfficeLayout';
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  CalendarDays
} from 'lucide-react';

const bookingsData = [
  { id: 'BK-1001', guest: 'Rahul Tharu',       room: 'Deluxe 204',    checkIn: 'Mar 24', checkOut: 'Mar 26', status: 'Confirmed', payment: 'Paid',       amount: 'Rs.22,000' },
  { id: 'BK-1002', guest: 'Maya Sharma',        room: 'Suite 301',     checkIn: 'Mar 24', checkOut: 'Mar 25', status: 'Pending',   payment: 'Unpaid',     amount: 'Rs.45,000' },
  { id: 'BK-1003', guest: 'Siddharth Khanal',   room: 'Standard 102',  checkIn: 'Mar 25', checkOut: 'Mar 28', status: 'Checked In',payment: 'Partial',    amount: 'Rs.12,000' },
  { id: 'BK-1004', guest: 'Anjali Pandey',      room: 'Deluxe 205',    checkIn: 'Mar 25', checkOut: 'Mar 26', status: 'Confirmed', payment: 'Paid',       amount: 'Rs.22,000' },
  { id: 'BK-1005', guest: 'Bibek Magar',        room: 'Standard 105',  checkIn: 'Mar 26', checkOut: 'Mar 27', status: 'Checked Out',payment: 'Paid',      amount: 'Rs.12,000' },
  { id: 'BK-1006', guest: 'Sneha Thapa',        room: 'Suite 302',     checkIn: 'Mar 27', checkOut: 'Mar 29', status: 'Confirmed', payment: 'Paid',       amount: 'Rs.55,000' },
  { id: 'BK-1007', guest: 'Rohan Adhikari',     room: 'Family 401',    checkIn: 'Mar 28', checkOut: 'Mar 30', status: 'Pending',   payment: 'Unpaid',     amount: 'Rs.32,000' },
  { id: 'BK-1008', guest: 'Priya Karki',        room: 'Deluxe 201',    checkIn: 'Mar 28', checkOut: 'Mar 29', status: 'Confirmed', payment: 'Partial',    amount: 'Rs.22,000' },
];

const statusStyles: Record<string, string> = {
  'Confirmed':   'bg-[#1F7A3A]/10 text-[#1F7A3A] border-[#1F7A3A]/20',
  'Pending':     'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  'Checked In':  'bg-blue-50 text-blue-600 border-blue-200',
  'Checked Out': 'bg-gray-100 text-gray-500 border-gray-200',
};

const paymentStyles: Record<string, string> = {
  'Paid':    'text-[#1F7A3A]',
  'Unpaid':  'text-red-500',
  'Partial': 'text-[#F59E0B]',
};

const tabs = ['All Bookings', 'Confirmed', 'Pending', 'Checked In'];

const BookingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All Bookings');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <FrontOfficeLayout>
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-[28px] font-extrabold text-[#111827] leading-tight flex items-center gap-2 mb-1.5">
            <CalendarDays size={24} className="text-[#1F7A3A]" />
            Manage Bookings
          </h1>
          <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">
            Front Office • 128 Total Reservations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-11 px-4 flex items-center gap-2 text-[13px] font-bold text-gray-600 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow hover:border-gray-200 transition-all cursor-pointer">
            <Download size={16} /> Export
          </button>
          <button className="h-11 px-5 flex items-center gap-2 text-[13px] font-bold text-white bg-[#1F7A3A] hover:bg-[#14532D] rounded-xl shadow-lg shadow-green-900/10 transition-all cursor-pointer active:scale-95">
            <Plus size={16} /> New Booking
          </button>
        </div>
      </div>

      {/* ── Main Card Wrapper ── */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-full min-h-[600px]">
        
        {/* Top Filter Bar */}
        <div className="px-6 py-5 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center gap-5 justify-between bg-gray-50/30">
          
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-gray-100 rounded-[14px] shadow-sm">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-[10px] text-[12px] font-bold transition-all cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-gray-100 text-[#111827] shadow-sm' 
                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative group flex-1 lg:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1F7A3A] transition-colors" />
              <input
                type="text"
                placeholder="Search guest, ID, room..."
                className="w-full h-11 pl-[38px] pr-4 text-[13px] font-bold bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1F7A3A]/5 focus:border-[#1F7A3A]/30 transition-all shadow-sm"
              />
            </div>
            
            {/* Filter */}
            <button className="h-11 px-4 flex items-center gap-2 text-[13px] font-bold text-gray-600 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-gray-50 transition-colors cursor-pointer shrink-0">
              <Filter size={16} /> <span className="hidden sm:block">Filters</span>
            </button>
          </div>
        </div>

        {/* ── Data Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="w-12 px-6 py-4">
                  <input type="checkbox" className="min-w-4 h-4 rounded-[4px] border-gray-300 text-[#1F7A3A] focus:ring-[#1F7A3A]" />
                </th>
                {['Reservation', 'Room', 'Stay Dates', 'Status', 'Payment', 'Amount', ''].map((h, i) => (
                  <th key={i} className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookingsData.map((b) => (
                <tr key={b.id} className="group hover:bg-gray-50/40 transition-colors bg-white">
                  <td className="px-6 py-5">
                    <input type="checkbox" className="w-4 h-4 rounded-[4px] border-gray-200 text-[#1F7A3A] focus:ring-[#1F7A3A] cursor-pointer" />
                  </td>
                  
                  {/* Reservation (Guest + ID) */}
                  <td className="px-4 py-5 min-w-[200px]">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1F7A3A]/10 to-[#1F7A3A]/5 text-[#1F7A3A] flex items-center justify-center text-[13px] font-black border border-[#1F7A3A]/10 shrink-0 group-hover:bg-[#1F7A3A] group-hover:text-white transition-colors duration-300">
                        {b.guest.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[#111827] group-hover:text-[#1F7A3A] transition-colors">{b.guest}</p>
                        <p className="text-[10px] font-black text-gray-400 mt-0.5 tracking-widest uppercase">{b.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Room */}
                  <td className="px-4 py-5">
                    <span className="inline-flex items-center px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-[12px] font-bold text-gray-700 shadow-sm whitespace-nowrap">
                      {b.room}
                    </span>
                  </td>

                  {/* Stay Dates */}
                  <td className="px-4 py-5 font-bold whitespace-nowrap">
                    <div className="flex items-center gap-2 text-[13px] text-[#111827]">
                      {b.checkIn} <ArrowRight size={14} className="text-gray-300 mx-0.5" /> {b.checkOut}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1 flex items-center gap-1">
                      <Clock size={12} className="text-[#F59E0B]" /> 2 Nights
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-[8px] border text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${statusStyles[b.status]}`}>
                      {b.status}
                    </span>
                  </td>

                  {/* Payment */}
                  <td className="px-4 py-5">
                     <span className={`text-[12px] font-black uppercase tracking-wider flex items-center gap-1.5 ${paymentStyles[b.payment]}`}>
                       {b.payment === 'Paid' && <CheckCircle2 size={14} />}
                       {b.payment}
                     </span>
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-5">
                    <span className="text-[14px] font-black text-[#1F7A3A]">{b.amount}</span>
                  </td>

                  {/* Actions (Dropdown Menu) */}
                  <td className="px-6 py-5 text-right relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === b.id ? null : b.id)}
                      className="p-2 rounded-xl text-gray-400 hover:text-[#111827] bg-white border border-transparent hover:border-gray-100 hover:shadow-sm transition-all focus:outline-none"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {/* Action Dropdown Menu */}
                    {activeMenu === b.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                        <div className="absolute right-8 top-12 w-48 bg-white rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] border border-gray-100 p-2 z-20 animate-fade-slide-up origin-top-right">
                          <button className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-gray-600 hover:bg-gray-50 hover:text-[#111827] rounded-xl transition-colors text-left uppercase tracking-wider">
                            <Eye size={14} className="text-[#1F7A3A]" /> View Details
                          </button>
                          <button className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-gray-600 hover:bg-gray-50 hover:text-[#111827] rounded-xl transition-colors text-left uppercase tracking-wider">
                            <Calendar size={14} className="text-[#F59E0B]" /> Modify Stay
                          </button>
                          <button className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-gray-600 hover:bg-gray-50 hover:text-[#111827] rounded-xl transition-colors text-left uppercase tracking-wider">
                            <Edit size={14} className="text-gray-400" /> Edit Guest
                          </button>
                          <div className="border-t border-gray-50 my-1 mx-2" />
                          <button className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left uppercase tracking-wider">
                            <Trash2 size={14} /> Cancel Booking
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="mt-auto px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Showing <span className="text-[#111827]">1-8</span> of <span className="text-[#111827]">128</span> entries
          </p>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 bg-white hover:bg-gray-50 hover:text-[#111827] transition-colors disabled:opacity-50">
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1">
              {['1', '2', '3', '...', '16'].map((p, i) => (
                <button
                  key={i}
                  className={`min-w-8 h-8 flex items-center justify-center rounded-lg text-[12px] font-black transition-colors ${
                    p === '1' 
                      ? 'bg-[#1F7A3A] text-white shadow-md shadow-green-900/10' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-[#111827]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 bg-white hover:bg-gray-50 hover:text-[#111827] transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </FrontOfficeLayout>
  );
};

export default BookingsPage;

// Helper to make ArrowRight accessible from react-router in a non-component file
const ArrowRight = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);
