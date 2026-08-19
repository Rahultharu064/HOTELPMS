import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Users, ShieldCheck } from 'lucide-react';
import { Button } from '../../ui/Button';
import { guestService } from '../../../services/guestService';
import type { Guest } from '../../../services/guestService';

const AVATAR_GRADIENTS = [
  'from-orange-400 to-[#F59E0B]',
  'from-[#1F7A3A] to-[#14532D]',
  'from-[#3B82F6] to-blue-800',
];

const GuestManagement: React.FC = () => {
  const navigate = useNavigate();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    guestService
      .getAllGuests({ limit: 3, sort: '-createdAt' })
      .then((res) => {
        if (!cancelled && res.success) setGuests(res.data.guests);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] p-6 lg:p-7 relative overflow-hidden flex flex-col h-full">
      {/* Decorative Blob */}
      <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-[#F59E0B]/[0.02] blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-7 relative z-10">
        <div>
          <h3 className="text-[15px] font-extrabold text-[#111827] flex items-center gap-2 mb-1">
            <Users size={18} className="text-[#F59E0B]" />
            Guest Activity
          </h3>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-6">Recent profiles</p>
        </div>
        <Button
          onClick={() => navigate('/frontoffice/guests')}
          title="View all guests"
          className="p-2 rounded-xl text-gray-400 bg-gray-50 border border-gray-100 hover:text-[#111827] hover:bg-white shadow-sm transition-colors cursor-pointer group"
        >
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>

      {/* Guest list */}
      <div className="space-y-4 relative z-10 flex-1">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[76px] rounded-[16px] bg-gray-50 animate-pulse" />
          ))
        ) : guests.length > 0 ? (
          guests.map((guest, idx) => {
            const isVip = (guest.totalBookings ?? 0) >= 5;
            return (
              <button
                key={guest.id}
                type="button"
                onClick={() => navigate('/frontoffice/guests')}
                className="w-full flex items-center gap-4 p-4 rounded-[16px] border border-gray-100 bg-white hover:border-[#1F7A3A]/20 hover:bg-gray-50/50 shadow-sm transition-all group text-left"
              >
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-[14px] bg-gradient-to-br ${AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]} text-white flex items-center justify-center text-[13px] font-black shadow-inner shadow-white/20 shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                  {guest.firstName[0]}{guest.lastName[0]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-[#111827] truncate group-hover:text-[#1F7A3A] transition-colors">{guest.firstName} {guest.lastName}</p>
                  <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                    {isVip ? (
                      <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-md">
                        <ShieldCheck size={10} />
                        VIP
                      </span>
                    ) : (
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
                        Regular
                      </span>
                    )}

                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{guest.totalBookings ?? 0} <span className="text-gray-300">Stays</span></span>
                    {guest.totalSpent !== undefined && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-md">
                        <Star size={10} className="fill-[#F59E0B] text-[#F59E0B]" />
                        Rs. {Number(guest.totalSpent).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <p className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest py-10">No guests yet</p>
        )}
      </div>
    </div>
  );
};

export default GuestManagement;
