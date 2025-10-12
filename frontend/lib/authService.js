import { supabase } from './supabase'

export class AuthService {
  
  // Sign up new user
  static async signUp(email, password, metadata = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })

      return { data, error }
    } catch (error) {
      console.error('Error signing up:', error)
      return { data: null, error: error.message }
    }
  }

  // Sign in user
  static async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      return { data, error }
    } catch (error) {
      console.error('Error signing in:', error)
      return { data: null, error: error.message }
    }
  }

  // Sign out user
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      console.error('Error signing out:', error)
      return { error: error.message }
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      return { data: user, error }
    } catch (error) {
      console.error('Error getting current user:', error)
      return { data: null, error: error.message }
    }
  }

  // Reset password
  static async resetPassword(email) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      return { data, error }
    } catch (error) {
      console.error('Error resetting password:', error)
      return { data: null, error: error.message }
    }
  }

  // Update password
  static async updatePassword(newPassword) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })

      return { data, error }
    } catch (error) {
      console.error('Error updating password:', error)
      return { data: null, error: error.message }
    }
  }

  // Subscribe to auth state changes
  static onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

export default AuthService