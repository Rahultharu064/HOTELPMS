import { useState, useCallback } from "react";
import { Button } from "../../../ui/Button";
import { ChevronDown, ChevronLeft, ChevronRight, CalendarDays, Users, Baby } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "../../../ui/Input";
import { Select } from "../../../ui/Select";
const slides = [
  { image: "/hero1.png", title: "Experience Luxury & Comfort", subtitle: "Book your perfect stay with modern PMS experience" },
  { image: "/hero2.png", title: "Elegant Rooms & Suites", subtitle: "Unwind in beautifully designed spaces with panoramic views" },
  { image: "/hero3.png", title: "World-Class Amenities", subtitle: "From poolside relaxation to fine dining excellence" },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((idx: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setIsTransitioning(false);
    }, 400);
  }, []);

  const goPrev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  const goNext = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prevIndex = (current - 1 + slides.length) % slides.length;
  const nextIndex = (current + 1) % slides.length;

  return (
    <section className="relative h-[78vh] min-h-[550px] overflow-hidden">
      {/* Background */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
            style={{ animation: i === current ? "kenBurns 15s ease-out forwards" : "none" }}
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 container-custom h-full flex flex-col justify-center pb-24">
        <div className={`max-w-2xl transition-all duration-500 ${isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-2.5"
              style={{ color: "white", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
            {slides[current].title}
          </h1>
          <p className="text-sm md:text-lg mb-7 text-white/90 font-medium">
            {slides[current].subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="hero" size="lg" asChild to="/rooms">
              <span>Book Now</span>
            </Button>
            <Button variant="hero-outline" size="lg" asChild to="/rooms">
              <span>Explore Rooms</span>
            </Button>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-10 bg-primary-gold" : "w-2.5 bg-white/40 hover:bg-white/70"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Arrow Buttons at both ends */}
      <Button
        onClick={goPrev}
        className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-20 h-14 w-14 rounded-full overflow-hidden border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group shadow-2xl"
        aria-label="Previous slide"
      >
        <img src={slides[prevIndex].image} alt={slides[prevIndex].title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 bg-black/20" />
        <ChevronLeft className="relative z-10 h-5 w-5 text-white drop-shadow-md" />
      </Button>

      <Button
        onClick={goNext}
        className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 h-14 w-14 rounded-full overflow-hidden border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group shadow-2xl"
        aria-label="Next slide"
      >
        <img src={slides[nextIndex].image} alt={slides[nextIndex].title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 bg-black/20" />
        <ChevronRight className="relative z-10 h-5 w-5 text-white drop-shadow-md" />
      </Button>

      {/* Quick Booking Card */}
      <div className="absolute bottom-5 left-0 right-0 z-20">
        <div className="container-custom">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 max-w-5xl mx-auto border border-white/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#14532D]/60 block">Check-in</label>
                <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-200/50 bg-white/50 text-sm focus-within:border-primary-green transition-colors">
                  <CalendarDays className="h-3 w-3 text-primary-green" />
                  <Input type="date" className="flex-1 bg-transparent outline-none font-bold text-[#14532D] text-[11px]" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#14532D]/60 block">Check-out</label>
                <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-200/50 bg-white/50 text-sm focus-within:border-primary-green transition-colors">
                  <CalendarDays className="h-3 w-3 text-primary-green" />
                  <Input type="date" className="flex-1 bg-transparent outline-none font-bold text-[#14532D] text-[11px]" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#14532D]/60 block">Adults</label>
                <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-200/50 bg-white/50 text-sm focus-within:border-primary-green transition-colors">
                  <Users className="h-3 w-3 text-primary-green" />
                  <Select className="flex-1 bg-transparent outline-none font-bold text-[#14532D] text-[11px]">
                    <option>1 Adult</option><option>2 Adults</option><option>3 Adults</option>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#14532D]/60 block">Children</label>
                <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-200/50 bg-white/50 text-sm focus-within:border-primary-green transition-colors">
                  <Baby className="h-3 w-3 text-primary-green" />
                  <Select className="flex-1 bg-transparent outline-none font-bold text-[#14532D] text-[11px]">
                    <option>0 Child</option><option>1 Child</option>
                  </Select>
                </div>
              </div>
              <Button size="sm" className="h-9 w-full rounded-lg bg-primary-green hover:bg-primary-dark shadow-lg shadow-primary-green/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <span className="font-bold text-[11px]">Check Availability</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden lg:block">
        <ChevronDown className="h-8 w-8 animate-scroll-arrow text-white/80" />
      </div>
    </section>
  );
};

export default HeroSection;
