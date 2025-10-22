'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Badge } from "../../components/ui/badge"
import { Alert, AlertDescription } from "../../components/ui/alert"
import ResponsiveNavbar from "../../components/ResponsiveNavbar"
import { useAuth } from "../../lib/AuthContext"
import AuthModal from "../../components/AuthModal"
import { 
  Bell, Target, Phone, Mail, AlertTriangle, CheckCircle, 
  Trash2, Edit2, Plus, TrendingUp, TrendingDown, Percent
} from "lucide-react"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function AlertsPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [newAlert, setNewAlert] = useState({
    cryptocurrency: '',
    alertType: 'price',
    targetPrice: '',
    percentage: '',
    direction: 'above',
    notificationMethod: 'phone'
  })
  const [isCreating, setIsCreating] = useState(false)
  
  const { user, loading, isAuthenticated } = useAuth()

  // Mock cryptocurrency data
  const cryptocurrencies = [
    { symbol: "BTC", name: "Bitcoin", currentPrice: 67234.56 },
    { symbol: "ETH", name: "Ethereum", currentPrice: 3456.78 },
    { symbol: "BNB", name: "BNB", currentPrice: 432.11 },
    { symbol: "SOL", name: "Solana", currentPrice: 123.45 },
    { symbol: "XRP", name: "XRP", currentPrice: 0.6234 },
    { symbol: "DOGE", name: "Dogecoin", currentPrice: 0.2341 },
    { symbol: "ADA", name: "Cardano", currentPrice: 0.8756 },
    { symbol: "SHIB", name: "Shiba Inu", currentPrice: 0.000023 },
    { symbol: "USDC", name: "USD Coin", currentPrice: 1.0001 },
    { symbol: "SUI", name: "Sui", currentPrice: 2.34 },
    { symbol: "PEPE", name: "Pepe", currentPrice: 0.00001234 }
  ]

  // Show auth modal if user is not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowAuthModal(true)
    }
  }, [loading, isAuthenticated])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
        <ResponsiveNavbar 
          title="Price Alerts" 
          subtitle="Set up your crypto alerts" 
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#3861FB] border-t-transparent"></div>
        </div>
      </div>
    )
  }

  // Show auth modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
        <ResponsiveNavbar 
          title="Price Alerts" 
          subtitle="Set up your crypto alerts" 
        />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader className="text-center">
                <Bell className="h-12 w-12 text-[#3861FB] mx-auto mb-4" />
                <CardTitle className="text-white">Sign In Required</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-300">
                  Please sign in to create and manage your crypto price alerts.
                </p>
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  className="w-full bg-[#3861FB] hover:bg-[#2851FB]"
                >
                  Sign In to Create Alerts
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    )
  }

  const handleCreateAlert = async (e) => {
    e.preventDefault()
    setIsCreating(true)

    // Simulate API call
    setTimeout(() => {
      const selectedCrypto = cryptocurrencies.find(c => c.symbol === newAlert.cryptocurrency)
      const alertId = Date.now()
      
      const alert = {
        id: alertId,
        ...newAlert,
        cryptoName: selectedCrypto?.name || newAlert.cryptocurrency,
        currentPrice: selectedCrypto?.currentPrice || 0,
        createdAt: new Date().toISOString(),
        status: 'active'
      }
      
      setAlerts(prev => [alert, ...prev])
      setNewAlert({
        cryptocurrency: '',
        alertType: 'price',
        targetPrice: '',
        percentage: '',
        direction: 'above',
        notificationMethod: 'phone'
      })
      setIsCreating(false)
    }, 1000)
  }

  const handleDeleteAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const selectedCrypto = cryptocurrencies.find(c => c.symbol === newAlert.cryptocurrency)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      <ResponsiveNavbar 
        title="Price Alerts" 
        subtitle="Never miss a crypto move" 
        showBackButton={true}
        backUrl="/dashboard"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Welcome Message */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Create Price Alerts</h1>
            <p className="text-gray-300">
              Get instant notifications when your crypto targets are reached
            </p>
          </div>

          {/* Create New Alert Form */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Plus className="h-5 w-5 mr-2 text-[#16C784]" />
                New Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAlert} className="space-y-6">
                
                {/* Cryptocurrency Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Cryptocurrency
                  </label>
                  <Select
                    value={newAlert.cryptocurrency}
                    onValueChange={(value) => setNewAlert(prev => ({ ...prev, cryptocurrency: value }))}
                  >
                    <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                      <SelectValue placeholder="Select cryptocurrency" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {cryptocurrencies.map(crypto => (
                        <SelectItem key={crypto.symbol} value={crypto.symbol} className="text-white hover:bg-gray-700">
                          <div className="flex items-center justify-between w-full">
                            <span>{crypto.name} ({crypto.symbol})</span>
                            <span className="text-gray-400">${crypto.currentPrice.toLocaleString()}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedCrypto && (
                    <div className="text-sm text-gray-400">
                      Current price: <span className="text-white font-medium">${selectedCrypto.currentPrice.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Alert Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Alert Type
                    </label>
                    <Select
                      value={newAlert.alertType}
                      onValueChange={(value) => setNewAlert(prev => ({ ...prev, alertType: value }))}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="price" className="text-white hover:bg-gray-700">
                          <div className="flex items-center">
                            <Target className="h-4 w-4 mr-2" />
                            Price Target
                          </div>
                        </SelectItem>
                        <SelectItem value="percentage" className="text-white hover:bg-gray-700">
                          <div className="flex items-center">
                            <Percent className="h-4 w-4 mr-2" />
                            Percentage Change
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Direction */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Direction
                    </label>
                    <Select
                      value={newAlert.direction}
                      onValueChange={(value) => setNewAlert(prev => ({ ...prev, direction: value }))}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="above" className="text-white hover:bg-gray-700">
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2 text-[#16C784]" />
                            Goes Above
                          </div>
                        </SelectItem>
                        <SelectItem value="below" className="text-white hover:bg-gray-700">
                          <div className="flex items-center">
                            <TrendingDown className="h-4 w-4 mr-2 text-red-400" />
                            Goes Below
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Target Value */}
                {newAlert.alertType === 'price' ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Target Price (USD)
                    </label>
                    <Input
                      type="number"
                      step="0.00001"
                      placeholder="Enter target price"
                      value={newAlert.targetPrice}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, targetPrice: e.target.value }))}
                      className="bg-gray-800/50 border-gray-600 text-white"
                      required
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Percentage Change (%)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Enter percentage (e.g., 5 for 5%)"
                      value={newAlert.percentage}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, percentage: e.target.value }))}
                      className="bg-gray-800/50 border-gray-600 text-white"
                      required
                    />
                  </div>
                )}

                {/* Notification Method */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Notification Method
                  </label>
                  <Select
                    value={newAlert.notificationMethod}
                    onValueChange={(value) => setNewAlert(prev => ({ ...prev, notificationMethod: value }))}
                  >
                    <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="phone" className="text-white hover:bg-gray-700">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-[#16C784]" />
                          Voice Call
                        </div>
                      </SelectItem>
                      <SelectItem value="email" className="text-white hover:bg-gray-700">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </div>
                      </SelectItem>
                      <SelectItem value="both" className="text-white hover:bg-gray-700">
                        <div className="flex items-center">
                          <Bell className="h-4 w-4 mr-2" />
                          Both Phone & Email
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#3861FB] hover:bg-[#2851FB]"
                  disabled={isCreating || !newAlert.cryptocurrency}
                >
                  {isCreating ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Creating Alert...
                    </div>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Alert
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Active Alerts */}
          {alerts.length > 0 && (
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Active Alerts ({alerts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.map(alert => (
                  <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {alert.cryptoName}
                        </Badge>
                        <Badge 
                          className={alert.direction === 'above' 
                            ? 'bg-[#16C784]/20 text-[#16C784]' 
                            : 'bg-red-500/20 text-red-400'
                          }
                        >
                          {alert.direction === 'above' ? '↑' : '↓'} {alert.direction}
                        </Badge>
                      </div>
                      <div className="text-white font-medium">
                        {alert.alertType === 'price' 
                          ? `Target: $${parseFloat(alert.targetPrice).toLocaleString()}`
                          : `${alert.percentage}% change`
                        }
                      </div>
                      <div className="text-gray-400 text-sm">
                        Notify via: {alert.notificationMethod} • Created: {new Date(alert.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-[#16C784]/20 text-[#16C784]">
                        Active
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Other content can go here if needed */}

        </div>
      </div>
    </div>
  )
}