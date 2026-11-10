import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../../components/publicwebsite/Homepage/Sections/HeroSection';
import { RoomTypeSection } from '../../components/publicwebsite/Homepage/Sections/RoomTypeSection';
import { FeaturedRoomsSection } from '../../components/publicwebsite/Homepage/Sections/FeaturedRoomsSection';
import AboutUsSection from '../../components/publicwebsite/Homepage/Sections/AboutUsSection';
import VenuesSection from '../../components/publicwebsite/Homepage/Sections/VenuesSection';
import FacilitiesSection from '../../components/publicwebsite/Homepage/Sections/FacilitiesSection';
import { ReviewsSection } from '../../routes/lazyPages';
import { Button } from '../../components/ui/Button';
import { ReviewsSectionSkeleton } from '../../components/ui/skeletons/PageSkeletons';

export const Homepage: React.FC = () => {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <div id="homepage-content" className="scroll-mt-24 pt-0 lg:pt-14">
        <RoomTypeSection />
      </div>
      <FeaturedRoomsSection />
      <AboutUsSection />
      <VenuesSection />
      <FacilitiesSection />
      <Suspense fallback={<ReviewsSectionSkeleton />}>
        <ReviewsSection />
      </Suspense>

      <section className="relative overflow-hidden bg-primary-dark py-16 text-white sm:py-20 lg:py-24">
        <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-1/3 border-l border-white/10 lg:block" />
        <div className="container-custom relative grid items-center gap-8 lg:grid-cols-[minmax(0,1.35fr)_auto] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            viewport={{ once: true }}
          >
            <p className="mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-gold">
              <span className="h-px w-8 bg-primary-gold/80" />
              Itahari Namuna
            </p>
            <h2 className="max-w-3xl font-georgia text-3xl font-medium leading-[1.12] tracking-tight text-white sm:text-4xl md:text-5xl">
              Planning a visit to <span className="italic text-primary-gold">Itahari?</span>
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
              Browse room options and nightly rates, or get in touch with our team before you book.
            </p>
          </motion.div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Button variant="hero" size="lg" asChild to="/booking" className="min-h-12 rounded-lg px-7 shadow-sm">
              Book a stay
            </Button>
            <Button variant="hero-outline" size="lg" asChild to="/rooms" className="min-h-12 rounded-lg border-white/35 px-7">
              View rooms
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};
