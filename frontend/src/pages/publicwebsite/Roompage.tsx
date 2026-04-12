import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/Button";
import { roomService, type Room } from "../../services/roomService";
import { roomTypeService, type RoomType } from "../../services/roomTypeService";
import { Users, BedDouble, Maximize, Star, SlidersHorizontal, X, Loader2 } from "lucide-react";


const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    className="h-full"
  >
    {children}
  </motion.div>
);

export const Roompage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type");
  const [typeFilters, setTypeFilters] = useState<string[]>(initialType ? [initialType] : []);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [showFilters, setShowFilters] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [roomsRes, typesRes] = await Promise.all([
          roomService.getAllRooms(),
          roomTypeService.getAllRoomTypes(),
        ]);
        if (roomsRes.success) setRooms(roomsRes.data);
        if (typesRes.success) setRoomTypes(typesRes.data.roomTypes);
      } catch (error) {
        console.error("Failed to fetch room data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const t = searchParams.get("type");
    if (t) setTypeFilters([t]);
  }, [searchParams]);

  const toggleType = (t: string) => {
    setTypeFilters(prev => 
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  const filteredRooms = rooms.filter(r => {
    const typeName = r.roomType?.name || "";
    if (typeFilters.length > 0 && !typeFilters.includes(typeName)) return false;
    if (Number(r.basePrice) > maxPrice) return false;
    return true;
  });

  const FilterPanel = () => (
    <div className="space-y-8">
      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-[0.15em] text-primary-dark mb-4 drop-shadow-sm border-b border-neutral-border pb-2">Room Category</h4>
        <div className="space-y-3">
          {roomTypes.map(t => (
            <label key={t.id} className="flex items-center gap-3 text-sm font-semibold text-neutral-text-secondary cursor-pointer hover:text-primary-green transition-colors group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={typeFilters.includes(t.name)} 
                  onChange={() => toggleType(t.name)} 
                  className="w-5 h-5 rounded-md border-2 border-neutral-border text-primary-green focus:ring-primary-green focus:ring-opacity-50 accent-primary-green cursor-pointer peer appearance-none checked:bg-primary-green checked:border-primary-green transition-all" 
                />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span className="capitalize group-hover:translate-x-1 transition-transform">{t.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-[0.15em] text-primary-dark mb-4 drop-shadow-sm border-b border-neutral-border pb-2 flex justify-between items-center">
          <span>Max Price</span>
          <span className="text-primary-green bg-primary-green/10 px-2 py-0.5 rounded-md">Rs. {maxPrice.toLocaleString()}</span>
        </h4>
        <div className="pt-2">
          <input 
            type="range" 
            title="Max Price"
            aria-label="Max Price"
            min={100} 
            max={15000} 
            step={100} 
            value={maxPrice} 
            onChange={e => setMaxPrice(Number(e.target.value))} 
            className="w-full accent-primary-green h-1.5 bg-neutral-border rounded-lg appearance-none cursor-pointer hover:h-2 transition-all outline-none" 
          />
          <div className="flex justify-between text-[10px] text-neutral-text-secondary font-bold uppercase tracking-widest mt-3">
            <span>Rs. 100</span>
            <span>Rs. 15,000</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-neutral-border/50">
        <Button size="md" variant="primary" className="flex-1 font-bold shadow-lg shadow-primary-green/20" onClick={() => setShowFilters(false)}>Apply ({filteredRooms.length})</Button>
        <Button size="md" variant="outline" className="flex-1 font-bold" onClick={() => { setTypeFilters([]); setMaxPrice(15000); }}>Reset</Button>
      </div>
    </div>
  );

  return (
    <main className="bg-neutral-light min-h-screen pb-24">
      {/* Header Banner */}
      <div className="pt-12 pb-16 lg:pt-20 lg:pb-24 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-3 py-1 bg-primary-gold/10 rounded-full text-xs font-bold uppercase tracking-widest text-primary-gold mb-4 border border-primary-gold/20">Accommodation</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-dark tracking-tight mb-4 drop-shadow-sm">Our Signature Rooms</h1>
            <p className="text-lg text-neutral-text-secondary max-w-2xl font-medium leading-relaxed">Find the perfect sanctuary tailored for your stay. Experience unparalleled comfort, breathtaking views, and modern luxury.</p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom mt-2 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-xl shadow-md border border-neutral-border/50 backdrop-blur-md relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-gold" />
            <span className="font-extrabold text-primary-dark ml-3 tracking-tight">{filteredRooms.length} Rooms match your search</span>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(true)} className="border-neutral-border text-primary-dark font-bold bg-neutral-light shadow-sm">
              <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
            </Button>
          </div>

          {/* Mobile Filters Modal */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[100] bg-white p-6 overflow-auto lg:hidden flex flex-col"
              >
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-neutral-border">
                  <h3 className="font-extrabold text-2xl text-primary-dark tracking-tight">Refine Search</h3>
                  <button title="Close filters" aria-label="Close filters" onClick={() => setShowFilters(false)} className="h-10 w-10 bg-neutral-light rounded-full flex justify-center items-center text-primary-dark hover:bg-neutral-border transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                   <FilterPanel />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-28 bg-white border border-neutral-border rounded-3xl shadow-xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-green to-primary-gold" />
              <h3 className="font-extrabold text-xl text-primary-dark mb-8 tracking-tight flex items-center gap-2.5">
                <span className="bg-primary-green/10 text-primary-green p-1.5 rounded-lg">
                  <SlidersHorizontal className="h-4 w-4" />
                </span>
                Refine Search
              </h3>
              <FilterPanel />
            </motion.div>
          </aside>

          {/* Room Grid */}
          <div className="flex-1">
            <div className="hidden lg:flex justify-between items-center mb-6 pl-2">
              {loading ? (
                <div className="flex items-center gap-2 text-primary-green animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs font-extrabold uppercase tracking-[0.15em]">Refining your sanctuaries...</span>
                </div>
              ) : (
                <p className="text-xs font-extrabold text-neutral-text-secondary uppercase tracking-[0.15em]">Showing {filteredRooms.length} curated rooms</p>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRooms.map((room, i) => {
                const primaryImage = room.images?.find(img => img.isPrimary)?.url || room.images?.[0]?.url || "https://images.unsplash.com/photo-1566665797739-1674de7a421a";
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
                const imageUrl = primaryImage.startsWith("http") ? primaryImage : `${backendUrl}${primaryImage}`;

                return (
                  <ScrollReveal key={room.id} delay={i * 0.1}>
                    <div className="group flex flex-col h-full rounded-3xl border border-neutral-border bg-white overflow-hidden shadow-sm hover:shadow-2xl hover:border-primary-green/30 transition-all duration-500 transform hover:-translate-y-1.5 relative">
                      <div className="relative overflow-hidden aspect-[4/3] bg-neutral-light">
                        <img src={imageUrl} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                        
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-extrabold text-primary-dark shadow-xl flex items-center gap-1.5">
                          <Star className="h-3 w-3 text-primary-gold fill-primary-gold" /> 4.8
                        </div>
                        
                        {Number(room.basePrice) >= 5000 && (
                          <div className="absolute top-4 left-4 bg-primary-gold text-white px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest shadow-xl backdrop-blur-sm">
                            Premium Pick
                          </div>
                        )}
                        
                        <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                           <div className="flex-1 pr-2">
                             <div className="text-[10px] text-white/80 font-bold uppercase tracking-widest mb-1">{room.roomType?.name}</div>
                             <h3 className="font-extrabold text-2xl text-white drop-shadow-lg leading-tight group-hover:text-primary-green transition-colors">{room.name}</h3>
                           </div>
                           <div className="text-right pl-2 border-l border-white/20">
                             <span className="block text-[10px] text-white/80 font-bold uppercase tracking-wider mb-0.5">Starting At</span>
                             <span className="text-xl font-extrabold text-primary-gold drop-shadow-md whitespace-nowrap">Rs. {Number(room.basePrice).toLocaleString()}</span>
                           </div>
                        </div>
                      </div>
                      
                      <div className="p-5 flex flex-col flex-1">
                        <p className="text-[13px] text-neutral-text-secondary mb-6 line-clamp-2 leading-relaxed flex-1 font-medium">{room.description}</p>
                        
                        <div className="grid grid-cols-3 gap-2 mb-6">
                          <div className="flex flex-col items-center justify-center gap-1.5 text-[11px] font-bold text-primary-dark bg-neutral-light/50 p-2 rounded-xl border border-neutral-border/50 group-hover:bg-primary-green/5 transition-colors">
                            <Users className="h-3.5 w-3.5 text-primary-green" /> 
                            <span>{room.capacity}</span>
                          </div>
                          <div className="flex flex-col items-center justify-center gap-1.5 text-[11px] font-bold text-primary-dark bg-neutral-light/50 p-2 rounded-xl border border-neutral-border/50 group-hover:bg-primary-gold/5 transition-colors">
                            <BedDouble className="h-3.5 w-3.5 text-primary-gold" /> 
                            <span className="truncate w-full text-center" title={room.bedType}>{room.bedType || 'Queen'}</span>
                          </div>
                          <div className="flex flex-col items-center justify-center gap-1.5 text-[11px] font-bold text-primary-dark bg-neutral-light/50 p-2 rounded-xl border border-neutral-border/50 group-hover:bg-primary-green/5 transition-colors">
                            <Maximize className="h-3.5 w-3.5 text-primary-dark cursor-help" /> 
                            <span>{room.size || 30}m²</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2.5 mt-auto">
                          <Button variant="outline" size="sm" className="flex-1 font-bold shadow-sm rounded-lg border-neutral-border text-primary-dark hover:bg-neutral-light text-xs" asChild>
                            <Link to={`/rooms/${room.id}`}>Preview</Link>
                          </Button>
                          <Button variant="primary" size="sm" className="flex-1 font-extrabold shadow-md shadow-primary-green/20 rounded-lg text-xs" asChild>
                            <Link to={`/booking?room=${room.id}`}>Reserve</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>

            {filteredRooms.length === 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-24 bg-white shadow-sm rounded-3xl border border-neutral-border border-dashed mt-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-primary-gold/5 rounded-bl-full pointer-events-none" />
                <span className="text-6xl mb-6 block opacity-30 select-none">🔭</span>
                <h3 className="text-2xl font-extrabold text-primary-dark mb-3 tracking-tight">No Rooms Found</h3>
                <p className="text-neutral-text-secondary text-sm font-medium max-w-sm mx-auto mb-8 leading-relaxed">We couldn't find any sanctuaries matching your exact filter criteria. Discover other remarkable stays by adjusting your preferences.</p>
                <Button 
                  onClick={() => { setTypeFilters([]); setMaxPrice(15000); }}
                  variant="outline"
                  className="font-bold text-primary-green border-primary-green/30 hover:bg-primary-green/10 bg-primary-green/5 rounded-xl px-8 h-12 shadow-sm relative z-10"
                >
                  Clear all filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};