import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  isWelcomeModalOpen: boolean;
  welcomeCredits: number;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  closeWelcomeModal: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, confirmPassword?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setCredits: (credits: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('alien_auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState<boolean>(false);
  const [welcomeCredits, setWelcomeCredits] = useState<number>(50);

  // Load user session on mount
  useEffect(() => {
    const fetchMe = async () => {
      const storedToken = localStorage.getItem('alien_auth_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setToken(storedToken);
        } else {
          // Token invalid or expired
          localStorage.removeItem('alien_auth_token');
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.warn('Failed to verify session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, []);

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const closeWelcomeModal = () => {
    setIsWelcomeModalOpen(false);
  };

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed.');
    }

    localStorage.setItem('alien_auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setIsAuthModalOpen(false);
  };

  const register = async (username: string, email: string, password: string, confirmPassword?: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, confirmPassword }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed.');
    }

    localStorage.setItem('alien_auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setIsAuthModalOpen(false);

    // On first-time signup, show 50 Free Credits welcome modal!
    if (data.isFirstSignup) {
      setWelcomeCredits(data.creditsAwarded || 50);
      setIsWelcomeModalOpen(true);
    }
  };

  const logout = () => {
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    localStorage.removeItem('alien_auth_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    const currentToken = token || localStorage.getItem('alien_auth_token');
    if (!currentToken) return;

    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.warn('Refresh user error:', err);
    }
  };

  const setCredits = (newCredits: number) => {
    setUser((prev) => (prev ? { ...prev, credits: newCredits } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        isWelcomeModalOpen,
        welcomeCredits,
        openAuthModal,
        closeAuthModal,
        closeWelcomeModal,
        login,
        register,
        logout,
        refreshUser,
        setCredits,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
