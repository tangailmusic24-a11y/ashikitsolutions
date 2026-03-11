import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  mobile: string;
  address: string;
  nidNumber: string;
  nidFront: string;
  nidBack: string;
  profilePicture: string;
  coverPicture: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  register: (email: string, username: string, password: string, fullName: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_USER: User = {
  id: 'admin-1',
  username: 'ashik',
  email: 'ashik.oysterit@gmail.com',
  fullName: 'Md Ashik Ahmed',
  mobile: '+8801303216921',
  address: '',
  nidNumber: '',
  nidFront: '',
  nidBack: '',
  profilePicture: '',
  coverPicture: '',
  isAdmin: true,
};

interface StoredUser {
  user: User;
  password: string;
}

const getUsers = (): StoredUser[] => {
  try {
    return JSON.parse(localStorage.getItem('ashik-users') || '[]');
  } catch { return []; }
};

const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem('ashik-users', JSON.stringify(users));
};

// Initialize admin
const initAdmin = () => {
  const users = getUsers();
  if (!users.find(u => u.user.username === 'ashik')) {
    users.push({ user: ADMIN_USER, password: 'ashik1122' });
    saveUsers(users);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    initAdmin();
    const saved = localStorage.getItem('ashik-current-user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const users = getUsers();
    const found = users.find(u => u.user.username === username && u.password === password);
    if (found) {
      setUser(found.user);
      localStorage.setItem('ashik-current-user', JSON.stringify(found.user));
      return true;
    }
    return false;
  };

  const register = (email: string, username: string, password: string, fullName: string): boolean => {
    const users = getUsers();
    if (users.find(u => u.user.username === username || u.user.email === email)) {
      return false;
    }
    const newUser: User = {
      id: 'user-' + Date.now(),
      username, email, fullName,
      mobile: '', address: '', nidNumber: '',
      nidFront: '', nidBack: '',
      profilePicture: '', coverPicture: '',
      isAdmin: false,
    };
    users.push({ user: newUser, password });
    saveUsers(users);
    setUser(newUser);
    localStorage.setItem('ashik-current-user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ashik-current-user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates, username: user.username, email: user.email };
    setUser(updated);
    localStorage.setItem('ashik-current-user', JSON.stringify(updated));
    const users = getUsers();
    const idx = users.findIndex(u => u.user.id === user.id);
    if (idx >= 0) {
      users[idx].user = updated;
      saveUsers(users);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin: user?.isAdmin || false, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
