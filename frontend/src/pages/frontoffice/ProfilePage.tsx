import React from "react";
import { 
  User, Shield, Key, Clock, 
  Camera, ChevronRight, Save,
  LogOut, Star, Globe, Zap
} from "lucide-react";

const ProfilePage: React.FC = () => {
  return (
    <div className="space-y-10 animate-fade-in pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight">Management Profile</h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Configure your personal and security credentials</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-4 bg-[#14532D] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#1F7A3A] transition-all shadow-xl shadow-[#1F7A3A]/20 flex items-center gap-2">
            <Save size={16} strokeWidth={3} /> Update Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Left Card: Profile Avatar & Stats */}
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[56px] border border-gray-100 shadow-sm text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/5 rounded-full blur-[60px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
            
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-[#1F7A3A] to-[#14532D] mx-auto p-1 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                <div className="w-full h-full rounded-[38px] overflow-hidden border-4 border-white/20">
                  <img src="/avatar-placeholder.png" alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-[#F59E0B] text-[#14532D] flex items-center justify-center shadow-lg hover:scale-110 transition-transform" title="Change Profile Picture">
                <Camera size={18} strokeWidth={3} />
              </button>
            </div>

            <h3 className="text-2xl font-black text-[#111827] tracking-tight">Namuna Admin</h3>
            <p className="text-[#F59E0B] text-[10px] font-black uppercase tracking-[0.3em] mt-1 mb-6">Senior Management</p>

            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-xl bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-black">{i}</div>)}
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">3 Systems Managed</p>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white transition-all group/btn text-left overflow-hidden">
                <div className="flex items-center gap-3">
                  <Star size={16} className="text-[#F59E0B]" strokeWidth={2.5} />
                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">Verified Admin</span>
                </div>
                <ChevronRight size={14} className="text-gray-300 group-hover/btn:translate-x-1 group-hover/btn:text-[#111827] transition-all" />
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 hover:bg-red-50 hover:border-red-100 transition-all group/btn text-left overflow-hidden">
                <div className="flex items-center gap-3">
                  <LogOut size={16} className="text-red-500" strokeWidth={2.5} />
                  <span className="text-[11px] font-black uppercase tracking-widest text-red-500">Logout Everywhere</span>
                </div>
                <ChevronRight size={14} className="text-gray-300 group-hover/btn:translate-x-1 group-hover/btn:text-red-500 transition-all" />
              </button>
            </div>
          </div>

          <div className="p-10 rounded-[48px] bg-gray-50 border border-gray-100">
             <div className="flex items-center gap-3 mb-6">
                <Zap className="text-[#1F7A3A]" size={24} />
                <h3 className="text-lg font-black text-[#111827] uppercase tracking-tight">Activity Log</h3>
             </div>
             <div className="space-y-4">
                {[
                  { label: "Login from Itahari", time: "2 hrs ago", ok: true },
                  { label: "Settings Updated", time: "5 hrs ago", ok: true },
                  { label: "Check-in BK-142", time: "Yesterday", ok: true },
                ].map((l, i) => (
                  <div key={i} className="flex flex-col p-4 rounded-2xl bg-white border border-gray-100">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#111827]">{l.label}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">{l.time}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Area: Form Sections */}
        <div className="lg:col-span-3 space-y-10">
          <div className="bg-white p-12 rounded-[56px] border border-gray-100 shadow-sm space-y-12">
            {/* Personal Details */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <User size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#111827] tracking-tight">Identity Details</h2>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-0.5 font-mono">Profile publicly visible to staff</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                  <input type="text" defaultValue="Namuna Admin" className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[28px] text-[13px] font-black text-[#111827] focus:outline-none focus:ring-4 focus:ring-[#1F7A3A]/5 focus:border-[#1F7A3A]/20 transition-all shadow-inner" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                  <input type="tel" defaultValue="+977-9841234567" className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[28px] text-[13px] font-black text-[#111827] focus:outline-none focus:ring-4 focus:ring-[#1F7A3A]/5 focus:border-[#1F7A3A]/20 transition-all shadow-inner" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                  <input type="email" defaultValue="admin@namunacollege.edu.np" className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[28px] text-[13px] font-black text-[#111827] focus:outline-none focus:ring-4 focus:ring-[#1F7A3A]/5 focus:border-[#1F7A3A]/20 transition-all shadow-inner" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Manager Role</label>
                  <div className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[28px] text-[13px] font-black text-[#F59E0B] uppercase tracking-widest flex items-center gap-2">
                    <Shield size={14} /> Full System Access
                  </div>
                </div>
              </div>
            </section>

            {/* Security Section */}
            <section className="space-y-8 pt-10 border-t border-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                  <Key size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#111827] tracking-tight">Security Credentials</h2>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-0.5 font-mono">Last updated 14 days ago</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Change Admin Password", desc: "Update your system access credentials", icon: Key },
                  { label: "Two-Factor Auth", desc: "Currently disabled - Recommended", icon: Globe },
                  { label: "Login Sessions", desc: "Manage current active login locations", icon: Clock },
                ].map((item, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-8 rounded-[36px] bg-gray-50/50 border border-gray-100 hover:bg-white hover:border-gray-200 transition-all group group-hover:shadow-lg text-left">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-gray-400 group-hover:text-[#111827] transition-all">
                        <item.icon size={20} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-black text-[#111827] leading-none mb-1 uppercase tracking-widest">{item.label}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:translate-x-1 group-hover:text-[#111827] transition-all" />
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
