import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { decodeToken, TokenPayload } from './utils/jwt';

interface AuthContextType {
  token: string | null;
  userName: string | null;
  userRole?: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      setUserName(decoded?.name || null);
      setUserRole(decoded?.role || null);
      console.log('Decoded name:', decoded?.name);
      console.log('Decoded role:', decoded?.role);
    }
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);

    const decoded = decodeToken(newToken);
    setUserName(decoded?.name || null);
    setUserRole(decoded?.role || null);
  };

  const logout = () => {
    setToken(null);
    setUserName(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setUserRole(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, userName, userRole, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
