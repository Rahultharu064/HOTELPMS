import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/Button";
import { roomService, type Room } from "../../services/roomService";
import { roomTypeService, type RoomType } from "../../services/roomTypeService";
import { getImageUrl } from "../../services/api";
import { ApiStatus } from "../../components/ui/ApiStatus";
import { RoomCardSkeleton } from "../../components/ui/skeletons/PageSkeletons";

import { Users, BedDouble, Maximize, Star, SlidersHorizontal, X, ArrowRight } from "lucide-react";
import PageHero from "../../components/publicwebsite/Homepage/layout/PageHero";
import { prefetchRoomDetails } from "../../utils/prefetchRoomDetails";

const ROOMS_HERO =
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1920&q=80";

const isSuiteRoom = (room: Room) =>
  /suite/i.test(room.roomType?.name || "") || /suite/i.test(room.name || "");

const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 22 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    className="h-full"
  >
    {children}
  </motion.div>
);

export const Roompage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type");
  const [stayKind, setStayKind] = useState<"rooms" | "suites">(
    /suite/i.test(initialType || "") ? "suites" : "rooms"
  );
  const [typeFilters, setTypeFilters] = useState<string[]>(initialType ? [initialType] : []);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [showFilters, setShowFilters] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [roomsRes, typesRes] = await Promise.all([
        roomService.getAllRooms(),
        roomTypeService.getAllRoomTypes(),
      ]);
      if (roomsRes.success) setRooms(roomsRes.data);
      if (typesRes.success) setRoomTypes(typesRes.data.roomTypes);
    } catch (err: any) {
      console.error("Failed to fetch room data:", err);
      const message = err?.message || err?.response?.data?.message || "Failed to load rooms";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const t = searchParams.get("type");
    if (t) {
      setTypeFilters([t]);
      setStayKind(/suite/i.test(t) ? "suites" : "rooms");
    }
  }, [searchParams]);

  const toggleType = (t: string) => {
    setTypeFilters((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const visibleTypes = useMemo(
    () =>
      roomTypes.filter((t) =>
        stayKind === "suites" ? /suite/i.test(t.name) : !/suite/i.test(t.name)
      ),
    [roomTypes, stayKind]
  );

  const filteredRooms = rooms.filter((r) => {
    if (stayKind === "suites" && !isSuiteRoom(r)) return false;
    if (stayKind === "rooms" && isSuiteRoom(r)) return false;
    const typeName = r.roomType?.name || "";
    if (typeFilters.length > 0 && !typeFilters.includes(typeName)) return false;
    if (Number(r.basePrice) > maxPrice) return false;
    return true;
  });

  const FilterPanel = () => (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4 border-b border-neutral-border pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-dark">
          {stayKind === "suites" ? "Suite category" : "Room category"}
        </h4>
        <div className="space-y-3">
          {(visibleTypes.length ? visibleTypes : roomTypes).map((t) => (
            <label
              key={t.id}
              className="group flex cursor-pointer items-center gap-3 text-sm font-medium text-neutral-text-secondary hover:text-primary-green"
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={typeFilters.includes(t.name)}
                  onChange={() => toggleType(t.name)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-sm border-2 border-neutral-border accent-primary-green transition-all checked:border-primary-green checked:bg-primary-green"
                />
                <svg
                  className="pointer-events-none absolute h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="capitalize">{t.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-4 flex items-center justify-between border-b border-neutral-border pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-dark">
          <span>Max price</span>
          <span className="rounded bg-primary-green/10 px-2 py-0.5 font-mono-data text-primary-green">
            Rs. {maxPrice.toLocaleString()}
          </span>
        </h4>
        <div className="pt-2">
          <input
            type="range"
            title="Max Price"
            aria-label="Max Price"
            min={100}
            max={15000}
            step={100}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-neutral-border accent-primary-green outline-none"
          />
          <div className="mt-3 flex justify-between text-[10px] font-semibold uppercase tracking-widest text-neutral-text-secondary">
            <span>Rs. 100</span>
            <span>Rs. 15,000</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 border-t border-neutral-border/50 pt-4 lg:hidden">
        <Button size="md" variant="primary" className="flex-1 font-semibold" onClick={() => setShowFilters(false)}>
          Apply ({filteredRooms.length})
        </Button>
        <Button
          size="md"
          variant="outline"
          className="flex-1 font-semibold"
          onClick={() => {
            setTypeFilters([]);
            setMaxPrice(15000);
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-neutral-light pb-24 lg:pb-16">
      <PageHero
        title={stayKind === "suites" ? "Our Signature Suites" : "Our Signature Rooms"}
        subtitle={
          stayKind === "suites"
            ? "Spacious living rooms, separate sitting areas, and the extra quiet of a suite stay."
            : "Find a room that fits the night — city views, proper beds, and the little details that make a stay easy."
        }
        image={ROOMS_HERO}
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: stayKind === "suites" ? "Suites" : "Rooms" },
        ]}
        tabs={[
          { id: "rooms", label: "Rooms" },
          { id: "suites", label: "Suites" },
        ]}
        activeTab={stayKind}
        onTabChange={(id) => {
          setStayKind(id === "suites" ? "suites" : "rooms");
          setTypeFilters([]);
        }}
      />

      <div className="container-custom relative z-20 pt-8 md:pt-10">
        <div className="relative mb-6 flex items-center justify-between overflow-hidden rounded-xl border border-neutral-border/70 bg-white p-4 shadow-sm lg:hidden">
          <span className="text-sm font-semibold text-primary-dark">
            {filteredRooms.length} {stayKind === "suites" ? "suites" : "rooms"}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(true)}
            className="border-neutral-border font-semibold text-primary-dark"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] flex flex-col overflow-auto bg-white p-6 lg:hidden"
            >
              <div className="mb-8 flex items-center justify-between border-b border-neutral-border pb-4">
                <h3 className="font-georgia text-2xl text-primary-dark">Refine search</h3>
                <button
                  title="Close filters"
                  aria-label="Close filters"
                  onClick={() => setShowFilters(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-light text-primary-dark"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <FilterPanel />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="lg:grid lg:grid-cols-[17rem_1fr] lg:items-start lg:gap-10 xl:gap-12">
          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <div className="relative overflow-hidden rounded-xl border border-neutral-border/80 bg-white p-7 shadow-sm">
              <div className="absolute left-0 top-0 h-full w-[3px] bg-[#C9A84C]" />
              <h3 className="mb-7 flex items-center gap-2.5 text-lg font-semibold tracking-tight text-primary-dark">
                <SlidersHorizontal className="h-4 w-4 text-primary-green" />
                Refine search
              </h3>
              <FilterPanel />
            </div>
          </aside>

          <div className="min-h-0">
            {error ? (
              <ApiStatus status="error" errorMessage={error} onRetry={fetchData} />
            ) : (
              <>
                <div className="mb-6 hidden items-end justify-between border-b border-neutral-border/70 pb-4 lg:flex">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-gold">
                      {stayKind === "suites" ? "Suites" : "Rooms"}
                    </p>
                    <p className="mt-1 font-georgia text-xl text-primary-dark">
                      {filteredRooms.length} curated {stayKind === "suites" ? "suites" : "rooms"}
                    </p>
                  </div>
                  {(typeFilters.length > 0 || maxPrice < 15000) && (
                    <button
                      type="button"
                      onClick={() => {
                        setTypeFilters([]);
                        setMaxPrice(15000);
                      }}
                      className="text-[11px] font-semibold uppercase tracking-wider text-primary-green hover:text-primary-dark"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                {loading ? (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <RoomCardSkeleton key={i} delay={i * 0.07} />
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {filteredRooms.map((room, i) => {
                        const primaryImage =
                          room.images?.find((img) => img.isPrimary)?.url ||
                          room.images?.[0]?.url ||
                          "https://images.unsplash.com/photo-1566665797739-1674de7a421a";
                        const imageUrl = getImageUrl(primaryImage);
                        const rating = room.ratingSummary?.averageRating
                          ? room.ratingSummary.averageRating.toFixed(1)
                          : "5.0";

                        return (
                          <ScrollReveal key={room.id} delay={Math.min(i * 0.06, 0.3)}>
                            <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-border/80 bg-white shadow-sm transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(20,40,30,0.10)]">
                              <Link
                                to={`/rooms/${room.slug}`}
                                onMouseEnter={prefetchRoomDetails}
                                className="relative block aspect-[4/3] overflow-hidden bg-neutral-light"
                              >
                                <img
                                  src={imageUrl}
                                  alt={room.name}
                                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                <div className="absolute left-4 top-4 flex gap-2">
                                  <span className="rounded bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-dark">
                                    {room.roomType?.name}
                                  </span>
                                  {Number(room.basePrice) >= 5000 && (
                                    <span className="rounded bg-[#C9A84C] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#1A1A2E]">
                                      Premium
                                    </span>
                                  )}
                                </div>
                                <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                                  <Star className="h-3 w-3 fill-[#C9A84C] text-[#C9A84C]" /> {rating}
                                </div>
                                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                                  <h3 className="font-georgia text-xl leading-tight text-white">{room.name}</h3>
                                  <p className="shrink-0 text-right">
                                    <span className="block text-[9px] font-semibold uppercase tracking-widest text-white/70">
                                      From
                                    </span>
                                    <span className="font-mono-data text-sm font-semibold text-[#C9A84C]">
                                      Rs. {Number(room.basePrice).toLocaleString()}
                                    </span>
                                  </p>
                                </div>
                              </Link>

                              <div className="flex flex-1 flex-col p-5">
                                <p className="mb-5 line-clamp-2 flex-1 text-[13px] leading-relaxed text-neutral-text-secondary">
                                  {room.description}
                                </p>

                                <div className="mb-5 grid grid-cols-3 gap-2 border-y border-neutral-border/70 py-3">
                                  <div className="flex flex-col items-center gap-1 text-[11px] font-medium text-primary-dark">
                                    <Users className="h-3.5 w-3.5 text-primary-green" />
                                    {room.capacity}
                                  </div>
                                  <div className="flex flex-col items-center gap-1 border-x border-neutral-border/70 text-[11px] font-medium text-primary-dark">
                                    <BedDouble className="h-3.5 w-3.5 text-primary-gold" />
                                    <span className="w-full truncate text-center" title={room.bedType}>
                                      {room.bedType || "Queen"}
                                    </span>
                                  </div>
                                  <div className="flex flex-col items-center gap-1 text-[11px] font-medium text-primary-dark">
                                    <Maximize className="h-3.5 w-3.5" />
                                    {room.size || 30}m²
                                  </div>
                                </div>

                                <div className="mt-auto flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 rounded-md text-xs font-semibold"
                                    asChild
                                    to={`/rooms/${room.slug}`}
                                  >
                                    Details
                                  </Button>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    className="flex-1 rounded-md text-xs font-semibold"
                                    asChild
                                    to={`/booking?room=${room.id}`}
                                  >
                                    Reserve <ArrowRight className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            </article>
                          </ScrollReveal>
                        );
                      })}
                    </div>

                    {filteredRooms.length === 0 && (
                      <div className="relative mt-4 overflow-hidden rounded-xl border border-dashed border-neutral-border bg-white py-20 text-center">
                        <h3 className="font-georgia text-2xl text-primary-dark">Nothing in this range</h3>
                        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-neutral-text-secondary">
                          No {stayKind} match the current filters. Broaden the price or switch category.
                        </p>
                        <Button
                          onClick={() => {
                            setTypeFilters([]);
                            setMaxPrice(15000);
                          }}
                          variant="outline"
                          className="relative z-10 mt-8 rounded-md px-8 font-semibold"
                        >
                          Clear filters
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
