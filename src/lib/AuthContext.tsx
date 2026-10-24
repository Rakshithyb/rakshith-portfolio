import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  userId: string | null;
  isLoading: boolean;
  isSupabaseConnected: boolean;
  login: (email: string, password?: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SIMULATED_AUTH_KEY = 'rp_cms_auth_simulated';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkAuth() {
      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setIsAuthenticated(true);
          setUserEmail(session.user.email || null);
          setUserId(session.user.id);
        } else {
          setIsAuthenticated(false);
          setUserEmail(null);
          setUserId(null);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            setIsAuthenticated(true);
            setUserEmail(session.user.email || null);
            setUserId(session.user.id);
          } else {
            setIsAuthenticated(false);
            setUserEmail(null);
            setUserId(null);
          }
        });

        setIsLoading(false);
        return () => subscription.unsubscribe();
      } else {
        // Local simulated auth check
        const stored = localStorage.getItem(SIMULATED_AUTH_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.authenticated) {
              setIsAuthenticated(true);
              setUserEmail(parsed.email || 'admin@rakshith.dev');
              setUserId(parsed.id || 'local-admin-uuid');
            }
          } catch {
            localStorage.removeItem(SIMULATED_AUTH_KEY);
          }
        }
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    if (isSupabaseConfigured && supabase) {
      if (!password) {
        return { error: 'Password is required' };
      }
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return { error: error.message };
      }
      // Check if user is in admin allowlist
      const { data: adminCheck } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (!adminCheck) {
        await supabase.auth.signOut();
        return { error: 'Access denied: Your account is not authorized as an administrator.' };
      }

      setIsAuthenticated(true);
      setUserEmail(data.user.email || null);
      setUserId(data.user.id);
      return { error: null };
    }

    // Local simulated login
    // Accept valid email format for local development
    if (!email || !email.includes('@')) {
      return { error: 'Please enter a valid email address.' };
    }

    const payload = {
      authenticated: true,
      email,
      id: 'local-admin-uuid',
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(SIMULATED_AUTH_KEY, JSON.stringify(payload));
    setIsAuthenticated(true);
    setUserEmail(email);
    setUserId(payload.id);
    return { error: null };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(SIMULATED_AUTH_KEY);
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userEmail,
        userId,
        isLoading,
        isSupabaseConnected: isSupabaseConfigured,
        login,
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
