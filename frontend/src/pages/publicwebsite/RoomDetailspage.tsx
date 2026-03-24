import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import PublicLayout from "../../components/publicwebsite/Homepage/Sections/PublicLayout";
import Button from "../../components/ui/Button";
import { Star, Users, BedDouble, Maximize, Wifi, Car, Coffee, Waves, Shield, ChevronLeft, ChevronRight, Check } from "lucide-react";

import room1 from "../../assets/Standard Room1.png";
import room2 from "../../assets/Suite.png";
import room3 from "../../assets/Standard Room3.png";
import room4 from "../../assets/Standard Room4.png";
import suite1 from "../../assets/Suite1.png";
import suite2 from "../../assets/Suite2.png";

const ROOMS_DATA: Record<string, {
  name: string; type: string; price: number; images: string[]; guests: number; beds: number; size: string; rating: number; reviews: number; desc: string; amenities: string[];
}> = {
  "1": { name: "Deluxe Twin Room", type: "Deluxe", price: 4500, images: [room1, room3, room4], guests: 2, beds: 2, size: "32m²", rating: 4.8, reviews: 124, desc: "Experience the perfect blend of modern comfort and elegant design in our Deluxe Twin Room. Featuring panoramic city skyline views, premium twin beds with luxury linens, a marble-finished bathroom with rain shower, and a dedicated workspace. Ideal for business travelers and couples seeking refined hospitality.", amenities: ["Free Wi-Fi", "Air Conditioning", "Mini Bar", "Room Service", "Smart TV", "Safe", "Iron & Board", "Hair Dryer"] },
  "2": { name: "Executive Suite", type: "Suite", price: 8500, images: [room2, suite1, suite2], guests: 3, beds: 1, size: "58m²", rating: 4.9, reviews: 89, desc: "Our Executive Suite redefines luxury with a separate living area, private dining space, and floor-to-ceiling windows offering unobstructed panoramic views of the Sunsari valley. Features include a king-size bed with premium linens, dual vanity bathroom with soaking tub, and exclusive access to the executive lounge.", amenities: ["Free Wi-Fi", "Air Conditioning", "Mini Bar", "Room Service", "Smart TV", "Safe", "Bathrobe & Slippers", "Nespresso Machine", "Living Area", "Executive Lounge Access"] },
  "3": { name: "Family Room", type: "Family", price: 6200, images: [room3, room1, room4], guests: 4, beds: 2, size: "45m²", rating: 4.7, reviews: 156, desc: "Designed with families in mind, this spacious room offers two queen beds, a cozy sitting area, and stunning mountain views. Child-friendly amenities, extra storage space, and a large bathroom make this the perfect home away from home for your family vacation.", amenities: ["Free Wi-Fi", "Air Conditioning", "Mini Bar", "Room Service", "Smart TV", "Safe", "Extra Bedding", "Baby Cot Available", "Family Toiletries"] },
  "4": { name: "Standard Single", type: "Standard", price: 2800, images: [room4, room1, room3], guests: 1, beds: 1, size: "22m²", rating: 4.5, reviews: 210, desc: "A cozy retreat for the solo traveler. Our Standard Single room provides all essential amenities in a warm, inviting setting. Features a comfortable single bed, en-suite bathroom, work desk, and complimentary high-speed Wi-Fi.", amenities: ["Free Wi-Fi", "Air Conditioning", "Room Service", "Smart TV", "Safe", "Hair Dryer"] },
  "5": { name: "Honeymoon Suite", type: "Suite", price: 12000, images: [suite1, suite2, room2], guests: 2, beds: 1, size: "65m²", rating: 5.0, reviews: 42, desc: "An unforgettable romantic escape. The Honeymoon Suite features a private jacuzzi, king-size canopy bed, champagne welcome service, and a private balcony with breathtaking sunset views. Rose petal turndown service and couples spa access included.", amenities: ["Free Wi-Fi", "Air Conditioning", "Private Jacuzzi", "Champagne Service", "Smart TV", "Safe", "Bathrobe & Slippers", "Private Balcony", "Couples Spa Access", "Nespresso Machine"] },
  "6": { name: "Deluxe King Room", type: "Deluxe", price: 5500, images: [suite2, room1, suite1], guests: 2, beds: 1, size: "38m²", rating: 4.8, reviews: 98, desc: "Elegance meets comfort in our Deluxe King Room. A plush king-size bed, premium work desk, and breathtaking city panorama create the ideal environment for both relaxation and productivity. The marble bathroom features a walk-in rain shower and luxury toiletries.", amenities: ["Free Wi-Fi", "Air Conditioning", "Mini Bar", "Room Service", "Smart TV", "Safe", "Iron & Board", "Hair Dryer", "Nespresso Machine"] },
};

