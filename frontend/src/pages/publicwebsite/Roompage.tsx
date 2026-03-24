import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PublicLayout from "../../components/publicwebsite/Homepage/Sections/PublicLayout";
import PageHero from "../../components/publicwebsite/Homepage/layout/PageHero";
import ScrollReveal from "../../components/publicwebsite/Homepage/Sections/ScrollReveal";
import Button from "../../components/ui/Button";
import { Users, BedDouble, Maximize, Star, SlidersHorizontal, X } from "lucide-react";

import room1 from "../../assets/Standard Room1.png";
import room2 from "../../assets/Suite.png";
import room3 from "../../assets/Standard Room3.png";
import room4 from "../../assets/Standard Room4.png";
import suite1 from "../../assets/Suite1.png";
import suite2 from "../../assets/Suite2.png";

const allRooms = [
  { id: "1", name: "Deluxe Twin Room", price: 4500, image: room1, type: "Deluxe", guests: 2, beds: 2, size: "32m²", rating: 4.8, desc: "Spacious room with city skyline views and modern amenities." },
  { id: "2", name: "Executive Suite", price: 8500, image: room2, type: "Suite", guests: 3, beds: 1, size: "58m²", rating: 4.9, desc: "Premium suite with separate living area and panoramic views." },
  { id: "3", name: "Family Room", price: 6200, image: room3, type: "Family", guests: 4, beds: 2, size: "45m²", rating: 4.7, desc: "Comfortable room perfect for families with mountain views." },
  { id: "4", name: "Standard Single", price: 2800, image: room4, type: "Standard", guests: 1, beds: 1, size: "22m²", rating: 4.5, desc: "Cozy room ideal for solo travelers with all essentials." },
  { id: "5", name: "Premium Suite", price: 12000, image: suite1, type: "Suite", guests: 4, beds: 2, size: "75m²", rating: 5.0, desc: "Our finest suite with private balcony and luxury amenities." },
  { id: "6", name: "Deluxe King Room", price: 5500, image: suite2, type: "Deluxe", guests: 2, beds: 1, size: "38m²", rating: 4.6, desc: "Elegant king room with mountain-facing views and premium bedding." },
];

const RoomsPage = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type");
  const [typeFilter, setTypeFilter] = useState<string[]>(initialType ? [initialType] : []);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const t = searchParams.get("type");
    if (t) setTypeFilter([t]);
  }, [searchParams]);

  const types = [...new Set(allRooms.map((r) => r.type))];

  const toggleType = (t: string) =>
    setTypeFilter((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const filtered = allRooms.filter((r) => {
    if (typeFilter.length && !typeFilter.includes(r.type)) return false;
    if (r.price > maxPrice) return false;
    return true;
  });

  /* ── Shared Filter Panel ── */
  const FilterPanel = () => (
    <div className="space-y-7">
      {/* Room Type */}
      <div>
        <h4 className="text-[11px] uppercase tracking-[0.15em] font-black text-gray-400 mb-4">Room Type</h4>
        <div className="space-y-2.5">
          {types.map((t) => (
            <label
              key={t}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors group"
            >
              <input
                type="checkbox"
                checked={typeFilter.includes(t)}
                onChange={() => toggleType(t)}
                className="h-4 w-4 rounded-md border-2 border-gray-200 text-[#1F7A3A] accent-[#1F7A3A] cursor-pointer transition-all"
              />
              <span className={`flex-1 ${typeFilter.includes(t) ? "text-[#1F7A3A] font-bold" : "text-gray-600"}`}>
                {t}
              </span>
              <span className="text-[10px] font-bold text-gray-300 bg-gray-50 px-2 py-0.5 rounded-md group-hover:bg-gray-100">
                {allRooms.filter((r) => r.type === t).length}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-[11px] uppercase tracking-[0.15em] font-black text-gray-400 mb-4">Budget</h4>
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <p className="text-sm font-bold text-[#111827] mb-4">
            Max: <span className="text-[#1F7A3A]">Rs.{maxPrice.toLocaleString()}</span>
          </p>
          <input
            type="range"
            min={1000}
            max={15000}
            step={500}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-gray-200 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#1F7A3A] [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400">
            <span>Rs.1,000</span>
            <span>Rs.15,000</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button size="sm" className="flex-1 rounded-xl text-xs font-bold">
          Apply
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 rounded-xl text-xs font-bold"
          onClick={() => {
            setTypeFilter([]);
            setMaxPrice(15000);
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );

  return (
    <PublicLayout>
      {/* ── Page Header ── */}
      <PageHero
        title="Our"
        highlight="Rooms"
        subtitle="Find the perfect room for your stay"
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Rooms" }]}
        bgImage={room2}
      />

      <div className="site-container py-12">
        {/* ── Mobile Filter Toggle ── */}
        <div className="lg:hidden mb-6">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="rounded-xl text-xs font-bold gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>

          {/* Mobile Filter Overlay */}
          {showFilters && (
            <div className="fixed inset-0 z-50 bg-white p-6 overflow-auto animate-fade-slide-up">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-[#111827]">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <FilterPanel />
            </div>
          )}
        </div>

        {/* ── Main Layout: Sidebar + Grid ── */}
        <div className="flex gap-10">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-[88px] bg-white border border-gray-100 rounded-[24px] p-7 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)]">
              <h3 className="text-sm font-bold text-[#111827] mb-6 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#1F7A3A]" />
                Filters
              </h3>
              <FilterPanel />
            </div>
          </aside>

          {/* Room Grid */}
          <div className="flex-1">
            <p className="text-sm text-gray-400 font-bold mb-8">
              <span className="text-[#1F7A3A] font-extrabold">{filtered.length}</span> rooms found
            </p>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">
              {filtered.map((room, i) => (
                <ScrollReveal key={room.id} delay={i * 80}>
                  <div className="group rounded-[24px] border border-gray-100 bg-white overflow-hidden hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-full">
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-video">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm border border-gray-50">
                        <Star className="h-3 w-3 text-[#F59E0B] fill-[#F59E0B]" />
                        {room.rating}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-base font-bold text-[#111827] group-hover:text-[#1F7A3A] transition-colors">{room.name}</h3>
                        <div className="text-right shrink-0 ml-3">
                          <span className="text-[#1F7A3A] font-extrabold text-base">Rs.{room.price.toLocaleString()}</span>
                          <span className="text-[10px] font-medium text-gray-400 block">/night</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-400 mb-5 line-clamp-2 font-medium leading-relaxed">{room.desc}</p>

                      <div className="flex items-center gap-5 text-gray-400 mb-6">
                        <span className="flex items-center gap-1.5 text-xs font-bold">
                          <Users className="h-3.5 w-3.5" /> {room.guests}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-bold">
                          <BedDouble className="h-3.5 w-3.5" /> {room.beds}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-bold">
                          <Maximize className="h-3.5 w-3.5" /> {room.size}
                        </span>
                      </div>

                      <div className="flex gap-3 mt-auto">
                        <Link to={`/rooms/${room.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-bold">
                            View Details
                          </Button>
                        </Link>
                        <Link to={`/booking/${room.id}`} className="flex-1">
                          <Button size="sm" className="w-full rounded-xl text-xs font-bold">
                            Book Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Empty State */}
            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg font-bold mb-4">No rooms match your filters.</p>
                <button
                  onClick={() => { setTypeFilter([]); setMaxPrice(15000); }}
                  className="text-[#1F7A3A] font-bold text-sm underline cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default RoomsPage;
