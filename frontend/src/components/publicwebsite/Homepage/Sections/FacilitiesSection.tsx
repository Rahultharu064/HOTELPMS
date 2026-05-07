import React, { useRef, useEffect, useState } from "react";
import { Wifi, Waves, Dumbbell, Utensils, Zap, Smartphone, Leaf, Monitor } from "lucide-react";

const ITEMS = [
  { icon: Wifi,       label: "1Gbps Fiber Wi-Fi",  sub: "Seamless connectivity throughout the entire estate.",        color: "#1F7A3A" },
  { icon: Waves,      label: "Infinity Pool",        sub: "Heated rooftop pool with panoramic views.",                 color: "#F59E0B" },
  { icon: Dumbbell,   label: "Smart Fitness",       sub: "AI-integrated equipment and Peloton studios.",              color: "#1F7A3A" },
  { icon: Utensils,   label: "Gourmet Dining",      sub: "Farm-to-table culinary excellence by master chefs.",         color: "#F97316" },
  { icon: Smartphone, label: "Smart Controls",      sub: "Manage room lighting & climate from your phone.",           color: "#1F7A3A", status: "New" },
  { icon: Zap,        label: "EV Charging",         sub: "Universal electric vehicle charging stations.",             color: "#DC2626", status: "Coming Soon" },
  { icon: Leaf,       label: "Eco-Friendly",        sub: "100% solar powered with zero-waste initiatives.",           color: "#1F7A3A", status: "Planned" },
  { icon: Monitor,    label: "Business Hub",        sub: "Private soundproof pods for remote work.",                  color: "#F59E0B", status: "New" },
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
    <section id="facilities" ref={ref} className="section-padding bg-gray-50/50 border-y border-neutral-border/50 relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-50/50 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="container-custom relative z-10">
        
        <div
          className={`text-center mb-20 max-w-3xl mx-auto transition-all duration-1000 ease-out ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <span className="text-[10px] font-bold tracking-[0.4em] text-[#1F7A3A] uppercase mb-4 block">Future-Ready Hospitality</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-primary-dark mb-4 leading-tight tracking-tight">
            Elevated <span className="text-primary-green">Facilities</span>
          </h2>
          <div className="h-1.5 w-16 bg-[#F59E0B] mx-auto rounded-full mb-6" />
          <p className="text-base text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            We are constantly evolving. Our facilities are designed to meet the needs of today while anticipating the technology of tomorrow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {ITEMS.map((item, i) => (
            <div
              key={i}
              className={`group bg-white rounded-[32px] p-8 border border-gray-100/80 hover:border-[#1F7A3A]/10 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)] transition-all duration-700 relative overflow-hidden ${
                show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {item.status && (
                <div className="absolute top-4 right-4 bg-[#1F7A3A]/10 text-[#1F7A3A] text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
                  {item.status}
                </div>
              )}
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

