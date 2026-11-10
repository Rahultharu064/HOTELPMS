import React, { useRef } from "react";
import { Wifi, Waves, Dumbbell, Utensils, BadgeCheck } from "lucide-react";
import { SectionHeading } from "../layout/SectionHeading";

const ITEMS = [
  { icon: Wifi,       label: "Wi-Fi",          sub: "Stay connected during your visit.", color: "#1F7A3A" },
  { icon: Waves,      label: "Swimming pool",  sub: "Take a break and unwind during your stay.", color: "#F59E0B" },
  { icon: Dumbbell,   label: "Fitness room",   sub: "A space to keep up with your routine.", color: "#1F7A3A" },
  { icon: Utensils,   label: "Dining",         sub: "Food and refreshments for hotel guests.", color: "#F97316" },
];


const FacilitiesSection: React.FC = () => {
  const ref = useRef<HTMLElement>(null);

  return (
    <section id="facilities" ref={ref} className="section-padding bg-gray-50/50 border-y border-neutral-border/50 relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-50/50 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="container-custom relative z-10">
        <SectionHeading
          badge="Hotel amenities"
          badgeIcon={BadgeCheck}
          title={
            <>
              Facilities for a <span className="gradient-text">comfortable stay</span>
            </>
          }
          subtitle="A straightforward look at the amenities available during your stay."
          accent="green"
        />

        <div className="mb-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-xl border border-neutral-border/80 bg-white p-8 transition-shadow duration-300 hover:shadow-md facility-card opacity-100"
              ref={(el) => {
                if (el) el.style.setProperty('--delay', `${i * 100}ms`);
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-7 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_10px_25px_-5px_rgba(31,122,58,0.2)] facility-icon"
                ref={(el) => {
                  if (el) {
                    el.style.setProperty('--icon-bg', `${item.color}08`);
                    el.style.setProperty('--icon-color', item.color);
                  }
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

