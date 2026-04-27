import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { frontOfficeService } from '../../services/frontofficeService';
import { toast } from 'react-hot-toast';
import { Loader2, CreditCard, Receipt, Wallet, CheckCircle2, AlertCircle, Printer, LogOut } from 'lucide-react';
import { ThermalReceipt } from './ThermalReceipt';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onSuccess: () => void;
}

export const QuickCheckOutModal: React.FC<Props> = ({
  isOpen, onClose, booking, onSuccess
}) => {
  const [folio, setFolio] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'esewa' | 'khalti'>('cash');

  const handlePrint = () => {
    const printContent = document.getElementById('thermal-receipt');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write('<html><head><title>Receipt</title>');
    // Add tailwind for layout in print window
    printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    
    printWindow.document.close();
    
    // Wait for tailwind to load (simple timeout for mock environment)
    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }, 1000);
  };

  useEffect(() => {
    if (isOpen && booking) {
      fetchFolio();
    }
  }, [isOpen, booking]);

  const fetchFolio = async () => {
    try {
      setLoading(true);
      const res = await frontOfficeService.getFolio(booking.id);
      if (res.success) {
        setFolio(res.data);
      }
    } catch (error: any) {
      toast.error('Failed to load billing information');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    // Simulate online payment check as requested
    if (!folio.isSettled && (paymentMethod === 'esewa' || paymentMethod === 'khalti')) {
      const confirmed = window.confirm(`Simulate online payment settlement via ${paymentMethod.toUpperCase()}? (No real transaction will occur)`);
      if (!confirmed) return;
    }

    try {
      setIsSettling(true);
      const res = await frontOfficeService.checkOut(booking.id, folio.isSettled ? undefined : paymentMethod);
      if (res.success) {
        toast.success('Guest successfully checked out');
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || 'Check-out failed');
    } finally {
      setIsSettling(false);
    }
  };

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Finalizing Bill...">
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 size={40} className="animate-spin text-[#F59E0B] mb-4" />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Calculating Folio Balances...</p>
        </div>
      </Modal>
    );
  }

  if (!folio) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Settlement & Check-out"
      size="lg"
    >
      <div className="flex flex-col lg:grid lg:grid-cols-5 min-h-[600px]">
        {/* Left Section: Folio Breakdown (3/5 width) */}
        <div className="lg:col-span-3 bg-gray-50/30 border-r border-gray-100 flex flex-col">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1F7A3A]/10 flex items-center justify-center text-[#1F7A3A]">
                <Receipt size={20} strokeWidth={3} />
              </div>
              <h3 className="text-[12px] font-black uppercase tracking-widest text-[#111827]">Folio Breakdown</h3>
            </div>
            <button 
              onClick={handlePrint}
              className="px-5 py-2.5 bg-[#111827] text-white hover:bg-[#1F7A3A] rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-[#111827]/10"
            >
              <Printer size={14} /> Print Receipt
            </button>
          </div>
          
          <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
            {/* Accommodation */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Accommodation</h4>
              <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex justify-between items-center">
                <div>
                  <p className="text-[13px] font-black text-[#111827]">{folio.roomNumber} • {folio.roomType}</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1">
                    {new Date(folio.checkIn).toLocaleDateString()} - {new Date(folio.checkOut).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-[15px] font-black text-[#111827]">Rs. {Number(folio.stayCharges).toFixed(2)}</span>
              </div>
            </div>

            {/* Extra Services */}
            {folio.extraServices.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Extra Services</h4>
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
                  {folio.extraServices.map((item: any) => (
                    <div key={item.id} className="p-4 flex justify-between items-center">
                      <div className="text-[11px] font-bold text-gray-600">
                        {item.extraService.name} <span className="text-gray-400 mx-1">×</span> {item.quantity}
                      </div>
                      <span className="text-[12px] font-black text-gray-800">Rs. {Number(item.totalPrice).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* POS Orders */}
            {folio.posServiceOrders.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">POS & Room Service</h4>
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
                  {folio.posServiceOrders.map((order: any) => (
                    <div key={order.id} className="p-4 flex justify-between items-center">
                      <div className="text-[11px] font-bold text-gray-600">Order #{order.orderNumber}</div>
                      <span className="text-[12px] font-black text-gray-800">Rs. {Number(order.totalAmount).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sums */}
          <div className="p-8 bg-white border-t border-gray-100 space-y-4">
            <div className="flex justify-between items-center text-gray-400">
              <span className="text-[10px] font-black uppercase tracking-widest">Gross Total</span>
              <span className="text-[14px] font-black">Rs. {Number(folio.totalCharges).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-green-600">
              <span className="text-[10px] font-black uppercase tracking-widest">Total Paid</span>
              <span className="text-[14px] font-black">-Rs. {Number(folio.totalPayments).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Section: Settlement Panel (2/5 width) */}
        <div className="lg:col-span-2 p-8 flex flex-col bg-white">
          <div className="mb-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Account Summary</h4>
            <div className="p-8 bg-[#111827] rounded-[32px] text-white relative overflow-hidden shadow-2xl shadow-[#111827]/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">Final Balance Due</span>
                <span className="text-4xl font-black block">Rs. {Number(folio.balance).toFixed(2)}</span>
            </div>
          </div>

          {!folio.isSettled ? (
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Payment Method</label>
                <div className="space-y-3">
                    {[
                      { id: 'cash', label: 'Cash Payment', icon: Wallet },
                      { id: 'esewa', label: 'eSewa Digital', icon: CreditCard },
                      { id: 'khalti', label: 'Khalti Wallet', icon: CreditCard },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`w-full flex items-center justify-between p-5 rounded-[20px] border-2 transition-all ${
                          paymentMethod === method.id 
                            ? 'bg-white border-[#111827] shadow-xl shadow-[#111827]/5 translate-x-1' 
                            : 'bg-gray-50 border-transparent hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === method.id ? 'bg-[#111827] text-white' : 'bg-white text-gray-400'}`}>
                            <method.icon size={20} />
                          </div>
                          <span className={`text-[12px] font-black uppercase tracking-widest ${paymentMethod === method.id ? 'text-[#111827]' : 'text-gray-400'}`}>
                            {method.label}
                          </span>
                        </div>
                        {paymentMethod === method.id && <CheckCircle2 size={18} className="text-[#1F7A3A]" strokeWidth={3} />}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-green-50 rounded-[32px] border border-green-100">
                <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-green-500/20">
                    <CheckCircle2 size={32} strokeWidth={3} />
                </div>
                <h5 className="text-[14px] font-black text-green-900 uppercase tracking-widest mb-2">Account Ready</h5>
                <p className="text-[10px] font-bold text-green-700/60 uppercase tracking-widest leading-loose">
                    All balances have been cleared.<br/>You may proceed to check-out.
                </p>
            </div>
          )}

          <div className="mt-8">
            <Button
              onClick={handleCheckOut}
              disabled={isSettling}
              className={`w-full h-16 rounded-[24px] font-black uppercase tracking-widest text-[12px] shadow-2xl transition-all flex items-center justify-center gap-3 border-none ${
                folio.isSettled 
                  ? 'bg-[#111827] text-white hover:bg-[#1F7A3A] shadow-[#111827]/20' 
                  : 'bg-[#F59E0B] text-white hover:bg-[#111827] shadow-[#F59E0B]/20'
              }`}
            >
              {isSettling ? (
                <Loader2 className="animate-spin" size={20} />
              ) : folio.isSettled ? (
                <>
                  <LogOut size={20} strokeWidth={3} />
                  Complete Check-out
                </>
              ) : (
                <>
                  <CreditCard size={20} strokeWidth={3} />
                  Settle & Check-out
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden">
        <ThermalReceipt folio={folio} />
      </div>
    </Modal>
  );
};
