import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────── */

interface CarouselProps {
  children: React.ReactNode[];
  /** Auto-advance interval in ms. Pass 0 to disable. */
  autoPlay?: number;
  /** Show prev/next arrow buttons */
  showArrows?: boolean;
  /** Show dot indicator row */
  showDots?: boolean;
  /** Loop back around at either end */
  loop?: boolean;
  className?: string;
  /** How many items to show at once (for multi-item carousels) */
  itemsPerView?: 1 | 2 | 3;
}

/* ─── Slide animation variants ───────────────────────────────── */

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
  },
  exit: (dir: number) => ({
    x: dir < 0 ? '100%' : '-100%',
    opacity: 0,
    transition: { duration: 0.2 },
  }),
} satisfies Variants;


/* ─── Component ──────────────────────────────────────────────── */

/**
 * Carousel — animated slide container.
 *
 * ```tsx
 * <Carousel autoPlay={4000} showDots showArrows loop>
 *   <SlideOne />
 *   <SlideTwo />
 *   <SlideThree />
 * </Carousel>
 * ```
 */
export const Carousel: React.FC<CarouselProps> = ({
  children,
  autoPlay = 0,
  showArrows = true,
  showDots = true,
  loop = true,
  className = '',
}) => {
  const slides = React.Children.toArray(children);
  const count = slides.length;

  const [[current, direction], setCurrent] = useState([0, 0]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const paginate = useCallback(
    (newDir: number) => {
      setCurrent(([prev]) => {
        let next = prev + newDir;
        if (loop) {
          next = (next + count) % count;
        } else {
          next = Math.max(0, Math.min(count - 1, next));
        }
        return [next, newDir];
      });
    },
    [count, loop],
  );

  /* Auto-play */
  useEffect(() => {
    if (!autoPlay || count <= 1) return;
    timer.current = setInterval(() => paginate(1), autoPlay);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [autoPlay, paginate, count]);

  const resetTimer = () => {
    if (timer.current) clearInterval(timer.current);
    if (autoPlay && count > 1) {
      timer.current = setInterval(() => paginate(1), autoPlay);
    }
  };

  const handlePrev = () => { paginate(-1); resetTimer(); };
  const handleNext = () => { paginate(1);  resetTimer(); };
  const handleDot  = (i: number) => {
    setCurrent(([prev]) => [i, i > prev ? 1 : -1]);
    resetTimer();
  };

  if (count === 0) return null;

  return (
    <div className={`relative w-full overflow-hidden select-none ${className}`}>
      {/* Slide Track */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="w-full"
        >
          {slides[current]}
        </motion.div>
      </AnimatePresence>

      {/* Arrow Buttons */}
      {showArrows && count > 1 && (
        <>
          <button
            onClick={handlePrev}
            disabled={!loop && current === 0}
            className="
              absolute left-3 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 flex items-center justify-center rounded-full
              bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100
              text-gray-600 hover:text-[#1F7A3A] hover:bg-white
              transition-all disabled:opacity-30 disabled:cursor-not-allowed
            "
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>

          <button
            onClick={handleNext}
            disabled={!loop && current === count - 1}
            className="
              absolute right-3 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 flex items-center justify-center rounded-full
              bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100
              text-gray-600 hover:text-[#1F7A3A] hover:bg-white
              transition-all disabled:opacity-30 disabled:cursor-not-allowed
            "
            aria-label="Next slide"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {showDots && count > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDot(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`
                h-1.5 rounded-full transition-all duration-300
                ${i === current
                  ? 'w-6 bg-[#1F7A3A]'
                  : 'w-1.5 bg-white/60 hover:bg-white'}
              `}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Slide (convenience wrapper) ────────────────────────────── */

/**
 * Optional wrapper for individual slides. Gives a consistent
 * aspect-ratio container if needed.
 */
export const CarouselSlide: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`w-full ${className}`}>{children}</div>
);
