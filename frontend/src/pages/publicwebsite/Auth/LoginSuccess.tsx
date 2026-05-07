import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { authService } from '../../../services/authService';
import { toast } from 'react-hot-toast';

export const LoginSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLoginSuccess = async () => {
      const token = searchParams.get('token');
      
      if (token) {
        try {
          // Set the token in local storage so getMe can use it
          localStorage.setItem('guest_token', token);
          
          // Fetch user details with the new token
          const response = await authService.getMe();
          const user = response.data || response; // Handle both wrapped and unwrapped response
          
          login(user, token);
          toast.success('Welcome back to Antigravity PMS!');
          navigate('/');
        } catch (error) {
          console.error('Login success error:', error);
          toast.error('Failed to complete login. Please try again.');
          navigate('/login');
        }
      } else {
        toast.error('No authentication token found.');
        navigate('/login');
      }
    };

    handleLoginSuccess();
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-['Outfit']">
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Finalizing Login</h2>
          <p className="text-gray-500 mt-1">Please wait while we secure your session...</p>
        </div>
      </div>
    </div>
  );
};
