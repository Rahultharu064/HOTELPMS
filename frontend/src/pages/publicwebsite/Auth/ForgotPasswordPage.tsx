import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { toast } from 'react-hot-toast';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
      toast.success('Reset link sent if account exists');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-neutral-light px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-neutral-border bg-white p-5 text-center shadow-sm sm:space-y-8 sm:p-8">
          <div className="mx-auto h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-primary-dark sm:text-3xl">Check your email</h2>
          <p className="text-gray-600 mt-2">
            We've sent a password reset link to <span className="font-bold">{email}</span>.
          </p>
          <div className="mt-8">
            <Link to="/login" className="flex min-h-11 items-center justify-center text-sm font-semibold text-primary-green hover:text-primary-dark">
              <ArrowLeft size={16} className="mr-2" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-neutral-light px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-neutral-border bg-white p-5 shadow-sm sm:space-y-8 sm:p-8">
        <div>
          <h2 className="text-center text-2xl font-semibold tracking-tight text-primary-dark sm:text-3xl">Reset password</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block min-h-12 w-full appearance-none rounded-lg border border-neutral-border bg-neutral-light px-10 py-3 text-gray-900 placeholder-gray-500 transition-all focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/20 sm:text-sm"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative flex min-h-12 w-full justify-center rounded-lg border border-transparent bg-primary-green px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
            <Send className="ml-2" size={18} />
          </button>
        </form>

        <div className="text-center">
          <Link to="/login" className="flex min-h-11 items-center justify-center text-sm font-semibold text-neutral-text-secondary hover:text-primary-dark">
            <ArrowLeft size={16} className="mr-2" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
