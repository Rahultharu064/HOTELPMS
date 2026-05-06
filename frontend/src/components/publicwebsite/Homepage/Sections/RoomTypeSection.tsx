import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { RoomType } from "../../../../services/roomTypeService";
import { roomTypeService } from "../../../../services/roomTypeService";
import { ApiStatus } from "../../../ui/ApiStatus";
import { getImageUrl } from "../../../../services/api";


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

export const RoomTypeSection: React.FC = () => {
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRoomTypes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await roomTypeService.getAllRoomTypes();
            setRoomTypes(res.data.roomTypes || []);
        } catch (err: any) {
            console.error("Failed to fetch room types:", err);
            setError(err?.message || 'Failed to load room types');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoomTypes();
    }, [fetchRoomTypes]);

    return (
        <section className="section-padding bg-white border-b border-neutral-border/50">
            <div className="container-custom">
                <ScrollReveal className="text-center mb-16">
                    <span className="text-primary-gold font-extrabold text-xs uppercase tracking-[0.2em] block mb-2">Our Collections</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-primary-dark tracking-tight mb-4">Browse by Room Type</h2>
                    <p className="text-neutral-text-secondary font-medium">Find the perfect sanctuary that entirely suits your style and needs.</p>
                </ScrollReveal>

                {loading ? (
                    <ApiStatus status="loading" skeletonCount={4} skeletonVariant="card" />
                ) : error ? (
                    <ApiStatus
                        status="error"
                        errorMessage={error}
                        onRetry={fetchRoomTypes}
                    />
                ) : roomTypes.length === 0 ? (
                    <ApiStatus
                        status="empty"
                        emptyTitle="Room Categories Coming Soon"
                        emptyDescription="We're preparing our room collections for you. Check back shortly."
                        emptyEmoji="🏨"
                    />
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                        {roomTypes.slice(0, 4).map((rt, i) => (
                            <ScrollReveal key={rt.id} delay={i * 0.1}>
                                <Link
                                    to={`/rooms?type=${rt.name}`}
                                    className="group block rounded-3xl overflow-hidden relative aspect-[3/4] hover:-translate-y-2 transition-all duration-500 shadow-sm hover:shadow-2xl"
                                >
                                    <img
                                        src={getImageUrl(rt.image)}
                                        alt={`${rt.name} rooms`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ease-out"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                                        <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight drop-shadow-md mb-1.5 group-hover:text-primary-green transition-colors">{rt.name}</h3>
                                        <p className="text-xs md:text-sm font-medium text-white/80 line-clamp-2 leading-relaxed mb-3">{rt.description}</p>

                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] md:text-[10px] font-bold text-white uppercase tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">Explore</span>
                                        </div>
                                    </div>

                                    <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100 border border-white/20">
                                        <svg className="h-4 w-4 text-white ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                                    </div>
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
