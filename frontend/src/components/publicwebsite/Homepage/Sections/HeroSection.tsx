import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star, Award, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const SLIDES = [
  {
    id: 1,
    src: "/hero1.png",
    thumb: "/hero1.png",
    label: "Luxury Exterior",
    badge: "Welcome to Luxury",
    line1: "Experience Luxury",
    line2: "At Itahari Namuna",
    sub: "Nepal's premier College Property Management destination — where world-class hospitality meets modern comfort in the heart of Sunsari.",
  },
  {
    id: 2,
    src: "/hero2.png",
    thumb: "/hero2.png",
    label: "Grand Lobby",
    badge: "Personalized Service",
    line1: "A Grand Welcome",
    line2: "Awaits You",
    sub: "Step into our magnificent reception — a seamless blend of traditional Nepali artistry and contemporary luxury design.",
  },
  {
    id: 3,
    src: "/hero3.png",
    thumb: "/hero3.png",
    label: "Infinity Pool",
    badge: "Wellness & Relaxation",
    line1: "Dive Into",
    line2: "Pure Serenity",
    sub: "Rejuvenate in our world-class infinity pool with breathtaking panoramic views of the lush Sunsari valley.",
  },
];

const STATS = [
  { icon: Star,     value: "4.9 / 5",  label: "Guest Rating" },
  { icon: Award,    value: "12 Years", label: "Of Excellence" },
  { icon: Users,    value: "50,000+",  label: "Happy Guests" },
  { icon: Calendar, value: "365 Days", label: "Always Open" },
];

const TOTAL = SLIDES.length;
const INTERVAL = 7000;

