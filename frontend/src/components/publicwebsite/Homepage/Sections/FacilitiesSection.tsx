import React, { useRef, useEffect, useState } from "react";
import { Wifi, Waves, Dumbbell, Utensils, Car, Shield, Wind, Coffee } from "lucide-react";

const ITEMS = [
  { icon: Wifi,     label: "High-Speed Wi-Fi",   sub: "Blazing-fast 1Gbps throughout the property.",        color: "#1F7A3A" },
  { icon: Waves,    label: "Infinity Pool",        sub: "Rooftop pool with panoramic mountain views.",        color: "#F59E0B" },
  { icon: Dumbbell, label: "Fitness Center",       sub: "State-of-the-art gym open 24 hours.",               color: "#1F7A3A" },
  { icon: Utensils, label: "Fine Dining",          sub: "Award-winning local & international cuisine.",       color: "#F97316" },
  { icon: Car,      label: "Valet Parking",        sub: "Complimentary secure parking for all guests.",       color: "#1F7A3A" },
  { icon: Shield,   label: "24/7 Security",        sub: "Round-the-clock CCTV & trained security staff.",    color: "#DC2626" },
  { icon: Wind,     label: "Spa & Wellness",       sub: "Full-service spa with massages & facials.",          color: "#F59E0B" },
  { icon: Coffee,   label: "Premium Breakfast",    sub: "Complimentary continental breakfast buffet.",        color: "#1F7A3A" },
];

const FacilitiesSection: React.FC = () => {
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
    <section id="facilities" ref={ref} className="section-py-lg bg-gray-50/30 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-50/50 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="site-container relative z-10">
        
        <div
          className={`text-center mb-20 max-w-3xl mx-auto transition-all duration-1000 ease-out ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <span className="text-[10px] font-bold tracking-[0.4em] text-[#1F7A3A] uppercase mb-4 block">Premium Experience</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] mb-6 leading-tight tracking-tight">
            Superior <span className="text-[#1F7A3A]">Facilities</span>
          </h2>
          <div className="h-1.5 w-16 bg-[#F59E0B] mx-auto rounded-full mb-6" />
          <p className="text-base text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Every detail at our property is meticulously curated to provide an unparalleled guest experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {ITEMS.map((item, i) => (
            <div
              key={i}
              className={`group bg-white rounded-[32px] p-8 border border-gray-100/80 hover:border-[#1F7A3A]/10 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)] transition-all duration-700 ${
                show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-7 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_10px_25px_-5px_rgba(31,122,58,0.2)]"
                style={{
                  backgroundColor: `${item.color}08`,
                  color: item.color,
                }}
              >
                <item.icon size={26} strokeWidth={1.8} />
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-3 group-hover:text-[#1F7A3A] transition-colors">
                {item.label}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
