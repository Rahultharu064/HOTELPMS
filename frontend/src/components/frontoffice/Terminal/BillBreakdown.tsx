import React from 'react';
import { CreditCard, ShoppingCart, Utensils, Info, ArrowUpRight } from 'lucide-react';

interface BillBreakdownProps {
  folio: any;
}

export const BillBreakdown: React.FC<BillBreakdownProps> = ({ folio }) => {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Accommodation Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
            <div className="w-1.5 h-6 bg-[#111827] rounded-full" />
            <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-400">Primary Accommodation</h4>
        </div>
        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/10 flex justify-between items-center group hover:shadow-2xl hover:border-[#111827]/5 transition-all duration-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50/50 rounded-bl-[60px] pointer-events-none group-hover:bg-[#111827]/5 transition-colors duration-700" />
          
          <div className="flex items-center gap-8 relative z-10">
              <div className="w-16 h-16 rounded-[24px] bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#111827] group-hover:text-white transition-all duration-700 shadow-inner">
                  <CreditCard size={28} strokeWidth={2.5} />
              </div>
              <div>
                  <p className="text-xl font-black text-[#111827] tracking-tight">{folio.roomType}</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1.5 uppercase tracking-widest flex items-center gap-2">
                    <Info size={12} className="text-[#111827]" /> Core Stay Component
                  </p>
              </div>
          </div>
          <div className="text-right relative z-10">
              <span className="text-2xl font-black text-[#111827] block tracking-tighter">Rs. {Number(folio.stayCharges).toFixed(2)}</span>
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1 block">Verified</span>
          </div>
        </div>
      </div>

      {/* Extra Services */}
      {folio.extraServices?.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
              <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
              <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-400">Additional Services</h4>
          </div>
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/10 overflow-hidden divide-y divide-gray-50">
            {folio.extraServices.map((item: any) => (
              <div key={item.id} className="p-10 flex justify-between items-center group hover:bg-gray-50/50 transition-all duration-500">
                <div className="flex items-center gap-8">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm">
                    <ShoppingCart size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[16px] font-black text-[#111827] tracking-tight">{item.extraService.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">{item.quantity} Unit(s) • Provisioned</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-[#111827] tracking-tighter block">Rs. {Number(item.totalPrice).toFixed(2)}</span>
                  <ArrowUpRight size={14} className="text-gray-200 ml-auto mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* POS Services */}
      {folio.posServiceOrders?.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
              <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
              <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-400">Dining & Incidentals</h4>
          </div>
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/10 overflow-hidden divide-y divide-gray-50">
            {folio.posServiceOrders.map((order: any) => (
              <div key={order.id} className="p-10 flex justify-between items-center group hover:bg-gray-50/50 transition-all duration-500">
                <div className="flex items-center gap-8">
                  <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm">
                    <Utensils size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[16px] font-black text-[#111827] tracking-tight">Order #{order.orderNumber}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Point of Sale Transaction</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-[#111827] tracking-tighter block">Rs. {Number(order.totalAmount).toFixed(2)}</span>
                  <div className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-md text-[8px] font-black uppercase tracking-widest mt-1 inline-block">Billed to Room</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Totals Section */}
      <div className="mt-16 bg-[#111827] rounded-[48px] p-12 text-white relative overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-tr-[100px] pointer-events-none" />
          
          <div className="grid grid-cols-2 gap-12 relative z-10 mb-12 border-b border-white/10 pb-12">
              <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 block">Gross Consumption</span>
                  <span className="text-3xl font-black tracking-tighter">Rs. {Number(folio.totalCharges).toFixed(2)}</span>
              </div>
              <div className="text-right space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400/40 block">Credits Applied</span>
                  <span className="text-3xl font-black text-emerald-400 tracking-tighter">-{Number(folio.totalPayments).toFixed(2)}</span>
              </div>
          </div>
          
          <div className="flex justify-between items-end relative z-10">
              <div className="space-y-1">
                <span className="text-[12px] font-black uppercase tracking-[0.4em] text-[#F59E0B]">Total Net Balance</span>
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">Final settlement required for release</p>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-[14px] font-black text-[#F59E0B]/50 uppercase">Rs.</span>
                <span className="text-6xl font-black text-[#F59E0B] tracking-tighter leading-none">{Number(folio.balance).toFixed(2)}</span>
              </div>
          </div>
      </div>
    </div>
  );
};
