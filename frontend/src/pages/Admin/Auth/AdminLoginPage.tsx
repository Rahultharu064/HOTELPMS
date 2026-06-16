import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { toast } from 'react-hot-toast';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../services/api';
import { Button } from '../../../components/ui/Button';
import { AuthBrandLogo } from '../../../components/ui/AuthBrandLogo';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-green/5 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-gold/5 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-10 bg-white p-12 rounded-[40px] shadow-premium border border-gray-100 relative z-10"
      >
        <div>
          <AuthBrandLogo variant="staff" size="lg" />
          <div className="space-y-2 text-center mt-6">
            <h2 className="text-2xl font-black text-[#111827] tracking-tight uppercase">
              System Access
            </h2>
            <p className="text-[10px] font-black text-primary-green uppercase tracking-[0.3em]">
              Authorized Personnel Only
            </p>
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-center text-xs text-emerald-800 font-medium">
              <span className="font-bold">Default:</span> admin@hotelpms.com / admin123
            </div>
          </div>
        </div>

        <form className="space-y-8" onSubmit={handleLogin}>
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Security Identity
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-green transition-colors" size={18} />
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-2xl relative block w-full px-12 py-4 border border-gray-100 placeholder-gray-300 text-[#111827] focus:outline-none focus:ring-4 focus:ring-primary-green/5 focus:border-primary-green/30 sm:text-sm bg-gray-50/50 transition-all font-medium"
                  placeholder="admin@hotelpms.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Access Credential
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-green transition-colors" size={18} />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-2xl relative block w-full px-12 py-4 border border-gray-100 placeholder-gray-300 text-[#111827] focus:outline-none focus:ring-4 focus:ring-primary-green/5 focus:border-primary-green/30 sm:text-sm bg-gray-50/50 transition-all font-medium"
                  placeholder="admin123"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-green focus:ring-primary-green border-gray-300 rounded-lg cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-[10px] text-gray-400 font-black uppercase tracking-widest cursor-pointer">
                Remember
              </label>
            </div>
            <button type="button" className="text-[10px] font-black text-primary-gold uppercase tracking-widest hover:text-primary-orange transition-colors">
              Recovery
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="group relative w-full flex justify-center py-5 px-4 border border-transparent text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl text-white bg-primary-green hover:bg-primary-dark focus:outline-none transition-all shadow-2xl shadow-primary-green/20 disabled:opacity-70 active:scale-95"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <Loader2 className="animate-spin" size={18} />
                Verifying...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                successfully login <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </span>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};
