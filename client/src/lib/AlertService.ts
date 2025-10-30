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
        throw new Error('User not authenticated')
      }

      // Ensure profile exists
      await this.ensureUserProfile(user)

      const { data: alerts, error } = await supabase
        .from('alerts')
        .select(`
          *,
          alert_conditions (*),
          alert_notifications (*),
          alert_logs (
            id,
            triggered_at,
            trigger_price,
            trigger_conditions
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return { data: alerts, error: null }
    } catch (error: any) {
      console.error('Error fetching alerts:', error)
      return { data: null, error: error.message }
    }
  }

  // Create a new alert
  static async createAlert(alertData: CreateAlertData): Promise<ServiceResponse<Alert>> {
    try {
      if (!this.isSupabaseConfigured()) {
        return this.getDemoError()
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      // Ensure profile exists
      await this.ensureUserProfile(user)

      const { data, error } = await supabase
        .from('alerts')
        .insert([{
          ...alertData,
          user_id: user.id,
          status: 'ACTIVE',
          is_active: true,
          trigger_count: 0
        }])
        .select()
        .single()

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error: any) {
      console.error('Error creating alert:', error)
      return { data: null, error: error.message }
    }
  }

  // Update an existing alert
  static async updateAlert(alertId: string, updates: UpdateAlertData): Promise<ServiceResponse<Alert>> {
    try {
      if (!this.isSupabaseConfigured()) {
        return this.getDemoError()
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('alerts')
        .update(updates)
        .eq('id', alertId)
        .eq('user_id', user.id) // Ensure user can only update their own alerts
        .select()
        .single()

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error: any) {
      console.error('Error updating alert:', error)
      return { data: null, error: error.message }
    }
  }

  // Delete an alert
  static async deleteAlert(alertId: string): Promise<ServiceResponse<boolean>> {
    try {
      if (!this.isSupabaseConfigured()) {
        return this.getDemoError()
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      const { error } = await supabase
        .from('alerts')
        .delete()
        .eq('id', alertId)
        .eq('user_id', user.id) // Ensure user can only delete their own alerts

      if (error) {
        throw error
      }

      return { data: true, error: null }
    } catch (error: any) {
      console.error('Error deleting alert:', error)
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
        throw new Error('User not authenticated')
      }

      const { data: alerts, error } = await supabase
        .from('alerts')
        .select('status, trigger_count')
        .eq('user_id', user.id)

      if (error) {
        throw error
      }

      const stats: AlertStats = {
        total_alerts: alerts?.length || 0,
        active_alerts: alerts?.filter((a: any) => a.status === 'ACTIVE').length || 0,
        triggered_alerts: alerts?.filter((a: any) => a.status === 'TRIGGERED').length || 0,
        total_triggers: alerts?.reduce((sum: number, a: any) => sum + (a.trigger_count || 0), 0) || 0
      }

      return { data: stats, error: null }
    } catch (error: any) {
      console.error('Error fetching alert stats:', error)
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

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('id', alertId)
        .eq('user_id', user.id)
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