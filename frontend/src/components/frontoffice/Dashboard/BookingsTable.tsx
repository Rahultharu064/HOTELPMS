import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowRight,
  FileText,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { bookingService } from '../../../services/bookingService';
import type { Booking } from '../../../services/bookingService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AdminTableSkeleton } from '../../ui/skeletons/AdminSkeletons';

const statusStylesSelectors = {
  confirmed: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-orange-100 text-orange-700 border-orange-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  checked_in: 'bg-blue-100 text-blue-700 border-blue-200',
  checked_out: 'bg-gray-100 text-gray-700 border-gray-200',
};

const BookingsTable: React.FC = () => {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchRecent = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getAllBookings({ limit: 5 });
      if (res.success) {
        setData(res.data.bookings);
      }
    } catch (error) {
      toast.error('Failed to sync live reservation feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  const filteredBookings = data.filter(b => 
    b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
    (b as any).guest?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    (b as any).guest?.lastName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-[40px] border border-neutral-border/40 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
      <div className="p-10 border-b border-neutral-border/20 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-neutral-light/30">
        <div>
          <h3 className="text-xl font-black text-primary-dark flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 rounded-2xl bg-primary-green/10 flex items-center justify-center text-primary-green">
              <FileText size={20} strokeWidth={3} />
            </div>
            Recent Reservations
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-text-secondary mt-2">Live feed — updated in real time</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-green transition-colors" strokeWidth={3} />
            <input
              type="text"
              placeholder="Search Guest or Folio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-[13px] font-medium outline-none focus:ring-4 focus:ring-primary-green/5 focus:border-primary-green/20 transition-all w-64 shadow-inner"
            />
          </div>
          <button title="Refine results" className="w-12 h-12 flex items-center justify-center border border-gray-100 rounded-2xl text-gray-400 hover:text-primary-green hover:bg-gray-50 transition-all shadow-sm">
            <Filter size={20} strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar flex-1">
        {loading ? (
          <AdminTableSkeleton rows={5} cols={5} bare />
        ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Guest Identity</th>
              <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Accomodation</th>
              <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Folio Number</th>
              <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
              <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Ops</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <AnimatePresence mode="popLayout">
            {filteredBookings.map((b, i) => (
              <motion.tr
                key={b.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="hover:bg-gray-50/50 transition-all group cursor-pointer"
                onClick={() => navigate(`/frontoffice/bookings/${b.id}`)}
              >
                <td className="px-10 py-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-dark text-white flex items-center justify-center text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/10 transition-transform group-hover:scale-110">
                      {(b as any).guest?.firstName?.charAt(0)}{(b as any).guest?.lastName?.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[14px] font-black text-[#111827] uppercase tracking-tight">{(b as any).guest?.firstName} {(b as any).guest?.lastName}</span>
                       <span className="text-[10px] font-medium text-gray-400">{(b as any).guest?.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="flex flex-col">
                     <span className="text-[12px] font-black text-primary-dark uppercase tracking-widest">{(b as any).room?.name}</span>
                     <span className="text-[10px] font-bold text-gray-500 uppercase">Room {(b as any).room?.roomNumber}</span>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <span className="text-[12px] font-black text-primary-gold uppercase tracking-[0.15em]">{b.bookingNumber}</span>
                </td>
                <td className="px-10 py-8">
                   <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 inline-flex items-center gap-2 ${statusStylesSelectors[b.status as keyof typeof statusStylesSelectors] || 'bg-gray-50 text-gray-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${b.status === 'confirmed' ? 'bg-green-500' : b.status === 'pending' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                      {b.status.replace('_', ' ')}
                   </div>
                </td>
                <td className="px-10 py-8 text-right">
                  <button title="View Folio Details" className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-300 hover:text-primary-dark hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100">
                    <ChevronRight size={18} strokeWidth={3} />
                  </button>
                </td>
              </motion.tr>
            ))}
            </AnimatePresence>
          </tbody>
        </table>
        )}
      </div>

      <div className="p-8 bg-gray-50/30 border-t border-gray-50 flex items-center justify-center">
        <button 
           onClick={() => navigate('/frontoffice/bookings')}
           className="text-primary-dark text-[11px] font-black flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-[0.2em] group"
        >
          View Master Folio List <ArrowRight size={14} strokeWidth={3} className="text-primary-gold group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default BookingsTable;
