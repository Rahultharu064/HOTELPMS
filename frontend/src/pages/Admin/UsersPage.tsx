import React, { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2,
  XCircle,
  Edit2,
  Download,
  Copy,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { toast } from "react-hot-toast";
import { staffService, type StaffMember } from "../../services/staffService";
import { Select } from "../../components/ui/Select";
import { AdminTableSkeleton } from "../../components/ui/skeletons/AdminSkeletons";

const AdminUsersPage: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdStaffInfo, setCreatedStaffInfo] = useState<{name: string, email: string, temporaryPassword: string} | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'front_office',
    phoneNumber: '',
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: 'front_office',
    phoneNumber: '',
  });

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await staffService.getAllStaff();
      if (res.success) {
        setStaff(res.data);
      }
    } catch (error) {
      toast.error("Failed to load staff records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const res = await staffService.toggleStatus(id, !currentStatus);
      if (res.success) {
        toast.success(res.message);
        fetchStaff();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleEditClick = (user: StaffMember) => {
    setSelectedStaff(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber || '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;
    
    try {
      const res = await staffService.updateStaff(selectedStaff.id, editFormData);
      if (res.success) {
        toast.success("Personnel record updated successfully");
        setIsEditModalOpen(false);
        fetchStaff();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update staff account");
    }
  };

  const handleResetPassword = async () => {
    if (!selectedStaff) return;
    if (!window.confirm(`Are you sure you want to reset the password for ${selectedStaff.name}?`)) return;

    try {
      const res = await staffService.resetPassword(selectedStaff.id);
      if (res.success) {
        setCreatedStaffInfo({
          name: selectedStaff.name,
          email: selectedStaff.email,
          temporaryPassword: res.data.temporaryPassword
        });
        setIsEditModalOpen(false);
        setIsSuccessModalOpen(true);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await staffService.createStaff(formData);
      if (res.success) {
        setCreatedStaffInfo({
          name: res.data.staff.name,
          email: res.data.staff.email,
          temporaryPassword: res.data.temporaryPassword
        });
        setIsModalOpen(false);
        setIsSuccessModalOpen(true);
        fetchStaff();
        setFormData({ name: '', email: '', role: 'front_office', phoneNumber: '' });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create staff account");
    }
  };

  const filteredStaff = staff.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "Total Personnel", value: staff.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "On Duty", value: staff.filter(u => u.isActive).length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Front Office", value: staff.filter(u => u.role === 'front_office').length, icon: ShieldCheck, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Housekeeping", value: staff.filter(u => u.role === 'housekeeping').length, icon: XCircle, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight uppercase flex items-center gap-4">
            <div className="w-2 h-8 bg-[#14532D] rounded-full" />
            Personnel Roster
          </h1>
          <p className="text-neutral-text-secondary text-[11px] font-black uppercase tracking-[0.2em] mt-2 ml-6">Administer staff identities and access privileges</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#14532D] hover:bg-[#111827] text-white px-8 h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-green-900/20 flex items-center gap-3"
          >
            <UserPlus size={18} strokeWidth={3} /> Register Personnel
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div 
            whileHover={{ y: -5 }}
            key={i} 
            className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center`}>
                <s.icon size={24} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{s.label}</p>
                <p className="text-2xl font-black text-[#111827]">{s.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Card */}
      <Card className="rounded-[40px] border-none shadow-soft overflow-hidden bg-white">
        {/* Toolbar */}
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative w-full md:w-[400px] group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#14532D] transition-colors" size={18} />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Query by identity, role or mail..." 
              className="w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[#14532D]/5 transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="h-12 px-6 rounded-2xl bg-gray-50 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[#111827] flex items-center gap-2">
              <Filter size={16} /> Filters
            </Button>
            <Button variant="ghost" className="h-12 px-6 rounded-2xl bg-gray-50 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[#111827] flex items-center gap-2">
              <Download size={16} /> Export
            </Button>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <AdminTableSkeleton rows={6} cols={4} />
        ) : (
        <>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Identity Details</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Designation</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStaff.map((user, i) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={user.id} 
                    className="hover:bg-gray-50/50 transition-all group"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#14532D] to-[#111827] flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-transform">
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-[14px] text-[#111827] tracking-tight">{user.name}</span>
                          <span className="text-[11px] font-bold text-gray-400">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest w-fit ${
                          user.role.includes('admin') ? 'bg-[#14532D]/10 text-[#14532D]' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <ShieldCheck size={10} /> {user.role.replace('_', ' ')}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 mt-2 ml-1 uppercase tracking-widest">ID: {user.id.toString().padStart(4, '0')}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                          <span className="text-[12px] font-bold text-[#111827]">{user.isActive ? 'Active' : 'Deactivated'}</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Last Access: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          onClick={() => handleToggleStatus(user.id, user.isActive)}
                          title={user.isActive ? "Deactivate Account" : "Activate Account"}
                          className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center ${user.isActive ? 'bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white' : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                        >
                          {user.isActive ? <XCircle size={16} strokeWidth={2.5} /> : <CheckCircle2 size={16} strokeWidth={2.5} />}
                        </Button>
                        <Button 
                          onClick={() => handleEditClick(user)}
                          className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:bg-[#111827] hover:text-white transition-all flex items-center justify-center"
                        >
                          <Edit2 size={16} strokeWidth={2.5} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {filteredStaff.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center gap-6 opacity-30">
            <Users size={64} strokeWidth={1} />
            <p className="text-[11px] font-black uppercase tracking-[0.3em]">No personnel records found</p>
          </div>
        )}
        </>
        )}
      </Card>

      {/* Modal for adding users */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Register Personnel"
      >
        <form onSubmit={handleSubmit} className="p-4 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Full Legal Name</label>
                 <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#14532D]/20 transition-all font-bold" 
                    placeholder="Enter full name" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Official Email</label>
                 <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#14532D]/20 transition-all font-bold" 
                    placeholder="staff@hotelpms.com" 
                 />
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Workstation Role</label>
                 <Select 
                    value={formData.role}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#14532D]/20 transition-all appearance-none font-bold text-sm"
                 >
                    <option value="front_office">Front Office Staff</option>
                    <option value="housekeeping">Housekeeping Staff</option>
                    <option value="manager">Service Manager</option>
                    <option value="admin">System Administrator</option>
                 </Select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Contact Signal</label>
                 <input 
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#14532D]/20 transition-all font-bold" 
                    placeholder="+977 98XXXXXXXX" 
                 />
              </div>
           </div>
           <div className="pt-6 flex gap-4">
              <Button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-14 rounded-2xl bg-gray-50 text-gray-400 text-[11px] font-black uppercase tracking-widest hover:bg-gray-100">Cancel</Button>
              <Button type="submit" className="flex-[2] h-14 rounded-2xl bg-[#14532D] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#111827] shadow-xl shadow-green-900/20 transition-all">
                Authorize Personnel
              </Button>
           </div>
        </form>
      </Modal>

      {/* Modal for editing users */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title="Update Personnel Details"
      >
        <form onSubmit={handleEditSubmit} className="p-4 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Full Legal Name</label>
                 <input 
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#14532D]/20 transition-all font-bold" 
                    placeholder="Enter full name" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Official Email</label>
                 <input 
                    required
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#14532D]/20 transition-all font-bold" 
                    placeholder="staff@hotelpms.com" 
                 />
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Workstation Role</label>
                 <Select 
                    value={editFormData.role}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditFormData({ ...editFormData, role: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#14532D]/20 transition-all appearance-none font-bold text-sm"
                 >
                    <option value="front_office">Front Office Staff</option>
                    <option value="housekeeping">Housekeeping Staff</option>
                    <option value="manager">Service Manager</option>
                    <option value="admin">System Administrator</option>
                 </Select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Contact Signal</label>
                 <input 
                    required
                    value={editFormData.phoneNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#14532D]/20 transition-all font-bold" 
                    placeholder="+977 98XXXXXXXX" 
                 />
              </div>
           </div>

           <div className="p-6 bg-red-50 rounded-2xl border border-red-100 flex flex-col gap-4">
              <div className="flex gap-3">
                 <AlertTriangle size={18} className="text-red-600 shrink-0 mt-0.5" />
                 <p className="text-[10px] font-bold text-red-800 leading-relaxed uppercase tracking-wide">
                    Critical Operation: Resetting the password will generate a new temporary credential and force the user to update it upon login.
                 </p>
              </div>
              <Button 
                type="button" 
                onClick={handleResetPassword}
                className="w-full h-12 bg-white text-red-600 border border-red-100 hover:bg-red-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Reset Workstation Password
              </Button>
           </div>

           <div className="pt-6 flex gap-4">
              <Button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 h-14 rounded-2xl bg-gray-50 text-gray-400 text-[11px] font-black uppercase tracking-widest hover:bg-gray-100">Discard</Button>
              <Button type="submit" className="flex-[2] h-14 rounded-2xl bg-[#14532D] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#111827] shadow-xl shadow-green-900/20 transition-all">
                Save Changes
              </Button>
           </div>
        </form>
      </Modal>

      {/* Success Modal with Temporary Password */}
      <Modal 
        isOpen={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)}
        title="Account Authorized"
      >
        <div className="p-8 space-y-8 text-center">
           <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[28px] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={40} strokeWidth={2.5} />
           </div>
           
           <div>
              <h3 className="text-xl font-black text-[#111827] tracking-tight">{createdStaffInfo?.name} authorized successfully!</h3>
              <p className="text-xs font-bold text-gray-400 mt-2">A temporary security credential has been generated.</p>
           </div>

           <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 relative group">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Temporary Workstation Password</p>
              <div className="flex items-center justify-center gap-4">
                 <span className="text-3xl font-black text-[#14532D] tracking-widest font-mono select-all">
                   {createdStaffInfo?.temporaryPassword}
                 </span>
                 <Button 
                      onClick={() => copyToClipboard(createdStaffInfo?.temporaryPassword || '')}
                    className="p-3 bg-white text-[#14532D] rounded-xl shadow-sm hover:scale-110 transition-transform"
                 >
                   <Copy size={20} />
                 </Button>
              </div>
           </div>

           <div className="flex items-start gap-4 p-6 bg-amber-50 rounded-2xl border border-amber-100 text-left">
              <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold text-amber-800 leading-relaxed uppercase tracking-wide">
                IMPORTANT: Give this password to the staff member. They will be required to change it upon their first login for security purposes. This password will not be shown again.
              </p>
           </div>

           <Button 
             onClick={() => setIsSuccessModalOpen(false)}
             className="w-full h-14 bg-[#111827] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-gray-900/20"
           >
             Continue to Roster
           </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsersPage;
