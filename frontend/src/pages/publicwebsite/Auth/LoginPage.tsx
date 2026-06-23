import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { authService } from '../../../services/authService';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { AuthBrandLogo } from '../../../components/ui/AuthBrandLogo';

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
      toast.success('Welcome back to Itahari Namuna PMS!');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-['Outfit']">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md w-full bg-white p-8 sm:p-10 rounded shadow-sm border border-gray-100"
      >
        {/* Brand Logo */}
        <div className="text-center flex flex-col items-center mb-8">
          <AuthBrandLogo variant="guest" />
          <h2 className="text-3xl text-[#5c3d14] mt-6 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700">Email Address</label>
            <div className="flex rounded border border-[#c9a84c]/40 overflow-hidden focus-within:border-[#c9a84c] focus-within:ring-1 focus-within:ring-[#c9a84c] transition-all bg-white">
              <div className="bg-[#c9a84c]/10 flex items-center justify-center px-4 border-r border-[#c9a84c]/30">
                <Mail className="text-[#c9a84c]" size={18} />
              </div>
              <input
                type="email"
                required
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
            <div className="flex rounded border border-[#c9a84c]/40 overflow-hidden focus-within:border-[#c9a84c] focus-within:ring-1 focus-within:ring-[#c9a84c] transition-all bg-white">
              <div className="bg-[#c9a84c]/10 flex items-center justify-center px-4 border-r border-[#c9a84c]/30">
                <Lock className="text-[#c9a84c]" size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
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
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#c9a84c] text-white rounded font-bold hover:bg-[#b8952f] transition-colors disabled:opacity-70 mt-2 shadow-sm"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-[#c9a84c] hover:text-[#b8952f] transition-colors"
          >
            Forgot your password?
          </Link>
        </div>

        {/* Google Login */}
        <div className="mt-5">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
              window.location.href = `${backendUrl}/api/auth/google/login`;
            }}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm"
          >
            <FcGoogle size={20} />
            <span>Continue with Google</span>
          </motion.button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center py-5 mt-2">
          <div className="flex-grow border-t border-gray-200" />
          <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">Don't have an account?</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>

        {/* Create Account */}
        <Link
          to="/signup"
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-[#c9a84c] text-[#c9a84c] rounded font-bold hover:bg-[#c9a84c]/5 transition-colors"
        >
          <UserPlus size={18} />
          <span>Create Account</span>
        </Link>
      </motion.div>
    </div>
  );
};
