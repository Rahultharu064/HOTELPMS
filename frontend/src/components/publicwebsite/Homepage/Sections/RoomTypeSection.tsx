import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
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
  <ScrollRevealMotion delay={delay} className={className}>{children}</ScrollRevealMotion>
);

const ScrollRevealMotion = ({ children, delay, className }: { children: React.ReactNode; delay: number; className: string }) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

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
    } catch (err: unknown) {
      console.error("Failed to fetch room types:", err);
      setError(err instanceof Error ? err.message : "Failed to load room types");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes]);

  return (
    <section id="room-types" className="section-padding border-b border-neutral-border bg-[#f8f7f2]">
      <div className="container-custom">
        <ScrollReveal className="mx-auto mb-14 max-w-3xl text-center md:mb-16">
          <div className="mb-4 flex items-center justify-center gap-3">
                <span aria-hidden="true" className="h-px w-8 bg-primary-gold" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-primary-gold">
              Room options
            </span>
                <span aria-hidden="true" className="h-px w-8 bg-primary-gold" />
          </div>

          <h2 className="font-georgia text-3xl font-bold leading-tight text-primary-dark md:text-4xl lg:text-[2.75rem]">
            Choose a room for your stay
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-relaxed text-neutral-text-secondary md:text-base">
            Explore room categories and compare the options available for your visit.
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
                  className="group relative block overflow-hidden rounded-xl border border-neutral-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-green/30 hover:shadow-lg"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={getImageUrl(rt.image)}
                      alt={`${rt.name} rooms`}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-primary-dark/95 via-primary-dark/40 to-transparent" />

                    <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                      {rt.name}
                    </span>

                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                      <h3 className="font-georgia text-xl font-bold text-white md:text-2xl">{rt.name}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/85">
                        {rt.description || "See available rooms and nightly rates in this category."}
                      </p>

                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-gold transition-colors group-hover:text-white">
                        View rooms
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
