import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import StandardNavbar from '../components/StandardNavbar'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import { 
  Bell, Target, CheckCircle, Trash2, Plus, Pause
} from 'lucide-react'

interface AlertInterface {
  id: number
  cryptocurrency: string
  cryptoName: string
  alertType: 'price' | 'percentage' | 'volume' | 'technical'
  targetPrice?: string
  percentage?: string
  volumeChange?: string
  technicalIndicator?: string
  direction: 'above' | 'below'
  notificationMethod: 'phone' | 'email' | 'sms' | 'push' | 'all'
  priority: 'low' | 'medium' | 'high' | 'critical'
  currentPrice: number
  createdAt: string
  lastTriggered?: string
  triggerCount: number
  status: 'active' | 'triggered' | 'paused' | 'expired'
  expiresAt?: string
  notes?: string
  conditions: {
    priceChange24h?: number
    volumeThreshold?: number
    marketCap?: number
  }
}

const AlertsPage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [alerts, setAlerts] = useState<AlertInterface[]>([])
  const { isAuthenticated, loading } = useAuth()

  // Mock data for demonstration
  useEffect(() => {
    if (isAuthenticated) {
      const mockAlerts: AlertInterface[] = [
        {
          id: 1,
          cryptocurrency: 'BTCUSDT',
          cryptoName: 'Bitcoin',
          alertType: 'price',
          targetPrice: '95000',
          direction: 'above',
          notificationMethod: 'all',
          priority: 'high',
          currentPrice: 92500,
          createdAt: '2024-12-19',
          triggerCount: 0,
          status: 'active',
          conditions: {}
        }
      ];
      setAlerts(mockAlerts);
    }
  }, [isAuthenticated]);

  // Alert management functions
  const handleCreateAlert = () => {
    console.log('Create new alert');
  };

  const handleDeleteAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
        <StandardNavbar 
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
        <StandardNavbar 
          title="Price Alerts" 
          subtitle="Set up your crypto alerts" 
        />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto bg-gray-900/50 border-gray-700">
            <CardHeader className="text-center">
              <Bell className="h-12 w-12 text-[#3861FB] mx-auto mb-4" />
              <CardTitle className="text-white">Sign In Required</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-400 mb-6">
                Please sign in to manage your cryptocurrency price alerts.
              </p>
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="w-full bg-[#3861FB] hover:bg-[#2851FB]"
              >
                Sign In to Continue
              </Button>
            </CardContent>
          </Card>
        </div>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      <StandardNavbar 
        title="Price Alerts"
        subtitle="Advanced Crypto Alert Management"
      />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">

          {/* Alert Statistics Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <Bell className="h-8 w-8 text-[#3861FB] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{alerts.length}</div>
                <div className="text-xs text-gray-400">Total Alerts</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {alerts.filter(a => a.status === 'active').length}
                </div>
                <div className="text-xs text-gray-400">Active</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {alerts.filter(a => a.status === 'triggered').length}
                </div>
                <div className="text-xs text-gray-400">Triggered</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <Pause className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {alerts.filter(a => a.status === 'paused').length}
                </div>
                <div className="text-xs text-gray-400">Paused</div>
              </CardContent>
            </Card>
          </div>

          {/* Create New Alert Button */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Manage Alerts</h1>
            <Button 
              onClick={handleCreateAlert}
              className="bg-[#3861FB] hover:bg-[#2851FB]"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Alert
            </Button>
          </div>

          {/* Alerts List */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bell className="h-5 w-5 mr-2 text-[#3861FB]" />
                Your Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length > 0 ? (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div 
                      key={alert.id}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-[#3861FB]/20 rounded-full flex items-center justify-center">
                          <Bell className="h-5 w-5 text-[#3861FB]" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{alert.cryptoName}</div>
                          <div className="text-sm text-gray-400">
                            Alert when {alert.direction} ${alert.targetPrice}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={alert.status === 'active' ? 'default' : 'secondary'}
                          className={alert.status === 'active' ? 'bg-green-500' : ''}
                        >
                          {alert.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No alerts yet</h3>
                  <p className="text-gray-400 mb-6">Create your first price alert to get started</p>
                  <Button 
                    onClick={handleCreateAlert}
                    className="bg-[#3861FB] hover:bg-[#2851FB]"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Alert
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AlertsPage
