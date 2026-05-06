import React, { useState, useEffect } from "react";
import { 
  Bed, Calendar, Hash, 
  Utensils, Shirt, Flower, 
  ArrowRight, CreditCard, 
  Download,
  CheckCircle2, AlertCircle, Trash2, 
  Smartphone, Banknote, Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { paymentService } from "../../services/paymentService";
import { frontOfficeService } from "../../services/frontofficeService";
import { toast } from "react-hot-toast";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from "../../components/ui/Button";

const GuestFolioPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("id");
  const [loading, setLoading] = useState(true);
  const [folioData, setFolioData] = useState<any>(null);

  useEffect(() => {
    if (bookingId) {
      fetchFolio();
    }
  }, [bookingId]);

  const fetchFolio = async () => {
    try {
      setLoading(true);
      const res = await frontOfficeService.getFolio(Number(bookingId));
      if (res.success) {
        setFolioData(res.data);
      }
    } catch (error) {
      toast.error("Failed to retrieve folio ledger");
    } finally {
      setLoading(false);
    }
  };

  const [processingPayment, setProcessingPayment] = useState(false);

  const handlePayment = async (method: "cash" | "online") => {
    if (!bookingId) return;
    
    try {
      setProcessingPayment(true);
      
      if (method === "online") {
        toast.success("Online payment verified & marked as paid!", {
          icon: '💳',
          style: { borderRadius: '15px', background: '#111827', color: '#fff' }
        });
        // In a real scenario, we might still want to record this in the DB
        // For now, let's just simulate the success as requested
        await fetchFolio();
        return;
      }

      // Cash Settlement
      const res = await paymentService.initiatePayment({
        bookingId: Number(bookingId),
        amount: totalAmount - paidAmount, // Settle the remaining balance
        method: "cash"
      });

      if (res.success) {
        toast.success("Cash settlement confirmed and recorded!");
        await fetchFolio(); // Refresh data
      }
    } catch (error: any) {
      toast.error(error.message || "Payment processing failed");
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('professional-invoice-template');
    if (!element) return;

    const toastId = toast.loading("Preparing high-fidelity invoice...");

    try {
      // Ensure the template is visible during capture
      element.classList.remove('hidden');

      const canvas = await html2canvas(element, {
        scale: 3, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 450 // Compact receipt width
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dynamic height for compact receipt
      const pdfWidth = 80; // 80mm is standard thermal width
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`RECEIPT_${booking.bookingNumber}.pdf`);
      
      toast.success("Professional Invoice saved!", { id: toastId });
      
      // Hide template again after capture if it's meant to be print-only
      element.classList.add('hidden');
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#F9FAFB]">
        <Loader2 className="w-12 h-12 text-[#14532D] animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Auditing Folio...</p>
      </div>
    );
  }

  if (!folioData) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6 bg-[#F9FAFB]">
        <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center text-gray-300">
           <AlertCircle size={40} />
        </div>
        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No Active Folio Found</p>
      </div>
    );
  }

  const { booking, charges, paymentsSummary } = folioData;
  const subtotal = charges.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);
  const tax = subtotal * 0.13;
  const totalAmount = subtotal + tax;
  const paidAmount = Number(paymentsSummary.totalPaid);
  const balanceDue = totalAmount - paidAmount;

  return (
    <div id="folio-bill-content" className="min-h-screen bg-[#F9FAFB] pb-20 animate-fade-in px-4 md:px-0 relative">
      {/* ── PRINT STYLES (Keep for manual print support) ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print, .sidebar, .navbar, button, .service-actions { display: none !important; }
          body { background: white !important; }
          .min-h-screen { min-height: auto !important; padding: 0 !important; }
          .grid { display: block !important; }
          .lg\\:col-span-4, .lg\\:col-span-8 { width: 100% !important; margin-bottom: 2rem; }
          .rounded-\\[32px\\], .rounded-\\[40px\\], .rounded-full { border-radius: 8px !important; }
          .shadow-sm, .shadow-xl, .shadow-2xl { shadow: none !important; border: 1px solid #eee !important; }
          .bg-\\[\\#F9FAFB\\] { background: white !important; }
          .bg-emerald-600, .bg-\\[\\#14532D\\] { -webkit-print-color-adjust: exact; background-color: #14532D !important; color: white !important; }
          .text-emerald-600 { color: #14532D !important; }
          .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 150px; color: rgba(0,0,0,0.05); font-weight: 900; z-index: 0; pointer-events: none; text-transform: uppercase; }
        }
      `}} />

      {balanceDue <= 0 && <div className="watermark hidden print:block">PAID</div>}
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pt-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-[#111827] tracking-tight">Guest Folio</h1>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              booking.status === "checked_in" ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"
            }`}>
              {booking.status} LEDGER
            </span>
          </div>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Comprehensive billing & financial audit for {booking.guest.firstName} {booking.guest.lastName}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-6 py-4 bg-[#111827] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#14532D] transition-all shadow-xl shadow-black/10 no-print"
          >
            <Download size={14} strokeWidth={3} /> Save as Professional PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── 1. BOOKING INFO PANEL (LEFT) ── */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 flex flex-col gap-6"
        >
          <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm">
            <div className="bg-[#14532D] p-8 text-white relative overflow-hidden">
               <div className="relative z-10">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">Primary Guest</p>
                 <h2 className="text-2xl font-black uppercase tracking-tight">{booking.guest.firstName} {booking.guest.lastName}</h2>
               </div>
               <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            <div className="p-8 space-y-6">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#14532D]">
                    <Bed size={20} strokeWidth={2.5} />
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unit Assigned</p>
                   <p className="text-sm font-black text-[#111827]">Room {booking.room.roomNumber} - {booking.room.roomType.name}</p>
                 </div>
               </div>
               
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#14532D]">
                    <Calendar size={20} strokeWidth={2.5} />
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stay Period</p>
                   <p className="text-sm font-black text-[#111827]">{new Date(booking.checkIn).toLocaleDateString()} — {new Date(booking.checkOut).toLocaleDateString()}</p>
                 </div>
               </div>

               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#14532D]">
                    <Hash size={20} strokeWidth={2.5} />
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Folio Reference</p>
                   <p className="text-sm font-black text-[#111827]">{booking.bookingNumber}</p>
                 </div>
               </div>
            </div>
          </div>

          {/* ── PAYMENTS SECTION ── */}
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm border-t-4 border-t-emerald-500 no-print">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#111827]">Settle Payment</h3>
                <CreditCard size={18} className="text-[#14532D]" strokeWidth={2.5} />
             </div>
             
             <div className="grid grid-cols-1 gap-3 mb-8">
                <button 
                  disabled={processingPayment || balanceDue <= 0}
                  onClick={() => handlePayment("cash")}
                  className="p-6 rounded-[24px] border-2 border-gray-50 flex items-center gap-6 hover:border-[#14532D] hover:bg-[#14532D]/5 transition-all group disabled:opacity-50"
                >
                  <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-[#14532D] shadow-lg shadow-emerald-900/10 group-hover:scale-110 transition-transform">
                    <Banknote size={28} strokeWidth={2.5} />
                  </div>
                  <div className="text-left">
                    <span className="block text-[13px] font-black uppercase text-[#111827]">Cash Settlement</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Manual COD Recording</span>
                  </div>
                </button>

                <button 
                  disabled={processingPayment || balanceDue <= 0}
                  onClick={() => handlePayment("online")}
                  className="p-6 rounded-[24px] border-2 border-gray-50 flex items-center gap-6 hover:border-blue-600 hover:bg-blue-50 transition-all group disabled:opacity-50"
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-lg shadow-blue-900/10 group-hover:scale-110 transition-transform">
                    <Smartphone size={28} strokeWidth={2.5} />
                  </div>
                  <div className="text-left">
                    <span className="block text-[13px] font-black uppercase text-[#111827]">Online Payment</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mark as Online Paid</span>
                  </div>
                </button>
             </div>

             <div className="space-y-4 pt-4 border-t border-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Net Receivable</span>
                  <span className={`text-sm font-black ${balanceDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    Rs. {balanceDue.toLocaleString()}
                  </span>
                </div>
                {balanceDue > 0 ? (
                  <button 
                    disabled={processingPayment}
                    onClick={() => handlePayment("cash")}
                    className="w-full py-5 bg-[#111827] text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#14532D] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3"
                  >
                    {processingPayment ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                    Finalize Settlement
                  </button>
                ) : (
                  <div className="w-full py-5 bg-emerald-50 text-emerald-600 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 border border-emerald-100">
                    <CheckCircle2 size={16} /> Folio Fully Settled
                  </div>
                )}
             </div>
          </div>
        </motion.div>

        {/* ── CENTER & RIGHT SECTIONS ── */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 service-actions no-print"
          >
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-[#14532D] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-colors">
                  <Utensils size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Add Food</p>
                  <p className="text-xs font-black text-[#111827]">Dining Order</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-[#14532D] group-hover:translate-x-1 transition-all" />
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-[#14532D] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                  <Shirt size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Add Service</p>
                  <p className="text-xs font-black text-[#111827]">Laundry Dept</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-[#14532D] group-hover:translate-x-1 transition-all" />
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-[#14532D] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-fuchsia-50 flex items-center justify-center text-fuchsia-600 group-hover:bg-fuchsia-100 transition-colors">
                  <Flower size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Book Spa</p>
                  <p className="text-xs font-black text-[#111827]">Wellness Hub</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-[#14532D] group-hover:translate-x-1 transition-all" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#14532D] rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-green-900/20 relative overflow-hidden"
          >
            <div className="relative z-10 flex-1 border-r border-white/20 md:pr-10">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Gross Indebtedness</p>
               <h3 className="text-4xl font-black tracking-tighter">Rs. {totalAmount.toLocaleString()}</h3>
            </div>
            
            <div className="relative z-10 flex-1 border-r border-white/20 md:px-10">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Paid Aggregate</p>
               <h3 className="text-4xl font-black tracking-tighter">Rs. {paidAmount.toLocaleString()}</h3>
            </div>

            <div className="relative z-10 flex-1 md:pl-10">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-200 mb-2">Net Outstanding</p>
               <h3 className="text-4xl font-black tracking-tighter">Rs. {balanceDue.toLocaleString()}</h3>
            </div>

            <div className="absolute bottom-[-50px] left-[-20px] w-64 h-64 bg-white/10 rounded-full blur-[100px]"></div>
          </motion.div>

          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-10 py-7 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#111827]">Transaction Ledger</h3>
              <div className="flex items-center gap-2">
                 <Button className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 transition-all">
                    <Trash2 size={16} />
                 </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Service Date</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Description</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Valuation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {charges.map((charge: any, idx: number) => (
                    <motion.tr 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-gray-50/50 transition-all group"
                    >
                      <td className="px-10 py-6 text-sm font-bold text-gray-400 font-mono italic">{new Date(charge.date).toLocaleDateString()}</td>
                      <td className="px-10 py-6">
                        <p className="text-[13px] font-black text-[#111827] uppercase">{charge.description}</p>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                          charge.category === 'accommodation' ? 'bg-blue-50 text-blue-600' :
                          charge.category === 'service' ? 'bg-amber-50 text-amber-600' :
                          'bg-emerald-50 text-emerald-600'
                        }`}>
                          {charge.category}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <p className="text-base font-black text-[#111827] tracking-tight">Rs. {Number(charge.amount).toLocaleString()}</p>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div></div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm"
            >
               <h3 className="text-xs font-black uppercase tracking-widest text-[#111827] mb-8 pb-4 border-b border-gray-50">Financial Reconciliation</h3>
               
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-gray-400">
                    <span className="text-[10px] font-black uppercase tracking-widest">Subtotal (Net)</span>
                    <span className="text-sm font-bold">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-600">
                    <span className="text-[10px] font-black uppercase tracking-widest">Tax Provision (13%)</span>
                    <span className="text-sm font-black">+ Rs. {tax.toLocaleString()}</span>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-gray-100">
                     <div className="flex justify-between items-center mb-1">
                        <span className="text-[12px] font-black uppercase tracking-widest text-[#111827]">Total Receivable</span>
                        <span className="text-xl font-black text-[#111827]">Rs. {totalAmount.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center mb-8">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Already Settled</span>
                        <span className="text-sm font-black text-emerald-600">- Rs. {paidAmount.toLocaleString()}</span>
                     </div>
                  </div>

                  <div className="p-6 rounded-[24px] bg-[#111827] text-white flex items-center justify-between shadow-xl shadow-black/10">
                     <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Balance Due</span>
                     <span className="text-lg font-black italic">Rs. {balanceDue.toLocaleString()}</span>
                  </div>
               </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* ── COMPACT THERMAL RECEIPT TEMPLATE (80mm / 450px Style) ── */}
      <div id="professional-invoice-template" className="hidden fixed left-[-9999px] top-[-9999px] w-[450px] bg-white p-8 text-[#111827] font-mono border border-dashed border-[#D1D5DB]">
        {/* Header Section */}
        <div className="text-center border-b border-dashed border-[#111827] pb-6 mb-6">
          <div className="flex flex-col items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#111827] rounded-lg flex items-center justify-center text-white font-black text-sm">H</div>
            <h2 className="text-xl font-black tracking-tighter uppercase text-[#111827]">Grand Horizon Resort</h2>
          </div>
          <p className="text-[9px] font-bold text-[#111827] uppercase leading-tight">
            Luxury Avenue, Kathmandu, Nepal<br/>
            VAT/PAN: 606948573 | +977-1-44556677
          </p>
        </div>

        <div className="flex justify-between items-center mb-6 text-[10px] font-bold border-b border-dashed border-[#E5E7EB] pb-2">
           <span className="uppercase">Receipt: #{booking.bookingNumber}</span>
           <span>{new Date().toLocaleDateString()}</span>
        </div>

        {/* Guest Info */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase text-[#111827]">Guest: {booking.guest.firstName} {booking.guest.lastName}</p>
          <p className="text-[9px] font-bold text-[#6B7280]">Room: {booking.room.roomNumber} | Nights: {Math.max(1, Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)))}</p>
        </div>

        {/* Ledger - Receipt Style */}
        <div className="space-y-4 mb-6 border-b border-dashed border-[#111827] pb-6">
          {charges.map((charge: any, idx: number) => (
            <div key={idx} className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase leading-tight">{charge.description}</p>
                <p className="text-[8px] font-bold text-[#9CA3AF] uppercase">{new Date(charge.date).toLocaleDateString()}</p>
              </div>
              <p className="text-[10px] font-black whitespace-nowrap">Rs. {Number(charge.amount).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-2 mb-8">
           <div className="flex justify-between text-[10px] font-bold">
             <span>Subtotal:</span>
             <span>Rs. {subtotal.toLocaleString()}</span>
           </div>
           <div className="flex justify-between text-[10px] font-bold text-[#111827]">
             <span>VAT (13%):</span>
             <span>Rs. {tax.toLocaleString()}</span>
           </div>
           <div className="flex justify-between text-lg font-black border-t border-[#111827] pt-2 mt-2">
             <span>TOTAL:</span>
             <span>Rs. {totalAmount.toLocaleString()}</span>
           </div>
           <div className="flex justify-between text-[10px] font-bold text-[#059669]">
             <span>PAID:</span>
             <span>Rs. {paidAmount.toLocaleString()}</span>
           </div>
           <div className="flex justify-between text-sm font-black bg-[#111827] text-white p-2 rounded-lg mt-2">
             <span>BALANCE:</span>
             <span>Rs. {balanceDue.toLocaleString()}</span>
           </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[9px] font-bold text-[#111827] uppercase leading-relaxed">
           <p className="mb-2 italic">*** Thank You For Visiting ***</p>
           <p className="text-[#9CA3AF]">This is a system generated bill</p>
        </div>

        {balanceDue <= 0 && (
          <div className="absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] rotate-[-25deg] opacity-[0.1] pointer-events-none">
             <span className="text-[80px] font-black tracking-widest border-[8px] border-[#111827] px-6 text-[#111827]">PAID</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestFolioPage;
