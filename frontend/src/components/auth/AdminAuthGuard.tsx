import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children, allowedRoles }) => {
  const { admin, isAdminAuthenticated, isAdminLoading } = useAdminAuth();
  const location = useLocation();

  if (isAdminLoading) {
    return (
      <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#14532D]"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Verifying Security Protocols...</p>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Mandatory Password Reset Check
  if (admin?.mustChangePassword && location.pathname !== '/admin/auth/reset-password') {
    return <Navigate to="/admin/auth/reset-password" replace />;
  }

  // Role-based Authorization
  if (allowedRoles && admin && !allowedRoles.includes(admin.role)) {
    // If they are logged in but don't have access, send them back to their appropriate home
    const homeMap: Record<string, string> = {
      superadmin: '/admin',
      admin: '/admin',
      manager: '/admin',
      front_office: '/frontoffice',
      housekeeping: '/housekeeping'
    };
    return <Navigate to={homeMap[admin.role] || '/admin/login'} replace />;
  }

  return <>{children}</>;
};
