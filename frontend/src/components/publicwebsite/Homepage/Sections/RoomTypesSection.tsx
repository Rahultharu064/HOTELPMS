import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";
import { ArrowRight } from "lucide-react";
import room1 from "../../../../assets/Standard Room2.png";
import room2 from "../../../../assets/Suite2.png";
import room3 from "../../../../assets/Standard Room3.png";

const roomTypes = [
  { type: "Deluxe", image: room1, count: 2, desc: "City views with modern luxury" },
  { type: "Suite", image: room2, count: 2, desc: "Spacious suites with living areas" },
  { type: "Family", image: room3, count: 1, desc: "Comfort designed for families" },
  { type: "Standard", image: room1, count: 1, desc: "Essential comfort for every guest" },
];

const RoomTypesSection = () => (
  <section className="section-padding bg-gray-50/50 border-y border-neutral-border/50">
    <div className="container-custom relative z-10">
      <ScrollReveal className="text-center mb-20 max-w-2xl mx-auto">
        <span className="text-[10px] font-bold tracking-[0.3em] text-primary-green uppercase mb-3 block opacity-80">Our Collection</span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-primary-dark mb-4 leading-tight tracking-tight">
          Browse by <span className="text-primary-green">Room Type</span>
        </h2>
        <div className="h-1 w-12 bg-[#F59E0B] mx-auto mb-4 rounded-full" />
        <p className="text-base text-gray-500 font-medium">
          Discover our diverse range of accommodations tailored to your needs.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {roomTypes.map((rt, i) => (
          <ScrollReveal key={rt.type} delay={i * 80}>
            <Link
              to={`/rooms?type=${rt.type}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 ease-out border border-white"
            >
              <img
                src={rt.image}
                alt={`${rt.type} rooms`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-[#111827]/10 to-transparent opacity-70 group-hover:opacity-80 transition-opacity" />
              
              <div className="absolute top-4 left-4">
                 <div className="px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-white text-[9px] font-bold uppercase tracking-wider">
                   {rt.count} {rt.count === 1 ? "room" : "rooms"}
                 </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl font-bold text-white mb-1.5">{rt.type}</h3>
                <p className="text-xs text-white/80 mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {rt.desc}
                </p>
                <div className="flex items-center text-white/90 font-bold text-[11px] uppercase tracking-wider group/btn">
                  <span className="mr-2">Explore Room</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                </div>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default RoomTypesSection;
