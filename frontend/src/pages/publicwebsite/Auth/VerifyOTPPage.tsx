import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { ShieldCheck, ArrowRight, RefreshCw, Mail } from 'lucide-react';

export const VerifyOTPPage: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { email?: string };
    const savedEmail = localStorage.getItem('pending_verify_email');
    
    if (state?.email) {
      setEmail(state.email);
      localStorage.setItem('pending_verify_email', state.email);
    } else if (savedEmail) {
      setEmail(savedEmail);
    } else {
      toast.error('Session expired. Please try logging in.');
      navigate('/login');
    }
  }, [location, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }
    setLoading(true);
    console.log(`[VerifyOTP] Attempting verification for ${email} with code ${otp}`);
    
    try {
      const data = await authService.verifyOTP(email, otp);
      console.log('[VerifyOTP] Success:', data);
      
      if (data.token && data.user) {
        login(data.user, data.token);
        localStorage.removeItem('pending_verify_email');
        toast.success('Email verified successfully!');
        navigate('/');
      } else {
        console.error('[VerifyOTP] Invalid response structure:', data);
        toast.error('Server returned an invalid response');
      }
    } catch (error: any) {
      console.error('[VerifyOTP] Error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authService.resendOTP(email);
      toast.success('A new code has been sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <ShieldCheck size={32} />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
            Verify Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a 6-digit code to <span className="font-bold text-gray-900">{email}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 text-center">
              Enter Verification Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="appearance-none rounded-xl relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl font-bold tracking-[0.5em] text-center bg-gray-50 transition-all"
              placeholder="000000"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black uppercase tracking-widest rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
            <ArrowRight className="ml-2" size={18} />
          </button>
        </form>

        <div className="text-center space-y-4">
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 flex items-center justify-center mx-auto gap-2"
          >
            <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
            {resending ? 'Resending...' : "Didn't receive code? Resend"}
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 block w-full"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};
