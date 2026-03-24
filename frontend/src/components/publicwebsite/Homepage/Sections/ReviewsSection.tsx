import React, { useRef, useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";

/**
 * REVIEWS SECTION (Testimonials)
 * - Shows guest reviews / testimonials
 * - Uses the 4-column clean card grid style requested by the user
 */

const REVIEWS = [
  {
    id: 1,
    name: "Sneha Sharma",
    role: "Business Traveler",
    image: "https://ui-avatars.com/api/?name=Sneha+Sharma&background=1F7A3A&color=fff",
    rating: 5,
    comment: "The Grand Suite was breathtaking. The panoramic views of Itahari combined with world-class service made my business trip feel like a vacation.",
  },
  {
    id: 2,
    name: "Rohan Adhikari",
    role: "Family Vacation",
    image: "https://ui-avatars.com/api/?name=Rohan+Adhikari&background=F59E0B&color=fff",
    rating: 5,
    comment: "Excellent stay! The staff went above and beyond for our family. The kids loved the pool, and the dining experience was truly exceptional.",
  },
  {
    id: 3,
    name: "Priya Thapa",
    role: "Leisure Guest",
    image: "https://ui-avatars.com/api/?name=Priya+Thapa&background=1F7A3A&color=fff",
    rating: 4,
    comment: "A serene oasis in the city. The spa treatments were specifically good. Great attention to detail in room design and guest comfort.",
  },
  {
    id: 4,
    name: "Amit Bista",
    role: "Weekend Getaway",
    image: "https://ui-avatars.com/api/?name=Amit+Bista&background=F59E0B&color=fff",
    rating: 5,
    comment: "Modern luxury at its best. The Itahari Namuna college PMS team has created a truly premium hospitality brand in the heart of Sunsari.",
  },
];

const ReviewsSection: React.FC = () => {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShow(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="section-py-lg bg-white relative overflow-hidden">
      {/* Dynamic Background decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-50/40 rounded-full blur-[130px] -mr-80 -mt-80 opacity-60" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-green-50/40 rounded-full blur-[130px] -ml-80 -mb-80 opacity-60" />

      <div className="site-container relative z-10">
        
        <div
          className={`text-center mb-24 max-w-3xl mx-auto transition-all duration-1000 ease-out ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <span className="text-[10px] font-bold tracking-[0.4em] text-[#1F7A3A] uppercase mb-4 block">World-Class Hospitality</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] mb-6 leading-tight tracking-tight">
            Guest <span className="text-[#1F7A3A]">Testimonials</span>
          </h2>
          <div className="h-1.5 w-16 bg-[#F59E0B] mx-auto rounded-full mb-6" />
          <p className="text-base text-gray-500 font-medium leading-relaxed">
            The stories of our guests are the true measure of our success. Discover why travelers choose us for their stay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {REVIEWS.map((rev, i) => (
            <div
              key={rev.id}
              className={`group bg-white rounded-[40px] p-9 border border-gray-100/60 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:border-[#1F7A3A]/10 transition-all duration-700 flex flex-col h-full ${
                show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="mb-8 flex items-center justify-between">
                <Quote size={28} className="text-[#1F7A3A]/20" fill="currentColor" />
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      size={11}
                      className={idx < rev.rating ? "text-[#F59E0B] fill-[#F59E0B]" : "text-gray-100"}
                    />
                  ))}
                </div>
              </div>

              <p className="text-[#4B5563] text-[15px] leading-relaxed mb-10 font-medium italic opacity-90 flex-1">
                "{rev.comment}"
              </p>

              <div className="flex items-center gap-4 pt-8 border-t border-gray-50/80">
                <div className="relative">
                  <div className="w-13 h-13 rounded-full overflow-hidden border-2 border-white shadow-md ring-1 ring-gray-100">
                    <img src={rev.image} alt={rev.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#F59E0B] rounded-full border-2 border-white flex items-center justify-center">
                    <Star size={8} className="text-white fill-white" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-[#111827] text-[14px] tracking-tight">{rev.name}</h4>
                  <p className="text-[#9CA3AF] text-[10px] uppercase tracking-widest font-extrabold mt-1">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
