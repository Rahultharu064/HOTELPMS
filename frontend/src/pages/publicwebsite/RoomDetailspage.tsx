import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  BedDouble,
  Maximize,
  Bath,
  Wifi,
  Waves,
  UtensilsCrossed,
  Car,
  Sparkles,
  Tv,
  Wind,
  Coffee,
  Play,
  X,
  ShieldCheck,
  Loader2,
  ChevronRight,
  Shield,
  Dumbbell,
  Wine,
  Volume2,
  Star,
  Check,
  CalendarDays,
  Home,
} from "lucide-react";
import { roomService } from "../../services/roomService";
import type { Room } from "../../services/roomService";
import { getImageUrl } from "../../services/api";
import { toast } from "react-hot-toast";

const iconMap: Record<string, React.ElementType> = {
  "Free Wi-Fi": Wifi,
  "Smart TV": Tv,
  "Air Conditioning": Wind,
  "Mini Bar": Coffee,
  "Pool Access": Waves,
  "Spa Access": Sparkles,
  "Room Service": UtensilsCrossed,
  "Free Parking": Car,
  "Gym Access": Dumbbell,
  Soundproofing: Volume2,
  "Fine Wine": Wine,
  "Daily Cleaning": Shield,
};

const DEFAULT_AMENITIES = [
  "Air Conditioning",
  "High-Speed Wi-Fi",
  "Smart Television",
  "Mini Refrigerator",
  "In-Room Safe",
  "Daily Housekeeping",
  "Complimentary Toiletries",
  "Tea & Coffee Maker",
];

const DEFAULT_INCLUDED = [
  "Daily breakfast for registered guests",
  "High-speed Wi-Fi throughout the room",
  "Daily housekeeping and turndown service",
  "Complimentary bottled water on arrival",
];

const DEFAULT_SERVICES = [
  "24/7 front desk concierge",
  "Luggage storage and assistance",
  "Airport transfer on request",
  "Laundry and dry-cleaning service",
];

const formatBedType = (bedType?: string) => {
  if (!bedType) return "1 King Size Bed";
  const label = bedType.charAt(0).toUpperCase() + bedType.slice(1);
  return `1 ${label} Bed`;
};

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-georgia text-xl font-bold text-primary-gold md:text-2xl">{children}</h2>
);

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="mt-4 space-y-2.5">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-neutral-text-secondary">
        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-green" />
        {item}
      </li>
    ))}
  </ul>
);

