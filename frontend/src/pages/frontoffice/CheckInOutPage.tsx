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
import { QuickCheckInModal } from "../../components/frontoffice/QuickCheckInModal";
import { OrderExtraServiceModal } from "../../components/frontoffice/OrderExtraServiceModal";

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

  const handleCheckOut = async (bookingId: number) => {
    try {
      setProcessingId(bookingId);
      const res = await frontOfficeService.checkOut(bookingId);
      if (res.success) {
        toast.success("Guest successfully checked out. Room set to cleaning.");
        fetchData(); 
      }
    } catch (error: any) {
      toast.error(error.message || "Check-out operation failed");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-10 pt-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight">Check-in / Check-out</h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Manage guest movement and bill settlements</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsOfflineModalOpen(true)}
            className="h-12 px-6 bg-gradient-to-br from-[#1F7A3A] to-[#2e9a50] border border-gray-200 text-[#111827] rounded-2xl flex items-center gap-2 text-[11px] font-black uppercase tracking-widest hover:bg-[#F59E0B] hover:text-white hover:border-[#F59E0B] transition-all shadow-sm"
          >
            <Plus size={16} strokeWidth={3} /> Walk-in Registry
          </Button>
          <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center shadow-inner">
            <button
              onClick={() => setActiveTab("checkin")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === "checkin" ? "bg-white text-[#1F7A3A] shadow-md translate-x-0" : "text-gray-400 hover:text-gray-600"
                }`}
            >
              <LogIn size={14} strokeWidth={3} /> Check-in
            </button>
            <button
              onClick={() => setActiveTab("checkout")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === "checkout" ? "bg-white text-red-500 shadow-md translate-x-0" : "text-gray-400 hover:text-gray-600"
                }`}
            >
              <LogOut size={14} strokeWidth={3} /> Check-out
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2.5} />
              <input
                placeholder={`Search for guest name, room number or reservation ID...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-14 pr-6 bg-gray-50/50 border border-transparent rounded-[24px] text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#1F7A3A]/5 focus:border-[#1F7A3A]/20 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-xl font-black text-[#111827] tracking-tight flex items-center gap-3">
                <div className={`w-1.5 h-6 rounded-full ${activeTab === "checkin" ? "bg-[#1F7A3A]" : "bg-red-500"}`} />
                {activeTab === "checkin" ? "Guest Arrivals Today" : "Guest Departures Today"}
              </h2>
              <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                {loading ? <Loader2 size={16} className="animate-spin" /> : `${data.length} Entries Found`}
              </span>
            </div>

            {data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.map((booking, i) => (
                  <div key={i} className="group bg-white p-8 rounded-[40px] border border-gray-100 hover:border-[#F59E0B]/30 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 relative flex flex-col justify-between overflow-hidden cursor-pointer">
                    <div className="absolute top-8 right-8 w-2 h-2 rounded-full bg-green-500 animate-pulse" />

                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-[#14532D] text-white flex items-center justify-center text-[12px] font-black uppercase tracking-widest shadow-xl shadow-black/10 group-hover:scale-110 transition-transform">
                        {booking.guest?.firstName?.[0] || '?'}{booking.guest?.lastName?.[0] || ''}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-[#111827] leading-none mb-1 group-hover:text-[#1F7A3A] transition-colors">
                          {booking.guest?.firstName} {booking.guest?.lastName}
                        </h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ORDER #{booking.bookingNumber}</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-10">
                      <div className="flex items-center justify-between p-4 rounded-3xl bg-gray-50/50 border border-gray-100/50">
                        <div className="flex items-center gap-3">
                          <BedDouble size={20} className="text-[#F59E0B]" strokeWidth={2.5} />
                          <p className="text-base font-black text-[#111827]">Room {booking.room?.roomNumber}</p>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#1F7A3A]">{booking.room?.roomType?.name}</p>
                      </div>

                      <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock size={16} strokeWidth={2.5} />
                          <p className="text-[10px] font-bold uppercase tracking-widest">
                            {activeTab === 'checkin' ? 'Arrival: ' : 'Departure: '}
                            {new Date(activeTab === 'checkin' ? booking.checkIn : booking.checkOut).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${activeTab === 'checkin' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {booking.status?.replace('_', ' ') || 'Unknown'}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {activeTab === 'checkout' && (
                        <Button
                          disabled={processingId === booking.id}
                          onClick={(e) => { e.stopPropagation(); handleOpenOrderService(booking); }}
                          className="flex-1 py-4 text-[11px] font-black uppercase tracking-widest rounded-[24px] shadow-lg transition-all flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border-none"
                        >
                          <Plus size={16} strokeWidth={3} />
                          Order Service
                        </Button>
                      )}
                      <Button
                        disabled={processingId === booking.id || (activeTab === 'checkin' && booking.status === 'checked_in') || (activeTab === 'checkout' && booking.status === 'checked_out')}
                        onClick={() => activeTab === 'checkin' ? handleOpenCheckIn(booking) : handleCheckOut(booking.id)}
                        className="flex-1 py-4 text-[11px] font-black uppercase tracking-widest rounded-[24px] shadow-lg transition-all flex items-center justify-center gap-2 bg-[#111827] text-white hover:bg-[#F59E0B] hover:text-white shadow-[#F59E0B]/20 border-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingId === booking.id ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : activeTab === 'checkin' ? (
                          <>
                            <ShieldCheck size={16} strokeWidth={3} />
                            {booking.status === 'checked_in' ? 'Checked In' : 'Complete Check-in'}
                          </>
                        ) : (
                          <>
                            <CreditCard size={16} strokeWidth={3} />
                            {booking.status === 'checked_out' ? 'Checked Out' : 'Settle & Check-out'}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No matching activities for today</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-[#111827] rounded-[56px] p-10 text-white relative overflow-hidden group min-h-[400px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#F59E0B]/10 rounded-full blur-[80px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
            <div>
              <Zap className="text-[#F59E0B] mb-8" size={40} />
              <h2 className="text-3xl font-black mb-4 leading-tight">Front Desk<br /><span className="text-white/40">Quick Tools</span></h2>
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest leading-relaxed">Essential shortcuts for the front desk staff.</p>
            </div>
            <div className="space-y-4">
              {[
                { label: "Find Booking", icon: Search },
                { label: "Guest Messages", icon: Bell },
                { label: "Print Key Cards", icon: Printer },
                { label: "Post Service Charge", icon: Plus },
              ].map((tool, i) => (
                <button key={i} className="w-full flex items-center justify-between p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group/btn text-left">
                  <div className="flex items-center gap-4">
                    <tool.icon size={20} className="text-[#F59E0B]" strokeWidth={2.5} />
                    <span className="text-[12px] font-black uppercase tracking-widest">{tool.label}</span>
                  </div>
                  <ChevronRight size={14} className="text-white/20 group-hover/btn:translate-x-1 group-hover/btn:text-white transition-all" />
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
    </div>
  );
};

export default CheckInOutPage;
