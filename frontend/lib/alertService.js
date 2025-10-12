import { supabase } from './supabase'

// Alert Service - handles all CRUD operations for alerts
export class AlertService {
  
  // Ensure user profile exists
  static async ensureUserProfile(user) {
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
    } catch (error) {
      console.error('Profile creation failed:', error)
      throw new Error(`Profile setup failed: ${error.message}`)
    }
  }
  
  // Get all alerts for the current user
  static async getUserAlerts() {
    try {
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
    } catch (error) {
      console.error('Error fetching alerts:', error)
      return { data: null, error: error.message }
    }
  }

  // Get a specific alert by ID
  static async getAlert(alertId) {
    try {
      const { data: alert, error } = await supabase
        .from('alerts')
        .select(`
          *,
          alert_conditions (*),
          alert_notifications (*),
          alert_logs (
            id,
            triggered_at,
            trigger_price,
            trigger_conditions,
            market_data
          )
        `)
        .eq('id', alertId)
        .single()

      if (error) {
        throw error
      }

      return { data: alert, error: null }
    } catch (error) {
      console.error('Error fetching alert:', error)
      return { data: null, error: error.message }
    }
  }

  // Create a new alert
  static async createAlert(alertData) {
    try {
      console.log('AlertService.createAlert called with:', alertData)
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('User authentication error:', userError)
        throw new Error('User not authenticated')
      }

      console.log('User authenticated:', user.id)

      // Ensure profile exists before creating alert
      await this.ensureUserProfile(user)

      // Prepare alert data for insertion
      const alertInsertData = {
        user_id: user.id,
        name: alertData.name,
        description: alertData.description,
        symbol: alertData.symbol.toUpperCase(),
        exchange: alertData.exchange || 'binance',
        alert_type: alertData.alert_type,
        max_triggers: alertData.max_triggers || 1,
        cooldown_minutes: alertData.cooldown_minutes || 0,
        is_active: alertData.is_active ?? true
      }

      console.log('Inserting alert with data:', alertInsertData)

      // Insert the main alert
      const { data: alert, error: alertError } = await supabase
        .from('alerts')
        .insert([alertInsertData])
        .select()
        .single()

      if (alertError) {
        console.error('Alert insertion error:', alertError)
        throw alertError
      }

      console.log('Alert created successfully:', alert)

      // Insert alert conditions
      if (alertData.conditions && alertData.conditions.length > 0) {
        const conditions = alertData.conditions.map(condition => ({
          alert_id: alert.id,
          condition_type: condition.condition_type,
          target_value: condition.target_value,
          target_value_2: condition.target_value_2,
          timeframe: condition.timeframe || '1h',
          operator: condition.operator || 'AND'
        }))

        const { error: conditionsError } = await supabase
          .from('alert_conditions')
          .insert(conditions)

        if (conditionsError) {
          throw conditionsError
        }
      }

      // Insert alert notifications
      if (alertData.notifications && alertData.notifications.length > 0) {
        const notifications = alertData.notifications.map(notification => ({
          alert_id: alert.id,
          notification_type: notification.notification_type,
          destination: notification.destination,
          is_enabled: notification.is_enabled ?? true
        }))

        const { error: notificationsError } = await supabase
          .from('alert_notifications')
          .insert(notifications)

        if (notificationsError) {
          throw notificationsError
        }
      }

      return { data: alert, error: null }
    } catch (error) {
      console.error('Error creating alert:', error)
      return { data: null, error: error.message }
    }
  }

  // Update an existing alert
  static async updateAlert(alertId, updateData) {
    try {
      // Update the main alert
      const { data: alert, error: alertError } = await supabase
        .from('alerts')
        .update({
          name: updateData.name,
          description: updateData.description,
          symbol: updateData.symbol?.toUpperCase(),
          exchange: updateData.exchange,
          alert_type: updateData.alert_type,
          max_triggers: updateData.max_triggers,
          cooldown_minutes: updateData.cooldown_minutes,
          is_active: updateData.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', alertId)
        .select()
        .single()

      if (alertError) {
        throw alertError
      }

      // Update conditions if provided
      if (updateData.conditions !== undefined) {
        // Delete existing conditions
        await supabase
          .from('alert_conditions')
          .delete()
          .eq('alert_id', alertId)

        // Insert new conditions
        if (updateData.conditions.length > 0) {
          const conditions = updateData.conditions.map(condition => ({
            alert_id: alertId,
            condition_type: condition.condition_type,
            target_value: condition.target_value,
            target_value_2: condition.target_value_2,
            timeframe: condition.timeframe || '1h',
            operator: condition.operator || 'AND'
          }))

          const { error: conditionsError } = await supabase
            .from('alert_conditions')
            .insert(conditions)

          if (conditionsError) {
            throw conditionsError
          }
        }
      }

      // Update notifications if provided
      if (updateData.notifications !== undefined) {
        // Delete existing notifications
        await supabase
          .from('alert_notifications')
          .delete()
          .eq('alert_id', alertId)

        // Insert new notifications
        if (updateData.notifications.length > 0) {
          const notifications = updateData.notifications.map(notification => ({
            alert_id: alertId,
            notification_type: notification.notification_type,
            destination: notification.destination,
            is_enabled: notification.is_enabled ?? true
          }))

          const { error: notificationsError } = await supabase
            .from('alert_notifications')
            .insert(notifications)

          if (notificationsError) {
            throw notificationsError
          }
        }
      }

      return { data: alert, error: null }
    } catch (error) {
      console.error('Error updating alert:', error)
      return { data: null, error: error.message }
    }
  }

  // Delete an alert
  static async deleteAlert(alertId) {
    try {
      const { error } = await supabase
        .from('alerts')
        .delete()
        .eq('id', alertId)

      if (error) {
        throw error
      }

      return { error: null }
    } catch (error) {
      console.error('Error deleting alert:', error)
      return { error: error.message }
    }
  }

  // Toggle alert active status
  static async toggleAlertStatus(alertId, isActive) {
    try {
      const { data: alert, error } = await supabase
        .from('alerts')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', alertId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return { data: alert, error: null }
    } catch (error) {
      console.error('Error toggling alert status:', error)
      return { data: null, error: error.message }
    }
  }

  // Log alert trigger
  static async logAlertTrigger(alertId, triggerData) {
    try {
      const { data: log, error } = await supabase
        .from('alert_logs')
        .insert([{
          alert_id: alertId,
          trigger_price: triggerData.trigger_price,
          trigger_conditions: triggerData.trigger_conditions,
          market_data: triggerData.market_data,
          notification_status: triggerData.notification_status || {}
        }])
        .select()
        .single()

      if (error) {
        throw error
      }

      // Update alert trigger count and last triggered time
      await supabase
        .from('alerts')
        .update({
          triggered_at: new Date().toISOString(),
          trigger_count: supabase.sql`trigger_count + 1`
        })
        .eq('id', alertId)

      return { data: log, error: null }
    } catch (error) {
      console.error('Error logging alert trigger:', error)
      return { data: null, error: error.message }
    }
  }

  // Get alert statistics
  static async getAlertStats() {
    try {
      const { data: stats, error } = await supabase
        .from('alerts')
        .select('is_active, trigger_count')

      if (error) {
        throw error
      }

      const totalAlerts = stats.length
      const activeAlerts = stats.filter(alert => alert.is_active).length
      const totalTriggers = stats.reduce((sum, alert) => sum + (alert.trigger_count || 0), 0)

      return {
        data: {
          total_alerts: totalAlerts,
          active_alerts: activeAlerts,
          inactive_alerts: totalAlerts - activeAlerts,
          total_triggers: totalTriggers
        },
        error: null
      }
    } catch (error) {
      console.error('Error fetching alert stats:', error)
      return { data: null, error: error.message }
    }
  }

  // Subscribe to real-time alert updates
  static subscribeToAlerts(callback) {
    const subscription = supabase
      .channel('alerts_channel')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'alerts' 
        }, 
        (payload) => {
          callback(payload)
        }
      )
      .subscribe()

    return subscription
  }

  // Unsubscribe from real-time updates
  static unsubscribeFromAlerts(subscription) {
    if (subscription) {
      supabase.removeChannel(subscription)
    }
  }
}

// Price Service - handles price data and market information
export class PriceService {
  
  // Get current price for a symbol
  static async getCurrentPrice(symbol, exchange = 'binance') {
    try {
      // This would integrate with your existing binance client
      // For now, return mock data or implement API call
      const { data, error } = await supabase
        .from('price_history')
        .select('close_price, timestamp')
        .eq('symbol', symbol.toUpperCase())
        .eq('exchange', exchange)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single()

      return { data, error }
    } catch (error) {
      console.error('Error fetching current price:', error)
      return { data: null, error: error.message }
    }
  }

  // Cache price data
  static async cachePriceData(priceData) {
    try {
      const { data, error } = await supabase
        .from('price_history')
        .upsert([priceData])

      return { data, error }
    } catch (error) {
      console.error('Error caching price data:', error)
      return { data: null, error: error.message }
    }
  }
}

// User Service - handles user profile and preferences
export class UserService {
  
  // Get user profile
  static async getUserProfile() {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      return { data: profile, error }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return { data: null, error: error.message }
    }
  }

  // Update user profile
  static async updateUserProfile(profileData) {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single()

      return { data: profile, error }
    } catch (error) {
      console.error('Error updating user profile:', error)
      return { data: null, error: error.message }
    }
  }
}

export default AlertService