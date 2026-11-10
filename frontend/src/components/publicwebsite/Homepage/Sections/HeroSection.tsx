import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  BedDouble,
  Tag,
  CalendarCheck,
  Search,
  ChevronDown,
} from "lucide-react";
import { roomTypeService, type RoomType } from "../../../../services/roomTypeService";

/* ─────────────────── Slide data ─────────────────── */
const slides = [
  {
    image: "/hero122.png",
    imagePosition: "object-[center_28%]",
    badge: "ITAHARI NAMUNA · ITAHARI, SUNSARI",
    title: "A comfortable stay in Itahari",
    subtitle:
      "Find a room for your visit, compare nightly rates, and plan your stay with us.",
  },
  {
    image: "/hero11.png",
    imagePosition: "object-[center_35%]",
    badge: "ROOMS FOR YOUR VISIT",
    title: "Make Itahari your next stop",
    subtitle:
      "Browse room types and choose the option that works for your plans and budget.",
  },
];

const AUTO_PLAY_MS = 6500;

/* ─────────────────── Transition phases ─────────────────── */
type Phase = "idle" | "out" | "in";

/* ─────────────────── Custom Select Dropdown ─────────────────── */
interface DropdownOption {
  value: string;
  label: string;
}
interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
}
const CustomSelect = ({ value, onChange, options, placeholder }: CustomSelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full text-left cursor-pointer group rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary-green/25 focus-visible:ring-offset-1"
      >
        <span className="text-[#14532D] font-semibold text-[13px] leading-snug truncate">
          {selected ? selected.label : placeholder ?? "Select..."}
        </span>
        <ChevronDown
          size={13}
          className={`ml-1 text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-full lg:w-[180px] bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-50 overflow-hidden py-1 animate-fadeIn">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors duration-150 cursor-pointer ${
                opt.value === value
                  ? "text-[#14532D] bg-amber-50 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────── Component ─────────────────── */
const HeroSection = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoomType, setSelectedRoomType] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("15000");

  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await roomTypeService.getAllRoomTypes();
        if (res.success && res.data.roomTypes) setRoomTypes(res.data.roomTypes);
      } catch (e) {
        console.error("HeroSection: failed to load room types", e);
      }
    };
    fetchRooms();
  }, []);

  const goTo = useCallback((idx: number) => {
    if (isBusy || idx === current) return;
    setIsBusy(true);
    setPhase("out");

    setTimeout(() => {
      setCurrent(idx);
      setPhase("in");
      setTimeout(() => {
        setPhase("idle");
        setIsBusy(false);
      }, 500);
    }, 220);
  }, [current, isBusy]);

  const goPrev = useCallback(
    () => goTo((current - 1 + slides.length) % slides.length),
    [current, goTo]
  );
  const goNext = useCallback(
    () => goTo((current + 1) % slides.length),
    [current, goTo]
  );

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      if (!isBusy) goNext();
    }, AUTO_PLAY_MS);
    return () => window.clearInterval(timer);
  }, [goNext, isBusy, prefersReducedMotion]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedRoomType && selectedRoomType !== "all") {
      params.set("type", selectedRoomType);
    }
    if (selectedPrice !== "15000") params.set("maxPrice", selectedPrice);
    const query = params.toString();
    navigate(`/rooms${query ? `?${query}` : ""}`);
  };

  const contentClass =
    phase === "out"
      ? "opacity-0 translate-y-3"
      : phase === "in"
      ? "opacity-0 translate-y-3"
      : "opacity-100 translate-y-0";

  const priceOptions: DropdownOption[] = [
    { value: "15000", label: "Any price" },
    { value: "3000", label: "Under Rs. 3,000" },
    { value: "5000", label: "Under Rs. 5,000" },
    { value: "10000", label: "Under Rs. 10,000" },
    { value: "15000", label: "Under Rs. 15,000" },
  ];

  const roomTypeOptions: DropdownOption[] = [
    { value: "all", label: "All Room Types" },
    ...roomTypes.map((rt) => ({ value: rt.name, label: rt.name })),
  ];

  return (
    <section className="relative w-full overflow-visible bg-primary-dark lg:h-[75vh] lg:min-h-[560px] lg:max-h-[760px]">

      {/* ── Slide backgrounds ── */}
      <div className="relative max-lg:h-[min(70vh,540px)] max-lg:min-h-[480px] lg:absolute lg:inset-0 overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`hero-slide${i === current ? " is-active" : ""}`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              fetchPriority={i === 0 ? "high" : "auto"}
              loading={i === 0 ? "eager" : "lazy"}
              className={`hero-slide-image ${slide.imagePosition}${i === current ? " is-active" : ""}`}
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#10281f]/85 via-[#10281f]/55 to-[#10281f]/15" />
            <div className="absolute inset-0 bg-linear-to-t from-[#10281f]/55 via-transparent to-[#10281f]/10" />
          </div>
        ))}
      </div>

      {/* ── Centered content ── */}
      <div className="absolute inset-0 z-10 flex flex-col items-center px-6 text-center max-lg:justify-start max-lg:pt-20 max-lg:pb-4 sm:px-10 lg:h-full lg:justify-center lg:px-16 xl:px-24">
        <div
          className={`w-full max-w-3xl transition-all duration-500 ease-out ${contentClass}`}
        >
          <div className="mb-4 inline-flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 max-lg:mb-3 lg:mb-5">
            <span className="h-px w-8 bg-primary-gold" />
            {slides[current].badge}
          </div>

          <h1 className="mb-4 max-w-2xl font-georgia text-[clamp(2.5rem,5vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.035em] text-white drop-shadow-[0_3px_20px_rgba(0,0,0,0.28)] max-lg:mb-3 lg:mb-5">
            {slides[current].title}
          </h1>

          <p className="mx-auto mb-6 max-w-xl text-sm font-normal leading-7 text-white/85 drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] max-lg:mb-7 lg:mb-8 lg:text-base">
            {slides[current].subtitle}
          </p>

          <div className="mb-5 flex flex-wrap items-center justify-center gap-3 max-lg:mb-4 lg:mb-10">
            <Link
              to="/rooms"
              className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary-gold px-6 py-3 text-sm font-semibold text-primary-dark shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#c49b4b] hover:shadow-lg active:translate-y-0"
            >
              <BedDouble size={15} />
              <span>Explore Rooms</span>
            </Link>

            <Link
              to="/booking"
              className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/55 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white hover:text-primary-dark"
            >
              <CalendarCheck size={15} />
              <span>Book Now</span>
            </Link>
          </div>

          <div className="flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === current ? "true" : undefined}
                className="group py-2 cursor-pointer"
              >
                <div
                  className={`h-[3px] rounded-full transition-all duration-500 ${
                    i === current
                      ? "w-9 max-lg:w-8 bg-primary-gold shadow-[0_0_10px_rgba(245,158,11,0.65)]"
                      : "w-4 max-lg:w-3 bg-white/35 group-hover:bg-white/60"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Arrow navigation ── */}
      <button
        onClick={goPrev}
        disabled={isBusy}
        className="absolute left-8 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/35 text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:border-white/60 hover:bg-black/55 active:scale-95 disabled:opacity-40 lg:flex"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={goNext}
        disabled={isBusy}
        className="absolute right-8 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/35 text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:border-white/60 hover:bg-black/55 active:scale-95 disabled:opacity-40 lg:flex"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* ── Availability Search Bar ── */}
      <div className="relative z-30 w-[94%] max-w-[1080px] mx-auto max-lg:mt-3 max-lg:mb-4 lg:absolute lg:mt-0 lg:bottom-[-44px] lg:left-1/2 lg:-translate-x-1/2 lg:mb-0">
        <div className="bg-white rounded-xl shadow-lg border border-neutral-border/70 px-5 py-4 lg:px-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center">

            <div className="flex items-center gap-3 flex-1 min-w-0 py-3 lg:py-0 lg:pr-5 border-b lg:border-b-0 lg:border-r border-neutral-border">
              <div className="w-9 h-9 bg-primary-green/5 rounded-lg flex items-center justify-center text-primary-green shrink-0">
                <BedDouble size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-medium text-neutral-text-secondary mb-1">
                  Room Type
                </span>
                <CustomSelect
                  value={selectedRoomType}
                  onChange={setSelectedRoomType}
                  options={roomTypeOptions}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 flex-1 min-w-0 py-3 lg:py-0 lg:px-5">
              <div className="w-9 h-9 bg-primary-green/5 rounded-lg flex items-center justify-center text-primary-green shrink-0">
                <Tag size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-medium text-neutral-text-secondary mb-1">
                  Maximum nightly rate
                </span>
                <CustomSelect
                  value={selectedPrice}
                  onChange={setSelectedPrice}
                  options={priceOptions}
                />
              </div>
            </div>

            <div className="pt-3 lg:pt-0 lg:pl-5 shrink-0">
              <button
                onClick={handleSearch}
                className="w-full lg:w-auto flex items-center justify-center gap-2 h-11 px-6 bg-primary-green hover:bg-primary-dark text-white font-semibold text-sm rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-primary-green/45 focus-visible:ring-offset-2"
              >
                <Search size={14} strokeWidth={2.5} />
                <span>Search</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
