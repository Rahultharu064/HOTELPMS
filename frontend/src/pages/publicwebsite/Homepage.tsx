import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroSection from '../../components/publicwebsite/Homepage/Sections/HeroSection';
import { RoomTypeSection } from '../../components/publicwebsite/Homepage/Sections/RoomTypeSection';
import { FeaturedRoomsSection } from '../../components/publicwebsite/Homepage/Sections/FeaturedRoomsSection';
import { GuestFavoritesSection } from '../../components/publicwebsite/Homepage/Sections/GuestFavoritesSection';
import VenuesSection from '../../components/publicwebsite/Homepage/Sections/VenuesSection';
import ReviewsSection from '../../components/publicwebsite/Homepage/Sections/ReviewsSection';
import FacilitiesSection from '../../components/publicwebsite/Homepage/Sections/FacilitiesSection';
import { Button } from '../../components/ui/Button';


export const Homepage: React.FC = () => {

  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <div id="homepage-content" className="pt-14">
        <RoomTypeSection />
      </div>
      <FeaturedRoomsSection />
      <GuestFavoritesSection />
      <VenuesSection />
      <FacilitiesSection />
      <ReviewsSection />
      
      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary-dark via-primary-green to-primary-dark py-20">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"></div>
        
        <div className="container-custom relative text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
              Limited Time Offer
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready for an Unforgettable Stay?
            </h2>
            <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Book your premium room now and experience seamless property management with exclusive benefits.
              <span className="block text-primary-gold font-bold mt-2">✨ 20% OFF on first booking ✨</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                <Link to="/booking" className="flex items-center gap-2">
                  Book Your Stay Now 🎯
                </Link>
              </Button>
              <Link to="/rooms">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  View Room Details
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};