import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { api } from '../../../services/api';
import { toast } from 'react-hot-toast';

export const StaffResetPasswordPage: React.FC = () => {
  const { admin, updateAdminUser, adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    if (newPassword.length < 8) {
      return toast.error("New password must be at least 8 characters.");
    }

    setLoading(true);
    try {
      const response = await api.post('/admin/auth/change-password', {
        currentPassword,
        newPassword
      });

      if (response.data.success) {
        toast.success("Security credentials updated successfully.");
        // Update local context so mustChangePassword is false
        if (admin) {
          updateAdminUser({ ...admin, mustChangePassword: false });
        }
        // Redirect to their respective dashboard
        const role = admin?.role;
        if (role === 'front_office') navigate('/frontoffice');
        else if (role === 'housekeeping') navigate('/housekeeping');
        else navigate('/admin');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update security credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-[22px] bg-[#1F7A3A] text-white shadow-xl shadow-green-900/20 mb-6">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight mb-2">Update Credentials</h1>
          <p className="text-sm font-medium text-gray-500">For security reasons, please choose a private password for your workstation.</p>
        </div>

        <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Temporary Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPass ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full h-14 pl-12 pr-12 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-[#1F7A3A] focus:ring-4 focus:ring-[#1F7A3A]/5 transition-all text-sm font-bold"
                  placeholder="Enter the password provided by Admin"
                />
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">New Preferred Password</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPass ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full h-14 pl-12 pr-12 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-[#1F7A3A] focus:ring-4 focus:ring-[#1F7A3A]/5 transition-all text-sm font-bold"
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#111827] transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative">
                <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full h-14 pl-12 pr-12 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-[#1F7A3A] focus:ring-4 focus:ring-[#1F7A3A]/5 transition-all text-sm font-bold"
                  placeholder="Repeat your new password"
                />
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-3">
              <AlertCircle size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11px] font-bold text-emerald-800 leading-relaxed uppercase tracking-wide">
                Your new password should be unique and not shared with other staff members.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-[#1F7A3A] to-[#14532D] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>Secure Workstation <ArrowRight size={18} /></>
              )}
            </button>
            
            <button
              type="button"
              onClick={adminLogout}
              className="w-full text-center text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors"
            >
              Cancel and Logout
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose">
          Secure Terminal v4.2.0 • Antigravity Security Systems<br/>
          Unauthorized Access is Strictly Prohibited
        </p>
      </motion.div>
    </div>
  );
};
