import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, BedDouble, Maximize, ArrowRight, CheckCircle } from "lucide-react";
import { roomService } from "../../../../services/roomService";
import type { Room } from "../../../../services/roomService";
import { Button } from "../../../ui/Button";
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

/* ─────────────────────────────────────────────
   Room Card — inspired by the reference design
   ───────────────────────────────────────────── */
const RoomCard = ({ room, index }: { room: Room; index: number }) => {
  const primaryImage =
    room.images?.find((img) => img.isPrimary)?.url || room.images?.[0]?.url;

  const statusLabel =
    room.status === "available"
      ? "Available"
      : room.status === "occupied"
      ? "Occupied"
      : room.status === "maintenance"
      ? "Maintenance"
      : "Unavailable";

  const isAvailable = room.status === "available";

  return (
    <ScrollReveal key={room.id} delay={index * 0.12}>
      <Link
        to={`/rooms/${room.slug}`}
        className="group block bg-white rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2 border border-gray-100/80"
      >
        {/* ── Image Container ── */}
        <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
          <img
            src={getImageUrl(primaryImage)}
            alt={room.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />

          {/* Status badge — top left */}
          <div className="absolute top-4 left-4 z-10">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-lg backdrop-blur-sm ${
                isAvailable
                  ? "bg-[#14532D]/90 text-white"
                  : "bg-gray-800/80 text-gray-200"
              }`}
            >
              <CheckCircle size={12} strokeWidth={2.5} />
              {statusLabel}
            </span>
          </div>

          {/* Price badge — top right */}
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-primary-gold/95 text-[#14532D] text-[11px] font-extrabold shadow-lg backdrop-blur-sm">
              NPR {Number(room.basePrice).toLocaleString()}
              <span className="font-semibold text-[10px] text-[#14532D]/70">/night</span>
            </span>
          </div>

          {/* Subtle bottom gradient for polish */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>

        {/* ── Card Body ── */}
        <div className="px-5 pt-5 pb-5">
          {/* Room Name */}
          <h3 className="text-lg font-bold text-primary-dark leading-snug mb-3 group-hover:text-primary-green transition-colors duration-300">
            {room.name}
          </h3>

          {/* Meta Info Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4 text-[12px] text-neutral-text-secondary font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Users size={13} className="text-primary-gold" />
              {room.capacity} Guests
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BedDouble size={13} className="text-primary-gold" />
              {room.bedType || "Queen Bed"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Maximize size={13} className="text-primary-gold" />
              {room.size ? `${room.size} sq ft` : "Large"}
            </span>
          </div>

          {/* Description */}
          <p className="text-[13px] text-neutral-text-secondary leading-relaxed line-clamp-2 mb-4">
            {room.description || "Experience premium comfort and elegance in this beautifully designed room."}
          </p>

          {/* View Details link */}
          <div className="flex items-center gap-1.5 text-primary-green text-[11px] font-bold uppercase tracking-[0.15em] group-hover:gap-2.5 transition-all duration-300">
            View Details
            <ArrowRight size={13} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
};

/* ─────────────────────────────────────────────
   Section
   ───────────────────────────────────────────── */
export const FeaturedRoomsSection: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await roomService.getAllRooms({ isFeatured: true, limit: 3 });
      if (res.success) {
        setRooms(res.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch featured rooms:", err);
      setError(err?.message || "Failed to load featured rooms");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  if (!loading && !error && rooms.length === 0) return null;

  return (
    <section className="section-padding bg-neutral-light overflow-hidden relative">
      {/* Decorative blurs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-gold/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-green/5 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* ── Section Header ── */}
        <div className="text-center mb-14">
          <ScrollReveal className="max-w-3xl mx-auto">
            {/* Accent label */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8 bg-primary-gold" />
              <span className="text-primary-gold font-extrabold text-[11px] uppercase tracking-[0.25em]">
                Accommodation
              </span>
              <span className="h-px w-8 bg-primary-gold" />
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-dark tracking-tight mb-4 leading-tight">
              Rooms <span className="font-georgia italic text-primary-green">&</span> Suites
            </h2>

            <p className="text-neutral-text-secondary font-medium text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              Elegantly designed spaces crafted for your ultimate comfort and relaxation.
            </p>
          </ScrollReveal>
        </div>

        {/* ── Cards ── */}
        {loading ? (
          <ApiStatus status="loading" skeletonCount={3} skeletonVariant="hero" />
        ) : error ? (
          <ApiStatus
            status="error"
            errorMessage={error}
            onRetry={fetchRooms}
          />
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8 mb-12">
              {rooms.map((room, i) => (
                <RoomCard key={room.id} room={room} index={i} />
              ))}
            </div>

            {/* View All button */}
            <ScrollReveal delay={0.3} className="text-center">
              <Button
                variant="outline"
                className="rounded-full px-8 h-12 font-bold group border-neutral-border hover:border-primary-green hover:bg-primary-green/5 transition-all"
                asChild
              >
                <Link
                  to="/rooms"
                  className="flex items-center gap-2 text-primary-dark"
                >
                  View All Rooms
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </ScrollReveal>
          </>
        )}
      </div>
    </section>
  );
};
