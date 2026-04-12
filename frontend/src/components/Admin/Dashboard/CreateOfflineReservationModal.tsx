import React, { useState, useEffect } from 'react';
import { Input } from '../../ui/Input';
import { 
  X, User, Mail, Phone, Calendar, 
  ShieldCheck, Upload, Check, Loader2, Hash,
  MapPin, CheckCircle2, BedDouble
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { OfflineReservationData } from '../../../services/offlineReservationService';
import { offlineReservationService } from '../../../services/offlineReservationService';
import type { Room } from '../../../services/roomService';
import { roomService } from '../../../services/roomService';
import { toast } from 'react-hot-toast';
import { Button } from '../../ui/Button';

interface CreateOfflineReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ID_TYPES = [
  { value: 'national_id', label: 'National ID' },
  { value: 'passport', label: 'Passport' },
  { value: 'driving_license', label: 'Driving License' },
  { value: 'citizenship', label: 'Citizenship Card' },
  { value: 'other', label: 'Other' }
];

export const CreateOfflineReservationModal: React.FC<CreateOfflineReservationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Nepal',
    idType: 'national_id',
    idNumber: '',
    idProofImage: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    specialRequests: '',
    paymentAmount: '',
    paymentMethod: 'cash' as 'cash' | 'esewa' | 'khalti'
  });

  useEffect(() => {
    if (isOpen) {
      const fetchRooms = async () => {
        try {
          const res = await roomService.getAllRooms();
          if (res.success) {
            setRooms(res.data.filter((r: Room) => r.status === 'available'));
          }
        } catch (error) {
          toast.error('Failed to fetch available rooms');
        }
      };
      fetchRooms();
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, idProofImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.roomId || !formData.checkIn || !formData.checkOut) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const payload: OfflineReservationData = {
        newGuestDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          idType: formData.idType as any,
          idNumber: formData.idNumber,
          idProofImage: formData.idProofImage
        },
        roomId: Number(formData.roomId),
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        adults: formData.adults,
        children: formData.children,
        specialRequests: formData.specialRequests,
        payment: {
          amount: Number(formData.paymentAmount) || 0,
          method: formData.paymentMethod,
        }
      };

      const res = await offlineReservationService.createOfflineReservation(payload);
      if (res.success) {
        toast.success('Offline Reservation created successfully!');
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create reservation');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-primary-dark/40 backdrop-blur-md" 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Sidebar Info */}
        <div className="w-full md:w-80 bg-neutral-light p-10 flex flex-col justify-between border-r border-neutral-border/20">
          <div>
            <div className="h-16 w-16 rounded-3xl bg-[#14532D] text-white flex items-center justify-center mb-8 shadow-xl shadow-[#14532D]/20">
              <Calendar size={32} />
            </div>
            <h2 className="text-3xl font-black text-primary-dark tracking-tight leading-tight mb-4 uppercase">Walk-in Registry</h2>
            <p className="text-xs font-bold text-neutral-text-secondary uppercase tracking-widest leading-relaxed">Official internal reservation management for onsite arrivals.</p>
            
            <div className="mt-12 space-y-6">
              {[
                { step: 1, label: 'Guest Profiling', icon: User },
                { step: 2, label: 'Room & Dates', icon: BedDouble },
                { step: 3, label: 'Security & Assets', icon: ShieldCheck }
              ].map((s) => (
                <div key={s.step} className={`flex items-center gap-4 transition-all duration-300 ${step >= s.step ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-black ${step === s.step ? 'bg-[#14532D] text-white shadow-lg' : 'bg-white text-gray-400'}`}>
                    <s.icon size={18} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${step === s.step ? 'text-[#111827]' : 'text-gray-400'}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Button onClick={onClose} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors">
            <X size={14} strokeWidth={3} /> Abort Operation
          </Button>
        </div>

        {/* Form Area */}
        <div className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-white">
          <form onSubmit={handleSubmit} className="space-y-10">
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name *</label>
                    <input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none text-sm font-bold focus:ring-2 focus:ring-[#14532D] transition-all" placeholder="Rajesh" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name *</label>
                    <input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none text-sm font-bold focus:ring-2 focus:ring-[#14532D] transition-all" placeholder="Sharma" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Mail size={12} /> Email *</label>
                    <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none text-sm font-bold focus:ring-2 focus:ring-[#14532D] transition-all" placeholder="rajesh@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Phone size={12} /> Phone *</label>
                    <input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none text-sm font-bold focus:ring-2 focus:ring-[#14532D] transition-all" placeholder="98XXXXXXXX" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="address" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><MapPin size={12} /> Full Address</label>
                    <input id="address" name="address" value={formData.address} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none text-sm font-bold focus:ring-2 focus:ring-[#14532D] transition-all" placeholder="Koteshwor, Kathmandu" />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={() => setStep(2)} type="button" className="bg-[#111827] hover:bg-[#14532D] text-white px-10 h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl">
                    Configure Occupancy
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="roomId" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Hash size={12} /> Select Available Room *</label>
                    <select id="roomId" title="Room Selection" name="roomId" value={formData.roomId} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none text-sm font-bold focus:ring-2 focus:ring-[#14532D] transition-all appearance-none">
                      <option value="">Choose a room...</option>
                      {rooms.map(r => (
                        <option key={r.id} value={r.id}>Room {r.roomNumber} - {r.roomType?.name} (Rs. {Number(r.basePrice)})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="checkIn" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Check-In Date *</label>
                    <input id="checkIn" title="Check-In" type="date" name="checkIn" value={formData.checkIn} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none text-sm font-bold focus:ring-2 focus:ring-[#14532D] transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="checkOut" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Check-Out Date *</label>
                    <input id="checkOut" title="Check-Out" type="date" name="checkOut" value={formData.checkOut} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none text-sm font-bold focus:ring-2 focus:ring-[#14532D] transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="adults" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Adults</label>
                    <input id="adults" title="Adults" type="number" name="adults" min="1" value={formData.adults} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none text-sm font-bold focus:ring-2 focus:ring-[#14532D] transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="children" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Children</label>
                    <input id="children" title="Children" type="number" name="children" min="0" value={formData.children} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none text-sm font-bold focus:ring-2 focus:ring-[#14532D] transition-all" />
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <Button onClick={() => setStep(1)} type="button" variant="outline" className="h-14 px-8 rounded-2xl border-gray-200 text-gray-400 font-black uppercase tracking-widest text-[11px]">
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} type="button" className="bg-[#111827] hover:bg-[#14532D] text-white px-10 h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl">
                    Security & Verification
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="p-8 bg-[#14532D]/5 rounded-3xl border border-[#14532D]/10 space-y-8">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="idType" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Government ID Type</label>
                      <select id="idType" title="ID Type" name="idType" value={formData.idType} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl bg-white border border-gray-100 text-sm font-bold focus:ring-2 focus:ring-[#14532D] transition-all appearance-none">
                        {ID_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="idNumber" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ID Number</label>
                      <input id="idNumber" title="ID Number" name="idNumber" value={formData.idNumber} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl bg-white border border-gray-100 text-sm font-bold focus:ring-2 focus:ring-[#14532D] transition-all" placeholder="NID-XXXX-XXXX" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Physical ID Proof Scan</label>
                      <div className="relative w-full h-32 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-all cursor-pointer overflow-hidden border-[#14532D]/20">
                        <Input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        {formData.idProofImage ? (
                          <div className="flex flex-col items-center gap-2 text-[#14532D]">
                            <div className="h-10 w-10 rounded-full bg-[#14532D]/10 flex items-center justify-center"><Check size={20} /></div>
                            <span className="text-[11px] font-black uppercase tracking-widest">Document Secured</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-gray-400">
                            <Upload size={24} />
                            <span className="text-[11px] font-black uppercase tracking-widest">Scan and Upload Identity</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="paymentAmount" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Deposit Amount (Rs.)</label>
                    <input id="paymentAmount" title="Payment Amount" type="number" name="paymentAmount" value={formData.paymentAmount} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none text-sm font-bold focus:ring-2 focus:ring-[#14532D] transition-all" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="paymentMethod" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Method</label>
                    <select id="paymentMethod" title="Payment Method" name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-none text-sm font-bold focus:ring-2 focus:ring-[#14532D] transition-all">
                      <option value="cash">Onside Cash</option>
                      <option value="esewa">Digital eSewa</option>
                      <option value="khalti">Digital Khalti</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button onClick={() => setStep(2)} type="button" variant="outline" className="h-14 px-8 rounded-2xl border-gray-200 text-gray-400 font-black uppercase tracking-widest text-[11px]">
                    Back
                  </Button>
                  <Button disabled={submitting} type="submit" className="bg-[#14532D] hover:bg-[#0C2012] text-white px-12 h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-[#14532D]/30 flex items-center gap-3">
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                    {submitting ? 'Securing Base...' : 'Finalize Reservation'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
};
