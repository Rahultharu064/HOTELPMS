import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/Button";
import { Check, Download, Calendar, Users, CreditCard, ShieldCheck, Mail, Phone, Globe, MessageSquare, Info, Upload } from "lucide-react";
import { BookingPageSkeleton } from "../../components/ui/skeletons/PageSkeletons";
import { roomService } from "../../services/roomService";
import { bookingService } from "../../services/bookingService";
import { paymentService } from "../../services/paymentService";
import type { Room } from "../../services/roomService";
import { toast } from "react-hot-toast";

const steps = ["Guest Details", "Stay Details", "Payment", "Confirmation"];

const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

import { getImageUrl } from "../../services/api";


export const BookingsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomParam = searchParams.get('room');
  
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: 'Nepal',
    idType: 'national_id',
    idNumber: '',
    idProofImage: '',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    specialRequests: '',
    paymentMethod: 'esewa' as 'esewa' | 'khalti' | 'cash'
  });

  // Calculate nights and prices
  const calculation = useMemo(() => {
    if (!selectedRoom || !formData.checkIn || !formData.checkOut) return { nights: 1, roomTotal: 0, tax: 0, serviceFee: 0, grandTotal: 0 };
    
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const diff = end.getTime() - start.getTime();
    const nights = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    
    const basePrice = Number(selectedRoom.basePrice);
    const roomTotal = basePrice * nights;
    const serviceFee = Math.round(roomTotal * 0.1);
    const tax = Math.round(roomTotal * 0.13);
    const grandTotal = roomTotal + serviceFee + tax;
    
    return { nights, roomTotal, tax, serviceFee, grandTotal };
  }, [selectedRoom, formData.checkIn, formData.checkOut]);

  useEffect(() => {
    const fetchRoom = async () => {
      if (roomParam) {
        try {
          setLoadingRoom(true);
          const res = await roomService.getRoomById(Number(roomParam));
          if (res.success) {
            setSelectedRoom(res.data);
          }
        } catch (error) {
          toast.error("Failed to load room details");
        } finally {
          setLoadingRoom(false);
        }
      } else {
        setLoadingRoom(false);
      }
    };
    fetchRoom();
  }, [roomParam]);

  useEffect(() => {
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    if (checkIn || checkOut) {
      setFormData(prev => ({
        ...prev,
        checkIn: checkIn || prev.checkIn,
        checkOut: checkOut || prev.checkOut
      }));
    }
  }, [searchParams]);

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

  const validateStep = () => {
    if (step === 0) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        toast.error("Please fill in all traveler details");
        return false;
      }
      if (!formData.idType || !formData.idNumber) {
         toast.error("Government ID details are required for security");
         return false;
      }
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        toast.error("Please enter a valid email");
        return false;
      }
    } else if (step === 1) {
      if (!formData.checkIn || !formData.checkOut) {
        toast.error("Please select stay dates");
        return false;
      }
      const start = new Date(formData.checkIn);
      const end = new Date(formData.checkOut);
      if (start < new Date(new Date().setHours(0,0,0,0))) {
        toast.error("Check-in cannot be in the past");
        return false;
      }
      if (end <= start) {
        toast.error("Check-out must be after check-in");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(s => Math.min(s + 1, 3));
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => setStep(s => Math.max(s - 1, 0));

  const handleConfirmBooking = async () => {
    if (!selectedRoom) return;
    
    try {
      setIsSubmitting(true);
      const payload = {
        guestDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          nationality: formData.nationality,
          idType: formData.idType,
          idNumber: formData.idNumber,
          idProofImage: formData.idProofImage,
        },
        roomId: selectedRoom.id,
        checkIn: new Date(formData.checkIn).toISOString(),
        checkOut: new Date(formData.checkOut).toISOString(),
        adults: Number(formData.adults),
        children: Number(formData.children),
        specialRequests: formData.specialRequests,
        payment: {
          amount: calculation.grandTotal,
          method: formData.paymentMethod,
          transactionId: formData.paymentMethod === 'cash' ? "CASH-" + Date.now() : undefined
        }
      };

      const res = await bookingService.createBooking(payload);
      if (res.success) {
        const booking = res.data;
        
        // Handle Online Payment Initiation
        if (formData.paymentMethod === 'esewa' || formData.paymentMethod === 'khalti') {
          try {
             toast.loading(`Initiating ${formData.paymentMethod} Payment...`, { id: 'payment-progress' });
             const paymentRes = await paymentService.initiatePayment({
               bookingId: booking.id,
               amount: calculation.grandTotal,
               method: formData.paymentMethod,
               returnUrl: window.location.origin
             });

             if (paymentRes.success) {
                const { method, paymentPayload } = paymentRes.data;

                if (method === 'esewa') {
                   // Redirect to eSewa
                   toast.success("Redirecting to eSewa...", { id: 'payment-progress' });
                   
                    const form = document.createElement("form");
                    form.setAttribute("method", "POST");
                    form.setAttribute("action", paymentPayload.url);

                    for (const key in paymentPayload) {
                      if (key !== 'url') {
                        const input = document.createElement("input");
                        input.setAttribute("type", "hidden");
                        input.setAttribute("name", key);
                        input.setAttribute("value", paymentPayload[key]);
                        form.appendChild(input);
                      }
                    }

                    document.body.appendChild(form);
                    form.submit();
                    return; // Stop here as we are redirecting
                } else if (method === 'khalti') {
                   toast.success("Redirecting to Khalti Secure Checkout...", { id: 'payment-progress' });
                   window.location.href = paymentPayload.url;
                   return;
                }
             }
          } catch (pErr) {
             toast.error("Payment initiation failed, but booking created as pending. Contact front desk.", { id: 'payment-progress' });
             setBookingResult(booking);
             setStep(3);
          }
        } else {
          setBookingResult(booking);
          setStep(3);
          toast.success("Booking confirmed successfully!");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Booking failed. Please check availability and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingRoom) {
    return <BookingPageSkeleton />;
  }

  if (!selectedRoom && !roomParam) {
     return (
       <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-neutral-light p-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
             <Info className="h-10 w-10 text-primary-gold" />
          </div>
          <div className="text-center max-w-sm">
             <h2 className="text-2xl font-black text-primary-dark mb-2">No Room Selected</h2>
             <p className="text-neutral-text-secondary font-medium mb-8">Please choose a room from our collection before proceeding to booking.</p>
             <Button variant="primary" className="w-full h-14 rounded-2xl shadow-xl" asChild>
                <Link to="/rooms">Browse Our Rooms</Link>
             </Button>
          </div>
       </div>
     );
  }

  return (
    <main className="bg-neutral-light min-h-screen pb-24">
      {/* Premium Header */}
      <div className="pt-16 pb-16 lg:pt-24 lg:pb-24 relative overflow-hidden bg-white border-b border-neutral-border">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-green/5 to-transparent pointer-events-none" />
        <div className="container-custom relative z-10">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-primary-gold font-bold text-xs uppercase tracking-[0.2em] block mb-4"
          >
            Book a room
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-primary-dark tracking-tight"
          >
            Complete your <span className="text-primary-green">booking</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-text-secondary mt-4 font-medium max-w-xl text-base leading-relaxed"
          >
            Enter your details, choose dates, and pay securely online.
          </motion.p>
        </div>
      </div>

      <div className="container-custom py-12 lg:py-20">
        {/* Step indicator */}
        <ScrollReveal>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-16">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-500 transform ${
                  i === step ? "bg-primary-green text-white shadow-xl shadow-primary-green/30 scale-110" : 
                  i < step ? "bg-primary-green/20 text-primary-green" : 
                  "bg-white text-neutral-text-secondary border border-neutral-border/50"
                }`}>
                  {i < step ? <Check className="h-5 w-5" strokeWidth={3} /> : i + 1}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${i <= step ? "text-primary-dark" : "text-neutral-text-secondary/60"}`}>{s}</span>
                {i < steps.length - 1 && <div className="h-px w-8 md:w-12 bg-neutral-border/60 mx-1" />}
              </div>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Form area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div 
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="rounded-[40px] border border-neutral-border bg-white p-8 md:p-12 shadow-soft relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-2 bg-neutral-light" />
                <div
                  className="absolute top-0 left-0 h-2 bg-primary-green transition-all duration-700 booking-progress-bar"
                  ref={el => { if (el) el.style.setProperty('--progress-width', `${((step + 1) / steps.length) * 100}%`); }}
                  aria-hidden="true"
                />


                {step === 0 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                       <div className="h-12 w-12 rounded-2xl bg-primary-green/10 flex items-center justify-center text-primary-green"><Users size={24} /></div>
                       <div>
                          <h2 className="text-3xl font-black text-primary-dark tracking-tight">Guest Information</h2>
                          <p className="text-xs font-bold text-neutral-text-secondary uppercase tracking-widest mt-1">Lead Traveller Details</p>
                       </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-neutral-text-secondary uppercase tracking-[0.2em] ml-1">First Name</label>
                        <input name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl border-none text-sm font-bold bg-neutral-light focus:bg-white focus:ring-2 focus:ring-primary-green transition-all outline-none" placeholder="John" title="First Name" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-neutral-text-secondary uppercase tracking-[0.2em] ml-1">Last Name</label>
                        <input name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl border-none text-sm font-bold bg-neutral-light focus:bg-white focus:ring-2 focus:ring-primary-green transition-all outline-none" placeholder="Doe" title="Last Name" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-neutral-text-secondary uppercase tracking-[0.2em] ml-1 flex items-center gap-2"><Mail size={12} /> Email Address</label>
                        <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl border-none text-sm font-bold bg-neutral-light focus:bg-white focus:ring-2 focus:ring-primary-green transition-all outline-none" placeholder="john@example.com" title="Email Address" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-neutral-text-secondary uppercase tracking-[0.2em] ml-1 flex items-center gap-2"><Phone size={12} /> Contact Number</label>
                        <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl border-none text-sm font-bold bg-neutral-light focus:bg-white focus:ring-2 focus:ring-primary-green transition-all outline-none" placeholder="+977-XXXXXXXXXX" title="Contact Number" />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-[11px] font-black text-neutral-text-secondary uppercase tracking-[0.2em] ml-1 flex items-center gap-2"><Globe size={12} /> Nationality</label>
                        <input name="nationality" value={formData.nationality} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl border-none text-sm font-bold bg-neutral-light focus:bg-white focus:ring-2 focus:ring-primary-green transition-all outline-none" placeholder="Nepal" title="Nationality" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-neutral-text-secondary uppercase tracking-[0.2em] ml-1">Government ID Type</label>
                        <select name="idType" value={formData.idType} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl border-none text-sm font-bold bg-neutral-light focus:bg-white focus:ring-2 focus:ring-primary-green transition-all outline-none appearance-none" title="Government ID Type">
                           <option value="national_id">National ID</option>
                           <option value="passport">Passport</option>
                           <option value="driving_license">Driving License</option>
                           <option value ="citizenship" >Citizenship Card</option>
                           <option value ="other" >Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-neutral-text-secondary uppercase tracking-[0.2em] ml-1">Government ID Number</label>
                        <input name="idNumber" value={formData.idNumber} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl border-none text-sm font-bold bg-neutral-light focus:bg-white focus:ring-2 focus:ring-primary-green transition-all outline-none" placeholder="AB1234567" title="Government ID Number" />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-[11px] font-black text-neutral-text-secondary uppercase tracking-[0.2em] ml-1">Upload Government ID Proof</label>
                        <div className="w-full relative flex items-center justify-center h-20 border-2 border-dashed border-neutral-border rounded-2xl hover:border-primary-green hover:bg-neutral-light/50 transition-colors cursor-pointer overflow-hidden bg-neutral-light/30">
                           <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" title="Upload Government ID Proof" />
                           {formData.idProofImage ? (
                               <div className="flex items-center gap-3 text-primary-green z-0 font-bold text-sm">
                                  <Check size={16} /> ID Proof Attached Successfully
                               </div>
                           ) : (
                               <div className="flex items-center gap-3 text-neutral-text-secondary z-0 font-bold text-sm">
                                  <Upload size={16} /> Click to browse or drag image (Max 5MB)
                               </div>
                           )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {step === 1 && (
                  <div className="space-y-8">
                     <div className="flex items-center gap-4 mb-2">
                       <div className="h-12 w-12 rounded-2xl bg-primary-gold/10 flex items-center justify-center text-primary-gold"><Calendar size={24} /></div>
                       <div>
                          <h2 className="text-3xl font-black text-primary-dark tracking-tight">Stay Logistics</h2>
                          <p className="text-xs font-bold text-neutral-text-secondary uppercase tracking-widest mt-1">Timeline & Occupancy</p>
                       </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-neutral-text-secondary uppercase tracking-[0.2em] ml-1">Check-in Date</label>
                        <input type="date" name="checkIn" value={formData.checkIn} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl border-none text-sm font-bold bg-neutral-light focus:bg-white focus:ring-2 focus:ring-primary-green transition-all outline-none cursor-pointer" title="Check-in Date" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-neutral-text-secondary uppercase tracking-[0.2em] ml-1">Check-out Date</label>
                        <input type="date" name="checkOut" value={formData.checkOut} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl border-none text-sm font-bold bg-neutral-light focus:bg-white focus:ring-2 focus:ring-primary-green transition-all outline-none cursor-pointer" title="Check-out Date" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-neutral-text-secondary uppercase tracking-[0.2em] ml-1">Total Adults</label>
                        <select name="adults" value={formData.adults} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl border-none text-sm font-bold bg-neutral-light focus:bg-white focus:ring-2 focus:ring-primary-green transition-all outline-none cursor-pointer appearance-none" title="Number of Adults">
                           {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} {v === 1 ? 'Adult' : 'Adults'}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-neutral-text-secondary uppercase tracking-[0.2em] ml-1">Children</label>
                        <select name="children" value={formData.children} onChange={handleInputChange} className="w-full h-14 px-6 rounded-2xl border-none text-sm font-bold bg-neutral-light focus:bg-white focus:ring-2 focus:ring-primary-green transition-all outline-none cursor-pointer appearance-none" title="Number of Children">
                           {[0, 1, 2, 3, 4].map(v => <option key={v} value={v}>{v} {v === 1 ? 'Child' : 'Children'}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-neutral-text-secondary uppercase tracking-[0.2em] ml-1 flex items-center gap-2"><MessageSquare size={12} /> Special Proposals</label>
                      <textarea name="specialRequests" value={formData.specialRequests} onChange={handleInputChange} className="w-full h-32 px-6 py-4 rounded-2xl border-none text-sm font-medium bg-neutral-light focus:bg-white focus:ring-2 focus:ring-primary-green transition-all outline-none resize-none" placeholder="E.g. Anniversary setup, Late check-in, Airport pickup request..." title="Special Requests" />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                       <div className="h-12 w-12 rounded-2xl bg-primary-green/10 flex items-center justify-center text-primary-green"><CreditCard size={24} /></div>
                       <div>
                          <h2 className="text-3xl font-black text-primary-dark tracking-tight">Financial Checkout</h2>
                          <p className="text-xs font-bold text-neutral-text-secondary uppercase tracking-widest mt-1">Secure Payment Gateway</p>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {[
                        { id: 'esewa', name: 'eSewa', hint: 'Nepal\'s #1 Wallet' },
                        { id: 'khalti', name: 'Khalti', hint: 'Secure Pay' },
                        { id: 'cash', name: 'Pay at Counter', hint: 'Reserve only' }
                      ].map((method) => (
                        <button 
                          key={method.id} 
                          onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id as any }))}
                          className={`p-6 rounded-[32px] border-2 flex flex-col items-center text-center transition-all duration-300 relative group ${
                            formData.paymentMethod === method.id 
                            ? 'border-primary-green bg-primary-green/5 shadow-xl shadow-primary-green/5 scale-105' 
                            : 'border-neutral-border/40 hover:border-primary-green/30 hover:bg-neutral-light'
                          }`}
                        >
                          {formData.paymentMethod === method.id && (
                             <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-primary-green text-white flex items-center justify-center shadow-lg transform animate-in zoom-in">
                               <Check className="h-4 w-4" strokeWidth={4} />
                             </div>
                          )}
                          <div className={`w-12 h-12 rounded-2xl mb-3 flex items-center justify-center transition-colors ${formData.paymentMethod === method.id ? 'bg-primary-green text-white' : 'bg-neutral-light text-neutral-text-secondary'}`}>
                             {method.id === 'esewa' || method.id === 'khalti' ? <CreditCard size={24} /> : <Users size={24} />}
                          </div>
                          <span className="block font-black text-primary-dark text-sm mb-1">{method.name}</span>
                          <span className="text-[10px] font-bold text-neutral-text-secondary uppercase tracking-widest">{method.hint}</span>
                        </button>
                      ))}
                    </div>

                    {formData.paymentMethod === 'esewa' && (
                      <div className="bg-primary-gold/10 p-6 rounded-[24px] border border-primary-gold/20 mb-6">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 mt-1 rounded-full bg-primary-gold/20 flex shrink-0 items-center justify-center text-primary-gold">
                            <Info size={20} />
                          </div>
                          <div>
                            <p className="font-black text-primary-dark mb-2">eSewa Sandbox Testing Credentials</p>
                            <div className="text-xs font-bold text-neutral-text-secondary space-y-1">
                               <p>eSewa ID: <span className="text-primary-dark font-mono bg-white px-2 py-0.5 rounded">9806800001</span></p>
                               <p>Password: <span className="text-primary-dark font-mono bg-white px-2 py-0.5 rounded">Nepal@123</span></p>
                               <p>MPIN: <span className="text-primary-dark font-mono bg-white px-2 py-0.5 rounded">1122</span></p>
                               <p>Token: <span className="text-primary-dark font-mono bg-white px-2 py-0.5 rounded">123456</span></p>
                            </div>
                            <p className="mt-2 text-[10px] uppercase font-black tracking-widest text-primary-gold">Input these details during the eSewa redirection</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {formData.paymentMethod === 'khalti' && (
                      <div className="bg-[#5C2D91]/10 p-6 rounded-[24px] border border-[#5C2D91]/20 mb-6">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 mt-1 rounded-full bg-[#5C2D91]/20 flex shrink-0 items-center justify-center text-[#5C2D91]">
                            <Info size={20} />
                          </div>
                          <div>
                            <p className="font-black text-primary-dark mb-2">Khalti Sandbox Testing Credentials</p>
                            <div className="text-xs font-bold text-neutral-text-secondary space-y-1">
                               <p>Khalti ID: <span className="text-primary-dark font-mono bg-white px-2 py-0.5 rounded">9800000000 (Any Standard Nepali Number)</span></p>
                               <p>MPIN: <span className="text-primary-dark font-mono bg-white px-2 py-0.5 rounded">0000</span></p>
                               <p>OTP: <span className="text-primary-dark font-mono bg-white px-2 py-0.5 rounded">987654</span></p>
                            </div>
                            <p className="mt-2 text-[10px] uppercase font-black tracking-widest text-[#5C2D91]">Input these details during Khalti Checkout verification</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-primary-green/5 p-8 rounded-[32px] border border-primary-green/20 space-y-4">
                       <div className="flex items-center gap-4">
                         <div className="h-10 w-10 rounded-full bg-primary-green/10 flex items-center justify-center text-primary-green">
                           <ShieldCheck />
                         </div>
                         <div>
                            <p className="text-sm font-black text-primary-dark">Enterprise Grade Security</p>
                            <p className="text-xs font-medium text-neutral-text-secondary">Your data is secured with AES-256 bit military-grade encryption during the entire transaction process.</p>
                         </div>
                       </div>
                    </div>
                  </div>
                )}

                {step === 3 && bookingResult && (
                  <div className="text-center space-y-8 py-10">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 12 }}
                      className="h-24 w-24 rounded-[32px] bg-primary-green text-white flex items-center justify-center mx-auto shadow-2xl shadow-primary-green/40"
                    >
                      <Check className="h-12 w-12" strokeWidth={4} />
                    </motion.div>
                    
                    <div className="space-y-3">
                      <h2 className="text-4xl font-black text-primary-dark tracking-tighter">Stay Confirmed!</h2>
                      <p className="text-neutral-text-secondary font-medium">Invitation has been dispatched to <span className="text-primary-green font-bold">{formData.email}</span></p>
                    </div>

                    <div className="bg-neutral-light/50 p-8 rounded-[40px] border border-neutral-border/50 max-w-sm mx-auto shadow-inner">
                       <p className="text-[10px] font-black text-neutral-text-secondary uppercase tracking-[0.3em] mb-3">Reservation Identifier</p>
                       <p className="font-mono font-black text-3xl text-primary-dark tracking-widest">{bookingResult.bookingNumber}</p>
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
                       <Button variant="outline" className="h-14 rounded-2xl font-black text-xs uppercase tracking-widest border-neutral-border shadow-sm px-8">
                          <Download className="h-4 w-4 mr-3" /> Get Digital Receipt
                       </Button>
                       <Button onClick={() => navigate('/')} variant="primary" className="h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-green/20 px-8">
                          Return to Home
                       </Button>
                    </div>
                  </div>
                )}

                {step < 3 && (
                  <div className="flex items-center justify-between mt-16 pt-10 border-t border-neutral-border/50">
                    <Button 
                      variant="ghost" 
                      onClick={handlePrev} 
                      disabled={step === 0 || isSubmitting} 
                      className="px-10 h-14 rounded-2xl font-black text-xs uppercase tracking-widest text-neutral-text-secondary hover:bg-neutral-light transition-all"
                    >
                      Retrieve
                    </Button>
                    
                    <Button 
                      variant="primary" 
                      onClick={step === 2 ? handleConfirmBooking : handleNext} 
                      disabled={isSubmitting}
                      className="px-12 h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary-green/20 relative group overflow-hidden"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Finalizing...</span>
                        </div>
                      ) : (
                        <span>{step === 2 ? "Finalize & Secure" : "Advance Process"}</span>
                      )}
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Luxury Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <ScrollReveal delay={0.2}>
                <div className="rounded-[40px] border border-neutral-border bg-white p-8 shadow-2xl relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-gold/5 rounded-bl-full pointer-events-none" />
                  
                  <h3 className="text-xl font-black text-primary-dark mb-8 tracking-tight flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-primary-green text-white flex items-center justify-center"><Check size={16} strokeWidth={4} /></div>
                    Concierge Summary
                  </h3>
                  
                  <div className="relative aspect-video rounded-3xl overflow-hidden mb-8 shadow-soft border border-neutral-border/50 group">
                    {(() => {
                      const primaryImage = selectedRoom?.images?.find(img => img.isPrimary)?.url || selectedRoom?.images?.[0]?.url;
                      return (
                        <img 
                          src={getImageUrl(primaryImage) || "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop"} 
                          alt={selectedRoom?.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                      );
                    })()}

                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                       <span className="bg-white/95 backdrop-blur-md text-primary-dark text-[10px] font-black px-4 py-2 rounded-xl shadow-xl uppercase tracking-widest border border-white/20">
                          {selectedRoom?.roomNumber ? `No. ${selectedRoom.roomNumber}` : 'Selected Sanctuary'}
                       </span>
                    </div>
                  </div>
                  
                  <div className="mb-8 pb-8 border-b border-neutral-border/50">
                     <span className="text-[10px] font-black text-primary-gold uppercase tracking-[0.2em] mb-2 block">{selectedRoom?.roomType?.name || 'Luxury Category'}</span>
                     <h4 className="font-black text-2xl text-primary-dark leading-tight tracking-tight">{selectedRoom?.name || 'Your Luxury Room'}</h4>
                  </div>

                  <div className="space-y-5">
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-neutral-text-secondary font-bold">Standard Nightly Rate</span>
                       <span className="font-black text-primary-dark">Rs. {Number(selectedRoom?.basePrice || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-neutral-text-secondary font-bold">Duration ({calculation.nights} {calculation.nights === 1 ? 'Night' : 'Nights'})</span>
                       <span className="font-black text-primary-dark">× {calculation.nights}</span>
                    </div>
                    
                    <div className="pt-5 mt-2 space-y-4 border-t border-neutral-border border-dashed">
                      <div className="flex justify-between items-center text-[13px]">
                         <span className="text-neutral-text-secondary font-bold italic">Boutique Service Fee</span>
                         <span className="font-bold text-primary-dark">Rs. {calculation.serviceFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-[13px]">
                         <span className="text-neutral-text-secondary font-bold italic">Government Levy (13%)</span>
                         <span className="font-bold text-primary-dark">Rs. {calculation.tax.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-neutral-border -mx-8 px-8 bg-neutral-light/50 pb-2">
                       <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-black text-neutral-text-secondary uppercase tracking-[0.2em]">Grand Investment</span>
                          <span className="text-2xl font-black text-primary-green tracking-tight">Rs. {calculation.grandTotal.toLocaleString()}</span>
                       </div>
                       <p className="text-[9px] font-bold text-neutral-text-secondary/60 uppercase tracking-widest">Inclusive of all environmental and heritage charges</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile context floating bar */}
      {step < 3 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border-t border-neutral-border/50 p-6 z-40 animate-in slide-in-from-bottom duration-500">
           <div className="flex items-center justify-between mb-4">
              <div>
                 <p className="text-[10px] font-black text-neutral-text-secondary uppercase tracking-widest">Total Amount</p>
                 <p className="text-xl font-black text-primary-green">Rs. {calculation.grandTotal.toLocaleString()}</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-neutral-text-secondary uppercase tracking-widest">Step</p>
                 <p className="text-sm font-black text-primary-dark">{step + 1} of 3</p>
              </div>
           </div>
           <Button variant="primary" className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary-green/30" onClick={step === 2 ? handleConfirmBooking : handleNext} disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : step === 2 ? "Confirm Booking" : "Continue to Next Step"}
           </Button>
        </div>
      )}
    </main>
  );
};