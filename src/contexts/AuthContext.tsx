import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupaUser } from '@supabase/supabase-js';

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
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithUsername: (username: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, password: string, fullName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  allProfiles: User[];
  refreshProfiles: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapProfile = (profile: any, isAdmin: boolean): User => ({
  id: profile.user_id,
  username: profile.username,
  email: profile.email,
  fullName: profile.full_name || '',
  mobile: profile.mobile || '',
  address: profile.address || '',
  nidNumber: profile.nid_number || '',
  nidFront: profile.nid_front || '',
  nidBack: profile.nid_back || '',
  profilePicture: profile.profile_picture || '',
  coverPicture: profile.cover_picture || '',
  isAdmin,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allProfiles, setAllProfiles] = useState<User[]>([]);

  const fetchUserProfile = async (supaUser: SupaUser) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', supaUser.id)
      .single();

    if (!profile) return null;

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', supaUser.id);

    const admin = roleData?.some(r => r.role === 'admin') || false;
    setIsAdmin(admin);
    const mapped = mapProfile(profile, admin);
    setUser(mapped);
    return mapped;
  };

  const refreshProfiles = async () => {
    const { data } = await supabase.from('profiles').select('*');
    if (data) {
      setAllProfiles(data.map(p => mapProfile(p, false)));
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Use setTimeout to avoid Supabase deadlock
        setTimeout(() => fetchUserProfile(session.user), 0);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  };

  const loginWithUsername = async (username: string, password: string): Promise<boolean> => {
    // Use server-side RPC to look up email by username (avoids needing public profiles access)
    const { data: email } = await supabase.rpc('get_email_by_username', { _username: username });
    if (!email) return false;
    return login(email, password);
  };

  const register = async (email: string, username: string, password: string, fullName: string): Promise<boolean> => {
    // Check if username is taken
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single();

    if (existing) return false;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, full_name: fullName },
      },
    });
    return !error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const dbUpdates: Record<string, any> = {};
    if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
    if (updates.mobile !== undefined) dbUpdates.mobile = updates.mobile;
    if (updates.address !== undefined) dbUpdates.address = updates.address;
    if (updates.nidNumber !== undefined) dbUpdates.nid_number = updates.nidNumber;
    if (updates.nidFront !== undefined) dbUpdates.nid_front = updates.nidFront;
    if (updates.nidBack !== undefined) dbUpdates.nid_back = updates.nidBack;
    if (updates.profilePicture !== undefined) dbUpdates.profile_picture = updates.profilePicture;
    if (updates.coverPicture !== undefined) dbUpdates.cover_picture = updates.coverPicture;

    await supabase.from('profiles').update(dbUpdates).eq('user_id', user.id);
    setUser(prev => prev ? { ...prev, ...updates, username: prev.username, email: prev.email } : null);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, loginWithUsername, register, logout, updateProfile, allProfiles, refreshProfiles }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
