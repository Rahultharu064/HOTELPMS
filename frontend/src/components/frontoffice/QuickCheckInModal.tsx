import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Mail, Phone, MapPin, Upload, Check, Loader2, BedDouble, History, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { toast } from 'react-hot-toast';
import { frontOfficeService } from '../../services/frontofficeService';

interface QuickCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  booking: any;
}

export const QuickCheckInModal: React.FC<QuickCheckInModalProps> = ({ isOpen, onClose, onSuccess, booking }) => {
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [alternativeRooms, setAlternativeRooms] = useState<any[]>([]);
  const [otherActiveBookings, setOtherActiveBookings] = useState<any[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    idType: 'passport',
    idNumber: '',
    idProofImage: ''
  });
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  useEffect(() => {
    if (booking && booking.guest) {
      setFormData({
        firstName: booking.guest.firstName || '',
        lastName: booking.guest.lastName || '',
        email: booking.guest.email || '',
        phone: booking.guest.phone || '',
        address: booking.guest.address || '',
        idType: booking.guest.idType || 'passport',
        idNumber: booking.guest.idNumber || '',
        idProofImage: '' 
      });
      setSelectedRoomId(booking.roomId);
      fetchAlternatives();
      fetchGuestActiveBookings();
    }
  }, [booking, isOpen]);

  const fetchGuestActiveBookings = async () => {
    try {
        const res = await frontOfficeService.getGuestActiveBookings(booking.guestId, booking.id);
        if (res.success) setOtherActiveBookings(res.data);
    } catch (e) {
        console.error("Failed to fetch guest bookings", e);
    }
  };

  const fetchAlternatives = async () => {
    try {
        const res = await frontOfficeService.getAlternativeRooms(booking.id);
        if (res.success) setAlternativeRooms(res.data);
    } catch (error) {
        console.error("Failed to fetch alternative rooms", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'idNumber') setIsVerified(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, idProofImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerify = async () => {
    if (!formData.idNumber || formData.idNumber.length < 3) {
        setVerificationError("Valid Identification Number is required.");
        return;
    }
    
    setVerifying(true);
    try {
        const res = await frontOfficeService.verifyIdentity(booking.id, formData);
        if (res.success) {
            setVerificationError(null);
            setIsVerified(true);
            toast.success("Matched", { 
                icon: '✅',
                style: { borderRadius: '10px', background: '#111827', color: '#fff', fontSize: '11px', fontWeight: 'bold' } 
            });
        }
    } catch (error: any) {
        setIsVerified(false);
        setVerificationError(error.message || "Identity details do not match the booking record.");
        toast.error("Not Matched", { 
            icon: '❌',
            style: { borderRadius: '10px', background: '#ef4444', color: '#fff', fontSize: '11px', fontWeight: 'bold' } 
        });
    } finally {
        setVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, force: boolean = false) => {
    if (e) e.preventDefault();
    
    if (!isVerified && !force) {
        toast.error("Please verify identity validity before check-in.");
        return;
    }

    setSubmitting(true);
    try {
      const res = await frontOfficeService.checkIn(booking.id, { ...formData, forceCheckIn: force }, selectedRoomId || undefined);
      if (res.success) {
        toast.success('Check-in successful!');
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message || 'Check-in failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !booking) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-start justify-center p-4 pt-20 overflow-y-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-[#111827] p-8 text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-500 border border-green-500/20">
                <ShieldCheck size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">Executive Check-in</h3>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Room {booking.room?.roomNumber} • Order #{booking.bookingNumber}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={(e) => handleSubmit(e)} className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-10">
            {/* Guest Summary Banner */}
            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#111827] text-white flex items-center justify-center font-black">
                        {booking.guest?.firstName?.[0]}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Primary Guest</p>
                        <p className="text-base font-black text-[#111827]">{booking.guest?.firstName} {booking.guest?.lastName}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rate Plan</p>
                    <p className="text-sm font-bold text-green-600 font-mono">Rs. {Number(booking.totalAmount).toLocaleString()}</p>
                </div>
            </div>

            {otherActiveBookings.length > 0 && (
                <div className="p-6 rounded-3xl bg-blue-50 border border-blue-100 flex gap-4">
                    <History size={20} strokeWidth={3} className="text-blue-600 mt-1" />
                    <div>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Multi-folio Presence</p>
                        <p className="text-sm font-bold text-blue-800 leading-tight">Guest has {otherActiveBookings.length} other active reservation(s).</p>
                    </div>
                </div>
            )}

            <div className="space-y-8">
              <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100">
                <h4 className="text-sm font-black text-[#111827] uppercase tracking-tight mb-6">Identity Verification</h4>
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ID Type</label>
                        <Select name="idType" value={formData.idType} onChange={handleInputChange as any} className="h-14 rounded-2xl bg-white">
                            <option value="passport">Passport</option>
                            <option value="national_id">National ID</option>
                            <option value="driving_license">Driving License</option>
                            <option value="citizenship">Citizenship Card</option>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ID Number</label>
                        <Input name="idNumber" value={formData.idNumber} onChange={handleInputChange} className="h-14 rounded-2xl bg-white" placeholder="Document ID..." />
                    </div>
                </div>

                <div className="mt-6">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3 block">Document scan/photo</label>
                    <div className="relative w-full h-32 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center bg-white hover:bg-gray-100 transition-all cursor-pointer overflow-hidden group">
                        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        {formData.idProofImage ? (
                            <div className="flex flex-col items-center gap-2 text-green-600">
                                <Check size={24} strokeWidth={3} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Image Secured</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-[#111827]">
                                <Upload size={24} strokeWidth={2.5} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Upload ID Proof</span>
                            </div>
                        )}
                    </div>
                </div>

                {verificationError && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 mt-6">
                        <ShieldAlert size={16} />
                        <p className="text-[11px] font-bold">{verificationError}</p>
                    </div>
                )}

                {!isVerified && (
                    <button 
                        type="button" 
                        disabled={verifying}
                        onClick={handleVerify} 
                        className="w-full mt-6 py-4 bg-[#111827] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#1F7A3A] transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        {verifying ? <Loader2 size={16} className="animate-spin" /> : "Verify Metadata"}
                    </button>
                )}
              </div>

              <div className="space-y-6">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1F7A3A]">Personal Intelligence</h4>
                 <div className="grid grid-cols-2 gap-6">
                    <Input label="Email" name="email" value={formData.email} onChange={handleInputChange} icon={<Mail size={16}/>} className="h-14 rounded-2xl" />
                    <Input label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} icon={<Phone size={16}/>} className="h-14 rounded-2xl" />
                    <div className="col-span-2">
                        <Input label="Address" name="address" value={formData.address} onChange={handleInputChange} icon={<MapPin size={16}/>} className="h-14 rounded-2xl" />
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1F7A3A]">Unit Designation</h4>
                <div className="p-8 rounded-[40px] bg-[#111827] text-white space-y-6 shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <BedDouble size={24} className="text-[#F59E0B]" />
                            <div>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Assigned Unit</p>
                                <p className="text-xl font-black">Room {booking.room?.roomNumber}</p>
                            </div>
                        </div>
                        {alternativeRooms.length > 0 && <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black rounded-full uppercase">{alternativeRooms.length} Swaps Available</span>}
                    </div>

                    {alternativeRooms.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                            <button type="button" onClick={() => setSelectedRoomId(booking.roomId)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedRoomId === booking.roomId ? 'bg-[#F59E0B] text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>Unit {booking.room?.roomNumber}</button>
                            {alternativeRooms.map(r => (
                                <button key={r.id} type="button" onClick={() => setSelectedRoomId(r.id)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedRoomId === r.id ? 'bg-[#1F7A3A] text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>Unit {r.roomNumber}</button>
                            ))}
                        </div>
                    )}
                </div>
              </div>
            </div>

            <div className="pt-6 flex gap-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-16 rounded-[24px] text-gray-400 font-black uppercase tracking-widest text-[11px]">Cancel</Button>
                <Button type="submit" disabled={submitting} className="flex-[2] h-16 bg-[#111827] hover:bg-[#1F7A3A] text-white rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-2xl flex items-center justify-center gap-3">
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} strokeWidth={3} />}
                    Finalize & Check-in
                </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
