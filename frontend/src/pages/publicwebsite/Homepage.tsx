import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroSection from '../../components/publicwebsite/Homepage/Sections/HeroSection';
import { RoomTypeSection } from '../../components/publicwebsite/Homepage/Sections/RoomTypeSection';
import { FeaturedRoomsSection } from '../../components/publicwebsite/Homepage/Sections/FeaturedRoomsSection';
import { GuestFavoritesSection } from '../../components/publicwebsite/Homepage/Sections/GuestFavoritesSection';
import ReviewsSection from '../../components/publicwebsite/Homepage/Sections/ReviewsSection';
import FacilitiesSection from '../../components/publicwebsite/Homepage/Sections/FacilitiesSection';
import { Button } from '../../components/ui/Button';
import { FaArrowRight, FaAward, FaUsers, FaBed, FaStar } from 'react-icons/fa';

export const Homepage: React.FC = () => {
  const stats = [
    { icon: FaBed, value: '50+', label: 'Luxury Rooms', color: 'text-primary-green' },
    { icon: FaUsers, value: '1000+', label: 'Happy Guests', color: 'text-primary-gold' },
    { icon: FaAward, value: '5+', label: 'Years Excellence', color: 'text-primary-orange' },
    { icon: FaStar, value: '4.9', label: 'Rating', color: 'text-yellow-500' },
  ];

  return (
    <main className="overflow-hidden">
      <HeroSection />
      <FacilitiesSection />
      <RoomTypeSection />
      <FeaturedRoomsSection />
      <GuestFavoritesSection />
      
      {/* About Section */}
      <section className="section-padding bg-gradient-to-br from-white via-neutral-light to-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"
                  alt="Campus"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/50 to-transparent"></div>
              </div>
              <motion.div
                className="absolute -bottom-6 -right-6 bg-gradient-to-r from-primary-gold to-primary-orange text-white p-5 rounded-2xl shadow-xl"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold">10+</div>
                <div className="text-sm">Years Excellence</div>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-primary-green font-semibold text-sm uppercase tracking-wider inline-block px-3 py-1 bg-primary-green/10 rounded-full mb-4">
                Our Legacy
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-4 leading-tight">
                Itahari Namuna <span className="gradient-text">College & PMS</span>
              </h2>
              <p className="text-neutral-text-secondary mb-6 leading-relaxed text-lg">
                Combining academic excellence with luxurious hospitality, we provide an 
                unmatched property management experience. Our spaces are designed to 
                inspire and comfort, creating the perfect environment for both learning 
                and relaxation.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <stat.icon className={`${stat.color} text-3xl mx-auto mb-2`} />
                    <div className="text-2xl font-bold text-neutral-text-primary">{stat.value}</div>
                    <div className="text-sm text-neutral-text-secondary">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
              
              <Button variant="primary" icon={<FaArrowRight />} size="lg">
                <Link to="/about">Discover More About Us</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
      
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