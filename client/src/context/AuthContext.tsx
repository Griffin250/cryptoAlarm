import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js/auth'
import { supabase } from '../lib/supabase'

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  phone_number?: string
  timezone?: string
  notification_preferences?: {
    email: boolean
    sms: boolean
    push: boolean
  }
  created_at?: string
  updated_at?: string
}

export interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  isAuthenticated: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user profile from database
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data as UserProfile)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setProfile(null)
    }
  }

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        // Defer profile fetch to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id)
          }, 0)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Sign in
  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return { error: error.message }
      }

      return {}
    } catch (err: any) {
      const errorMessage = err?.message || 'An error occurred during sign in'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  // Sign up
  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setError(null)
      const redirectUrl = `${window.location.origin}/dashboard`
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName || '',
          }
        }
      })

      if (error) {
        setError(error.message)
        return { error: error.message }
      }

      return {}
    } catch (err: any) {
      const errorMessage = err?.message || 'An error occurred during sign up'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      setError(null)
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      setProfile(null)
    } catch (err: any) {
      setError(err?.message || 'An error occurred during sign out')
    }
  }

  // Update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) return { error: 'No user logged in' }
      
      setError(null)
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) {
        setError(error.message)
        return { error: error.message }
      }

      // Refresh profile
      await fetchProfile(user.id)
      return {}
    } catch (err: any) {
      const errorMessage = err?.message || 'An error occurred updating profile'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    isAuthenticated: !!user,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
