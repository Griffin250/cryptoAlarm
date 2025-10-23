import { supabase } from '../lib/supabase';

export class AuthService {
  
  // Sign up new user
  static async signUp(email: string, password: string, metadata: any = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      return { data, error: error?.message || null };
    } catch (error: any) {
      console.error('Error signing up:', error);
      return { data: null, error: error.message };
    }
  }

  // Sign in user
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      return { data, error: error?.message || null };
    } catch (error: any) {
      console.error('Error signing in:', error);
      return { data: null, error: error.message };
    }
  }

  // Sign out user
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error?.message || null };
    } catch (error: any) {
      console.error('Error signing out:', error);
      return { error: error.message };
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      return { data: user, error: error?.message || null };
    } catch (error: any) {
      console.error('Error getting current user:', error);
      return { data: null, error: error.message };
    }
  }

  // Reset password
  static async resetPassword(email: string) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      return { data, error: error?.message || null };
    } catch (error: any) {
      console.error('Error resetting password:', error);
      return { data: null, error: error.message };
    }
  }

  // Update password
  static async updatePassword(newPassword: string) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      return { data, error: error?.message || null };
    } catch (error: any) {
      console.error('Error updating password:', error);
      return { data: null, error: error.message };
    }
  }

  // Subscribe to auth state changes
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export default AuthService;