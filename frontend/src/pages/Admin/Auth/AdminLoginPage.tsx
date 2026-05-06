import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { toast } from 'react-hot-toast';
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../services/api';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());
  
  const { admin, adminLogin, isAdminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  // Update clock every second for professional system feel
  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (isAdminAuthenticated && admin) {
      const homeMap: Record<string, string> = {
        superadmin: '/admin',
        admin: '/admin',
        manager: '/admin',
        front_office: '/frontoffice',
        housekeeping: '/housekeeping'
      };
      navigate(admin.mustChangePassword ? '/admin/auth/reset-password' : (homeMap[admin.role] || '/admin'));
    }
  }, [isAdminAuthenticated, admin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      // Logic enhancement: Use a small delay for better "authentication" UX feel
      const response = await api.post<any>('/admin/auth/login', { email, password });
      
      // Delay success action slightly to show authenticating state
      setTimeout(() => {
        adminLogin(response.user, response.token);
        toast.success(`Welcome back, ${response.user.firstName || 'Admin'}`);

        const role = response.user.role;
        const target = response.user.mustChangePassword ? '/admin/auth/reset-password' : 
                       (role === 'front_office' ? '/frontoffice' : (role === 'housekeeping' ? '/housekeeping' : '/admin'));
        navigate(target);
      }, 800);
    } catch (error: any) {
      console.error('Admin Login error:', error);
      toast.error(error.response?.data?.message || 'Authentication failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Background decoration to keep it professional */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-green/5 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-gold/5 blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-gray-100 relative z-10"
      >
        <div>
          <div className="mx-auto flex justify-center">
            <img src="/LOGOS.png" alt="Logo" className="h-24 w-auto object-contain" />
          </div>
          <div className="flex items-center justify-center gap-2 mt-6">
            <ShieldCheck className="text-primary-green" size={24} />
            <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
              Staff Portal
            </h2>
          </div>
          <p className="mt-2 text-center text-sm text-gray-600 font-medium">
            Authorized Administrative Access Only
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                Admin Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-green transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-xl relative block w-full px-10 py-3.5 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green sm:text-sm bg-gray-50 transition-all"
                  placeholder="admin@hotelpms.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1 ml-1">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
                  Secure Password
                </label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-green transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-xl relative block w-full px-10 py-3.5 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green sm:text-sm bg-gray-50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-green focus:ring-primary-green border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-500 font-bold uppercase tracking-wider">
              Remember this device
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black uppercase tracking-widest rounded-xl text-white bg-primary-green hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition-all shadow-lg shadow-primary-green/20 disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign In <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <Info className="text-amber-500 shrink-0" size={18} />
            <p className="text-[10px] text-amber-800 leading-relaxed font-medium uppercase tracking-tight">
              Security Notice: All login attempts and session activities are monitored and logged for audit purposes.
            </p>
          </div>
        </div>

        {/* Developer Quick Access - ONLY IN DEV MODE */}
        {import.meta.env.DEV && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@hotelpms.com');
                setPassword('admin123');
              }}
              className="text-[9px] font-black text-primary-gold uppercase tracking-[0.2em] hover:text-primary-green transition-colors py-2 px-4 rounded-lg border border-primary-gold/20 hover:border-primary-green/20 bg-gray-50"
            >
              Dev: Load Test Admin
            </button>
          </div>
        )}
      </motion.div>

      <div className="mt-8 flex flex-col items-center gap-2 opacity-50">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
          System Node: 019 // {systemTime}
        </p>
        <p className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">
          Build v1.0.4-stable
        </p>
      </div>
    </div>
  );
};




