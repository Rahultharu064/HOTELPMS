import React, { useState } from 'react';
import FrontOfficeLayout from '../../components/frontoffice/Layout/FrontOfficeLayout';
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Users
} from 'lucide-react';

const guestsData = [
  { id: 'GT-084', name: 'Rahul Tharu',      type: 'VIP',       email: 'rahul.t@example.com',   phone: '+977 9800000010', stays: 8, spent: 'Rs.1,45,000', lastVisit: 'Mar 24' },
  { id: 'GT-085', name: 'Maya Sharma',      type: 'Corporate', email: 'maya.s@corp.com',       phone: '+977 9812345671', stays: 3, spent: 'Rs.45,000',  lastVisit: 'Mar 15' },
  { id: 'GT-086', name: 'Siddharth Khanal', type: 'Regular',   email: 'sid.khanal@email.com',  phone: '+977 9845678901', stays: 1, spent: 'Rs.12,000',  lastVisit: 'Mar 10' },
  { id: 'GT-087', name: 'Anjali Pandey',    type: 'VIP',       email: 'anjali.p@example.com',  phone: '+977 9801112223', stays: 6, spent: 'Rs.1,10,000',lastVisit: 'Feb 28' },
  { id: 'GT-088', name: 'Bibek Magar',      type: 'Regular',   email: 'b.magar@email.com',     phone: '+977 9822334455', stays: 2, spent: 'Rs.24,000',  lastVisit: 'Jan 15' },
];

