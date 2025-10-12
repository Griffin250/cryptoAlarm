'use client'

import { useState, useEffect } from 'react'
import { AlertService } from '../lib/alertService'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { toast } from './ui/toast'
import { Plus, Edit, Trash2, Play, Pause, TrendingUp, TrendingDown, Bell, Activity } from 'lucide-react'

export default function AlertManager() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [stats, setStats] = useState(null)

  // Load alerts on component mount
  useEffect(() => {
    loadAlerts()
    loadStats()
  }, [])

  // Set up real-time subscription
  useEffect(() => {
    const subscription = AlertService.subscribeToAlerts((payload) => {
      console.log('Real-time update:', payload)
      loadAlerts() // Reload alerts on any change
    })

    return () => {
      AlertService.unsubscribeFromAlerts(subscription)
    }
  }, [])

  const loadAlerts = async () => {
    setLoading(true)
    const { data, error } = await AlertService.getUserAlerts()
    
    if (error) {
      setError(error)
    } else {
      setAlerts(data || [])
    }
    setLoading(false)
  }

  const loadStats = async () => {
    const { data, error } = await AlertService.getAlertStats()
    if (!error) {
      setStats(data)
    }
  }

  const handleDeleteAlert = async (alertId) => {
    if (!confirm('Are you sure you want to delete this alert?')) return
    
    const { error } = await AlertService.deleteAlert(alertId)
    if (error) {
      setError(error)
      toast.error(`Failed to delete alert: ${error}`)
    } else {
      loadAlerts()
      loadStats()
      toast.success('Alert deleted successfully!')
    }
  }

  const handleToggleAlert = async (alertId, currentStatus) => {
    const { error } = await AlertService.toggleAlertStatus(alertId, !currentStatus)
    if (error) {
      setError(error)
      toast.error(`Failed to toggle alert: ${error}`)
    } else {
      loadAlerts()
      toast.success(`Alert ${!currentStatus ? 'activated' : 'paused'} successfully!`)
    }
  }

  const getAlertTypeIcon = (type) => {
    switch (type) {
      case 'price': return <TrendingUp className="w-4 h-4" />
      case 'percent_change': return <TrendingDown className="w-4 h-4" />
      case 'volume': return <Activity className="w-4 h-4" />
      case 'technical_indicator': return <Bell className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  const formatConditions = (conditions) => {
    if (!conditions || conditions.length === 0) return 'No conditions'
    
    return conditions.map(condition => {
      switch (condition.condition_type) {
        case 'price_above':
          return `Price > $${condition.target_value}`
        case 'price_below':
          return `Price < $${condition.target_value}`
        case 'price_between':
          return `Price between $${condition.target_value} - $${condition.target_value_2}`
        case 'percent_change_up':
          return `+${condition.target_value}% change (${condition.timeframe})`
        case 'percent_change_down':
          return `-${condition.target_value}% change (${condition.timeframe})`
        case 'volume_above':
          return `Volume > ${condition.target_value}`
        case 'rsi_above':
          return `RSI > ${condition.target_value}`
        case 'rsi_below':
          return `RSI < ${condition.target_value}`
        default:
          return `${condition.condition_type}: ${condition.target_value}`
      }
    }).join(', ')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Alert Manager</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Alert Manager</h2>
          {stats && (
            <p className="text-gray-600 mt-1">
              {stats.total_alerts} alerts • {stats.active_alerts} active • {stats.total_triggers} triggers
            </p>
          )}
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Alert</DialogTitle>
            </DialogHeader>
            <CreateAlertForm 
              onSuccess={() => {
                setIsCreateDialogOpen(false)
                loadAlerts()
                loadStats()
                toast.success('Alert created successfully!')
              }}
              onError={(error) => {
                setError(error)
                toast.error(`Failed to create alert: ${error}`)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Error display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Alerts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alerts.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts yet</h3>
              <p className="text-gray-500 text-center mb-4">
                Create your first alert to start monitoring cryptocurrency prices and conditions.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Alert
              </Button>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} className={`relative ${!alert.is_active ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getAlertTypeIcon(alert.alert_type)}
                    <CardTitle className="text-lg">{alert.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant={alert.is_active ? 'default' : 'secondary'}>
                      {alert.is_active ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-mono font-medium">{alert.symbol}</span>
                  <span>•</span>
                  <span className="capitalize">{alert.exchange}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {alert.description && (
                  <p className="text-sm text-gray-600">{alert.description}</p>
                )}
                
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Conditions
                  </p>
                  <p className="text-sm">{formatConditions(alert.alert_conditions)}</p>
                </div>

                {alert.trigger_count > 0 && (
                  <div className="text-xs text-gray-500">
                    Triggered {alert.trigger_count} time{alert.trigger_count !== 1 ? 's' : ''}
                    {alert.triggered_at && (
                      <span> • Last: {new Date(alert.triggered_at).toLocaleDateString()}</span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleAlert(alert.id, alert.is_active)}
                      className="flex items-center gap-1"
                    >
                      {alert.is_active ? (
                        <>
                          <Pause className="w-3 h-3" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" />
                          Resume
                        </>
                      )}
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Edit className="w-3 h-3" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Alert</DialogTitle>
                        </DialogHeader>
                        <EditAlertForm 
                          alert={alert}
                          onSuccess={() => {
                            loadAlerts()
                            loadStats()
                            toast.success('Alert updated successfully!')
                          }}
                          onError={(error) => {
                            setError(error)
                            toast.error(`Failed to update alert: ${error}`)
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

// Create Alert Form Component
function CreateAlertForm({ onSuccess, onError }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    symbol: '',
    exchange: 'binance',
    alert_type: 'price',
    max_triggers: 1,
    cooldown_minutes: 0,
    conditions: [{
      condition_type: 'price_above',
      target_value: '',
      timeframe: '1h',
      operator: 'AND'
    }],
    notifications: [{
      notification_type: 'email',
      destination: '',
      is_enabled: true
    }]
  })
  
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.symbol) {
        throw new Error('Name and symbol are required')
      }

      // Validate that target_value is provided for conditions
      if (!formData.conditions[0].target_value) {
        throw new Error('Target value is required for the condition')
      }

      console.log('Creating alert with data:', formData)
      
      const { data, error } = await AlertService.createAlert(formData)
      
      console.log('AlertService response:', { data, error })
      
      if (error) {
        onError(error)
      } else {
        onSuccess()
        // Reset form
        setFormData({
          name: '',
          description: '',
          symbol: '',
          exchange: 'binance',
          alert_type: 'price',
          max_triggers: 1,
          cooldown_minutes: 0,
          conditions: [{
            condition_type: 'price_above',
            target_value: '',
            timeframe: '1h',
            operator: 'AND'
          }],
          notifications: [{
            notification_type: 'email',
            destination: '',
            is_enabled: true
          }]
        })
      }
    } catch (error) {
      onError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateCondition = (index, field, value) => {
    const newConditions = [...formData.conditions]
    newConditions[index] = { ...newConditions[index], [field]: value }
    setFormData({ ...formData, conditions: newConditions })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Alert Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Bitcoin Price Alert"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Symbol</label>
          <Input
            value={formData.symbol}
            onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
            placeholder="e.g., BTCUSDT"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Optional description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Exchange</label>
          <Select 
            value={formData.exchange} 
            onValueChange={(value) => setFormData({ ...formData, exchange: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="binance">Binance</SelectItem>
              <SelectItem value="coinbase">Coinbase</SelectItem>
              <SelectItem value="kraken">Kraken</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Alert Type</label>
          <Select 
            value={formData.alert_type} 
            onValueChange={(value) => setFormData({ ...formData, alert_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Price Alert</SelectItem>
              <SelectItem value="percent_change">Percent Change</SelectItem>
              <SelectItem value="volume">Volume Alert</SelectItem>
              <SelectItem value="technical_indicator">Technical Indicator</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Condition</label>
        <div className="grid grid-cols-3 gap-2">
          <Select 
            value={formData.conditions[0].condition_type}
            onValueChange={(value) => updateCondition(0, 'condition_type', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price_above">Price Above</SelectItem>
              <SelectItem value="price_below">Price Below</SelectItem>
              <SelectItem value="percent_change_up">% Change Up</SelectItem>
              <SelectItem value="percent_change_down">% Change Down</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            type="number"
            step="any"
            value={formData.conditions[0].target_value}
            onChange={(e) => updateCondition(0, 'target_value', e.target.value)}
            placeholder="Target value"
            required
          />
          
          <Select 
            value={formData.conditions[0].timeframe}
            onValueChange={(value) => updateCondition(0, 'timeframe', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Minute</SelectItem>
              <SelectItem value="5m">5 Minutes</SelectItem>
              <SelectItem value="15m">15 Minutes</SelectItem>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="4h">4 Hours</SelectItem>
              <SelectItem value="1d">1 Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Max Triggers</label>
          <Input
            type="number"
            min="0"
            value={formData.max_triggers}
            onChange={(e) => setFormData({ ...formData, max_triggers: parseInt(e.target.value) || 0 })}
            placeholder="0 for unlimited"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cooldown (minutes)</label>
          <Input
            type="number"
            min="0"
            value={formData.cooldown_minutes}
            onChange={(e) => setFormData({ ...formData, cooldown_minutes: parseInt(e.target.value) || 0 })}
            placeholder="0 for no cooldown"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Alert'}
        </Button>
      </div>
    </form>
  )
}

// Edit Alert Form Component
function EditAlertForm({ alert, onSuccess, onError }) {
  const [formData, setFormData] = useState({
    name: alert.name,
    description: alert.description || '',
    symbol: alert.symbol,
    exchange: alert.exchange,
    alert_type: alert.alert_type,
    max_triggers: alert.max_triggers,
    cooldown_minutes: alert.cooldown_minutes,
    is_active: alert.is_active,
    conditions: alert.alert_conditions?.length > 0 ? alert.alert_conditions : [{
      condition_type: 'price_above',
      target_value: '',
      timeframe: '1h',
      operator: 'AND'
    }]
  })
  
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await AlertService.updateAlert(alert.id, formData)
      
      if (error) {
        onError(error)
      } else {
        onSuccess()
      }
    } catch (error) {
      onError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateCondition = (index, field, value) => {
    const newConditions = [...formData.conditions]
    newConditions[index] = { ...newConditions[index], [field]: value }
    setFormData({ ...formData, conditions: newConditions })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Alert Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Bitcoin Price Alert"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Symbol</label>
          <Input
            value={formData.symbol}
            onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
            placeholder="e.g., BTCUSDT"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Optional description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Exchange</label>
          <Select 
            value={formData.exchange} 
            onValueChange={(value) => setFormData({ ...formData, exchange: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="binance">Binance</SelectItem>
              <SelectItem value="coinbase">Coinbase</SelectItem>
              <SelectItem value="kraken">Kraken</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <Select 
            value={formData.is_active ? 'active' : 'paused'} 
            onValueChange={(value) => setFormData({ ...formData, is_active: value === 'active' })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Condition</label>
        <div className="grid grid-cols-3 gap-2">
          <Select 
            value={formData.conditions[0]?.condition_type || 'price_above'}
            onValueChange={(value) => updateCondition(0, 'condition_type', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price_above">Price Above</SelectItem>
              <SelectItem value="price_below">Price Below</SelectItem>
              <SelectItem value="percent_change_up">% Change Up</SelectItem>
              <SelectItem value="percent_change_down">% Change Down</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            type="number"
            step="any"
            value={formData.conditions[0]?.target_value || ''}
            onChange={(e) => updateCondition(0, 'target_value', e.target.value)}
            placeholder="Target value"
            required
          />
          
          <Select 
            value={formData.conditions[0]?.timeframe || '1h'}
            onValueChange={(value) => updateCondition(0, 'timeframe', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Minute</SelectItem>
              <SelectItem value="5m">5 Minutes</SelectItem>
              <SelectItem value="15m">15 Minutes</SelectItem>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="4h">4 Hours</SelectItem>
              <SelectItem value="1d">1 Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Max Triggers</label>
          <Input
            type="number"
            min="0"
            value={formData.max_triggers}
            onChange={(e) => setFormData({ ...formData, max_triggers: parseInt(e.target.value) || 0 })}
            placeholder="0 for unlimited"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cooldown (minutes)</label>
          <Input
            type="number"
            min="0"
            value={formData.cooldown_minutes}
            onChange={(e) => setFormData({ ...formData, cooldown_minutes: parseInt(e.target.value) || 0 })}
            placeholder="0 for no cooldown"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Alert'}
        </Button>
      </div>
    </form>
  )
}