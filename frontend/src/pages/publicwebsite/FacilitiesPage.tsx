import React from 'react';
import { motion } from 'framer-motion';
import { FaWifi, FaSwimmingPool, FaParking, FaCoffee, FaDumbbell, FaSpa } from 'react-icons/fa';
import PageHero from '../../components/publicwebsite/Homepage/layout/PageHero';

export const FacilitiesPage: React.FC = () => {
  const facilities = [
    {
      title: 'High-Speed Wi-Fi',
      description: 'Stay connected with our complimentary high-speed internet access available throughout the property.',
      icon: FaWifi,
      color: 'text-blue-500'
    },
    {
      title: 'Swimming Pool',
      description: 'Relax and unwind in our temperature-controlled outdoor swimming pool.',
      icon: FaSwimmingPool,
      color: 'text-cyan-500'
    },
    {
      title: 'Secure Parking',
      description: 'Ample and secure parking space available 24/7 for all our guests.',
      icon: FaParking,
      color: 'text-gray-500'
    },
    {
      title: 'Restaurant & Cafe',
      description: 'Enjoy delicious meals and freshly brewed coffee at our in-house restaurant.',
      icon: FaCoffee,
      color: 'text-amber-600'
    },
    {
      title: 'Fitness Center',
      description: 'Keep up with your fitness routine in our fully equipped modern gym.',
      icon: FaDumbbell,
      color: 'text-gray-700'
    },
    {
      title: 'Spa & Wellness',
      description: 'Rejuvenate your mind and body with our premium spa and massage services.',
      icon: FaSpa,
      color: 'text-pink-500'
    }
  ];

  return (
    <main className="min-h-screen bg-neutral-light">
      <PageHero
        title="Our Facilities"
        subtitle="Experience premium amenities designed for your absolute comfort and convenience."
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Facilities" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow border border-neutral-border group"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-gray-50 mb-6 group-hover:scale-110 transition-transform`}>
                <facility.icon className={`text-2xl ${facility.color}`} />
              </div>
              <h3 className="text-xl font-bold font-poppins text-neutral-text-primary mb-3">
                {facility.title}
              </h3>
              <p className="text-neutral-text-secondary leading-relaxed font-inter">
                {facility.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
};
