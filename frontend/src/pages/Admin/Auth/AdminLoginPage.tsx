import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { toast } from 'react-hot-toast';
import { Lock, Mail, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import { AuthBrandLogo } from '../../../components/ui/AuthBrandLogo';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const submittingRef = useRef(false);

  const { admin, adminLogin, isAdminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdminAuthenticated && admin) {
      const homeMap: Record<string, string> = {
        superadmin: '/admin',
        admin: '/admin',
        manager: '/admin',
        front_office: '/frontoffice',
        housekeeping: '/housekeeping',
      };
      navigate(admin.mustChangePassword ? '/admin/auth/reset-password' : (homeMap[admin.role] || '/admin'));
    }
  }, [isAdminAuthenticated, admin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current || loading) return;

    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    submittingRef.current = true;
    setLoading(true);

    try {
      const response = await api.post<any>('/admin/auth/login', { email, password });
      adminLogin(response.user, response.token);
      toast.success(`Welcome back, ${response.user.name || response.user.firstName || 'Admin'}`);

      const role = response.user.role;
      const target = response.user.mustChangePassword
        ? '/admin/auth/reset-password'
        : (role === 'front_office' ? '/frontoffice' : (role === 'housekeeping' ? '/housekeeping' : '/admin'));
      navigate(target);
    } catch (error: any) {
      console.error('Admin Login error:', error);
      const status = error.response?.status;
      const message = error.response?.data?.message
        || (status === 429
          ? 'Too many login attempts. Please wait a moment and try again.'
          : 'Authentication failed. Please check your credentials.');
      toast.error(message);
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-['Outfit']">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#14532D] transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
        <span>Back</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md w-full bg-white p-8 sm:p-10 rounded shadow-sm border border-gray-100"
      >
        {/* Brand Logo */}
        <div className="text-center flex flex-col items-center mb-8">
          <AuthBrandLogo variant="staff" />
          <h2 className="text-3xl text-[#14532D] mt-6 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500">Sign in to your staff account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700">Email Address</label>
            <div className="flex rounded border border-[#14532D]/30 overflow-hidden focus-within:border-[#14532D] focus-within:ring-1 focus-within:ring-[#14532D] transition-all bg-white">
              <div className="bg-[#14532D]/10 flex items-center justify-center px-4 border-r border-[#14532D]/20">
                <Mail className="text-[#14532D]" size={18} />
              </div>
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 px-4 outline-none text-gray-700 placeholder-gray-400 bg-transparent text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700">Password</label>
            <div className="flex rounded border border-[#14532D]/30 overflow-hidden focus-within:border-[#14532D] focus-within:ring-1 focus-within:ring-[#14532D] transition-all bg-white">
              <div className="bg-[#14532D]/10 flex items-center justify-center px-4 border-r border-[#14532D]/20">
                <Lock className="text-[#14532D]" size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 px-4 outline-none text-gray-700 placeholder-gray-400 bg-transparent text-sm"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-4 text-gray-400 hover:text-gray-600 transition-colors text-[11px] font-bold uppercase"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#14532D] text-white rounded font-bold hover:bg-[#0f4023] transition-colors disabled:opacity-70 mt-2 shadow-sm"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  <span>Signing In...</span>
                </motion.div>
              ) : (
                <motion.div key="submit" className="flex items-center gap-2">
                  <ArrowRight size={18} />
                  <span>Sign In</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </form>

        {/* Forgot Password */}
        <div className="text-center mt-4">
          <button
            type="button"
            className="text-sm font-semibold text-[#14532D] hover:text-[#0f4023] transition-colors"
          >
            Forgot your password?
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center py-5 mt-2">
          <div className="flex-grow border-t border-gray-200" />
          <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">Staff Portal Access</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>

        <p className="text-center text-xs text-gray-400 font-medium">
          Contact your administrator for account access.
        </p>
      </motion.div>
    </div>
  );
};
