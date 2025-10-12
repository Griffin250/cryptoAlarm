import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a mock client when env vars are missing (both server and client side)
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client for both build time and runtime
    console.warn('Supabase environment variables not found - using mock client')
    
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
        onAuthStateChange: (callback) => {
          // Call callback with null user immediately
          if (callback) callback('SIGNED_OUT', null)
          return { 
            data: { 
              subscription: { unsubscribe: () => {} } 
            } 
          }
        }
      },
      from: (table) => ({
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
    
    return mockClient
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