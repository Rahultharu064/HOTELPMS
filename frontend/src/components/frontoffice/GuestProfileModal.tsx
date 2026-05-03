import React, { useState } from 'react';
import { 
  X, Mail, Phone, MapPin, ShieldCheck, 
  Globe, Calendar, CreditCard, ShieldAlert, 
  ExternalLink, Download, User, Info, 
  Eye, CheckCircle2, AlertCircle, Clock
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import type { Guest } from '../../services/guestService';

interface GuestProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: Guest | null;
}

export const GuestProfileModal: React.FC<GuestProfileModalProps> = ({ isOpen, onClose, guest }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'history'>('profile');
  const [imgLoaded, setImgLoaded] = useState(false);

  if (!guest) return null;

  const initials = (guest.firstName?.[0] || '') + (guest.lastName?.[0] || '');
  const fullName = `${guest.firstName} ${guest.lastName}`;

  // Guest Tier style
  const isVip = (guest.totalBookings || 0) > 5;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Guest Profile" 
      size="xl"
    >
      <div className="flex flex-col h-full max-h-[85vh]">
        {/* Profile Header */}
        <div className="p-8 bg-gradient-to-br from-[#1F7A3A]/5 via-white to-white border-b border-gray-100">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className={`w-28 h-28 rounded-[40px] flex items-center justify-center text-3xl font-black shadow-2xl relative ${isVip ? 'bg-gradient-to-br from-[#F59E0B] to-orange-500 text-white' : 'bg-[#111827] text-white'}`}>
              {initials}
              <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-white border-4 border-[#F9FAFB] flex items-center justify-center text-[#1F7A3A] shadow-lg">
                <CheckCircle2 size={18} strokeWidth={3} />
              </div>
            </div>

            <div className="text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h2 className="text-3xl font-black text-[#111827] tracking-tight">{fullName}</h2>
                <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${isVip ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                  {isVip ? 'VIP Guest' : 'Regular Guest'}
                </span>
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center justify-center md:justify-start gap-2">
                <Info size={12} className="text-[#1F7A3A]" /> Guest ID: {guest.id.toString().padStart(4, '0')} • Joined {new Date(guest.createdAt || '').getFullYear() || '2026'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-8 pt-4 border-b border-gray-50 overflow-x-auto no-scrollbar">
          {[
            { id: 'profile', label: 'General Info', icon: User },
            { id: 'documents', label: 'Identity Documents', icon: ShieldCheck },
            { id: 'history', label: 'Booking History', icon: CreditCard }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${
                activeTab === tab.id 
                  ? 'border-[#1F7A3A] text-[#1F7A3A]' 
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon size={14} strokeWidth={3} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gray-50/30">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Contact Info */}
                  <div className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={14} className="text-[#1F7A3A]" /> Contact Info
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400"><Mail size={16} /></div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                          <p className="text-sm font-bold text-[#111827]">{guest.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400"><Phone size={16} /></div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                          <p className="text-sm font-bold text-[#111827]">{guest.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Info */}
                  <div className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Globe size={14} className="text-[#1F7A3A]" /> Address Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400"><MapPin size={16} /></div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Address</p>
                          <p className="text-sm font-bold text-[#111827]">{guest.address || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400"><Globe size={16} /></div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Country / City</p>
                          <p className="text-sm font-bold text-[#111827]">{guest.city}, {guest.country}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-[#111827] rounded-[32px] text-white overflow-hidden relative">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                   <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6">Guest Notes</h3>
                   <p className="text-sm font-medium leading-relaxed italic opacity-80">
                     No special notes for this guest. 
                   </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'documents' && (
              <motion.div 
                key="documents"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                      <ShieldCheck size={28} strokeWidth={3} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#111827] tracking-tight uppercase">{guest.idType?.replace('_', ' ')} Verified</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">ID Number: {guest.idNumber}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-3 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-[#111827] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                    <Download size={14} /> Download Image
                  </button>
                </div>

                <div className="relative aspect-[16/9] w-full rounded-[40px] overflow-hidden border-4 border-white shadow-2xl bg-gray-100 group">
                  {guest.idProofImage ? (
                    <>
                      <img 
                        src={`/api/guests/${guest.id}/document`} 
                        alt="ID Proof" 
                        onLoad={() => setImgLoaded(true)}
                        className={`w-full h-full object-cover transition-opacity duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                      />
                      {!imgLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                           <Clock className="animate-spin text-gray-300" size={32} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button className="h-14 w-14 rounded-full bg-white text-[#111827] flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                            <Eye size={24} />
                         </button>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-gray-400">
                      <ShieldAlert size={48} strokeWidth={1.5} />
                      <p className="text-[11px] font-black uppercase tracking-widest">No ID Proof Uploaded</p>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-4 p-6 bg-amber-50 rounded-2xl border border-amber-100">
                  <AlertCircle size={20} className="text-amber-500 shrink-0" />
                  <p className="text-[11px] font-bold text-amber-800 leading-relaxed uppercase tracking-wide">
                    Note: This document is for internal use only. Handle with care.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div 
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                   {[
                     { label: 'Total Stays', value: guest.totalBookings || 0, icon: Globe },
                     { label: 'Total Spent', value: `Rs.${(Number(guest.totalSpent) || 0).toLocaleString()}`, icon: CreditCard },
                     { label: 'Average Spend', value: `Rs.${((Number(guest.totalSpent) || 0) / (guest.totalBookings || 1)).toLocaleString()}`, icon: TrendingUp },
                     { label: 'Check-in Rate', value: '100%', icon: CheckCircle2 },
                   ].map((stat, i) => (
                     <div key={i} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                        <p className="text-lg font-black text-[#111827] tracking-tight">{stat.value}</p>
                     </div>
                   ))}
                </div>

                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                   <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                      <h3 className="text-[11px] font-black text-[#111827] uppercase tracking-widest">Recent Bookings</h3>
                      <button className="text-[10px] font-black text-[#1F7A3A] uppercase tracking-widest flex items-center gap-1">
                        View More <ExternalLink size={12} />
                      </button>
                   </div>
                   <div className="divide-y divide-gray-50">
                      {[
                        { id: 'BK-1082', room: '204', date: 'Oct 12, 2025', amount: 'Rs.12,500', status: 'Completed' },
                        { id: 'BK-0941', room: '105', date: 'Aug 24, 2025', amount: 'Rs.8,000', status: 'Completed' },
                      ].map((bk) => (
                        <div key={bk.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-[#111827] text-xs font-black">{bk.room}</div>
                              <div>
                                 <p className="text-[13px] font-black text-[#111827]">{bk.id}</p>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{bk.date}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-sm font-black text-[#1F7A3A]">{bk.amount}</p>
                              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{bk.status}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-gray-100 flex items-center justify-between bg-white">
           <button 
             onClick={onClose}
             className="px-8 h-14 rounded-2xl bg-gray-100 text-[#111827] text-[11px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
           >
             Close
           </button>
           <div className="flex items-center gap-3">
             <button className="px-8 h-14 rounded-2xl border-2 border-gray-100 text-[#111827] text-[11px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2">
                <Calendar size={16} /> Add to VIP
             </button>
             <button className="px-8 h-14 rounded-2xl bg-[#1F7A3A] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#14532D] transition-all shadow-xl shadow-[#1F7A3A]/20 flex items-center gap-2">
                Save Changes <ShieldCheck size={16} />
             </button>
           </div>
        </div>
      </div>
    </Modal>
  );
};

const TrendingUp = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
