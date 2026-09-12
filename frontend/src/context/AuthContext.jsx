import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('shopco_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    if (user) {
      localStorage.setItem('shopco_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('shopco_user');
    }
  }, [user]);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    setUser(res.user);
    setIsAuthModalOpen(false);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await api.register({ name, email, password });
    setUser(res.user);
    setIsAuthModalOpen(false);
    return res;
  };

  const logout = () => {
    setUser(null);
  };

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        authMode,
        setAuthMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
