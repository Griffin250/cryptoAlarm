import { supabase } from './supabase'

// Types for Alert Service
export interface Alert {
  id: string
  symbol: string
  alert_type: 'PRICE_TARGET' | 'PERCENTAGE_CHANGE'
  direction: 'ABOVE' | 'BELOW'
  target_price?: number
  percentage_change?: number
  phone_number: string
  status: 'ACTIVE' | 'TRIGGERED' | 'CANCELLED' | 'PAUSED'
  created_at: string
  triggered_at?: string
  trigger_count: number
  is_active: boolean
  user_id: string
}

export interface AlertStats {
  total_alerts: number
  active_alerts: number
  triggered_alerts: number
  total_triggers: number
}

export interface CreateAlertData {
  symbol: string
  alert_type: 'PRICE_TARGET' | 'PERCENTAGE_CHANGE'
  direction: 'ABOVE' | 'BELOW'
  target_price?: number
  percentage_change?: number
  phone_number: string
  user_id: string
}

export interface UpdateAlertData {
  symbol?: string
  alert_type?: 'PRICE_TARGET' | 'PERCENTAGE_CHANGE'
  direction?: 'ABOVE' | 'BELOW'
  target_price?: number
  percentage_change?: number
  phone_number?: string
  status?: 'ACTIVE' | 'TRIGGERED' | 'CANCELLED' | 'PAUSED'
  is_active?: boolean
  trigger_count?: number
  triggered_at?: string
}

export interface ServiceResponse<T> {
  data: T | null
  error: any
}

// Alert Service - handles all CRUD operations for alerts
export class AlertService {

  // Check if Supabase is properly configured
  static isSupabaseConfigured(): boolean {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
  }

  // Return demo error when Supabase is not configured
  static getDemoError(): ServiceResponse<any> {
    return { 
      error: { 
        message: 'Demo mode: Supabase not configured. Add environment variables for full functionality.' 
      },
      data: null 
    }
  }
  
