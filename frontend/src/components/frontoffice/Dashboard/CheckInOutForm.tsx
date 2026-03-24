import React from 'react';
import { User, Bed, Calendar, Search, ArrowRight, Activity } from 'lucide-react';

const CheckInOutForm: React.FC = () => {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] p-6 lg:p-7 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#1F7A3A]/[0.03] blur-xl pointer-events-none" />

      {/* Header */}
      <div className="mb-6 relative z-10">
        <h3 className="text-[15px] font-extrabold text-[#111827] flex items-center gap-2 mb-1">
          <Activity size={18} className="text-[#1F7A3A]" />
          Fast Check-In
        </h3>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-6">New guest arrivals</p>
      </div>

      <form className="space-y-5 relative z-10">
        {/* Guest Search */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-[#111827] mb-2.5">
            Guest Name <span className="text-[#F59E0B]">*</span>
          </label>
          <div className="relative group">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1F7A3A] transition-colors" />
            <input
              type="text"
              placeholder="Enter name or scan ID..."
              className="w-full h-11 pl-[38px] pr-12 text-[13px] font-bold bg-gray-50 border border-gray-100 rounded-[14px]
                         focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1F7A3A]/5 focus:border-[#1F7A3A]/30 transition-all placeholder:font-medium placeholder:text-gray-400"
            />
            <button
              type="button"
              title="Search directory"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-xl text-white bg-[#1F7A3A] hover:bg-[#14532D] shadow-md shadow-green-900/10 transition-colors cursor-pointer"
            >
              <Search size={14} />
            </button>
          </div>
        </div>

        {/* Room & Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#111827] mb-2.5">
              Assign Room
            </label>
            <div className="relative group">
              <Bed size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1F7A3A] transition-colors" />
              <select
                title="Select room number"
                className="w-full h-11 pl-[38px] pr-3 text-[13px] font-bold bg-gray-50 border border-gray-100 rounded-[14px]
                           appearance-none cursor-pointer focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1F7A3A]/5 focus:border-[#1F7A3A]/30 transition-all"
              >
                <option value="">Choose...</option>
                <option value="201">Dlx-201 (Ready)</option>
                <option value="204">Dlx-204 (Ready)</option>
                <option value="301">Ste-301 (Ready)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#111827] mb-2.5">
              Check-out
            </label>
            <div className="relative group">
              <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1F7A3A] transition-colors" />
              <input
                type="date"
                title="Select end date"
                className="w-full h-11 pl-[38px] pr-3 text-[13px] font-bold bg-gray-50 border border-gray-100 rounded-[14px]
                           cursor-pointer focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1F7A3A]/5 focus:border-[#1F7A3A]/30 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="button"
          className="w-full h-12 mt-2 bg-gradient-to-r from-[#1F7A3A] to-[#14532D] hover:from-[#14532D] hover:to-[#0A2E19] text-white text-[12px] font-black uppercase tracking-widest rounded-[14px] 
                     shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 
                     transition-transform duration-200 active:scale-[0.98] group cursor-pointer"
        >
          Confirm Arrival
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
};

export default CheckInOutForm;
