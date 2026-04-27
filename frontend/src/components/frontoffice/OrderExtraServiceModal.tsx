import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { extraServiceManagement, type ExtraService, type BookingExtraService } from '../../services/extraServiceManagement';
import { toast } from 'react-hot-toast';
import { Loader2, Trash2, CreditCard, Wallet, Plus, Info, Printer, Search } from 'lucide-react';
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
  const [selectedServiceId, setSelectedServiceId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number>(1);
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
    
    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }, 1000);
  };

  useEffect(() => {
    if (isOpen && booking) {
      fetchInitialData();
      setSelectedServiceId('');
      setQuantity(1);
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

    // Simulate online payment check as requested
    if (paymentMethod === 'esewa' || paymentMethod === 'khalti') {
      const confirmed = window.confirm(`Simulate online payment via ${paymentMethod.toUpperCase()}? (No real transaction will occur)`);
      if (!confirmed) return;
    }

    try {
      setIsSubmitting(true);
      const res = await extraServiceManagement.addToBooking({
        bookingId: booking.id,
        extraServiceId: serviceId,
        quantity: 1, // Default to 1 for quick order, can be expanded later
        paymentMethod: paymentMethod
      });
      if (res.success) {
        toast.success('Service ordered successfully');
        fetchInitialData(); // Refresh list
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to order service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this service from the account?')) return;
    try {
      setIsRemoving(id);
      const res = await extraServiceManagement.removeFromBooking(id);
      if (res.success) {
        toast.success('Service removed successfully');
        fetchInitialData();
        onSuccess();
      }
    } catch (error: any) {
      toast.error('Failed to remove service');
    } finally {
      setIsRemoving(null);
    }
  };

  const selectedService = services.find(s => s.id === Number(selectedServiceId));
  const totalAccountAmount = orderedServices.reduce((sum, s) => sum + Number(s.totalPrice), 0);


  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Guest Service Management"
      size="lg"
    >
      <div className="flex flex-col lg:grid lg:grid-cols-5 min-h-[600px]">
        {/* Left Section: Service Selection (3/5) */}
        <div className="lg:col-span-3 p-8 border-r border-gray-100 flex flex-col bg-white">
          <div className="mb-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Available Services</h4>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#111827] transition-colors">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search services (e.g. Laundry, Spa...)"
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-[13px] font-bold text-[#111827] focus:ring-2 focus:ring-[#111827]/5 transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {services.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((service) => (
              <div 
                key={service.id} 
                className="group flex items-center justify-between p-5 rounded-[24px] bg-white border border-gray-100 hover:border-[#111827] hover:shadow-xl hover:shadow-[#111827]/5 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#111827] group-hover:text-white transition-all">
                    <Plus size={20} />
                  </div>
                  <div>
                    <h5 className="text-[13px] font-black text-[#111827]">{service.name}</h5>
                    <p className="text-[10px] font-bold text-[#1F7A3A] uppercase tracking-widest mt-0.5">Rs. {Number(service.price).toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Payment Method Selector for this item */}
                  <select 
                    className="bg-gray-50 border-none text-[10px] font-black uppercase tracking-widest rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#111827]/5"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                  >
                    <option value="pay_later">Pay Later</option>
                    <option value="cash">Cash Now</option>
                    <option value="esewa">eSewa</option>
                    <option value="khalti">Khalti</option>
                  </select>

                  <button
                    onClick={() => handleAddService(service.id)}
                    disabled={isSubmitting}
                    className="w-10 h-10 rounded-xl bg-[#111827] text-white flex items-center justify-center hover:bg-[#1F7A3A] transition-all disabled:opacity-50 shadow-lg shadow-[#111827]/20"
                  >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={18} strokeWidth={3} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section: Account Summary (2/5) */}
        <div className="lg:col-span-2 bg-gray-50/50 flex flex-col">
          <div className="p-8 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Account Summary</h4>
            
            <div className="bg-[#111827] p-8 rounded-[32px] text-white relative overflow-hidden shadow-2xl shadow-[#111827]/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-1">Folio Balance</span>
                        <span className="text-3xl font-black block">Rs. {totalAccountAmount.toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={handlePrint}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                        title="Print Account Receipt"
                    >
                        <Printer size={18} />
                    </button>
                </div>
                <div className="flex items-center gap-2 py-2 px-3 bg-white/5 rounded-xl border border-white/10">
                    <Info size={12} className="text-white/40" />
                    <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Charges added to guest folio</span>
                </div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order History</h4>
                {orderedServices.length > 0 ? (
                    orderedServices.map((item) => (
                        <div key={item.id} className="group bg-white p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                    <Wallet size={14} />
                                </div>
                                <div>
                                    <h5 className="text-[11px] font-black text-[#111827]">{item.extraService.name}</h5>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                        {item.quantity} × Rs. {Number(item.unitPrice).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[12px] font-black text-[#111827]">Rs. {Number(item.totalPrice).toFixed(2)}</span>
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    disabled={isRemoving === item.id}
                                    className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                >
                                    {isRemoving === item.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={14} />}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-10 text-center border-2 border-dashed border-gray-200 rounded-[24px]">
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">No orders yet</p>
                    </div>
                )}
            </div>
          </div>

          <div className="mt-auto p-8 bg-white border-t border-gray-100">
            <Button
                onClick={onClose}
                className="w-full h-14 bg-gray-50 hover:bg-[#111827] hover:text-white text-[#111827] border-none rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all"
            >
                Done / Close
            </Button>
          </div>
        </div>
      </div>

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
