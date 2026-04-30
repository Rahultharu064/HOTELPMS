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
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100 text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Check Your Email</h2>
          <p className="text-gray-600 mt-2">
            We've sent a password reset link to <span className="font-bold">{email}</span>.
          </p>
          <div className="mt-8">
            <Link to="/login" className="text-sm font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 flex items-center justify-center">
              <ArrowLeft size={16} className="mr-2" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight text-center">Reset Password</h2>
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
                className="appearance-none rounded-xl relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm bg-gray-50 transition-all"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-black uppercase tracking-widest rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
            <Send className="ml-2" size={18} />
          </button>
        </form>

        <div className="text-center">
          <Link to="/login" className="text-sm font-black text-gray-500 uppercase tracking-widest hover:text-gray-700 flex items-center justify-center">
            <ArrowLeft size={16} className="mr-2" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