export const RoomDetailspage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [bookingDates, setBookingDates] = useState({ checkIn: "", checkOut: "" });
  const [guests, setGuests] = useState({ adults: 1, children: 0 });

  useEffect(() => {
    const fetchRoom = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await roomService.getRoomById(slug);
        if (res.success) setRoom(res.data);
      } catch {
        toast.error("Failed to load room details");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
    window.scrollTo(0, 0);
  }, [slug]);

  const images = useMemo(() => {
    if (!room?.images?.length) {
      return ["https://images.unsplash.com/photo-1566665797739-1674de7a421a"];
    }
    return room.images.map((img) => getImageUrl(img.url));
  }, [room]);

  const amenities = useMemo(() => {
    if (room?.amenities?.length) return room.amenities.map((a) => a.name);
    return DEFAULT_AMENITIES;
  }, [room]);

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
    const service = baseTotal * 0.1;
    const tax = baseTotal * 0.13;
    return { nights, baseTotal, service, tax, grandTotal: baseTotal + service + tax };
  }, [bookingDates, room]);

  const availabilityDays = useMemo(() => {
    const days: { date: Date; label: string; available: boolean }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push({
        date: d,
        label: d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" }),
        available: room?.status === "available",
      });
    }
    return days;
  }, [room?.status]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary-green" />
        <p className="text-sm font-medium text-neutral-text-secondary">Loading room details...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container-custom section-padding flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h2 className="mb-4 font-georgia text-2xl font-bold text-primary-dark">Room Unavailable</h2>
        <Link
          to="/rooms"
          className="rounded-full bg-primary-dark px-8 py-3 text-sm font-bold text-primary-gold transition-colors hover:bg-primary-green hover:text-white"
        >
          Browse All Rooms
        </Link>
      </div>
    );
  }

  const reviewsList = room.roomType?.reviews || [];
  const ratingSummary = room.ratingSummary || { averageRating: 0, totalReviews: 0 };
  const formattedPrice = Number(room.basePrice).toLocaleString();
  const isAvailable = room.status === "available";
  const bookingUrl = `/booking?room=${room.id}&checkIn=${bookingDates.checkIn}&checkOut=${bookingDates.checkOut}&adults=${guests.adults}&children=${guests.children}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="bg-gradient-to-r from-primary-dark via-primary-green to-primary-dark py-10 md:py-12">
        <div className="container-custom">
          <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/60">
            <Link to="/" className="inline-flex items-center gap-1 transition-colors hover:text-primary-gold">
              <Home size={12} />
              Home
            </Link>
            <ChevronRight size={12} className="text-white/30" />
            <Link to="/rooms" className="transition-colors hover:text-primary-gold">
              Rooms
            </Link>
            <ChevronRight size={12} className="text-white/30" />
            <span className="text-primary-gold">{room.name}</span>
          </nav>
          <h1 className="font-georgia text-3xl font-bold leading-tight text-white md:text-4xl lg:text-[2.5rem]">
            {room.name}
          </h1>
        </div>
      </div>

      <div className="container-custom py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
          {/* Main column */}
          <div className="space-y-10 lg:col-span-2">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-light shadow-[0_8px_32px_rgba(20,83,45,0.08)]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={images[activeImage]}
                    alt={room.name}
                    className="h-full w-full object-cover"
                  />
                </AnimatePresence>
                {room.videos?.[0] && (
                  <button
                    type="button"
                    onClick={() => setShowVideo(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100"
                    aria-label="Play room video tour"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-xl">
                      <Play size={22} className="ml-1 text-primary-dark" fill="currentColor" />
                    </span>
                  </button>
                )}
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                  {images.slice(0, 5).map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      aria-label={`View image ${i + 1}`}
                      className={`aspect-[4/3] overflow-hidden rounded-xl border-2 transition-all ${
                        i === activeImage
                          ? "border-primary-green shadow-md"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* About */}
            <section>
              <SectionHeading>About This Room</SectionHeading>
              <p className="mt-4 text-[15px] leading-[1.85] text-neutral-text-secondary">
                {room.description ||
                  "Our rooms are designed to offer the ultimate retreat after a long day. Experience unmatched tranquility combined with state-of-the-art facilities, premium bedding, and thoughtful touches throughout."}
              </p>
            </section>

            <section>
              <SectionHeading>What&apos;s Included</SectionHeading>
              <BulletList items={DEFAULT_INCLUDED} />
            </section>

            <section>
              <SectionHeading>Room Amenities</SectionHeading>
              <BulletList items={amenities} />
            </section>

            <section>
              <SectionHeading>Services &amp; Facilities</SectionHeading>
              <BulletList items={DEFAULT_SERVICES} />
            </section>

            {room.view && (
              <section>
                <SectionHeading>Room View</SectionHeading>
                <p className="mt-4 text-[15px] leading-relaxed text-neutral-text-secondary">
                  Enjoy a beautiful {room.view.toLowerCase()} view from your private sanctuary.
                </p>
              </section>
            )}

            {/* Amenities grid */}
            <section className="rounded-2xl border border-neutral-border/60 bg-neutral-light/40 p-6 md:p-8">
              <h2 className="font-georgia text-xl font-bold text-primary-dark md:text-2xl">Room Amenities</h2>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {(room.amenities?.length ? room.amenities : DEFAULT_AMENITIES.map((name) => ({ name }))).map(
                  (a, i) => {
                    const name = typeof a === "string" ? a : a.name;
                    const Icon = iconMap[name] || ShieldCheck;
                    return (
                      <div
                        key={`${name}-${i}`}
                        className="flex items-center gap-2.5 rounded-xl border border-neutral-border/50 bg-white px-3.5 py-3 text-[12px] font-semibold text-primary-dark shadow-sm"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-green/10">
                          <Icon size={13} className="text-primary-green" />
                        </span>
                        <span className="leading-snug">{name}</span>
                      </div>
                    );
                  }
                )}
              </div>
            </section>

            {/* Room features */}
            <section>
              <h2 className="font-georgia text-xl font-bold text-primary-dark md:text-2xl">Room Features</h2>
              <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  { icon: Maximize, label: "Room Size", value: room.size ? `${room.size} sq ft` : "Spacious" },
                  { icon: BedDouble, label: "Beds", value: formatBedType(room.bedType) },
                  { icon: Bath, label: "Bathroom", value: "1 En-suite" },
                  { icon: Users, label: "Occupancy", value: `Up to ${room.capacity} Guests` },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-neutral-border/60 bg-white px-5 py-5 text-center shadow-[0_4px_20px_rgba(20,83,45,0.05)]"
                  >
                    <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary-green/10">
                      <Icon size={20} className="text-primary-green" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-text-secondary">{label}</p>
                    <p className="mt-1.5 text-sm font-bold text-primary-dark">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            {reviewsList.length > 0 && (
              <section>
                <div className="mb-5 flex items-center gap-2">
                  <SectionHeading>Guest Reviews</SectionHeading>
                  <div className="flex items-center gap-1 text-primary-gold">
                    <Star size={16} className="fill-current" />
                    <span className="text-sm font-bold text-primary-dark">
                      {ratingSummary.averageRating.toFixed(1)} ({ratingSummary.totalReviews})
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  {reviewsList.slice(0, 4).map((r) => (
                    <div key={r.id} className="rounded-2xl border border-neutral-border/50 bg-neutral-light/50 p-5">
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-dark text-[10px] font-bold uppercase text-white">
                          {r.guest?.firstName?.charAt(0)}
                          {r.guest?.lastName?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-primary-dark">
                            {r.guest?.firstName} {r.guest?.lastName}
                          </p>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={10}
                                className={i < r.rating ? "fill-primary-gold text-primary-gold" : "text-neutral-border"}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-neutral-text-secondary">
                        &ldquo;{r.comment || "A wonderful experience!"}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Booking sidebar */}
          <div>
            <div className="sticky top-28">
              <div className="overflow-hidden rounded-2xl border border-neutral-border/60 bg-white shadow-[0_12px_48px_rgba(20,83,45,0.10)]">
                {/* Price header */}
                <div className="bg-gradient-to-r from-primary-dark to-primary-green px-6 py-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Starting from</p>
                  <div className="mt-1 font-georgia leading-none text-white">
                    <span className="text-sm text-white/70">NPR </span>
                    <span className="text-3xl font-bold text-primary-gold">{formattedPrice}</span>
                    <span className="text-sm text-white/70"> /night</span>
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-text-secondary">
                      Check-in &amp; Check-out
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        title="Check-in date"
                        value={bookingDates.checkIn}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setBookingDates((p) => ({ ...p, checkIn: e.target.value }))}
                        className="input-field h-11 text-xs font-semibold text-primary-dark"
                      />
                      <input
                        type="date"
                        title="Check-out date"
                        value={bookingDates.checkOut}
                        min={bookingDates.checkIn || new Date().toISOString().split("T")[0]}
                        onChange={(e) => setBookingDates((p) => ({ ...p, checkOut: e.target.value }))}
                        className="input-field h-11 text-xs font-semibold text-primary-dark"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-text-secondary">
                        Adults
                      </label>
                      <select
                        title="Number of adults"
                        value={guests.adults}
                        onChange={(e) => setGuests((p) => ({ ...p, adults: Number(e.target.value) }))}
                        className="input-field h-11 text-xs font-semibold text-primary-dark"
                      >
                        {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-text-secondary">
                        Children
                      </label>
                      <select
                        title="Number of children"
                        value={guests.children}
                        onChange={(e) => setGuests((p) => ({ ...p, children: Number(e.target.value) }))}
                        className="input-field h-11 text-xs font-semibold text-primary-dark"
                      >
                        {[0, 1, 2, 3].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {bookingDates.checkIn && bookingDates.checkOut && (
                    <div className="space-y-2.5 border-t border-neutral-border/60 pt-4 text-sm">
                      <div className="flex justify-between text-neutral-text-secondary">
                        <span>
                          Room ({calculation.nights} night{calculation.nights > 1 ? "s" : ""})
                        </span>
                        <span className="font-semibold text-primary-dark">
                          NPR {calculation.baseTotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-neutral-text-secondary">
                        <span>Service charge (10%)</span>
                        <span>NPR {calculation.service.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-neutral-text-secondary">
                        <span>Tax (13%)</span>
                        <span>NPR {calculation.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-neutral-border/60 pt-3 font-bold text-primary-dark">
                        <span>Total</span>
                        <span className="text-primary-green">NPR {calculation.grandTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {isAvailable ? (
                    <Link
                      to={bookingUrl}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary-dark text-[12px] font-bold uppercase tracking-widest text-primary-gold shadow-md transition-all hover:bg-primary-green hover:text-white"
                    >
                      Book Now
                      <ChevronRight size={16} />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="flex h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-neutral-border text-[12px] font-bold uppercase tracking-widest text-neutral-text-secondary"
                    >
                      Currently Unavailable
                    </button>
                  )}

                  <div className="flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-text-secondary">
                    <Shield size={13} className="text-primary-green" />
                    Secure booking · Instant confirmation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Availability status */}
        <section className="mt-14 rounded-2xl border border-neutral-border/60 bg-neutral-light/30 p-6 md:p-8">
          <div className="mb-6 flex items-center gap-2">
            <CalendarDays size={20} className="text-primary-green" />
            <h2 className="font-georgia text-xl font-bold text-primary-dark md:text-2xl">Availability Status</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-7 lg:grid-cols-14">
            {availabilityDays.map(({ date, label, available }) => (
              <div
                key={date.toISOString()}
                className={`rounded-xl border px-3 py-3 text-center transition-colors ${
                  available
                    ? "border-primary-green/20 bg-white"
                    : "border-neutral-border/40 bg-neutral-light opacity-60"
                }`}
              >
                <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-text-secondary">{label}</p>
                <div className="mt-2 flex items-center justify-center gap-1">
                  {available ? (
                    <>
                      <Check size={12} className="text-primary-green" strokeWidth={3} />
                      <span className="text-[10px] font-bold text-primary-green">Open</span>
                    </>
                  ) : (
                    <span className="text-[10px] font-bold text-neutral-text-secondary">Full</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Video modal */}
      <AnimatePresence>
        {showVideo && room.videos?.[0] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowVideo(false)}
                className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/80"
                aria-label="Close video"
              >
                <X size={20} />
              </button>
              {(() => {
                const videoUrl = room.videos?.[0].url || "";
                const isExternal =
                  videoUrl.startsWith("http") || videoUrl.includes("youtube") || videoUrl.includes("vimeo");
                const fullUrl = getImageUrl(videoUrl);
                if (isExternal) {
                  const embedUrl = videoUrl.includes("youtube.com/watch?v=")
                    ? videoUrl.replace("watch?v=", "embed/")
                    : videoUrl;
                  return (
                    <iframe
                      title="Room video tour"
                      src={embedUrl}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  );
                }
                return <video src={fullUrl} className="h-full w-full" controls autoPlay poster={images[0]} />;
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
