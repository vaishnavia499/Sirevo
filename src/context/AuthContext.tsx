import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'guest' | 'customer' | 'merchant';

export interface UserProfile {
  name: string;
  email: string;
  role: 'customer' | 'merchant';
  storeName?: string;
  legalEntity?: string;
  taxId?: string;
  category?: string;
  website?: string;
  avatarUrl?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAuthModalOpen: boolean;
  pendingAction: (() => void) | null;
  openAuthModal: (onSuccessCallback?: () => void) => void;
  closeAuthModal: () => void;
  login: (email: string, role?: 'customer' | 'merchant', name?: string) => void;
  signup: (
    role: 'customer' | 'merchant', 
    details: { 
      name: string; 
      email: string; 
      storeName?: string;
      legalEntity?: string;
      taxId?: string;
      category?: string;
      website?: string;
    }
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_AUTH = 'sirevo_auth_state_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage if available
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed.isAuthenticated);
      }
    } catch (e) {
      console.error('Failed to parse auth from localStorage', e);
    }
    return false;
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.user || null;
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
    }
    return null;
  });

  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.userRole === 'merchant' || parsed.userRole === 'customer') {
          return parsed.userRole;
        }
      }
    } catch (e) {
      console.error('Failed to parse userRole from localStorage', e);
    }
    return 'guest';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_AUTH,
        JSON.stringify({
          isAuthenticated,
          user,
          userRole,
        })
      );
    } catch (e) {
      console.error('Failed to save auth to localStorage', e);
    }
  }, [isAuthenticated, user, userRole]);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    if (role === 'guest') {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const openAuthModal = (onSuccessCallback?: () => void) => {
    if (onSuccessCallback) {
      setPendingAction(() => onSuccessCallback);
    } else {
      setPendingAction(null);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingAction(null);
  };

  const login = (email: string, role: 'customer' | 'merchant' = 'customer', name: string = 'Alex Rivera') => {
    const newUser: UserProfile = {
      name: name || (email.split('@')[0] || 'User'),
      email,
      role,
      avatarUrl: role === 'merchant'
        ? 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=100&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    };
    setUser(newUser);
    setUserRoleState(role);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);

    if (pendingAction) {
      const action = pendingAction;
      setPendingAction(null);
      setTimeout(() => {
        action();
      }, 100);
    }
  };

  const signup = (
    role: 'customer' | 'merchant', 
    details: { 
      name: string; 
      email: string; 
      storeName?: string;
      legalEntity?: string;
      taxId?: string;
      category?: string;
      website?: string;
    }
  ) => {
    const newUser: UserProfile = {
      name: details.name,
      email: details.email,
      role,
      storeName: details.storeName,
      legalEntity: details.legalEntity,
      taxId: details.taxId,
      category: details.category,
      website: details.website,
      avatarUrl: role === 'merchant'
        ? 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=100&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    };
    setUser(newUser);
    setUserRoleState(role);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);

    if (pendingAction) {
      const action = pendingAction;
      setPendingAction(null);
      setTimeout(() => {
        action();
      }, 100);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setUserRoleState('guest');
    setPendingAction(null);
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch (e) {
      console.error('Failed to remove auth from localStorage', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        userRole,
        setUserRole,
        isAuthModalOpen,
        pendingAction,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
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
