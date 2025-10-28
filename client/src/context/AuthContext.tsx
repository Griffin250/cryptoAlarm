import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { AuthService, type UserMetadata, type ProfileUpdateData } from '../services/authService';
import SessionManager from '../services/sessionManager';
import { supabase } from '../lib/supabase';

// Enhanced user profile type
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone?: string;
  preferences?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  last_login_at?: string;
}

// Auth context type with enhanced functionality
export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, metadata?: UserMetadata) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  
  // Profile methods
  updateProfile: (updates: ProfileUpdateData) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
  
  // Password methods
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  
  // Session methods
  refreshSession: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user profile from our enhanced auth service
  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await AuthService.getUserProfile(userId);
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  }, []);

  // Initialize auth state and session management
  useEffect(() => {
    // Initialize session manager
    SessionManager.initialize();

    // Listen for session events
    const handleSessionExpired = () => {
      setError('Your session has expired. Please sign in again.');
      setUser(null);
      setProfile(null);
      setSession(null);
      setLoading(false);
    };

    const handleSessionRefreshed = (event: CustomEvent) => {
      setSession(event.detail.session);
      setError(null);
    };

    window.addEventListener('sessionExpired', handleSessionExpired);
    window.addEventListener('sessionRefreshed', handleSessionRefreshed as EventListener);

    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: sessionData, error: sessionError } = await AuthService.getCurrentSession();
        
        if (sessionError) {
          if (sessionError.includes('not configured')) {
            console.error('Supabase authentication is not configured properly.');
            setError('Authentication service is not available. Please contact support.');
          } else {
            console.error('Session error:', sessionError);
            setError(sessionError);
          }
          setSession(null);
          setUser(null);
          setProfile(null);
          return;
        }

        setSession(sessionData);
        
        if (sessionData?.user) {
          setUser(sessionData.user);
          
          // Fetch user profile
          const userProfile = await fetchUserProfile(sessionData.user.id);
          setProfile(userProfile);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error: any) {
        console.error('Error initializing auth:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch updated user profile
          const userProfile = await fetchUserProfile(session.user.id);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
        
        // Clear loading state after auth state change
        if (loading) {
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('sessionExpired', handleSessionExpired);
      window.removeEventListener('sessionRefreshed', handleSessionRefreshed as EventListener);
      SessionManager.destroy();
    };
  }, [fetchUserProfile, loading]);

  // Enhanced sign up with metadata support
  const signUp = async (email: string, password: string, metadata: UserMetadata = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await AuthService.signUp(email, password, metadata);
      
      if (error) {
        setError(error);
        return { error };
      }
      
      return { error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred during sign up';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Enhanced sign in
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await AuthService.signIn(email, password);
      
      if (error) {
        setError(error);
        return { error };
      }
      
      return { error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred during sign in';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Enhanced sign out
  const signOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await AuthService.signOut();
      
      if (error) {
        setError(error);
      }
      
      // Clear local state
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error: any) {
      console.error('Error during sign out:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced profile update
  const updateProfile = async (updates: ProfileUpdateData) => {
    setError(null);
    
    try {
      const { data, error } = await AuthService.updateProfile(updates);
      
      if (error) {
        setError(error);
        return { error };
      }
      
      // Refresh profile data
      if (data && user) {
        const refreshedProfile = await fetchUserProfile(user.id);
        setProfile(refreshedProfile);
      }
      
      return { error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update profile';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  // Refresh user profile
  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const refreshedProfile = await fetchUserProfile(user.id);
      setProfile(refreshedProfile);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    setError(null);
    
    try {
      const { error } = await AuthService.resetPassword(email);
      
      if (error) {
        setError(error);
        return { error };
      }
      
      return { error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send reset email';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  // Update password
  const updatePassword = async (newPassword: string) => {
    setError(null);
    
    try {
      const { error } = await AuthService.updatePassword(newPassword);
      
      if (error) {
        setError(error);
        return { error };
      }
      
      return { error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update password';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  // Refresh session using SessionManager
  const refreshSession = async () => {
    try {
      const newSession = await SessionManager.forceRefresh();
      
      if (newSession) {
        setSession(newSession);
        setUser(newSession.user);
        
        // Fetch updated profile
        if (newSession.user) {
          const userProfile = await fetchUserProfile(newSession.user.id);
          setProfile(userProfile);
        }
      } else {
        console.error('Failed to refresh session');
        setError('Unable to refresh your session. Please sign in again.');
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
      setError('Session refresh failed. Please sign in again.');
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Compute derived state
  const isAuthenticated = !!user;
  const isEmailVerified = user?.email_confirmed_at != null;

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    error,
    isAuthenticated,
    isEmailVerified,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
    resetPassword,
    updatePassword,
    refreshSession,
    clearError,
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