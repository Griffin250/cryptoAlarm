import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { useToast } from '../hooks/use-toast'
import { AlertService } from '../services/alertService'
import type { Alert } from '../types'
import { 
  Bell, Plus, Trash2, ToggleLeft, ToggleRight, 
  TrendingUp, TrendingDown, Loader2, AlertTriangle 
} from 'lucide-react'

const AlertManager: React.FC = () => {
  const { toast } = useToast()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    symbol: 'BTCUSDT',
    target_value: '',
    alert_type: 'price_above' as Alert['alert_type'],
    notification_method: 'phone' as Alert['notification_method']
  })

  const cryptoSymbols = [
    'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT',
    'DOGEUSDT', 'ADAUSDT', 'SHIBUSDT', 'USDCUSDT', 'SUIUSDT'
  ]

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    setLoading(true)
    const { data, error } = await AlertService.getUserAlerts()
    
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive'
      })
    } else if (data) {
      setAlerts(data)
    }
    setLoading(false)
  }

  const handleCreateAlert = async () => {
    if (!formData.target_value) {
      toast({
        title: 'Error',
        description: 'Please enter a target price',
        variant: 'destructive'
      })
      return
    }

    const { error } = await AlertService.createAlert({
      name: formData.name || `${formData.symbol} Alert`,
      symbol: formData.symbol,
      target_value: parseFloat(formData.target_value),
      alert_type: formData.alert_type,
      notification_method: formData.notification_method,
      is_active: true
    })

    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Success',
        description: 'Alert created successfully'
      })
      setShowCreateForm(false)
      setFormData({
        name: '',
        symbol: 'BTCUSDT',
        target_value: '',
        alert_type: 'price_above',
        notification_method: 'phone'
      })
      loadAlerts()
    }
  }

  const handleToggleAlert = async (alertId: string, isActive: boolean) => {
    const { error } = await AlertService.toggleAlertStatus(alertId, !isActive)
    
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Success',
        description: `Alert ${!isActive ? 'activated' : 'deactivated'}`
      })
      loadAlerts()
    }
  }

  const handleDeleteAlert = async (alertId: string) => {
    const { error } = await AlertService.deleteAlert(alertId)
    
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Success',
        description: 'Alert deleted successfully'
      })
      loadAlerts()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Price Alerts</h1>
          <p className="text-gray-400 mt-1">Manage your cryptocurrency price alerts</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {/* Create Alert Form */}
      {showCreateForm && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Create New Alert</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Cryptocurrency</Label>
                <Select
                  value={formData.symbol}
                  onValueChange={(value) => setFormData({ ...formData, symbol: value })}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cryptoSymbols.map(symbol => (
                      <SelectItem key={symbol} value={symbol}>
                        {symbol.replace('USDT', '')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Target Price</Label>
                <Input
                  type="number"
                  placeholder="Enter price"
                  value={formData.target_value}
                  onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Alert Type</Label>
                <Select
                  value={formData.alert_type}
                  onValueChange={(value: Alert['alert_type']) => setFormData({ ...formData, alert_type: value })}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price_above">Price Above</SelectItem>
                    <SelectItem value="price_below">Price Below</SelectItem>
                    <SelectItem value="percent_change">Percent Change</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Notification Method</Label>
                <Select
                  value={formData.notification_method}
                  onValueChange={(value: Alert['notification_method']) => setFormData({ ...formData, notification_method: value })}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCreateAlert}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Alert
              </Button>
              <Button
                onClick={() => setShowCreateForm(false)}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="py-12 text-center">
            <Bell className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No alerts yet</h3>
            <p className="text-gray-400 mb-6">Create your first price alert to get started</p>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Alert
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {alerts.map((alert) => (
            <Card key={alert.id} className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${alert.alert_type.includes('above') ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                      {alert.alert_type.includes('above') ? (
                        <TrendingUp className="h-6 w-6 text-green-500" />
                      ) : (
                        <TrendingDown className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white">
                          {alert.symbol.replace('USDT', '')}
                        </h3>
                        <Badge variant={alert.is_active ? 'default' : 'secondary'}>
                          {alert.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        {alert.is_triggered && (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Triggered
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-400">
                        Alert when price {alert.alert_type.replace('_', ' ')} ${alert.target_value.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Notification: {alert.notification_method}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleToggleAlert(alert.id, alert.is_active)}
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      {alert.is_active ? (
                        <ToggleRight className="h-5 w-5 text-green-500" />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-gray-500" />
                      )}
                    </Button>
                    <Button
                      onClick={() => handleDeleteAlert(alert.id)}
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-red-400 hover:bg-red-950/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default AlertManager
