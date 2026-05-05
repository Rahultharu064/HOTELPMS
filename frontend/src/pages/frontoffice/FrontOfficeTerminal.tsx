import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  Search, LogIn, LogOut, 
  Clock, BedDouble, 
  Plus, Loader2,
  ArrowLeft,
  X
} from "lucide-react";
import { frontOfficeService } from "../../services/frontofficeService";
import { extraServiceManagement, type ExtraService } from "../../services/extraServiceManagement";
import { toast } from "react-hot-toast";
import { Button } from "../../components/ui/Button";

// Modular Components
import { FolioSummary } from "../../components/frontoffice/Terminal/FolioSummary";
import { BillBreakdown } from "../../components/frontoffice/Terminal/BillBreakdown";
import { ServiceCatalog } from "../../components/frontoffice/Terminal/ServiceCatalog";
import { SettlementTerminal } from "../../components/frontoffice/Terminal/SettlementTerminal";

const FrontOfficeTerminal: React.FC = () => {
  const { bookingId } = useParams<{ bookingId?: string }>();
  const [activeTab, setActiveTab] = useState<"checkin" | "checkout">("checkin");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [folio, setFolio] = useState<any>(null);
  const [loadingFolio, setLoadingFolio] = useState(false);
  const [services, setServices] = useState<ExtraService[]>([]);
  const [serviceSearch, setServiceSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'esewa' | 'khalti'>('cash');
  const [isSettling, setIsSettling] = useState(false);

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = activeTab === "checkin"
        ? await frontOfficeService.getTodayArrivals()
        : await frontOfficeService.getTodayDepartures();

      if (res.success) {
        setData(res.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch terminal data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch services for catalog
  const fetchServices = async () => {
    try {
      const res = await extraServiceManagement.getAll();
      if (res.success) setServices(res.data);
    } catch (error) {
      console.error("Failed to fetch services", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchServices();
  }, [activeTab]);

  // Handle deep-linked booking selection
  useEffect(() => {
    if (bookingId && data.length > 0) {
      const booking = data.find(b => b.id === parseInt(bookingId));
      if (booking) {
        setSelectedBooking(booking);
        if (booking.status === 'checked_in') setActiveTab('checkout');
        else setActiveTab('checkin');
      }
    }
  }, [bookingId, data]);

  // Load guest folio when a guest is selected
  useEffect(() => {
    if (selectedBooking) {
      loadFolio(selectedBooking.id);
    } else {
      setFolio(null);
    }
  }, [selectedBooking]);

  const loadFolio = async (id: number) => {
    try {
      setLoadingFolio(true);
      const res = await frontOfficeService.getFolio(id);
      if (res.success) setFolio(res.data);
    } catch (error: any) {
      toast.error("Failed to load guest folio");
    } finally {
      setLoadingFolio(false);
    }
  };

  const handleAddService = async (serviceId: number) => {
    if (!selectedBooking) return;
    try {
      const res = await extraServiceManagement.addToBooking({
        bookingId: selectedBooking.id,
        extraServiceId: serviceId,
        quantity: 1
      });
      if (res.success) {
        toast.success("Service added to folio");
        loadFolio(selectedBooking.id);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to order service");
    }
  };

  const handleSettlement = async () => {
    if (!selectedBooking || !folio) return;
    try {
      setIsSettling(true);
      const res = await frontOfficeService.checkOut(selectedBooking.id, paymentMethod);
      if (res.success) {
        toast.success("Settlement successful");
        loadFolio(selectedBooking.id);
        fetchData();
      }
    } catch (error: any) {
      toast.error(error.message || "Settlement failed");
    } finally {
      setIsSettling(false);
    }
  };

  // Standardized Integrated Terminal View
  if (selectedBooking) {
    return (
      <div className="max-w-6xl mx-auto animate-fade-in space-y-10">
        {/* Dashboard-Consistent Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setSelectedBooking(null)}
              className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#111827] hover:border-[#111827]/10 transition-all shadow-sm group active:scale-90"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-[#111827] tracking-tight leading-none">
                {selectedBooking.guest?.firstName} {selectedBooking.guest?.lastName}
              </h1>
              <p className="text-[10px] font-black text-[#1F7A3A] uppercase tracking-[0.2em] mt-2">
                Room {selectedBooking.room?.roomNumber} • Terminal Active
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-100/50">
                Verified Session
             </div>
             <button 
                onClick={() => setSelectedBooking(null)}
                className="w-12 h-12 rounded-2xl bg-[#111827] text-white flex items-center justify-center shadow-xl shadow-black/10 hover:bg-rose-500 transition-all"
             >
                <X size={20} />
             </button>
          </div>
        </header>

        {/* Dashboard-Style Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-2 pb-20">
            {/* Main Content Area (8/12) */}
            <div className="lg:col-span-8 space-y-10">
               {loadingFolio ? (
                 <div className="bg-white rounded-[40px] p-20 border border-gray-100 shadow-sm flex flex-col items-center justify-center space-y-6">
                    <Loader2 size={32} className="animate-spin text-[#1F7A3A]" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Syncing Records...</p>
                 </div>
               ) : folio ? (
                 <div className="space-y-10">
                    <FolioSummary folio={folio} onPrint={() => window.print()} />
                    <BillBreakdown folio={folio} />
                    <div className="pt-10 border-t border-gray-100">
                        <ServiceCatalog 
                            services={services} 
                            searchQuery={serviceSearch} 
                            onSearchChange={setServiceSearch} 
                            onAddService={handleAddService} 
                            isSubmitting={false}
                            paymentMethod="pay_later"
                            onPaymentMethodChange={() => {}}
                        />
                    </div>
                 </div>
               ) : (
                 <div className="bg-white rounded-[40px] p-20 border border-gray-100 shadow-sm flex items-center justify-center">
                    <p className="font-black uppercase tracking-[0.2em] text-gray-400">No Data Synchronized</p>
                 </div>
               )}
            </div>

            {/* Sticky Settlement Sidebar (4/12) */}
            <div className="lg:col-span-4">
                <div className="sticky top-8">
                    {folio && (
                        <SettlementTerminal 
                            folio={folio} 
                            paymentMethod={paymentMethod} 
                            onPaymentMethodChange={setPaymentMethod} 
                            onCheckOut={handleSettlement} 
                            isSettling={isSettling} 
                        />
                    )}
                </div>
            </div>
        </div>
      </div>
    );
  }

  // Dashboard Records Feed
  return (
    <div className="animate-fade-in space-y-10 max-w-7xl mx-auto px-4 lg:px-8">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-10 bg-[#111827] rounded-full" />
            <h1 className="text-4xl font-black text-[#111827] tracking-tight">Concierge Terminal</h1>
          </div>
          <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] ml-5">Guest Movement & Settlement control hub</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-3 rounded-[32px] shadow-sm border border-gray-100">
          <Button
            onClick={() => {}} 
            className="h-12 px-8 bg-[#111827] text-white rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#1F7A3A] transition-all shadow-lg"
          >
            <Plus size={16} strokeWidth={3} /> Register Walk-in
          </Button>
        </div>
      </div>

      {/* Unified Search & Filters */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-[28px]">
          <button
            onClick={() => setActiveTab("checkin")}
            className={`flex items-center gap-2 px-10 py-4 rounded-[22px] text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${activeTab === "checkin" ? "bg-[#111827] text-white shadow-xl" : "text-gray-400 hover:text-gray-600"}`}
          >
            <LogIn size={16} strokeWidth={3} /> Arrivals
          </button>
          <button
            onClick={() => setActiveTab("checkout")}
            className={`flex items-center gap-2 px-10 py-4 rounded-[22px] text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${activeTab === "checkout" ? "bg-[#111827] text-white shadow-xl" : "text-gray-400 hover:text-gray-600"}`}
          >
            <LogOut size={16} strokeWidth={3} /> In-House
          </button>
        </div>

        <div className="flex-1 w-full lg:max-w-xl relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#111827] transition-colors" size={20} strokeWidth={3} />
          <input
            type="text"
            placeholder="Search feed..."
            className="w-full bg-gray-50 border-none focus:bg-white rounded-[28px] py-4 pl-16 pr-8 text-[14px] font-bold text-[#111827] transition-all outline-none shadow-inner group-focus-within:shadow-none border border-transparent focus:border-gray-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-8 pb-20">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-xl font-black text-[#111827] tracking-tight uppercase flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${activeTab === 'checkin' ? 'bg-[#1F7A3A]' : 'bg-red-500'}`} />
            {activeTab === "checkin" ? "Today's Arrivals" : "Active Residents"}
          </h2>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {loading ? <Loader2 size={14} className="animate-spin" /> : `${data.length} Records Found`}
          </span>
        </div>

        {data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {data.filter(b => `${b.guest?.firstName} ${b.guest?.lastName} ${b.room?.roomNumber}`.toLowerCase().includes(searchQuery.toLowerCase())).map((booking, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedBooking(booking)}
                className="group bg-white p-10 rounded-[40px] border border-gray-100 hover:border-[#1F7A3A]/20 hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-[40px] pointer-events-none group-hover:bg-[#1F7A3A]/5 transition-colors duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-5 mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-[#111827] text-white flex items-center justify-center text-[14px] font-black shadow-lg shadow-black/10 group-hover:scale-110 transition-transform">
                      {booking.guest?.firstName?.[0]}{booking.guest?.lastName?.[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#111827] group-hover:text-[#1F7A3A] transition-colors leading-none mb-1.5">
                        {booking.guest?.firstName} {booking.guest?.lastName}
                      </h3>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">PNR: {booking.bookingNumber}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-10">
                    <div className="p-6 rounded-[28px] bg-gray-50 flex justify-between items-center group-hover:bg-white transition-all border border-transparent group-hover:border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#111827]">
                          <BedDouble size={20} />
                        </div>
                        <p className="text-[16px] font-black text-[#111827]">Room {booking.room?.roomNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Clock size={14} />
                          {new Date(activeTab === 'checkin' ? booking.checkIn : booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${activeTab === 'checkin' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                          {booking.status?.replace('_', ' ')}
                        </div>
                    </div>
                  </div>

                  <button className={`w-full h-16 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95 ${
                      activeTab === 'checkin' ? 'bg-[#1F7A3A] text-white shadow-[#1F7A3A]/20' : 'bg-[#111827] text-white shadow-black/20'
                  }`}>
                    {activeTab === 'checkin' ? <LogIn size={18} strokeWidth={3} /> : <LogOut size={18} strokeWidth={3} />}
                    {activeTab === 'checkin' ? 'Initiate Session' : 'Process Account'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center bg-white rounded-[56px] border border-dashed border-gray-200">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">All data synchronized with core</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FrontOfficeTerminal;
