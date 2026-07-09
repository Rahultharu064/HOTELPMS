import React, { useState } from "react";
import { User, Lock, LogOut, Camera, Save, Upload } from "lucide-react";
import { authService } from "../../../services/authService";
import { toast } from "react-hot-toast";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { useAuth } from "../../../context/AuthContext";
import { getImageUrl } from "../../../services/api";

interface SettingsLayoutProps {
  userRole: "admin" | "frontoffice" | "housekeeping";
  onLogout?: () => void;
}

export function SettingsLayout({ userRole, onLogout }: SettingsLayoutProps) {
  const { admin, updateAdminUser, adminLogout } = useAdminAuth();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "session">("profile");

  // Get user data based on role
  const currentUser = userRole === "admin" ? admin : user;
  
  // Profile state
  const getFullName = () => {
    if (userRole === "admin" && admin) {
      return admin.name || "";
    } else if (user) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    }
    return "";
  };
  
  const [profileData, setProfileData] = useState({
    fullName: getFullName(),
    email: currentUser?.email || "",
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Session info
  const [sessionStart] = useState(new Date().toLocaleString());

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const updateMethod = userRole === "admin" ? authService.adminUpdateProfile : authService.updateProfile;
      const response = await updateMethod({
        name: profileData.fullName,
        email: profileData.email,
      });

      if (response.success) {
        toast.success("Profile updated successfully");
        if (userRole === "admin" && admin) {
          updateAdminUser({ ...admin, name: profileData.fullName, email: profileData.email });
        }
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await authService.resetPassword({
        email: profileData.email,
        otp: passwordData.currentPassword, // Using current password as OTP for this flow
        newPassword: passwordData.newPassword,
      });

      if (response.success) {
        toast.success("Password updated successfully");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(response.message || "Failed to update password");
      }
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      const updateMethod = userRole === "admin" ? authService.adminUpdateProfileImage : authService.updateProfileImage;
      const response = await updateMethod(formData);
      if (response.success) {
        toast.success("Avatar updated successfully");
        if (userRole === "admin" && admin) {
          updateAdminUser({ ...admin, avatar: response.data.avatar });
        }
      } else {
        toast.error(response.message || "Failed to update avatar");
      }
    } catch (error) {
      toast.error("Failed to update avatar");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else if (userRole === "admin" && adminLogout) {
      adminLogout();
      window.location.href = "/admin/login";
    } else if (userRole === "frontoffice") {
      window.location.href = "/frontoffice/login";
    } else {
      window.location.href = "/housekeeping/login";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-primary-dark tracking-tight">Settings</h1>
        <p className="text-[11px] font-bold text-neutral-text-secondary uppercase tracking-[0.2em] mt-1">
          Manage your account preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "password", label: "Change password", icon: Lock },
            { id: "session", label: "Session", icon: LogOut },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                activeTab === item.id
                  ? "bg-primary-green text-white shadow-lg shadow-primary-green/20"
                  : "text-neutral-text-secondary hover:text-primary-dark hover:bg-neutral-light/50"
              }`}
            >
              <item.icon size={18} strokeWidth={2} />
              <span className="text-[12px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* Profile Section */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl border border-neutral-border/30 shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-black text-primary-dark tracking-tight">Profile</h2>
              
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-green/20">
                    {admin?.avatar ? (
                      <img src={getImageUrl(admin.avatar)} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary-green/10 flex items-center justify-center">
                        <User size={32} className="text-primary-green" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-green rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-colors shadow-lg">
                    <Camera size={14} className="text-white" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                <div>
                  <button className="px-4 py-2 bg-primary-green/10 text-primary-green text-[11px] font-bold uppercase tracking-wider rounded-lg hover:bg-primary-green hover:text-white transition-all flex items-center gap-2">
                    <Upload size={14} />
                    Change avatar
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-text-secondary mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-light/50 border border-neutral-border/30 rounded-xl text-[13px] font-medium text-primary-dark outline-none focus:border-primary-green/50 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-text-secondary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-light/50 border border-neutral-border/30 rounded-xl text-[13px] font-medium text-primary-dark outline-none focus:border-primary-green/50 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleProfileUpdate}
                disabled={loading}
                className="w-full py-3 bg-primary-green text-white rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-primary-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {loading ? "Saving..." : "Save changes"}
              </button>
            </div>
          )}

          {/* Password Section */}
          {activeTab === "password" && (
            <div className="bg-white rounded-2xl border border-neutral-border/30 shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-black text-primary-dark tracking-tight">Change password</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-text-secondary mb-2">
                    Current password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-light/50 border border-neutral-border/30 rounded-xl text-[13px] font-medium text-primary-dark outline-none focus:border-primary-green/50 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-text-secondary mb-2">
                    New password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-light/50 border border-neutral-border/30 rounded-xl text-[13px] font-medium text-primary-dark outline-none focus:border-primary-green/50 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-text-secondary mb-2">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-light/50 border border-neutral-border/30 rounded-xl text-[13px] font-medium text-primary-dark outline-none focus:border-primary-green/50 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handlePasswordUpdate}
                disabled={loading}
                className="w-full py-3 bg-primary-green text-white rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-primary-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {loading ? "Updating..." : "Update password"}
              </button>
            </div>
          )}

          {/* Session Section */}
          {activeTab === "session" && (
            <div className="bg-white rounded-2xl border border-neutral-border/30 shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-black text-primary-dark tracking-tight">Session</h2>
              
              <div className="p-4 bg-neutral-light/50 rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-text-secondary">
                  Active since
                </p>
                <p className="text-[13px] font-medium text-primary-dark mt-1">{sessionStart}</p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-3 bg-red-500 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-red-600 transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
