import React, { useState, useEffect } from 'react';
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
  Users,
  Loader2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { guestService, type Guest } from '../../services/guestService';
import { GuestProfileModal } from '../../components/frontoffice/GuestProfileModal';
import { toast } from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const typeStyles: Record<string, string> = {
  'VIP':       'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  'Corporate': 'bg-[#1F7A3A]/10 text-[#1F7A3A] border-[#1F7A3A]/20',
  'Regular':   'bg-gray-100 text-gray-500 border-gray-200',
};

const tabs = ['All Guests', 'VIP', 'Corporate', 'Regular Guests'];

const GuestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All Guests');
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const res = await guestService.getAllGuests({ 
        page: pagination.page, 
        search: searchQuery 
      });
      if (res.success) {
        setGuests(res.data.guests);
        setPagination(prev => ({ 
          ...prev, 
          total: res.data.pagination.total,
          totalPages: res.data.pagination.totalPages
        }));
      }
    } catch (error) {
      toast.error('Failed to synchronize guest records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchGuests, searchQuery ? 500 : 0);
    return () => clearTimeout(timer);
  }, [searchQuery, pagination.page]);

  const handleViewProfile = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F9FAFB] font-sans selection:bg-[#1F7A3A]/10 selection:text-[#1F7A3A]">
      <div className="flex-1 flex flex-col min-w-0 p-4 lg:p-8">
        {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-[28px] font-extrabold text-[#111827] leading-tight flex items-center gap-2 mb-1.5">
            <Users size={24} className="text-[#1F7A3A]" />
            Guest Management
          </h1>
          <p className="text-sm font-medium text-gray-500">View and manage guest profiles and their information</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-11 px-5 flex items-center gap-2 text-[13px] font-bold text-white bg-gradient-to-r from-[#1F7A3A] to-[#14532D] rounded-xl shadow-lg shadow-green-900/20 hover:shadow-xl hover:scale-105 transition-all cursor-pointer shrink-0">
            <Plus size={18} />
            Add Guest
          </button>
          <button className="h-11 px-4 flex items-center gap-2 text-[13px] font-bold text-gray-600 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-gray-50 transition-colors cursor-pointer shrink-0">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* ── Filters & Tabs ── */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative w-full lg:w-96">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 focus:border-[#1F7A3A] focus:ring-2 focus:ring-[#1F7A3A]/20 outline-none transition-all text-[14px] font-medium"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="h-11 px-4 flex items-center gap-2 text-[13px] font-bold text-gray-600 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-gray-50 transition-colors cursor-pointer shrink-0">
              <Filter size={16} />
              More Filters
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-[13px] font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'border-[#1F7A3A] text-[#1F7A3A]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Data Table ── */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="w-12 px-6 py-6">
                  <Input type="checkbox" className="min-w-4 h-4 rounded-[4px] border-gray-300 text-[#1F7A3A] focus:ring-[#1F7A3A]" />
                </th>
                {['Guest Details', 'Guest Type', 'Contact Info', 'Total Stays', 'Total Spent', 'Verification', ''].map((h, i) => (
                  <th key={i} className="px-4 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-[#1F7A3A]" size={32} />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mt-4">Loading Guest Records...</p>
                  </td>
                </tr>
              ) : guests.length > 0 ? (
                guests.map((g) => {
                  const isVip = (g.totalBookings || 0) > 5;
                  const tier = isVip ? 'VIP' : 'Regular';
                  
                  return (
                    <tr key={g.id} className="group hover:bg-gray-50/40 transition-colors bg-white">
                      <td className="px-6 py-5">
                        <Input type="checkbox" className="w-4 h-4 rounded-[4px] border-gray-200 text-[#1F7A3A] focus:ring-[#1F7A3A] cursor-pointer" />
                      </td>

                      {/* Guest Profile */}
                      <td className="px-4 py-5 min-w-[220px]">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-black shrink-0 transition-all duration-300 ${isVip ? 'bg-gradient-to-br from-[#F59E0B] to-orange-500 text-white shadow-md' : 'bg-gray-100 text-[#111827] group-hover:bg-[#1F7A3A] group-hover:text-white'}`}>
                            {g.firstName[0]}{g.lastName[0]}
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-[#111827] group-hover:text-[#1F7A3A] transition-colors">{g.firstName} {g.lastName}</p>
                            <p className="text-[10px] font-black text-gray-400 mt-0.5 tracking-widest uppercase">ID: {g.id.toString().padStart(4, '0')}</p>
                          </div>
                        </div>
                      </td>

                      {/* Tier/Status */}
                      <td className="px-4 py-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-[8px] border text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${typeStyles[tier]}`}>
                          {tier}
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
                           {g.totalBookings || 0}
                         </span>
                      </td>

                      {/* Total Spent */}
                      <td className="px-4 py-5">
                        <span className="text-[14px] font-black text-[#1F7A3A]">Rs.{(Number(g.totalSpent) || 0).toLocaleString()}</span>
                      </td>

                      {/* Verification */}
                      <td className="px-4 py-5">
                        {g.idProofImage ? (
                          <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                            <ShieldCheck size={14} strokeWidth={3} /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[10px] font-black text-amber-500 uppercase tracking-widest">
                             <AlertCircle size={14} strokeWidth={3} /> Not Verified
                          </span>
                        )}
                      </td>

                      {/* Actions (Dropdown Menu) */}
                      <td className="px-6 py-5 text-right relative">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            onClick={() => handleViewProfile(g)}
                            title="Quick View Profile"
                            className="p-2 rounded-xl text-gray-400 hover:text-[#1F7A3A] hover:bg-[#1F7A3A]/5 transition-all focus:outline-none"
                          >
                            <Eye size={18} />
                          </Button>
                          <Button
                            onClick={() => setActiveMenu(activeMenu === g.id ? null : g.id)}
                            className="p-2 rounded-xl text-gray-400 hover:text-[#111827] bg-white border border-transparent hover:border-gray-100 hover:shadow-sm transition-all focus:outline-none"
                          >
                            <MoreVertical size={18} />
                          </Button>
                        </div>

                        {/* Action Dropdown Menu */}
                        {activeMenu === g.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                            <div className="absolute right-8 top-12 w-48 bg-white rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] border border-gray-100 p-2 z-20 animate-fade-slide-up origin-top-right">
                              <Button 
                                onClick={() => handleViewProfile(g)}
                                variant="outline"  
                              >
                                <Eye size={14} className="text-[#1F7A3A]" /> View Profile
                              </Button>
                              <Button variant="outline" >
                                <Briefcase size={14} className="text-[#F59E0B]" /> View Bookings
                              </Button>
                              <Button variant="outline" >
                                <Edit size={14} className="text-gray-400" /> Edit Guest
                              </Button>
                              <div className="border-t border-gray-50 my-1 mx-2" />
                              <Button variant="destructive" >
                                <Trash2 size={14} /> Delete Guest
                              </Button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-20 text-center text-gray-400">
                    No guests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ── */}
      <div className="mt-auto px-6 py-6 border-t border-gray-50 flex items-center justify-between bg-gray-50/30 rounded-b-[32px]">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          Showing <span className="text-[#111827]">{(pagination.page - 1) * 10 + 1}-{Math.min(pagination.page * 10, pagination.total)}</span> of <span className="text-[#111827]">{pagination.total}</span> guests
        </p>

        <div className="flex items-center gap-2">
          <Button 
            disabled={pagination.page === 1}
            onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
            variant="outline"
          >
            <ChevronLeft size={16} />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                onClick={() => setPagination(prev => ({ ...prev, page: p }))}
                className={`min-w-8 h-8 flex items-center justify-center rounded-lg text-[12px] font-black transition-colors ${
                  pagination.page === p
                    ? 'bg-[#1F7A3A] text-white shadow-md shadow-green-900/10'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-[#111827]'
                }`}
              >
                {p}
              </Button>
            ))}
          </div>
          <Button 
            disabled={pagination.page === pagination.totalPages}
            onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
            variant="outline"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
        </div>
      </div>

      <GuestProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        guest={selectedGuest} 
      />
    </div>
  );
};

export default GuestsPage;