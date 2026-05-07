import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { authService } from '../../../services/authService';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { SiGooglechrome } from 'react-icons/si';
export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      const { user, token } = response;
      login(user, token);
      toast.success('Welcome back to Antigravity PMS!');
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.data?.message?.includes('not verified')) {
        navigate('/verify-otp', { state: { email } });
      } else {
        toast.error(error.response?.data?.message || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 font-['Outfit']">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] opacity-50 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 relative z-10"
      >
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="mx-auto flex justify-center mb-6"
          >
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
              <img src="/LOGOS.png" alt="Antigravity Logo" className="h-16 w-auto object-contain" />
            </div>
          </motion.div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Guest Portal
          </h2>
          <p className="mt-3 text-sm text-gray-500 font-medium">
            Manage your stay with luxury and ease
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Professional Passport.js Google Login Redirect */}
          <div className="flex flex-col items-center justify-center w-full">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
                window.location.href = `${backendUrl}/api/auth/google/login`;
              }}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm group"
            >
              <FcGoogle size={22} />
              <span className="group-hover:text-blue-600 transition-colors">Continue with Google</span>
            </motion.button>
            
            <div className="relative w-full mt-8 mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-gray-400 font-bold uppercase tracking-widest">
                  OR
                </span>
              </div>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1 group-focus-within:text-blue-600 transition-colors">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest group-focus-within:text-blue-600 transition-colors">
                    Password
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 hover:underline transition-all"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-12 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <span className="text-[10px] font-bold uppercase">{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="relative w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-sm font-bold uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] transition-all disabled:opacity-50 flex items-center justify-center overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="submit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <span>Sign In</span>
                    <ArrowRight size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-indigo-600 transition-colors font-black">
              Register Now
            </Link>
          </p>
        </div>
      </motion.div>
      
      {/* Footer Branding & Compatibility */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 bg-white/50 backdrop-blur-sm rounded-full border border-gray-100 shadow-sm">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Best experienced on</span>
          <SiGooglechrome className="text-gray-400 hover:text-[#4285F4] transition-colors" size={12} />
        </div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap opacity-50">
          Powered by Antigravity PMS v2.0
        </div>
      </div>
    </div>
  );
};
