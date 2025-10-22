"use client";
import { useEffect, useState, useRef } from "react";
import { api } from "../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { AuthProvider } from "../../lib/AuthContext";
import AlertManagerNew from "../../components/AlertManagerNew";
import Link from "next/link";

// Force dynamic rendering to avoid build-time Supabase calls
export const dynamic = 'force-dynamic'
import Image from "next/image";
import { 
  TrendingUp, TrendingDown, Phone, Wifi, WifiOff, Star, 
  Settings, Bell, User, Search, Menu, BarChart3, 
  Zap, Globe, Shield, DollarSign, ArrowLeft, Home, RefreshCw
} from "lucide-react";

// Crypto info mapping - Extended list
const cryptoInfo = {
  BTCUSDT: { name: "Bitcoin", symbol: "BTC", icon: "₿", rank: 1 },
  ETHUSDT: { name: "Ethereum", symbol: "ETH", icon: "Ξ", rank: 2 },
  BNBUSDT: { name: "BNB", symbol: "BNB", icon: "🔶", rank: 3 },
  SOLUSDT: { name: "Solana", symbol: "SOL", icon: "◎", rank: 4 },
  XRPUSDT: { name: "XRP", symbol: "XRP", icon: "✗", rank: 5 },
  DOGEUSDT: { name: "Dogecoin", symbol: "DOGE", icon: "🐕", rank: 6 },
  ADAUSDT: { name: "Cardano", symbol: "ADA", icon: "◈", rank: 7 },
  SHIBUSDT: { name: "Shiba Inu", symbol: "SHIB", icon: "🐕", rank: 8 },
  USDCUSDT: { name: "USD Coin", symbol: "USDC", icon: "💵", rank: 9 },
  SUIUSDT: { name: "Sui", symbol: "SUI", icon: "🌊", rank: 10 },
  PEPEUSDT: { name: "Pepe", symbol: "PEPE", icon: "🐸", rank: 11 },
  TRXUSDT: { name: "TRON", symbol: "TRX", icon: "🚀", rank: 12 },
  LINKUSDT: { name: "Chainlink", symbol: "LINK", icon: "🔗", rank: 13 },
  LTCUSDT: { name: "Litecoin", symbol: "LTC", icon: "Ł", rank: 14 },
  MATICUSDT: { name: "Polygon", symbol: "MATIC", icon: "🟪", rank: 15 },
  BCHUSDT: { name: "Bitcoin Cash", symbol: "BCH", icon: "Ƀ", rank: 16 },
  DOTUSDT: { name: "Polkadot", symbol: "DOT", icon: "●", rank: 17 },
  AVAXUSDT: { name: "Avalanche", symbol: "AVAX", icon: "🗻", rank: 18 },
  UNIUSDT: { name: "Uniswap", symbol: "UNI", icon: "🦄", rank: 19 },
  XLMUSDT: { name: "Stellar", symbol: "XLM", icon: "★", rank: 20 }
};

