import React, { useState, useEffect } from 'react';
import { 
  Search, ShoppingCart, Plus, Minus, X, 
  User, Utensils, Waves, 
  Wind, Ghost, Zap, Loader2,
  Trash2, CreditCard, Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { extraService } from '../../services/extraService';
import { frontOfficeService } from '../../services/frontofficeService';
import { toast } from 'react-hot-toast';
import { Button } from '../../components/ui/Button';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const ServicePOSPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [guestSearch, setGuestSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  const [isWalkIn, setIsWalkIn] = useState(false);
  const [walkInName, setWalkInName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (activeCategory) fetchServices(activeCategory);
  }, [activeCategory]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const res = await extraService.getServiceCategories();
      if (res.success) {
        setCategories(res.data);
        if (res.data.length > 0) setActiveCategory(res.data[0].id);
      }
    } catch (error) {
      toast.error("Failed to load service infrastructure");
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async (catId: number) => {
    try {
      const res = await extraService.getServices(catId);
      if (res.success) setServices(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGuestSearch = async (query: string) => {
    setGuestSearch(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await frontOfficeService.searchUnified(query);
      if (res.success) {
        // Filter only checked_in bookings for in-house services
        const inHouse = res.data.bookings.filter((b: any) => b.status === 'checked_in');
        setSearchResults(inHouse);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = (service: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === service.id);
      if (existing) {
        return prev.map(item => item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: service.id, name: service.name, price: Number(service.price), quantity: 1 }];
    });
    toast.success(`${service.name} added to dossier`, { icon: '🛒', style: { borderRadius: '10px', background: '#111827', color: '#fff', fontSize: '11px', fontWeight: 'bold' } });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error("Manifest is empty");
      return;
    }
    if (!isWalkIn && !selectedRecipient) {
      toast.error("Target recipient required for folio posting");
      return;
    }
    if (isWalkIn && !walkInName) {
      toast.error("Identifier required for walk-in session");
      return;
    }

    try {
      setSubmitting(true);
      const orderData = {
        bookingId: selectedRecipient?.id,
        roomId: selectedRecipient?.roomId,
        guestId: selectedRecipient?.guestId,
        requestedBy: isWalkIn ? walkInName : `${selectedRecipient.guest.firstName} ${selectedRecipient.guest.lastName}`,
        items: cart.map(item => ({ serviceId: item.id, quantity: item.quantity })),
        priority: 'normal' as const
      };

      const res = await extraService.createOrder(orderData);
      if (res.success) {
        toast.success("Service order transmitted successfully");
        setCart([]);
        setSelectedRecipient(null);
        setGuestSearch("");
        setWalkInName("");
      }
    } catch (error: any) {
      toast.error(error.message || "Transmission failure");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6 animate-fade-in px-4 lg:px-0">
      {/* Header / Recipient Selector */}
      <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isWalkIn ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'} transition-colors`}>
                {isWalkIn ? <Zap size={24} strokeWidth={2.5} /> : <User size={24} strokeWidth={2.5} />}
            </div>
            <div>
                <h2 className="text-sm font-black text-[#111827] uppercase tracking-tight">Service Recipient</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {isWalkIn ? "Direct External Walk-in" : "In-house Guest Folio"}
                </p>
            </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row gap-4 w-full">
            <div className="relative flex-1">
                {isWalkIn ? (
                    <input 
                        placeholder="Enter Walk-in Customer Name..." 
                        value={walkInName}
                        onChange={(e) => setWalkInName(e.target.value)}
                        className="w-full h-14 pl-6 pr-6 bg-gray-50 border-none rounded-2xl text-[13px] font-bold focus:ring-2 focus:ring-amber-500 transition-all"
                    />
                ) : (
                    <div className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            placeholder="Search Room Number or Guest Name..." 
                            value={guestSearch}
                            onChange={(e) => handleGuestSearch(e.target.value)}
                            onFocus={() => selectedRecipient && setSelectedRecipient(null)}
                            className="w-full h-14 pl-14 pr-6 bg-gray-50 border-none rounded-2xl text-[13px] font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <AnimatePresence>
                            {searchResults.length > 0 && !selectedRecipient && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-3xl shadow-2xl z-50 overflow-hidden"
                                >
                                    {searchResults.map((res: any) => (
                                        <button 
                                            key={res.id} 
                                            onClick={() => {
                                                setSelectedRecipient(res);
                                                setGuestSearch(`Room ${res.room.roomNumber} - ${res.guest.firstName} ${res.guest.lastName}`);
                                                setSearchResults([]);
                                            }}
                                            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-all text-left group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                                                    {res.room.roomNumber}
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-[#111827] uppercase">{res.guest.firstName} {res.guest.lastName}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 capitalize">{res.room.roomType.name}</p>
                                                </div>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="sm" className="bg-blue-600">Select</Button>
                                            </div>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <button 
                onClick={() => {
                    setIsWalkIn(!isWalkIn);
                    setSelectedRecipient(null);
                    setSearchResults([]);
                    setGuestSearch("");
                }}
                className={`px-8 h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg
                    ${isWalkIn ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20' : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'}`}
            >
                {isWalkIn ? "Switch to In-house" : "Switch to Walk-in"}
            </button>
        </div>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        {/* Left: Categories & Services */}
        <div className="flex-1 flex flex-col gap-6">
            {/* Categories */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-3
                            ${activeCategory === cat.id 
                                ? "bg-[#111827] text-white shadow-xl translate-y-[-2px]" 
                                : "bg-white text-gray-400 hover:text-[#111827] border border-gray-100"}`}
                    >
                        {cat.name === 'Restaurant' && <Utensils size={14} />}
                        {cat.name === 'Laundry' && <Wind size={14} />}
                        {cat.name === 'Spa' && <Waves size={14} />}
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Services Grid */}
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
                    {loading ? (
                        Array(8).fill(0).map((_, i) => (
                            <div key={i} className="h-48 bg-gray-100 rounded-[32px] animate-pulse" />
                        ))
                    ) : services.length > 0 ? (
                        services.map((service) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={service.id} 
                                className="group bg-white p-6 rounded-[32px] border border-gray-100 hover:shadow-2xl transition-all relative flex flex-col cursor-pointer"
                                onClick={() => addToCart(service)}
                            >
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-8 h-8 rounded-xl bg-[#14532D] text-white flex items-center justify-center">
                                        <Plus size={16} strokeWidth={3} />
                                    </div>
                                </div>
                                
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-[#14532D]/5 transition-colors">
                                    <Ghost className="text-gray-400 group-hover:text-[#14532D]" size={20} />
                                </div>
                                <h4 className="text-[13px] font-black text-[#111827] uppercase leading-tight">{service.name}</h4>
                                <p className="text-[10px] font-bold text-gray-400 line-clamp-2 mt-2 leading-relaxed">{service.description || "Premium hospitality service"}</p>
                                
                                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-sm font-black text-[#1F7A3A] font-mono">Rs. {Number(service.price).toLocaleString()}</span>
                                    <span className="text-[8px] font-black uppercase text-gray-300 tracking-tighter group-hover:text-green-600 transition-colors">Select Item</span>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-40 flex flex-col items-center justify-center text-gray-300 gap-4">
                            <Utensils size={48} />
                            <p className="text-[11px] font-black uppercase tracking-widest text-center">Operational units currently unavailable in this category</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Right: Cart Manifesto */}
        <div className="w-[400px] bg-[#111827] rounded-[48px] shadow-2xl flex flex-col overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl text-amber-500">
                        <ShoppingCart size={22} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-tight">Service Cart</h3>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{cart.length} unique assets</p>
                    </div>
                </div>
                {cart.length > 0 && (
                    <button onClick={() => setCart([])} className="text-white/20 hover:text-red-400 transition-colors">
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar-dark">
                <AnimatePresence>
                    {cart.map((item) => (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            key={item.id} 
                            className="bg-white/5 p-5 rounded-3xl border border-white/5 group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h5 className="text-[12px] font-black text-white uppercase leading-none">{item.name}</h5>
                                    <p className="text-[10px] font-bold text-white/30 uppercase mt-2 tracking-widest">Rate: Rs. {item.price.toLocaleString()}</p>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="text-white/10 hover:text-red-400 group-hover:opacity-100 lg:opacity-0 transition-opacity">
                                    <X size={14} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-3 bg-white/5 rounded-xl p-1 px-2 border border-white/5">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="text-white/40 hover:text-white transition-colors">
                                        <Minus size={12} />
                                    </button>
                                    <span className="text-[11px] font-black text-white w-6 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="text-white/40 hover:text-white transition-colors">
                                        <Plus size={12} />
                                    </button>
                                </div>
                                <span className="text-[13px] font-black text-white font-mono">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {cart.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-white/20 py-20 gap-4">
                        <Receipt size={48} />
                        <div className="text-center">
                            <p className="text-[11px] font-black uppercase tracking-widest">Awaiting Selection</p>
                            <p className="text-[10px] font-bold mt-1 opacity-50">Transcribe services from the grid</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-8 bg-black/40 border-t border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Grand Valuation</span>
                    <span className="text-3xl font-black text-white tracking-tighter">Rs. {totalAmount.toLocaleString()}</span>
                </div>
                
                <Button 
                    disabled={submitting || cart.length === 0}
                    onClick={handlePlaceOrder}
                    className={`w-full h-16 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all
                        ${isWalkIn ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'}`}
                >
                    {submitting ? (
                        <div className="flex items-center gap-3">
                            <Loader2 size={18} className="animate-spin" />
                            <span>Synchronizing...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <CreditCard size={18} />
                            <span>{isWalkIn ? "Direct Settlement" : "Post to Folio"}</span>
                        </div>
                    )}
                </Button>
                
                <p className="text-[9px] font-bold text-white/20 text-center uppercase tracking-widest">Financial ledger will be updated immediately upon confirmation</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePOSPage;
