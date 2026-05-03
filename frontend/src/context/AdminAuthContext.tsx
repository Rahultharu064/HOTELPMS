import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  adminToken: string | null;
  adminLogin: (userData: AdminUser, token: string) => void;
  adminLogout: () => void;
  isAdminAuthenticated: boolean;
  isAdminLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    const savedAdmin = localStorage.getItem('admin_user');

    if (savedToken && savedAdmin) {
      setAdminToken(savedToken);
      setAdmin(JSON.parse(savedAdmin));
    }
    setIsAdminLoading(false);
  }, []);

  const adminLogin = (userData: AdminUser, authToken: string) => {
    setAdmin(userData);
    setAdminToken(authToken);
    localStorage.setItem('admin_token', authToken);
    localStorage.setItem('admin_user', JSON.stringify(userData));
  };

  const adminLogout = () => {
    setAdmin(null);
    setAdminToken(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, adminToken, adminLogin, adminLogout, isAdminAuthenticated: !!adminToken, isAdminLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
