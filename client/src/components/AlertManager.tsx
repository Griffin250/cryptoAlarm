import React, { useState, useEffect } from 'react'
import { Bell, Plus, Trash2, AlertTriangle, Edit, Pause, Play, BarChart3, DollarSign, TrendingUp, Activity } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Label } from './ui/label'
import { AlertService } from '../lib/AlertService'
import { useAuth } from '../context/AuthContext'

interface Alert {
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

interface AlertStats {
  total_alerts: number
  active_alerts: number
  triggered_alerts: number
  total_triggers: number
}

interface NewAlertForm {
  symbol: string
  alertType: 'PRICE_TARGET' | 'PERCENTAGE_CHANGE'
  direction: 'ABOVE' | 'BELOW'
  targetPrice: string
  percentageChange: string
  phoneNumber: string
}

const cryptoSymbols = [
  'BTC', 'ETH', 'BNB', 'ADA', 'SOL', 'XRP', 'DOT', 'DOGE', 'AVAX', 'LUNA',
  'LINK', 'ATOM', 'LTC', 'BCH', 'FIL', 'TRX', 'ETC', 'XLM', 'VET', 'ICP',
  'THETA', 'FTT', 'CAKE', 'ALGO', 'XTZ', 'EGLD', 'AAVE', 'GRT', 'ENJ', 'MANA'
]

export const AlertManager: React.FC = () => {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [stats, setStats] = useState<AlertStats>({
    total_alerts: 0,
    active_alerts: 0,
    triggered_alerts: 0,
    total_triggers: 0
  })
  const [loading, setLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null)
  const [newAlert, setNewAlert] = useState<NewAlertForm>({
    symbol: '',
    alertType: 'PRICE_TARGET',
    direction: 'ABOVE',
    targetPrice: '',
    percentageChange: '',
    phoneNumber: ''
  })

  useEffect(() => {
    if (user) {
      fetchAlerts()
      loadStats()
      
      // Set up real-time subscription for alerts
      const subscription = AlertService.subscribeToAlerts((payload: any) => {
        console.log('Alert update received:', payload)
        fetchAlerts() // Refresh alerts on any change
      })

      return () => {
        if (subscription) {
          subscription.unsubscribe()
        }
      }
    }
  }, [user])

  const fetchAlerts = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await AlertService.getUserAlerts()
      if (error) {
        console.error('Error fetching alerts:', error)
      } else {
        setAlerts(data || [])
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const { data, error } = await AlertService.getAlertStats()
      if (!error && data) {
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const resetForm = () => {
    setNewAlert({
      symbol: '',
      alertType: 'PRICE_TARGET',
      direction: 'ABOVE',
      targetPrice: '',
      percentageChange: '',
      phoneNumber: user?.user_metadata?.phone_number || ''
    })
    setEditingAlert(null)
  }

  const openCreateModal = () => {
    resetForm()
    setShowCreateModal(true)
  }

  const openEditModal = (alert: Alert) => {
    setNewAlert({
      symbol: alert.symbol,
      alertType: alert.alert_type,
      direction: alert.direction,
      targetPrice: alert.target_price?.toString() || '',
      percentageChange: alert.percentage_change?.toString() || '',
      phoneNumber: alert.phone_number
    })
    setEditingAlert(alert)
    setShowCreateModal(true)
  }

  const closeModal = () => {
    setShowCreateModal(false)
    resetForm()
  }

  const createAlert = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const alertData: any = {
        symbol: newAlert.symbol,
        alert_type: newAlert.alertType,
        direction: newAlert.direction,
        phone_number: newAlert.phoneNumber,
        user_id: user.id
      }

      if (newAlert.alertType === 'PRICE_TARGET') {
        alertData.target_price = parseFloat(newAlert.targetPrice)
      } else {
        alertData.percentage_change = parseFloat(newAlert.percentageChange)
      }

      const { error } = await AlertService.createAlert(alertData)
      
      if (error) {
        console.error('Failed to create alert:', error)
        return
      }

      await fetchAlerts()
      await loadStats()
      closeModal()
    } catch (error) {
      console.error('Failed to create alert:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateAlert = async () => {
    if (!editingAlert || !user) return
    
    setLoading(true)
    try {
      const alertData: any = {
        symbol: newAlert.symbol,
        alert_type: newAlert.alertType,
        direction: newAlert.direction,
        phone_number: newAlert.phoneNumber
      }

      if (newAlert.alertType === 'PRICE_TARGET') {
        alertData.target_price = parseFloat(newAlert.targetPrice)
      } else {
        alertData.percentage_change = parseFloat(newAlert.percentageChange)
      }

      const { error } = await AlertService.updateAlert(editingAlert.id, alertData)
      
      if (error) {
        console.error('Failed to update alert:', error)
        return
      }

      await fetchAlerts()
      await loadStats()
      closeModal()
    } catch (error) {
      console.error('Failed to update alert:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteAlert = async (alertId: string) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        const { error } = await AlertService.deleteAlert(alertId)
        if (error) {
          console.error('Failed to delete alert:', error)
          return
        }
        
        await fetchAlerts()
        await loadStats()
      } catch (error) {
        console.error('Failed to delete alert:', error)
      }
    }
  }

  const toggleAlertStatus = async (alertId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
      const { error } = await AlertService.updateAlert(alertId, { 
        status: newStatus,
        is_active: newStatus === 'ACTIVE'
      })
      
      if (error) {
        console.error('Failed to toggle alert status:', error)
        return
      }

      await fetchAlerts()
      await loadStats()
    } catch (error) {
      console.error('Failed to toggle alert status:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { text: string; className: string }> = {
      'ACTIVE': { text: 'Active', className: 'bg-green-600 text-white hover:bg-green-700' },
      'TRIGGERED': { text: 'Triggered', className: 'bg-red-600 text-white hover:bg-red-700' },
      'CANCELLED': { text: 'Cancelled', className: 'bg-gray-600 text-white hover:bg-gray-700' },
      'PAUSED': { text: 'Paused', className: 'bg-yellow-600 text-white hover:bg-yellow-700' }
    }
    const config = variants[status] || variants['ACTIVE']
    return <Badge className={config.className}>{config.text}</Badge>
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(price)
  }

  const isFormValid = () => {
    if (!newAlert.symbol || !newAlert.phoneNumber) return false
    
    if (newAlert.alertType === 'PRICE_TARGET') {
      return newAlert.targetPrice && parseFloat(newAlert.targetPrice) > 0
    } else {
      return newAlert.percentageChange && parseFloat(newAlert.percentageChange) > 0
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Please sign in to manage your alerts</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-white">Alert Management</h2>
        </div>
        <Button 
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-gray-700 bg-gray-800/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-400">Total Alerts</p>
                <p className="text-2xl font-bold text-white">{stats.total_alerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-400">Active</p>
                <p className="text-2xl font-bold text-white">{stats.active_alerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-400">Triggered</p>
                <p className="text-2xl font-bold text-white">{stats.triggered_alerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-400">Total Triggers</p>
                <p className="text-2xl font-bold text-white">{stats.total_triggers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading alerts...</p>
          </div>
        ) : alerts.length === 0 ? (
          <Card className="border-gray-700 bg-gray-800/50">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Alerts Set</h3>
              <p className="text-gray-400 mb-4">Create your first alert to get notified of price movements</p>
              <Button 
                onClick={openCreateModal}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Alert
              </Button>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} className="border-gray-700 bg-gray-800/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CardTitle className="text-white font-bold text-lg">
                      {alert.symbol}
                    </CardTitle>
                    {getStatusBadge(alert.status)}
                    {alert.trigger_count > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {alert.trigger_count} triggers
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost" 
                      size="sm"
                      onClick={() => openEditModal(alert)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleAlertStatus(alert.id, alert.status)}
                      className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                    >
                      {alert.status === 'ACTIVE' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteAlert(alert.id)}
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Alert Type:</span>
                    <span className="text-white font-medium">
                      {alert.alert_type === 'PRICE_TARGET' ? 'Price Target' : 'Percentage Change'}
                    </span>
                  </div>
                  
                  {alert.alert_type === 'PRICE_TARGET' && alert.target_price ? (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Target Price:</span>
                      <span className="text-white font-medium">
                        {alert.direction === 'ABOVE' ? '≥' : '≤'} {formatPrice(alert.target_price)}
                      </span>
                    </div>
                  ) : alert.percentage_change ? (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Percentage Change:</span>
                      <span className="text-white font-medium">
                        {alert.direction === 'ABOVE' ? '+' : '-'}{alert.percentage_change}%
                      </span>
                    </div>
                  ) : null}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Phone Number:</span>
                    <span className="text-white font-medium">{alert.phone_number}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Created:</span>
                    <span className="text-white font-medium">
                      {new Date(alert.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {alert.triggered_at && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Last Triggered:</span>
                      <span className="text-white font-medium">
                        {new Date(alert.triggered_at).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Alert Modal */}
      {showCreateModal && (
        <Dialog open={showCreateModal} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingAlert ? 'Edit Alert' : 'Create New Alert'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {editingAlert ? 'Update your alert settings' : 'Set up a price alert to get notified when your target is reached.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              {/* Symbol Selection */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="symbol" className="text-right text-white">Symbol</Label>
                <Select value={newAlert.symbol} onValueChange={(value) => setNewAlert({...newAlert, symbol: value})}>
                  <SelectTrigger className="col-span-3 bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Select Symbol" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {cryptoSymbols.map(symbol => (
                      <SelectItem key={symbol} value={symbol} className="text-white hover:bg-gray-700">
                        {symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Alert Type */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right text-white">Type</Label>
                <Select value={newAlert.alertType} onValueChange={(value: 'PRICE_TARGET' | 'PERCENTAGE_CHANGE') => 
                  setNewAlert({...newAlert, alertType: value})}>
                  <SelectTrigger className="col-span-3 bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="PRICE_TARGET" className="text-white hover:bg-gray-700">Price Target</SelectItem>
                    <SelectItem value="PERCENTAGE_CHANGE" className="text-white hover:bg-gray-700">Percentage Change</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Direction */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="direction" className="text-right text-white">Direction</Label>
                <Select value={newAlert.direction} onValueChange={(value: 'ABOVE' | 'BELOW') => 
                  setNewAlert({...newAlert, direction: value})}>
                  <SelectTrigger className="col-span-3 bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="ABOVE" className="text-white hover:bg-gray-700">Above/Up</SelectItem>
                    <SelectItem value="BELOW" className="text-white hover:bg-gray-700">Below/Down</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Target Price or Percentage */}
              {newAlert.alertType === 'PRICE_TARGET' ? (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right text-white">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.000001"
                    value={newAlert.targetPrice}
                    onChange={(e) => setNewAlert({...newAlert, targetPrice: e.target.value})}
                    className="col-span-3 bg-gray-800 border-gray-600 text-white"
                    placeholder="Enter target price"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="percentage" className="text-right text-white">Percentage (%)</Label>
                  <Input
                    id="percentage"
                    type="number"
                    step="0.1"
                    value={newAlert.percentageChange}
                    onChange={(e) => setNewAlert({...newAlert, percentageChange: e.target.value})}
                    className="col-span-3 bg-gray-800 border-gray-600 text-white"
                    placeholder="Enter percentage"
                  />
                </div>
              )}

              {/* Phone Number */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right text-white">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newAlert.phoneNumber}
                  onChange={(e) => setNewAlert({...newAlert, phoneNumber: e.target.value})}
                  className="col-span-3 bg-gray-800 border-gray-600 text-white"
                  placeholder="+1234567890"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={closeModal}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button 
                onClick={editingAlert ? updateAlert : createAlert}
                disabled={loading || !isFormValid()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (editingAlert ? 'Updating...' : 'Creating...') : (editingAlert ? 'Update Alert' : 'Create Alert')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default AlertManager