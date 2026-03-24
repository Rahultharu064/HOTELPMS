import { Link } from "react-router-dom";
import Button from "../../../ui/Button";
import { Users, BedDouble, Maximize, Star, ChevronRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import room1 from "../../../../assets/Standard Room1.png";
import room2 from "../../../../assets/Suite.png"
import room3 from "../../../../assets/Standard Room4.png"

const rooms = [
  { id: "1", name: "Deluxe Twin Room", price: 4500, image: room1, guests: 2, beds: 2, size: "32m²", rating: 4.8, desc: "Spacious room with city skyline views and modern amenities." },
  { id: "2", name: "Executive Suite", price: 8500, image: room2, guests: 3, beds: 1, size: "58m²", rating: 4.9, desc: "Premium suite with separate living area and panoramic views." },
  { id: "3", name: "Family Room", price: 6200, image: room3, guests: 4, beds: 2, size: "45m²", rating: 4.7, desc: "Comfortable room perfect for families with mountain views." },
];

const RoomsPreview = () => (
  <section className="section-py-lg bg-white relative overflow-hidden">
    {/* Animated Background Decor */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-50/20 rounded-full blur-[140px] pointer-events-none" />

    <div className="site-container relative z-10">
      <ScrollReveal className="text-center mb-24 max-w-3xl mx-auto">
        <span className="text-[10px] font-bold tracking-[0.4em] text-[#1F7A3A] uppercase mb-4 block">Exclusive Accommodations</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] mb-6 leading-tight tracking-tight">
          Our Special <span className="text-[#1F7A3A]">Rooms & Suites</span>
        </h2>
        <div className="h-1.5 w-16 bg-[#F59E0B] mx-auto rounded-full mb-6" />
        <p className="text-base text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
          Experience the pinnacle of hospitality with our handpicked selection of premium accommodations designed for absolute comfort.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {rooms.map((room, i) => (
          <ScrollReveal key={room.id} delay={i * 150}>
            <div className="group bg-white rounded-[40px] border border-gray-100/80 overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col h-full transform transition-transform">
              <div className="relative overflow-hidden aspect-[16/10]">
                <img 
                  src={room.image} 
                  alt={room.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                />
                
                {/* Status Badges */}
                <div className="absolute top-5 left-5">
                  <div className="bg-[#111827]/30 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 border border-white/20">
                    <Star className="h-3.5 w-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                    <span className="text-white text-[11px] font-black">{room.rating}</span>
                  </div>
                </div>

                <div className="absolute bottom-5 right-5">
                   <div className="bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-3xl shadow-lg border border-gray-100 transition-transform group-hover:translate-y-[-4px]">
                      <span className="text-[9px] text-gray-400 block leading-none font-extrabold uppercase tracking-widest mb-1.5">Nightly Rate</span>
                      <span className="text-xl font-black text-[#1F7A3A]">Rs.{room.price.toLocaleString()}</span>
                   </div>
                </div>
              </div>

              <div className="p-9 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-[#111827] mb-3 group-hover:text-[#1F7A3A] transition-colors">{room.name}</h3>
                <p className="text-gray-400 text-sm mb-8 line-clamp-2 font-medium leading-relaxed">
                  {room.desc}
                </p>
                
                <div className="grid grid-cols-3 gap-1 py-6 border-y border-gray-50 mb-8 items-center text-center">
                  <div className="flex flex-col items-center gap-1.5 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                    <Users className="h-5 w-5 text-[#1F7A3A]" />
                    <span className="text-[10px] uppercase tracking-widest font-black text-gray-500">{room.guests} Pax</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                    <BedDouble className="h-5 w-5 text-[#1F7A3A]" />
                    <span className="text-[10px] uppercase tracking-widest font-black text-gray-500">{room.beds} Beds</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 delay-150">
                    <Maximize className="h-5 w-5 text-[#1F7A3A]" />
                    <span className="text-[10px] uppercase tracking-widest font-black text-gray-500">{room.size}</span>
                  </div>
                </div>

                <div className="flex gap-4 mt-auto">
                  <Link to={`/rooms/${room.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full rounded-[20px] border-gray-100 text-[11px] font-black uppercase tracking-widest hover:border-[#1F7A3A] transition-all">
                      Preview
                    </Button>
                  </Link>
                  <Link to={`/booking/${room.id}`} className="flex-1">
                    <Button size="sm" className="w-full rounded-[20px] text-[11px] font-black uppercase tracking-widest shadow-lg shadow-green-900/10">
                      Reserve
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal className="text-center mt-16">
        <Link 
          to="/rooms" 
          className="inline-flex items-center gap-3 text-[#1F7A3A] text-[13px] font-black uppercase tracking-[0.2em] hover:gap-5 transition-all duration-300 group"
        >
          View More Suites
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </ScrollReveal>
    </div>
  </section>
);

export default RoomsPreview;
