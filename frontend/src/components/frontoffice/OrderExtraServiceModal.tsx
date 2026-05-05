import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';

import { Button } from '../ui/Button';
import { extraServiceManagement, type ExtraService, type BookingExtraService } from '../../services/extraServiceManagement';
import { toast } from 'react-hot-toast';
import { Loader2, Trash2, CreditCard, Wallet, Plus, Printer, Search, ShoppingCart, ShieldCheck } from 'lucide-react';
import { ThermalReceipt } from './ThermalReceipt';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onSuccess: () => void;
}

export const OrderExtraServiceModal: React.FC<Props> = ({
  isOpen, onClose, booking, onSuccess
}) => {
  const [services, setServices] = useState<ExtraService[]>([]);
  const [orderedServices, setOrderedServices] = useState<BookingExtraService[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'pay_later' | 'cash' | 'esewa' | 'khalti'>('pay_later');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRemoving, setIsRemoving] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handlePrint = () => {
    const printContent = document.getElementById('thermal-receipt-service');
    if (!printContent) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write('<html><head><title>Service Receipt</title>');
    printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    setTimeout(() => { printWindow.focus(); printWindow.print(); printWindow.close(); }, 1000);
  };

  useEffect(() => {
    if (isOpen && booking) {
      fetchInitialData();
      setPaymentMethod('pay_later');
    }
  }, [isOpen, booking]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [allServicesRes, bookingServicesRes] = await Promise.all([
        extraServiceManagement.getAll(),
        extraServiceManagement.getBookingServices(booking.id)
      ]);
      if (allServicesRes.success) setServices(allServicesRes.data || []);
      if (bookingServicesRes.success) setOrderedServices(bookingServicesRes.data || []);
    } catch (error: any) {
      toast.error('Failed to load services data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (serviceId: number) => {
    if (!booking) return;
    if (paymentMethod === 'esewa' || paymentMethod === 'khalti') {
      const confirmed = window.confirm(`Simulate online payment via ${paymentMethod.toUpperCase()}? (No real transaction)`);
      if (!confirmed) return;
    }
    try {
      setIsSubmitting(true);
      const res = await extraServiceManagement.addToBooking({
        bookingId: booking.id,
        extraServiceId: serviceId,
        quantity: 1,
        paymentMethod: paymentMethod
      });
      if (res.success) {
        toast.success('Service ordered');
        fetchInitialData();
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to order service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (id: number) => {
    if (!window.confirm('Remove this service?')) return;
    try {
      setIsRemoving(id);
      const res = await extraServiceManagement.removeFromBooking(id);
      if (res.success) {
        toast.success('Service removed');
        fetchInitialData();
        onSuccess();
      }
    } catch (error: any) {
      toast.error('Failed to remove service');
    } finally {
      setIsRemoving(null);
    }
  };

  const totalAccountAmount = orderedServices.reduce((sum, s) => sum + Number(s.totalPrice), 0);

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Concierge Terminal" size="xl">
        <div className="flex flex-col items-center justify-center py-24 gap-6 bg-[#F9FAFB]">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-[#14532D] animate-spin" />
            <ShoppingCart size={20} className="absolute inset-0 m-auto text-[#14532D]/30" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#111827]">Syncing Catalog</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Fetching premium service data…</p>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Guest Concierge Desk" size="xl">
      {/* Step Progress / Header */}
      <div className="flex items-center gap-0 border-b border-gray-100 bg-white px-8 py-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#14532D] text-white flex items-center justify-center text-[9px] font-black shadow-md shadow-[#14532D]/20">
            <ShoppingCart size={13} strokeWidth={3} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-[#14532D]">Service Marketplace</span>
        </div>
        <div className="ml-auto flex items-center gap-2 bg-[#14532D]/5 border border-[#14532D]/10 rounded-xl px-3 py-1.5">
          <ShieldCheck size={11} className="text-[#14532D]" />
          <span className="text-[8px] font-black uppercase tracking-widest text-[#14532D]">Secure Node</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden flex-1">
        
        {/* LEFT: Catalog (7 cols) */}
        <div className="lg:col-span-7 overflow-y-auto custom-scrollbar border-r border-gray-100 bg-white">
          <div className="pl-6 pr-5 pt-5 pb-5 space-y-5">
            
            {/* Search & Mode */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#14532D] transition-colors" strokeWidth={2.5} />
                <input
                  placeholder="Search premium services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 bg-gray-50 border-none rounded-xl text-[12px] font-bold placeholder-gray-300 focus:ring-2 focus:ring-[#14532D]/10 transition-all outline-none"
                />
              </div>
              <div className="flex items-center gap-2 px-3 h-11 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[#14532D] shadow-sm">
                  <Select 
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="opacity-0 absolute w-full h-full cursor-pointer"
                  >
                    <option value="pay_later">Folio</option>
                    <option value="cash">Cash</option>
                    <option value="esewa">eSewa</option>
                  </Select>
                  <CreditCard size={14} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Mode: {paymentMethod === 'pay_later' ? 'Folio' : paymentMethod.toUpperCase()}</span>
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((service) => (
                <div key={service.id} className="group bg-white rounded-xl border border-gray-100 p-4 hover:border-[#14532D]/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gray-50 rounded-full -mr-8 -mt-8 group-hover:bg-[#14532D]/5 transition-all" />
                  <div className="relative z-10 flex flex-col h-full gap-4">
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#14532D] group-hover:text-white transition-all shadow-sm">
                        <Plus size={16} strokeWidth={3} />
                      </div>
                      <span className="text-[14px] font-black text-[#111827] tracking-tight">Rs. {Number(service.price).toFixed(2)}</span>
                    </div>
                    <div>
                      <h5 className="text-[12px] font-black text-[#111827] leading-tight">{service.name}</h5>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Concierge Service</p>
                    </div>
                    <button
                      onClick={() => handleAddService(service.id)}
                      disabled={isSubmitting}
                      className="w-full h-9 bg-[#111827] text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#14532D] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <><ShoppingCart size={13} /> Order Now</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Active Orders (5 cols) */}
        <div className="lg:col-span-5 overflow-y-auto custom-scrollbar bg-[#F9FAFB]/60">
          <div className="pl-5 pr-5 pt-5 pb-5 flex flex-col gap-5 h-full">
            
            {/* Account Card */}
            <div className="bg-[#111827] rounded-xl p-5 text-white relative overflow-hidden shadow-xl shadow-black/20">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#14532D]/20 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-[0.35em] text-white/40">Active Folio Balance</span>
                  </div>
                  <Button onClick={handlePrint} className="w-9 h-9 bg-white/10 hover:bg-[#14532D] text-white rounded-lg flex items-center justify-center transition-all">
                    <Printer size={16} />
                  </Button>
                </div>
                <div className="flex items-baseline gap-1.5 mb-6">
                  <span className="text-[10px] font-black text-white/30 uppercase">Rs.</span>
                  <span className="text-3xl font-black tracking-tighter leading-none">{totalAccountAmount.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Room No.</p>
                    <p className="text-[11px] font-black">{booking?.room?.roomNumber || '---'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Transactions</p>
                    <p className="text-[11px] font-black">{orderedServices.length} Logs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Logs */}
            <div className="space-y-3 flex-1 min-h-0">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">Order History</p>
                <div className="flex items-center gap-1.5 bg-white rounded-lg px-2 py-0.5 border border-gray-100">
                  <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[7px] font-black uppercase tracking-widest text-gray-400">Live Feed</span>
                </div>
              </div>
              
              <div className="space-y-3 overflow-y-auto pr-1">
                {orderedServices.length > 0 ? (
                  orderedServices.map((item) => (
                    <div key={item.id} className="group bg-white p-3.5 rounded-xl border border-gray-100 hover:border-[#14532D]/10 transition-all flex items-center justify-between relative overflow-hidden shadow-sm">
                      <div className="absolute left-0 top-0 h-full w-0.5 bg-transparent group-hover:bg-[#14532D] transition-all" />
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#14532D] transition-colors">
                          <Wallet size={14} />
                        </div>
                        <div>
                          <h5 className="text-[11px] font-black text-[#111827]">{item.extraService.name}</h5>
                          <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">Rs. {Number(item.unitPrice).toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[12px] font-black text-[#111827]">Rs. {Number(item.totalPrice).toFixed(2)}</span>
                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={isRemoving === item.id}
                          className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                          {isRemoving === item.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 opacity-30 grayscale gap-3">
                    <ShoppingCart size={24} />
                    <p className="text-[8px] font-black uppercase tracking-widest text-center">Protocol Idle<br />No logs detected</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Action */}
            <div className="mt-auto pt-4 border-t border-gray-100 space-y-4">
              <button
                onClick={onClose}
                className="w-full h-11 bg-white hover:bg-[#111827] text-gray-400 hover:text-white rounded-xl font-black uppercase tracking-[0.35em] text-[10px] border border-gray-100 hover:border-[#111827] transition-all shadow-sm active:scale-95"
              >
                Close Terminal
              </button>
              <div className="flex items-center justify-center gap-2">
                <div className="h-[1px] w-6 bg-gray-100" />
                <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em]">Protocol L3 · Concierge Node</p>
                <div className="h-[1px] w-6 bg-gray-100" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Printing Layer */}
      <div className="hidden">
        <div id="thermal-receipt-service">
            <ThermalReceipt 
                folio={{
                    bookingNumber: booking?.bookingNumber || 'N/A',
                    guestName: `${booking?.guest?.firstName} ${booking?.guest?.lastName}`,
                    roomNumber: booking?.room?.roomNumber || 'N/A',
                    roomType: booking?.room?.roomType?.name || 'N/A',
                    checkIn: booking?.checkIn,
                    checkOut: booking?.checkOut,
                    stayCharges: 0,
                    extraServices: orderedServices,
                    posServiceOrders: [],
                    totalCharges: totalAccountAmount,
                    totalPayments: orderedServices.reduce((sum, s) => sum + Number(s.totalPrice), 0),
                    balance: 0
                }} 
            />
        </div>
      </div>
    </Modal>
  );
};
