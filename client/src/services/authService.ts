import { supabase } from '../lib/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

// Types for better type safety
export interface AuthResponse<T = any> {
  data: T | null;
  error: string | null;
}

export interface UserMetadata {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatar_url?: string;
  phone?: string;
  preferences?: Record<string, any>;
}

export interface SignUpData {
  email: string;
  password: string;
  metadata?: UserMetadata;
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatar_url?: string;
  phone?: string;
}

export class AuthService {
  
  // Enhanced sign up with better validation and user profile creation
  static async signUp(email: string, password: string, metadata: UserMetadata = {}): Promise<AuthResponse<{ user: User | null; session: Session | null }>> {
    try {
      // Validate input
      if (!email || !email.includes('@')) {
        return { data: null, error: 'Please enter a valid email address' };
      }

      if (!password || password.length < 6) {
        return { data: null, error: 'Password must be at least 6 characters long' };
      }

      // Prepare metadata
      const userMetadata = {
        fullName: metadata.fullName || `${metadata.firstName || ''} ${metadata.lastName || ''}`.trim(),
        firstName: metadata.firstName,
        lastName: metadata.lastName,
        avatar_url: metadata.avatar_url,
        phone: metadata.phone,
        preferences: metadata.preferences || {
          emailNotifications: true,
          pushNotifications: true,
          marketingEmails: false
        }
      };

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata,
          emailRedirectTo: `${window.location.origin}/auth/verify`
        }
      });

      if (error) {
        return { data: null, error: this.formatAuthError(error) };
      }

      // If user is immediately confirmed, create profile
      if (data.user && data.session) {
        await this.createUserProfile(data.user, userMetadata);
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error signing up:', error);
      return { data: null, error: 'An unexpected error occurred during sign up' };
    }
  }

  // Enhanced sign in with better error handling
  static async signIn(email: string, password: string): Promise<AuthResponse<{ user: User | null; session: Session | null }>> {
    try {
      // Validate input
      if (!email || !email.includes('@')) {
        return { data: null, error: 'Please enter a valid email address' };
      }

      if (!password) {
        return { data: null, error: 'Please enter your password' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { data: null, error: this.formatAuthError(error) };
      }

      // Update last login timestamp
      if (data.user) {
        await this.updateLastLogin(data.user.id);
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error signing in:', error);
      return { data: null, error: 'An unexpected error occurred during sign in' };
    }
  }

  // Enhanced sign out with cleanup
  static async signOut(): Promise<AuthResponse<null>> {
    try {
      // Clear local storage
      this.clearLocalUserData();
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { error: this.formatAuthError(error), data: null };
      }

      return { error: null, data: null };
    } catch (error: any) {
      console.error('Error signing out:', error);
      return { error: 'An error occurred during sign out', data: null };
    }
  }

  // Get current user with session validation
  static async getCurrentUser(): Promise<AuthResponse<User>> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        return { data: null, error: this.formatAuthError(error) };
      }

      return { data: user, error: null };
    } catch (error: any) {
      console.error('Error getting current user:', error);
      return { data: null, error: 'Failed to get user information' };
    }
  }

  // Get current session
  static async getCurrentSession(): Promise<AuthResponse<Session>> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        return { data: null, error: this.formatAuthError(error) };
      }

      return { data: session, error: null };
    } catch (error: any) {
      console.error('Error getting current session:', error);
      return { data: null, error: 'Failed to get session information' };
    }
  }

  // Enhanced password reset
  static async resetPassword(email: string): Promise<AuthResponse<null>> {
    try {
      if (!email || !email.includes('@')) {
        return { data: null, error: 'Please enter a valid email address' };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        return { data: null, error: this.formatAuthError(error) };
      }

      return { data: null, error: null };
    } catch (error: any) {
      console.error('Error resetting password:', error);
      return { data: null, error: 'Failed to send password reset email' };
    }
  }

  // Update password with validation
  static async updatePassword(newPassword: string): Promise<AuthResponse<User>> {
    try {
      if (!newPassword || newPassword.length < 6) {
        return { data: null, error: 'Password must be at least 6 characters long' };
      }

      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { data: null, error: this.formatAuthError(error) };
      }

      return { data: data.user, error: null };
    } catch (error: any) {
      console.error('Error updating password:', error);
      return { data: null, error: 'Failed to update password' };
    }
  }

  // Update user profile
  static async updateProfile(profileData: ProfileUpdateData): Promise<AuthResponse<User>> {
    try {
      const metadata = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        fullName: profileData.fullName || `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim(),
        avatar_url: profileData.avatar_url,
        phone: profileData.phone
      };

      const { data, error } = await supabase.auth.updateUser({
        data: metadata
      });

      if (error) {
        return { data: null, error: this.formatAuthError(error) };
      }

      // Also update the profile table
      if (data.user) {
        await this.updateUserProfileTable(data.user.id, metadata);
      }

      return { data: data.user, error: null };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return { data: null, error: 'Failed to update profile' };
    }
  }

  // Refresh session
  static async refreshSession(): Promise<AuthResponse<Session>> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        return { data: null, error: this.formatAuthError(error) };
      }

      return { data: data.session, error: null };
    } catch (error: any) {
      console.error('Error refreshing session:', error);
      return { data: null, error: 'Failed to refresh session' };
    }
  }

  // Subscribe to auth state changes
  static onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Create user profile in profiles table
  private static async createUserProfile(user: User, metadata: UserMetadata) {
    try {
      const profile = {
        id: user.id,
        email: user.email,
        full_name: metadata.fullName,
        first_name: metadata.firstName,
        last_name: metadata.lastName,
        avatar_url: metadata.avatar_url,
        phone: metadata.phone,
        preferences: metadata.preferences,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .insert([profile]);

      if (error) {
        console.error('Error creating user profile:', error);
      }
    } catch (error) {
      console.error('Failed to create user profile:', error);
    }
  }

  // Update user profile table
  private static async updateUserProfileTable(userId: string, metadata: UserMetadata) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: metadata.fullName,
          first_name: metadata.firstName,
          last_name: metadata.lastName,
          avatar_url: metadata.avatar_url,
          phone: metadata.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user profile:', error);
      }
    } catch (error) {
      console.error('Failed to update user profile:', error);
    }
  }

  // Update last login timestamp
  private static async updateLastLogin(userId: string) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          last_login_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating last login:', error);
      }
    } catch (error) {
      console.error('Failed to update last login:', error);
    }
  }

  // Format Supabase auth errors into user-friendly messages
  private static formatAuthError(error: AuthError): string {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 'Email not confirmed':
        return 'Please check your email and click the confirmation link before signing in.';
      case 'User already registered':
        return 'An account with this email already exists. Please sign in instead.';
      case 'Password should be at least 6 characters':
        return 'Password must be at least 6 characters long.';
      case 'Unable to validate email address: invalid format':
        return 'Please enter a valid email address.';
      case 'Signup is disabled':
        return 'Account registration is currently disabled. Please contact support.';
      default:
        return error.message || 'An authentication error occurred. Please try again.';
    }
  }

  // Clear local user data
  private static clearLocalUserData() {
    try {
      // Clear any user-specific data from localStorage
      const keysToRemove = [
        'crypto-alarm-user-preferences',
        'crypto-alarm-alerts',
        'crypto-alarm-portfolio',
        'crypto-alarm-last-activity'
      ];

      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing local user data:', error);
    }
  }

  // Check if user session is valid
  static async isSessionValid(): Promise<boolean> {
    try {
      const { data } = await this.getCurrentSession();
      return data !== null && new Date(data.expires_at || 0) > new Date();
    } catch {
      return false;
    }
  }

  // Get user profile from profiles table
  static async getUserProfile(userId: string): Promise<AuthResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return { data: null, error: 'Failed to load user profile' };
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error getting user profile:', error);
      return { data: null, error: 'Failed to load user profile' };
    }
  }
}

export default AuthService;