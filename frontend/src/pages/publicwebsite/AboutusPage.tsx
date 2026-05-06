import React from 'react';
import { motion } from 'framer-motion';
import { FaAward, FaUsers, FaHotel, FaCalendarAlt, FaStar, FaHeart } from 'react-icons/fa';

export const AboutusPage: React.FC = () => {
  const values = [
    { icon: FaStar, title: 'Excellence', description: 'Striving for perfection in every aspect of service' },
    { icon: FaHeart, title: 'Hospitality', description: 'Warm, welcoming, and personalized care' },
    { icon: FaAward, title: 'Quality', description: 'Uncompromising standards in everything we do' },
  ];

  return (  
    <main>
      {/* Header Banner */}
      <div className="relative h-96 bg-gradient-to-r from-primary-dark to-primary-green">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Itahari Namuna</h1>
            <p className="text-lg max-w-2xl mx-auto">
              Where academic excellence meets luxurious hospitality
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom section-padding">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
          <p className="text-neutral-text-secondary text-lg leading-relaxed">
            Itahari Namuna College PMS was founded with a vision to create a unique space 
            that combines the best of academic excellence with world-class hospitality. 
            We believe that a comfortable, inspiring environment is essential for both 
            learning and relaxation.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {[
            { icon: FaHotel, value: '50+', label: 'Luxury Rooms', color: 'text-primary-green' },
            { icon: FaUsers, value: '1000+', label: 'Happy Guests', color: 'text-primary-gold' },
            { icon: FaAward, value: '10+', label: 'Years Experience', color: 'text-primary-orange' },
            { icon: FaCalendarAlt, value: '5000+', label: 'Bookings Completed', color: 'text-blue-500' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white rounded-2xl shadow-md"
            >
              <stat.icon className={`${stat.color} text-4xl mx-auto mb-3`} />
              <div className="text-2xl font-bold text-neutral-text-primary">{stat.value}</div>
              <div className="text-sm text-neutral-text-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h3 className="text-2xl font-bold mb-4 text-primary-green">Our Mission</h3>
            <p className="text-neutral-text-secondary leading-relaxed">
              To provide exceptional property management services that combine comfort, 
              convenience, and excellence, creating memorable experiences for all our guests 
              while maintaining the highest standards of hospitality.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h3 className="text-2xl font-bold mb-4 text-primary-gold">Our Vision</h3>
            <p className="text-neutral-text-secondary leading-relaxed">
              To become the premier destination for luxury accommodation and property 
              management in Nepal, recognized for innovation, excellence, and 
              unparalleled guest satisfaction.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
          <p className="text-neutral-text-secondary max-w-2xl mx-auto">
            These principles guide everything we do at Itahari Namuna
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {values.map((value, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow"
            >
              <value.icon className="text-primary-green text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{value.title}</h3>
              <p className="text-neutral-text-secondary">{value.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-neutral-text-secondary max-w-2xl mx-auto">
            Dedicated professionals committed to your comfort and satisfaction
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Dr. Ram Prasad Koirala', role: 'Founder & Chairman', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
            { name: 'Sita Sharma', role: 'General Manager', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
            { name: 'Bikash Thapa', role: 'Head of Operations', image: 'https://randomuser.me/api/portraits/men/45.jpg' },
          ].map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-48 h-48 rounded-full object-cover mx-auto mb-4 shadow-lg"
              />
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-primary-green">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
};