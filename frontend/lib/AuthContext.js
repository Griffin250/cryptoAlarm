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
          if (error.message === 'Supabase not configured') {
            console.error('Supabase authentication is required but not configured. Please set up NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.')
            setError('Authentication service is not configured. Please contact support.')
          } else {
            console.error('Error getting user:', error)
            setError(error.message)
          }
          setUser(null)
          setProfile(null)
          setLoading(false)
          return
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
      setError(null)
      console.log('Updating profile with data:', profileData)
      
      const { data, error } = await UserService.updateUserProfile(profileData)
      
      if (error) {
        throw new Error(error)
      }
      
      console.log('Profile updated successfully:', data)
      setProfile(data)
      return { data, error: null }
    } catch (error) {
      console.error('Error in updateProfile:', error)
      setError(error.message)
      return { data: null, error: error.message }
    }
  }

  const updateAvatar = async (avatarFile) => {
    try {
      setError(null)
      
      // Convert file to base64 or upload to storage service
      let avatarUrl = null
      
      if (avatarFile && typeof avatarFile === 'string') {
        // If it's already a base64 string or URL
        avatarUrl = avatarFile
      } else if (avatarFile instanceof File) {
        // Convert file to base64 for now
        // In production, you'd upload to a service like Supabase Storage
        const reader = new FileReader()
        avatarUrl = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target.result)
          reader.onerror = (e) => reject(new Error('Failed to read file'))
          reader.readAsDataURL(avatarFile)
        })
      }
      
      if (!avatarUrl) {
        throw new Error('No avatar data provided')
      }
      
      const { data, error } = await UserService.updateUserProfile({ 
        ...profile, 
        avatar_url: avatarUrl 
      })
      
      if (error) {
        throw new Error(error)
      }
      
      setProfile(data)
      return { data, error: null }
    } catch (error) {
      console.error('Error updating avatar:', error)
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
    updateAvatar,
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