export default function Dashboard() {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [isConnected, setIsConnected] = useState(true);
  const [globalMetrics, setGlobalMetrics] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [priceAnimations, setPriceAnimations] = useState({});
  const [activeTab, setActiveTab] = useState("alerts"); // "dashboard" or "alerts"
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const previousPricesRef = useRef({});
  const priceHistoryRef = useRef({});
  
  // Auto-refresh controls
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(2000); // 2 seconds default
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const intervalRef = useRef(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const coinsPerPage = 10;
  const coinSymbols = Object.keys(cryptoInfo);
  const totalPages = Math.ceil(coinSymbols.length / coinsPerPage);
  const paginatedSymbols = coinSymbols.slice((currentPage - 1) * coinsPerPage, currentPage * coinsPerPage);

  // Fetch global metrics from backend
  const fetchGlobalMetrics = async () => {
    setMetricsLoading(true);
    try {
      const res = await api.get("/global-metrics");
      setGlobalMetrics(res.data);
    } catch (error) {
      console.error("Failed to fetch global metrics:", error);
      setGlobalMetrics(null);
    } finally {
      setMetricsLoading(false);
    }
  };

  // Enhanced fetchPrices function with refresh controls
  const fetchPrices = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    
    try {
      const res = await api.get("/prices");
      const newPrices = res.data.prices || {};
      
      // Track price changes and animations
      const animations = {};
      Object.keys(newPrices).forEach(symbol => {
        const currentPrice = newPrices[symbol];
        const previousPrice = previousPricesRef.current[symbol];
        
        if (previousPrice && previousPrice !== currentPrice) {
          animations[symbol] = {
            trend: currentPrice > previousPrice ? "up" : "down",
            isFlashing: true
          };
          
          // Store price history for trend analysis
          if (!priceHistoryRef.current[symbol]) {
            priceHistoryRef.current[symbol] = [];
          }
          priceHistoryRef.current[symbol].push({
            price: currentPrice,
            timestamp: Date.now()
          });
          
          // Keep only last 10 price points
          if (priceHistoryRef.current[symbol].length > 10) {
            priceHistoryRef.current[symbol] = priceHistoryRef.current[symbol].slice(-10);
          }
        }
      });
      
      setPriceAnimations(animations);
      setPrices(newPrices);
      previousPricesRef.current = newPrices;
      setLastUpdate(new Date());
      setIsConnected(true);
      setRefreshCount(prev => prev + 1);
      
      // Clear animations after 1 second
      setTimeout(() => {
        setPriceAnimations({});
      }, 1000);
      
    } catch (error) {
      console.error("Failed to fetch prices:", error);
      setIsConnected(false);
    } finally {
      if (isManual) setIsRefreshing(false);
    }
  };

  // Auto-refresh effect with configurable interval
  useEffect(() => {
    // Initial fetch
    fetchPrices();
    fetchGlobalMetrics();
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Set up new interval if auto-refresh is enabled
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchPrices();
      }, refreshInterval);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval]);

  // Manual refresh function
  const handleManualRefresh = () => {
    fetchPrices(true);
  };

  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  // Change refresh interval
  const handleIntervalChange = (newInterval) => {
    setRefreshInterval(newInterval);
  };

  // Close mobile menu on window resize or outside click
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('header')) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const sendTestAlert = async () => {
    setLoading(true);
    try {
      const res = await api.get("/test-alert");
      setAlertMsg(res.data.success ? "success" : "error");
      setTimeout(() => setAlertMsg(""), 5000);
    } catch (error) {
      console.error("Failed to send alert:", error);
      setAlertMsg("error");
      setTimeout(() => setAlertMsg(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced price change analysis
  const getPriceChangeInfo = (symbol) => {
    const history = priceHistoryRef.current[symbol] || [];
    if (history.length < 2) return null;

    const current = history[history.length - 1];
    const previous = history[history.length - 2];
    const rawChange = ((current.price - previous.price) / previous.price) * 100;
    
    // Calculate trend strength based on recent price movements
    const recentChanges = history.slice(-5).map((point, index, arr) => {
      if (index === 0) return 0;
      return ((point.price - arr[index - 1].price) / arr[index - 1].price) * 100;
    }).filter(change => change !== 0);
    
    const avgChange = recentChanges.length > 0 
      ? recentChanges.reduce((sum, change) => sum + Math.abs(change), 0) / recentChanges.length 
      : 0;

    return {
      rawChange,
      trend: rawChange > 0 ? "up" : rawChange < 0 ? "down" : "neutral",
      trendStrength: avgChange > 1 ? "strong" : avgChange > 0.3 ? "moderate" : "weak",
      isFlashing: priceAnimations[symbol]?.isFlashing || false
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-[#0B1426]/90 border-b border-gray-800/50">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* Left Side - Logo & Navigation */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                <Link href="/" className="flex items-center p-1">
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-white transition-colors" />
                </Link>
                
                <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer min-w-0">
                  <div className="bg-gradient-to-br from-[#3861FB] to-[#4F46E5] p-1.5 sm:p-2 rounded-lg sm:rounded-xl flex-shrink-0">
                    <Image 
                      src="/cryptoAlarmLogo.png" 
                      alt="CryptoAlarm Logo" 
                      width={14} 
                      height={14} 
                      className="object-contain sm:w-4 sm:h-4"
                    />
                  </div>
                  <div className="hidden sm:block min-w-0">
                    <h1 className="text-base lg:text-lg font-bold text-white truncate">CryptoAlarm</h1>
                    <div className="text-xs text-gray-400 flex items-center truncate">
                      <span className="truncate">Professional Trading Platform</span>
                    </div>
                  </div>
                  <div className="sm:hidden min-w-0">
                    <h1 className="text-sm font-bold text-white truncate">CryptoAlarm</h1>
                  </div>
                </Link>
              </div>

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 flex-shrink-0">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`px-2 xl:px-3 ${activeTab === "dashboard" ? "text-[#3861FB] bg-[#3861FB]/10" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setActiveTab("dashboard")}
                >
                  <BarChart3 className="h-4 w-4 xl:mr-2" />
                  <span className="hidden xl:inline">Dashboard</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`px-2 xl:px-3 ${activeTab === "alerts" ? "text-[#3861FB] bg-[#3861FB]/10" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setActiveTab("alerts")}
                >
                  <Bell className="h-4 w-4 xl:mr-2" />
                  <span className="hidden xl:inline">Alerts</span>
                </Button>
                <Link href="/portfolio">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-2 xl:px-3">
                    <Globe className="h-4 w-4 xl:mr-2" />
                    <span className="hidden xl:inline">Portfolio</span>
                  </Button>
                </Link>
                <Link href="/premium">
                  <Button variant="ghost" size="sm" className="text-[#16C784] hover:text-[#14B575] hover:bg-[#16C784]/10 px-2 xl:px-3">
                    <Star className="h-4 w-4 xl:mr-2" />
                    <span className="hidden xl:inline">Premium</span>
                  </Button>
                </Link>
              </nav>
            </div>

            {/* Center Spacer - Search bar hidden for better layout */}
            <div className="hidden lg:flex flex-1" />

            {/* Right Side - Actions & Status */}
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {/* Connection Status - Hidden on small screens */}
              <div className="hidden md:flex items-center space-x-2">
                {isConnected ? (
                  <>
                    <Wifi className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-500 font-medium hidden lg:inline">Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-red-500 font-medium hidden lg:inline">Disconnected</span>
                  </>
                )}
              </div>

              {/* Refresh Controls */}
              <div className="flex items-center">
                {/* Manual Refresh Button */}
                <Button 
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  size="sm"
                  variant="ghost"
                  className="relative text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-50 px-2"
                  title={isRefreshing ? "Refreshing..." : "Manual refresh"}
                >
                  <RefreshCw className={`h-4 w-4 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>

                {/* Auto-refresh Status & Controls - Large screens only */}
                <div className="hidden xl:flex items-center space-x-1 ml-1">
                  <Button 
                    onClick={toggleAutoRefresh}
                    size="sm"
                    variant="ghost"
                    className={`text-xs px-2 py-1 h-6 transition-colors ${
                      autoRefresh 
                        ? 'text-green-500 bg-green-500/10 hover:bg-green-500/20' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                    title={`Auto-refresh: ${autoRefresh ? 'ON' : 'OFF'}`}
                  >
                    <div className={`w-2 h-2 rounded-full mr-1 ${autoRefresh ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                    {autoRefresh ? 'AUTO' : 'OFF'}
                  </Button>
                  
                  {/* Refresh Interval Selector */}
                  {autoRefresh && (
                    <select
                      value={refreshInterval}
                      onChange={(e) => handleIntervalChange(Number(e.target.value))}
                      className="text-xs bg-muted/50 border border-border rounded px-1 py-0.5 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 w-12"
                      title="Refresh interval"
                    >
                      <option value={1000}>1s</option>
                      <option value={2000}>2s</option>
                      <option value={5000}>5s</option>
                      <option value={10000}>10s</option>
                      <option value={30000}>30s</option>
                    </select>
                  )}
                                {/* Test Alert Button - Responsive sizing */}
              <Button 
                onClick={sendTestAlert}
                disabled={loading}
                size="sm"
                className="bg-gradient-to-r from-[#16C784] to-[#10A96B] hover:from-[#14B575] hover:to-[#0E8B56] text-white px-2 sm:px-3"
              >
                <Phone className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline text-xs sm:text-sm">{loading ? "Calling..." : "Test Alert"}</span>
              </Button>
                </div>
              </div>

           

              {/* Desktop Action Buttons - Hidden on smaller screens */}
              <div className="hidden lg:flex items-center space-x-1">
             
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-2">
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden text-muted-foreground hover:text-foreground px-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-800/50 bg-[#0B1426]/95 backdrop-blur-lg">
            <div className="container mx-auto px-4 py-4">
              {/* Mobile Search */}
              <div className="xl:hidden mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search cryptocurrencies..."
                    className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm 
                             focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                             placeholder:text-muted-foreground transition-all duration-200"
                  />
                </div>
              </div>
              
              {/* Mobile Navigation */}
              <nav className="space-y-2">
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${activeTab === "dashboard" ? "text-[#3861FB] bg-[#3861FB]/10" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => {
                    setActiveTab("dashboard");
                    setMobileMenuOpen(false);
                  }}
                >
                  <BarChart3 className="h-4 w-4 mr-3" />
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${activeTab === "alerts" ? "text-[#3861FB] bg-[#3861FB]/10" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => {
                    setActiveTab("alerts");
                    setMobileMenuOpen(false);
                  }}
                >
                  <Bell className="h-4 w-4 mr-3" />
                  Alerts
                </Button>
                <Link href="/portfolio" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                    <Globe className="h-4 w-4 mr-3" />
                    Portfolio
                  </Button>
                </Link>
                <Link href="/premium" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-[#16C784] hover:text-[#14B575] hover:bg-[#16C784]/10">
                    <Star className="h-4 w-4 mr-3" />
                    Premium
                  </Button>
                </Link>
                
                <div className="border-t border-gray-800/50 pt-2 mt-2">
                  <Link href="/settings" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </Button>
                  </Link>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </Button>
                  </Link>
                </div>
                
                {/* Mobile Connection Status & Refresh Controls */}
                <div className="sm:hidden border-t border-gray-800/50 pt-2 mt-2 space-y-2">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center space-x-2">
                      {isConnected ? (
                        <>
                          <Wifi className="h-4 w-4 text-green-500" />
                          <span className="text-xs text-green-500 font-medium">Connected</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="h-4 w-4 text-red-500" />
                          <span className="text-xs text-red-500 font-medium">Disconnected</span>
                        </>
                      )}
                    </div>
                    
                    {/* Mobile Refresh Button */}
                    <Button 
                      onClick={handleManualRefresh}
                      disabled={isRefreshing}
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                      title={isRefreshing ? "Refreshing..." : "Manual refresh"}
                    >
                      <RefreshCw className={`h-4 w-4 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                  
                  {/* Mobile Auto-refresh Controls */}
                  <div className="px-3 py-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Auto-refresh</span>
                      <Button 
                        onClick={toggleAutoRefresh}
                        size="sm"
                        variant="ghost"
                        className={`text-xs px-2 py-1 h-6 ${
                          autoRefresh 
                            ? 'text-green-500 bg-green-500/10' 
                            : 'text-muted-foreground'
                        }`}
                      >
                        {autoRefresh ? 'ON' : 'OFF'}
                      </Button>
                    </div>
                    
                    {autoRefresh && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Interval</span>
                        <select
                          value={refreshInterval}
                          onChange={(e) => handleIntervalChange(Number(e.target.value))}
                          className="text-xs bg-muted/50 border border-border rounded px-2 py-1 text-muted-foreground"
                        >
                          <option value={1000}>1s</option>
                          <option value={2000}>2s</option>
                          <option value={5000}>5s</option>
                          <option value={10000}>10s</option>
                          <option value={30000}>30s</option>
                        </select>
                      </div>
                      
                    )}
                       {/* Test Alert Button - Responsive sizing */}
              <Button 
                onClick={sendTestAlert}
                disabled={loading}
                size="sm"
                className="bg-gradient-to-r from-[#16C784] to-[#10A96B] hover:from-[#14B575] hover:to-[#0E8B56] text-white px-2 sm:px-3"
              >
                <Phone className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline text-xs sm:text-sm">{loading ? "Calling..." : "Test Alert"}</span>
              </Button>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Alert Message */}
      {alertMsg && (
        <div className="container mx-auto px-4 pt-4">
          {/* Only show alertMsg, not the info card you requested to remove */}
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 flex-grow">
        {activeTab === "dashboard" ? (
          <>
            {/* Market Overview */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
                <Card>
                  <CardHeader className="pb-1 sm:pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Market Cap</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                      {metricsLoading ? 'Loading...' : globalMetrics ? `$${Number(globalMetrics.totalmarketcap).toLocaleString(undefined, {maximumFractionDigits: 0})}` : '$3.5T'}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      <span className="truncate">Active Cryptos: {globalMetrics?.active_cryptocurrencies ?? '9,500'}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-1 sm:pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">24h Volume</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                      {metricsLoading ? 'Loading...' : globalMetrics ? `$${Number(globalMetrics.totalvolume24h).toLocaleString(undefined, {maximumFractionDigits: 0})}` : '$90B'}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      <span className="truncate">Active Exchanges: {globalMetrics?.active_exchanges ?? '650'}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-1 sm:pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">BTC/ETH Dominance</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                      BTC: {metricsLoading ? '--' : globalMetrics?.btc_dominance?.toFixed(2) ?? '52.1'}%
                    </div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                      ETH: {metricsLoading ? '--' : globalMetrics?.eth_dominance?.toFixed(2) ?? '17.3'}%
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      Last Updated: {globalMetrics?.last_updated ? new Date(globalMetrics.last_updated).toLocaleString() : '--'}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-1 sm:pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center justify-between">
                      <span className="truncate">Data Status</span>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <div className={`w-2 h-2 rounded-full ${
                          isConnected ? 'bg-green-500' : 'bg-red-500'
                        } ${autoRefresh ? 'animate-pulse' : ''}`} />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-0.5 sm:space-y-1">
                      <div className="text-sm sm:text-lg font-bold">{lastUpdate.toLocaleTimeString()}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {isConnected ? (
                          autoRefresh ? `Auto: ${refreshInterval/1000}s` : "Manual"
                        ) : "Offline"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        #{refreshCount}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

            {/* Crypto Table */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="text-base sm:text-lg">Live Prices</span>
                    {isRefreshing && (
                      <div className="flex items-center space-x-1">
                        <RefreshCw className="h-3 w-3 animate-spin text-primary" />
                        <span className="text-xs text-primary hidden sm:inline">Updating...</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      {Object.keys(prices).length}
                    </Badge>
                    {autoRefresh && (
                      <Badge variant="outline" className="text-xs text-green-500 border-green-500/30 px-2 py-0.5 hidden sm:inline-flex">
                        Auto {refreshInterval/1000}s
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs sm:text-sm lg:text-base">
                    <thead className="bg-muted-foreground/10">
                      <tr className="text-left">
                        <th className="px-2 py-2">#</th>
                        <th className="px-2 py-2">Name</th>
                        <th className="px-2 py-2">Price</th>
                        <th className="px-2 py-2">1h %</th>
                        <th className="px-2 py-2">24h %</th>
                        <th className="px-2 py-2">7d %</th>
                        <th className="px-2 py-2">Market Cap</th>
                        <th className="px-2 py-2">Volume(24h)</th>
                        <th className="px-2 py-2">Circulating Supply</th>
                        <th className="px-2 py-2">Buy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedSymbols
                        .map((symbol, index) => {
                          const info = cryptoInfo[symbol];
                          // Use live price if available, otherwise fallback to dummy price
                          const price = prices[symbol] !== undefined ? prices[symbol] : (100 + Math.random() * 1000);
                          // Dummy data for columns not provided by Binance
                          const dummy = {
                            marketCap: [458808636051, 148700367781, 142480900481, 98825656395, 28881930008, 22490253551, 12021097354, 11672997965, 11058815289, 182421353788][index % 10],
                            volume24h: [45520822427, 3677514942, 4470494845, 7312311059, 21571298134, 1078054564, 2569312755, 1038184409, 342805244, 168703181674][index % 10],
                            supply: [120690000, 139180000, 59970000, 546660000, 151450000, 35850000, 336680000, 678090000, 11060000, 182410000000][index % 10],
                            change24h: [-5.30, -2.18, -4.43, -7.11, -5.47, -6.25, -3.90, -5.86, -0.04, -0.05][index % 10],
                            change7d: [-4.84, -8.50, -2.26, -8.15, -3.94, -6.76, -7.73, -4.99, -0.08, -0.04][index % 10]
                          };
                          const priceChange = getPriceChangeInfo(symbol);
                          const isAnimating = priceAnimations[symbol]?.isFlashing;
                          // Use real icon if available, fallback to emoji
                          let iconElement;
                          const iconPath = `/cryptoIcons/${info.symbol}.png`;
                          iconElement = (
                            <Image src={iconPath} alt={info.symbol} width={28} height={28} className="rounded-full" onError={e => {e.target.onerror=null;e.target.src='';}} />
                          );
                          // If image fails to load, fallback to emoji
                          // Next.js Image does not support onError fallback, so we show both and hide image if not loaded
                          // For best UX, you should ensure all icons exist in public/cryptoIcons
                          return (
                            <tr key={symbol} className={`border-b ${isAnimating ? 'bg-green-50 dark:bg-green-900/20' : 'bg-background'}`}>
                              <td className="px-2 py-2 font-bold">{info.rank}</td>
                              <td className="px-2 py-2 flex items-center gap-2 min-w-[120px]">
                                <span className="relative">
                                  {iconElement}
                                  <span className="absolute left-0 top-0 text-xl" style={{display: 'none'}}>{info.icon}</span>
                                </span>
                                <span className="font-semibold text-foreground">{info.name}</span>
                                <span className="text-muted-foreground text-xs">{info.symbol}</span>
                              </td>
                              <td className="px-2 py-2 font-bold">
                                ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: price < 1 ? 8 : 2 })}
                              </td>
                              <td className={`px-2 py-2 font-medium ${priceChange && priceChange.rawChange > 0 ? 'text-green-500' : 'text-red-500'}`}>{priceChange ? priceChange.rawChange.toFixed(2) + '%' : '--'}</td>
                              <td className={`px-2 py-2 font-medium ${dummy.change24h > 0 ? 'text-green-500' : 'text-red-500'}`}>{dummy.change24h}%</td>
                              <td className={`px-2 py-2 font-medium ${dummy.change7d > 0 ? 'text-green-500' : 'text-red-500'}`}>{dummy.change7d}%</td>
                              <td className="px-2 py-2">${dummy.marketCap.toLocaleString()}</td>
                              <td className="px-2 py-2">${dummy.volume24h.toLocaleString()}</td>
                              <td className="px-2 py-2">{dummy.supply.toLocaleString()}</td>
                              <td className="px-2 py-2">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold transition-all duration-200">Buy</button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>

                {Object.keys(prices).length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="text-lg font-medium mb-2">Waiting for price data...</div>
                    <div className="text-sm">Backend: https://cryptoalarm.onrender.com</div>
                  </div>
                )}
              </CardContent>
            </Card>
            </>
        ) : (
          <div className="flex flex-col min-h-full">
            {/* Alert Management Tab */}
            <div className="flex-grow space-y-4">
              {/* Quick Access Card */}
      

              <AuthProvider>
                <AlertManagerNew />
              </AuthProvider>
            </div>
          </div>
        )}
      </main>

      {/* Footer for Alerts Tab - Outside main, at bottom */}
      {activeTab === "alerts" && (
        <footer className="py-8 border-t border-gray-800 bg-[#0B1426]/50 backdrop-blur-lg">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Left - Branding */}
              <div className="text-center lg:text-left">
                <div className="text-gray-400 text-sm font-medium">
                  © 2025 CryptoAlarm. Smart alerts for smart traders.
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  Voice notifications • Real-time monitoring
                </div>
              </div>
              
              {/* Center - Version Badge */}
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30 px-6 py-3 rounded-full backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#16C784] rounded-full animate-pulse"></div>
                  <span className="text-[#3861FB] font-bold text-lg">v1.0.15</span>
                  <div className="w-2 h-2 bg-[#16C784] rounded-full animate-pulse delay-1000"></div>
                </div>
              </div>
              
              {/* Right - Alert Info */}
              <div className="text-center lg:text-right">
                <div className="text-gray-400 text-sm font-medium">
                  Alert Management System
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  Price targets • Percentage alerts • CRUD operations
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}