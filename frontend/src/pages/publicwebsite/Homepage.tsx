import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../../components/publicwebsite/Homepage/Sections/HeroSection';
import { RoomTypeSection } from '../../components/publicwebsite/Homepage/Sections/RoomTypeSection';
import { FeaturedRoomsSection } from '../../components/publicwebsite/Homepage/Sections/FeaturedRoomsSection';
import AboutUsSection from '../../components/publicwebsite/Homepage/Sections/AboutUsSection';
import VenuesSection from '../../components/publicwebsite/Homepage/Sections/VenuesSection';
import FacilitiesSection from '../../components/publicwebsite/Homepage/Sections/FacilitiesSection';
import { GuestFavoritesSection, ReviewsSection } from '../../routes/lazyPages';
import { Button } from '../../components/ui/Button';
import { GuestFavoritesSectionSkeleton, ReviewsSectionSkeleton } from '../../components/ui/skeletons/PageSkeletons';

export const Homepage: React.FC = () => {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <div id="homepage-content" className="pt-0 lg:pt-14">
        <RoomTypeSection />
      </div>
      <AboutUsSection />
      <FeaturedRoomsSection />
      <Suspense fallback={<GuestFavoritesSectionSkeleton />}>
        <GuestFavoritesSection />
      </Suspense>
      <VenuesSection />
      <FacilitiesSection />
      <Suspense fallback={<ReviewsSectionSkeleton />}>
        <ReviewsSection />
      </Suspense>

      <section className="relative isolate overflow-hidden bg-[#10251b] py-16 sm:py-20 lg:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-32 -top-40 h-96 w-96 rounded-full bg-primary-gold/10 blur-3xl" />
          <div className="absolute -bottom-48 left-1/3 h-80 w-80 rounded-full bg-primary-green/20 blur-3xl" />
          <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-transparent via-primary-gold/70 to-transparent" />
        </div>
        <div className="container-custom relative grid items-center gap-8 text-white lg:grid-cols-[minmax(0,1.35fr)_auto] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            viewport={{ once: true }}
          >
            <p className="mb-4 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-primary-gold">
              <span className="h-px w-8 bg-primary-gold/80" />
              First stay
            </p>
            <h2 className="max-w-3xl font-georgia text-3xl font-semibold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-5xl">
              Book a room. <span className="italic text-primary-gold">We’ll have the key ready.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/80 sm:text-base md:text-lg">
              New guests get 20% off the first night. Compare rooms first, or go straight to booking if the dates are set.
            </p>
          </motion.div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Button variant="hero" size="lg" asChild to="/booking" className="min-h-12 rounded-xl px-7 shadow-lg shadow-black/15">
              Book a stay
            </Button>
            <Button variant="hero-outline" size="lg" asChild to="/rooms" className="min-h-12 rounded-xl border-white/55 px-7">
              View rooms
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};
