import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/pagination';

const testimonials = [
  {
    id: 1,
    name: 'Srijana K.',
    role: 'Business Traveler',
    content: 'Amazing property and service! The rooms are exquisite and staff is very helpful. The PMS system made my stay seamless.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: 2,
    name: 'Anil Thapa',
    role: 'Corporate Guest',
    content: 'Modern PMS system made booking so easy. Highly recommend for business stays. The facilities are top-notch!',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: 3,
    name: 'Prashant R.',
    role: 'Vacationer',
    content: 'Luxury at its best. The college vibe meets 5-star comfort. Will definitely come back again!',
    rating: 4,
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    id: 4,
    name: 'Maya Gurung',
    role: 'Frequent Guest',
    content: 'Outstanding service and beautiful rooms. The location is perfect and the staff goes above and beyond.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
];

export const TestimonialsSlider: React.FC = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary-green font-semibold text-sm uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            What Our Guests Say
          </h2>
          <p className="text-neutral-text-secondary max-w-2xl mx-auto">
            Real experiences from our valued guests who have enjoyed the Itahari Namuna difference.
          </p>
        </motion.div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="pb-12"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-neutral-border h-full"
              >
                <FaQuoteLeft className="text-primary-gold text-3xl mb-4 opacity-50" />
                <p className="text-neutral-text-secondary mb-4 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${i < testimonial.rating ? 'text-primary-gold' : 'text-gray-300'} text-sm`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-neutral-text-primary">{testimonial.name}</h4>
                    <p className="text-sm text-neutral-text-secondary">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};