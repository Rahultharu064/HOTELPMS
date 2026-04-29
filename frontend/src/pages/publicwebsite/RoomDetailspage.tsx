import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, BedDouble, Maximize, Wifi, Waves, 
  UtensilsCrossed, Car, Sparkles, Tv, Wind, Coffee, 
  Play, X, ShieldCheck, 
  Loader2, ChevronLeft,
  Shield, Dumbbell, Wine, Volume2, Star
} from "lucide-react";

import { Button } from '../../components/ui/Button';
import { roomService } from '../../services/roomService';
import type { Room } from '../../services/roomService';
import { toast } from 'react-hot-toast';

// Icon Map for Amenities
const iconMap: Record<string, any> = {
  'Free Wi-Fi': Wifi,
  'Smart TV': Tv,
  'Air Conditioning': Wind,
  'Mini Bar': Coffee,
  'Pool Access': Waves,
  'Spa Access': Sparkles,
  'Room Service': UtensilsCrossed,
  'Free Parking': Car,
  'Gym Access': Dumbbell,
  'Soundproofing': Volume2,
  'Fine Wine': Wine,
  'Daily Cleaning': Shield
};

const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

export const RoomDetailspage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [showVideo, setShowVideo] = useState(false);
  const [bookingDates, setBookingDates] = useState({
    checkIn: '',
    checkOut: ''
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchRoom = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await roomService.getRoomById(slug);
        if (res.success) {
          setRoom(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch room:", error);
        toast.error("Failed to load room details");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
    window.scrollTo(0, 0);
  }, [slug]);

  const images = useMemo(() => {
    if (!room?.images?.length) return ["https://images.unsplash.com/photo-1566665797739-1674de7a421a"];
    return room.images.map(img => img.url.startsWith('http') ? img.url : `${backendUrl}${img.url}`);
  }, [room, backendUrl]);

  const calculation = useMemo(() => {
    if (!bookingDates.checkIn || !bookingDates.checkOut || !room) {
      return { nights: 1, baseTotal: 0, service: 0, tax: 0, grandTotal: 0 };
    }
    const start = new Date(bookingDates.checkIn);
    const end = new Date(bookingDates.checkOut);
    const diff = end.getTime() - start.getTime();
    const nights = Math.max(1, Math.ceil(diff / (1000 * 3600 * 24)));
    const pricePerNight = Number(room.basePrice) || 0;
    const baseTotal = nights * pricePerNight;
    const service = baseTotal * 0.10;
    const tax = baseTotal * 0.13;
    const grandTotal = baseTotal + service + tax;
    return { nights, baseTotal, service, tax, grandTotal };
  }, [bookingDates, room]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 text-primary-green animate-spin" />
        <p className="text-sm font-medium text-neutral-text-secondary">Syncing details...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container-custom section-padding text-center min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Room Unavailable</h2>
        <Button onClick={() => navigate('/rooms')} variant="primary">Return Home</Button>
      </div>
    );
  }

  const reviewsList = room.roomType?.reviews || [];
  const ratingSummary = room.ratingSummary || { averageRating: 0, totalReviews: 0 };

  const defaultAmenities = [
    { name: 'Free Wi-Fi' }, { name: 'Smart TV' }, { name: 'Air Conditioning' }, 
    { name: 'Mini Bar' }, { name: 'Pool Access' }, { name: 'Free Parking' }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-black/5 py-8 md:py-12 border-b">
        <div className="container-custom">
           <Link to="/rooms" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-neutral-text-secondary hover:text-primary-green transition-colors mb-4">
              <ChevronLeft size={14} /> Back to Sanctuaries
           </Link>
           <h1 className="text-3xl md:text-5xl font-black text-primary-dark tracking-tighter uppercase italic">{room.name}</h1>
        </div>
      </div>

      <div className="container-custom py-12 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            <ScrollReveal>
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden aspect-video relative group bg-neutral-light shadow-xl border border-neutral-border/20">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={activeImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      src={images[activeImage]} 
                      alt={room.name} 
                      className="w-full h-full object-cover" 
                    />
                  </AnimatePresence>
                  
                  {room.videos?.[0] && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto transition-all">
                       <button onClick={() => setShowVideo(true)} className="h-16 w-16 rounded-full bg-white/90 shadow-2xl flex items-center justify-center scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all">
                          <Play size={24} className="text-primary-dark ml-1" fill="currentColor" />
                       </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-5 gap-3">
                  {images.slice(0, 5).map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)} className={`rounded-xl overflow-hidden aspect-video border-2 transition-all ${i === activeImage ? "border-primary-green shadow-lg" : "border-transparent opacity-50"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Video Modal */}
            <AnimatePresence>
              {showVideo && room.videos?.[0] && (
                <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl"
                   onClick={() => setShowVideo(false)}
                >
                  <motion.div 
                     className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black"
                     onClick={e => e.stopPropagation()}
                  >
                     <button onClick={() => setShowVideo(false)} className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors">
                        <X size={20} />
                     </button>
                     {(() => {
                        const videoUrl = room.videos?.[0].url || '';
                        const isExternal = videoUrl.startsWith('http') || videoUrl.includes('youtube') || videoUrl.includes('vimeo');
                        const fullUrl = isExternal ? videoUrl : `${backendUrl}${videoUrl}`;
                        
                        if (isExternal) {
                           const embedUrl = videoUrl.includes('youtube.com/watch?v=') 
                              ? videoUrl.replace('watch?v=', 'embed/') 
                              : videoUrl;
                           return (
                              <iframe 
                                 title="Room Video Tour"
                                 src={embedUrl} 
                                 className="w-full h-full"
                                 allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
                              />
                           );
                        } else {
                           return (
                              <video 
                                 src={fullUrl} 
                                 className="w-full h-full" 
                                 controls 
                                 autoPlay
                                 poster={images[0]}
                              />
                           );
                        }
                     })()}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <ScrollReveal>
              <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-neutral-border/50">
                 <div className="flex items-center gap-3">
                    <Users size={20} className="text-primary-green" />
                    <span className="text-sm font-bold">{room.capacity} Guests</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <BedDouble size={20} className="text-primary-green" />
                    <span className="text-sm font-bold">{room.bedType || 'King Deluxe'}</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <Maximize size={20} className="text-primary-green" />
                    <span className="text-sm font-bold">{room.size} sq. m</span>
                 </div>
                  <div className="flex items-center gap-1.5 text-primary-gold">
                    <Star size={20} className="fill-current" />
                    <span className="text-sm font-bold text-primary-dark">
                      {ratingSummary.averageRating.toFixed(1)} ({ratingSummary.totalReviews} verified reviews)
                    </span>
                  </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="space-y-8">
                 <div className="flex gap-8 border-b border-neutral-border">
                    {["description", "amenities", "reviews"].map(tab => (
                       <button key={tab} onClick={() => setActiveTab(tab)}
                          className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? "text-primary-dark" : "text-neutral-text-secondary"}`}>
                          {tab}
                          {activeTab === tab && <motion.div layoutId="tabMarker" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-green" />}
                       </button>
                    ))}
                 </div>
                 
                 <div className="min-h-[200px]">
                    {activeTab === "description" && (
                       <div className="text-neutral-text-secondary leading-[1.8] italic space-y-4 text-base">
                          <p>{room.description || "Our rooms are designed to offer the ultimate retreat after a long day. Experience unmatched tranquility combined with state-of-the-art facilities."}</p>
                       </div>
                    )}
                    {activeTab === "amenities" && (
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-bold uppercase tracking-tight text-primary-dark">
                          {(room.amenities && room.amenities.length > 0 ? room.amenities : defaultAmenities).map((a, i) => {
                             const Icon = iconMap[a.name] || ShieldCheck;
                             return (
                                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-neutral-light border border-neutral-border/40">
                                   <Icon size={16} className="text-primary-green" />
                                   <span>{a.name}</span>
                                </div>
                             );
                          })}
                       </div>
                    )}
                    {activeTab === "reviews" && (
                        <div className="space-y-4">
                           {reviewsList.length > 0 ? reviewsList.map(r => (
                              <div key={r.id} className="p-5 rounded-2xl bg-neutral-light border border-neutral-border/30">
                                 <div className="flex items-center gap-3 mb-2">
                                    <div className="h-8 w-8 rounded-full bg-primary-dark text-white flex items-center justify-center text-[10px] font-black uppercase">
                                       {r.guest?.firstName.charAt(0)}{r.guest?.lastName.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                       <span className="text-sm font-bold text-primary-dark">{r.guest?.firstName} {r.guest?.lastName}</span>
                                       <div className="flex gap-0.5">
                                          {[...Array(5)].map((_, i) => (
                                             <Star key={i} size={10} className={i < r.rating ? "text-primary-gold fill-primary-gold" : "text-neutral-border"} />
                                          ))}
                                       </div>
                                    </div>
                                 </div>
                                 <p className="text-sm text-neutral-text-secondary italic">"{r.comment || 'A wonderful experience!'}"</p>
                              </div>
                           )) : (
                              <div className="text-center py-8 bg-neutral-light rounded-2xl border border-dashed border-neutral-border/50">
                                 <p className="text-xs font-bold text-neutral-text-secondary uppercase tracking-widest">No reviews yet for this room type.</p>
                              </div>
                           )}
                        </div>
                    )}
                 </div>
              </div>
            </ScrollReveal>
          </div>

          <div>
             <div className="sticky top-32">
                <ScrollReveal>
                   <div className="rounded-[40px] bg-[#111827] text-white p-10 shadow-2xl space-y-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-gold/10 rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="space-y-2">
                         <span className="text-[10px] font-black uppercase tracking-widest text-primary-gold">Nightly Rate</span>
                         <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black">Rs. {Number(room.basePrice).toLocaleString()}</span>
                         </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1.5">
                              <label className="text-[9px] font-black uppercase tracking-widest text-white/50 block">Arrival</label>
                              <input 
                            type="date" 
                            title="Check-in Date"
                            value={bookingDates.checkIn} 
                            onChange={e => setBookingDates(p => ({ ...p, checkIn: e.target.value }))} 
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-xs font-bold outline-none focus:border-primary-gold" 
                         />
                           </div>
                           <div className="space-y-1.5">
                              <label className="text-[9px] font-black uppercase tracking-widest text-white/50 block">Departure</label>
                              <input 
                            type="date" 
                            title="Check-out Date"
                            value={bookingDates.checkOut} 
                            onChange={e => setBookingDates(p => ({ ...p, checkOut: e.target.value }))} 
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-xs font-bold outline-none focus:border-primary-gold" 
                         />
                           </div>
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[9px] font-black uppercase tracking-widest text-white/50 block">Occupancy</label>
                           <select title="Select Guests" className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-xs font-bold outline-none focus:border-primary-gold appearance-none">
                              <option className="text-black">2 Patrons</option>
                              <option className="text-black">1 Patron</option>
                           </select>
                        </div>
                      </div>

                      <div className="border-y border-white/10 py-6 space-y-3 text-sm">
                         <div className="flex justify-between text-white/60 font-medium">
                            <span>Resident fee ({calculation.nights} nights)</span>
                            <span className="text-white font-black">Rs. {calculation.baseTotal.toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between text-white/60 font-medium">
                            <span>Service fee (10%)</span>
                            <span>Rs. {calculation.service.toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between text-[13px] font-black pt-2 border-t border-white/10">
                            <span>Net Total</span>
                            <span className="text-primary-gold">Rs. {calculation.grandTotal.toLocaleString()}</span>
                         </div>
                      </div>

                      <Link to={`/booking?room=${room.id}&checkIn=${bookingDates.checkIn}&checkOut=${bookingDates.checkOut}`} className="block">
                         <button className="w-full h-16 bg-primary-gold text-primary-dark rounded-[24px] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-white transition-all">
                            Proceed to Portico
                         </button>
                      </Link>
                      
                      <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/30">
                         <Shield size={14} className="text-primary-green" /> Signal Secure
                      </div>
                   </div>
                </ScrollReveal>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};