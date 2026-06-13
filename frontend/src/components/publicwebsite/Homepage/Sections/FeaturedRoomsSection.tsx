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

const formatBedLabel = (bedType?: string) => {
  if (!bedType) return "Queen Bed";
  const normalized = bedType.trim();
  if (/bed/i.test(normalized)) return normalized;
  return `${normalized} Bed`;
};

const formatSizeLabel = (size?: number) => {
  if (size) return `${size} sq ft`;
  return "Large sq ft";
};

const RoomCard = ({ room, index }: { room: Room; index: number }) => {
  const primaryImage =
    room.images?.find((img) => img.isPrimary)?.url || room.images?.[0]?.url;

  const isAvailable = room.status === "available";
  const statusLabel =
    room.status === "available"
      ? "Available"
      : room.status === "occupied"
      ? "Occupied"
      : room.status === "maintenance"
      ? "Maintenance"
      : "Unavailable";

  const formattedPrice = Number(room.basePrice).toLocaleString();

  return (
    <ScrollReveal delay={index * 0.12} className="h-full">
      <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-border/70 bg-white shadow-[0_2px_20px_rgba(20,83,45,0.07)] transition-all duration-500 hover:-translate-y-1.5 hover:border-primary-green/15 hover:shadow-[0_16px_48px_rgba(20,83,45,0.12)]">
        <Link to={`/rooms/${room.slug}`} className="flex flex-1 flex-col">
          {/* Image */}
          <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-neutral-light">
            <img
              src={getImageUrl(primaryImage)}
              alt={room.name}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />

            {/* Status badge — top left */}
            <div className="absolute left-3.5 top-3.5 z-10">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold shadow-[0_4px_14px_rgba(0,0,0,0.18)] ${
                  isAvailable
                    ? "bg-primary-green text-white"
                    : "bg-neutral-text-primary/85 text-white"
                }`}
              >
                <CheckCircle size={11} strokeWidth={2.5} />
                {statusLabel}
              </span>
            </div>

            {/* Price badge — top right */}
            <div className="absolute right-3.5 top-3.5 z-10">
              <span className="inline-flex items-center gap-0.5 rounded-full bg-primary-gold px-3.5 py-1.5 text-[11px] font-extrabold text-primary-dark shadow-[0_4px_14px_rgba(245,158,11,0.35)]">
                NPR {formattedPrice}
                <span className="text-[10px] font-semibold text-primary-dark/75">/night</span>
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col px-6 pb-4 pt-5">
            <h3 className="font-georgia text-[1.15rem] font-bold leading-snug text-primary-dark transition-colors duration-300 group-hover:text-primary-green md:text-xl">
              {room.name}
            </h3>

            <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-medium text-neutral-text-secondary">
              <span className="inline-flex items-center gap-1.5">
                <Users size={14} className="shrink-0 text-primary-gold" strokeWidth={2} />
                {room.capacity} Guests
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BedDouble size={14} className="shrink-0 text-primary-gold" strokeWidth={2} />
                {formatBedLabel(room.bedType)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Maximize size={14} className="shrink-0 text-primary-gold" strokeWidth={2} />
                {formatSizeLabel(room.size)}
              </span>
            </div>

            <p className="mt-4 line-clamp-3 flex-1 text-[13px] leading-[1.65] text-neutral-text-secondary">
              {room.description ||
                "Experience premium comfort and elegance in this beautifully designed room, thoughtfully appointed for a restful stay."}
            </p>
          </div>
        </Link>

        {/* Card footer — price + action */}
        <div className="flex items-center justify-between gap-4 border-t border-neutral-border/60 px-6 py-4">
          <div className="font-georgia leading-none">
            <span className="text-[11px] text-neutral-text-secondary">NPR </span>
            <span className="text-[1.35rem] font-bold text-primary-dark">{formattedPrice}</span>
            <span className="text-[11px] text-neutral-text-secondary"> /night</span>
          </div>

          <div className="relative h-9 min-w-[118px] shrink-0">
            {isAvailable ? (
              <>
                <Link
                  to={`/booking?room=${room.id}`}
                  className="absolute inset-0 inline-flex items-center justify-center gap-1 rounded-full bg-primary-dark px-5 text-[11px] font-bold tracking-wide text-primary-gold shadow-sm transition-all duration-300 group-hover:pointer-events-none group-hover:translate-y-1 group-hover:opacity-0"
                >
                  Book
                  <ArrowRight size={13} strokeWidth={2.5} />
                </Link>
                <Link
                  to={`/rooms/${room.slug}`}
                  className="absolute inset-0 inline-flex translate-y-1 items-center justify-center gap-1 rounded-full bg-primary-dark px-4 text-[10px] font-bold tracking-wide text-primary-gold opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  View Details
                  <ArrowRight size={13} strokeWidth={2.5} />
                </Link>
              </>
            ) : (
              <Link
                to={`/rooms/${room.slug}`}
                className="inline-flex h-9 w-full min-w-[118px] items-center justify-center gap-1 rounded-full bg-primary-dark px-4 text-[10px] font-bold tracking-wide text-primary-gold shadow-sm transition-colors hover:bg-primary-green hover:text-white"
              >
                View Details
                <ArrowRight size={13} strokeWidth={2.5} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

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
    <section className="section-padding relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute right-0 top-0 -mr-48 -mt-48 h-[400px] w-[400px] rounded-full bg-primary-gold/5 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 -mb-48 -ml-48 h-[400px] w-[400px] rounded-full bg-primary-green/5 blur-[100px]" />

      <div className="container-custom relative z-10">
        {/* Section header */}
        <div className="mb-14 text-center">
          <ScrollReveal className="mx-auto max-w-3xl">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-primary-gold" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-primary-gold">
                Accommodation
              </span>
              <span className="h-px w-8 bg-primary-gold" />
            </div>

            <h2 className="font-georgia text-3xl font-bold leading-tight tracking-tight text-primary-dark md:text-4xl lg:text-[2.75rem]">
              Rooms <span className="italic text-primary-green">&</span> Suites
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm font-medium leading-relaxed text-neutral-text-secondary md:text-base">
              Elegantly designed spaces crafted for your ultimate comfort and relaxation.
            </p>
          </ScrollReveal>
        </div>

        {loading ? (
          <ApiStatus status="loading" skeletonCount={3} skeletonVariant="card" />
        ) : error ? (
          <ApiStatus status="error" errorMessage={error} onRetry={fetchRooms} />
        ) : (
          <>
            <div className="mb-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {rooms.map((room, i) => (
                <RoomCard key={room.id} room={room} index={i} />
              ))}
            </div>

            <ScrollReveal delay={0.3} className="text-center">
              <Button
                variant="outline"
                className="group h-12 rounded-full border-neutral-border px-8 font-bold transition-all hover:border-primary-green hover:bg-primary-green/5"
                asChild
              >
                <Link to="/rooms" className="flex items-center gap-2 text-primary-dark">
                  View All Rooms
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </ScrollReveal>
          </>
        )}
      </div>
    </section>
  );
};
