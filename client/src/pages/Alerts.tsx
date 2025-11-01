import React, { useState, useEffect } from 'react'
import StandardNavbar from '../components/StandardNavbar'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import { api } from '../lib/api'
import { AlertService } from '../services/alertService'
import type { Alert, AlertCondition } from '../types'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Switch } from '../components/ui/switch'
import { useToast } from '../hooks/use-toast'
import { 
  Bell, Lock, Shield, Plus, Trash2, Edit2, Phone, 
  TrendingUp, TrendingDown, Percent, CheckCircle,
  BarChart3, Clock, Volume2, Eye, Activity, Pause, Play
} from 'lucide-react'

// Import crypto icons
import BTC_ICON from '/cryptoIcons/BTC.png'
import ETH_ICON from '/cryptoIcons/ETH.png'
import BNB_ICON from '/cryptoIcons/BNB.png'
import SOL_ICON from '/cryptoIcons/SOL.png'
import XRP_ICON from '/cryptoIcons/XRP.png'
import DOGE_ICON from '/cryptoIcons/DOGE.png'
import ADA_ICON from '/cryptoIcons/ADA.png'
import SHIB_ICON from '/cryptoIcons/SHIB.png'
import USDC_ICON from '/cryptoIcons/USDC.png'
import SUI_ICON from '/cryptoIcons/SUI.png'
import PEPE_ICON from '/cryptoIcons/PEPE.png'

// Fallback icon for cryptocurrencies without specific icons
const DEFAULT_CRYPTO_ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpath d='M8 12h8'%3E%3C/path%3E%3Cpath d='M12 8v8'%3E%3C/path%3E%3C/svg%3E"

// Create crypto icon mapping
const CRYPTO_ICONS: Record<string, string> = {
  BTC: BTC_ICON,
  ETH: ETH_ICON,
  BNB: BNB_ICON,
  SOL: SOL_ICON,
  XRP: XRP_ICON,
  DOGE: DOGE_ICON,
  ADA: ADA_ICON,
  SHIB: SHIB_ICON,
  USDC: USDC_ICON,
  SUI: SUI_ICON,
  PEPE: PEPE_ICON,
  // Use fallback for cryptocurrencies without specific icon files
  TRX: DEFAULT_CRYPTO_ICON,
  LINK: DEFAULT_CRYPTO_ICON,
  LTC: DEFAULT_CRYPTO_ICON,
  POL: DEFAULT_CRYPTO_ICON,
  BCH: DEFAULT_CRYPTO_ICON,
  DOT: DEFAULT_CRYPTO_ICON,
  AVAX: DEFAULT_CRYPTO_ICON,
  UNI: DEFAULT_CRYPTO_ICON,
  XLM: DEFAULT_CRYPTO_ICON,
}

