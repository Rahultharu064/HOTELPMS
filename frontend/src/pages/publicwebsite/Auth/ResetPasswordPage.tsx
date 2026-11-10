import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { toast } from 'react-hot-toast';
import { Lock, CheckCircle } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Invalid reset link');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword({ token, newPassword: password });
      toast.success('Password reset successful! Please login with your new password.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-neutral-light px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-neutral-border bg-white p-5 text-center shadow-sm sm:space-y-8 sm:p-8">
          <h2 className="text-2xl font-bold text-red-600">Invalid Link</h2>
          <p className="text-gray-600 mt-2">The password reset link is invalid or has expired.</p>
          <div className="mt-8">
            <Link to="/forgot-password" title="Forgot Password" className="inline-flex min-h-11 items-center text-sm font-semibold text-primary-green hover:text-primary-dark">
              Request a new link
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
          <h2 className="text-center text-2xl font-semibold tracking-tight text-primary-dark sm:text-3xl">Set new password</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your new password below.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative block min-h-12 w-full appearance-none rounded-lg border border-neutral-border bg-neutral-light px-10 py-3 text-gray-900 placeholder-gray-500 transition-all focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/20 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="relative block min-h-12 w-full appearance-none rounded-lg border border-neutral-border bg-neutral-light px-10 py-3 text-gray-900 placeholder-gray-500 transition-all focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/20 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative flex min-h-12 w-full justify-center rounded-lg border border-transparent bg-primary-green px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
            <CheckCircle className="ml-2" size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
