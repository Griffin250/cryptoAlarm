"use client"
import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Select, SelectItem } from './ui/select'
import { Plus, Bell, Trash2, Edit, AlertTriangle } from 'lucide-react'
import axios from 'axios'

const AlertManager = ({ cryptoSymbols = [] }) => {
  const [alerts, setAlerts] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    alertType: 'PRICE_TARGET',
    direction: 'ABOVE',
    targetPrice: '',
    percentageChange: '',
    phoneNumber: ''
  })

  const API_BASE = 'http://localhost:8000'

  // Fetch existing alerts
  const fetchAlerts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/alerts`)
      setAlerts(response.data)
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  // Create new alert
  const createAlert = async () => {
    setLoading(true)
    try {
      const alertData = {
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

      await axios.post(`${API_BASE}/alerts`, alertData)
      await fetchAlerts()
      setShowCreateModal(false)
      setNewAlert({
        symbol: '',
        alertType: 'PRICE_TARGET',
        direction: 'ABOVE',
        targetPrice: '',
        percentageChange: '',
        phoneNumber: ''
      })
    } catch (error) {
      console.error('Failed to create alert:', error)
    } finally {
      setLoading(false)
    }
  }

  // Delete alert
  const deleteAlert = async (alertId) => {
    try {
      await axios.delete(`${API_BASE}/alerts/${alertId}`)
      await fetchAlerts()
    } catch (error) {
      console.error('Failed to delete alert:', error)
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      'ACTIVE': { variant: 'default', text: 'Active', className: 'bg-[#16C784] text-white' },
      'TRIGGERED': { variant: 'default', text: 'Triggered', className: 'bg-[#EA3943] text-white' },
      'CANCELLED': { variant: 'secondary', text: 'Cancelled', className: 'bg-gray-600 text-white' }
    }
    const config = variants[status] || variants['ACTIVE']
    return <Badge className={config.className}>{config.text}</Badge>
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(price)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="h-6 w-6 text-[#3861FB]" />
          <h2 className="text-2xl font-bold text-white">Alert Management</h2>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-[#3861FB] hover:bg-[#2851FB] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {/* Active Alerts */}
      <div className="grid gap-4">
        {alerts.length === 0 ? (
          <Card className="border-gray-700 bg-gray-800/50">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Alerts Set</h3>
              <p className="text-gray-400 mb-4">Create your first alert to get notified of price movements</p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-[#3861FB] hover:bg-[#2851FB] text-white"
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
                    <CardTitle className="text-white font-bold">
                      {alert.symbol}
                    </CardTitle>
                    {getStatusBadge(alert.status)}
                  </div>
                  <div className="flex items-center space-x-2">
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
                  
                  {alert.alert_type === 'PRICE_TARGET' ? (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Target Price:</span>
                      <span className="text-white font-medium">
                        {alert.direction === 'ABOVE' ? '≥' : '≤'} {formatPrice(alert.target_price)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Percentage Change:</span>
                      <span className="text-white font-medium">
                        {alert.direction === 'ABOVE' ? '+' : '-'}{alert.percentage_change}%
                      </span>
                    </div>
                  )}
                  
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
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Alert Modal */}
      {showCreateModal && (
        <Dialog>
          <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Alert</DialogTitle>
              <DialogDescription className="text-gray-400">
                Set up a price alert to get notified when your target is reached.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              {/* Symbol Selection */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-white">Symbol</label>
                <Select 
                  value={newAlert.symbol}
                  onChange={(e) => setNewAlert({...newAlert, symbol: e.target.value})}
                  className="col-span-3 bg-gray-800 border-gray-600 text-white"
                >
                  <option value="">Select Symbol</option>
                  {cryptoSymbols.map(symbol => (
                    <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
                  ))}
                </Select>
              </div>

              {/* Alert Type */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-white">Type</label>
                <Select 
                  value={newAlert.alertType}
                  onChange={(e) => setNewAlert({...newAlert, alertType: e.target.value})}
                  className="col-span-3 bg-gray-800 border-gray-600 text-white"
                >
                  <SelectItem value="PRICE_TARGET">Price Target</SelectItem>
                  <SelectItem value="PERCENTAGE_CHANGE">Percentage Change</SelectItem>
                </Select>
              </div>

              {/* Direction */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-white">Direction</label>
                <Select 
                  value={newAlert.direction}
                  onChange={(e) => setNewAlert({...newAlert, direction: e.target.value})}
                  className="col-span-3 bg-gray-800 border-gray-600 text-white"
                >
                  <SelectItem value="ABOVE">Above/Up</SelectItem>
                  <SelectItem value="BELOW">Below/Down</SelectItem>
                </Select>
              </div>

              {/* Target Price or Percentage */}
              {newAlert.alertType === 'PRICE_TARGET' ? (
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-white">Price ($)</label>
                  <Input
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
                  <label className="text-right text-white">Percentage (%)</label>
                  <Input
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
                <label className="text-right text-white">Phone</label>
                <Input
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
                onClick={() => setShowCreateModal(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button 
                onClick={createAlert}
                disabled={loading || !newAlert.symbol || !newAlert.phoneNumber || 
                  (newAlert.alertType === 'PRICE_TARGET' && !newAlert.targetPrice) ||
                  (newAlert.alertType === 'PERCENTAGE_CHANGE' && !newAlert.percentageChange)}
                className="bg-[#3861FB] hover:bg-[#2851FB] text-white"
              >
                {loading ? 'Creating...' : 'Create Alert'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default AlertManager