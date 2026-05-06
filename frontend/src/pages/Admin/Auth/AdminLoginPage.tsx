import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { toast } from 'react-hot-toast';
import { Lock, ArrowRight, Loader2, Activity, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../services/api';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());
  const [connectionSecure, setConnectionSecure] = useState(false);
  
  const { admin, adminLogin, isAdminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  // Update clock and simulate secure connection handshake
  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date().toLocaleTimeString()), 1000);
    const handshake = setTimeout(() => setConnectionSecure(true), 1500);
    return () => {
      clearInterval(timer);
      clearTimeout(handshake);
    };
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
    if (!connectionSecure) return;
    
    setLoading(true);
    try {
      const response = await api.post<any>('/admin/auth/login', { email, password });
      adminLogin(response.user, response.token);
      toast.success('System Access Granted');
      
      const role = response.user.role;
      const target = response.user.mustChangePassword ? '/admin/auth/reset-password' : 
                     (role === 'front_office' ? '/frontoffice' : (role === 'housekeeping' ? '/housekeeping' : '/admin'));
      navigate(target);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Access Denied: Invalid Authentication Token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans select-none">
      {/* Immersive Background Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000" 
          alt="Tech Grid" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-transparent to-[#020617] opacity-90" />
      </div>

      {/* Dynamic Animated Accents */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary-green/5 rounded-full blur-[150px] -mr-96 -mt-96 pointer-events-none" 
      />
      
      {/* Top System Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-16 border-b border-white/5 bg-black/20 backdrop-blur-xl z-20 flex items-center px-10 justify-between hidden md:flex">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${connectionSecure ? 'bg-primary-green shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-primary-gold animate-pulse'}`} />
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
              {connectionSecure ? 'Secure Link Established' : 'Establishing Secure Handshake...'}
            </span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-3 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
            <Activity size={12} className="text-primary-gold" />
            Load: 0.12ms // Latency: 4ms
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-[10px] font-black text-white/50 tracking-[0.3em] font-mono">{systemTime}</div>
          <div className="text-[10px] font-black text-primary-gold uppercase tracking-[0.3em] bg-primary-gold/5 px-3 py-1 rounded-md border border-primary-gold/10">v1.0.4 Release</div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-slate-900/40 backdrop-blur-3xl p-10 md:p-14 rounded-[48px] shadow-[0_0_80px_rgba(0,0,0,0.4)] border border-white/10 relative group">
          {/* Scanline line */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-green/5 to-transparent h-[10px] top-0 animate-scan pointer-events-none" />

          <div className="flex flex-col items-center mb-12">
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="mb-8 relative"
            >
              <div className="absolute inset-0 bg-primary-green/30 blur-3xl rounded-full" />
              <img src="/LOGOS.png" alt="Logo" className="h-20 w-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]" />
            </motion.div>
            
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
              Staff <span className="text-primary-green">Entry</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-gold animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">
                Authorized Personnel Only
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-7">
            <div className="space-y-6">
              <div className="group/input">
                <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3 ml-2 group-focus-within/input:text-primary-green transition-colors">
                  System ID
                </label>
                <div className="relative">
                   <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-8 py-5 bg-white/5 border border-white/10 focus:border-primary-green/30 focus:bg-white/[0.07] rounded-[24px] text-[15px] font-medium text-white outline-none transition-all placeholder:text-white/10 shadow-inner"
                    placeholder="admin@hotelpms.com"
                  />
                </div>
              </div>
              
              <div className="group/input">
                <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3 ml-2 group-focus-within/input:text-primary-green transition-colors">
                  Security Token
                </label>
                <div className="relative">
                  <Lock className="absolute left-8 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-primary-green transition-colors" size={20} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 focus:border-primary-green/30 focus:bg-white/[0.07] rounded-[24px] text-[15px] font-medium text-white outline-none transition-all placeholder:text-white/10 shadow-inner"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !connectionSecure}
              className="w-full mt-6 py-6 bg-primary-green text-white rounded-[24px] text-[13px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-primary-dark transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(34,197,94,0.3)] flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50 group/btn"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  Initialize Session <ArrowRight size={20} className="group-hover/btn:translate-x-1.5 transition-transform duration-500" />
                </>
              )}
            </button>
          </form>

          <div className="mt-14 text-center">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 flex items-center justify-center gap-2">
                <AlertTriangle size={14} className="text-primary-gold/40" />
                Access is restricted and monitored
             </p>
             
             {/* Developer Quick Access - ONLY IN DEV MODE */}
             {import.meta.env.DEV && (
               <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                whileHover={{ opacity: 1 }}
                onClick={() => {
                  setEmail('admin@hotelpms.com');
                  setPassword('admin123');
                }}
                className="mt-6 text-[9px] font-bold text-primary-gold uppercase tracking-[0.3em] border border-primary-gold/20 px-4 py-2 rounded-full hover:bg-primary-gold/10 transition-all"
               >
                 Dev Bypass: Load Root Credentials
               </motion.button>
             )}
          </div>

        </div>
      </motion.div>
    </div>
  );
};


