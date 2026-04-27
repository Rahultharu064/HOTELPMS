import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import {
  Search, LogIn, LogOut,
  Clock, ChevronRight,
  BedDouble, CreditCard,
  Printer, ShieldCheck,
  Zap, Bell, Plus, Loader2
} from "lucide-react";
import { frontOfficeService } from "../../services/frontofficeService";
import { toast } from "react-hot-toast";
import { CreateOfflineReservationModal } from "../../components/Admin/Dashboard/CreateOfflineReservationModal";
import { QuickCheckInModal } from "../../components/FrontOffice/QuickCheckInModal";
import { OrderExtraServiceModal } from "../../components/frontoffice/OrderExtraServiceModal";
import { QuickCheckOutModal } from "../../components/frontoffice/QuickCheckOutModal";

const CheckInOutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"checkin" | "checkout">("checkin");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isOrderServiceModalOpen, setIsOrderServiceModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (searchQuery) {
        const res = await frontOfficeService.searchUnified(searchQuery);
        if (res.success) {
          if (activeTab === "checkin") {
            setData(res.data.bookings.filter((b: any) => b.status === 'confirmed' || b.status === 'pending'));
          } else {
            setData(res.data.bookings.filter((b: any) => b.status === 'checked_in'));
          }
        }
      } else {
        const res = activeTab === "checkin"
          ? await frontOfficeService.getTodayArrivals()
          : await frontOfficeService.getTodayDepartures();

        if (res.success) {
          setData(res.data);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [activeTab, searchQuery]);

  const handleOpenCheckIn = (booking: any) => {
    setSelectedBooking(booking);
    setIsCheckInModalOpen(true);
  };

  const handleOpenOrderService = (booking: any) => {
    setSelectedBooking(booking);
    setIsOrderServiceModalOpen(true);
  };

  const handleOpenCheckOut = (booking: any) => {
    setSelectedBooking(booking);
    setIsCheckOutModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <div className="w-1.5 h-6 bg-[#14532D] rounded-full" />
             <h1 className="text-2xl font-black text-[#111827] tracking-tight">Movement Control</h1>
          </div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] ml-4">Terminal Operations • Guest Logistics</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOfflineModalOpen(true)}
            className="h-10 px-5 bg-[#14532D] text-white rounded-xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest hover:bg-[#111827] transition-all shadow-md shadow-[#14532D]/10"
          >
            <Plus size={14} strokeWidth={3} /> Walk-in Registry
          </button>
          <div className="bg-gray-100/50 p-1 rounded-xl flex items-center border border-gray-100">
            <button
              onClick={() => setActiveTab("checkin")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === "checkin" ? "bg-white text-[#14532D] shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
            >
              <LogIn size={12} strokeWidth={3} /> Arrival
            </button>
            <button
              onClick={() => setActiveTab("checkout")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === "checkout" ? "bg-white text-rose-500 shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
            >
              <LogOut size={12} strokeWidth={3} /> Departure
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#14532D] transition-colors" strokeWidth={2.5} />
            <input
              placeholder={`Search guest, room or reservation node...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-6 bg-gray-50/50 border-none rounded-xl text-[12px] font-bold placeholder-gray-300 focus:ring-2 focus:ring-[#14532D]/5 transition-all outline-none"
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                 <div className={`w-1.5 h-4 rounded-full ${activeTab === "checkin" ? "bg-[#14532D]" : "bg-rose-500"}`} />
                 <h2 className="text-[13px] font-black text-[#111827] uppercase tracking-widest">
                   {activeTab === "checkin" ? "Live Arrivals Feed" : "Live Departures Feed"}
                 </h2>
              </div>
              <span className="text-[8px] font-black tracking-[0.2em] text-gray-300 uppercase">
                {loading ? <Loader2 size={12} className="animate-spin" /> : `${data.length} Nodes Registered`}
              </span>
            </div>

            {data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {data.map((booking, i) => (
                  <div key={i} className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-[#14532D]/20 hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${activeTab === 'checkin' ? 'bg-[#14532D]' : 'bg-rose-500'} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    
                    <div className="flex items-center justify-between mb-6">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#111827] text-white flex items-center justify-center text-[10px] font-black uppercase tracking-widest shadow-md">
                            {booking.guest?.firstName?.[0] || '?'}{booking.guest?.lastName?.[0] || ''}
                          </div>
                          <div>
                            <h3 className="text-[14px] font-black text-[#111827] leading-tight group-hover:text-[#14532D] transition-colors">
                              {booking.guest?.firstName} {booking.guest?.lastName}
                            </h3>
                            <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">NET ID #{booking.bookingNumber}</p>
                          </div>
                       </div>
                       <div className={`px-2 py-1 rounded-lg text-[7px] font-black uppercase tracking-widest ${activeTab === 'checkin' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {booking.status?.replace('_', ' ') || 'Awaiting'}
                       </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100/50">
                        <div className="flex items-center gap-2.5">
                          <BedDouble size={16} className="text-[#F59E0B]" strokeWidth={2.5} />
                          <p className="text-[12px] font-black text-[#111827]">Unit {booking.room?.roomNumber}</p>
                        </div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">{booking.room?.roomType?.name}</p>
                      </div>

                      <div className="flex items-center gap-2 px-1 text-gray-300">
                        <Clock size={12} strokeWidth={2.5} />
                        <p className="text-[8px] font-bold uppercase tracking-widest">
                          {activeTab === 'checkin' ? 'Arrival Cycle: ' : 'Departure Cycle: '}
                          {new Date(activeTab === 'checkin' ? booking.checkIn : booking.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {activeTab === 'checkout' && (
                        <button
                          disabled={processingId === booking.id}
                          onClick={(e) => { e.stopPropagation(); handleOpenOrderService(booking); }}
                          className="flex-1 h-10 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border-none shadow-sm"
                        >
                          <Plus size={14} strokeWidth={3} /> Concierge
                        </button>
                      )}
                      <button
                        disabled={processingId === booking.id || (activeTab === 'checkin' && booking.status === 'checked_in') || (activeTab === 'checkout' && booking.status === 'checked_out')}
                        onClick={() => activeTab === 'checkin' ? handleOpenCheckIn(booking) : handleOpenCheckOut(booking)}
                        className={`flex-1 h-10 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 bg-[#111827] text-white hover:bg-[#14532D] shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {processingId === booking.id ? (
                          <Loader2 className="animate-spin" size={14} />
                        ) : activeTab === 'checkin' ? (
                          <><ShieldCheck size={14} strokeWidth={3} /> {booking.status === 'checked_in' ? 'Verified' : 'Check-in'}</>
                        ) : (
                          <><CreditCard size={14} strokeWidth={3} /> {booking.status === 'checked_out' ? 'Settled' : 'Settle'}</>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-300">No active nodes detected for this cycle</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#111827] rounded-3xl p-8 text-white relative overflow-hidden group min-h-[350px] flex flex-col justify-between shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/10 rounded-full blur-[60px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
            <div>
              <Zap className="text-[#F59E0B] mb-6" size={32} />
              <h2 className="text-xl font-black mb-2 leading-tight uppercase tracking-tight">Front Desk<br /><span className="text-white/30">Protocol Tools</span></h2>
              <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest leading-relaxed">High-priority terminal shortcuts.</p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Search Registry", icon: Search },
                { label: "Alert Feed", icon: Bell },
                { label: "Access Control", icon: Printer },
                { label: "Manual Billing", icon: Plus },
              ].map((tool, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#14532D]/30 transition-all group/btn text-left">
                  <div className="flex items-center gap-3">
                    <tool.icon size={16} className="text-[#F59E0B]" strokeWidth={2.5} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{tool.label}</span>
                  </div>
                  <ChevronRight size={12} className="text-white/10 group-hover/btn:translate-x-1 group-hover/btn:text-white transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CreateOfflineReservationModal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
        onSuccess={() => {
          setIsOfflineModalOpen(false);
          fetchData();
        }}
      />

      <QuickCheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        booking={selectedBooking}
        onSuccess={() => {
          setIsCheckInModalOpen(false);
          setActiveTab("checkout");
        }}
      />

      <OrderExtraServiceModal
        isOpen={isOrderServiceModalOpen}
        onClose={() => setIsOrderServiceModalOpen(false)}
        booking={selectedBooking}
        onSuccess={() => {
          setIsOrderServiceModalOpen(false);
          fetchData();
        }}
      />

      <QuickCheckOutModal
        isOpen={isCheckOutModalOpen}
        onClose={() => setIsCheckOutModalOpen(false)}
        booking={selectedBooking}
        onSuccess={() => {
          setIsCheckOutModalOpen(false);
          fetchData();
        }}
      />
    </div>
  );
};

export default CheckInOutPage;