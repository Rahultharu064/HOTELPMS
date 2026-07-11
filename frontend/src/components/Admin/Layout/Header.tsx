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

  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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
    <header className="sticky top-0 z-[40] transition-all duration-300 px-6 h-20 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-neutral-border/30 shadow-sm">
      <MobileMenuButton onClick={onMobileMenuClick} />
      
      <Input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleAvatarUpload}
      />

      {/* Left Section - Breadcrumbs */}
      <div className="flex items-center gap-2">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.path} className="flex items-center">
            {index > 0 && <span className="text-neutral-text-secondary text-sm mx-2">/</span>}
            <Link 
              to={crumb.path}
              className={`text-sm font-medium ${
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

      {/* left-center Section - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-text-secondary w-4 h-4" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-light/50 border border-neutral-border/30 rounded-xl text-sm font-medium text-primary-dark placeholder:text-neutral-text-secondary outline-none focus:border-primary-green/50 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Section - Date, Icons, Profile */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Date */}
        <div className="hidden md:block text-sm font-medium text-neutral-text-secondary">
          {currentDate}
        </div>

        {/* Dark Mode Toggle */}
        <button className="w-10 h-10 rounded-xl border border-neutral-border/30 flex items-center justify-center text-neutral-text-secondary hover:text-primary-dark hover:border-primary-green/30 transition-all">
          <Moon size={18} />
        </button>

        {/* Notifications */}
        <button className="w-10 h-10 rounded-xl border border-neutral-border/30 flex items-center justify-center text-neutral-text-secondary hover:text-primary-dark hover:border-primary-green/30 transition-all relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl border border-neutral-border/30 hover:border-primary-green/30 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-primary-green/10 flex items-center justify-center overflow-hidden">
              {uploading ? (
                <Loader2 size={16} className="animate-spin text-primary-green" />
              ) : admin?.avatar ? (
                <img 
                  src={getImageUrl(admin.avatar)} 
                  alt={admin.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={18} className="text-primary-green" />
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-primary-dark">{admin?.name || 'Administrator'}</p>
              <p className="text-xs text-neutral-text-secondary">{admin?.email || 'admin@itahari-namuna.edu.np'}</p>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-border/30 overflow-hidden z-[60]">
              <div className="p-4 border-b border-neutral-border/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-green/10 flex items-center justify-center">
                    {admin?.avatar ? (
                      <img 
                        src={getImageUrl(admin.avatar)} 
                        alt={admin.name} 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User size={24} className="text-primary-green" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary-dark">{admin?.name || 'Administrator'}</p>
                    <p className="text-xs text-neutral-text-secondary">{admin?.email || 'admin@itahari-namuna.edu.np'}</p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-text-secondary hover:text-primary-dark hover:bg-neutral-light/50 rounded-lg transition-all"
                >
                  <Camera size={16} />
                  Change Avatar
                </button>
                <div className="h-px bg-neutral-border/10 my-2 mx-2" />
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <BoxArrowRight size={16} />
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
