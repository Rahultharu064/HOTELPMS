import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Users, BedDouble, Maximize, ArrowRight, Sparkles } from "lucide-react";
import { roomService } from "../../../../services/roomService";
import type { Room } from "../../../../services/roomService";
import { Button } from "../../../ui/Button";

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const getImageUrl = (path?: string) => {
    if (!path) return "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop";
    return path.startsWith('http') ? path : `${API_URL}${path}`;
};

const ScrollReveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        className={className}
    >
        {children}
    </motion.div>
);

export const FeaturedRoomsSection: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                // Fetch rooms with isFeatured=true
                const res = await roomService.getAllRooms({ isFeatured: true });
                if (res.success) {
                    setRooms(res.data.slice(0, 3));
                }
            } catch (error) {
                console.error("Failed to fetch featured rooms:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    if (!loading && rooms.length === 0) return null;

    return (
        <section className="section-padding bg-neutral-light overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-gold/10 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-green/10 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />
             
            <div className="container-custom relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <ScrollReveal className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-primary-gold/10 text-primary-gold p-1.5 rounded-lg">
                                <Sparkles className="h-4 w-4" />
                            </span>
                            <span className="text-primary-gold font-extrabold text-xs uppercase tracking-[0.2em] block drop-shadow-sm">Signature Experience</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary-dark tracking-tighter mb-4 leading-tight">Featured <span className="text-primary-green">Collections</span></h2>
                        <p className="text-lg text-neutral-text-secondary font-medium max-w-lg leading-relaxed">Experience the pinnacle of luxury in our handpicked signature suites and rooms.</p>
                    </ScrollReveal>
                    <ScrollReveal delay={0.2}>
                        <Button variant="outline" className="rounded-full px-8 h-12 font-bold group border-neutral-border hover:border-primary-green hover:bg-primary-green/5 transition-all" asChild>
                            <Link to="/rooms" className="flex items-center gap-2 text-primary-dark">
                                View All Rooms <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </ScrollReveal>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-[40px] aspect-[4/5] animate-pulse shadow-sm" />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                        {rooms.map((room, i) => {
                            const primaryImage = room.images?.find(img => img.isPrimary)?.url || room.images?.[0]?.url;
                            return (
                                <ScrollReveal key={room.id} delay={i * 0.15}>
                                    <div className="group flex flex-col h-full rounded-[40px] bg-white overflow-hidden shadow-soft hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 border border-neutral-border/20 relative">
                                        <div className="absolute top-6 left-6 z-20">
                                            <div className="bg-primary-gold text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md border border-white/20">
                                                Featured
                                            </div>
                                        </div>

                                        <div className="relative overflow-hidden aspect-[4/3] bg-neutral-light">
                                            <img 
                                                src={getImageUrl(primaryImage)} 
                                                alt={room.name} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                            
                                            <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-black text-primary-dark shadow-xl flex items-center gap-1.5 border border-white/20">
                                                <Star className="h-3.5 w-3.5 text-primary-gold fill-primary-gold" /> {room.ratingSummary?.averageRating ? room.ratingSummary.averageRating.toFixed(1) : "5.0"}
                                            </div>
                                            
                                            <div className="absolute bottom-6 left-8 right-8">
                                                <span className="text-[10px] text-primary-gold font-black uppercase tracking-[0.2em] mb-1.5 block drop-shadow-md">{room.roomType?.name}</span>
                                                <h3 className="font-black text-3xl text-white drop-shadow-xl leading-tight mb-2 group-hover:text-primary-green transition-colors">{room.name}</h3>
                                                <div className="flex items-center gap-2">
                                                     <span className="text-xl font-black text-white px-3 py-1 bg-primary-green/30 backdrop-blur-md rounded-xl border border-white/20">Rs. {Number(room.basePrice).toLocaleString()}</span>
                                                     <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest">/ Night</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="p-8 flex flex-col flex-1">
                                            <p className="text-sm text-neutral-text-secondary mb-8 line-clamp-2 leading-relaxed flex-1 font-medium italic opacity-80">"{room.description}"</p>
                                            
                                            <div className="flex flex-wrap gap-2 mb-8">
                                                {room.amenities && room.amenities.slice(0, 3).map((amenity) => (
                                                    <div key={amenity.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-light/50 rounded-xl border border-neutral-border/30 text-[10px] font-bold text-primary-dark">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-green" />
                                                        {amenity.name}
                                                    </div>
                                                ))}
                                                {(!room.amenities || room.amenities.length === 0) && (
                                                    <>
                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-light/50 rounded-xl border border-neutral-border/30 text-[10px] font-bold text-primary-dark">
                                                            <Users className="h-3 w-3 text-primary-green" /> {room.capacity} Guests
                                                        </div>
                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-light/50 rounded-xl border border-neutral-border/30 text-[10px] font-bold text-primary-dark">
                                                            <BedDouble className="h-3 w-3 text-primary-gold" /> {room.bedType || 'Queen'}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-light/50 rounded-xl border border-neutral-border/30 text-[10px] font-bold text-primary-dark">
                                                            <Maximize className="h-3 w-3 text-primary-dark" /> {room.size || 35}m²
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            
                                            <div className="flex gap-4">
                                                <Button variant="primary" size="md" className="flex-1 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary-green/20 rounded-2xl h-12" asChild>
                                                    <Link to={`/rooms/${room.slug}`}>View Details</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};
