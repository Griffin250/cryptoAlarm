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
  Zap, Globe, Shield, DollarSign, ArrowLeft, Home
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
};

export default function Dashboard() {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [priceAnimations, setPriceAnimations] = useState({});
  const [activeTab, setActiveTab] = useState("alerts"); // "dashboard" or "alerts"
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const previousPricesRef = useRef({});
  const priceHistoryRef = useRef({});

  useEffect(() => {
    const fetchPrices = async () => {
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
        
        // Clear animations after 1 second
        setTimeout(() => {
          setPriceAnimations({});
        }, 1000);
        
      } catch (error) {
        console.error("Failed to fetch prices:", error);
        setIsConnected(false);
      }
    };

    // Initial fetch
    fetchPrices();
    
    // Set up polling every 2 seconds
    const interval = setInterval(fetchPrices, 2000);
    return () => clearInterval(interval);
  }, []);

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
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left Side - Logo & Navigation */}
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Link href="/" className="flex items-center">
                  <ArrowLeft className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                </Link>
                
                <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer">
                  <div className="bg-gradient-to-br from-[#3861FB] to-[#4F46E5] p-2 rounded-xl">
                    <Image 
                      src="/cryptoAlarmLogo.png" 
                      alt="CryptoAlarm Logo" 
                      width={16} 
                      height={16} 
                      className="object-contain"
                    />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-lg font-bold text-white">CryptoAlarm</h1>
                    <div className="text-xs text-gray-400 flex items-center">
                      <span>Professional Trading Platform</span>
                    </div>
                  </div>
                  <div className="sm:hidden">
                    <h1 className="text-base font-bold text-white">CryptoAlarm</h1>
                  </div>
                </Link>
              </div>

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center space-x-1 flex-shrink-0">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`${activeTab === "dashboard" ? "text-[#3861FB] bg-[#3861FB]/10" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setActiveTab("dashboard")}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`${activeTab === "alerts" ? "text-[#3861FB] bg-[#3861FB]/10" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setActiveTab("alerts")}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Alerts
                </Button>
                <Link href="/dashboard/portfolio">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Globe className="h-4 w-4 mr-2" />
                    Portfolio
                  </Button>
                </Link>
                <Link href="/premium">
                  <Button variant="ghost" size="sm" className="text-[#16C784] hover:text-[#14B575] hover:bg-[#16C784]/10">
                    <Star className="h-4 w-4 mr-2" />
                    Premium
                  </Button>
                </Link>
              </nav>
            </div>

            {/* Center - Search Bar (Desktop only) */}
            <div className="hidden xl:flex items-center max-w-md w-full mx-6">
              <div className="relative w-full">
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

            {/* Right Side - Actions & Status */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Connection Status - Hidden on mobile */}
              <div className="hidden sm:flex items-center space-x-2">
                {isConnected ? (
                  <>
                    <Wifi className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-500 font-medium hidden md:inline">Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-red-500 font-medium hidden md:inline">Disconnected</span>
                  </>
                )}
              </div>

              {/* Test Alert Button */}
              <Button 
                onClick={sendTestAlert}
                disabled={loading}
                size="sm"
                className="bg-gradient-to-r from-[#16C784] to-[#10A96B] hover:from-[#14B575] hover:to-[#0E8B56] text-white"
              >
                <Phone className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{loading ? "Calling..." : "Test Alert"}</span>
              </Button>

              {/* Desktop Action Buttons */}
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/dashboard/settings">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard/profile">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
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
                <Link href="/dashboard/portfolio" onClick={() => setMobileMenuOpen(false)}>
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
                  <Link href="/dashboard/settings" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </Button>
                  </Link>
                  <Link href="/dashboard/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </Button>
                  </Link>
                </div>
                
                {/* Mobile Connection Status */}
                <div className="sm:hidden border-t border-gray-800/50 pt-2 mt-2">
                  <div className="flex items-center space-x-2 px-3 py-2">
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
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Alert Message */}
      {alertMsg && (
        <div className="container mx-auto px-4 pt-4">
          <Alert className={`${alertMsg === "success" ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"}`}>
            <Phone className="h-4 w-4" />
            <AlertDescription className="text-white">
              {alertMsg === "success" 
                ? "📞 Voice alert sent successfully! Your phone should ring shortly." 
                : "⚠️ Failed to send alert. Please check your connection and try again."}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 flex-grow">
        {activeTab === "dashboard" ? (
          <>
            {/* Market Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Market Cap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$4T</div>
                  <div className="text-xs text-red-500 flex items-center">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    2.86%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">24h Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$89B</div>
                  <div className="text-xs text-green-500 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    8.43%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Fear & Greed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">73</div>
                  <div className="text-xs text-green-500">Greed</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Last Update</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">{lastUpdate.toLocaleTimeString()}</div>
                  <div className="text-xs text-muted-foreground">
                    {isConnected ? "Live" : "Offline"}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Crypto Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Live Prices</span>
                  <Badge variant="secondary" className="text-xs">
                    {Object.keys(prices).length} Assets
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(prices)
                    .sort(([aSymbol], [bSymbol]) => {
                      const aRank = cryptoInfo[aSymbol]?.rank || 999;
                      const bRank = cryptoInfo[bSymbol]?.rank || 999;
                      return aRank - bRank;
                    })
                    .map(([symbol, price], index) => {
                      const info = cryptoInfo[symbol];
                      if (!info) return null;

                      const priceChange = getPriceChangeInfo(symbol);
                      const isAnimating = priceAnimations[symbol]?.isFlashing;

                      return (
                        <div 
                          key={symbol} 
                          className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border transition-all duration-500 ${
                            isAnimating 
                              ? priceAnimations[symbol]?.trend === "up" 
                                ? "bg-green-500/20 border-green-500/50" 
                                : "bg-red-500/20 border-red-500/50"
                              : "bg-muted/30 border-border hover:bg-muted/50"
                          }`}
                        >
                          {/* Left - Crypto Info */}
                          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                              <div className={`text-xl sm:text-2xl flex-shrink-0 ${isAnimating ? 'animate-pulse' : ''}`}>
                                {info.icon}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-semibold text-foreground truncate text-sm sm:text-base">{info.name}</div>
                                <div className="text-xs sm:text-sm text-muted-foreground">{info.symbol}</div>
                              </div>
                            </div>
                            
                            <Badge variant="outline" className="text-xs flex-shrink-0 hidden sm:inline-flex">
                              #{info.rank}
                            </Badge>
                          </div>

                          {/* Right - Price & Change */}
                          <div className="flex items-center space-x-2 sm:space-x-6 flex-shrink-0">
                            {/* Price */}
                            <div className="text-right">
                              <div className={`text-sm sm:text-xl font-bold transition-all duration-300 ${
                                isAnimating ? 'scale-105' : ''
                              }`}>
                                ${price.toLocaleString(undefined, { 
                                  minimumFractionDigits: 2, 
                                  maximumFractionDigits: price < 1 ? 8 : 2 
                                })}
                              </div>
                              {/* Show rank on mobile */}
                              <div className="text-xs text-muted-foreground sm:hidden">
                                #{info.rank}
                              </div>
                            </div>

                            {/* Price Change & Trend */}
                            <div className="flex items-center space-x-1 sm:space-x-3">
                              {priceChange && (
                                <div className={`flex items-center space-x-1 transition-all duration-300 ${
                                  priceChange.trend === "up" ? "text-green-500" : 
                                  priceChange.trend === "down" ? "text-red-500" : "text-muted-foreground"
                                }`}>
                                  {priceChange.trend === "up" ? (
                                    <TrendingUp className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                      priceChange.trendStrength === "strong" ? "sm:h-5 sm:w-5" : ""
                                    }`} />
                                  ) : (
                                    <TrendingDown className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                      priceChange.trendStrength === "strong" ? "sm:h-5 sm:w-5" : ""
                                    }`} />
                                  )}
                                  <span className="text-xs sm:text-sm font-medium">
                                    {priceChange.rawChange > 0 ? "+" : ""}{priceChange.rawChange.toFixed(2)}%
                                  </span>
                                </div>
                              )}
                              
                              {/* Trend Strength Badge */}
                              {priceChange && priceChange.trendStrength !== "moderate" && (
                                <Badge 
                                  variant={priceChange.trendStrength === "strong" ? "destructive" : "secondary"}
                                  className="text-xs"
                                >
                                  {priceChange.trendStrength}
                                </Badge>
                              )}
                            </div>

                            {/* Mini Chart Visualization */}
                            <div className="w-24 h-8 bg-muted rounded flex items-center justify-center relative overflow-hidden">
                              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
                                priceChange && priceChange.trend === "up" ? "bg-gradient-to-r from-green-500/20 to-green-500/40" : 
                                priceChange && priceChange.trend === "down" ? "bg-gradient-to-r from-red-500/20 to-red-500/40" : 
                                "bg-muted-foreground/20"
                              }`}>
                                {/* Animated bar based on price movement */}
                                <div className={`h-1 rounded transition-all duration-500 ${
                                  priceChange && priceChange.trend === "up" ? "bg-green-500 w-full" : 
                                  priceChange && priceChange.trend === "down" ? "bg-red-500 w-full" : 
                                  "bg-muted-foreground w-1/2"
                                } ${priceChange && priceChange.isFlashing ? "animate-pulse" : ""}`} />
                              </div>
                              
                              {/* Live indicator dot */}
                              <div className={`absolute right-1 top-1 w-2 h-2 rounded-full ${
                                isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
                              }`} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-blue-900">Enhanced Alert Management</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Use our new dedicated alerts page for full functionality, authentication, and debugging tools.
                      </p>
                    </div>
                    <Link href="/dashboard/alerts">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Bell className="w-4 h-4 mr-2" />
                        Open Alerts Page
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

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