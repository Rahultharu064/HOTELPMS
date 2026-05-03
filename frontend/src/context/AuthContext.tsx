import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000') + '/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: restore session and validate the token is still good
  useEffect(() => {
    const savedToken = localStorage.getItem('guest_token');
    const savedUser = localStorage.getItem('guest_user');

    if (savedToken && savedUser) {
      // Validate the token against /auth/me – if the guest was deleted or
      // the token expired the server returns 401, and we auto-logout cleanly.
      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => {
          if (res.ok) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
          } else {
            // Token is stale / guest deleted – clear silently
            localStorage.removeItem('guest_token');
            localStorage.removeItem('guest_user');
          }
        })
        .catch(() => {
          // Network error – still load the user from cache so the app works
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('guest_token', authToken);
    localStorage.setItem('guest_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('guest_token');
    localStorage.removeItem('guest_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
