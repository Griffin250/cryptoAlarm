'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { AuthService } from '../lib/authService'
import { UserService } from '../lib/alertService'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          throw error
        }

        setUser(user)
        
        if (user) {
          // Get user profile
          const { data: profile, error: profileError } = await UserService.getUserProfile()
          if (!profileError) {
            setProfile(profile)
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Get user profile
          const { data: profile, error: profileError } = await UserService.getUserProfile()
          if (!profileError) {
            setProfile(profile)
          }
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, metadata) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await AuthService.signUp(email, password, metadata)
      
      if (error) {
        throw error
      }
      
      return { data, error: null }
    } catch (error) {
      setError(error.message)
      return { data: null, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await AuthService.signIn(email, password)
      
      if (error) {
        throw error
      }
      
      return { data, error: null }
    } catch (error) {
      setError(error.message)
      return { data: null, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await AuthService.signOut()
      
      if (error) {
        throw error
      }
      
      return { error: null }
    } catch (error) {
      setError(error.message)
      return { error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (profileData) => {
    try {
      const { data, error } = await UserService.updateUserProfile(profileData)
      
      if (error) {
        throw error
      }
      
      setProfile(data)
      return { data, error: null }
    } catch (error) {
      setError(error.message)
      return { data: null, error: error.message }
    }
  }

  const value = {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

export default AuthContext