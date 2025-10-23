import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate URL format
const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

// Create a mock client when env vars are missing (both server and client side)
const createSupabaseClient = () => {
  if (!isValidUrl(supabaseUrl) || !supabaseAnonKey || supabaseUrl?.includes('your_supabase_project_url')) {
    // Return a mock client for both build time and runtime
    console.warn('🔄 Running in Development Mode - Supabase credentials not configured, using mock client')
    
    const mockClient = {
      auth: {
        getUser: () => Promise.resolve({ 
          data: { user: null }, 
          error: { message: 'Supabase not configured' } 
        }),
        signUp: () => Promise.resolve({ 
          data: { user: null }, 
          error: { message: 'Supabase not configured' } 
        }),
        signInWithPassword: () => Promise.resolve({ 
          data: { user: null }, 
          error: { message: 'Supabase not configured' } 
        }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: (callback: any) => {
          // Call callback with null user immediately
          if (callback) callback('SIGNED_OUT', null)
          return { 
            data: { 
              subscription: { unsubscribe: () => {} } 
            } 
          }
        }
      },
      from: (_table: string) => ({
        select: () => Promise.resolve({ 
          data: [], 
          error: { message: 'Supabase not configured' } 
        }),
        insert: () => Promise.resolve({ 
          data: [], 
          error: { message: 'Supabase not configured' } 
        }),
        update: () => Promise.resolve({ 
          data: [], 
          error: { message: 'Supabase not configured' } 
        }),
        delete: () => Promise.resolve({ 
          data: [], 
          error: { message: 'Supabase not configured' } 
        }),
        upsert: () => Promise.resolve({ 
          data: [], 
          error: { message: 'Supabase not configured' } 
        }),
        eq: function() { return this },
        single: function() { return this },
        order: function() { return this },
        limit: function() { return this }
      }),
      channel: () => ({
        on: () => ({ subscribe: () => {} }),
        subscribe: () => {},
        unsubscribe: () => {}
      })
    }
    
    return mockClient as any
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  })
}

export const supabase = createSupabaseClient()

export default supabase