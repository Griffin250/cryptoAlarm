import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Badge } from '../components/ui/badge'

import ResponsiveNavbar from '../components/ResponsiveNavbar'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import { 
  Bell, Target, Phone, Mail, CheckCircle,
  Trash2, Plus, TrendingUp, TrendingDown, Percent,
  Search, Filter, Play, Pause, BarChart3,
  Settings, Volume2, Smartphone
} from 'lucide-react'

// Import crypto icons
import BTC_ICON from '/cryptoIcons/BTC.png';
import ETH_ICON from '/cryptoIcons/ETH.png';
import BNB_ICON from '/cryptoIcons/BNB.png';
import SOL_ICON from '/cryptoIcons/SOL.png';
import XRP_ICON from '/cryptoIcons/XRP.png';
import DOGE_ICON from '/cryptoIcons/DOGE.png';
import ADA_ICON from '/cryptoIcons/ADA.png';

// Create crypto icon mapping
const CRYPTO_ICONS: Record<string, string> = {
  BTC: BTC_ICON,
  ETH: ETH_ICON,
  BNB: BNB_ICON,
  SOL: SOL_ICON,
  XRP: XRP_ICON,
  DOGE: DOGE_ICON,
  ADA: ADA_ICON,
};

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

interface NewAlert {
  cryptocurrency: string
  alertType: 'price' | 'percentage' | 'volume' | 'technical'
  targetPrice: string
  percentage: string
  volumeChange: string
  technicalIndicator: string
  direction: 'above' | 'below'
  notificationMethod: 'phone' | 'email' | 'sms' | 'push' | 'all'
  priority: 'low' | 'medium' | 'high' | 'critical'
  expiresAt: string
  notes: string
  repeatAlert: boolean
  customSound: string
}

interface Cryptocurrency {
  symbol: string
  name: string
  currentPrice: number
  priceChange24h: number
  volume24h: number
  marketCap: number
  icon?: string
}

interface AlertFilter {
  status: 'all' | 'active' | 'triggered' | 'paused' | 'expired'
  cryptocurrency: string
  alertType: string
  priority: string
  dateRange: 'all' | '24h' | '7d' | '30d'
}