const HeroSection: React.FC = () => {
  const [idx, setIdx]       = useState(0);
  const [visible, setVisible] = useState(true);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((next: number) => {
    setVisible(false);
    setTimeout(() => { setIdx(next); setVisible(true); }, 450);
  }, []);

  const next = useCallback(() => go((idx + 1) % TOTAL), [idx, go]);
  const prev = () => go((idx - 1 + TOTAL) % TOTAL);

  // Reset auto-play whenever idx changes
  useEffect(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(next, INTERVAL);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [next]);

  const S          = SLIDES[idx];
  const prevSlide  = SLIDES[(idx - 1 + TOTAL) % TOTAL];
  const nextSlide  = SLIDES[(idx + 1) % TOTAL];

  return (
    <section
      className="relative w-full overflow-hidden bg-[#0a1a10]"
      style={{ height: "calc(100vh - 116px)", minHeight: 600 }}
    >
      {/* ── Background images ── */}
      {SLIDES.map((sl, i) => (
        <div
          key={sl.id}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${sl.src})`,
            opacity: i === idx ? 1 : 0,
            transition: "opacity 1.2s ease",
            zIndex: 0,
          }}
        />
      ))}

      {/* Dark-green left overlay — keeps text readable */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(108deg, rgba(20,83,45,0.93) 0%, rgba(20,83,45,0.76) 32%, rgba(20,83,45,0.28) 62%, rgba(0,0,0,0.04) 100%)",
          zIndex: 1,
        }}
      />
      {/* Bottom vignette */}
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(to top, rgba(10,26,16,0.6), transparent)", zIndex: 1 }}
      />

      {/* ── MAIN CONTENT ── */}
      <div className="absolute inset-0 flex items-center" style={{ zIndex: 2 }}>
        <div className="site-container w-full">
          <div style={{ maxWidth: 600 }}>

            {/* Badge */}
            <div
              className={`flex items-center gap-3 mb-6 transition-all duration-500 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <span className="block w-7 h-px bg-[#F59E0B]" />
              <span className="text-[#F59E0B] text-[11px] font-black tracking-[0.28em] uppercase">
                {S.badge}
              </span>
            </div>

            {/* Headline */}
            <h1
              className={`heading-xl text-white mb-5 transition-all duration-500 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "80ms" }}
            >
              {S.line1}
              <br />
              <span className="text-[#F59E0B]">{S.line2}</span>
            </h1>

            {/* Sub-text */}
            <p
              className={`text-white/70 font-medium mb-10 transition-all duration-500 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ maxWidth: 480, fontSize: "1.05rem", lineHeight: 1.75, transitionDelay: "160ms" }}
            >
              {S.sub}
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-wrap gap-4 transition-all duration-500 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "240ms" }}
            >
              <Link
                to="/booking"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#14532D] text-[13px] font-black tracking-widest uppercase shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
              >
                Book Your Stay
              </Link>
              <Link
                to="/rooms"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-white/30 text-white text-[13px] font-black tracking-widest uppercase hover:border-white/60 hover:bg-white/8 transition-all duration-200"
              >
                Explore Rooms
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS BAR (bottom-left) ── */}
      <div className="absolute inset-x-0 bottom-10 hidden lg:block" style={{ zIndex: 3 }}>
        <div className="site-container">
          <div className="flex items-center gap-10">
            {STATS.map((st, i) => (
              <div key={i}>
                <p className="text-white font-black tabular-nums leading-none" style={{ fontSize: "1.6rem" }}>
                  {st.value}
                </p>
                <p className="text-[#F59E0B] text-[10px] font-black uppercase tracking-[0.2em] mt-1.5 opacity-85">
                  {st.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ LEFT ARROW with image PREVIEW on hover ══ */}
      <div
        className="absolute left-5 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-3"
        onMouseEnter={() => setHoverPrev(true)}
        onMouseLeave={() => setHoverPrev(false)}
      >
        {/* Thumbnail preview — appears ABOVE the arrow on hover */}
        <div
          className={`w-28 h-18 rounded-xl overflow-hidden border-2 border-[#F59E0B] shadow-2xl transition-all duration-300 ${
            hoverPrev ? "opacity-100 scale-100 -translate-y-1" : "opacity-0 scale-95 translate-y-2 pointer-events-none"
          }`}
          style={{ height: 72 }}
        >
          <img
            src={prevSlide.src}
            alt={prevSlide.label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex items-end p-1.5">
            <span className="text-white text-[9px] font-black truncate">{prevSlide.label}</span>
          </div>
        </div>

        {/* Arrow button */}
        <button
          onClick={prev}
          title="Previous slide"
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white border border-white/25 backdrop-blur-sm transition-all duration-200 ${
            hoverPrev
              ? "bg-[#F59E0B] border-[#F59E0B] text-[#14532D] scale-110 shadow-2xl"
              : "bg-black/25 hover:bg-[#F59E0B] hover:border-[#F59E0B] hover:text-[#14532D]"
          }`}
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* ══ RIGHT ARROW with image PREVIEW on hover ══ */}
      <div
        className="absolute right-5 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-3"
        onMouseEnter={() => setHoverNext(true)}
        onMouseLeave={() => setHoverNext(false)}
      >
        {/* Thumbnail preview — appears ABOVE the arrow on hover */}
        <div
          className={`w-28 rounded-xl overflow-hidden border-2 border-[#F59E0B] shadow-2xl transition-all duration-300 relative ${
            hoverNext ? "opacity-100 scale-100 -translate-y-1" : "opacity-0 scale-95 translate-y-2 pointer-events-none"
          }`}
          style={{ height: 72 }}
        >
          <img
            src={nextSlide.src}
            alt={nextSlide.label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex items-end p-1.5">
            <span className="text-white text-[9px] font-black truncate">{nextSlide.label}</span>
          </div>
        </div>

        {/* Arrow button */}
        <button
          onClick={next}
          title="Next slide"
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white border border-white/25 backdrop-blur-sm transition-all duration-200 ${
            hoverNext
              ? "bg-[#F59E0B] border-[#F59E0B] text-[#14532D] scale-110 shadow-2xl"
              : "bg-black/25 hover:bg-[#F59E0B] hover:border-[#F59E0B] hover:text-[#14532D]"
          }`}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* ══ DOT INDICATORS — centered at bottom ══ */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            title={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-400 ${
              i === idx ? "w-8 h-2 bg-[#F59E0B]" : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