const AMENITY_ICONS: Record<string, React.ElementType> = {
  "Free Wi-Fi": Wifi, "Valet Parking": Car, "Nespresso Machine": Coffee, "Private Jacuzzi": Waves, "Safe": Shield,
};

const RoomDetailspage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const room = ROOMS_DATA[id || "1"];
  const [activeImg, setActiveImg] = useState(0);

  if (!room) {
    return (
      <PublicLayout>
        <div className="section-py-lg text-center site-container">
          <h1 className="text-3xl font-extrabold text-[#111827] mb-4">Room Not Found</h1>
          <Link to="/rooms" className="text-[#1F7A3A] font-bold underline">← Back to Rooms</Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Breadcrumb Strip */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="site-container py-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
          <Link to="/" className="text-gray-400 hover:text-[#1F7A3A] transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3 text-gray-300" />
          <Link to="/rooms" className="text-gray-400 hover:text-[#1F7A3A] transition-colors">Rooms</Link>
          <ChevronRight className="h-3 w-3 text-gray-300" />
          <span className="text-[#1F7A3A]">{room.name}</span>
        </div>
      </div>

      {/* Gallery + Details */}
      <section className="section-py-lg bg-white">
        <div className="site-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Image Gallery */}
            <div>
              <div className="relative rounded-[32px] overflow-hidden aspect-[4/3] mb-5 group">
                <img src={room.images[activeImg]} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <button
                  onClick={() => setActiveImg((activeImg - 1 + room.images.length) % room.images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#111827] hover:bg-white transition-all shadow-md cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setActiveImg((activeImg + 1) % room.images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#111827] hover:bg-white transition-all shadow-md cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {room.images.map((_, i) => (
                    <button key={i} onClick={() => setActiveImg(i)} className={`rounded-full transition-all cursor-pointer ${i === activeImg ? "w-8 h-2 bg-[#F59E0B]" : "w-2 h-2 bg-white/50 hover:bg-white/80"}`} />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {room.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`rounded-2xl overflow-hidden aspect-[4/3] border-2 transition-all cursor-pointer ${i === activeImg ? "border-[#1F7A3A] shadow-lg" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img src={img} alt={`${room.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Room Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#1F7A3A]/10 text-[#1F7A3A] rounded-lg text-[10px] font-black uppercase tracking-widest">{room.type}</span>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-[#F59E0B] fill-[#F59E0B]" />
                  <span className="text-sm font-black text-[#111827]">{room.rating}</span>
                  <span className="text-xs text-gray-400 font-medium">({room.reviews} reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-6 tracking-tight">{room.name}</h1>

              <p className="text-gray-500 text-base leading-relaxed mb-8 font-medium">{room.desc}</p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 p-6 bg-gray-50 rounded-3xl mb-8">
                <div className="flex flex-col items-center gap-2">
                  <Users className="h-6 w-6 text-[#1F7A3A]" />
                  <span className="text-[10px] uppercase tracking-widest font-black text-gray-500">{room.guests} Guests</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <BedDouble className="h-6 w-6 text-[#1F7A3A]" />
                  <span className="text-[10px] uppercase tracking-widest font-black text-gray-500">{room.beds} {room.beds > 1 ? "Beds" : "Bed"}</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Maximize className="h-6 w-6 text-[#1F7A3A]" />
                  <span className="text-[10px] uppercase tracking-widest font-black text-gray-500">{room.size}</span>
                </div>
              </div>

              {/* Amenities */}
              <h3 className="text-lg font-bold text-[#111827] mb-5">Room Amenities</h3>
              <div className="grid grid-cols-2 gap-3 mb-10">
                {room.amenities.map((a) => {
                  const Icon = AMENITY_ICONS[a] || Check;
                  return (
                    <div key={a} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/80 border border-gray-50">
                      <Icon className="h-4 w-4 text-[#1F7A3A] shrink-0" />
                      <span className="text-sm font-medium text-gray-600">{a}</span>
                    </div>
                  );
                })}
              </div>

              {/* Price & CTA */}
              <div className="flex items-end justify-between p-8 bg-gradient-to-r from-[#0C2012] to-[#14532D] rounded-3xl">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-black text-white/50 block mb-1">Starting From</span>
                  <span className="text-3xl font-black text-white">Rs.{room.price.toLocaleString()}</span>
                  <span className="text-white/40 text-sm font-medium"> /night</span>
                </div>
                <Link to={`/booking/${id}`}>
                  <Button size="lg" className="rounded-2xl text-[12px] font-black uppercase tracking-widest bg-[#F59E0B] hover:bg-[#D97706] text-[#14532D] shadow-xl">
                    Book This Room
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default RoomDetailspage;
