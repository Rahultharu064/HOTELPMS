import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Star, Users, ArrowRight, TrendingUp } from "lucide-react";
import { SectionHeading } from "../layout/SectionHeading";
import { roomService } from "../../../../services/roomService";
import type { Room } from "../../../../services/roomService";
import { Button } from "../../../ui/Button";
import { ApiStatus } from "../../../ui/ApiStatus";
import { getImageUrl } from "../../../../services/api";


const ScrollReveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        className={className}
    >
        {children}
    </motion.div>
);

export const GuestFavoritesSection: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFavorites = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await roomService.getGuestFavorites();
            if (res.success) {
                setRooms(res.data);
            }
        } catch (err: any) {
            console.error("Failed to fetch guest favorites:", err);
            setError(err?.message || 'Failed to load guest favorites');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    // Don't render at all if no data and no error
    if (!loading && !error && rooms.length === 0) return null;

    return (
        <section className="section-padding bg-white relative overflow-hidden">
             {/* Decorative Background Elements */}
            <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary-gold/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -right-20 top-1/4 w-72 h-72 bg-primary-green/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="container-custom relative z-10">
                <SectionHeading
                    badge="Most Loved by Guests"
                    badgeIcon={TrendingUp}
                    title={<>Guest <span className="gradient-text">Favorites</span></>}
                    subtitle="Discover the rooms our guests return to again and again — curated from real bookings, ratings, and heartfelt reviews."
                    accent="gold"
                />

                {loading ? (
                    <ApiStatus status="loading" skeletonCount={3} skeletonVariant="row" />
                ) : error ? (
                    <ApiStatus
                        status="error"
                        errorMessage={error}
                        onRetry={fetchFavorites}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {rooms.map((room, i) => {
                            const primaryImage = room.images?.find(img => img.isPrimary)?.url || room.images?.[0]?.url;
                            return (
                                <ScrollReveal key={room.id} delay={i * 0.1}>
                                    <Link to={`/rooms/${room.slug}`} className="group relative block bg-neutral-light/50 rounded-3xl overflow-hidden border border-neutral-border/50 hover:border-primary-green/30 transition-all duration-500 hover:shadow-xl">
                                        <div className="flex gap-4 p-4">
                                            <div className="relative h-24 w-24 shrink-0 rounded-2xl overflow-hidden shadow-md">
                                                <img 
                                                    src={getImageUrl(primaryImage)} 
                                                    alt={room.name} 
                                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                            </div>
                                            
                                            <div className="flex flex-col justify-center flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-[9px] font-black text-primary-gold uppercase tracking-widest truncate">{room.roomType?.name}</span>
                                                    <div className="flex items-center gap-1 text-primary-green font-bold text-[10px]">
                                                        <Heart className="h-3 w-3 fill-primary-green" />
                                                        <span>{room._count?.bookings || 0}</span>
                                                    </div>
                                                </div>
                                                <h3 className="font-bold text-lg text-primary-dark mb-1 group-hover:text-primary-green transition-colors truncate">{room.name}</h3>
                                                <div className="flex items-center gap-1 text-[10px] text-neutral-text-secondary">
                                                    <Star className="h-3 w-3 text-primary-gold fill-primary-gold" />
                                                    <span className="font-bold">{room.ratingSummary?.averageRating ? room.ratingSummary.averageRating.toFixed(1) : "5.0"}</span>
                                                    <span className="mx-1 opacity-30">•</span>
                                                    <Users className="h-3 w-3" />
                                                    <span className="font-bold">{room.capacity} Guests</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="h-10 w-10 rounded-full bg-primary-green text-white flex items-center justify-center shadow-lg shadow-primary-green/20">
                                                    <ArrowRight className="h-5 w-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                )}

                <div className="mt-12 text-center">
                    <Button variant="secondary" size="lg" className="rounded-full px-10 shadow-lg shadow-primary-dark/10" asChild>
                        <Link to="/rooms">Discover All Sanctuaries</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};
