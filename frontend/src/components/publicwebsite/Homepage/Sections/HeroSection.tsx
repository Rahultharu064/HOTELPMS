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
        className="flex items-center justify-between w-full text-left cursor-pointer group"
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
        <div className="absolute top-full left-0 mt-2 w-[180px] bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-50 overflow-hidden py-1 animate-fadeIn">
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

  // Search bar state
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoomType, setSelectedRoomType] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("any");
  const [checkInDate, setCheckInDate] = useState("");

  const isBusy = useRef(false);

  /* ── Room types ── */
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

  /* ── Slide engine ── */
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

  /* ── Content visibility classes ── */
  const contentClass =
    phase === "out"
      ? "opacity-0 translate-y-3"
      : phase === "in"
      ? "opacity-0 translate-y-3"
      : "opacity-100 translate-y-0";

  /* ── Price options ── */
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
    <section className="relative w-full h-[75vh] min-h-[560px] max-h-[760px] overflow-visible bg-black">

      {/* ── Slide backgrounds ── */}
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{
              opacity: i === current ? 1 : 0,
              zIndex: i === current ? 1 : 0,
            }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
              style={{
                transform: i === current ? "scale(1.04)" : "scale(1)",
                transition: "transform 8s ease-out",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
          </div>
        ))}
      </div>

      {/* ── Centered content ── */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
        <div
          className={`max-w-3xl w-full transition-all duration-500 ease-out ${contentClass}`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-primary-gold/40 text-primary-gold px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.28em] bg-white/5 backdrop-blur-sm mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-gold animate-pulse shrink-0" />
            {slides[current].badge}
          </div>

          {/* Heading */}
          <h1 className="text-white font-georgia text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-4 drop-shadow-lg">
            {slides[current].title}
          </h1>

          {/* Subtitle */}
          <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-8 font-medium">
            {slides[current].subtitle}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 justify-center items-center mb-10">
            <Link
              to="/rooms"
              className="flex items-center gap-2 px-7 py-3 bg-primary-gold hover:bg-[#D97706] text-[#14532D] font-bold text-[11px] uppercase tracking-widest rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
            >
              <BedDouble size={15} />
              <span>Explore Rooms</span>
            </Link>

            <Link
              to="/booking"
              className="flex items-center gap-2 px-7 py-3 border-2 border-white/70 text-white hover:bg-white hover:text-[#14532D] hover:border-white font-bold text-[11px] uppercase tracking-widest rounded-full transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
            >
              <CalendarCheck size={15} />
              <span>Book Now</span>
            </Link>
          </div>

          {/* Slide indicator dots */}
          <div className="flex gap-2.5 justify-center">
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
        className="absolute left-5 md:left-8 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full border border-white/25 bg-black/25 hover:bg-black/55 backdrop-blur-sm flex items-center justify-center transition-all duration-250 hover:scale-110 hover:border-white/50 active:scale-90 text-white shadow-lg cursor-pointer disabled:opacity-40"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={goNext}
        disabled={isBusy.current}
        className="absolute right-5 md:right-8 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full border border-white/25 bg-black/25 hover:bg-black/55 backdrop-blur-sm flex items-center justify-center transition-all duration-250 hover:scale-110 hover:border-white/50 active:scale-90 text-white shadow-lg cursor-pointer disabled:opacity-40"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* ── Scroll-down indicator ── */}
      <button
        onClick={scrollToContent}
        aria-label="Scroll down to content"
        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 group cursor-pointer"
      >
        <span className="text-white/50 text-[9px] uppercase tracking-[0.22em] font-semibold group-hover:text-white/80 transition-colors duration-300">
          Discover
        </span>
        <div className="w-[30px] h-[48px] rounded-full border-2 border-white/30 group-hover:border-white/60 flex items-start justify-center pt-[8px] transition-colors duration-300">
          <div className="w-[5px] h-[5px] rounded-full bg-white/60 group-hover:bg-white animate-scrollDot" />
        </div>
      </button>

      {/* ── Floating Availability Search Bar ── */}
      <div className="absolute bottom-[-44px] left-1/2 -translate-x-1/2 w-[94%] max-w-[1080px] z-30">
        <div className="bg-white rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.14)] border border-gray-100/80 px-6 py-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center divide-y lg:divide-y-0 lg:divide-x divide-gray-100">

            {/* Room Type */}
            <div className="flex items-center gap-3 flex-1 min-w-0 py-3 lg:py-0 lg:pr-5">
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

            {/* Price Range */}
            <div className="flex items-center gap-3 flex-1 min-w-0 py-3 lg:py-0 lg:px-5">
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

            {/* Check-in */}
            <div className="flex items-center gap-3 flex-1 min-w-0 py-3 lg:py-0 lg:px-5">
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
                  className="block w-full bg-transparent border-none text-[#14532D] font-semibold text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-0 p-0 cursor-pointer leading-snug"
                />
              </div>
            </div>

            {/* Search button */}
            <div className="pt-3 lg:pt-0 lg:pl-5 shrink-0">
              <button
                onClick={handleSearch}
                className="w-full lg:w-auto flex items-center justify-center gap-2 h-11 px-7 bg-[#14532D] hover:bg-primary-gold text-primary-gold hover:text-[#14532D] font-extrabold text-[10px] uppercase tracking-[0.22em] rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer whitespace-nowrap"
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