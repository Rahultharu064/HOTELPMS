import React from "react";
import { ShieldAlert, Cpu } from "lucide-react";

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in pb-10">
      <div>
        <h1 className="text-3xl font-black text-[#111827] tracking-tight uppercase">System Configuration</h1>
        <p className="text-neutral-text-secondary text-[11px] font-black uppercase tracking-[0.2em] mt-2">Global Parameters & Behavioral Overrides</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white p-10 rounded-[56px] border border-gray-100 shadow-sm space-y-8">
           <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                 <Cpu size={24} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight">Core Engine Settings</h3>
           </div>
           <div className="space-y-6">
              {[
                { label: "High Availability Mode", desc: "Redundancy for mission critical ops", active: true },
                { label: "Deep Cache Policy", desc: "Aggressive response optimization", active: false },
                { label: "Real-time Auditing", desc: "Log every master command", active: true },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-4 rounded-3xl transition-all">
                   <div>
                      <p className="text-[14px] font-black text-[#111827]">{s.label}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.desc}</p>
                   </div>
                   <div className={`w-12 h-6 rounded-full relative transition-all ${s.active ? "bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)]" : "bg-gray-200"}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${s.active ? "right-1" : "left-1"}`} />
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-[#111827] p-10 rounded-[56px] text-white space-y-8 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-[2000ms]" />
           <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-red-600/20 flex items-center justify-center text-red-500">
                 <ShieldAlert size={24} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight">Security Hardening</h3>
           </div>
           <p className="text-white/40 text-[11px] font-black uppercase tracking-widest leading-relaxed relative z-10 mb-10">Manage system-wide security protocols and vulnerability patches.</p>
           <button className="relative z-10 w-full py-5 bg-red-600 text-white rounded-[32px] text-[12px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-2xl shadow-red-600/20 active:scale-95">
              Execute Security Audit
           </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
