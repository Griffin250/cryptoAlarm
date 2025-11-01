import React, { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Link, useNavigate } from 'react-router-dom'
import InstallPrompt from '../components/InstallPrompt'
import { 
  TrendingUp, ArrowRight, Bell, Zap, Shield, Phone, 
  BarChart3, Globe, CheckCircle, Play, Pause,
  Target, Users, Award, Smartphone, Crown, Sparkles, RefreshCw
} from 'lucide-react'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [animatedPrice, setAnimatedPrice] = useState(67234.56)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showBanner, setShowBanner] = useState(true)
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0)

  // Upcoming features with rotating content
  const upcomingFeatures = [
    {
      name: "Why Is It Moving?",
      description: "lightning-fast, AI-driven explanations of crypto moves",
      shortDesc: "AI crypto insights",
      icon: <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 group-hover:rotate-12 transition-transform" />
    },
    {
      name: "AI Trading Agents",
      description: "intelligent buy/sell automation with advanced risk management",
      shortDesc: "AI trading bots",
      icon: <Zap className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 group-hover:scale-110 transition-transform" />
    },
    {
      name: "Technical Analyzer Pro",
      description: "advanced chart patterns and technical indicator analysis",
      shortDesc: "Technical analysis",
      icon: <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 group-hover:rotate-12 transition-transform" />
    },
    {
      name: "Fundamental Scanner",
      description: "deep-dive fundamental analysis and market sentiment tracking",
      shortDesc: "Fundamental analysis",
      icon: <Globe className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 group-hover:rotate-y-12 transition-transform" />
    },
    {
      name: "Portfolio Optimizer",
      description: "AI-powered portfolio balancing and risk optimization tools",
      shortDesc: "Portfolio optimization",
      icon: <Target className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 group-hover:scale-110 transition-transform" />
    },
    {
      name: "Market Sentiment AI",
      description: "real-time social media and news sentiment analysis engine",
      shortDesc: "Sentiment analysis",
      icon: <Users className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 group-hover:bounce transition-transform" />
    }
  ]

  // Simulate price changes for animation
  useEffect(() => {
    if (!isPlaying) return
    
    const interval = setInterval(() => {
      setAnimatedPrice(prev => {
        const change = (Math.random() - 0.5) * 1000
        return Math.max(60000, prev + change)
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isPlaying])

  // Rotate through upcoming features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex(prev => (prev + 1) % upcomingFeatures.length)
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [upcomingFeatures.length])

  const features = [
    {
      icon: <Bell className="h-8 w-8 text-[#3861FB]" />,
      title: "Smart Alert System",
      description: "Set price targets or percentage-based alerts for 11+ cryptocurrencies",
      status: "live" as const
    },
    {
      icon: <Phone className="h-8 w-8 text-[#16C784]" />,
      title: "Voice Call Notifications",
      description: "Get instant phone calls when your price targets are reached",
      status: "live" as const
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-[#3861FB]" />,
      title: "Real-time Monitoring",
      description: "Live price updates every 2 seconds via Binance WebSocket",
      status: "live" as const
    },
    {
      icon: <Shield className="h-8 w-8 text-[#16C784]" />,
      title: "Professional Dashboard",
      description: "CoinMarketCap-inspired design with advanced price tracking",
      status: "live" as const
    },
    {
      icon: <Users className="h-8 w-8 text-[#EA3943]" />,
      title: "Multi-User Support",
      description: "Personal alert libraries with user authentication",
      status: "soon" as const
    },
    {
      icon: <Award className="h-8 w-8 text-[#EA3943]" />,
      title: "Advanced Conditions",
      description: "RSI indicators, moving averages, and technical analysis alerts",
      status: "soon" as const
    }
  ]

  const supportedCryptos = [
    { symbol: "BTC", name: "Bitcoin", icon: "₿", color: "#F7931A" },
    { symbol: "ETH", name: "Ethereum", icon: "Ξ", color: "#627EEA" },
    { symbol: "BNB", name: "BNB", icon: "🔶", color: "#F3BA2F" },
    { symbol: "SOL", name: "Solana", icon: "◎", color: "#00FFA3" },
    { symbol: "XRP", name: "XRP", icon: "✗", color: "#23292F" },
    { symbol: "DOGE", name: "Dogecoin", icon: "🐕", color: "#C2A633" },
    { symbol: "ADA", name: "Cardano", icon: "◈", color: "#0033AD" },
    { symbol: "SHIB", name: "Shiba Inu", icon: "🐕", color: "#FFA409" },
    { symbol: "USDC", name: "USD Coin", icon: "💵", color: "#2775CA" },
    { symbol: "SUI", name: "Sui", icon: "🌊", color: "#4DA2FF" },
    { symbol: "PEPE", name: "Pepe", icon: "🐸", color: "#40E0D0" }
  ]

  const steps = [
    {
      step: 1,
      title: "Connect Your Phone",
      description: "Add your phone number to receive voice alerts",
      icon: <Smartphone className="h-6 w-6" />
    },
    {
      step: 2,
      title: "Set Price Targets",
      description: "Choose crypto assets and set your desired price levels",
      icon: <Target className="h-6 w-6" />
    },
    {
      step: 3,
      title: "Get Notified",
      description: "Receive instant phone calls when your targets are hit",
      icon: <Phone className="h-6 w-6" />
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-[#0B1426]/80 border-b border-gray-800">
        <div className="container mx-auto px-3 sm:px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity cursor-pointer min-w-0">
              <div className="bg-gradient-to-br from-[#3861FB] to-[#4F46E5] p-2 rounded-xl flex-shrink-0">
                <img 
                  src="/cryptoAlarmLogo.png" 
                  alt="CryptoAlarm Logo" 
                  width={20} 
                  height={20} 
                  className="sm:w-6 sm:h-6 object-contain"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-white">CryptoAlarm</h1>
                <p className="text-xs text-gray-400 hidden sm:block">Never Miss a Move</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              {/* Refresh button for small screens only */}
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10 p-2 sm:hidden"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              
              <Link to="/premium" className="hidden md:block">
                <Button variant="outline" className="border-[#16C784] text-[#16C784] hover:bg-[#16C784] hover:text-white">
                  <Crown className="h-4 w-4 mr-2" />
                  Premium Plans
                </Button>
              </Link>
              <Link to="/coming-soon" className="hidden md:block">
                <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                  <Sparkles className="h-4 w-4 mr-2 relative z-10 group-hover:animate-pulse" />
                  <span className="relative z-10">Coming Soon</span>
                </Button>
              </Link>
              <Link to="/coming-soon" className="sm:hidden">
                <Button variant="outline" size="sm" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white p-2">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-[#3861FB] hover:bg-[#2851FB] text-white text-sm sm:text-base">
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                  <ArrowRight className="h-4 w-4 ml-1 sm:ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* New Feature Announcement Banner */}
      {showBanner && (
      <div className="relative bg-gradient-to-r from-[#3861FB] via-[#4F46E5] to-[#5B21B6] border-b border-purple-600/30 overflow-hidden animate-in slide-in-from-top duration-500">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated background particles */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 left-10 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
          <div className="absolute top-6 right-20 w-1 h-1 bg-white rounded-full animate-ping"></div>
          <div className="absolute bottom-3 left-1/3 w-1 h-1 bg-yellow-300 rounded-full animate-bounce"></div>
          <div className="absolute top-4 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse delay-700"></div>
        </div>
        
        <div className="relative container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold px-2 py-1 text-xs animate-pulse">
                  NEW
                </Badge>
                <div 
                  key={`icon-${currentFeatureIndex}`}
                  className="animate-in fade-in-0 zoom-in-50 duration-500"
                >
                  {upcomingFeatures[currentFeatureIndex].icon}
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-white font-medium text-sm sm:text-base truncate">
                  <span className="hidden sm:inline">Introducing </span>
                  <span 
                    key={currentFeatureIndex}
                    className="font-bold text-yellow-300 animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
                  >
                    &ldquo;{upcomingFeatures[currentFeatureIndex].name}&rdquo;
                  </span>
                  <span 
                    key={`desc-${currentFeatureIndex}`}
                    className="hidden sm:inline animate-in fade-in-0 slide-in-from-right-2 duration-700 delay-200"
                  >
                    {' '}- {upcomingFeatures[currentFeatureIndex].description}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Link to="/coming-soon" className='cursor-pointer'>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/10 cursor-pointer border-white/30 text-white hover:bg-white hover:text-[#3861FB] transition-all duration-300 text-xs sm:text-sm group"
                >
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 group-hover:rotate-12 transition-transform" />
                  <span className="hidden sm:inline">Learn More</span>
                  <span className="sm:hidden">Learn</span>
                  <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              {/* Close button for mobile */}
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white/70 hover:text-white p-1 sm:hidden"
                onClick={() => setShowBanner(false)}
              >
                ×
              </Button>
            </div>
          </div>
        </div>
        
        {/* Animated background effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
        </div>
      </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#3861FB] rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-[#16C784] rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-[#EA3943] rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-slide-in-up">
              <div className="space-y-4">
                <Badge className="bg-[#3861FB]/20 text-[#3861FB] border-[#3861FB]/30 animate-glow">
                  🚀 Now Live - Smart Crypto Alerts
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  <span className="text-white animate-text-glow">
                    Never Miss a
                  </span>
                  <br />
                  <span className="text-blue-600 bg-clip-text animate-gradient-shift animate-bounce-gentle inline-block">
                    Crypto Move
                  </span>
                  <span className="inline-block ml-2 animate-pulse-color">
                    <span className="text-4xl">🚀</span>
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-none lg:max-w-lg">
                  Get instant <span className="text-[#16C784] font-semibold">voice call alerts</span> when your crypto price targets are reached. 
                  Professional monitoring with real-time notifications.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-[#3861FB] to-[#4F46E5] hover:from-[#2851FB] hover:to-[#3B3D94] text-white px-8 py-4 text-lg"
                  onClick={() => navigate('/auth')}
                >
                  Start Monitoring
                  <TrendingUp className="h-5 w-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg">
                  Watch Demo
                  <Play className="h-5 w-5 ml-2" />
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-white">11+</div>
                  <div className="text-xs sm:text-sm text-gray-400">Cryptocurrencies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-white">2s</div>
                  <div className="text-xs sm:text-sm text-gray-400">Update Interval</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-white">24/7</div>
                  <div className="text-xs sm:text-sm text-gray-400">Monitoring</div>
                </div>
              </div>
            </div>

            {/* Right Content - Live Demo */}
            <div className="relative animate-float">
              <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg animate-scale-in">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                      Live Price Demo
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-gray-400 hover:text-white"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Bitcoin Price Display */}
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        ₿
                      </div>
                      <div>
                        <div className="text-white font-semibold">Bitcoin</div>
                        <div className="text-gray-400 text-sm">BTC</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        ${animatedPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-green-400 text-sm flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +2.45%
                      </div>
                    </div>
                  </div>

                  {/* Alert Preview */}
                  <div className="p-4 bg-[#3861FB]/10 border border-[#3861FB]/30 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Bell className="h-4 w-4 text-[#3861FB]" />
                      <span className="text-[#3861FB] font-medium">Active Alert</span>
                    </div>
                    <div className="text-white text-sm">
                      Call me when BTC drops below <span className="font-bold">$95,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-[#16C784] text-white px-4 py-2 rounded-full text-sm font-medium animate-bounce animate-glow">
                📞 Voice Alerts
              </div>
              <div className="absolute -bottom-4 -left-4 bg-[#EA3943] text-white px-4 py-2 rounded-full text-sm font-medium animate-bounce delay-1000 animate-glow">
                ⚡ Real-time
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Professional Crypto Monitoring
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Advanced features designed for serious crypto traders and investors
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    {feature.icon}
                    <Badge 
                      className={feature.status === 'live' 
                        ? 'bg-[#16C784]/20 text-[#16C784] border-[#16C784]/30' 
                        : 'bg-[#EA3943]/20 text-[#EA3943] border-[#EA3943]/30'
                      }
                    >
                      {feature.status === 'live' ? '✅ Live' : '🔜 Soon'}
                    </Badge>
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Cryptos - Enhanced Animated Marquee */}
      <section className="py-20 overflow-hidden relative">
        {/* Animated background particles */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute top-20 right-20 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-1/3 w-1 h-1 bg-green-400 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 right-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 animate-float">
              Supported Cryptocurrencies
            </h2>
            <p className="text-xl text-gray-300">
              Monitor price movements across 11+ major cryptocurrencies
            </p>
            <div className="mt-4 w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full animate-glow"></div>
          </div>

          {/* Enhanced Marquee Container */}
          <div className="marquee-container space-y-8 relative">
            {/* Gradient overlays for smooth edges */}
            <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-gray-900 via-gray-900/50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-gray-900 via-gray-900/50 to-transparent z-10 pointer-events-none"></div>

            {/* First Row - Moving Left */}
            <div className="relative overflow-hidden">
              <div className="marquee-left flex items-center space-x-8 whitespace-nowrap">
                {/* Triple the content for seamless loop */}
                {[...Array(3)].map((_, setIndex) => (
                  <React.Fragment key={setIndex}>
                    {supportedCryptos.map((crypto, index) => (
                      <Link 
                        key={`${setIndex}-${index}`}
                        to={`/crypto/${crypto.symbol}`}
                        className="flex items-center space-x-4 bg-gray-800/40 border border-gray-700/50 rounded-xl px-6 py-4 backdrop-blur-sm hover:bg-gray-800/70 hover:border-gray-600 hover:scale-105 transition-all duration-300 flex-shrink-0 group cursor-pointer shadow-lg hover:shadow-2xl"
                        style={{
                          boxShadow: `0 4px 15px rgba(${crypto.color === '#F7931A' ? '247, 147, 26' : crypto.color === '#627EEA' ? '98, 126, 234' : '56, 97, 251'}, 0.1)`
                        }}
                      >
                        <div className="text-2xl flex items-center justify-center group-hover:animate-pulse" style={{ color: crypto.color, width: '2.5rem', height: '2.5rem' }}>
                          <img
                            src={`/cryptoIcons/${crypto.symbol}.png`}
                            alt={crypto.name}
                            width={32}
                            height={32}
                            className="object-contain rounded-full bg-white/10 p-1 group-hover:bg-white/20 transition-all duration-300"
                            onError={(e) => { 
                              const target = e.target as HTMLImageElement;
                              target.onerror = null; 
                              target.style.display = 'none'; 
                              if (target.parentNode) {
                                (target.parentNode as HTMLElement).innerHTML += crypto.icon; 
                              }
                            }}
                          />
                        </div>
                        <div>
                          <div className="text-white font-semibold text-lg group-hover:text-blue-300 transition-colors">{crypto.symbol}</div>
                          <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">{crypto.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-semibold group-hover:text-green-300 transition-colors">
                            +{(2 + Math.random() * 8).toFixed(2)}%
                          </div>
                          <div className="text-gray-400 text-xs">24h</div>
                        </div>
                      </Link>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Second Row - Moving Right */}
            <div className="relative overflow-hidden">
              <div className="marquee-right flex items-center space-x-8 whitespace-nowrap">
                {/* Triple the content for seamless loop */}
                {[...Array(3)].map((_, setIndex) => (
                  <React.Fragment key={setIndex}>
                    {supportedCryptos.slice().reverse().map((crypto, index) => (
                      <Link 
                        key={`${setIndex}-${index}`}
                        to={`/crypto/${crypto.symbol}`}
                        className="flex items-center space-x-4 bg-gray-800/40 border border-gray-700/50 rounded-xl px-6 py-4 backdrop-blur-sm hover:bg-gray-800/70 hover:border-gray-600 hover:scale-105 transition-all duration-300 flex-shrink-0 group cursor-pointer shadow-lg hover:shadow-2xl"
                        style={{
                          boxShadow: `0 4px 15px rgba(${crypto.color === '#F7931A' ? '247, 147, 26' : crypto.color === '#627EEA' ? '98, 126, 234' : '56, 97, 251'}, 0.1)`
                        }}
                      >
                        <div className="text-2xl flex items-center justify-center group-hover:animate-pulse" style={{ color: crypto.color, width: '2.5rem', height: '2.5rem' }}>
                          <img
                            src={`/cryptoIcons/${crypto.symbol}.png`}
                            alt={crypto.name}
                            width={32}
                            height={32}
                            className="object-contain rounded-full bg-white/10 p-1 group-hover:bg-white/20 transition-all duration-300"
                            onError={(e) => { 
                              const target = e.target as HTMLImageElement;
                              target.onerror = null; 
                              target.style.display = 'none'; 
                              if (target.parentNode) {
                                (target.parentNode as HTMLElement).innerHTML += crypto.icon; 
                              }
                            }}
                          />
                        </div>
                        <div>
                          <div className="text-white font-semibold text-lg group-hover:text-blue-300 transition-colors">{crypto.symbol}</div>
                          <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">{crypto.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-red-400 font-semibold group-hover:text-red-300 transition-colors">
                            -{(0.5 + Math.random() * 4).toFixed(2)}%
                          </div>
                          <div className="text-gray-400 text-xs">24h</div>
                        </div>
                      </Link>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm animate-pulse">
              💡 Hover over the scrolling rows to pause the animation
            </p>
            <div className="mt-2 flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
                Live Data
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping mr-1"></div>
                Real-time Updates
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Animated */}
      <section className="py-20 bg-gray-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300">
              Watch the magic happen in real-time
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative group">
                {/* Animated Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-1 z-0">
                    <div className="data-flow-line w-full h-full bg-gradient-to-r from-[#3861FB]/30 via-[#3861FB] to-[#16C784]/30 rounded-full"></div>
                  </div>
                )}
                
                {/* Animated Step Icon */}
                <div className={`
                  step-icon bg-gradient-to-br from-[#3861FB] to-[#4F46E5] w-20 h-20 rounded-full 
                  flex items-center justify-center mx-auto mb-6 relative z-10 cursor-pointer
                  ${index === 0 ? 'phone-animation' : ''}
                  ${index === 1 ? 'target-animation' : ''}
                  ${index === 2 ? 'notification-animation' : ''}
                `}>
                  <div className="text-white text-2xl">
                    {index === 0 && <Smartphone className="h-7 w-7" />}
                    {index === 1 && <Target className="h-7 w-7" />}
                    {index === 2 && <Phone className="h-7 w-7" />}
                  </div>
                  
                  {/* Pulse rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-[#3861FB] animate-ping opacity-20"></div>
                  <div className="absolute inset-0 rounded-full border border-[#16C784] animate-pulse opacity-30"></div>
                </div>

                {/* Step Content */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#3861FB] to-[#16C784] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.step}
                    </div>
                    <div className="h-px bg-gradient-to-r from-[#3861FB] to-transparent w-12"></div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#16C784] transition-colors duration-300">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                    {step.description}
                  </p>

                  {/* Interactive Demo Elements */}
                  {index === 0 && (
                    <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="flex items-center space-x-2 text-sm text-gray-300">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span>+1 (555) 123-4567</span>
                      </div>
                    </div>
                  )}

                  {index === 1 && (
                    <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">BTC Target:</span>
                        <span className="text-[#16C784] font-bold">$70,000</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div className="bg-gradient-to-r from-[#3861FB] to-[#16C784] h-2 rounded-full w-3/4 relative">
                          <div className="absolute right-0 top-0 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {index === 2 && (
                    <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="flex items-center space-x-2 text-sm">
                        <Bell className="h-4 w-4 text-[#16C784] animate-bounce" />
                        <span className="text-[#16C784] font-semibold">Alert Triggered!</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        BTC reached $70,000
                      </div>
                    </div>
                  )}
                </div>

                {/* Floating particles for visual appeal */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 right-4 w-2 h-2 bg-[#3861FB] rounded-full opacity-60 animate-ping"></div>
                  <div className="absolute bottom-8 left-6 w-1 h-1 bg-[#16C784] rounded-full opacity-40 animate-pulse"></div>
                  <div className="absolute top-12 left-8 w-1.5 h-1.5 bg-[#EA3943] rounded-full opacity-50 animate-bounce"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Real-time Simulation Display */}
          <div className="mt-16 bg-gray-800/30 border border-gray-700 rounded-2xl p-8 backdrop-blur-sm">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Live Demo Simulation</h3>
              <p className="text-gray-400">Watch how alerts work in real-time</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Phone Status */}
              <div className="text-center p-4 bg-gray-700/30 rounded-xl">
                <Smartphone className="h-8 w-8 text-[#3861FB] mx-auto mb-2 phone-animation" />
                <div className="text-white font-semibold">Phone Connected</div>
                <div className="text-green-400 text-sm">Ready for alerts</div>
              </div>

              {/* Price Monitor */}
              <div className="text-center p-4 bg-gray-700/30 rounded-xl">
                <Target className="h-8 w-8 text-[#16C784] mx-auto mb-2 target-animation" />
                <div className="text-white font-semibold">Monitoring BTC</div>
                <div className="text-gray-400 text-sm">Target: $70,000</div>
              </div>

              {/* Alert Status */}
              <div className="text-center p-4 bg-gray-700/30 rounded-xl">
                <Bell className="h-8 w-8 text-[#EA3943] mx-auto mb-2 notification-animation" />
                <div className="text-white font-semibold">Alert Ready</div>
                <div className="text-orange-400 text-sm">Will call instantly</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-[#3861FB]/20 to-[#16C784]/20 border-[#3861FB]/30">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Never Miss a Move?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join traders who rely on CryptoAlarm for real-time price monitoring and instant voice notifications.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-[#3861FB] to-[#4F46E5] hover:from-[#2851FB] hover:to-[#3B3D94] text-white px-8 py-4 text-lg"
                  onClick={() => navigate('/dashboard')}
                >
                  Start Free Monitoring
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-6 mt-8 text-gray-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-[#16C784]" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-[#16C784]" />
                  <span>Real-time Alerts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-[#16C784]" />
                  <span>Professional Grade</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Logo Section */}
            <div className="flex flex-col items-center md:items-start">
              <Link to="/" className="flex items-center space-x-3 mb-4 hover:opacity-80 transition-opacity cursor-pointer">
                <div className="bg-gradient-to-br from-[#3861FB] to-[#4F46E5] p-2 rounded-xl">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">CryptoAlarm</h1>
                  <p className="text-xs text-gray-400">Professional Crypto Monitoring</p>
                </div>
              </Link>
              <p className="text-gray-400 text-sm text-center md:text-left">
                Never miss a crypto move with real-time voice alerts and professional monitoring.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2 text-center md:text-left">
                <Link to="/dashboard" className="block text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link to="/alerts" className="block text-gray-400 hover:text-white transition-colors">
                  Set Alerts
                </Link>
                <Link to="/coming-soon" className="block text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  Coming Soon
                </Link>
                <Link to="#features" className="block text-gray-400 hover:text-white transition-colors">
                  Features
                </Link>
                <Link to="#supported-cryptos" className="block text-gray-400 hover:text-white transition-colors">
                  Supported Assets
                </Link>
              </div>
            </div>

            {/* Legal & Support */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-white font-semibold mb-4">Legal & Support</h3>
              <div className="space-y-2 text-center md:text-left">
                <Link to="/terms" className="block text-gray-400 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
                <Link to="/privacy" className="block text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/disclaimer" className="block text-gray-400 hover:text-white transition-colors">
                  Risk Disclaimer
                </Link>
                <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Copyright Section */}
              <div className="text-center lg:text-left">
                <div className="text-gray-400 text-sm font-medium">
                  © 2025 CryptoAlarm. Built with ❤️ for the crypto community.
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  Real-time data powered by Binance API • Voice alerts via Twilio
                </div>
              </div>
              
              {/* Version - Enhanced Design */}
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30 px-6 py-3 rounded-full backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#16C784] rounded-full animate-pulse"></div>
                  <span className="text-[#3861FB] font-bold text-lg">v1.0.15</span>
                  <div className="w-2 h-2 bg-[#16C784] rounded-full animate-pulse delay-1000"></div>
                </div>
              </div>
              
              {/* Additional Info */}
              <div className="text-center lg:text-right">
                <div className="text-gray-400 text-sm font-medium">
                  Professional Grade Monitoring
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  Never miss a crypto move • 24/7 alerts
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  )
}

export default Home