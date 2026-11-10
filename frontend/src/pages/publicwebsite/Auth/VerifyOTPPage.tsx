import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

export const VerifyOTPPage: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { email?: string; devOtp?: string };
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

    if (state?.devOtp) {
      setOtp(state.devOtp);
      toast(`Dev OTP pre-filled: ${state.devOtp}`, { icon: '🔑', duration: 10000 });
    }
  }, [location, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }
    setLoading(true);
    
    try {
      const data = await authService.verifyOTP(email, otp) as any;
      
      if (data.token && data.user) {
        login(data.user, data.token);
        localStorage.removeItem('pending_verify_email');
        toast.success('Email verified successfully!');
        navigate('/profile');
      } else {
        toast.error('Server returned an invalid response');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Verification failed';
      if (message.includes('already verified')) {
        toast(message);
        navigate('/login', { state: { email } });
        return;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const data = await authService.resendOTP(email) as { message?: string; otp?: string; emailSent?: boolean };
      if (data.emailSent === false) {
        toast.error('Email could not be sent. Check SMTP configuration.');
      } else {
        toast.success('A new code has been sent to your email');
      }
      if (data.otp) {
        setOtp(data.otp);
        toast(`Dev OTP: ${data.otp}`, { icon: '🔑', duration: 15000 });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };


  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-neutral-light px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-neutral-border bg-white p-5 shadow-sm sm:space-y-8 sm:p-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary-green text-white shadow-sm sm:h-16 sm:w-16">
            <ShieldCheck size={32} />
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-primary-dark sm:text-3xl">
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
              className="relative block min-h-14 w-full appearance-none rounded-lg border border-neutral-border bg-neutral-light px-4 py-4 text-center text-2xl font-semibold tracking-[0.4em] text-primary-dark placeholder-gray-500 transition-all focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/20 sm:tracking-[0.5em]"
              placeholder="000000"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="group relative flex min-h-12 w-full justify-center rounded-lg border border-transparent bg-primary-green px-4 py-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
            <ArrowRight className="ml-2" size={18} />
          </button>
        </form>

        <div className="text-center space-y-4">
          <button
            onClick={handleResend}
            disabled={resending}
            className="mx-auto flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-primary-green hover:text-primary-dark"
          >
            <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
            {resending ? 'Resending...' : "Didn't receive code? Resend"}
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className="block min-h-11 w-full text-sm font-medium text-neutral-text-secondary hover:text-primary-dark"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};
