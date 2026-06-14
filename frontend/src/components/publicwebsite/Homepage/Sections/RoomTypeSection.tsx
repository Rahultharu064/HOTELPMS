import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { RoomType } from "../../../../services/roomTypeService";
import { roomTypeService } from "../../../../services/roomTypeService";
import { ApiStatus } from "../../../ui/ApiStatus";
import { getImageUrl } from "../../../../services/api";

const ScrollReveal = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
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
      setError(err?.message || "Failed to load room types");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes]);

  return (
    <section id="room-types" className="section-padding relative overflow-hidden border-b border-neutral-border/50 bg-[#FAFAF8]">
      <div className="pointer-events-none absolute right-0 top-0 -mr-40 -mt-40 h-80 w-80 rounded-full bg-primary-gold/5 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 -mb-40 -ml-40 h-80 w-80 rounded-full bg-primary-green/5 blur-[90px]" />

      <div className="container-custom relative z-10">
        <ScrollReveal className="mx-auto mb-14 max-w-3xl text-center md:mb-16">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-primary-gold" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-primary-gold">
              Our Collections
            </span>
            <span className="h-px w-8 bg-primary-gold" />
          </div>

          <h2 className="font-georgia text-3xl font-bold leading-tight text-primary-dark md:text-4xl lg:text-[2.75rem]">
            Browse by <span className="italic text-primary-green">Room</span> Type
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-relaxed text-neutral-text-secondary md:text-base">
            Find the perfect sanctuary that entirely suits your style and needs.
          </p>
        </ScrollReveal>

        {loading ? (
          <ApiStatus status="loading" skeletonCount={4} skeletonVariant="card" />
        ) : error ? (
          <ApiStatus status="error" errorMessage={error} onRetry={fetchRoomTypes} />
        ) : roomTypes.length === 0 ? (
          <ApiStatus
            status="empty"
            emptyTitle="Room Categories Coming Soon"
            emptyDescription="We're preparing our room collections for you. Check back shortly."
            emptyEmoji="🏨"
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {roomTypes.slice(0, 4).map((rt, i) => (
              <ScrollReveal key={rt.id} delay={i * 0.08}>
                <Link
                  to={`/rooms?type=${rt.name}`}
                  className="group relative block overflow-hidden rounded-2xl border border-neutral-border/60 bg-white shadow-[0_8px_32px_rgba(20,83,45,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:border-primary-green/20 hover:shadow-[0_20px_48px_rgba(20,83,45,0.12)]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={getImageUrl(rt.image)}
                      alt={`${rt.name} rooms`}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/95 via-primary-dark/35 to-primary-dark/10" />

                    <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                      {rt.name}
                    </span>

                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                      <h3 className="font-georgia text-xl font-bold text-white md:text-2xl">{rt.name}</h3>
                      <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-white/80">
                        {rt.description || "Elegant rooms designed for comfort and a memorable stay."}
                      </p>

                      <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-primary-gold transition-colors group-hover:text-white">
                        Explore Rooms
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
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
