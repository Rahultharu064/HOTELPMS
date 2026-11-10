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
    <div className="public-auth-page flex min-h-[65vh] items-center justify-center bg-neutral-light px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md rounded-2xl border border-neutral-border bg-white p-5 shadow-sm sm:p-8"
      >
        {/* Brand Logo */}
        <div className="text-center flex flex-col items-center mb-8">
          <AuthBrandLogo variant="guest" />
          <h2 className="mt-6 mb-1 font-georgia text-2xl font-semibold text-primary-dark sm:text-3xl">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700">Email Address</label>
            <div className="flex min-h-12 overflow-hidden rounded-lg border border-neutral-border bg-white transition-all focus-within:border-primary-green focus-within:ring-2 focus-within:ring-primary-green/15">
              <div className="flex items-center justify-center border-r border-neutral-border bg-primary-green/5 px-3">
                <Mail className="text-primary-green" size={18} />
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
            <div className="flex min-h-12 overflow-hidden rounded-lg border border-neutral-border bg-white transition-all focus-within:border-primary-green focus-within:ring-2 focus-within:ring-primary-green/15">
              <div className="flex items-center justify-center border-r border-neutral-border bg-primary-green/5 px-3">
                <Lock className="text-primary-green" size={18} />
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
                className="min-w-12 px-3 text-xs font-semibold uppercase text-neutral-text-secondary transition-colors hover:text-primary-dark"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary-green px-4 py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark disabled:opacity-70"
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
            className="text-sm font-semibold text-primary-green transition-colors hover:text-primary-dark"
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
