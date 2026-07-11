import { useState, useRef } from "react";
import { Search, User, Camera, Loader2, Moon, Bell, LogOut as BoxArrowRight } from "lucide-react";
import { MobileMenuButton } from "./Sidebar";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { api, getImageUrl } from "../../../services/api";
import { toast } from "react-hot-toast";

import { Input } from "../../ui/Input";

interface HeaderProps {
  onMobileMenuClick: () => void;
}

export function Header({ onMobileMenuClick }: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { admin, adminLogout, updateAdminUser } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate breadcrumbs
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0) return [{ label: 'Home', path: '/admin' }];
    
    const breadcrumbs = [{ label: 'Home', path: '/admin' }];
    let currentPath = '';
    
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ label, path: currentPath });
    });
    
    return breadcrumbs;
  };

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

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-[40] transition-all duration-300 px-6 h-14 flex items-center justify-between bg-white border-b border-neutral-border/30 shadow-sm">
      <MobileMenuButton onClick={onMobileMenuClick} />
      
      <Input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleAvatarUpload}
      />

      {/* Left Section - Breadcrumbs */}
      <div className="flex items-center gap-2 ml-4">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.path} className="flex items-center">
            {index > 0 && <span className="text-neutral-text-secondary text-xs mx-1">/</span>}
            <Link 
              to={crumb.path}
              className={`text-xs font-medium ${
                index === breadcrumbs.length - 1 
                  ? "text-primary-dark font-bold" 
                  : "text-neutral-text-secondary hover:text-primary-dark"
              }`}
            >
              {crumb.label}
            </Link>
          </div>
        ))}
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-xs mx-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-text-secondary w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-light/50 border border-neutral-border/30 rounded-lg text-xs font-medium text-primary-dark placeholder:text-neutral-text-secondary outline-none focus:border-[#14532D]/50 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Section - Icons, Profile */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Dark Mode Toggle */}
        <button className="w-7 h-7 rounded-lg border border-neutral-border/30 flex items-center justify-center text-neutral-text-secondary hover:text-primary-dark hover:border-[#14532D]/30 transition-all">
          <Moon size={14} />
        </button>

        {/* Notifications */}
        <button className="w-7 h-7 rounded-lg border border-neutral-border/30 flex items-center justify-center text-neutral-text-secondary hover:text-primary-dark hover:border-[#14532D]/30 transition-all relative">
          <Bell size={14} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#F59E0B] rounded-full" />
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg border border-neutral-border/30 hover:border-[#14532D]/30 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-[#14532D]/10 flex items-center justify-center overflow-hidden">
              {uploading ? (
                <Loader2 size={12} className="animate-spin text-[#14532D]" />
              ) : admin?.avatar ? (
                <img 
                  src={getImageUrl(admin.avatar)} 
                  alt={admin.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={14} className="text-[#14532D]" />
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[11px] font-bold text-primary-dark">{admin?.name || 'Admin'}</p>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-neutral-border/30 overflow-hidden z-[60]">
              <div className="p-3 border-b border-neutral-border/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#14532D]/10 flex items-center justify-center">
                    {admin?.avatar ? (
                      <img 
                        src={getImageUrl(admin.avatar)} 
                        alt={admin.name} 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User size={18} className="text-[#14532D]" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary-dark">{admin?.name || 'Administrator'}</p>
                    <p className="text-[10px] text-neutral-text-secondary">{admin?.email || 'admin@itahari-namuna.edu.np'}</p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-text-secondary hover:text-primary-dark hover:bg-neutral-light/50 rounded-lg transition-all"
                >
                  <Camera size={12} />
                  Change Avatar
                </button>
                <div className="h-px bg-neutral-border/10 my-2 mx-2" />
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <BoxArrowRight size={12} />
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
