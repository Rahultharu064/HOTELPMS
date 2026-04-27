import React from 'react';
import { Wallet, CreditCard, CheckCircle2, Loader2, LogOut, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '../../ui/Button';

interface SettlementTerminalProps {
  folio: any;
  paymentMethod: 'cash' | 'esewa' | 'khalti';
  onPaymentMethodChange: (method: 'cash' | 'esewa' | 'khalti') => void;
  onCheckOut: () => void;
  isSettling: boolean;
}

export const SettlementTerminal: React.FC<SettlementTerminalProps> = ({
  folio,
  paymentMethod,
  onPaymentMethodChange,
  onCheckOut,
  isSettling,
}) => {
  const methods = [
    { id: 'cash', label: 'Cash Payment', icon: Wallet, desc: 'Direct physical settlement' },
    { id: 'esewa', label: 'eSewa Digital', icon: Zap, desc: 'Secure online gateway' },
    { id: 'khalti', label: 'Khalti Wallet', icon: CreditCard, desc: 'Digital wallet transfer' },
  ];

  return (
    <div className="flex flex-col h-full space-y-12 animate-fade-in">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-[#111827] tracking-tight uppercase leading-none">Settlement</h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full">
            <ShieldCheck size={12} className="text-emerald-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Secure Node</span>
          </div>
        </div>
        
        <div className="bg-[#111827] rounded-[48px] p-10 text-white relative overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] group">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/30 transition-all duration-1000" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] block">Net Collectible</span>
              <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
            
            <div className="flex items-baseline gap-3">
              <span className="text-[14px] font-black text-white/40 uppercase">Rs.</span>
              <span className="text-5xl font-black tracking-tighter leading-none">{Number(folio.balance).toFixed(2)}</span>
            </div>
            
            <div className="flex items-center gap-3">
                {folio.isSettled ? (
                    <div className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/30 inline-flex items-center gap-2 shadow-lg shadow-emerald-500/10">
                        <CheckCircle2 size={14} strokeWidth={3} /> Account Reconciled
                    </div>
                ) : (
                    <div className="px-4 py-2 bg-[#F59E0B]/20 text-[#F59E0B] rounded-2xl text-[10px] font-black uppercase tracking-widest border border-[#F59E0B]/30 inline-flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" /> Awaiting Payment
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {!folio.isSettled ? (
        <div className="flex-1 space-y-8">
          <div className="space-y-5">
            <label className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 px-2 block">Choose Settlement Channel</label>
            <div className="space-y-4">
              {methods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => onPaymentMethodChange(method.id as any)}
                  className={`w-full flex items-center justify-between p-6 rounded-[36px] border-2 transition-all duration-700 group relative overflow-hidden ${
                    paymentMethod === method.id 
                      ? 'bg-white border-[#111827] shadow-2xl shadow-black/5 translate-x-2' 
                      : 'bg-gray-50 border-transparent hover:border-gray-200'
                  }`}
                >
                  {paymentMethod === method.id && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#111827]" />
                  )}
                  
                  <div className="flex items-center gap-6 relative z-10 text-left">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 ${
                      paymentMethod === method.id 
                        ? 'bg-[#111827] text-white shadow-xl scale-110' 
                        : 'bg-white text-gray-300 shadow-sm'
                    }`}>
                      <method.icon size={26} strokeWidth={2.5} />
                    </div>
                    <div>
                      <span className={`text-[15px] font-black tracking-tight block ${paymentMethod === method.id ? 'text-[#111827]' : 'text-gray-400'}`}>
                          {method.label}
                      </span>
                      <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-1 block">
                        {method.desc}
                      </span>
                    </div>
                  </div>
                  
                  {paymentMethod === method.id && (
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg relative z-10 scale-110 transition-transform">
                        <CheckCircle2 size={14} strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-emerald-50/30 rounded-[48px] border border-emerald-100/50 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
          <div className="w-24 h-24 rounded-[36px] bg-emerald-500 text-white flex items-center justify-center mb-8 shadow-2xl transform transition-all duration-1000 group-hover:scale-110 group-hover:rotate-12 relative z-10">
            <CheckCircle2 size={44} strokeWidth={3} />
          </div>
          <h5 className="text-xl font-black text-emerald-900 uppercase tracking-[0.2em] mb-3 relative z-10">Account Reconciled</h5>
          <p className="text-[11px] font-bold text-emerald-700/60 uppercase tracking-[0.2em] max-w-[240px] leading-relaxed relative z-10">
            The financial core has successfully verified all applied payments and credits.
          </p>
        </div>
      )}

      <div className="pt-10 border-t border-gray-100">
        <Button
          onClick={onCheckOut}
          disabled={isSettling}
          className={`w-full h-24 rounded-[40px] font-black uppercase tracking-[0.5em] text-[13px] shadow-2xl transition-all duration-700 flex items-center justify-center gap-5 border-none active:scale-95 group relative overflow-hidden ${
            folio.isSettled 
              ? 'bg-emerald-600 text-white hover:bg-[#111827] shadow-emerald-600/30' 
              : 'bg-[#111827] text-white hover:bg-emerald-600 shadow-black/30'
          }`}
        >
          <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
          
          {isSettling ? (
            <Loader2 className="animate-spin" size={28} strokeWidth={3} />
          ) : folio.isSettled ? (
            <>
              <LogOut size={26} strokeWidth={3} className="relative z-10" />
              <span className="relative z-10">Authorize Release</span>
            </>
          ) : (
            <>
              <CreditCard size={26} strokeWidth={3} className="relative z-10" />
              <span className="relative z-10">Process Settlement</span>
            </>
          )}
        </Button>
        <div className="flex items-center justify-center gap-3 mt-8">
          <div className="w-8 h-[1px] bg-gray-100" />
          <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">
            Protocol L3 Authentication Active
          </p>
          <div className="w-8 h-[1px] bg-gray-100" />
        </div>
      </div>
    </div>
  );
};
