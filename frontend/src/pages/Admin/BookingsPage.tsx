import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  Users, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  MoreVertical,
  ChevronRight,
  Hash,
  Hotel
} from 'lucide-react';
import { motion } from 'framer-motion';
import { bookingService } from '../../services/bookingService';
import type { Booking } from '../../services/bookingService';
import { toast } from 'react-hot-toast';

import { useState, useEffect } from 'react';
export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getAllBookings({
        search: searchQuery,
        status: statusFilter === 'all' ? undefined : statusFilter
      });
      if (res.success) {
        setBookings(res.data.bookings);
      }
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [searchQuery, statusFilter]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'checked_in': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'checked_out': return 'bg-slate-50 text-slate-600 border-slate-100';
      case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 size={14} />;
      case 'pending': return <Clock size={14} />;
      case 'cancelled': return <XCircle size={14} />;
      default: return <Hotel size={14} />;
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-primary-dark tracking-tight uppercase">Reservation Ledger</h1>
          <p className="text-[11px] font-black text-neutral-text-secondary uppercase tracking-[0.2em] mt-2">Global booking management & operational flow</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-14 px-6 bg-white border border-neutral-border/50 rounded-2xl flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-neutral-text-secondary hover:bg-neutral-light transition-all shadow-sm">
             <Download size={16} /> Export Audit
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-text-secondary group-focus-within:text-primary-green transition-colors" size={20} />
          <input 
            placeholder="Search by booking number, guest name, email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-6 h-16 bg-white border border-neutral-border/50 rounded-3xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-green/5 focus:border-primary-green transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-3">
           <select 
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
             className="h-16 px-8 bg-white border border-neutral-border/50 rounded-3xl text-[11px] font-black uppercase tracking-widest text-primary-dark focus:outline-none focus:ring-4 focus:ring-primary-green/5 shadow-sm appearance-none min-w-[200px] cursor-pointer"
             title="Filter by Occupation Status"
           >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
           </select>
           <button title="Apply Fine Filters" className="h-16 w-16 bg-primary-dark text-white rounded-3xl flex items-center justify-center hover:bg-primary-green transition-all shadow-xl shadow-primary-dark/10">
              <Filter size={20} />
           </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-[48px] border border-neutral-border/40 shadow-soft overflow-hidden">
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-4">
             <Loader2 className="h-12 w-12 text-primary-green animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-text-secondary animate-pulse">Syncing reservations...</p>
          </div>
        ) : bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-light/50">
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-text-secondary">Identifier</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-text-secondary">Patron</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-text-secondary">Occupancy Details</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-text-secondary">Valuation</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-text-secondary">Operational Status</th>
                  <th className="px-10 py-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border/10">
                {bookings.map((booking, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={booking.id} 
                    className="group hover:bg-neutral-light/30 transition-all cursor-pointer"
                  >
                    <td className="px-10 py-8">
                       <div className="flex flex-col">
                          <span className="text-[13px] font-black text-primary-dark tracking-widest">{booking.bookingNumber}</span>
                          <span className="text-[10px] font-bold text-neutral-text-secondary mt-1">{new Date(booking.createdAt).toLocaleDateString()}</span>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-primary-green/10 text-primary-green flex items-center justify-center font-black text-xs">
                             {(booking as any).guest?.firstName?.[0]}{(booking as any).guest?.lastName?.[0]}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[13px] font-black text-primary-dark">{(booking as any).guest?.firstName} {(booking as any).guest?.lastName}</span>
                             <span className="text-[11px] font-medium text-neutral-text-secondary">{(booking as any).guest?.email}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-6">
                          <div className="flex flex-col">
                             <div className="flex items-center gap-2 text-[11px] font-black text-primary-dark">
                                <Calendar size={12} className="text-primary-gold" />
                                {new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                <ChevronRight size={10} className="text-neutral-text-secondary" />
                                {new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                             </div>
                             <div className="flex items-center gap-3 mt-1.5">
                                <span className="flex items-center gap-1 text-[10px] font-bold text-neutral-text-secondary bg-neutral-light px-2 py-0.5 rounded-md">
                                   <Users size={10} /> {booking.adults + booking.children}
                                </span>
                                <span className="flex items-center gap-1 text-[10px] font-bold text-neutral-text-secondary bg-neutral-light px-2 py-0.5 rounded-md">
                                   <Hash size={10} /> Room {(booking as any).room?.roomNumber}
                                </span>
                             </div>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <span className="text-[15px] font-black text-primary-dark tracking-tight">Rs. {Number(booking.totalAmount).toLocaleString()}</span>
                    </td>
                    <td className="px-10 py-8">
                       <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          {booking.status.replace('_', ' ')}
                       </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <button title="Administrative Actions" className="p-3 rounded-xl hover:bg-white text-neutral-text-secondary hover:text-primary-dark hover:shadow-sm transition-all border border-transparent hover:border-neutral-border/30">
                          <MoreVertical size={20} />
                       </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-40 flex flex-col items-center justify-center gap-6 opacity-60">
             <div className="w-24 h-24 rounded-[40px] bg-neutral-light flex items-center justify-center text-neutral-border">
                <Calendar size={48} />
             </div>
             <div className="text-center">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-neutral-text-secondary">Zero Transactions Found</p>
                <p className="text-sm font-bold text-neutral-text-secondary/60 mt-2">Adjust your filters or verify incoming signals</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
