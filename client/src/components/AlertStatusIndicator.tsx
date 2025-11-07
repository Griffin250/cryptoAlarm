// Alert Status Indicator Component
// Shows real-time monitoring status for alerts with backend connection information.
import React, { useState, useEffect } from 'react'
import { Badge } from './ui/badge'
import { alertAPI } from '../lib/api'
import type { AlertStatusResponse, HealthCheckResponse } from '../lib/api'
import { Activity, AlertCircle, Clock, Wifi, WifiOff } from 'lucide-react'

interface AlertStatusIndicatorProps {
  alertId: string
  isActive: boolean
  className?: string
}

const AlertStatusIndicator: React.FC<AlertStatusIndicatorProps> = ({ 
  alertId, 
  isActive, 
  className = '' 
}) => {
  const [isMonitored, setIsMonitored] = useState(false)
  const [backendConnected, setBackendConnected] = useState(false)
  const [lastChecked, setLastChecked] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkMonitoringStatus = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check backend health first
      const healthResponse: HealthCheckResponse = await alertAPI.getHealthCheck()
      setBackendConnected(healthResponse.api_status === 'healthy')

      // Check specific alert status if backend is healthy
      if (healthResponse.api_status === 'healthy') {
        const statusResponse: AlertStatusResponse = await alertAPI.getAlertStatus(alertId)
        setIsMonitored(statusResponse.is_monitored)
        setLastChecked(statusResponse.last_checked || null)
      } else {
        setIsMonitored(false)
      }

    } catch (error: any) {
      console.error('Failed to check monitoring status:', error)
      setError(error.message || 'Connection failed')
      setBackendConnected(false)
      setIsMonitored(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isActive && alertId) {
      // Initial check
      checkMonitoringStatus()
      
      // Set up periodic checking every 30 seconds
      const interval = setInterval(checkMonitoringStatus, 30000)
      
      return () => clearInterval(interval)
    } else {
      setIsMonitored(false)
      setBackendConnected(false)
      setLoading(false)
    }
  }, [alertId, isActive])

  const getStatusBadge = () => {
    if (loading) {
      return (
        <Badge variant="outline" className="flex items-center gap-1 text-gray-400 border-gray-600">
          <Clock className="h-3 w-3 animate-pulse" />
          Checking...
        </Badge>
      )
    }

    if (error || !backendConnected) {
      return (
        <Badge variant="outline" className="flex items-center gap-1 text-red-400 border-red-600">
          <WifiOff className="h-3 w-3" />
          Offline
        </Badge>
      )
    }

    if (!isActive) {
      return (
        <Badge variant="outline" className="flex items-center gap-1 text-gray-400 border-gray-600">
          <AlertCircle className="h-3 w-3" />
          Paused
        </Badge>
      )
    }

    if (isMonitored) {
      return (
        <Badge variant="outline" className="flex items-center gap-1 text-green-400 border-green-600">
          <Activity className="h-3 w-3 animate-pulse" />
          Monitoring
        </Badge>
      )
    }

    return (
      <Badge variant="outline" className="flex items-center gap-1 text-orange-400 border-orange-600">
        <AlertCircle className="h-3 w-3" />
        Not Monitored
      </Badge>
    )
  }

  const getConnectionBadge = () => {
    if (loading) return null

    return (
      <Badge 
        variant="outline" 
        className={`flex items-center gap-1 text-xs ${
          backendConnected 
            ? 'text-green-400 border-green-600' 
            : 'text-red-400 border-red-600'
        }`}
      >
        {backendConnected ? (
          <>
            <Wifi className="h-2 w-2" />
            Connected
          </>
        ) : (
          <>
            <WifiOff className="h-2 w-2" />
            Disconnected
          </>
        )}
      </Badge>
    )
  }

  const getTooltipText = () => {
    if (loading) return "Checking monitoring status..."
    if (error) return `Error: ${error}`
    if (!backendConnected) return "Backend not connected - alerts may not trigger"
    if (!isActive) return "Alert is paused - not being monitored"
    if (isMonitored) return `Alert is actively monitored. Last checked: ${lastChecked ? new Date(lastChecked).toLocaleTimeString() : 'Unknown'}`
    return "Alert is not being monitored by backend"
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`} title={getTooltipText()}>
      <div className="flex gap-2">
        {getStatusBadge()}
        {getConnectionBadge()}
      </div>
      
      {lastChecked && isMonitored && !loading && (
        <div className="text-xs text-gray-500">
          Last: {new Date(lastChecked).toLocaleTimeString()}
        </div>
      )}
      
      {error && (
        <div className="text-xs text-red-400 max-w-[200px] truncate" title={error}>
          {error}
        </div>
      )}
    </div>
  )
}

export default AlertStatusIndicator