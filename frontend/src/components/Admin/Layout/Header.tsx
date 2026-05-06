import { useState, useRef } from "react";
import { Search, ChevronDown, LogOut, User, Zap, Camera, Loader2 } from "lucide-react";
import { MobileMenuButton } from "./Sidebar";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { useNavigate, Link } from "react-router-dom";
import { api, getImageUrl } from "../../../services/api";
import { toast } from "react-hot-toast";

import { NotificationBell } from "../../common/NotificationBell";
import { Input } from "../../ui/Input";

interface HeaderProps {
  title: string;
  onMobileMenuClick: () => void;
}

export function Header({ title, onMobileMenuClick }: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { admin, adminLogout, updateAdminUser } = useAdminAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setUploading(true);
    try {
      const response = await api.post<{ success: boolean, data: { avatar: string } }>('/admin/auth/avatar', formData);
      if (response.success && admin) {
        updateAdminUser({ ...admin, avatar: response.data.avatar });
        toast.success("Identity image updated");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <header className="sticky top-0 z-[40] transition-all duration-300 px-10 h-24 flex items-center gap-10 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <MobileMenuButton onClick={onMobileMenuClick} />
      
      <Input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleAvatarUpload}
      />

      {/* Title & Page Status */}
      <div className="flex flex-col h-full justify-center">
        <div className="flex items-center gap-2">
          <h2 className="font-black text-xl text-[#111827] tracking-tight">{title}</h2>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1F7A3A]/5 text-[#1F7A3A] text-[10px] font-black uppercase tracking-widest border border-[#1F7A3A]/10">
            <div className="w-1 h-1 rounded-full bg-[#1F7A3A] animate-pulse" />
            Superuser Mode
          </div>
        </div>
        <p className="hidden md:block text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Administrative Global Control</p>
      </div>

      {/* Central Search with premium field */}
      <div className="flex-1 max-w-xl hidden lg:block">
        <div className="group relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#1F7A3A]" strokeWidth={2.5} />
          </div>
          <input
            type="text"
            placeholder="Search users, audit logs, system settings..."
            className="block w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#1F7A3A]/5 focus:border-[#1F7A3A]/20 focus:bg-white transition-all duration-300"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-lg border border-gray-200 bg-white text-[10px] font-black tracking-widest text-gray-400 uppercase">
              ⌘ K
            </kbd>
          </div>
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Quick Help / AI Suggestion (Premium Touch) */}
        <button
          className="hidden sm:flex w-10 h-10 items-center justify-center rounded-xl text-gray-400 hover:text-[#1F7A3A] hover:bg-[#1F7A3A]/5 transition-all relative group"
          aria-label="System Health"
          title="View system health"
        >
          <Zap size={18} strokeWidth={2.5} />
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-2xl">
            System Health
          </div>
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* User Profile */}
        <div className="relative ml-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="relative group w-10 h-10 rounded-xl bg-gradient-to-br from-[#1F7A3A] to-[#14532D] flex items-center justify-center text-white text-xs font-black shadow-lg overflow-hidden border-2 border-white"
            >
              {uploading ? (
                <Loader2 size={16} className="animate-spin text-white" />
              ) : admin?.avatar ? (
                <img 
                  src={getImageUrl(admin.avatar)} 
                  alt={admin.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(admin?.name || 'Admin')
              )}
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={14} className="text-white" />
              </div>
            </button>

            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={`flex items-center gap-3 p-1 rounded-2xl transition-all ${
                profileOpen ? "bg-gray-100 shadow-inner" : "hover:bg-gray-50"
              }`}
            >
              <div className="text-left hidden sm:block pr-2">
                <p className="text-[12px] font-black text-[#111827] leading-none">{admin?.name || 'Superuser'}</p>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#F59E0B] mt-1 opacity-80">{admin?.role.replace('_', ' ')}</p>
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform hidden sm:block duration-500 ${profileOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          {profileOpen && (
            <div className="absolute right-0 mt-4 w-64 bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden animate-fade-down z-[60]">
              <div className="p-6 border-b border-gray-50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
                  <User size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#111827]">Root Settings</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Preferences</p>
                </div>
              </div>
              <div className="p-2">
                <Link 
                  to="/admin/users"
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[12px] font-bold text-gray-500 hover:text-[#111827] hover:bg-gray-50 rounded-2xl transition-all"
                  title="Go to User Management"
                >
                  <User size={16} strokeWidth={2.5} />
                  Staff Roster
                </Link>
                <div className="h-px bg-gray-50 my-2 mx-4" />
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[12px] font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                  title="Sign out of system"
                >
                  <LogOut size={16} strokeWidth={2.5} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
