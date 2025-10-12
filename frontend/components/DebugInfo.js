'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { toast } from './ui/toast'
import { QuickAuth } from './QuickAuth'
import { api } from '../lib/api'

export function DebugInfo() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [supabaseTest, setSupabaseTest] = useState('Testing...')
  const [backendTest, setBackendTest] = useState('Testing backend...')

  useEffect(() => {
    // Only run on client side to avoid build issues
    if (typeof window !== 'undefined') {
      checkSupabase()
      checkBackend()
    }
  }, [])

  const checkSupabase = async () => {
    try {
      // Test Supabase connection
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError && userError.message === 'Supabase not configured') {
        setSupabaseTest('⚠️ Supabase not configured - Running in demo mode')
        toast.info('Demo mode: Add Supabase credentials for full functionality')
        return
      }
      
      if (userError) {
        setSupabaseTest(`Auth Error: ${userError.message}`)
        toast.error(`Auth Error: ${userError.message}`)
      } else if (user) {
        setUser(user)
        setSupabaseTest('✅ Supabase connected and user authenticated')
        toast.success('Supabase connected and user authenticated')
      } else {
        setSupabaseTest('⚠️ Supabase connected but no user authenticated')
        toast.info('Please sign in to use alerts')
      }
      
      // Test database connection
      const { data, error } = await supabase.from('alerts').select('count').limit(1)
      
      if (error && error.message === 'Supabase not configured') {
        return // Already handled above
      }
      
      if (error) {
        setSupabaseTest(prev => prev + ` | DB Error: ${error.message}`)
        toast.error(`Database Error: ${error.message}`)
      } else {
        setSupabaseTest(prev => prev + ' | Database accessible')
      }
      
    } catch (error) {
      setSupabaseTest(`Connection Error: ${error.message}`)
      toast.error(`Connection Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const checkBackend = async () => {
    try {
      console.log('Testing backend connection to:', api.defaults.baseURL)
      
      // Test using existing /prices endpoint instead of /health
      const response = await api.get('/prices')
      
      if (response.status === 200) {
        setBackendTest('✅ Backend connected')
        toast.success(`Backend connected: ${api.defaults.baseURL}`)
        console.log('Backend response:', response.data)
      } else {
        setBackendTest(`⚠️ Backend responded with status: ${response.status}`)
      }
    } catch (error) {
      console.error('Backend connection failed:', error)
      
      // Try alternative endpoint
      try {
        const altResponse = await api.get('/test-alert')
        if (altResponse.status === 200) {
          setBackendTest('✅ Backend connected (via test-alert)')
          toast.success(`Backend connected: ${api.defaults.baseURL}`)
        }
      } catch (altError) {
        setBackendTest(`❌ Backend connection failed: ${error.message}`)
        toast.error(`Backend connection failed: ${error.message}`)
      }
    }
  }

  const ensureProfile = async () => {
    try {
      // Check if profile exists
      console.log('Checking profile for user:', user.id)
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('Creating profile for user:', user.id)
        console.log('User object:', user)
        
        const profileData = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email.split('@')[0],
          avatar_url: user.user_metadata?.avatar_url || null
        }
        
        console.log('Inserting profile data:', profileData)
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([profileData])
          .select()
          .single()

        if (createError) {
          console.error('Profile creation error:', createError)
          
          // If RLS error, suggest manual fix
          if (createError.message.includes('row-level security')) {
            toast.error('RLS Policy Issue: Please run the RLS fix in Supabase SQL Editor')
            throw new Error('RLS Policy prevents profile creation. Check console for SQL fix.')
          }
          
          throw createError
        }

        console.log('Profile created successfully:', newProfile)
        toast.success('Profile created successfully!')
        return newProfile
      } else if (profileError) {
        console.error('Profile fetch error:', profileError)
        throw profileError
      }

      console.log('Profile exists:', profile)
      toast.success('Profile already exists!')
      return profile
    } catch (error) {
      console.error('Profile creation failed:', error)
      toast.error(`Profile setup failed: ${error.message}`)
      throw error
    }
  }

  const testCreateAlert = async () => {
    try {
      // First ensure profile exists
      await ensureProfile()

      const testData = {
        name: 'Debug Test Alert',
        description: 'Test alert for debugging',
        symbol: 'BTCUSDT',
        exchange: 'binance',
        alert_type: 'price',
        max_triggers: 1,
        cooldown_minutes: 0,
        conditions: [{
          condition_type: 'price_above',
          target_value: '50000',
          timeframe: '1h',
          operator: 'AND'
        }],
        notifications: [{
          notification_type: 'email',
          destination: 'test@example.com',
          is_enabled: true
        }]
      }

      console.log('Testing alert creation with:', testData)

      const { data, error } = await supabase
        .from('alerts')
        .insert([{
          user_id: user?.id,
          name: testData.name,
          description: testData.description,
          symbol: testData.symbol,
          exchange: testData.exchange,
          alert_type: testData.alert_type,
          max_triggers: testData.max_triggers,
          cooldown_minutes: testData.cooldown_minutes
        }])
        .select()

      if (error) {
        console.error('Test alert creation failed:', error)
        toast.error(`Test failed: ${error.message}`)
      } else {
        console.log('Test alert created:', data)
        toast.success('Test alert created successfully!')
        
        // Clean up test alert
        if (data[0]) {
          await supabase.from('alerts').delete().eq('id', data[0].id)
        }
      }
    } catch (error) {
      console.error('Test error:', error)
      toast.error(`Test error: ${error.message}`)
    }
  }

  if (loading) {
    return <div className="p-4 bg-gray-800 text-white rounded">Loading debug info...</div>
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-red-900/50 text-white rounded">
          <h3 className="font-bold text-red-200">⚠️ Authentication Required</h3>
          <p>Status: {supabaseTest}</p>
          <p className="mt-2 text-sm">You need to sign in to use the alert system.</p>
        </div>
        <QuickAuth />
      </div>
    )
  }

  return (
    <div className="p-4 bg-green-900/50 text-white rounded space-y-2">
      <h3 className="font-bold text-green-200">✅ Debug Information</h3>
      <p>Supabase: {supabaseTest}</p>
      <p>Backend: {backendTest}</p>
      <p className="text-xs">Backend URL: {api.defaults.baseURL}</p>
      <p className="text-xs">User ID: {user.id}</p>
      <p className="text-xs">User Email: {user.email}</p>
      
      {backendTest.includes('❌') && (
        <div className="p-2 bg-red-900/50 rounded text-sm">
          <p className="font-bold text-red-200">⚠️ Backend Connection Failed</p>
          <p>Possible causes:</p>
          <ul className="text-xs list-disc list-inside">
            <li>Backend not running on Render</li>
            <li>CORS not allowing localhost:3000</li>
            <li>Different endpoint path needed</li>
          </ul>
        </div>
      )}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={ensureProfile}
          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
        >
          Fix Profile
        </button>
        <button
          onClick={testCreateAlert}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test Alert
        </button>
        <button
          onClick={checkBackend}
          className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Test Backend
        </button>
        <button
          onClick={async () => {
            // Clear browser cache to fix SW issues
            if ('caches' in window) {
              const cacheNames = await caches.keys()
              await Promise.all(cacheNames.map(name => caches.delete(name)))
              toast.success('Browser cache cleared')
            }
            
            // Unregister service workers
            if ('serviceWorker' in navigator) {
              const registrations = await navigator.serviceWorker.getRegistrations()
              await Promise.all(registrations.map(reg => reg.unregister()))
              toast.success('Service workers cleared')
            }
            
            setTimeout(() => window.location.reload(), 1000)
          }}
          className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          Clear Cache
        </button>
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            window.location.reload()
          }}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}