const typeStyles: Record<string, string> = {
  'VIP':       'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  'Corporate': 'bg-[#1F7A3A]/10 text-[#1F7A3A] border-[#1F7A3A]/20',
  'Regular':   'bg-gray-100 text-gray-500 border-gray-200',
};

const tabs = ['All Guests', 'VIP', 'Corporate', 'Regular Guests'];

const GuestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All Guests');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <FrontOfficeLayout>
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-[28px] font-extrabold text-[#111827] leading-tight flex items-center gap-2 mb-1.5">
            <Users size={24} className="text-[#1F7A3A]" />
            Guest Directory
          </h1>
          <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">
            CRM • 1,245 Registered Guests
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-11 px-4 flex items-center gap-2 text-[13px] font-bold text-gray-600 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow hover:border-gray-200 transition-all cursor-pointer">
            <Download size={16} /> Export
          </button>
          <button className="h-11 px-5 flex items-center gap-2 text-[13px] font-bold text-white bg-[#1F7A3A] hover:bg-[#14532D] rounded-xl shadow-lg shadow-green-900/10 transition-all cursor-pointer active:scale-95">
            <Plus size={16} /> Add Guest
          </button>
        </div>
      </div>

      {/* ── Main Card Wrapper ── */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-full min-h-[600px]">
        
        {/* Top Filter Bar */}
        <div className="px-6 py-5 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center gap-5 justify-between bg-gray-50/30">
          
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-gray-100 rounded-[14px] shadow-sm">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-[10px] text-[12px] font-bold transition-all cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-gray-100 text-[#111827] shadow-sm' 
                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative group flex-1 lg:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1F7A3A] transition-colors" />
              <input
                type="text"
                placeholder="Search guest names, IDs..."
                className="w-full h-11 pl-[38px] pr-4 text-[13px] font-bold bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1F7A3A]/5 focus:border-[#1F7A3A]/30 transition-all shadow-sm"
              />
            </div>
            
            {/* Filter */}
            <button className="h-11 px-4 flex items-center gap-2 text-[13px] font-bold text-gray-600 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-gray-50 transition-colors cursor-pointer shrink-0">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        {/* ── Data Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="w-12 px-6 py-4">
                  <input type="checkbox" className="min-w-4 h-4 rounded-[4px] border-gray-300 text-[#1F7A3A] focus:ring-[#1F7A3A]" />
                </th>
                {['Guest Profile', 'Tier/Status', 'Contact Info', 'Total Stays', 'Total Spent', 'Last Visit', ''].map((h, i) => (
                  <th key={i} className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {guestsData.map((g) => (
                <tr key={g.id} className="group hover:bg-gray-50/40 transition-colors bg-white">
                  <td className="px-6 py-5">
                    <input type="checkbox" className="w-4 h-4 rounded-[4px] border-gray-200 text-[#1F7A3A] focus:ring-[#1F7A3A] cursor-pointer" />
                  </td>
                  
                  {/* Guest Profile */}
                  <td className="px-4 py-5 min-w-[220px]">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-black shrink-0 transition-all duration-300 ${g.type === 'VIP' ? 'bg-gradient-to-br from-[#F59E0B] to-orange-500 text-white shadow-md' : 'bg-gray-100 text-[#111827] group-hover:bg-[#1F7A3A] group-hover:text-white'}`}>
                        {g.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[#111827] group-hover:text-[#1F7A3A] transition-colors">{g.name}</p>
                        <p className="text-[10px] font-black text-gray-400 mt-0.5 tracking-widest uppercase">{g.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Tier/Status */}
                  <td className="px-4 py-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-[8px] border text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${typeStyles[g.type]}`}>
                      {g.type}
                    </span>
                  </td>

                  {/* Contact Info */}
                  <td className="px-4 py-5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-[12px] font-bold text-gray-600">
                        <Mail size={13} className="text-gray-400" /> {g.email}
                      </div>
                      <div className="flex items-center gap-2 text-[12px] font-bold text-gray-600">
                        <Phone size={13} className="text-gray-400" /> {g.phone}
                      </div>
                    </div>
                  </td>

                  {/* Total Stays */}
                  <td className="px-4 py-5">
                     <span className="text-[14px] font-black text-[#111827] bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                       {g.stays}
                     </span>
                  </td>

                  {/* Total Spent */}
                  <td className="px-4 py-5">
                    <span className="text-[14px] font-black text-[#1F7A3A]">{g.spent}</span>
                  </td>

                  {/* Last Visit */}
                  <td className="px-4 py-5 text-[13px] font-bold text-gray-600 whitespace-nowrap">
                    {g.lastVisit}
                  </td>

                  {/* Actions (Dropdown Menu) */}
                  <td className="px-6 py-5 text-right relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === g.id ? null : g.id)}
                      className="p-2 rounded-xl text-gray-400 hover:text-[#111827] bg-white border border-transparent hover:border-gray-100 hover:shadow-sm transition-all focus:outline-none"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {/* Action Dropdown Menu */}
                    {activeMenu === g.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                        <div className="absolute right-8 top-12 w-48 bg-white rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] border border-gray-100 p-2 z-20 animate-fade-slide-up origin-top-right">
                          <button className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-gray-600 hover:bg-gray-50 hover:text-[#111827] rounded-xl transition-colors text-left uppercase tracking-wider">
                            <Eye size={14} className="text-[#1F7A3A]" /> View Profile
                          </button>
                          <button className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-gray-600 hover:bg-gray-50 hover:text-[#111827] rounded-xl transition-colors text-left uppercase tracking-wider">
                            <Briefcase size={14} className="text-[#F59E0B]" /> View Bookings
                          </button>
                          <button className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-gray-600 hover:bg-gray-50 hover:text-[#111827] rounded-xl transition-colors text-left uppercase tracking-wider">
                            <Edit size={14} className="text-gray-400" /> Edit Details
                          </button>
                          <div className="border-t border-gray-50 my-1 mx-2" />
                          <button className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left uppercase tracking-wider">
                            <Trash2 size={14} /> Delete Profile
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="mt-auto px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Showing <span className="text-[#111827]">1-5</span> of <span className="text-[#111827]">1,245</span> entries
          </p>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 bg-white hover:bg-gray-50 hover:text-[#111827] transition-colors disabled:opacity-50">
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1">
              {['1', '2', '3', '...', '125'].map((p, i) => (
                <button
                  key={i}
                  className={`min-w-8 h-8 flex items-center justify-center rounded-lg text-[12px] font-black transition-colors ${
                    p === '1' 
                      ? 'bg-[#1F7A3A] text-white shadow-md shadow-green-900/10' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-[#111827]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 bg-white hover:bg-gray-50 hover:text-[#111827] transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </FrontOfficeLayout>
  );
};

export default GuestsPage;
