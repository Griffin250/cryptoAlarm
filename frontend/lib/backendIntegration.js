import { AlertService } from './alertService'
import { PriceService } from './alertService'

// Backend Integration Service - connects Supabase alerts with Python monitoring system
export class BackendIntegrationService {
  
  // Backend API configuration
  static API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://cryptoalarm.onrender.com'
  static WS_BASE = process.env.NEXT_PUBLIC_WS_URL || 'wss://cryptoalarm.onrender.com'
  
  // Sync Supabase alerts with backend monitoring system
  static async syncAlertsWithBackend() {
    try {
      // Get all active alerts from Supabase
      const { data: alerts, error } = await AlertService.getUserAlerts()
      
      if (error) {
        throw new Error(error)
      }

      // Filter active alerts
      const activeAlerts = alerts?.filter(alert => alert.is_active) || []
      
      // Convert Supabase alerts to backend format
      const backendAlerts = activeAlerts.map(alert => ({
        id: alert.id,
        symbol: alert.symbol,
        exchange: alert.exchange || 'binance',
        alert_type: this.mapAlertType(alert.alert_type),
        conditions: this.mapConditions(alert.alert_conditions || []),
        user_id: alert.user_id,
        notifications: alert.alert_notifications || [],
        max_triggers: alert.max_triggers,
        cooldown_minutes: alert.cooldown_minutes
      }))

      // Send to backend monitoring system
      const response = await fetch(`${this.API_BASE}/alerts/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alerts: backendAlerts
        })
      })

      if (!response.ok) {
        throw new Error(`Backend sync failed: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('Alerts synced with backend:', result)
      
      return { success: true, synced: backendAlerts.length }
    } catch (error) {
      console.error('Error syncing alerts with backend:', error)
      return { success: false, error: error.message }
    }
  }

  // Map Supabase alert types to backend format
  static mapAlertType(supabaseType) {
    const typeMap = {
      'price': 'PRICE_TARGET',
      'percent_change': 'PERCENTAGE_CHANGE',
      'volume': 'VOLUME_ALERT',
      'technical_indicator': 'TECHNICAL_INDICATOR'
    }
    return typeMap[supabaseType] || 'PRICE_TARGET'
  }

  // Map Supabase conditions to backend format
  static mapConditions(conditions) {
    return conditions.map(condition => ({
      type: condition.condition_type,
      value: parseFloat(condition.target_value),
      value2: condition.target_value_2 ? parseFloat(condition.target_value_2) : null,
      timeframe: condition.timeframe || '1h',
      operator: condition.operator || 'AND'
    }))
  }

  // Handle alert triggers from backend
  static async handleAlertTrigger(triggerData) {
    try {
      // Log the trigger in Supabase
      const { error } = await AlertService.logAlertTrigger(triggerData.alert_id, {
        trigger_price: triggerData.price,
        trigger_conditions: triggerData.conditions,
        market_data: triggerData.market_data,
        notification_status: triggerData.notification_status || {}
      })

      if (error) {
        console.error('Error logging alert trigger:', error)
      }

      return { success: true }
    } catch (error) {
      console.error('Error handling alert trigger:', error)
      return { success: false, error: error.message }
    }
  }

  // WebSocket connection for real-time price updates
  static connectWebSocket() {
    try {
      const ws = new WebSocket(this.WS_BASE)
      
      ws.onopen = () => {
        console.log('Connected to price WebSocket')
      }
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          // Handle different message types
          switch (data.type) {
            case 'price_update':
              this.handlePriceUpdate(data)
              break
            case 'alert_trigger':
              this.handleAlertTrigger(data)
              break
            case 'market_data':
              this.handleMarketData(data)
              break
            default:
              console.log('Unknown message type:', data.type)
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }
      
      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason)
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          console.log('Attempting to reconnect WebSocket...')
          this.connectWebSocket()
        }, 5000)
      }
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
      
      return ws
    } catch (error) {
      console.error('Error connecting to WebSocket:', error)
      return null
    }
  }

  // Handle real-time price updates
  static handlePriceUpdate(data) {
    // Cache price data in Supabase for future reference
    PriceService.cachePriceData({
      symbol: data.symbol,
      exchange: data.exchange || 'binance',
      timeframe: '1m',
      timestamp: new Date().toISOString(),
      open_price: data.open || data.price,
      high_price: data.high || data.price,
      low_price: data.low || data.price,
      close_price: data.price,
      volume: data.volume || 0
    })

    // Emit custom event for components to listen
    window.dispatchEvent(new CustomEvent('priceUpdate', {
      detail: data
    }))
  }

  // Handle market data updates
  static handleMarketData(data) {
    // Emit market data event
    window.dispatchEvent(new CustomEvent('marketData', {
      detail: data
    }))
  }

  // Get current backend status
  static async getBackendStatus() {
    try {
      const response = await fetch(`${this.API_BASE}/health`)
      
      if (!response.ok) {
        throw new Error(`Backend not available: ${response.statusText}`)
      }
      
      const status = await response.json()
      return { 
        available: true, 
        status: status.status || 'unknown',
        version: status.version || 'unknown',
        alerts_monitored: status.alerts_monitored || 0
      }
    } catch (error) {
      return { 
        available: false, 
        error: error.message 
      }
    }
  }

  // Start monitoring (called when user creates/activates alerts)
  static async startMonitoring() {
    try {
      // First sync alerts
      const syncResult = await this.syncAlertsWithBackend()
      
      if (!syncResult.success) {
        throw new Error(syncResult.error)
      }

      // Start backend monitoring
      const response = await fetch(`${this.API_BASE}/monitoring/start`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error(`Failed to start monitoring: ${response.statusText}`)
      }

      return { success: true, message: 'Monitoring started successfully' }
    } catch (error) {
      console.error('Error starting monitoring:', error)
      return { success: false, error: error.message }
    }
  }

  // Stop monitoring
  static async stopMonitoring() {
    try {
      const response = await fetch(`${this.API_BASE}/monitoring/stop`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error(`Failed to stop monitoring: ${response.statusText}`)
      }

      return { success: true, message: 'Monitoring stopped successfully' }
    } catch (error) {
      console.error('Error stopping monitoring:', error)
      return { success: false, error: error.message }
    }
  }

  // Get monitoring stats from backend
  static async getMonitoringStats() {
    try {
      const response = await fetch(`${this.API_BASE}/monitoring/stats`)
      
      if (!response.ok) {
        throw new Error(`Failed to get stats: ${response.statusText}`)
      }
      
      const stats = await response.json()
      return { success: true, data: stats }
    } catch (error) {
      console.error('Error getting monitoring stats:', error)
      return { success: false, error: error.message }
    }
  }

  // Test alert (manually trigger for testing)
  static async testAlert(alertId) {
    try {
      const response = await fetch(`${this.API_BASE}/alerts/${alertId}/test`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error(`Failed to test alert: ${response.statusText}`)
      }

      const result = await response.json()
      return { success: true, data: result }
    } catch (error) {
      console.error('Error testing alert:', error)
      return { success: false, error: error.message }
    }
  }
}

// Auto-sync service - automatically syncs alerts when they change
export class AutoSyncService {
  static isRunning = false
  static syncInterval = null

  static start(intervalMs = 30000) { // Sync every 30 seconds
    if (this.isRunning) return

    this.isRunning = true
    console.log('Starting auto-sync service...')

    // Initial sync
    BackendIntegrationService.syncAlertsWithBackend()

    // Set up interval for periodic syncing
    this.syncInterval = setInterval(async () => {
      const result = await BackendIntegrationService.syncAlertsWithBackend()
      if (!result.success) {
        console.warn('Auto-sync failed:', result.error)
      }
    }, intervalMs)
  }

  static stop() {
    if (!this.isRunning) return

    this.isRunning = false
    console.log('Stopping auto-sync service...')

    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  static async forceSync() {
    return await BackendIntegrationService.syncAlertsWithBackend()
  }
}

export default BackendIntegrationService