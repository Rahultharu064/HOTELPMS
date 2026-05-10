import { useState, useCallback } from "react";
import { Button } from "../../../ui/Button";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import hero1 from "../../../../assets/Hero.webp";

const slides = [
  {
    image: hero1,
    welcomeText: "Welcome to",
    title: "Itahari Namuna",
    highlight: "Luxury",
    subtitle:
      "Where comfort meets sophistication. Discover our curated collection of premium rooms designed for the modern traveler seeking an unforgettable stay.",
    ctaLabel: "BOOK YOUR STAY",
    ctaTo: "/rooms",
  },
  {
    image: hero1,
    welcomeText: "Precision in Hospitality",
    title: "Itahari Namuna",
    highlight: "Excellence",
    subtitle:
      "Redefining the art of service with cutting-edge management and timeless sophistication. Discover a stay that flows with perfect grace.",
    ctaLabel: "EXPLORE ROOMS",
    ctaTo: "/rooms",
  },
  {
    image: hero1,
    welcomeText: "Beyond the Horizon",
    title: "Itahari Namuna",
    highlight: "Comfort",
    subtitle:
      "Where every detail is meticulously crafted to elevate your senses. Embark on a journey of relaxation in our curated collection of elite suites.",
    ctaLabel: "VIEW COLLECTIONS",
    ctaTo: "/rooms",
  },
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
    <section className="relative h-[75vh] min-h-[500px] overflow-hidden">

      {/* Background slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"
            }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className={`w-full h-full object-cover object-center ${i === current ? "animate-ken-burns" : ""
              }`}
          />
          {/* Refined gradient overlay for better text contrast */}
          <div className="absolute inset-0 hero-overlay-dark" />
        </div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 container-custom h-full flex flex-col justify-center">
        <div
          className={`max-w-2xl transition-all duration-700 ${isTransitioning ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"
            }`}
        >
          {/* Modern Label with Accent Line */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-8 bg-primary-gold/60" />
            <p className="text-white/90 text-xs md:text-sm font-semibold tracking-[0.3em] uppercase font-georgia">
              {slides[current].welcomeText}
            </p>
          </div>

          {/* Combined Title */}
          <div className="mb-6">
            <h1 className="text-white hero-heading-base">
              {slides[current].title}
            </h1>
            <h2 className="hero-highlight-base !mb-2">
              {slides[current].highlight}
            </h2>
          </div>

          {/* Refined Subtitle */}
          <p className="text-white/70 text-base md:text-lg leading-relaxed mb-10 max-w-lg font-georgia italic opacity-90">
            "{slides[current].subtitle}"
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-5 mb-12">
            <button className="btn-gold">
              {slides[current].ctaLabel}
            </button>
            <Button
              variant="hero-outline"
              size="lg"
              asChild
              to={slides[current].ctaTo}
              className="px-8 border-white/20 hover:border-white/60"
            >
              <span>LEARN MORE</span>
            </Button>
          </div>

          {/* Slide Dots */}
          <div className="flex gap-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative py-2 group"
                aria-label={`Go to slide ${i + 1}`}
              >
                <div className={`h-[3px] transition-all duration-500 rounded-full ${i === current
                    ? "w-16 bg-primary-gold shadow-[0_0_10px_rgba(212,160,23,0.5)]"
                    : "w-8 bg-white/10 group-hover:bg-white/30"
                  }`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows with Image Previews */}
      <button
        onClick={goPrev}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 h-16 w-16 rounded-full overflow-hidden border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group shadow-2xl"
        aria-label="Previous slide"
      >
        <img
          src={slides[prevIndex].image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-opacity"
        />
        <div className="absolute inset-0 bg-black/40" />
        <ChevronLeft className="relative z-10 h-6 w-6 text-white drop-shadow-lg" />
      </button>

      <button
        onClick={goNext}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 h-16 w-16 rounded-full overflow-hidden border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group shadow-2xl"
        aria-label="Next slide"
      >
        <img
          src={slides[nextIndex].image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-opacity"
        />
        <div className="absolute inset-0 bg-black/40" />
        <ChevronRight className="relative z-10 h-6 w-6 text-white drop-shadow-lg" />
      </button>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden lg:block opacity-40">
        <ChevronDown className="h-6 w-6 animate-scroll-arrow text-white" />
      </div>
    </section>
  );
};

export default HeroSection;