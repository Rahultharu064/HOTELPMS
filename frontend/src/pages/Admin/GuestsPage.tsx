import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical,
  Mail,
  Phone,
  Globe,
  Loader2,
  Hotel,
  TrendingUp,
  CreditCard,
  Plus,
  ShieldCheck,
  Eye,
  ShieldAlert,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { guestService } from '../../services/guestService';
import { toast } from 'react-hot-toast';

export default function AdminGuestsPage() {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const res = await guestService.getAllGuests({ search: searchQuery });
      if (res.success) {
        setGuests(res.data.guests);
      }
    } catch (error) {
      toast.error('Failed to fetch guests record');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchGuests, searchQuery ? 500 : 0);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-black text-primary-dark tracking-tight uppercase">Legacy Patron Register</h1>
          <p className="text-[11px] font-black text-neutral-text-secondary uppercase tracking-[0.2em] mt-2">Historical guest intelligence & relationship management</p>
        </div>
        <button className="h-14 px-8 bg-primary-dark text-white rounded-2xl flex items-center gap-3 text-[11px] font-black uppercase tracking-widest hover:bg-primary-green transition-all shadow-2xl shadow-primary-dark/10">
           <Plus size={18} strokeWidth={3} /> Register New Patron
        </button>
      </div>

      {/* Analytics Overlays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {[
           { label: 'Total Registered', value: guests.length.toString(), icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
           { label: 'High-Value Patrons', value: guests.filter(g => Number(g.totalSpent) > 50000).length.toString(), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'Global Reach', value: new Set(guests.map(g => g.country)).size.toString() + ' Nations', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' }
         ].map((stat, i) => (
           <div key={i} className="p-8 bg-white border border-neutral-border/40 rounded-[40px] shadow-sm flex items-center justify-between group hover:border-primary-green/30 transition-all duration-500">
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-black uppercase tracking-widest text-neutral-text-secondary">{stat.label}</span>
                 <span className="text-3xl font-black text-primary-dark group-hover:text-primary-green transition-colors">{stat.value}</span>
              </div>
              <div className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                 <stat.icon size={28} />
              </div>
           </div>
         ))}
      </div>

      {/* Control Surface */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-text-secondary group-focus-within:text-primary-green transition-colors" size={20} />
          <input 
            placeholder="Identify patron by name, digital mail, or contact signal..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-6 h-16 bg-white border border-neutral-border/50 rounded-3xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-green/5 focus:border-primary-green transition-all shadow-sm"
          />
        </div>
        <button title="Apply Fine Filters" className="h-16 px-8 bg-white border border-neutral-border/50 rounded-3xl flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-neutral-text-secondary hover:bg-neutral-light transition-all shadow-sm">
           <Filter size={20} /> Filter Catalog
        </button>
      </div>

      {/* Patron Table */}
      <div className="bg-white rounded-[56px] border border-neutral-border/40 shadow-soft overflow-hidden">
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-4">
             <Loader2 className="h-12 w-12 text-primary-green animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-text-secondary animate-pulse">Accessing archives...</p>
          </div>
        ) : guests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-light/50">
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-text-secondary">Identity Profile</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-text-secondary">Verification</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-text-secondary">Contact Channels</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-text-secondary">Historical Frequency</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-text-secondary">Contribution</th>
                  <th className="px-10 py-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border/10">
                {guests.map((guest, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    key={guest.id} 
                    className="group hover:bg-neutral-light/30 transition-all cursor-pointer"
                  >
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-5">
                          <div className="h-12 w-12 rounded-2xl bg-neutral-light text-primary-dark group-hover:bg-primary-green group-hover:text-white flex items-center justify-center font-black text-[13px] shadow-sm transition-all duration-300">
                             {guest.firstName?.[0]}{guest.lastName?.[0]}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[14px] font-black text-primary-dark">{guest.firstName} {guest.lastName}</span>
                             <span className="text-[10px] font-bold text-neutral-text-secondary uppercase tracking-widest mt-0.5">ID: {guest.idNumber || '#N/A'}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                        {guest.idProofImage ? (
                           <div className="flex flex-col gap-1">
                              <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                 <ShieldCheck size={12} strokeWidth={3} /> Verified
                              </span>
                              <button 
                                 onClick={() => { setSelectedGuest(guest); setIsDocModalOpen(true); }}
                                 className="flex items-center gap-1.5 text-[9px] font-black text-primary-gold uppercase tracking-widest hover:underline"
                              >
                                 <Eye size={10} /> View Credentials
                              </button>
                           </div>
                        ) : (
                           <span className="flex items-center gap-1.5 text-[10px] font-black text-amber-500 uppercase tracking-widest">
                              <ShieldAlert size={12} strokeWidth={3} /> Unverified
                           </span>
                        )}
                     </td>
                    <td className="px-10 py-8">
                       <div className="flex flex-col gap-2">
                          <span className="flex items-center gap-2 text-[11px] font-black text-primary-dark">
                             <Mail size={12} className="text-primary-gold" /> {guest.email}
                          </span>
                          <span className="flex items-center gap-2 text-[11px] font-bold text-neutral-text-secondary">
                             <Phone size={12} className="text-primary-green" /> {guest.phone}
                          </span>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                             <span className="text-[14px] font-black text-primary-dark flex items-center gap-1.5 leading-none">
                                {guest.totalBookings || 0} <Hotel size={12} className="text-neutral-text-secondary" />
                             </span>
                             <span className="text-[9px] font-black text-neutral-text-secondary uppercase tracking-[0.2em] mt-1.5">Successful Stays</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-2 text-[14px] font-black text-emerald-600 tracking-tight">
                          <CreditCard size={14} />
                          Rs. {Number(guest.totalSpent || 0).toLocaleString()}
                       </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <button title="Patron Actions" className="p-3 rounded-xl hover:bg-white text-neutral-text-secondary hover:text-primary-dark transition-all border border-transparent hover:border-neutral-border/30">
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
                <Users size={48} />
             </div>
             <div className="text-center">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-neutral-text-secondary">Patron Catalog Vacant</p>
                <p className="text-sm font-bold text-neutral-text-secondary/60 mt-2">Global reconnaissance complete. No matching identities detected.</p>
             </div>
          </div>
        )}
      </div>

      <AnimatePresence>
         {isDocModalOpen && selectedGuest && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsDocModalOpen(false)}
                  className="absolute inset-0 bg-primary-dark/60 backdrop-blur-md" 
               />
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
               >
                  <div className="p-8 border-b border-neutral-border/20 flex items-center justify-between bg-neutral-light/30">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                           <ShieldCheck size={20} strokeWidth={3} />
                        </div>
                        <div>
                           <h3 className="text-lg font-black text-primary-dark tracking-tight uppercase">Identity Verification</h3>
                           <p className="text-[10px] font-bold text-neutral-text-secondary uppercase tracking-widest">{selectedGuest.firstName} {selectedGuest.lastName} • {selectedGuest.idType?.replace('_', ' ')}: {selectedGuest.idNumber}</p>
                        </div>
                     </div>
                     <button 
                        onClick={() => setIsDocModalOpen(false)}
                        title="Close Verification View"
                        className="h-10 w-10 rounded-xl bg-white border border-neutral-border/40 flex items-center justify-center text-neutral-text-secondary hover:text-red-500 transition-colors shadow-sm"
                     >
                        <X size={18} strokeWidth={3} />
                     </button>
                  </div>
                  <div className="p-10 flex items-center justify-center bg-white min-h-[400px]">
                     <img 
                        src={`/api/guests/${selectedGuest.id}/document`} 
                        alt="Guest ID Proof" 
                        onLoad={() => setImgLoaded(true)}
                        onError={(e) => {
                           e.currentTarget.src = 'https://placehold.co/600x400?text=Decryption+Failed+or+Unauthorized';
                        }}
                        className={`max-h-[500px] w-auto rounded-2xl shadow-xl border border-neutral-border/20 transition-opacity duration-1000 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`} 
                     />
                  </div>
                  <div className="p-8 bg-neutral-light/20 border-t border-neutral-border/10 flex justify-between items-center">
                     <p className="text-[10px] font-bold text-neutral-text-secondary uppercase tracking-widest max-w-[300px]">
                        This document is AES-256-GCM encrypted. Authorization is required for live delivery.
                     </p>
                     <button 
                        onClick={() => setIsDocModalOpen(false)}
                        className="px-8 h-12 bg-primary-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#14532D] transition-all shadow-lg"
                     >
                        Secure Close
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
