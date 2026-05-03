import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const { isAdminAuthenticated, isAdminLoading } = useAdminAuth();
  const location = useLocation();

  if (isAdminLoading) {
    return (
      <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#14532D]"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Verifying Admin Credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    // Redirect to admin login but save the current location
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
