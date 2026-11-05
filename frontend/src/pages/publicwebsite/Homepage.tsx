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

      <section className="relative overflow-hidden bg-[#0f2318] py-20">
        <div className="container-custom relative grid items-center gap-10 text-white lg:grid-cols-[1.4fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            viewport={{ once: true }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary-gold">
              First stay
            </p>
            <h2 className="font-georgia mt-3 text-3xl leading-tight md:text-5xl">
              Book a room. We will have the key ready.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              New guests get 20% off the first night. Compare rooms first, or go straight to booking if the dates are set.
            </p>
          </motion.div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Button variant="secondary" size="lg" asChild to="/booking">
              Book a stay
            </Button>
            <Button variant="outline" size="lg" asChild to="/rooms" className="border-white/60 text-white hover:bg-white/10">
              View rooms
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};
