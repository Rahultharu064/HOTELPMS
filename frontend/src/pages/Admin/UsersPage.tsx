import React, { useState } from "react";
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MoreVertical, 
  Search, 
  Filter, 
  CheckCircle2,
  XCircle,
  Trash2,
  Edit2,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { toast } from "react-hot-toast";

interface UserNode {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Receptionist' | 'Housekeeping' | 'Manager';
  status: 'Active' | 'Inactive' | 'Suspended';
  lastLogin: string;
  avatar?: string;
  phone: string;
}

const dummyUsers: UserNode[] = [
  { 
    id: "USR-001", 
    name: "Rahul Tharu", 
    email: "rahul@namunahotel.com", 
    role: "Super Admin", 
    status: "Active", 
    lastLogin: "2 mins ago", 
    phone: "+977 9800000000" 
  },
  { 
    id: "USR-002", 
    name: "Sita Sharma", 
    email: "sita@namunahotel.com", 
    role: "Receptionist", 
    status: "Active", 
    lastLogin: "1 hr ago", 
    phone: "+977 9811111111" 
  },
  { 
    id: "USR-003", 
    name: "Ram Bahadur", 
    email: "ram@namunahotel.com", 
    role: "Housekeeping", 
    status: "Inactive", 
    lastLogin: "Yesterday", 
    phone: "+977 9822222222" 
  },
  { 
    id: "USR-004", 
    name: "Gita Thapa", 
    email: "gita@namunahotel.com", 
    role: "Manager", 
    status: "Active", 
    lastLogin: "Just now", 
    phone: "+977 9833333333" 
  },
];

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserNode[]>(dummyUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserNode | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Receptionist' as any,
    phone: '',
    status: 'Active' as any
  });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (user?: UserNode) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'Receptionist',
        phone: '',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        toast.success(`${u.name} is now ${newStatus}`, {
          icon: newStatus === 'Active' ? '🟢' : '🔴'
        });
        return { ...u, status: newStatus as any };
      }
      return u;
    }));
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success("User deleted successfully");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      // Update Logic
      setUsers(prev => prev.map(u => 
        u.id === editingUser.id ? { ...u, ...formData } : u
      ));
      toast.success("User details updated");
    } else {
      // Create Logic
      const newUser: UserNode = {
        id: `USR-00${users.length + 1}`,
        ...formData,
        lastLogin: "Never"
      };
      setUsers(prev => [newUser, ...prev]);
      toast.success("New user added successfully");
    }
    
    setIsModalOpen(false);
  };

  const stats = [
    { label: "Total Users", value: users.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Users", value: users.filter(u => u.status === 'Active').length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "System Admins", value: users.filter(u => u.role.includes('Admin')).length, icon: ShieldCheck, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Inactive Users", value: users.filter(u => u.status !== 'Active').length, icon: XCircle, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight uppercase flex items-center gap-4">
            <div className="w-2 h-8 bg-[#14532D] rounded-full" />
            User Management
          </h1>
          <p className="text-neutral-text-secondary text-[11px] font-black uppercase tracking-[0.2em] mt-2 ml-6">Manage staff members and their access levels</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => handleOpenModal()}
            className="bg-[#14532D] hover:bg-[#111827] text-white px-8 h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-[#14532D]/10 flex items-center gap-3"
          >
            <UserPlus size={18} strokeWidth={3} /> Add New User
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
              placeholder="Query by name, role or email..." 
              className="w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[#14532D]/5 transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="h-12 px-6 rounded-2xl bg-gray-50 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[#111827] flex items-center gap-2">
              <Filter size={16} /> Filters
            </Button>
            <Button variant="ghost" className="h-12 px-6 rounded-2xl bg-gray-50 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[#111827] flex items-center gap-2">
              <Download size={16} /> Export Data
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">User Details</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Role</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {filteredUsers.map((user, i) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
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
                          user.role.includes('Admin') ? 'bg-[#14532D]/10 text-[#14532D]' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <ShieldCheck size={10} /> {user.role}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 mt-2 ml-1 uppercase tracking-widest">ID: {user.id}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                          <span className="text-[12px] font-bold text-[#111827]">{user.status}</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Last Auth: {user.lastLogin}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(user)}
                          className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:bg-[#111827] hover:text-white transition-all flex items-center justify-center"
                        >
                          <Edit2 size={16} strokeWidth={2.5} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"
                        >
                          <Trash2 size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center gap-6 opacity-30">
            <Users size={64} strokeWidth={1} />
            <p className="text-[11px] font-black uppercase tracking-[0.3em]">No users found</p>
          </div>
        )}
      </Card>

      {/* Modal for adding/editing users */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Edit User Details" : "Add New User"}
      >
        <form onSubmit={handleSubmit} className="p-4 space-y-8">
           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Full Legal Name</label>
                 <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#14532D]/20 transition-all" 
                    placeholder="Enter full name" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email Address</label>
                 <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#14532D]/20 transition-all" 
                    placeholder="name@namunahotel.com" 
                 />
              </div>
           </div>
           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">User Role</label>
                 <select 
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#14532D]/20 transition-all appearance-none"
                 >
                    <option value="Receptionist">Receptionist</option>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Contact Number</label>
                 <input 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#14532D]/20 transition-all" 
                    placeholder="+977 98XXXXXXXX" 
                 />
              </div>
           </div>
           <div className="pt-6 flex gap-4">
              <Button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-14 rounded-2xl bg-gray-50 text-gray-400 text-[11px] font-black uppercase tracking-widest hover:bg-gray-100">Cancel</Button>
              <Button type="submit" className="flex-[2] h-14 rounded-2xl bg-[#14532D] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#111827] shadow-xl shadow-[#14532D]/20">
                {editingUser ? "Update User" : "Add User"}
              </Button>
           </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUsersPage;
