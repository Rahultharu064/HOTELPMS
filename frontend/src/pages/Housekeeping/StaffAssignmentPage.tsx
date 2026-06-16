import React, { useState, useEffect } from "react";
import {
  Users, Search,
  MoreVertical,
  Clock, ShieldCheck,
  Zap, ArrowRight,
  UserPlus
} from "lucide-react";
import { motion } from "framer-motion";
import { housekeepingService } from "../../services/housekeepingService";
import { toast } from "react-hot-toast";
import { Modal } from "../../components/ui/Modal";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { PortalPageSkeleton } from "../../components/ui/skeletons/AdminSkeletons";

const StaffAssignmentPage: React.FC = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    staffId: '',
    name: '',
    role: 'Attendant',
    phone: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [staffRes, roomsRes] = await Promise.all([
        housekeepingService.getStaff(),
        housekeepingService.getRoomStatuses()
      ]);

      if (staffRes.success) setStaff(staffRes.data);
      if (roomsRes.success) setRooms(roomsRes.data);
    } catch (error) {
      toast.error("Failed to load staff roster");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      toast.loading('Adding staff member...', { id: 'add-staff' });
      const res = await housekeepingService.addStaff(formData);
      if (res.success) {
        toast.success('Staff added successfully', { id: 'add-staff' });
        setIsAddModalOpen(false);
        setFormData({ staffId: '', name: '', role: 'Attendant', phone: '' });
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to add staff member', { id: 'add-staff' });
    }
  };

  const filteredStaff = staff.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.staffId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <PortalPageSkeleton variant="table" />;
  }

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight uppercase flex items-center gap-4">
            <div className="w-2 h-8 bg-[#14532D] rounded-full" />
            Staff & Assignments
          </h1>
          <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] mt-2 ml-6">Manage floor personnel and cleaning duty allocations</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-4 bg-[#111827] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#14532D] transition-all flex items-center gap-2 shadow-xl shadow-black/10"
          >
            <UserPlus size={16} /> Add New Staff
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 space-y-10">
          <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" strokeWidth={2.5} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff by name or ID..."
                className="w-full pl-14 pr-4 py-4 bg-gray-50/50 border border-transparent rounded-[24px] text-sm font-medium focus:outline-none focus:border-[#14532D]/20 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredStaff.length > 0 ? filteredStaff.map((s: any) => {
              const staffTasks = rooms.filter(r => r.housekeepingLogs?.[0]?.staffId === s.staffId && r.status === 'cleaning').length;
              return (
                <motion.div
                  whileHover={{ y: -6 }}
                  key={s.id}
                  className="bg-white p-10 rounded-[48px] border border-gray-100 hover:border-[#14532D]/20 shadow-sm hover:shadow-2xl transition-all relative flex flex-col justify-between overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 rounded-[24px] bg-[#111827] text-white flex items-center justify-center text-xl font-black uppercase tracking-widest shadow-xl">
                      {s.name.slice(0, 2)}
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${s.status === 'on_duty' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                      {s.status.replace('_', ' ')}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-[#111827] mb-1">{s.name}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{s.role} • {s.staffId}</p>

                    <div className="flex items-center justify-between p-5 rounded-3xl bg-gray-50 border border-gray-50 transition-all">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Duties</span>
                        <span className="text-2xl font-black text-[#111827] tracking-tighter">{staffTasks} <span className="text-[10px] text-gray-400 uppercase">Rooms</span></span>
                      </div>
                      <Button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#14532D] hover:underline transition-all">
                        Assign <ArrowRight size={14} />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={14} />
                      <p className="text-[9px] font-bold uppercase tracking-widest">Last Update: {new Date(s.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <Button className="text-gray-300 hover:text-[#111827] transition-all">
                      <MoreVertical size={18} />
                    </Button>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="col-span-full p-20 text-center bg-gray-50 rounded-[48px] border border-dashed border-gray-200">
                <Users size={40} className="mx-auto text-gray-300 mb-4" />
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">No staff members found matching "{searchQuery}"</p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-6 text-[#14532D] text-[10px] font-black uppercase tracking-widest hover:underline"
                >
                  Register New Staff Member
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
          <div className="bg-[#111827] rounded-[48px] p-10 text-white relative overflow-hidden group shadow-2xl shadow-black/20">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#14532D] rounded-full blur-[80px] opacity-20" />
            <Zap className="text-[#F59E0B] mb-6" size={32} />
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">Bulk Assignment</h2>
            <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-10">Assign room blocks to available personnel.</p>

            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map(f => (
                <Button key={f} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#F59E0B]/30 transition-all text-center">
                  <p className="text-[11px] font-black uppercase">Floor {f}</p>
                </Button>
              ))}
            </div>

            <button className="w-full mt-10 py-4 bg-[#F59E0B] text-[#111827] rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-2">
              Save Layout <ShieldCheck size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Housekeeping Staff"
      >
        <form onSubmit={handleAddStaff} className="space-y-6 p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Staff ID / Code</label>
              <input
                required
                value={formData.staffId}
                onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                placeholder="e.g. HK-001"
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#14532D]/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Full Name</label>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sunita Karki"
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#14532D]/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Role / Designation</label>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#14532D]/20 transition-all appearance-none"
              >
                <option>Attendant</option>
                <option>Sr. Attendant</option>
                <option>Floor Supervisor</option>
                <option>Team Lead</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Phone Number</label>
              <input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. 9841000000"
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#14532D]/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 py-4 border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-[2] py-4 bg-[#14532D] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#111827] transition-all shadow-xl shadow-[#14532D]/20"
            >
              Confirm Registration
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StaffAssignmentPage;