  // Ensure user profile exists
  static async ensureUserProfile(user: any): Promise<any> {
    try {
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('Creating profile for user:', user.id)
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email.split('@')[0],
            avatar_url: user.user_metadata?.avatar_url || null
          }])
          .select()
          .single()

        if (createError) {
          throw createError
        }

        console.log('Profile created successfully:', newProfile)
        return newProfile
      } else if (profileError) {
        throw profileError
      }

      console.log('Profile exists:', profile)
      return profile
    } catch (error: any) {
      console.error('Profile creation failed:', error)
      throw new Error(`Profile setup failed: ${error.message}`)
    }
  }
  
  // Get all alerts for the current user
  static async getUserAlerts(): Promise<ServiceResponse<Alert[]>> {
    try {
      if (!this.isSupabaseConfigured()) {
        return this.getDemoError()
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        console.error('❌ User not authenticated:', userError)
        return { data: null, error: 'User not authenticated' }
      }

      console.log('📡 Fetching alerts from database for user:', user.email)

      const { data: alerts, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Database error:', error)
        throw error
      }

      console.log(`✅ Fetched ${alerts?.length || 0} alerts for user`)
      return { data: alerts, error: null }
    } catch (error: any) {
      console.error('❌ Error fetching alerts:', error)
      return { data: null, error: error.message }
    }
  }

  // Helper function to add timeout to promises
  private static withTimeout<T>(promise: Promise<T>, timeoutMs: number = 10000): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms. This usually means the database schema is missing required columns. Please run the migration SQL.`)), timeoutMs)
      )
    ])
  }

  // Create a new alert
  static async createAlert(alertData: CreateAlertData): Promise<ServiceResponse<Alert>> {
    try {
      if (!this.isSupabaseConfigured()) {
        return this.getDemoError()
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        console.error('❌ User not authenticated:', userError)
        return { data: null, error: 'User not authenticated. Please sign in.' }
      }

      console.log('📝 Creating alert for user:', user.email)
      console.log('Alert data:', alertData)

      // Prepare the data for insertion
      const insertData: any = {
        user_id: alertData.user_id,
        symbol: alertData.symbol,
        alert_type: alertData.alert_type,
        direction: alertData.direction,
        phone_number: alertData.phone_number,
        status: 'ACTIVE',
        is_active: true,
        trigger_count: 0,
        name: `${alertData.symbol} ${alertData.alert_type}`, // Auto-generate name
        exchange: 'binance'
      }

      // Add type-specific fields
      if (alertData.alert_type === 'PRICE_TARGET' && alertData.target_price) {
        insertData.target_price = alertData.target_price
      } else if (alertData.alert_type === 'PERCENTAGE_CHANGE' && alertData.percentage_change) {
        insertData.percentage_change = alertData.percentage_change
      }

      console.log('🔄 Sending insert request to database...')

      const insertPromise = supabase
        .from('alerts')
        .insert([insertData])
        .select()
        .single()

      const result = await this.withTimeout(insertPromise, 10000)
      const { data, error } = result as any

      console.log('📥 Database response received')

      if (error) {
        console.error('❌ Database error:', error)
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        })
        throw error
      }

      console.log('✅ Alert created successfully:', data.id)
      return { data, error: null }
    } catch (error: any) {
      console.error('❌ Error creating alert:', error)
      console.error('Full error object:', error)
      return { data: null, error: error.message || 'Failed to create alert. Please check if database schema is up to date.' }
    }
  }

  // Update an existing alert
  static async updateAlert(alertId: string, updates: UpdateAlertData): Promise<ServiceResponse<Alert>> {
    try {
      if (!this.isSupabaseConfigured()) {
        return this.getDemoError()
      }

      // TODO: Re-enable authentication when auth is set up
      // const { data: { user }, error: userError } = await supabase.auth.getUser()
      // if (userError || !user) {
      //   throw new Error('User not authenticated')
      // }

      console.log('✏️ Updating alert:', alertId, updates)

      const { data, error } = await supabase
        .from('alerts')
        .update(updates)
        .eq('id', alertId)
        // .eq('user_id', user.id) // TODO: Re-enable when auth is set up
        .select()
        .single()

      if (error) {
        console.error('❌ Database error:', error)
        throw error
      }

      console.log('✅ Alert updated successfully')
      return { data, error: null }
    } catch (error: any) {
      console.error('❌ Error updating alert:', error)
      return { data: null, error: error.message }
    }
  }

  // Delete an alert
  static async deleteAlert(alertId: string): Promise<ServiceResponse<boolean>> {
    try {
      if (!this.isSupabaseConfigured()) {
        return this.getDemoError()
      }

      // TODO: Re-enable authentication when auth is set up
      // const { data: { user }, error: userError } = await supabase.auth.getUser()
      // if (userError || !user) {
      //   throw new Error('User not authenticated')
      // }

      console.log('🗑️ Deleting alert:', alertId)

      const { error } = await supabase
        .from('alerts')
        .delete()
        .eq('id', alertId)
        // .eq('user_id', user.id) // TODO: Re-enable when auth is set up

      if (error) {
        console.error('❌ Database error:', error)
        throw error
      }

      console.log('✅ Alert deleted successfully')
      return { data: true, error: null }
    } catch (error: any) {
      console.error('❌ Error deleting alert:', error)
      return { data: null, error: error.message }
    }
  }

  // Get alert statistics for the current user
  static async getAlertStats(): Promise<ServiceResponse<AlertStats>> {
    try {
      if (!this.isSupabaseConfigured()) {
        return this.getDemoError()
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        console.error('❌ User not authenticated:', userError)
        return { data: null, error: 'User not authenticated' }
      }

      console.log('📊 Fetching alert statistics for user:', user.email)

      const { data: alerts, error } = await supabase
        .from('alerts')
        .select('status, trigger_count')
        .eq('user_id', user.id)

      if (error) {
        console.error('❌ Database error:', error)
        throw error
      }

      const stats: AlertStats = {
        total_alerts: alerts?.length || 0,
        active_alerts: alerts?.filter((a: any) => a.status === 'ACTIVE').length || 0,
        triggered_alerts: alerts?.filter((a: any) => a.status === 'TRIGGERED').length || 0,
        total_triggers: alerts?.reduce((sum: number, a: any) => sum + (a.trigger_count || 0), 0) || 0
      }

      console.log('✅ Stats:', stats)
      return { data: stats, error: null }
    } catch (error: any) {
      console.error('❌ Error fetching alert stats:', error)
      return { data: null, error: error.message }
    }
  }

  // Toggle alert active status
  static async toggleAlertStatus(alertId: string, isActive: boolean): Promise<ServiceResponse<Alert>> {
    try {
      if (!this.isSupabaseConfigured()) {
        return this.getDemoError()
      }

      console.log(`🔄 Toggling alert ${alertId} to ${isActive ? 'active' : 'paused'}`)

      const updates: UpdateAlertData = {
        is_active: isActive,
        status: isActive ? 'ACTIVE' : 'PAUSED'
      }

      const { data, error } = await supabase
        .from('alerts')
        .update(updates)
        .eq('id', alertId)
        .select()
        .single()

      if (error) {
        console.error('❌ Database error:', error)
        throw error
      }

      console.log('✅ Alert status toggled successfully')
      return { data, error: null }
    } catch (error: any) {
      console.error('❌ Error toggling alert status:', error)
      return { data: null, error: error.message }
    }
  }

  // Subscribe to real-time alert updates
  static subscribeToAlerts(callback: (payload: any) => void) {
    try {
      if (!this.isSupabaseConfigured()) {
        console.warn('Supabase not configured, real-time updates disabled')
        return null
      }

      const subscription = supabase
        .channel('alerts')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'alerts' 
          }, 
          callback
        )
        .subscribe()

      return subscription
    } catch (error) {
      console.error('Error subscribing to alerts:', error)
      return null
    }
  }

  // Get a specific alert by ID
  static async getAlert(alertId: string): Promise<ServiceResponse<Alert>> {
    try {
      if (!this.isSupabaseConfigured()) {
        return this.getDemoError()
      }

      // TODO: Re-enable authentication when auth is set up
      // const { data: { user }, error: userError } = await supabase.auth.getUser()
      // if (userError || !user) {
      //   throw new Error('User not authenticated')
      // }

      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('id', alertId)
        // .eq('user_id', user.id) // TODO: Re-enable when auth is set up
        .single()

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error: any) {
      console.error('Error fetching alert:', error)
      return { data: null, error: error.message }
    }
  }

  // Log an alert trigger
  static async logAlertTrigger(alertId: string, triggerData: any): Promise<ServiceResponse<any>> {
    try {
      if (!this.isSupabaseConfigured()) {
        return this.getDemoError()
      }

      const { data, error } = await supabase
        .from('alert_logs')
        .insert([{
          alert_id: alertId,
          triggered_at: new Date().toISOString(),
          trigger_price: triggerData.trigger_price,
          trigger_conditions: triggerData.trigger_conditions,
          market_data: triggerData.market_data,
          notification_status: triggerData.notification_status
        }])
        .select()
        .single()

      if (error) {
        throw error
      }

      // Update alert trigger count
      const alertResponse = await this.getAlert(alertId)
      const currentTriggerCount = alertResponse.data?.trigger_count || 0
      await this.updateAlert(alertId, { 
        trigger_count: currentTriggerCount + 1,
        triggered_at: new Date().toISOString(),
        status: 'TRIGGERED'
      })

      return { data, error: null }
    } catch (error: any) {
      console.error('Error logging alert trigger:', error)
      return { data: null, error: error.message }
    }
  }
}

export default AlertService