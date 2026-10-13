import React, { useState, useEffect } from "react";
import {
  Search, LogIn, LogOut,
  Clock, Plus, Loader2,
  Calendar, CheckCircle, UserCheck
} from "lucide-react";
import { frontOfficeService } from "../../services/frontofficeService";
import { toast } from "react-hot-toast";
import { CreateOfflineReservationModal } from "../../components/Admin/Dashboard/CreateOfflineReservationModal";
import { QuickCheckInModal } from "../../components/frontoffice/QuickCheckInModal";
import { OrderExtraServiceModal } from "../../components/frontoffice/OrderExtraServiceModal";
import { QuickCheckOutModal } from "../../components/frontoffice/QuickCheckOutModal";

const CheckInOutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"checkin" | "checkout">("checkin");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
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
    }, 400);
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

  // Helper for status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge badge-confirmed">Confirmed</span>;
      case 'checked_in':
        return <span className="badge badge-checked-in">Checked In</span>;
      case 'checked_out':
        return <span className="badge badge-checked-out">Checked Out</span>;
      case 'pending':
        return <span className="badge badge-pending">Pending Payment</span>;
      case 'cancelled':
        return <span className="badge badge-cancelled">Cancelled</span>;
      default:
        return <span className="badge badge-confirmed">{status}</span>;
    }
  };

  // Left border color for cards
  const getCardStatusClass = (booking: any) => {
    if (activeTab === 'checkin') {
      const isOverdue = new Date(booking.checkIn) < new Date(new Date().setHours(0,0,0,0));
      if (isOverdue) return 'card-status-oor';
      if (booking.status === 'checked_in') return 'card-status-checked-in';
      return 'card-status-confirmed';
    } else {
      if (booking.balance && Number(booking.balance) > 0) return 'card-status-pending';
      return 'card-status-checked-in';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '24px', fontWeight: 700, color: 'var(--color-ink)' }}>
            Check-in / Check-out
          </h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--color-muted)', marginTop: '2px' }}>
            Manage today's guest arrivals and departures
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOfflineModalOpen(true)}
            className="btn-secondary"
            style={{ height: '40px' }}
          >
            <Plus size={16} />
            <span>New Walk-in</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Tab switchers */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab("checkin")}
            className={`chip ${activeTab === 'checkin' ? 'chip-active' : ''}`}
            style={{ height: '36px', padding: '0 16px' }}
          >
            <LogIn size={14} style={{ marginRight: '6px' }} />
            Today's Arrivals
          </button>
          <button
            onClick={() => setActiveTab("checkout")}
            className={`chip ${activeTab === 'checkout' ? 'chip-active' : ''}`}
            style={{ height: '36px', padding: '0 16px' }}
          >
            <LogOut size={14} style={{ marginRight: '6px' }} />
            Today's Departures
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-muted)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            placeholder="Search by guest name, booking ID, room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Main Content Feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)' }}>
            {activeTab === 'checkin' ? "Today's Expected Arrivals" : "Today's Scheduled Departures"}
          </h2>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-muted)' }}>
            {loading ? <Loader2 size={14} className="animate-spin inline mr-1" /> : `${data.length} guest${data.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: '180px', borderRadius: '12px' }}
              />
            ))}
          </div>
        ) : data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((booking) => (
              <div
                key={booking.id}
                className={`card-status ${getCardStatusClass(booking)} flex flex-col justify-between`}
                style={{ minHeight: '190px' }}
              >
                <div>
                  {/* Card top: Name + Status badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', fontWeight: 600, color: 'var(--color-ink)' }}>
                        {booking.guest?.firstName} {booking.guest?.lastName}
                      </h3>
                      <p className="text-booking-id" style={{ marginTop: '2px' }}>
                        #{booking.bookingNumber || booking.id}
                      </p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  {/* Room & Dates */}
                  <div
                    style={{
                      background: 'var(--color-surface)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      marginBottom: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-muted)' }}>Room</span>
                      <span className="text-room-number" style={{ fontSize: '14px', color: 'var(--color-ink)' }}>
                        {booking.room?.roomNumber ? `Room ${booking.room.roomNumber}` : 'Unassigned'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-muted)' }}>
                        {activeTab === 'checkin' ? 'Check-in' : 'Check-out'}
                      </span>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-ink)' }}>
                        {new Date(activeTab === 'checkin' ? booking.checkIn : booking.checkOut).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </span>
                    </div>
                    {booking.totalAmount && (
                      <div className="flex items-center justify-between">
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-muted)' }}>Total</span>
                        <span className="text-amount" style={{ color: 'var(--color-ink)' }}>
                          NPR {Number(booking.totalAmount).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Button — one primary per card */}
                <div className="flex gap-2 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  {activeTab === 'checkout' && (
                    <button
                      onClick={() => handleOpenOrderService(booking)}
                      className="btn-ghost"
                      style={{ flex: 1, height: '36px', fontSize: '13px' }}
                    >
                      Add Service
                    </button>
                  )}

                  {activeTab === 'checkin' ? (
                    booking.status === 'checked_in' ? (
                      <div
                        className="flex items-center justify-center gap-1 w-full"
                        style={{ height: '36px', fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-success)', fontWeight: 600 }}
                      >
                        <CheckCircle size={14} />
                        <span>Checked In</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenCheckIn(booking)}
                        className="btn-primary"
                        style={{ width: '100%', height: '36px', fontSize: '13px' }}
                      >
                        <UserCheck size={14} />
                        <span>Check In Guest</span>
                      </button>
                    )
                  ) : (
                    booking.status === 'checked_out' ? (
                      <div
                        className="flex items-center justify-center gap-1 w-full"
                        style={{ height: '36px', fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 600 }}
                      >
                        <CheckCircle size={14} />
                        <span>Checked Out</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenCheckOut(booking)}
                        className="btn-primary"
                        style={{ flex: 1, height: '36px', fontSize: '13px' }}
                      >
                        <span>Check Out Guest</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state: Icon + message + primary CTA */
          <div
            className="flex flex-col items-center justify-center text-center card"
            style={{ padding: '64px 24px', borderStyle: 'dashed' }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--color-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                color: 'var(--color-muted)',
              }}
            >
              <Calendar size={28} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '6px' }}>
              {activeTab === 'checkin' ? "No arrivals scheduled for today" : "No departures scheduled for today"}
            </h3>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--color-muted)', maxWidth: '360px', marginBottom: '20px' }}>
              {activeTab === 'checkin'
                ? "There are no incoming guests due today. You can create a walk-in booking directly."
                : "All guests due to depart have already checked out."}
            </p>
            {activeTab === 'checkin' && (
              <button
                onClick={() => setIsOfflineModalOpen(true)}
                className="btn-primary"
              >
                <Plus size={16} />
                <span>Create Walk-in Booking</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
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
          fetchData();
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