const AlertsPage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [alerts, setAlerts] = useState<AlertInterface[]>([])
  const [newAlert, setNewAlert] = useState<NewAlert>({
    cryptocurrency: '',
    alertType: 'price',
    targetPrice: '',
    percentage: '',
    volumeChange: '',
    technicalIndicator: '',
    direction: 'above',
    notificationMethod: 'phone',
    priority: 'medium',
    expiresAt: '',
    notes: '',
    repeatAlert: false,
    customSound: 'default'
  })
  const [isCreating, setIsCreating] = useState(false)
  const [filter, setFilter] = useState<AlertFilter>({
    status: 'all',
    cryptocurrency: '',
    alertType: '',
    priority: '',
    dateRange: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const { loading, isAuthenticated } = useAuth()

  // Enhanced cryptocurrency data with full market information
  const cryptocurrencies: Cryptocurrency[] = [
    { 
      symbol: "BTC", 
      name: "Bitcoin", 
      currentPrice: 67234.56, 
      priceChange24h: 2.45, 
      volume24h: 28500000000, 
      marketCap: 1320000000000,
      icon: CRYPTO_ICONS.BTC
    },
    { 
      symbol: "ETH", 
      name: "Ethereum", 
      currentPrice: 3456.78, 
      priceChange24h: -1.23, 
      volume24h: 15200000000, 
      marketCap: 415000000000,
      icon: CRYPTO_ICONS.ETH
    },
    { 
      symbol: "BNB", 
      name: "BNB", 
      currentPrice: 432.11, 
      priceChange24h: 0.87, 
      volume24h: 1800000000, 
      marketCap: 64500000000,
      icon: CRYPTO_ICONS.BNB
    },
    { 
      symbol: "SOL", 
      name: "Solana", 
      currentPrice: 123.45, 
      priceChange24h: 5.67, 
      volume24h: 2100000000, 
      marketCap: 57800000000,
      icon: CRYPTO_ICONS.SOL
    },
    { 
      symbol: "XRP", 
      name: "XRP", 
      currentPrice: 0.6234, 
      priceChange24h: -0.45, 
      volume24h: 890000000, 
      marketCap: 35400000000,
      icon: CRYPTO_ICONS.XRP
    },
    { 
      symbol: "DOGE", 
      name: "Dogecoin", 
      currentPrice: 0.2341, 
      priceChange24h: 3.21, 
      volume24h: 1200000000, 
      marketCap: 34200000000,
      icon: CRYPTO_ICONS.DOGE
    },
    { 
      symbol: "ADA", 
      name: "Cardano", 
      currentPrice: 0.8756, 
      priceChange24h: -2.10, 
      volume24h: 450000000, 
      marketCap: 30800000000,
      icon: CRYPTO_ICONS.ADA
    },
    { 
      symbol: "SHIB", 
      name: "Shiba Inu", 
      currentPrice: 0.000023, 
      priceChange24h: 8.90, 
      volume24h: 780000000, 
      marketCap: 13600000000
    },
    { 
      symbol: "USDC", 
      name: "USD Coin", 
      currentPrice: 1.0001, 
      priceChange24h: 0.01, 
      volume24h: 6700000000, 
      marketCap: 34900000000
    },
    { 
      symbol: "SUI", 
      name: "Sui", 
      currentPrice: 2.34, 
      priceChange24h: 4.56, 
      volume24h: 890000000, 
      marketCap: 6100000000
    },
    { 
      symbol: "PEPE", 
      name: "Pepe", 
      currentPrice: 0.00001234, 
      priceChange24h: 12.34, 
      volume24h: 1500000000, 
      marketCap: 5200000000
    }
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

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    // Simulate API call
    setTimeout(() => {
      const selectedCrypto = cryptocurrencies.find(c => c.symbol === newAlert.cryptocurrency)
      const alertId = Date.now()
      
      const alert: AlertInterface = {
        id: alertId,
        ...newAlert,
        cryptoName: selectedCrypto?.name || newAlert.cryptocurrency,
        currentPrice: selectedCrypto?.currentPrice || 0,
        createdAt: new Date().toISOString(),
        status: 'active',
        triggerCount: 0,
        conditions: {
          priceChange24h: selectedCrypto?.priceChange24h,
          volumeThreshold: selectedCrypto?.volume24h,
          marketCap: selectedCrypto?.marketCap
        }
      }
      
      setAlerts(prev => [alert, ...prev])
      setNewAlert({
        cryptocurrency: '',
        alertType: 'price',
        targetPrice: '',
        percentage: '',
        volumeChange: '',
        technicalIndicator: '',
        direction: 'above',
        notificationMethod: 'phone',
        priority: 'medium',
        expiresAt: '',
        notes: '',
        repeatAlert: false,
        customSound: 'default'
      })
      setIsCreating(false)
    }, 1000)
  }

  const handleDeleteAlert = (alertId: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const handleToggleAlert = (alertId: number) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: alert.status === 'active' ? 'paused' : 'active' }
        : alert
    ))
  }

  const selectedCrypto = cryptocurrencies.find(c => c.symbol === newAlert.cryptocurrency)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: amount < 1 ? 6 : 2,
      maximumFractionDigits: amount < 1 ? 6 : 2
    }).format(amount);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`
    return `$${volume.toFixed(2)}`
  }

  // Filter and search alerts
  const filteredAlerts = alerts.filter(alert => {
    if (filter.status !== 'all' && alert.status !== filter.status) return false
    if (filter.cryptocurrency && alert.cryptocurrency !== filter.cryptocurrency) return false
    if (filter.alertType && alert.alertType !== filter.alertType) return false
    if (filter.priority && alert.priority !== filter.priority) return false
    if (searchTerm && !alert.cryptoName.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const alertBreadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Alerts", href: "/alerts" }
  ];

  const alertActions = [
    <Button 
      key="add-alert"
      size="sm" 
      className="bg-[#3861FB] hover:bg-[#2851FB] text-white w-full md:w-auto"
      onClick={() => {/* Scroll to form */}}
    >
      <Plus className="h-4 w-4 mr-2" />
      New Alert
    </Button>
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      <ResponsiveNavbar 
        title="Price Alerts"
        subtitle="Advanced Crypto Alert Management"
        breadcrumbs={alertBreadcrumbs}
        actions={alertActions}
        showBackButton={true}
        backUrl="/dashboard"
        isConnected={true}
      />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">

          {/* Alert Statistics Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <Bell className="h-8 w-8 text-[#3861FB] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{alerts.filter(a => a.status === 'active').length}</div>
                <div className="text-gray-400 text-sm">Active Alerts</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-[#16C784] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{alerts.filter(a => a.status === 'triggered').length}</div>
                <div className="text-gray-400 text-sm">Triggered</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <Pause className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{alerts.filter(a => a.status === 'paused').length}</div>
                <div className="text-gray-400 text-sm">Paused</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{alerts.reduce((sum, alert) => sum + alert.triggerCount, 0)}</div>
                <div className="text-gray-400 text-sm">Total Triggers</div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Alert Filters */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Advanced Filters & Search
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-gray-400 hover:text-white"
                >
                  {showAdvanced ? 'Hide' : 'Show'} Advanced
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-700/50 border-gray-600 text-white"
                  />
                </div>

                {/* Status Filter */}
                <Select value={filter.status} onValueChange={(value: 'all' | 'active' | 'triggered' | 'paused' | 'expired') => 
                  setFilter(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all" className="text-white hover:bg-gray-700">All Status</SelectItem>
                    <SelectItem value="active" className="text-white hover:bg-gray-700">Active</SelectItem>
                    <SelectItem value="triggered" className="text-white hover:bg-gray-700">Triggered</SelectItem>
                    <SelectItem value="paused" className="text-white hover:bg-gray-700">Paused</SelectItem>
                    <SelectItem value="expired" className="text-white hover:bg-gray-700">Expired</SelectItem>
                  </SelectContent>
                </Select>

                {/* Cryptocurrency Filter */}
                <Select value={filter.cryptocurrency} onValueChange={(value: string) => 
                  setFilter(prev => ({ ...prev, cryptocurrency: value }))}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue placeholder="Filter by crypto" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="" className="text-white hover:bg-gray-700">All Cryptos</SelectItem>
                    {cryptocurrencies.map(crypto => (
                      <SelectItem key={crypto.symbol} value={crypto.symbol} className="text-white hover:bg-gray-700">
                        {crypto.name} ({crypto.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`${viewMode === 'grid' ? 'bg-[#3861FB] border-[#3861FB] text-white' : 'border-gray-600 text-gray-300'}`}
                  >
                    Grid
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`${viewMode === 'list' ? 'bg-[#3861FB] border-[#3861FB] text-white' : 'border-gray-600 text-gray-300'}`}
                  >
                    List
                  </Button>
                </div>
              </div>

              {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                  <Select value={filter.alertType} onValueChange={(value: string) => 
                    setFilter(prev => ({ ...prev, alertType: value }))}>
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="" className="text-white hover:bg-gray-700">All Types</SelectItem>
                      <SelectItem value="price" className="text-white hover:bg-gray-700">Price Target</SelectItem>
                      <SelectItem value="percentage" className="text-white hover:bg-gray-700">Percentage Change</SelectItem>
                      <SelectItem value="volume" className="text-white hover:bg-gray-700">Volume Alert</SelectItem>
                      <SelectItem value="technical" className="text-white hover:bg-gray-700">Technical Indicator</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filter.priority} onValueChange={(value: string) => 
                    setFilter(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="" className="text-white hover:bg-gray-700">All Priorities</SelectItem>
                      <SelectItem value="low" className="text-white hover:bg-gray-700">Low</SelectItem>
                      <SelectItem value="medium" className="text-white hover:bg-gray-700">Medium</SelectItem>
                      <SelectItem value="high" className="text-white hover:bg-gray-700">High</SelectItem>
                      <SelectItem value="critical" className="text-white hover:bg-gray-700">Critical</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filter.dateRange} onValueChange={(value: 'all' | '24h' | '7d' | '30d') => 
                    setFilter(prev => ({ ...prev, dateRange: value }))}>
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="all" className="text-white hover:bg-gray-700">All Time</SelectItem>
                      <SelectItem value="24h" className="text-white hover:bg-gray-700">Last 24 Hours</SelectItem>
                      <SelectItem value="7d" className="text-white hover:bg-gray-700">Last 7 Days</SelectItem>
                      <SelectItem value="30d" className="text-white hover:bg-gray-700">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Create New Alert Form */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Plus className="h-5 w-5 mr-2 text-[#16C784]" />
                Create Advanced Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAlert} className="space-y-6">
                
                {/* Cryptocurrency Selection with Enhanced Info */}
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
                            <div className="flex items-center space-x-3">
                              {crypto.icon && (
                                <img src={crypto.icon} alt={crypto.symbol} width={20} height={20} className="rounded-full" />
                              )}
                              <span>{crypto.name} ({crypto.symbol})</span>
                            </div>
                            <div className="text-right">
                              <div className="text-white">{formatCurrency(crypto.currentPrice)}</div>
                              <div className={`text-xs ${crypto.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {crypto.priceChange24h >= 0 ? '+' : ''}{crypto.priceChange24h.toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedCrypto && (
                    <div className="p-3 bg-gray-800/30 rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">Current Price</div>
                          <div className="text-white font-medium">{formatCurrency(selectedCrypto.currentPrice)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">24h Change</div>
                          <div className={`font-medium ${selectedCrypto.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {selectedCrypto.priceChange24h >= 0 ? '+' : ''}{selectedCrypto.priceChange24h.toFixed(2)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-400">24h Volume</div>
                          <div className="text-white font-medium">{formatVolume(selectedCrypto.volume24h)}</div>
                        </div>
                      </div>
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
                      onValueChange={(value: 'price' | 'percentage' | 'volume' | 'technical') => 
                        setNewAlert(prev => ({ ...prev, alertType: value }))}
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
                        <SelectItem value="volume" className="text-white hover:bg-gray-700">
                          <div className="flex items-center">
                            <Volume2 className="h-4 w-4 mr-2" />
                            Volume Alert
                          </div>
                        </SelectItem>
                        <SelectItem value="technical" className="text-white hover:bg-gray-700">
                          <div className="flex items-center">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Technical Indicator
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
                      onValueChange={(value: 'above' | 'below') => setNewAlert(prev => ({ ...prev, direction: value }))}
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

                {/* Dynamic Target Value Input */}
                {newAlert.alertType === 'price' && (
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
                )}

                {newAlert.alertType === 'percentage' && (
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

                {newAlert.alertType === 'volume' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Volume Change (%)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Enter volume change percentage"
                      value={newAlert.volumeChange}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, volumeChange: e.target.value }))}
                      className="bg-gray-800/50 border-gray-600 text-white"
                      required
                    />
                  </div>
                )}

                {newAlert.alertType === 'technical' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Technical Indicator
                    </label>
                    <Select
                      value={newAlert.technicalIndicator}
                      onValueChange={(value) => setNewAlert(prev => ({ ...prev, technicalIndicator: value }))}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                        <SelectValue placeholder="Select indicator" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="rsi_oversold" className="text-white hover:bg-gray-700">RSI Oversold (&lt; 30)</SelectItem>
                        <SelectItem value="rsi_overbought" className="text-white hover:bg-gray-700">RSI Overbought (&gt; 70)</SelectItem>
                        <SelectItem value="macd_bullish" className="text-white hover:bg-gray-700">MACD Bullish Crossover</SelectItem>
                        <SelectItem value="macd_bearish" className="text-white hover:bg-gray-700">MACD Bearish Crossover</SelectItem>
                        <SelectItem value="sma_cross_up" className="text-white hover:bg-gray-700">SMA Cross Up</SelectItem>
                        <SelectItem value="sma_cross_down" className="text-white hover:bg-gray-700">SMA Cross Down</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Notification Method */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Notification Method
                    </label>
                    <Select
                      value={newAlert.notificationMethod}
                      onValueChange={(value: 'phone' | 'email' | 'sms' | 'push' | 'all') => 
                        setNewAlert(prev => ({ ...prev, notificationMethod: value }))}
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
                        <SelectItem value="sms" className="text-white hover:bg-gray-700">
                          <div className="flex items-center">
                            <Smartphone className="h-4 w-4 mr-2" />
                            SMS Text
                          </div>
                        </SelectItem>
                        <SelectItem value="push" className="text-white hover:bg-gray-700">
                          <div className="flex items-center">
                            <Bell className="h-4 w-4 mr-2" />
                            Push Notification
                          </div>
                        </SelectItem>
                        <SelectItem value="all" className="text-white hover:bg-gray-700">
                          <div className="flex items-center">
                            <Volume2 className="h-4 w-4 mr-2" />
                            All Methods
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Priority Level */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Priority Level
                    </label>
                    <Select
                      value={newAlert.priority}
                      onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => 
                        setNewAlert(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="low" className="text-white hover:bg-gray-700">
                          <Badge className="bg-gray-500 text-white">Low</Badge>
                        </SelectItem>
                        <SelectItem value="medium" className="text-white hover:bg-gray-700">
                          <Badge className="bg-blue-500 text-white">Medium</Badge>
                        </SelectItem>
                        <SelectItem value="high" className="text-white hover:bg-gray-700">
                          <Badge className="bg-orange-500 text-white">High</Badge>
                        </SelectItem>
                        <SelectItem value="critical" className="text-white hover:bg-gray-700">
                          <Badge className="bg-red-500 text-white">Critical</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Advanced Options */}
                <div className="space-y-4 p-4 bg-gray-800/20 rounded-lg border border-gray-700">
                  <h4 className="text-white font-medium flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Advanced Options
                  </h4>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Expiration Date (Optional)
                      </label>
                      <Input
                        type="datetime-local"
                        value={newAlert.expiresAt}
                        onChange={(e) => setNewAlert(prev => ({ ...prev, expiresAt: e.target.value }))}
                        className="bg-gray-800/50 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Custom Sound
                      </label>
                      <Select
                        value={newAlert.customSound}
                        onValueChange={(value) => setNewAlert(prev => ({ ...prev, customSound: value }))}
                      >
                        <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="default" className="text-white hover:bg-gray-700">Default Alert</SelectItem>
                          <SelectItem value="chime" className="text-white hover:bg-gray-700">Chime</SelectItem>
                          <SelectItem value="bell" className="text-white hover:bg-gray-700">Bell</SelectItem>
                          <SelectItem value="alarm" className="text-white hover:bg-gray-700">Alarm</SelectItem>
                          <SelectItem value="coin" className="text-white hover:bg-gray-700">Coin Sound</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Notes (Optional)
                    </label>
                    <Input
                      placeholder="Add notes about this alert..."
                      value={newAlert.notes}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, notes: e.target.value }))}
                      className="bg-gray-800/50 border-gray-600 text-white"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="repeatAlert"
                      checked={newAlert.repeatAlert}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, repeatAlert: e.target.checked }))}
                      className="rounded border-gray-600 text-[#3861FB]"
                    />
                    <label htmlFor="repeatAlert" className="text-sm text-gray-300">
                      Repeat alert when triggered (don't auto-disable)
                    </label>
                  </div>
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
                      Create Advanced Alert
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Active Alerts Display */}
          {filteredAlerts.length > 0 ? (
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Your Alerts ({filteredAlerts.length})
                  </CardTitle>
                  <div className="text-gray-400 text-sm">
                    {filteredAlerts.filter(a => a.status === 'active').length} active, {filteredAlerts.filter(a => a.status === 'triggered').length} triggered
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
                  : "space-y-4"
                }>
                  {filteredAlerts.map(alert => (
                    <div 
                      key={alert.id} 
                      className={`${viewMode === 'grid' 
                        ? 'p-4 bg-gray-800/30 rounded-lg border border-gray-700' 
                        : 'flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700'
                      }`}
                    >
                      {viewMode === 'grid' ? (
                        // Grid View
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {selectedCrypto?.icon && (
                                <img src={selectedCrypto.icon} alt={alert.cryptocurrency} width={24} height={24} className="rounded-full" />
                              )}
                              <Badge variant="outline" className="text-xs">
                                {alert.cryptoName}
                              </Badge>
                            </div>
                            <Badge 
                              className={
                                alert.status === 'active' ? 'bg-[#16C784]/20 text-[#16C784]' :
                                alert.status === 'triggered' ? 'bg-blue-500/20 text-blue-400' :
                                alert.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-gray-500/20 text-gray-400'
                              }
                            >
                              {alert.status}
                            </Badge>
                          </div>
                          
                          <div>
                            <div className="text-white font-medium">
                              {alert.alertType === 'price' 
                                ? `Target: ${formatCurrency(parseFloat(alert.targetPrice || '0'))}`
                                : alert.alertType === 'percentage'
                                ? `${alert.percentage}% change`
                                : alert.alertType === 'volume'
                                ? `${alert.volumeChange}% volume change`
                                : alert.technicalIndicator
                              }
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                              {alert.direction === 'above' ? (
                                <TrendingUp className="h-3 w-3 text-[#16C784]" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-400" />
                              )}
                              <span>{alert.direction}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <div className="flex items-center space-x-1">
                              {alert.notificationMethod === 'phone' && <Phone className="h-3 w-3" />}
                              {alert.notificationMethod === 'email' && <Mail className="h-3 w-3" />}
                              {alert.notificationMethod === 'sms' && <Smartphone className="h-3 w-3" />}
                              {alert.notificationMethod === 'all' && <Volume2 className="h-3 w-3" />}
                              <span>{alert.notificationMethod}</span>
                            </div>
                            <Badge 
                              className={
                                alert.priority === 'low' ? 'bg-gray-500/20 text-gray-400' :
                                alert.priority === 'medium' ? 'bg-blue-500/20 text-blue-400' :
                                alert.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                'bg-red-500/20 text-red-400'
                              }
                            >
                              {alert.priority}
                            </Badge>
                          </div>

                          <div className="text-xs text-gray-500">
                            Created: {new Date(alert.createdAt).toLocaleDateString()}
                            {alert.triggerCount > 0 && (
                              <span> • Triggered: {alert.triggerCount} times</span>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleAlert(alert.id)}
                              className={`text-xs ${
                                alert.status === 'active' 
                                  ? 'text-yellow-400 hover:text-yellow-300' 
                                  : 'text-green-400 hover:text-green-300'
                              }`}
                            >
                              {alert.status === 'active' ? (
                                <>
                                  <Pause className="h-3 w-3 mr-1" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <Play className="h-3 w-3 mr-1" />
                                  Resume
                                </>
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAlert(alert.id)}
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // List View
                        <>
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="flex items-center space-x-2">
                              {selectedCrypto?.icon && (
                                <img src={selectedCrypto.icon} alt={alert.cryptocurrency} width={24} height={24} className="rounded-full" />
                              )}
                              <Badge variant="outline" className="text-xs">
                                {alert.cryptoName}
                              </Badge>
                            </div>
                            
                            <div className="flex-1">
                              <div className="text-white font-medium">
                                {alert.alertType === 'price' 
                                  ? `Target: ${formatCurrency(parseFloat(alert.targetPrice || '0'))}`
                                  : alert.alertType === 'percentage'
                                  ? `${alert.percentage}% change`
                                  : alert.alertType === 'volume'
                                  ? `${alert.volumeChange}% volume change`
                                  : alert.technicalIndicator
                                }
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-400">
                                <span className="flex items-center space-x-1">
                                  {alert.direction === 'above' ? (
                                    <TrendingUp className="h-3 w-3 text-[#16C784]" />
                                  ) : (
                                    <TrendingDown className="h-3 w-3 text-red-400" />
                                  )}
                                  <span>{alert.direction}</span>
                                </span>
                                <span>{alert.notificationMethod}</span>
                                <span>Created: {new Date(alert.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <Badge 
                              className={
                                alert.priority === 'low' ? 'bg-gray-500/20 text-gray-400' :
                                alert.priority === 'medium' ? 'bg-blue-500/20 text-blue-400' :
                                alert.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                'bg-red-500/20 text-red-400'
                              }
                            >
                              {alert.priority}
                            </Badge>
                            <Badge 
                              className={
                                alert.status === 'active' ? 'bg-[#16C784]/20 text-[#16C784]' :
                                alert.status === 'triggered' ? 'bg-blue-500/20 text-blue-400' :
                                alert.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-gray-500/20 text-gray-400'
                              }
                            >
                              {alert.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleAlert(alert.id)}
                              className={`${
                                alert.status === 'active' 
                                  ? 'text-yellow-400 hover:text-yellow-300' 
                                  : 'text-green-400 hover:text-green-300'
                              }`}
                            >
                              {alert.status === 'active' ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAlert(alert.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="text-center py-12">
                <Bell className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">No Alerts Found</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm || filter.status !== 'all' || filter.cryptocurrency || filter.alertType || filter.priority
                    ? "No alerts match your current filters. Try adjusting your search criteria."
                    : "Create your first crypto alert to get started with real-time notifications."
                  }
                </p>
                {searchTerm || filter.status !== 'all' || filter.cryptocurrency || filter.alertType || filter.priority ? (
                  <Button 
                    variant="outline" 
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    onClick={() => {
                      setSearchTerm('')
                      setFilter({
                        status: 'all',
                        cryptocurrency: '',
                        alertType: '',
                        priority: '',
                        dateRange: 'all'
                      })
                    }}
                  >
                    Clear Filters
                  </Button>
                ) : (
                  <Button 
                    className="bg-[#3861FB] hover:bg-[#2851FB] text-white"
                    onClick={() => {/* Scroll to form */}}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Alert
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  )
}

export default AlertsPage