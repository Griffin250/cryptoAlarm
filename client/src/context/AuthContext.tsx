import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, UserProfile, AuthContextType } from '../types';
import { AuthService } from '../services/authService';
import { AlertService } from '../services/alertService';
import { supabase } from '../lib/supabase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          if (error.message === 'Supabase not configured') {
            console.error('Supabase authentication is required but not configured. Please set up VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
            setError('Authentication service is not configured. Please contact support.');
          } else {
            console.error('Error getting user:', error);
            setError(error.message);
          }
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        setUser(user);
        
        if (user) {
          // Get user profile
          const { data: profile, error: profileError } = await AlertService.getUserProfile();
          if (!profileError && profile) {
            setProfile(profile);
          }
        }
      } catch (error: any) {
        console.error('Error getting initial session:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setUser(session?.user as User ?? null);
        
        if (session?.user) {
          // Get user profile
          const { data: profile, error: profileError } = await AlertService.getUserProfile();
          if (!profileError && profile) {
            setProfile(profile);
          }
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firstName?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await AuthService.signUp(email, password, { firstName });
      
      if (error) {
        throw new Error(error);
      }
      
      return { error: null };
    } catch (error: any) {
      setError(error.message);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await AuthService.signIn(email, password);
      
      if (error) {
        throw new Error(error);
      }
      
      return { error: null };
    } catch (error: any) {
      setError(error.message);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await AuthService.signOut();
      
      if (error) {
        throw new Error(error);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setError(null);
      console.log('Updating profile with data:', updates);
      
      const { data, error } = await AlertService.updateUserProfile(updates);
      
      if (error) {
        throw new Error(error);
      }
      
      console.log('Profile updated successfully:', data);
      if (data) {
        setProfile(data);
      }
      return { error: null };
    } catch (error: any) {
      console.error('Error in updateProfile:', error);
      setError(error.message);
      return { error: error.message };
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthContext;