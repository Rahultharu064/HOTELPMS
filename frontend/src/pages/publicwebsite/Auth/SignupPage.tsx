import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User, Phone, UserPlus, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { AuthBrandLogo } from '../../../components/ui/AuthBrandLogo';

export const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const [firstName, ...lastNameParts] = formData.fullName.trim().split(' ');
      const lastName = lastNameParts.join(' ');

      const payload = {
        firstName: firstName || '',
        lastName: lastName || '',
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };

      const data = await authService.register(payload) as {
        message?: string;
        email?: string;
        otp?: string;
        emailSent?: boolean;
        token?: string;
        user?: { id: number; email: string; firstName?: string; lastName?: string };
      };

      if (data.token && data.user) {
        login(data.user as any, data.token);
        toast.success('Account created! Welcome.');
        navigate('/profile');
        return;
      }

      if (data.emailSent === false) {
        toast.error('Email could not be sent. Check SMTP settings or use the dev code below.');
      } else {
        toast.success('Registration successful! Please verify your email.');
      }

      if (data.otp) {
        toast(`Dev OTP: ${data.otp}`, { icon: '🔑', duration: 15000 });
      }

      navigate('/verify-otp', {
        state: { email: formData.email, devOtp: data.otp },
      });

    } catch (error: any) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-['Outfit']">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full bg-white p-8 sm:p-10 rounded shadow-sm border border-gray-100"
      >
        <div className="text-center flex flex-col items-center">
          <AuthBrandLogo variant="guest" />
          <h2 className="text-3xl text-[#14532D] mt-6 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Create Account
          </h2>
          <p className="text-sm text-[#14532D]/70 mb-8 font-medium">
            Join Itahari Namuna Hotel family
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-[#14532D]">Full Name</label>
            <div className="flex rounded border border-[#14532D]/20 overflow-hidden focus-within:border-[#14532D] focus-within:ring-1 focus-within:ring-[#14532D] transition-all bg-white">
              <div className="bg-[#14532D]/5 flex items-center justify-center px-4 border-r border-[#14532D]/20">
                <User className="text-[#14532D]" size={18} />
              </div>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full py-3 px-4 outline-none text-gray-700 placeholder-gray-400 bg-transparent text-sm"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-[#14532D]">Email Address</label>
            <div className="flex rounded border border-[#14532D]/20 overflow-hidden focus-within:border-[#14532D] focus-within:ring-1 focus-within:ring-[#14532D] transition-all bg-white">
              <div className="bg-[#14532D]/5 flex items-center justify-center px-4 border-r border-[#14532D]/20">
                <Mail className="text-[#14532D]" size={18} />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full py-3 px-4 outline-none text-gray-700 placeholder-gray-400 bg-transparent text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-[#14532D]">Phone Number</label>
            <div className="flex rounded border border-[#14532D]/20 overflow-hidden focus-within:border-[#14532D] focus-within:ring-1 focus-within:ring-[#14532D] transition-all bg-white">
              <div className="bg-[#14532D]/5 flex items-center justify-center px-4 border-r border-[#14532D]/20">
                <Phone className="text-[#14532D]" size={18} />
              </div>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full py-3 px-4 outline-none text-gray-700 placeholder-gray-400 bg-transparent text-sm"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-[#14532D]">Password</label>
            <div className="flex rounded border border-[#14532D]/20 overflow-hidden focus-within:border-[#14532D] focus-within:ring-1 focus-within:ring-[#14532D] transition-all bg-white">
              <div className="bg-[#14532D]/5 flex items-center justify-center px-4 border-r border-[#14532D]/20">
                <Lock className="text-[#14532D]" size={18} />
              </div>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                className="w-full py-3 px-4 outline-none text-gray-700 placeholder-gray-400 bg-transparent text-sm"
                placeholder="Create a password"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-[#14532D]">Confirm Password</label>
            <div className="flex rounded border border-[#14532D]/20 overflow-hidden focus-within:border-[#14532D] focus-within:ring-1 focus-within:ring-[#14532D] transition-all bg-white">
              <div className="bg-[#14532D]/5 flex items-center justify-center px-4 border-r border-[#14532D]/20">
                <Lock className="text-[#14532D]" size={18} />
              </div>
              <input
                type="password"
                name="confirmPassword"
                required
                minLength={8}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full py-3 px-4 outline-none text-gray-700 placeholder-gray-400 bg-transparent text-sm"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#14532D] text-white rounded font-bold hover:bg-[#0f4023] transition-colors disabled:opacity-70 mt-6 shadow-sm"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </motion.div>
              ) : (
                <motion.div key="submit" className="flex items-center gap-2">
                  <UserPlus size={18} />
                  <span>Create Account</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </form>

        <div className="relative flex items-center py-6 mt-2">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-[#14532D]/60 text-sm font-medium">Already have an account?</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <Link
          to="/login"
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-[#14532D] text-[#14532D] rounded font-bold hover:bg-[#14532D]/5 transition-colors"
        >
          <LogIn size={18} />
          <span>Sign In</span>
        </Link>
      </motion.div>
    </div>
  );
};

