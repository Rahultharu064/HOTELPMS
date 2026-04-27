import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { frontOfficeService } from '../../services/frontofficeService';
import { toast } from 'react-hot-toast';
import {
  Loader2, ShieldCheck, CheckCircle2,
  Calendar, Bed, Printer, Wallet, Zap, CreditCard,
  LogOut, ArrowRight, ShoppingCart, Utensils, ArrowUpRight
} from 'lucide-react';
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
    printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    setTimeout(() => { printWindow.focus(); printWindow.print(); printWindow.close(); }, 1000);
  };

  useEffect(() => {
    if (isOpen && booking) fetchFolio();
    if (!isOpen) setFolio(null);
  }, [isOpen, booking]);

  const fetchFolio = async () => {
    try {
      setLoading(true);
      const res = await frontOfficeService.getFolio(booking.id);
      if (res.success) setFolio(res.data);
    } catch {
      toast.error('Failed to load billing information');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!folio.isSettled && (paymentMethod === 'esewa' || paymentMethod === 'khalti')) {
      const confirmed = window.confirm(`Simulate ${paymentMethod.toUpperCase()} payment? (Demo only — no real transaction)`);
      if (!confirmed) return;
    }
    try {
      setIsSettling(true);
      const res = await frontOfficeService.checkOut(booking.id, folio.isSettled ? undefined : paymentMethod);
      if (res.success) { toast.success('Guest successfully checked out'); onSuccess(); }
    } catch (error: any) {
      toast.error(error.message || 'Check-out failed');
    } finally {
      setIsSettling(false);
    }
  };

  const guestInitials = folio?.guestName
    ? folio.guestName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'G';

  const paymentMethods = [
    { id: 'cash',   label: 'Cash',   sub: 'Direct settlement', icon: Wallet   },
    { id: 'esewa',  label: 'eSewa',  sub: 'Digital gateway',   icon: Zap      },
    { id: 'khalti', label: 'Khalti', sub: 'Wallet transfer',   icon: CreditCard },
  ] as const;

  /* ── Loading state ── */
  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Settlement Terminal" size="xl">
        <div className="flex flex-col items-center justify-center py-24 gap-6 bg-[#F9FAFB]">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-[#14532D] animate-spin" />
            <ShieldCheck size={20} className="absolute inset-0 m-auto text-[#14532D]/30" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#111827]">Syncing Folio</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Fetching real-time billing data…</p>
          </div>
        </div>
      </Modal>
    );
  }

  if (!folio) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Guest Settlement Terminal" size="xl">
      {/* ── Step Progress ── */}
      <div className="flex items-center gap-0 border-b border-gray-100 bg-white px-8 py-3 shrink-0">
        {[
          { num: '01', label: 'Bill Review',  done: true },
          { num: '02', label: 'Settlement',   done: folio.isSettled },
          { num: '03', label: 'Completion',   done: false },
        ].map((step, i) => (
          <React.Fragment key={step.num}>
            <div className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 transition-all
                ${step.done ? 'bg-[#14532D] text-white shadow-md shadow-[#14532D]/20' : 'bg-gray-100 text-gray-400'}`}>
                {step.done && i < 2 ? <CheckCircle2 size={13} strokeWidth={3} /> : step.num}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest whitespace-nowrap
                ${step.done ? 'text-[#14532D]' : 'text-gray-300'}`}>{step.label}</span>
            </div>
            {i < 2 && <ArrowRight size={12} className="mx-3 text-gray-200 shrink-0" />}
          </React.Fragment>
        ))}
        <div className="ml-auto flex items-center gap-2 bg-[#14532D]/5 border border-[#14532D]/10 rounded-xl px-3 py-1.5">
          <ShieldCheck size={11} className="text-[#14532D]" />
          <span className="text-[8px] font-black uppercase tracking-widest text-[#14532D]">Secure Terminal</span>
        </div>
      </div>

      {/* ── Two-Column Body ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden flex-1">

        {/* ──── LEFT: Folio Details (7 cols) ──── */}
        <div className="lg:col-span-7 overflow-y-auto custom-scrollbar border-r border-gray-100 bg-[#F9FAFB]/60">
          <div className="pl-6 pr-5 pt-5 pb-5 space-y-4">

            {/* Guest Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5 flex items-center gap-3.5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#14532D] rounded-r-full" />
              <div className="relative ml-1 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14532D] to-[#1F7A3A] flex items-center justify-center text-white shadow-md shadow-[#14532D]/20">
                  <span className="text-[12px] font-black tracking-tighter">{guestInitials}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-md border-2 border-white flex items-center justify-center">
                  <CheckCircle2 size={10} strokeWidth={3} className="text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#14532D] mb-0.5">Account Folio</p>
                <h2 className="text-[13px] font-black text-[#111827] tracking-tight truncate leading-tight">{folio.guestName}</h2>
                <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                  <span className="flex items-center gap-1 text-[8px] font-bold text-gray-400 uppercase tracking-wider">
                    <Bed size={9} className="text-[#14532D]" /> Room {folio.roomNumber} · {folio.roomType}
                  </span>
                  <span className="flex items-center gap-1 text-[8px] font-bold text-gray-400 uppercase tracking-wider">
                    <Calendar size={9} className="text-[#14532D]" /> {folio.checkInDate || 'N/A'} → {folio.checkOutDate || 'Today'}
                  </span>
                </div>
              </div>
              <button onClick={handlePrint}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-[#111827] text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-[#14532D] transition-colors duration-300 shadow-sm">
                <Printer size={11} /> Export
              </button>
            </div>

            {/* Accommodation Row */}
            <div>
              <SectionLabel color="bg-[#111827]" label="Accommodation" />
              <div className="mt-2 bg-white rounded-xl border border-gray-100 shadow-sm p-3.5 flex items-center justify-between group hover:border-[#14532D]/20 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-[#14532D] group-hover:text-white text-gray-400 transition-all duration-300">
                    <CreditCard size={15} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[12px] font-black text-[#111827] tracking-tight">{folio.roomType}</p>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Base stay charge · Verified</p>
                  </div>
                </div>
                <span className="text-[13px] font-black text-[#111827] tracking-tighter">Rs. {Number(folio.stayCharges).toFixed(2)}</span>
              </div>
            </div>

            {/* Extra Services */}
            {folio.extraServices?.length > 0 && (
              <div>
                <SectionLabel color="bg-blue-500" label="Additional Services" />
                <div className="mt-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                  {folio.extraServices.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between px-4 py-2.5 group hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <ShoppingCart size={13} strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-[#111827]">{item.extraService.name}</p>
                          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">{item.quantity} unit(s)</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-black text-[#111827]">Rs. {Number(item.totalPrice).toFixed(2)}</span>
                        <ArrowUpRight size={10} className="text-gray-300 ml-auto mt-0.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* POS / Incidentals */}
            {folio.posServiceOrders?.length > 0 && (
              <div>
                <SectionLabel color="bg-rose-500" label="Dining & Incidentals" />
                <div className="mt-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                  {folio.posServiceOrders.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between px-4 py-2.5 group hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Utensils size={13} strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-[#111827]">Order #{order.orderNumber}</p>
                          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">POS Transaction · Billed to Room</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-black text-[#111827]">Rs. {Number(order.totalAmount).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Totals Card */}
            <div className="bg-[#111827] rounded-xl p-4 text-white relative overflow-hidden shadow-lg shadow-black/20">
              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
              <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-3 mb-3">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30 block">Gross Total</span>
                  <span className="text-[14px] font-black tracking-tighter">Rs. {Number(folio.totalCharges).toFixed(2)}</span>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-400/50 block">Credits Applied</span>
                  <span className="text-[14px] font-black text-emerald-400 tracking-tighter">-Rs. {Number(folio.totalPayments).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#F59E0B] block">Net Balance Due</span>
                  <p className="text-[7px] font-bold text-white/20 uppercase tracking-wider mt-0.5">Settlement required for departure</p>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[9px] font-black text-[#F59E0B]/50 uppercase">Rs.</span>
                  <span className="text-2xl font-black text-[#F59E0B] tracking-tighter leading-none">{Number(folio.balance).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Audit Footer */}
            <div className="flex items-center justify-between pt-2 pb-1">
              <div>
                <p className="text-[9px] font-black text-[#111827] uppercase tracking-widest">Audit Reference</p>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">#{folio.id || 'N/A'} · System Generated</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-[#111827] uppercase tracking-widest">Terminal ID</p>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">POS-TRM-882-X</p>
              </div>
            </div>

          </div>
        </div>

        {/* ──── RIGHT: Settlement Panel (5 cols) ──── */}
        <div className="lg:col-span-5 overflow-y-auto custom-scrollbar bg-white">
          <div className="pl-5 pr-5 pt-5 pb-5 flex flex-col gap-4 h-full">

            {/* Balance Card */}
            <div className="bg-[#14532D] rounded-xl p-4 text-white relative overflow-hidden shadow-lg shadow-[#14532D]/30">
              <div className="absolute -top-6 -right-6 w-28 h-28 bg-[#F59E0B]/20 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[8px] font-black uppercase tracking-[0.35em] text-white/50">Net Collectible</span>
                  <div className="flex items-center gap-1 bg-white/10 rounded-md px-2 py-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[7px] font-black uppercase tracking-widest text-white/60">Live</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-[10px] font-black text-white/40 uppercase">Rs.</span>
                  <span className="text-3xl font-black tracking-tighter leading-none">{Number(folio.balance).toFixed(2)}</span>
                </div>
                {folio.isSettled ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-400/20 text-emerald-300 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-400/20">
                    <CheckCircle2 size={12} strokeWidth={3} /> Account Reconciled
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F59E0B]/20 text-[#F59E0B] rounded-xl text-[9px] font-black uppercase tracking-widest border border-[#F59E0B]/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" /> Awaiting Settlement
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Selector */}
            {!folio.isSettled ? (
              <div className="space-y-3">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">Payment Channel</p>
                {paymentMethods.map((m) => {
                  const active = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-300 relative overflow-hidden text-left
                        ${active
                          ? 'border-[#14532D] bg-white shadow-md shadow-[#14532D]/10 translate-x-1'
                          : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}
                    >
                      {active && <div className="absolute left-0 top-0 h-full w-0.5 bg-[#14532D] rounded-r-full" />}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0
                        ${active ? 'bg-[#14532D] text-white shadow-sm scale-105' : 'bg-white text-gray-300 shadow-sm'}`}>
                        <m.icon size={15} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[11px] font-black tracking-tight ${active ? 'text-[#111827]' : 'text-gray-400'}`}>{m.label}</p>
                        <p className="text-[8px] font-bold text-gray-300 uppercase tracking-wider">{m.sub}</p>
                      </div>
                      {active && (
                        <div className="w-5 h-5 rounded-full bg-[#14532D] text-white flex items-center justify-center shrink-0">
                          <CheckCircle2 size={11} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 size={32} strokeWidth={2.5} />
                </div>
                <h5 className="text-[14px] font-black text-emerald-800 uppercase tracking-widest mb-2">Reconciled</h5>
                <p className="text-[9px] font-bold text-emerald-600/70 uppercase tracking-wider max-w-[180px] leading-relaxed">
                  All payments verified. Ready for guest departure.
                </p>
              </div>
            )}

            {/* CTA Button */}
            <div className="mt-auto pt-4 border-t border-gray-100 space-y-3">
              <button
                onClick={handleCheckOut}
                disabled={isSettling}
                className={`w-full h-11 rounded-xl font-black uppercase tracking-[0.35em] text-[10px] flex items-center justify-center gap-2.5
                  shadow-lg transition-all duration-500 active:scale-95 relative overflow-hidden group
                  ${folio.isSettled
                    ? 'bg-emerald-600 text-white hover:bg-[#14532D] shadow-emerald-600/25'
                    : 'bg-[#111827] text-white hover:bg-[#14532D] shadow-black/25'}
                  disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 pointer-events-none" />
                {isSettling ? (
                  <Loader2 size={16} strokeWidth={3} className="animate-spin" />
                ) : folio.isSettled ? (
                  <><LogOut size={15} strokeWidth={3} className="relative z-10" /><span className="relative z-10">Authorize Departure</span></>
                ) : (
                  <><CreditCard size={15} strokeWidth={3} className="relative z-10" /><span className="relative z-10">Process Settlement</span></>
                )}
              </button>
              <div className="flex items-center justify-center gap-2">
                <div className="h-[1px] w-6 bg-gray-100" />
                <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em]">Protocol L3 · Encrypted</p>
                <div className="h-[1px] w-6 bg-gray-100" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Hidden thermal receipt for printing */}
      <div className="hidden">
        <ThermalReceipt folio={folio} />
      </div>
    </Modal>
  );
};

/* ── Small helper ── */
function SectionLabel({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-1 h-5 ${color} rounded-full`} />
      <span className="text-[9px] font-black uppercase tracking-[0.35em] text-gray-400">{label}</span>
    </div>
  );
}
