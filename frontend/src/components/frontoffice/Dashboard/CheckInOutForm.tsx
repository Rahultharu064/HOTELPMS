import React, { useState } from 'react';
import { Activity, ArrowRight, Loader2, Search, BedDouble, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { frontOfficeService } from '../../../services/frontofficeService';
import { toast } from 'react-hot-toast';
import { QuickCheckInModal } from '../QuickCheckInModal';

const CheckInOutForm: React.FC = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) return;
    
    setLoading(true);
    try {
      const res = await frontOfficeService.searchUnified(search, 1);
      if (res.success && res.data.bookings.length > 0) {
        setResult(res.data.bookings[0]);
      } else {
        toast.error('No reservation found for this identity');
        setResult(null);
      }
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 overflow-hidden relative group">
      <div className="mb-10">
        <h3 className="text-xl font-black text-[#111827] flex items-center gap-3 uppercase tracking-tight leading-none">
          <div className="w-10 h-10 rounded-2xl bg-[#14532D]/10 flex items-center justify-center text-[#14532D]">
            <Activity size={20} strokeWidth={3} />
          </div>
          Folio Quick Access
        </h3>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-2">SECURE ARRIVAL VERIFICATION</p>
      </div>

      <form onSubmit={handleSearch} className="space-y-8">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Folio ID or Guest Name</label>
          <div className="relative group/field">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/field:text-[#14532D] transition-colors" strokeWidth={3} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Ledger..."
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] font-medium transition-all outline-none focus:ring-4 focus:ring-[#14532D]/5 focus:border-[#14532D]/20 focus:bg-white shadow-inner"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
        {result ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-3xl bg-gray-50 border border-gray-100 relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-2">
                 <div className={`px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest ${result.status === 'checked_in' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                     {result.status.replace('_', ' ')}
                 </div>
             </div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{result.bookingNumber}</p>
             <h4 className="text-sm font-black text-[#111827] uppercase tracking-tight">{result.guest?.firstName} {result.guest?.lastName}</h4>
             <div className="mt-4 flex items-center gap-4 text-gray-500">
                <div className="flex items-center gap-2">
                    <BedDouble size={14} className="text-[#F59E0B]" />
                    <span className="text-[10px] font-bold uppercase">Room {result.room?.roomNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#14532D]" />
                    <span className="text-[10px] font-bold uppercase">{new Date(result.checkIn).toLocaleDateString()}</span>
                </div>
             </div>
             
             <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full mt-6 py-4 bg-[#111827] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#14532D] transition-all"
             >
                {result.status === 'checked_in' ? 'Manage Settle & Exit' : 'Execute Check-in'}
                <ArrowRight size={14} strokeWidth={3} />
             </button>
          </motion.div>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-[#111827] text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-3xl shadow-xl shadow-black/10 flex items-center justify-center gap-3 transition-all mt-6"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Search Ledger'}
            <ArrowRight size={18} strokeWidth={3} />
          </button>
        )}
        </AnimatePresence>
      </form>

      <QuickCheckInModal 
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} booking={result}
        onSuccess={() => {
            setResult(null);
            setSearch('');
            setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default CheckInOutForm;
