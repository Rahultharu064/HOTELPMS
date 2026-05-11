import React from "react";
import { 
  Settings, User, Bell, 
  Shield, Globe, Database,
  ChevronRight, Save, Trash2,
  Lock, Smartphone, CreditCard
} from "lucide-react";
import { Input } from "../../components/ui/Input";

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-10 animate-fade-in pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight">System Configuration</h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Manage workspace preferences and security</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-3 bg-white border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-[#111827] hover:bg-gray-50 transition-all shadow-sm">
            Discard Changes
          </button>
          <button className="px-6 py-4 bg-[#14532D] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#1F7A3A] transition-all shadow-xl shadow-[#1F7A3A]/20 flex items-center gap-2">
            <Save size={16} strokeWidth={3} /> Save All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          {[
            { label: "General", icon: Settings, active: true },
            { label: "Account", icon: User },
            { label: "Notifications", icon: Bell },
            { label: "Security", icon: Shield },
            { label: "System & Branding", icon: Globe },
            { label: "Data Management", icon: Database },
          ].map((item, i) => (
            <button 
              key={i} 
              className={`w-full flex items-center justify-between p-5 rounded-[24px] transition-all group ${
                item.active ? "bg-white border border-gray-100 shadow-sm text-[#14532D]" : "text-gray-400 hover:text-[#111827] hover:bg-white/50"
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={18} className={item.active ? "text-[#1F7A3A]" : ""} strokeWidth={2.5} />
                <span className="text-[12px] font-black uppercase tracking-widest">{item.label}</span>
              </div>
              {item.active && <div className="w-1.5 h-1.5 rounded-full bg-[#1F7A3A]" />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-10">
          <div className="bg-white p-10 rounded-[56px] border border-gray-100 shadow-sm space-y-12">
            {/* Section: General */}
            <section className="space-y-8">
              <div>
                <h2 className="text-xl font-black text-[#111827] tracking-tight">General Information</h2>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Primary details of Itahari Namuna College PMS</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Input.Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Hotel Name</Input.Label>
                  <Input 
                    type="text" 
                    defaultValue="Itahari Namuna College Hotel"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl text-sm font-bold text-[#111827] focus:outline-none focus:ring-4 focus:ring-[#1F7A3A]/5 focus:border-[#1F7A3A]/20 transition-all font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Input.Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Support Email</Input.Label>
                  <Input 
                    type="email" 
                    defaultValue="support@namunacollege.edu.np"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl text-sm font-bold text-[#111827] focus:outline-none focus:ring-4 focus:ring-[#1F7A3A]/5 focus:border-[#1F7A3A]/20 transition-all font-mono"
                  />
                </div>
              </div>
            </section>

            {/* Section: Feature Toggles */}
            <section className="space-y-8 pt-10 border-t border-gray-50">
              <div>
                <h2 className="text-xl font-black text-[#111827] tracking-tight">Functional Configuration</h2>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Enable or disable core management modules</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Auto-Check-out System", desc: "Automatically settle bills and close room status at 12:00 PM", icon: Smartphone, enabled: true },
                  { label: "E-Payment Gateway", desc: "Allow guests to pay via Esewa, Khalti and Fonepay QR", icon: CreditCard, enabled: true },
                  { label: "SMS Notifications", desc: "Send automated booking confirms and reminders to guest phones", icon: Bell, enabled: false },
                  { label: "Advanced Analytics", desc: "Generate daily AI intelligence reports for performance", icon: Database, enabled: true },
                ].map((toggle, i) => (
                  <div key={i} className="flex items-center justify-between p-6 rounded-[32px] bg-gray-50/50 border border-gray-100 hover:bg-white transition-all group cursor-pointer">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${toggle.enabled ? "bg-[#1F7A3A]/10 text-[#1F7A3A]" : "bg-gray-100 text-gray-400"}`}>
                        <toggle.icon size={20} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-black text-[#111827] leading-none mb-1">{toggle.label}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{toggle.desc}</p>
                      </div>
                    </div>
                    {/* Premium Toggle Switch */}
                    <div className={`w-14 h-8 rounded-full relative transition-all duration-300 shadow-inner ${toggle.enabled ? "bg-[#1F7A3A]" : "bg-gray-200"}`}>
                      <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-xl transition-all duration-300 ${toggle.enabled ? "left-7" : "left-1"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Danger Zone */}
            <section className="space-y-8 pt-10 border-t border-gray-50">
              <div>
                <h2 className="text-xl font-black text-red-500 tracking-tight">Security & Governance</h2>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Critical system actions and audit trail controls</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button className="flex items-center justify-between p-6 rounded-[28px] border border-gray-100 hover:bg-red-50 group hover:border-red-200 transition-all text-left">
                  <div className="flex items-center gap-4">
                    <Lock className="text-gray-400 group-hover:text-red-500" size={18} />
                    <div>
                      <h4 className="text-[12px] font-black text-[#111827] uppercase tracking-widest">Reset Admin Password</h4>
                      <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">Enforce password rotation</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 group-hover:translate-x-1 group-hover:text-red-500 transition-all" />
                </button>
                <button className="flex items-center justify-between p-6 rounded-[28px] border border-gray-100 hover:bg-red-50 group hover:border-red-200 transition-all text-left">
                  <div className="flex items-center gap-4">
                    <Trash2 className="text-gray-400 group-hover:text-red-500" size={18} />
                    <div>
                      <h4 className="text-[12px] font-black text-[#111827] uppercase tracking-widest">Purge Old Logs</h4>
                      <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">Delete records older than 2 years</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 group-hover:translate-x-1 group-hover:text-red-500 transition-all" />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