const AlertsPage: React.FC = () => {
  const { isAuthenticated, loading, profile } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [newAlert, setNewAlert] = useState({
    name: '',
    symbol: '',
    alert_type: 'price' as Alert['alert_type'],
    condition_type: 'price_above' as AlertCondition['condition_type'],
    target_value: '',
    notification_type: 'email' as 'email' | 'sms' | 'push',
    notification_destination: '',
    is_recurring: false,
    recurring_frequency: 'once' as Alert['recurring_frequency'],
    recurring_days: [] as number[],
    recurring_time: '',
    recurring_end_date: ''
  })
  const [isCreating, setIsCreating] = useState(false)
  const [activeTab, setActiveTab] = useState<'create' | 'active' | 'history'>('create')
  const [prices, setPrices] = useState<Record<string, number>>({})
  const [pricesLoading, setPricesLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [editingAlert, setEditingAlert] = useState<any | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  // Crypto info mapping - matches the Dashboard structure
  const cryptoInfo: Record<string, {name: string; symbol: string; rank: number}> = {
    BTCUSDT: { name: "Bitcoin", symbol: "BTC", rank: 1 },
    ETHUSDT: { name: "Ethereum", symbol: "ETH", rank: 2 },
    BNBUSDT: { name: "BNB", symbol: "BNB", rank: 3 },
    SOLUSDT: { name: "Solana", symbol: "SOL", rank: 4 },
    XRPUSDT: { name: "XRP", symbol: "XRP", rank: 5 },
    DOGEUSDT: { name: "Dogecoin", symbol: "DOGE", rank: 6 },
    ADAUSDT: { name: "Cardano", symbol: "ADA", rank: 7 },
    SHIBUSDT: { name: "Shiba Inu", symbol: "SHIB", rank: 8 },
    USDCUSDT: { name: "USD Coin", symbol: "USDC", rank: 9 },
    SUIUSDT: { name: "Sui", symbol: "SUI", rank: 10 },
    PEPEUSDT: { name: "Pepe", symbol: "PEPE", rank: 11 },
    TRXUSDT: { name: "TRON", symbol: "TRX", rank: 12 },
    LINKUSDT: { name: "Chainlink", symbol: "LINK", rank: 13 },
    LTCUSDT: { name: "Litecoin", symbol: "LTC", rank: 14 },
    POLYUSDT: { name: "Polygon", symbol: "POL", rank: 15 },
    BCHUSDT: { name: "Bitcoin Cash", symbol: "BCH", rank: 16 },
    DOTUSDT: { name: "Polkadot", symbol: "DOT", rank: 17 },
    AVAXUSDT: { name: "Avalanche", symbol: "AVAX", rank: 18 },
    UNIUSDT: { name: "Uniswap", symbol: "UNI", rank: 19 },
    XLMUSDT: { name: "Stellar", symbol: "XLM", rank: 20 }
  }

  // Fetch live prices from API
  const fetchPrices = async () => {
    setPricesLoading(true)
    try {
      const res = await api.get("/prices")
      const newPrices = res.data.prices || {}
      setPrices(newPrices)
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Failed to fetch prices:", error)
      toast({
        title: "Error",
        description: "Failed to fetch live cryptocurrency prices",
        variant: "destructive",
      })
    } finally {
      setPricesLoading(false)
    }
  }

  // Create cryptocurrencies array with live data
  const getCryptocurrencies = () => {
    return Object.keys(cryptoInfo).map(pair => {
      const info = cryptoInfo[pair]
      const currentPrice = prices[pair] || 0
      
      // Generate realistic mock data for 24h change until backend provides it
      const mockChange24h = ((Math.sin(info.rank * 0.5) * 10) + (Math.random() - 0.5) * 5).toFixed(2)
      
      return {
        symbol: info.symbol,
        name: info.name,
        currentPrice: currentPrice,
        change24h: parseFloat(mockChange24h),
        volume: "Live", // Live indicator until backend provides volume data
        pair: pair
      }
    }).sort((a, b) => cryptoInfo[a.pair].rank - cryptoInfo[b.pair].rank)
  }

  const cryptocurrencies = getCryptocurrencies()

  // Price formatting utility function - handles different price ranges properly
  const formatPrice = (price: number): string => {
    if (price === 0) return '$0.00'
    
    if (price >= 1) {
      // For prices >= $1 (BTC, ETH, BNB, SOL, etc.) -> $67,234.56
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    } else if (price >= 0.01) {
      // For prices $0.01-$1 (XRP, ADA, DOGE, etc.) -> $0.6234
      return `$${price.toFixed(4)}`
    } else if (price >= 0.0001) {
      // For small prices $0.0001-$0.01 (SUI, etc.) -> $0.001234
      return `$${price.toFixed(6)}`
    } else {
      // For very small prices <$0.0001 (PEPE, SHIB, etc.) -> $0.00001234
      return `$${price.toFixed(8)}`
    }
  }

  // Fetch alerts from database
  const fetchAlerts = async () => {
    try {
      const response = await AlertService.getUserAlerts()
      if (response.error) {
        console.error('Error fetching alerts:', response.error)
        toast({
          title: 'Error',
          description: response.error,
          variant: 'destructive'
        })
      } else {
        setAlerts(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching alerts:', error)
      toast({
        title: 'Error',
        description: 'Failed to load alerts',
        variant: 'destructive'
      })
    }
  }

  // Fetch prices on component mount and set up auto-refresh
  useEffect(() => {
    fetchPrices()
    
    // Fetch alerts if user is authenticated
    if (isAuthenticated) {
      fetchAlerts()
    }
    
    // Set up auto-refresh every 5 seconds
    const interval = setInterval(() => {
      fetchPrices()
    }, 5000)

    return () => clearInterval(interval)
  }, [isAuthenticated])

  // Auto-populate notification destination based on user profile and notification type
  useEffect(() => {
    if (profile && (newAlert.notification_destination === '' || isUsingProfileDestination())) {
      const destination = getDefaultNotificationDestination(newAlert.notification_type)
      if (destination) {
        setNewAlert(prev => ({ ...prev, notification_destination: destination }))
      }
    }
  }, [profile, newAlert.notification_type])

  // Helper function to check if current destination matches profile data
  const isUsingProfileDestination = () => {
    if (!profile) return false
    
    const currentDestination = newAlert.notification_destination
    switch (newAlert.notification_type) {
      case 'email':
        return currentDestination === profile.email
      case 'sms':
        return currentDestination === profile.phone_number
      case 'push':
        return currentDestination === profile.id
      default:
        return false
    }
  }

  // Helper function to get default notification destination from profile
  const getDefaultNotificationDestination = (type: 'email' | 'sms' | 'push') => {
    if (!profile) return ''
    
    switch (type) {
      case 'email':
        return profile.email || ''
      case 'sms':
        return profile.phone_number || ''
      case 'push':
        return profile.id || '' // Use user ID for push notifications
      default:
        return ''
    }
  }

  // Helper function to reset alert form with auto-populated notification destination
  const resetAlertForm = (notificationType: 'email' | 'sms' | 'push' = 'email') => {
    const defaultDestination = getDefaultNotificationDestination(notificationType)
    
    setNewAlert({
      name: '',
      symbol: '',
      alert_type: 'price',
      condition_type: 'price_above',
      target_value: '',
      notification_type: notificationType,
      notification_destination: defaultDestination,
      is_recurring: false,
      recurring_frequency: 'once',
      recurring_days: [],
      recurring_time: '',
      recurring_end_date: ''
    })
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
        <StandardNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3861FB]"></div>
        </div>
      </div>
    )
  }

  // Show auth required message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
        <StandardNavbar />

        <main className="pt-16 px-4 pb-16">
          <Card className="max-w-2xl mx-auto bg-gray-900/50 border-gray-700 backdrop-blur-lg">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Bell className="h-20 w-20 text-[#3861FB]" />
                  <Lock className="h-8 w-8 text-[#EA3943] absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-1" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-white mb-2">
                Sign In Required
              </CardTitle>
              <p className="text-gray-400 text-lg">
                Create an account or sign in to manage your crypto price alerts
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Features */}
              <div className="grid gap-4 py-4">
                <div className="flex items-start space-x-3">
                  <Bell className="h-6 w-6 text-[#3861FB] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Real-Time Price Alerts</h3>
                    <p className="text-gray-400 text-sm">
                      Get instant notifications when your target prices are reached
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-6 w-6 text-[#16C784] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Voice Call Notifications</h3>
                    <p className="text-gray-400 text-sm">
                      Receive voice calls for critical price movements
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-[#16C784] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Secure & Private</h3>
                    <p className="text-gray-400 text-sm">
                      Your data is encrypted and protected with industry-standard security
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="flex-1 bg-[#3861FB] hover:bg-[#2851FB] text-white text-lg py-6"
                  size="lg"
                >
                  Sign In / Create Account
                </Button>
              </div>

              <p className="text-center text-sm text-gray-500">
                Free to use • No credit card required
              </p>
            </CardContent>
          </Card>
        </main>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    )
  }

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // If in edit mode, call update function instead
    if (isEditing) {
      return handleUpdateAlert(e)
    }
    
    if (!newAlert.symbol || !newAlert.target_value || !newAlert.notification_destination) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields including notification details.',
        variant: 'destructive'
      })
      return
    }

    // Validate recurring alert settings if enabled
    if (newAlert.is_recurring && newAlert.recurring_frequency !== 'once') {
      if (['daily', 'weekly', 'monthly'].includes(newAlert.recurring_frequency || '') && !newAlert.recurring_time) {
        toast({
          title: 'Missing Recurring Time',
          description: 'Please set a time for your recurring alert.',
          variant: 'destructive'
        })
        return
      }
      
      if (newAlert.recurring_frequency === 'weekly' && (!newAlert.recurring_days || newAlert.recurring_days.length === 0)) {
        toast({
          title: 'Missing Recurring Days',
          description: 'Please select at least one day for your weekly recurring alert.',
          variant: 'destructive'
        })
        return
      }
    }

    setIsCreating(true)

    try {
      const selectedCrypto = cryptocurrencies.find(c => c.symbol === newAlert.symbol)
      
      // Prepare alert data with proper null handling for database
      const cleanAlertData: any = {
        name: newAlert.name || `${selectedCrypto?.name || newAlert.symbol} Alert`,
        symbol: newAlert.symbol,
        alert_type: newAlert.alert_type,
        is_active: true,
        is_recurring: newAlert.is_recurring,
        recurring_frequency: newAlert.recurring_frequency || 'once',
        recurring_days: newAlert.recurring_days?.length > 0 ? newAlert.recurring_days : null,
        recurring_time: newAlert.recurring_time && newAlert.recurring_time.trim() !== '' ? newAlert.recurring_time : null,
        recurring_end_date: newAlert.recurring_end_date && newAlert.recurring_end_date.trim() !== '' ? newAlert.recurring_end_date : null,
        // Include condition and notification data
        condition_type: newAlert.alert_type === 'price' ? 'price_target' : 'percentage_change',
        target_value: newAlert.target_price || newAlert.percentage_change,
        notification_type: newAlert.notification_type,
        notification_destination: newAlert.notification_destination
      }

      // Remove any undefined or empty string values to avoid database errors
      // Also exclude recurring fields if is_recurring is false
      const alertData = Object.fromEntries(
        Object.entries(cleanAlertData).filter(([key, value]) => {
          // Always include basic alert fields
          if (['name', 'symbol', 'alert_type', 'is_active', 'is_recurring'].includes(key)) {
            return value !== undefined && value !== ''
          }
          
          // Include condition and notification fields
          if (['condition_type', 'target_value', 'notification_type', 'notification_destination'].includes(key)) {
            return value !== undefined && value !== '' && value !== null
          }
          
          // Only include recurring fields if is_recurring is true
          if (key.startsWith('recurring_')) {
            return cleanAlertData.is_recurring && value !== undefined && value !== '' && value !== null
          }
          
          return value !== undefined && value !== ''
        })
      ) as Partial<Alert>
      
      const response = await AlertService.createAlert(alertData)
      
      if (response.error) {
        throw new Error(response.error)
      }
      
      // Refresh alerts list
      await fetchAlerts()
      
      // Reset form with auto-populated notification destination
      resetAlertForm('email')
      
      toast({
        title: 'Alert Created!',
        description: `Successfully created alert for ${selectedCrypto?.name || newAlert.symbol}`,
      })

      setActiveTab('active')
    } catch (error: any) {
      console.error('Error creating alert:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to create alert. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteAlert = async (alertId: string) => {
    try {
      const response = await AlertService.deleteAlert(alertId)
      
      if (response.error) {
        throw new Error(response.error)
      }
      
      // Refresh alerts list
      await fetchAlerts()
      
      toast({
        title: 'Alert Deleted',
        description: 'Alert has been successfully removed.',
      })
    } catch (error: any) {
      console.error('Error deleting alert:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete alert',
        variant: 'destructive'
      })
    }
  }

  const handleEditAlert = (alert: Alert) => {
    setEditingAlert(alert)
    
    // Get existing condition and notification data from the alert
    const existingCondition = alert.alert_conditions?.[0]
    const existingNotification = alert.alert_notifications?.[0]
    
    setNewAlert({
      name: alert.name || `${alert.symbol} Alert`,
      symbol: alert.symbol,
      alert_type: alert.alert_type,
      condition_type: existingCondition?.condition_type || (alert.alert_type === 'price' ? 'price_above' : 'percentage_increase'),
      target_price: alert.alert_type === 'price' ? existingCondition?.target_value?.toString() || '' : '',
      percentage_change: alert.alert_type === 'percentage' ? existingCondition?.target_value?.toString() || '' : '',
      target_value: existingCondition?.target_value?.toString() || '0',
      notification_type: existingNotification?.notification_type || 'email',
      notification_destination: existingNotification?.destination || profile?.email || '',
      is_recurring: alert.is_recurring || false,
      recurring_frequency: alert.recurring_frequency || 'once',
      recurring_days: alert.recurring_days || [],
      recurring_time: alert.recurring_time || '',
      recurring_end_date: alert.recurring_end_date || ''
    })
    setIsEditing(true)
    setActiveTab('create')
    toast({
      title: 'Edit Mode',
      description: 'You can now modify the alert settings.',
    })
  }

  const handleCancelEdit = () => {
    setEditingAlert(null)
    setIsEditing(false)
    resetAlertForm('email')
    toast({
      title: 'Edit Cancelled',
      description: 'Alert editing has been cancelled.',
    })
  }

  const handleUpdateAlert = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAlert) return

    setIsCreating(true)
    
    try {
      const selectedCrypto = cryptocurrencies.find(c => c.symbol === newAlert.symbol)
      
      // Prepare update data with all fields including conditions and notifications
      const cleanUpdateData: any = {
        name: newAlert.name || `${selectedCrypto?.name || newAlert.symbol} Alert`,
        symbol: newAlert.symbol,
        alert_type: newAlert.alert_type,
        is_recurring: newAlert.is_recurring,
        recurring_frequency: newAlert.recurring_frequency || 'once',
        recurring_days: newAlert.recurring_days?.length > 0 ? newAlert.recurring_days : null,
        recurring_time: newAlert.recurring_time && newAlert.recurring_time.trim() !== '' ? newAlert.recurring_time : null,
        recurring_end_date: newAlert.recurring_end_date && newAlert.recurring_end_date.trim() !== '' ? newAlert.recurring_end_date : null,
        // Include condition and notification data
        condition_type: newAlert.alert_type === 'price' ? 'price_target' : 'percentage_change',
        target_value: newAlert.target_price || newAlert.percentage_change,
        notification_type: newAlert.notification_type,
        notification_destination: newAlert.notification_destination
      }

      // Remove any undefined or empty string values to avoid database errors
      const updates = Object.fromEntries(
        Object.entries(cleanUpdateData).filter(([key, value]) => {
          // Always include basic alert fields
          if (['name', 'symbol', 'alert_type', 'is_recurring'].includes(key)) {
            return value !== undefined && value !== ''
          }
          
          // Include condition and notification fields
          if (['condition_type', 'target_value', 'notification_type', 'notification_destination'].includes(key)) {
            return value !== undefined && value !== '' && value !== null
          }
          
          // Only include recurring fields if is_recurring is true
          if (key.startsWith('recurring_')) {
            return cleanUpdateData.is_recurring && value !== undefined && value !== '' && value !== null
          }
          
          return value !== undefined && value !== ''
        })
      ) as Partial<Alert>
      
      const response = await AlertService.updateAlert(editingAlert.id, updates)
      
      if (response.error) {
        throw new Error(response.error)
      }
      
      // Refresh alerts list
      await fetchAlerts()
      
      // Reset states
      handleCancelEdit()
      
      toast({
        title: 'Alert Updated',
        description: `Successfully updated alert for ${selectedCrypto?.name || newAlert.symbol}`,
      })
    } catch (error: any) {
      console.error('Error updating alert:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to update alert',
        variant: 'destructive'
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleTogglePause = async (alertId: string) => {
    try {
      const alert = alerts.find(a => a.id === alertId)
      if (!alert) return
      
      const newActiveState = !alert.is_active
      const response = await AlertService.toggleAlertStatus(alertId, newActiveState)
      
      if (response.error) {
        throw new Error(response.error)
      }
      
      // Refresh alerts list
      await fetchAlerts()
      
      toast({
        title: newActiveState ? 'Alert Activated' : 'Alert Paused',
        description: `Alert has been ${newActiveState ? 'activated' : 'paused'}.`,
      })
    } catch (error: any) {
      console.error('Error toggling alert status:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to update alert status',
        variant: 'destructive'
      })
    }
  }

  const selectedCrypto = cryptocurrencies.find(c => c.symbol === newAlert.symbol)

  // User is authenticated - show comprehensive alerts manager
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      <StandardNavbar />
      <main className="pt-16 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <Bell className="h-10 w-10 text-[#3861FB]" />
              Price Alerts
            </h1>
            <p className="text-gray-300 text-lg">
              Never miss a crypto move • Get instant notifications when your targets are hit
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Activity className="h-8 w-8 text-[#3861FB]" />
                  <div>
                    <div className="text-2xl font-bold text-white">{alerts.length}</div>
                    <div className="text-sm text-gray-400">Active Alerts</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-[#16C784]" />
                  <div>
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-sm text-gray-400">Triggered Today</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Volume2 className="h-8 w-8 text-[#EA3943]" />
                  <div>
                    <div className="text-2xl font-bold text-white">20</div>
                    <div className="text-sm text-gray-400">Supported Coins</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Eye className="h-8 w-8 text-[#7C3AED]" />
                  <div>
                    <div className="text-2xl font-bold text-white">24/7</div>
                    <div className="text-sm text-gray-400">Monitoring</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Navigation */}
          <div className="flex space-x-1 mb-6 bg-gray-900/30 p-1 rounded-lg backdrop-blur-sm">
            <button
              onClick={() => {
                if (isEditing) {
                  handleCancelEdit()
                }
                setActiveTab('create')
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'create'
                  ? 'bg-[#3861FB] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              {isEditing ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {isEditing ? 'Edit Alert' : 'Create Alert'}
            </button>
            <button
              onClick={() => {
                if (isEditing) {
                  handleCancelEdit()
                }
                setActiveTab('active')
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'active'
                  ? 'bg-[#3861FB] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Bell className="h-5 w-5" />
              Active Alerts ({alerts.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'history'
                  ? 'bg-[#3861FB] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Clock className="h-5 w-5" />
              History
            </button>
          </div>

          {/* Live Data Status */}
          <div className="flex items-center justify-between mb-6 p-3 bg-gray-900/30 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${pricesLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span className="text-sm text-gray-300">
                {pricesLoading ? 'Fetching live prices...' : 'Live prices connected'}
              </span>
              {lastUpdate && (
                <span className="text-xs text-gray-500">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <BarChart3 className="h-4 w-4" />
              <span>Auto-refresh every 5s</span>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'create' && (
            <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <Edit2 className="h-6 w-6 text-[#EA3943]" />
                    ) : (
                      <Plus className="h-6 w-6 text-[#16C784]" />
                    )}
                    {isEditing ? 'Edit Alert' : 'Create New Alert'}
                  </div>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="text-gray-400 hover:text-white border-gray-600"
                    >
                      Cancel Edit
                    </Button>
                  )}
                </CardTitle>
                <p className="text-gray-400">
                  {isEditing 
                    ? 'Modify your existing alert settings below'
                    : 'Set up price alerts for your favorite cryptocurrencies'
                  }
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAlert} className="space-y-6">
                  {/* Cryptocurrency Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="crypto" className="text-white font-medium">
                      Cryptocurrency
                    </Label>
                    <Select
                      value={newAlert.symbol}
                      onValueChange={(value) => setNewAlert(prev => ({ ...prev, symbol: value }))}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white h-16 px-4">
                        <SelectValue placeholder="Choose a cryptocurrency to monitor">
                          {newAlert.symbol && (
                            <div className="flex items-center gap-4 w-full">
                              {/* Rank */}
                              <div className="bg-[#3861FB] text-white px-2 py-1 rounded text-xs font-bold flex-shrink-0">
                                #{cryptocurrencies.findIndex(c => c.symbol === newAlert.symbol) + 1}
                              </div>
                              
                              {/* Icon */}
                              {CRYPTO_ICONS[newAlert.symbol] ? (
                                <img 
                                  src={CRYPTO_ICONS[newAlert.symbol]} 
                                  alt={newAlert.symbol}
                                  className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center border border-gray-600 flex-shrink-0">
                                  <span className="text-xs font-bold text-gray-300">{newAlert.symbol.slice(0, 2)}</span>
                                </div>
                              )}
                              
                              {/* Name and Symbol */}
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <span className="font-semibold text-white text-base truncate">
                                  {cryptocurrencies.find(c => c.symbol === newAlert.symbol)?.name}
                                </span>
                                <Badge variant="outline" className="text-xs border-gray-500 text-gray-300 flex-shrink-0">
                                  {newAlert.symbol}
                                </Badge>
                              </div>
                              
                              {/* Price */}
                              <div className="text-right flex-shrink-0">
                                <span className="font-bold text-white text-sm">
                                  {formatPrice(cryptocurrencies.find(c => c.symbol === newAlert.symbol)?.currentPrice || 0)}
                                </span>
                              </div>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600 max-h-[400px] w-full">
                        {cryptocurrencies.map((crypto, index) => (
                          <SelectItem key={crypto.symbol} value={crypto.symbol} className="text-white hover:bg-gray-700 p-0 cursor-pointer">
                            <div className="flex items-center w-full px-4 py-3 min-h-[60px] gap-4">
                              {/* Rank */}
                              <div className="text-gray-400 text-sm font-bold w-8 text-center flex-shrink-0">
                                {index + 1}
                              </div>
                              
                              {/* Crypto Icon */}
                              <div className="flex-shrink-0">
                                {CRYPTO_ICONS[crypto.symbol] ? (
                                  <img 
                                    src={CRYPTO_ICONS[crypto.symbol]} 
                                    alt={crypto.name}
                                    className="w-9 h-9 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center border border-gray-600">
                                    <span className="text-xs font-bold text-gray-300">{crypto.symbol.slice(0, 2)}</span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Name and Symbol */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3">
                                  <span className="font-semibold text-white text-base truncate">{crypto.name}</span>
                                  <Badge variant="outline" className="text-xs border-gray-500 text-gray-300 flex-shrink-0">
                                    {crypto.symbol}
                                  </Badge>
                                </div>
                                <div className="text-xs text-gray-400 mt-1">Market Cap Rank #{index + 1}</div>
                              </div>
                              
                              {/* Price */}
                              <div className="text-right flex-shrink-0 min-w-[100px]">
                                <div className="text-base font-bold text-white">{formatPrice(crypto.currentPrice)}</div>
                                <div className={`text-sm flex items-center justify-end gap-1 ${crypto.change24h >= 0 ? 'text-[#16C784]' : 'text-[#EA3943]'}`}>
                                  <span className="text-xs">
                                    {crypto.change24h >= 0 ? '▲' : '▼'}
                                  </span>
                                  {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedCrypto && (
                      <div className="bg-gray-800/30 p-3 sm:p-5 rounded-lg border border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                          <div className="flex items-center gap-3 sm:gap-4 flex-1">
                            {/* Rank Badge */}
                            <div className="flex-shrink-0">
                              <div className="bg-[#3861FB] text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold">
                                #{cryptocurrencies.findIndex(c => c.symbol === selectedCrypto.symbol) + 1}
                              </div>
                            </div>
                            
                            {/* Crypto Icon */}
                            <div className="flex-shrink-0">
                              {CRYPTO_ICONS[selectedCrypto.symbol] ? (
                                <img 
                                  src={CRYPTO_ICONS[selectedCrypto.symbol]} 
                                  alt={selectedCrypto.name}
                                  className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-gray-600"
                                />
                              ) : (
                                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-700 rounded-full flex items-center justify-center border-2 border-gray-600">
                                  <span className="text-xs sm:text-sm font-bold text-gray-300">{selectedCrypto.symbol.slice(0, 2)}</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Name and Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                                <h3 className="text-white font-bold text-lg sm:text-xl truncate">{selectedCrypto.name}</h3>
                                <Badge variant="outline" className="text-xs sm:text-sm border-gray-500 text-gray-300 w-fit">
                                  {selectedCrypto.symbol}
                                </Badge>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-400">
                                <span>Market Cap Rank #{cryptocurrencies.findIndex(c => c.symbol === selectedCrypto.symbol) + 1}</span>
                                <div className="hidden sm:flex items-center gap-4">
                                  <span>•</span>
                                  <span>Live Data Connected</span>
                                  <span>•</span>
                                  <span className="text-[#16C784]">●</span>
                                  <span>Real-time Pricing</span>
                                </div>
                                <div className="flex items-center gap-2 sm:hidden">
                                  <span className="text-[#16C784]">●</span>
                                  <span>Live Data</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Price Information */}
                          <div className="flex items-center justify-between sm:block sm:text-right flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-600">
                            <div className="text-white font-bold text-xl sm:text-3xl">{formatPrice(selectedCrypto.currentPrice)}</div>
                            <div className={`flex items-center gap-1 sm:gap-2 sm:justify-end ${selectedCrypto.change24h >= 0 ? 'text-[#16C784]' : 'text-[#EA3943]'}`}>
                              <span className="text-sm sm:text-lg">
                                {selectedCrypto.change24h >= 0 ? '▲' : '▼'}
                              </span>
                              <span className="text-sm sm:text-lg font-semibold">
                                {selectedCrypto.change24h >= 0 ? '+' : ''}{selectedCrypto.change24h.toFixed(2)}%
                              </span>
                              <span className="text-xs sm:text-sm text-gray-400">24h</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Alert Name */}
                  <div className="space-y-2 mb-6">
                    <Label className="text-white font-medium">Alert Name (Optional)</Label>
                    <Input
                      value={newAlert.name}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="My BTC Alert"
                      className="bg-gray-800/50 border-gray-600 text-white"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Alert Category */}
                    <div className="space-y-2">
                      <Label className="text-white font-medium">Alert Category</Label>
                      <Select
                        value={newAlert.alert_type}
                        onValueChange={(value) => setNewAlert(prev => ({ ...prev, alert_type: value as Alert['alert_type'] }))}
                      >
                        <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="price" className="text-white hover:bg-gray-700">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-[#16C784]" />
                              Price Alert (USD)
                            </div>
                          </SelectItem>
                          <SelectItem value="percent_change" className="text-white hover:bg-gray-700">
                            <div className="flex items-center gap-2">
                              <Percent className="h-4 w-4 text-[#3861FB]" />
                              Percentage Change (%)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Alert Direction */}
                    <div className="space-y-2">
                      <Label className="text-white font-medium">Alert Direction</Label>
                      <Select
                        value={newAlert.condition_type}
                        onValueChange={(value) => setNewAlert(prev => ({ ...prev, condition_type: value as AlertCondition['condition_type'] }))}
                      >
                        <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {newAlert.alert_type === 'price' ? (
                            <>
                              <SelectItem value="price_above" className="text-white hover:bg-gray-700">
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="h-4 w-4 text-[#16C784]" />
                                  Above Target Price
                                </div>
                              </SelectItem>
                              <SelectItem value="price_below" className="text-white hover:bg-gray-700">
                                <div className="flex items-center gap-2">
                                  <TrendingDown className="h-4 w-4 text-[#EA3943]" />
                                  Below Target Price
                                </div>
                              </SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="percent_change_up" className="text-white hover:bg-gray-700">
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="h-4 w-4 text-[#16C784]" />
                                  Increase by %
                                </div>
                              </SelectItem>
                              <SelectItem value="percent_change_down" className="text-white hover:bg-gray-700">
                                <div className="flex items-center gap-2">
                                  <TrendingDown className="h-4 w-4 text-[#EA3943]" />
                                  Decrease by %
                                </div>
                              </SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Target Value */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-white font-medium">
                        {newAlert.alert_type === 'percent_change' ? 'Percentage Change (%)' : 'Target Price (USD)'}
                      </Label>
                      {/* Current Price Display */}
                      {newAlert.symbol && newAlert.alert_type === 'price' && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-400">Current Price:</span>
                          <span className="font-bold text-[#16C784] bg-gray-800/50 px-3 py-1 rounded-full border border-gray-600">
                            {formatPrice(cryptocurrencies.find(c => c.symbol === newAlert.symbol)?.currentPrice || 0)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Price Helper Message */}
                    {newAlert.symbol && newAlert.alert_type === 'price' && (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-2">
                        <div className="flex items-center gap-2 text-blue-300 text-sm">
                          <TrendingUp className="h-4 w-4" />
                          <span>
                            Set your target {newAlert.condition_type === 'price_above' ? 'above' : 'below'} the current price of{' '}
                            <span className="font-semibold">
                              {formatPrice(cryptocurrencies.find(c => c.symbol === newAlert.symbol)?.currentPrice || 0)}
                            </span>
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <Input
                      type="number"
                      step={newAlert.alert_type === 'percent_change' ? "0.1" : "0.00001"}
                      placeholder={
                        newAlert.alert_type === 'percent_change' 
                          ? "Enter percentage (e.g., 5 for 5%)" 
                          : newAlert.symbol 
                            ? `Enter target price (Current: ${formatPrice(cryptocurrencies.find(c => c.symbol === newAlert.symbol)?.currentPrice || 0)})`
                            : "Enter target price"
                      }
                      value={newAlert.target_value}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, target_value: e.target.value }))}
                      className="bg-gray-800/50 border-gray-600 text-white"
                    />
                    
                    {/* Quick Price Actions */}
                    {newAlert.symbol && newAlert.alert_type === 'price' && (
                      <div className="space-y-2 mt-2">
                        <span className="text-xs text-gray-400 block">Quick targets:</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[5, 10, 15, 20].map(percentage => {
                            const currentPrice = cryptocurrencies.find(c => c.symbol === newAlert.symbol)?.currentPrice || 0;
                            const targetPrice = newAlert.condition_type === 'price_above' 
                              ? currentPrice * (1 + percentage / 100)
                              : currentPrice * (1 - percentage / 100);
                            
                            return (
                              <Button
                                key={percentage}
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-xs bg-gray-800/30 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                                onClick={() => setNewAlert(prev => ({ ...prev, target_value: targetPrice.toFixed(8) }))}
                              >
                                <span className="truncate">
                                  {newAlert.condition_type === 'price_above' ? '+' : '-'}{percentage}%
                                  <span className="hidden sm:inline"> ({formatPrice(targetPrice)})</span>
                                </span>
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Notification Type */}
                    <div className="space-y-2">
                      <Label className="text-white font-medium">Notification Type</Label>
                      <Select
                        value={newAlert.notification_type}
                        onValueChange={(value) => setNewAlert(prev => ({ ...prev, notification_type: value as 'email' | 'sms' | 'push' }))}
                      >
                        <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="email" className="text-white hover:bg-gray-700">
                            <div className="flex items-center gap-2">
                              <Bell className="h-4 w-4 text-[#3861FB]" />
                              Email Notification
                            </div>
                          </SelectItem>
                          <SelectItem value="sms" className="text-white hover:bg-gray-700">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-[#16C784]" />
                              SMS/Text Message
                            </div>
                          </SelectItem>
                          <SelectItem value="push" className="text-white hover:bg-gray-700">
                            <div className="flex items-center gap-2">
                              <Bell className="h-4 w-4 text-[#EA3943]" />
                              Push Notification
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Notification Destination */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-white font-medium">
                          {newAlert.notification_type === 'email' ? 'Email Address' : 
                           newAlert.notification_type === 'sms' ? 'Phone Number' : 'Device ID'}
                        </Label>
                        {profile && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 p-1"
                            onClick={() => {
                              const defaultDestination = getDefaultNotificationDestination(newAlert.notification_type)
                              if (defaultDestination) {
                                setNewAlert(prev => ({ ...prev, notification_destination: defaultDestination }))
                                toast({
                                  title: 'Profile Info Used',
                                  description: `Using your profile ${newAlert.notification_type === 'email' ? 'email' : newAlert.notification_type === 'sms' ? 'phone number' : 'information'}`,
                                })
                              } else {
                                toast({
                                  title: 'Profile Info Missing',
                                  description: `Please add a ${newAlert.notification_type === 'email' ? 'email' : 'phone number'} to your profile first`,
                                  variant: 'destructive'
                                })
                              }
                            }}
                            disabled={!getDefaultNotificationDestination(newAlert.notification_type)}
                          >
                            Use My {newAlert.notification_type === 'email' ? 'Email' : newAlert.notification_type === 'sms' ? 'Phone' : 'Profile'}
                            {!getDefaultNotificationDestination(newAlert.notification_type) && (
                              <span className="ml-1 text-red-400">✗</span>
                            )}
                          </Button>
                        )}
                      </div>
                      
                      <div className="relative">
                        <Input
                          type={newAlert.notification_type === 'email' ? 'email' : 'text'}
                          placeholder={
                            newAlert.notification_type === 'email' ? 
                              (profile?.email ? `Default: ${profile.email}` : 'your@email.com') :
                            newAlert.notification_type === 'sms' ? 
                              (profile?.phone_number ? `Default: ${profile.phone_number}` : '+1234567890') : 
                              'device-id-123'
                          }
                          value={newAlert.notification_destination}
                          onChange={(e) => setNewAlert(prev => ({ ...prev, notification_destination: e.target.value }))}
                          className="bg-gray-800/50 border-gray-600 text-white"
                        />
                        
                        {/* Profile info hint */}
                        {profile && newAlert.notification_destination === '' && (
                          <div className="absolute inset-y-0 right-3 flex items-center">
                            <span className="text-xs text-gray-400">
                              {newAlert.notification_type === 'email' && profile.email && '(Using profile email)'}
                              {newAlert.notification_type === 'sms' && profile.phone_number && '(Using profile phone)'}
                              {newAlert.notification_type === 'sms' && !profile.phone_number && '(No phone in profile)'}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Profile information display */}
                      {profile && (
                        <div className="bg-gray-800/20 rounded-lg p-3 border border-gray-600">
                          <div className="text-xs text-gray-400 mb-2">Your Profile Information:</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Bell className="h-3 w-3 text-blue-400" />
                              <span className="text-gray-300">Email:</span>
                              <span className="text-white font-medium">
                                {profile.email || <span className="text-gray-500 italic">Not set</span>}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-green-400" />
                              <span className="text-gray-300">Phone:</span>
                              <span className="text-white font-medium">
                                {profile.phone_number || <span className="text-gray-500 italic">Not set</span>}
                              </span>
                            </div>
                          </div>
                          {(!profile.email || !profile.phone_number) && (
                            <div className="mt-2 text-xs text-yellow-400 flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              Update your profile to auto-fill notification details
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recurring Alert Section */}
                  <div className="space-y-4 border-t border-gray-600 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white font-medium text-lg">Recurring Alert</Label>
                        <p className="text-sm text-gray-400 mt-1">Get repeated notifications based on your schedule</p>
                      </div>
                      <Switch
                        checked={newAlert.is_recurring}
                        onCheckedChange={(checked) => setNewAlert(prev => ({ ...prev, is_recurring: checked }))}
                      />
                    </div>

                    {newAlert.is_recurring && (
                      <div className="space-y-4 bg-gray-800/30 rounded-lg p-4 border border-gray-600">
                        {/* Frequency Selection */}
                        <div className="space-y-2">
                          <Label className="text-white font-medium">Frequency</Label>
                          <Select
                            value={newAlert.recurring_frequency}
                            onValueChange={(value) => setNewAlert(prev => ({ ...prev, recurring_frequency: value as Alert['recurring_frequency'] }))}
                          >
                            <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              <SelectItem value="once" className="text-white hover:bg-gray-700">
                                Once (Single Alert)
                              </SelectItem>
                              <SelectItem value="hourly" className="text-white hover:bg-gray-700">
                                Every Hour
                              </SelectItem>
                              <SelectItem value="daily" className="text-white hover:bg-gray-700">
                                Daily
                              </SelectItem>
                              <SelectItem value="weekly" className="text-white hover:bg-gray-700">
                                Weekly
                              </SelectItem>
                              <SelectItem value="monthly" className="text-white hover:bg-gray-700">
                                Monthly
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Time Selection for daily/weekly/monthly */}
                        {['daily', 'weekly', 'monthly'].includes(newAlert.recurring_frequency || '') && (
                          <div className="space-y-2">
                            <Label className="text-white font-medium">Time</Label>
                            <Input
                              type="time"
                              value={newAlert.recurring_time}
                              onChange={(e) => setNewAlert(prev => ({ ...prev, recurring_time: e.target.value }))}
                              className="bg-gray-800/50 border-gray-600 text-white"
                            />
                          </div>
                        )}

                        {/* Days Selection for weekly */}
                        {newAlert.recurring_frequency === 'weekly' && (
                          <div className="space-y-2">
                            <Label className="text-white font-medium">Days of Week</Label>
                            <div className="grid grid-cols-7 gap-2">
                              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                <Button
                                  key={day}
                                  type="button"
                                  variant={newAlert.recurring_days.includes(index) ? "default" : "outline"}
                                  size="sm"
                                  className={`h-8 text-xs ${
                                    newAlert.recurring_days.includes(index)
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                                  }`}
                                  onClick={() => {
                                    const newDays = newAlert.recurring_days.includes(index)
                                      ? newAlert.recurring_days.filter(d => d !== index)
                                      : [...newAlert.recurring_days, index].sort()
                                    setNewAlert(prev => ({ ...prev, recurring_days: newDays }))
                                  }}
                                >
                                  {day}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* End Date Selection */}
                        {newAlert.recurring_frequency !== 'once' && (
                          <div className="space-y-2">
                            <Label className="text-white font-medium">End Date (Optional)</Label>
                            <Input
                              type="date"
                              value={newAlert.recurring_end_date}
                              onChange={(e) => setNewAlert(prev => ({ ...prev, recurring_end_date: e.target.value }))}
                              className="bg-gray-800/50 border-gray-600 text-white"
                              min={new Date().toISOString().split('T')[0]}
                            />
                            <p className="text-xs text-gray-500">Leave blank for indefinite recurring</p>
                          </div>
                        )}

                        {/* Recurring Alert Preview */}
                        {newAlert.recurring_frequency !== 'once' && (
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                            <div className="flex items-start gap-2 text-blue-300 text-sm">
                              <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium">Recurring Schedule Preview:</p>
                                <p>
                                  This alert will trigger{' '}
                                  {newAlert.recurring_frequency === 'hourly' && 'every hour'}
                                  {newAlert.recurring_frequency === 'daily' && `daily at ${newAlert.recurring_time || 'specified time'}`}
                                  {newAlert.recurring_frequency === 'weekly' && 
                                    `weekly on ${newAlert.recurring_days.length > 0 
                                      ? newAlert.recurring_days.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')
                                      : 'selected days'} at ${newAlert.recurring_time || 'specified time'}`}
                                  {newAlert.recurring_frequency === 'monthly' && `monthly at ${newAlert.recurring_time || 'specified time'}`}
                                  {newAlert.recurring_end_date && ` until ${new Date(newAlert.recurring_end_date).toLocaleDateString()}`}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className={`w-full py-2 sm:py-3 text-base sm:text-lg ${
                      isEditing 
                        ? 'bg-[#EA3943] hover:bg-[#DC2626]' 
                        : 'bg-[#3861FB] hover:bg-[#2851FB]'
                    } text-white`}
                    disabled={isCreating || !newAlert.symbol || !newAlert.notification_destination}
                  >
                    {isCreating ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span className="text-sm sm:text-base">
                          {isEditing ? 'Updating Alert...' : 'Creating Alert...'}
                        </span>
                      </div>
                    ) : (
                      <>
                        {isEditing ? (
                          <>
                            <Edit2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                            <span className="text-sm sm:text-base">Update Alert</span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                            <span className="text-sm sm:text-base">Create Alert</span>
                          </>
                        )}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'active' && (
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg">
                  <CardContent className="text-center py-12">
                    <div className="relative mb-6">
                      <Bell className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      {/* Floating crypto icons around the bell */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                        <img src={BTC_ICON} alt="BTC" className="w-8 h-8 rounded-full opacity-30" />
                        <img src={ETH_ICON} alt="ETH" className="w-6 h-6 rounded-full opacity-20" />
                        <img src={BNB_ICON} alt="BNB" className="w-7 h-7 rounded-full opacity-25" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Active Alerts</h3>
                    <p className="text-gray-400 mb-6">
                      Create your first price alert to get notified when your targets are reached
                    </p>
                    <Button 
                      onClick={() => setActiveTab('create')}
                      className="bg-[#3861FB] hover:bg-[#2851FB]"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Alert
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Bell className="h-6 w-6 text-[#16C784]" />
                      Active Alerts ({alerts.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {alerts.map(alert => (
                      <div key={alert.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors gap-4">
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          {/* Cryptocurrency Icon */}
                          <div className="flex-shrink-0">
                            {CRYPTO_ICONS[alert.symbol] ? (
                              <img 
                                src={CRYPTO_ICONS[alert.symbol]} 
                                alt={alert.symbol}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-600"
                              />
                            ) : (
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-full flex items-center justify-center border-2 border-gray-600">
                                <span className="text-xs sm:text-sm font-bold text-gray-300">{alert.symbol.slice(0, 2)}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Alert Information */}
                          <div className="flex-1 min-w-0">
                            {/* Header with Name and Type Badges */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-white border-gray-600 text-xs sm:text-sm font-semibold">
                                  {cryptocurrencies.find(c => c.symbol === alert.symbol)?.name || alert.symbol}
                                </Badge>
                                {(() => {
                                  const cryptoIndex = cryptocurrencies.findIndex(c => c.symbol === alert.symbol)
                                  return cryptoIndex >= 0 && (
                                    <Badge className="bg-gray-600/30 text-gray-300 border-gray-500/30 text-xs">
                                      #{cryptoIndex + 1}
                                    </Badge>
                                  )
                                })()}
                              </div>
                              <Badge 
                                className={`text-xs sm:text-sm ${alert.alert_type === 'price' 
                                  ? 'bg-[#16C784]/20 text-[#16C784] border-[#16C784]/30' 
                                  : 'bg-[#EA3943]/20 text-[#EA3943] border-[#EA3943]/30'
                                }`}
                              >
                                {alert.alert_type === 'price' ? '$ Price Alert' : alert.alert_type === 'percent_change' ? '% Change Alert' : alert.alert_type}
                              </Badge>
                              {(alert.trigger_count || 0) > 0 && (
                                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                                  Triggered {alert.trigger_count}x
                                </Badge>
                              )}
                            </div>

                            {/* Alert Title */}
                            <div className="text-white font-bold text-base sm:text-lg mb-3 truncate">
                              {alert.name || `${alert.symbol} Alert`}
                            </div>

                            {/* Alert Conditions - Target Price/Percentage */}
                            {(alert as any).alert_conditions && (alert as any).alert_conditions.length > 0 && (
                              <div className="mb-3 p-2 sm:p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                                <div className="text-xs sm:text-sm text-gray-300 mb-1 font-medium">Alert Conditions:</div>
                                {(alert as any).alert_conditions.map((condition: any) => (
                                  <div key={condition.id} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                                    <div className="flex items-center gap-2">
                                      {condition.condition_type === 'price_above' && <TrendingUp className="h-3 w-3 text-[#16C784]" />}
                                      {condition.condition_type === 'price_below' && <TrendingDown className="h-3 w-3 text-[#EA3943]" />}
                                      {condition.condition_type.includes('percent') && <Percent className="h-3 w-3 text-blue-400" />}
                                      
                                      <span className="text-gray-400">
                                        {condition.condition_type === 'price_above' && 'When price goes above'}
                                        {condition.condition_type === 'price_below' && 'When price goes below'}
                                        {condition.condition_type === 'percent_change_up' && 'When price increases by'}
                                        {condition.condition_type === 'percent_change_down' && 'When price decreases by'}
                                      </span>
                                    </div>
                                    <div className="font-semibold text-white">
                                      {condition.condition_type.includes('price') 
                                        ? formatPrice(condition.target_value)
                                        : `${condition.target_value}%`
                                      }
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Current Price and 24h Change */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                              <div className="text-xs sm:text-sm">
                                <span className="text-gray-400 block">Current Price:</span>
                                <span className="text-[#16C784] font-bold text-sm sm:text-base">
                                  {formatPrice(cryptocurrencies.find(c => c.symbol === alert.symbol)?.currentPrice || 0)}
                                </span>
                              </div>
                              <div className="text-xs sm:text-sm">
                                <span className="text-gray-400 block">24h Change:</span>
                                <span className={`font-bold text-sm sm:text-base ${
                                  (cryptocurrencies.find(c => c.symbol === alert.symbol)?.change24h || 0) >= 0 
                                    ? 'text-[#16C784]' 
                                    : 'text-[#EA3943]'
                                }`}>
                                  {(cryptocurrencies.find(c => c.symbol === alert.symbol)?.change24h || 0) >= 0 ? '+' : ''}
                                  {(cryptocurrencies.find(c => c.symbol === alert.symbol)?.change24h || 0).toFixed(2)}%
                                </span>
                              </div>
                              <div className="text-xs sm:text-sm col-span-2 sm:col-span-1">
                                <span className="text-gray-400 block">Notification:</span>
                                <div className="flex items-center gap-1">
                                  {(alert as any).alert_notifications && (alert as any).alert_notifications[0] ? (
                                    <>
                                      {(alert as any).alert_notifications[0].notification_type === 'email' && <Bell className="h-3 w-3 text-blue-400" />}
                                      {(alert as any).alert_notifications[0].notification_type === 'sms' && <Phone className="h-3 w-3 text-green-400" />}
                                      {(alert as any).alert_notifications[0].notification_type === 'push' && <Shield className="h-3 w-3 text-purple-400" />}
                                      <span className="text-white font-medium text-sm">
                                        {(alert as any).alert_notifications[0].notification_type.toUpperCase()}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-red-400 text-xs">⚠</span>
                                      <span className="text-red-400 font-medium text-sm">Not set</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Price Progress Indicator (for price alerts) */}
                            {alert.alert_type === 'price' && (alert as any).alert_conditions && (alert as any).alert_conditions[0] && (
                              <div className="mb-3 p-2 bg-gray-800/50 rounded-lg border border-gray-600">
                                <div className="text-xs text-gray-400 mb-2">Target Progress:</div>
                                {(() => {
                                  const condition = (alert as any).alert_conditions[0]
                                  const currentPrice = cryptocurrencies.find(c => c.symbol === alert.symbol)?.currentPrice || 0
                                  const targetPrice = condition.target_value
                                  const isAbove = condition.condition_type === 'price_above'
                                  
                                  let progress = 0
                                  let status = ''
                                  let statusColor = ''
                                  
                                  if (isAbove) {
                                    progress = Math.min(100, Math.max(0, (currentPrice / targetPrice) * 100))
                                    status = currentPrice >= targetPrice ? 'TARGET REACHED!' : `${(progress).toFixed(1)}% to target`
                                    statusColor = currentPrice >= targetPrice ? 'text-[#16C784]' : 'text-yellow-400'
                                  } else {
                                    progress = currentPrice <= targetPrice ? 100 : Math.max(0, 100 - ((currentPrice - targetPrice) / targetPrice * 100))
                                    status = currentPrice <= targetPrice ? 'TARGET REACHED!' : `${((targetPrice / currentPrice) * 100).toFixed(1)}% below current`
                                    statusColor = currentPrice <= targetPrice ? 'text-[#16C784]' : 'text-yellow-400'
                                  }
                                  
                                  return (
                                    <div>
                                      <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-gray-300">
                                          Target: {formatPrice(targetPrice)} ({isAbove ? 'Above' : 'Below'})
                                        </span>
                                        <span className={`text-xs font-semibold ${statusColor}`}>
                                          {status}
                                        </span>
                                      </div>
                                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                                        <div 
                                          className={`h-full transition-all duration-300 ${
                                            currentPrice >= targetPrice && isAbove || currentPrice <= targetPrice && !isAbove
                                              ? 'bg-[#16C784]' 
                                              : 'bg-yellow-500'
                                          }`}
                                          style={{ width: `${Math.min(100, Math.max(5, progress))}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  )
                                })()}
                              </div>
                            )}

                            {/* Additional Alert Info */}
                            <div className="text-gray-400 text-xs sm:text-sm space-y-1">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                <span>Created: {new Date(alert.created_at).toLocaleDateString()}</span>
                                {alert.triggered_at && (
                                  <span className="text-yellow-400">
                                    Last triggered: {new Date(alert.triggered_at).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              
                              {/* Recurring Information */}
                              {alert.is_recurring && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-blue-400" />
                                  <span className="text-blue-400">
                                    Recurring: {alert.recurring_frequency}
                                    {alert.recurring_frequency === 'weekly' && alert.recurring_days && alert.recurring_days.length > 0 && 
                                      ` (${alert.recurring_days.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')})`}
                                    {alert.recurring_time && ` at ${alert.recurring_time}`}
                                  </span>
                                </div>
                              )}
                              
                              {/* Alert Limits */}
                              {alert.max_triggers && alert.max_triggers > 0 && (
                                <div className="flex items-center gap-1">
                                  <BarChart3 className="h-3 w-3 text-gray-400" />
                                  <span>
                                    Triggers: {alert.trigger_count || 0}/{alert.max_triggers}
                                    {(alert.cooldown_minutes || 0) > 0 && ` (${alert.cooldown_minutes}min cooldown)`}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
                          <Badge className={`text-xs sm:text-sm ${
                            alert.is_active 
                              ? 'bg-[#16C784]/20 text-[#16C784] border-[#16C784]/30' 
                              : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                          }`}>
                            {alert.is_active ? (
                              <>
                                <Play className="h-3 w-3 mr-1" />
                                <span className="hidden sm:inline">Active</span>
                              </>
                            ) : (
                              <>
                                <Pause className="h-3 w-3 mr-1" />
                                <span className="hidden sm:inline">Paused</span>
                              </>
                            )}
                          </Badge>
                          
                          <div className="flex items-center gap-1 sm:gap-2">
                            {/* Edit Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditAlert(alert)}
                              className="text-[#3861FB] hover:text-white hover:bg-[#3861FB]/20 p-2"
                              title="Edit Alert"
                            >
                              <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            
                            {/* Pause/Play Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleTogglePause(alert.id)}
                              className={`p-2 ${
                                alert.is_active
                                  ? 'text-orange-400 hover:text-white hover:bg-orange-500/20'
                                  : 'text-[#16C784] hover:text-white hover:bg-[#16C784]/20'
                              }`}
                              title={alert.is_active ? 'Pause Alert' : 'Resume Alert'}
                            >
                              {alert.is_active ? (
                                <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
                              ) : (
                                <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                              )}
                            </Button>
                            
                            {/* Delete Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAlert(alert.id)}
                              className="text-[#EA3943] hover:text-white hover:bg-[#EA3943]/20 p-2"
                              title="Delete Alert"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg">
              <CardContent className="text-center py-12">
                <Clock className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Alert History</h3>
                <p className="text-gray-400">
                  Your triggered alerts will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

export default AlertsPage