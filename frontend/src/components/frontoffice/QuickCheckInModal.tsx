import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, Phone, MapPin, Upload, Check, Loader2, BedDouble, History, ShieldAlert, X, ChevronRight } from 'lucide-react';

import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Modal } from '../ui/Modal';
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
            toast.success("Identity Verified", { 
                icon: '✅',
                style: { borderRadius: '10px', background: '#111827', color: '#fff', fontSize: '11px', fontWeight: 'bold' } 
            });
        }
    } catch (error: any) {
        setIsVerified(false);
        setVerificationError(error.message || "Identity details do not match.");
        toast.error("Verification Failed", { 
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
        toast.error("Please verify identity before check-in.");
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

  if (!booking) return null;

  const guestInitials = formData.firstName ? (formData.firstName[0] + (formData.lastName?.[0] || '')).toUpperCase() : 'G';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Guest Arrival Terminal" size="xl">
      <div className="flex flex-col h-full bg-[#F9FAFB]/60">
        {/* Step Progress */}
        <div className="flex items-center gap-0 border-b border-gray-100 bg-white px-8 py-3 shrink-0">
          {[
            { num: '01', label: 'Identity', done: isVerified },
            { num: '02', label: 'Personal Details', done: isVerified },
            { num: '03', label: 'Room Assignment', done: false },
          ].map((step, i) => (
            <React.Fragment key={step.num}>
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 transition-all
                  ${step.done ? 'bg-[#14532D] text-white shadow-md shadow-[#14532D]/20' : 'bg-gray-100 text-gray-400'}`}>
                  {step.done ? <Check size={13} strokeWidth={3} /> : step.num}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest whitespace-nowrap
                  ${step.done ? 'text-[#14532D]' : 'text-gray-300'}`}>{step.label}</span>
              </div>
              {i < 2 && <ChevronRight size={12} className="mx-3 text-gray-200 shrink-0" />}
            </React.Fragment>
          ))}
          <div className="ml-auto flex items-center gap-2 bg-[#14532D]/5 border border-[#14532D]/10 rounded-xl px-3 py-1.5">
            <ShieldCheck size={11} className="text-[#14532D]" />
            <span className="text-[8px] font-black uppercase tracking-widest text-[#14532D]">Arrival Secure</span>
          </div>
        </div>

        {/* Two-Column Body */}
        <form onSubmit={(e) => handleSubmit(e)} className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden flex-1">
          
          {/* LEFT: Identity & Info (7 cols) */}
          <div className="lg:col-span-7 overflow-y-auto custom-scrollbar border-r border-gray-100 bg-white">
            <div className="pl-6 pr-5 pt-5 pb-5 space-y-6">
              
              {/* Guest Summary */}
              <div className="bg-gray-50/80 rounded-xl border border-gray-100 p-4 flex items-center justify-between group hover:border-[#14532D]/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#111827] text-white flex items-center justify-center font-black text-sm shadow-lg shadow-black/10">
                    {guestInitials}
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Primary Guest</p>
                    <p className="text-[13px] font-black text-[#111827]">{formData.firstName} {formData.lastName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Reservation ID</p>
                  <p className="text-[11px] font-bold text-[#14532D] font-mono tracking-wider">#{booking.bookingNumber}</p>
                </div>
              </div>

              {otherActiveBookings.length > 0 && (
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 flex gap-3">
                  <History size={16} strokeWidth={3} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Guest Alert</p>
                    <p className="text-[11px] font-bold text-blue-800 leading-tight">Guest has {otherActiveBookings.length} other active reservation(s).</p>
                  </div>
                </div>
              )}

              {/* Identity Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-[#14532D] rounded-full" />
                  <h4 className="text-[10px] font-black text-[#111827] uppercase tracking-widest">Identification Verification</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Document Type</label>
                    <Select name="idType" value={formData.idType} onChange={handleInputChange as any} className="h-10 rounded-xl bg-gray-50 border-gray-100 text-[12px] font-bold">
                      <option value="passport">Passport</option>
                      <option value="national_id">National ID</option>
                      <option value="driving_license">Driving License</option>
                      <option value="citizenship">Citizenship Card</option>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Document ID</label>
                    <Input name="idNumber" value={formData.idNumber} onChange={handleInputChange} className="h-10 rounded-xl bg-gray-50 border-gray-100 text-[12px] font-bold" placeholder="Number..." />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Document Evidence</label>
                  <div className="relative w-full h-24 border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 hover:border-[#14532D]/30 transition-all cursor-pointer overflow-hidden group">
                    <Input type="file" variant="outline" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    {formData.idProofImage ? (
                      <div className="flex flex-col items-center gap-1.5 text-emerald-600">
                        <Check size={18} strokeWidth={3} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Image Secured</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-gray-400 group-hover:text-[#111827]">
                        <Upload size={18} strokeWidth={2.5} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Upload Scan</span>
                      </div>
                    )}
                  </div>
                </div>

                {verificationError && (
                  <div className="bg-rose-50 text-rose-600 p-3 rounded-xl flex items-center gap-2.5 border border-rose-100">
                    <ShieldAlert size={14} className="shrink-0" />
                    <p className="text-[10px] font-bold">{verificationError}</p>
                  </div>
                )}

                {!isVerified && (
                  <button 
                    type="button" 
                    disabled={verifying}
                    onClick={handleVerify} 
                    className="w-full h-11 bg-[#111827] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#14532D] transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {verifying ? <Loader2 size={16} className="animate-spin" /> : <><ShieldCheck size={14} /> Verify Metadata</>}
                  </button>
                )}
              </div>

              {/* Personal Details */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-[#14532D] rounded-full" />
                  <h4 className="text-[10px] font-black text-[#111827] uppercase tracking-widest">Personal Intelligence</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Email" name="email" value={formData.email} onChange={handleInputChange} icon={<Mail size={14}/>} className="h-10 rounded-xl bg-gray-50 border-gray-100 text-[11px]" />
                  <Input label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} icon={<Phone size={14}/>} className="h-10 rounded-xl bg-gray-50 border-gray-100 text-[11px]" />
                  <div className="col-span-2">
                    <Input label="Permanent Address" name="address" value={formData.address} onChange={handleInputChange} icon={<MapPin size={14}/>} className="h-10 rounded-xl bg-gray-50 border-gray-100 text-[11px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Unit Assignment (5 cols) */}
          <div className="lg:col-span-5 overflow-y-auto custom-scrollbar bg-[#F9FAFB]/60">
            <div className="pl-5 pr-5 pt-5 pb-5 flex flex-col gap-5 h-full">
              
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">Unit Designation</p>
                <div className="bg-[#111827] rounded-xl p-5 text-white relative overflow-hidden shadow-xl shadow-black/20">
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#F59E0B]/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F59E0B] border border-white/5">
                        <BedDouble size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Assigned Unit</p>
                        <p className="text-xl font-black">Room {booking.room?.roomNumber}</p>
                      </div>
                    </div>
                    
                    {alternativeRooms.length > 0 && (
                      <div className="space-y-3 pt-3 border-t border-white/5">
                        <div className="flex items-center justify-between">
                          <p className="text-[8px] font-black uppercase tracking-widest text-white/30">Available Swaps</p>
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[7px] font-black rounded-md uppercase border border-emerald-500/10">Optimization Ready</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button 
                            type="button" 
                            onClick={() => setSelectedRoomId(booking.roomId)} 
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all 
                              ${selectedRoomId === booking.roomId ? 'bg-[#F59E0B] text-white shadow-lg shadow-[#F59E0B]/20' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
                            Unit {booking.room?.roomNumber}
                          </button>
                          {alternativeRooms.map(r => (
                            <button 
                              key={r.id} 
                              type="button" 
                              onClick={() => setSelectedRoomId(r.id)} 
                              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all 
                                ${selectedRoomId === r.id ? 'bg-[#1F7A3A] text-white shadow-lg shadow-[#1F7A3A]/20' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
                              Unit {r.roomNumber}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="mt-auto pt-4 border-t border-gray-100 space-y-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Identity Status</span>
                    {isVerified ? (
                      <span className="text-emerald-500 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest">
                        <Check size={12} strokeWidth={3} /> Reconciled
                      </span>
                    ) : (
                      <span className="text-rose-500 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest">
                        <X size={12} strokeWidth={3} /> Pending
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Final Rate Plan</span>
                    <span className="text-[12px] font-black text-[#111827]">Rs. {Number(booking.totalAmount).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 h-11 rounded-xl font-black uppercase tracking-[0.3em] text-[9px] text-gray-400 bg-gray-50 hover:bg-gray-100 transition-all border border-gray-100"
                  >
                    Hold
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-[2] h-11 bg-[#111827] hover:bg-[#14532D] text-white rounded-xl font-black uppercase tracking-[0.35em] text-[10px] shadow-lg shadow-black/10 flex items-center justify-center gap-2.5 transition-all disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={16} /> : <><Check size={16} strokeWidth={3} /> Finalize Check-in</>}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <div className="h-[1px] w-6 bg-gray-100" />
                  <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em]">Protocol L3 · Arrival Node</p>
                  <div className="h-[1px] w-6 bg-gray-100" />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};
