import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { toast } from 'react-hot-toast';
import { Lock, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../../services/api';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { adminLogin } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Direct API call since we don't have a specific adminAuthService yet
      const response = await api.post<any>('/admin/auth/login', { email, password });
      adminLogin(response.user, response.token);
      toast.success('Admin authentication successful');
      navigate('/admin');
    } catch (error: any) {
      console.error('Admin Login error:', error);
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFF] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Premium Background Accents */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#14532D]/5 rounded-full blur-[120px] pointer-events-none -mr-96 -mt-96" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#F59E0B]/5 rounded-full blur-[100px] pointer-events-none -ml-64 -mb-64" />

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-gray-100 backdrop-blur-xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-[#14532D] to-[#111827] rounded-3xl flex items-center justify-center text-[#F59E0B] shadow-xl shadow-[#14532D]/20 mb-6">
              <ShieldAlert size={40} strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-black text-[#111827] tracking-tight uppercase text-center">
              Restricted Area
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mt-3 text-center">
              Authorized Personnel Only
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:border-[#14532D]/20 focus:bg-white rounded-2xl text-[14px] font-medium outline-none transition-all shadow-inner"
                  placeholder="admin@hotelpms.com"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
                  Secure Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent focus:border-[#14532D]/20 focus:bg-white rounded-2xl text-[14px] font-medium outline-none transition-all shadow-inner"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 py-5 bg-[#14532D] text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-[#111827] transition-all shadow-xl shadow-[#14532D]/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 disabled:active:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Verify Credentials <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 max-w-[250px] mx-auto leading-relaxed">
              Every access attempt is logged. Unauthorized access is strictly prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
