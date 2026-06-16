import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    image: "/hero1.png",
    badge: "WELCOME TO ITAHARI NAMUNA PMS",
    title: "Best Stay in Itahari",
    subtitle:
      "Experience warm hospitality, elegant spaces, and timeless comfort in the heart of Sunsari.",
  },
  {
    image: "/hero2.png",
    badge: "EXPERIENCE ROYAL LUXURY",
    title: "World-Class Comfort",
    subtitle:
      "Redefining hospitality with state-of-the-art services and premium accommodations.",
  },
  {
    image: "/hero3.png",
    badge: "YOUR PERFECT ESCAPE",
    title: "Luxury Rooms & Suites",
    subtitle:
      "Discover your private sanctuary designed meticulously for the modern luxury traveler.",
  },
];

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
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoomType, setSelectedRoomType] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("any");
  const [checkInDate, setCheckInDate] = useState("");

  const isBusy = useRef(false);

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
    if (isBusy.current || idx === current) return;
    isBusy.current = true;
    setPhase("out");

    setTimeout(() => {
      setCurrent(idx);
      setPhase("in");
      setTimeout(() => {
        setPhase("idle");
        isBusy.current = false;
      }, 500);
    }, 220);
  }, [current]);

  const goPrev = useCallback(
    () => goTo((current - 1 + slides.length) % slides.length),
    [current, goTo]
  );
  const goNext = useCallback(
    () => goTo((current + 1) % slides.length),
    [current, goTo]
  );

  const handleSearch = () => {
    let query = "";
    if (selectedRoomType && selectedRoomType !== "all") {
      query += `?type=${encodeURIComponent(selectedRoomType)}`;
    }
    navigate(`/rooms${query}`);
  };

  const scrollToContent = () => {
    const target = document.getElementById("homepage-content");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.75, behavior: "smooth" });
    }
  };

  const contentClass =
    phase === "out"
      ? "opacity-0 translate-y-3"
      : phase === "in"
      ? "opacity-0 translate-y-3"
      : "opacity-100 translate-y-0";

  const priceOptions: DropdownOption[] = [
    { value: "any", label: "Any Price" },
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
    <section className="relative w-full overflow-visible bg-[#F9FAFB] lg:bg-black max-lg:pb-0 lg:h-[75vh] lg:min-h-[560px] lg:max-h-[760px]">

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
              className={`hero-slide-image${i === current ? " is-active" : ""}`}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
          </div>
        ))}
        <div className="absolute inset-x-0 bottom-0 h-24 max-lg:h-20 bg-gradient-to-t from-[#F9FAFB] via-[#F9FAFB]/80 to-transparent pointer-events-none z-[2]" />
      </div>

      {/* ── Centered content ── */}
      <div className="absolute inset-0 z-10 flex flex-col max-lg:justify-start max-lg:pt-20 max-lg:pb-4 lg:h-full lg:justify-center items-center text-center px-6">
        <div
          className={`max-w-3xl w-full transition-all duration-500 ease-out ${contentClass}`}
        >
          <div className="inline-flex items-center gap-2 border border-primary-gold/40 text-primary-gold px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.28em] bg-white/5 backdrop-blur-sm mb-4 max-lg:mb-3 lg:mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-gold animate-pulse shrink-0" />
            {slides[current].badge}
          </div>

          <h1 className="text-white font-georgia text-[40px] leading-[1.06] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3 max-lg:mb-3 lg:mb-4 drop-shadow-lg">
            {slides[current].title}
          </h1>

          <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-6 max-lg:mb-7 lg:mb-8 font-medium px-1">
            {slides[current].subtitle}
          </p>

          <div className="flex max-lg:flex-row max-lg:w-full max-lg:max-w-md max-lg:mx-auto flex-wrap gap-2.5 max-lg:gap-2 justify-center items-center mb-5 max-lg:mb-4 lg:mb-10">
            <Link
              to="/rooms"
              className="flex max-lg:flex-1 items-center justify-center gap-2 px-5 max-lg:px-4 py-3.5 max-lg:py-3 lg:px-7 lg:py-3 bg-primary-gold hover:bg-[#D97706] text-[#14532D] font-bold text-[10px] max-lg:text-[10px] lg:text-[11px] uppercase tracking-widest rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
            >
              <BedDouble size={15} />
              <span>Explore Rooms</span>
            </Link>

            <Link
              to="/booking"
              className="flex max-lg:flex-1 items-center justify-center gap-2 px-5 max-lg:px-4 py-3.5 max-lg:py-3 lg:px-7 lg:py-3 border-2 border-white/70 max-lg:bg-white/10 text-white hover:bg-white hover:text-[#14532D] hover:border-white font-bold text-[10px] max-lg:text-[10px] lg:text-[11px] uppercase tracking-widest rounded-full transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
            >
              <CalendarCheck size={15} />
              <span>Book Now</span>
            </Link>
          </div>

          <div className="hidden lg:flex gap-2.5 justify-center">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="group py-2 cursor-pointer"
              >
                <div
                  className={`h-[3px] rounded-full transition-all duration-500 ${
                    i === current
                      ? "w-10 bg-primary-gold shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                      : "w-5 bg-white/30 group-hover:bg-white/55"
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
        disabled={isBusy.current}
        className="absolute left-5 md:left-8 top-[38%] max-lg:top-[42%] lg:top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full border border-white/25 bg-black/25 hover:bg-black/55 backdrop-blur-sm flex items-center justify-center transition-all duration-250 hover:scale-110 hover:border-white/50 active:scale-90 text-white shadow-lg cursor-pointer disabled:opacity-40"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={goNext}
        disabled={isBusy.current}
        className="absolute right-5 md:right-8 top-[38%] max-lg:top-[42%] lg:top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full border border-white/25 bg-black/25 hover:bg-black/55 backdrop-blur-sm flex items-center justify-center transition-all duration-250 hover:scale-110 hover:border-white/50 active:scale-90 text-white shadow-lg cursor-pointer disabled:opacity-40"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* ── Scroll-down indicator (desktop only) ── */}
      <button
        onClick={scrollToContent}
        aria-label="Scroll down to content"
        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 hidden lg:flex flex-col items-center gap-1 group cursor-pointer"
      >
        <span className="text-white/50 text-[9px] uppercase tracking-[0.22em] font-semibold group-hover:text-white/80 transition-colors duration-300">
          Discover
        </span>
        <div className="w-[30px] h-[48px] rounded-full border-2 border-white/30 group-hover:border-white/60 flex items-start justify-center pt-[8px] transition-colors duration-300">
          <div className="w-[5px] h-[5px] rounded-full bg-white/60 group-hover:bg-white animate-scrollDot" />
        </div>
      </button>

      {/* ── Availability Search Bar ── */}
      <div className="relative z-30 w-[94%] max-w-[1080px] mx-auto max-lg:mt-2 max-lg:mb-3 lg:absolute lg:mt-0 lg:bottom-[-44px] lg:left-1/2 lg:-translate-x-1/2 lg:mb-0">
        <div className="bg-white max-lg:rounded-[28px] lg:rounded-2xl max-lg:shadow-[0_18px_60px_rgba(17,24,39,0.12)] lg:shadow-[0_16px_48px_rgba(20,83,45,0.10)] border border-primary-green/10 max-lg:border-neutral-border/40 max-lg:px-6 max-lg:py-5 lg:px-6 lg:py-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center">

            <div className="flex items-center gap-3 max-lg:gap-4 flex-1 min-w-0 py-3 max-lg:py-4 lg:py-0 lg:pr-5 border-b lg:border-b-0 lg:border-r border-primary-green/10">
              <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-primary-gold shrink-0">
                <BedDouble size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-[9px] font-black text-primary-gold uppercase tracking-[0.18em] mb-1">
                  Room Type
                </span>
                <CustomSelect
                  value={selectedRoomType}
                  onChange={setSelectedRoomType}
                  options={roomTypeOptions}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 max-lg:gap-4 flex-1 min-w-0 py-3 max-lg:py-4 lg:py-0 lg:px-5 border-b lg:border-b-0 lg:border-r border-primary-green/10">
              <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-primary-gold shrink-0">
                <Tag size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-[9px] font-black text-primary-gold uppercase tracking-[0.18em] mb-1">
                  Price Range
                </span>
                <CustomSelect
                  value={selectedPrice}
                  onChange={setSelectedPrice}
                  options={priceOptions}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 max-lg:gap-4 flex-1 min-w-0 py-3 max-lg:py-4 lg:py-0 lg:px-5 border-b lg:border-b-0 border-primary-green/10">
              <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-primary-gold shrink-0">
                <CalendarCheck size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-[9px] font-black text-primary-gold uppercase tracking-[0.18em] mb-1">
                  Check-in Date
                </span>
                <input
                  type="text"
                  placeholder="Select date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.type = "text";
                  }}
                  className="hero-date-input block w-full bg-transparent border-none text-[#14532D] font-semibold text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-0 p-0 cursor-pointer leading-snug"
                />
              </div>
            </div>

            <div className="pt-3 max-lg:pt-4 lg:pt-0 lg:pl-5 shrink-0">
              <button
                onClick={handleSearch}
                className="w-full lg:w-auto flex items-center justify-center gap-2 h-11 max-lg:h-12 px-7 max-lg:px-10 bg-[#14532D] hover:bg-primary-gold text-primary-gold hover:text-[#14532D] font-extrabold text-[10px] uppercase tracking-[0.22em] max-lg:tracking-[0.28em] rounded-xl max-lg:rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-primary-gold/45 focus-visible:ring-offset-2"
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
