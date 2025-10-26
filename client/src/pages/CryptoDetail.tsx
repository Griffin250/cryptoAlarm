import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import StandardNavbar from '../components/StandardNavbar'
import PriceChart, { type CandlestickData } from '../components/PriceChart'

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

// Additional crypto icons (using available ones as fallbacks for missing icons)
// TRX, LINK, LTC, POL, BCH, DOT, AVAX, UNI, XLM don't have specific icons yet
// Using available icons as placeholders until specific ones are added

// Create crypto icon mapping - All 20 cryptocurrencies
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
  // Placeholders for missing icons (using BTC icon until specific ones are added)
  TRX: BTC_ICON,
  LINK: BTC_ICON,
  LTC: BTC_ICON,
  POL: BTC_ICON,
  BCH: BTC_ICON,
  DOT: BTC_ICON,
  AVAX: BTC_ICON,
  UNI: BTC_ICON,
  XLM: BTC_ICON,
}

// Crypto info mapping - All 20 cryptocurrencies
const cryptoInfo: Record<string, {name: string; symbol: string; icon: string; rank: number; binanceSymbol: string}> = {
  BTC: { name: "Bitcoin", symbol: "BTC", icon: "₿", rank: 1, binanceSymbol: "BTCUSDT" },
  ETH: { name: "Ethereum", symbol: "ETH", icon: "Ξ", rank: 2, binanceSymbol: "ETHUSDT" },
  BNB: { name: "BNB", symbol: "BNB", icon: "🔶", rank: 3, binanceSymbol: "BNBUSDT" },
  SOL: { name: "Solana", symbol: "SOL", icon: "◎", rank: 4, binanceSymbol: "SOLUSDT" },
  XRP: { name: "XRP", symbol: "XRP", icon: "✗", rank: 5, binanceSymbol: "XRPUSDT" },
  DOGE: { name: "Dogecoin", symbol: "DOGE", icon: "🐕", rank: 6, binanceSymbol: "DOGEUSDT" },
  ADA: { name: "Cardano", symbol: "ADA", icon: "◈", rank: 7, binanceSymbol: "ADAUSDT" },
  SHIB: { name: "Shiba Inu", symbol: "SHIB", icon: "🐕", rank: 8, binanceSymbol: "SHIBUSDT" },
  USDC: { name: "USD Coin", symbol: "USDC", icon: "💵", rank: 9, binanceSymbol: "USDCUSDT" },
  SUI: { name: "Sui", symbol: "SUI", icon: "🌊", rank: 10, binanceSymbol: "SUIUSDT" },
  PEPE: { name: "Pepe", symbol: "PEPE", icon: "🐸", rank: 11, binanceSymbol: "PEPEUSDT" },
  TRX: { name: "TRON", symbol: "TRX", icon: "🚀", rank: 12, binanceSymbol: "TRXUSDT" },
  LINK: { name: "Chainlink", symbol: "LINK", icon: "🔗", rank: 13, binanceSymbol: "LINKUSDT" },
  LTC: { name: "Litecoin", symbol: "LTC", icon: "Ł", rank: 14, binanceSymbol: "LTCUSDT" },
  POL: { name: "Polygon", symbol: "POL", icon: "🟪", rank: 15, binanceSymbol: "POLYUSDT" },
  BCH: { name: "Bitcoin Cash", symbol: "BCH", icon: "Ƀ", rank: 16, binanceSymbol: "BCHUSDT" },
  DOT: { name: "Polkadot", symbol: "DOT", icon: "●", rank: 17, binanceSymbol: "DOTUSDT" },
  AVAX: { name: "Avalanche", symbol: "AVAX", icon: "🗻", rank: 18, binanceSymbol: "AVAXUSDT" },
  UNI: { name: "Uniswap", symbol: "UNI", icon: "🦄", rank: 19, binanceSymbol: "UNIUSDT" },
  XLM: { name: "Stellar", symbol: "XLM", icon: "★", rank: 20, binanceSymbol: "XLMUSDT" }
}

import { 
  TrendingUp, TrendingDown, BarChart3, Target, Clock, ArrowUp, Zap,
  Bookmark, RefreshCw, ArrowRight, Maximize2, Minimize2, ExternalLink, Heart, MessageCircle
} from 'lucide-react'

interface CryptoData {
  symbol: string
  name: string
  price: number
  change24h: number
  marketCap: number
  volume24h: number
  supply: {
    current: number
    total: number
    max: number
  }
  fdv: number
  volMarketCapRatio: number
  sentiment: {
    bullish: number
    bearish: number
    votes: number
  }
  profileScore: number
  priceHistory: number[]
  candlestickData: CandlestickData[]
  news: Array<{
    title: string
    source: string
    time: string
    impact: 'positive' | 'negative' | 'neutral'
  }>
  aiInsights: Array<{
    question: string
    type: 'price' | 'sentiment' | 'news'
  }>
}

const CryptoDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>()
  const [timeframe, setTimeframe] = useState('24h')

  const [isLoading, setIsLoading] = useState(true)
  const [chartType, setChartType] = useState<'line' | 'candlestick'>('line')
  const [isChartMaximized, setIsChartMaximized] = useState(false)

  // Get crypto info based on symbol with better error handling
  const currentSymbol = symbol?.toUpperCase() || 'BTC'
  const info = cryptoInfo[currentSymbol]

  
  // Use BTC as fallback only if no symbol was provided, otherwise show error
  const displayInfo = info || cryptoInfo.BTC
  
  // Helper function to generate candlestick data from price
  const generateCandlestickData = (basePrice: number, count: number = 20): CandlestickData[] => {
    const data: CandlestickData[] = []
    let currentPrice = basePrice * 0.98 // Start slightly lower
    const now = Date.now()
    
    for (let i = 0; i < count; i++) {
      const timestamp = now - (count - i) * 5 * 60 * 1000 // 5 min intervals
      const volatility = 0.02 // 2% volatility
      
      const open = currentPrice
      const priceChange = (Math.random() - 0.5) * volatility * currentPrice
      const close = open + priceChange
      
      // Generate realistic high/low
      const high = Math.max(open, close) + Math.random() * 0.01 * currentPrice
      const low = Math.min(open, close) - Math.random() * 0.01 * currentPrice
      
      data.push({
        open,
        high,
        low,
        close,
        timestamp
      })
      
      currentPrice = close
    }
    
    return data
  }
  
  // Initialize crypto data with basic info
  const [cryptoData, setCryptoData] = useState<CryptoData>({
    symbol: currentSymbol,
    name: displayInfo.name,
    price: 0,
    change24h: 0,
    marketCap: 0,
    volume24h: 0,
    supply: {
      current: 0,
      total: 0,
      max: 0
    },
    fdv: 0,
    volMarketCapRatio: 0,
    sentiment: {
      bullish: currentSymbol === 'BTC' ? 82 : currentSymbol === 'ETH' ? 75 : 60,
      bearish: currentSymbol === 'BTC' ? 18 : currentSymbol === 'ETH' ? 25 : 40,
      votes: currentSymbol === 'BTC' ? 5200 : currentSymbol === 'ETH' ? 3800 : 1200
    },
    profileScore: currentSymbol === 'BTC' ? 100 : currentSymbol === 'ETH' ? 95 : 80,
    priceHistory: [],
    candlestickData: [],
    news: [
      {
        title: `${currentSymbol === 'BTC' ? 'Big Shift in Crypto ETF Flows!' : 'Major Protocol Upgrade'} 📈`,
        source: "Da Investopedia",
        time: "3 hours",
        impact: 'positive'
      },
      {
        title: `${currentSymbol === 'BTC' ? 'Institutional adoption continues to grow' : 'Network improvements boost confidence'} 💰`,
        source: "CryptoNews",
        time: "5 hours", 
        impact: 'neutral'
      }
    ],
    aiInsights: [
      { question: `What could affect ${currentSymbol}'s future price?`, type: 'price' },
      { question: `What are people saying about ${currentSymbol}?`, type: 'sentiment' },
      { question: `What is the latest news on ${currentSymbol}?`, type: 'news' }
    ]
  })

  // Fetch live price data from Binance API
  const fetchLiveData = async () => {
    try {
      setIsLoading(true)
      const binanceSymbol = displayInfo.binanceSymbol
      
      // Fetch 24hr ticker statistics
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`)
      const data = await response.json()
      
      if (data && !data.code) {
        const price = parseFloat(data.lastPrice)
        const change24h = parseFloat(data.priceChangePercent)
        const volume24h = parseFloat(data.volume) * price // Volume in USD
        
        // Update crypto data with live values
        setCryptoData(prev => ({
          ...prev,
          price,
          change24h,
          volume24h,
          // Estimate market cap (this would normally come from a different API)
          marketCap: price * (prev.supply.current || getEstimatedSupply(currentSymbol)),
          volMarketCapRatio: (volume24h / (price * getEstimatedSupply(currentSymbol))) * 100,
          supply: {
            ...prev.supply,
            current: getEstimatedSupply(currentSymbol),
            total: getEstimatedSupply(currentSymbol),
            max: getMaxSupply(currentSymbol)
          },
          fdv: price * getMaxSupply(currentSymbol),
          candlestickData: generateCandlestickData(price)
        }))
      }
    } catch (error) {
      console.error('Error fetching live data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper functions for supply data
  const getEstimatedSupply = (symbol: string): number => {
    const supplies: Record<string, number> = {
      BTC: 19.93e6,
      ETH: 120.4e6,
      BNB: 166e6,
      SOL: 466e6,
      XRP: 99.9e9,
      DOGE: 146.8e9,
      ADA: 45e9,
      SHIB: 589.3e12,
      USDC: 34.5e9,
      SUI: 10e9,
      PEPE: 420.7e12
    }
    return supplies[symbol] || 1e6
  }

  const getMaxSupply = (symbol: string): number => {
    const maxSupplies: Record<string, number> = {
      BTC: 21e6,
      ETH: 0, // No max supply
      BNB: 200e6,
      SOL: 0, // No max supply  
      XRP: 100e9,
      DOGE: 0, // No max supply
      ADA: 45e9,
      SHIB: 1e15,
      USDC: 0, // No max supply
      SUI: 10e9,
      PEPE: 420.7e12
    }
    return maxSupplies[symbol] || 0
  }

  // Fetch data on component mount and set up real-time updates
  useEffect(() => {
    fetchLiveData()
    
    // Set up WebSocket for real-time price updates
    const binanceSymbol = displayInfo.binanceSymbol.toLowerCase()
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${binanceSymbol}@ticker`)
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data && data.c) {
        const newPrice = parseFloat(data.c)
        const newChange24h = parseFloat(data.P)
        
        setCryptoData(prev => {
          const newPriceHistory = [...prev.priceHistory, newPrice].slice(-50)
          
          // Update the last candlestick or add new one
          let newCandlestickData = [...prev.candlestickData]
          if (newCandlestickData.length > 0) {
            const lastCandle = newCandlestickData[newCandlestickData.length - 1]
            const currentTime = Date.now()
            const timeDiff = currentTime - lastCandle.timestamp
            
            if (timeDiff > 5 * 60 * 1000) { // 5 minutes - create new candle
              newCandlestickData.push({
                open: lastCandle.close,
                high: Math.max(lastCandle.close, newPrice),
                low: Math.min(lastCandle.close, newPrice),
                close: newPrice,
                timestamp: currentTime
              })
            } else { // Update current candle
              lastCandle.close = newPrice
              lastCandle.high = Math.max(lastCandle.high, newPrice)
              lastCandle.low = Math.min(lastCandle.low, newPrice)
              newCandlestickData[newCandlestickData.length - 1] = lastCandle
            }
            
            // Keep last 50 candles
            newCandlestickData = newCandlestickData.slice(-50)
          }
          
          return {
            ...prev,
            price: newPrice,
            change24h: newChange24h,
            priceHistory: newPriceHistory,
            candlestickData: newCandlestickData
          }
        })
      }
    }

    return () => {
      ws.close()
    }
  }, [currentSymbol, displayInfo.binanceSymbol])

  // Keyboard shortcuts for chart modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isChartMaximized) {
        setIsChartMaximized(false)
      }
    }

    if (isChartMaximized) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isChartMaximized])

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return `$${num.toLocaleString()}`
  }

  const formatSupply = (num: number): string => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
    return num.toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A] text-white">
      <StandardNavbar 
        title={`${cryptoData.name} (${cryptoData.symbol})`}
        subtitle={`Rank #${displayInfo.rank} • ${formatNumber(cryptoData.sentiment.votes)} votes`}
      />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            
            {/* Price Section */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between space-y-4 sm:space-y-0">
                  <div className="w-full sm:w-auto">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                      {isLoading ? (
                        <div className="animate-pulse bg-gray-600 h-8 sm:h-10 w-32 sm:w-48 rounded"></div>
                      ) : (
                        `$${cryptoData.price.toLocaleString(undefined, { 
                          minimumFractionDigits: cryptoData.price < 1 ? 6 : 2, 
                          maximumFractionDigits: cryptoData.price < 1 ? 8 : 2 
                        })}`
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {isLoading ? (
                        <div className="animate-pulse bg-gray-600 h-6 w-32 rounded"></div>
                      ) : (
                        <>
                          {cryptoData.change24h >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-400" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-400" />
                          )}
                          <span className={`font-semibold text-sm sm:text-base ${cryptoData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {cryptoData.change24h >= 0 ? '+' : ''}{cryptoData.change24h.toFixed(2)}% (24h)
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Chart Controls */}
                  <div className="w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-3 flex flex-col sm:flex-row">
                    {/* Chart Type Selector */}
                    <div className="flex bg-gray-800 rounded-lg p-1">
                      <button
                        onClick={() => setChartType('line')}
                        className={`flex items-center space-x-1 px-2 sm:px-3 py-1 text-xs rounded transition-colors ${
                          chartType === 'line'
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <BarChart3 className="h-3 w-3" />
                        <span>Line</span>
                      </button>
                      <button
                        onClick={() => setChartType('candlestick')}
                        className={`flex items-center space-x-1 px-2 sm:px-3 py-1 text-xs rounded transition-colors ${
                          chartType === 'candlestick'
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <div className="w-3 h-3 flex items-center justify-center">
                          <div className="w-1 h-3 bg-current"></div>
                        </div>
                        <span>Candles</span>
                      </button>
                    </div>

                    {/* Timeframe Selector */}
                    <div className="flex bg-gray-800 rounded-lg p-1 w-full sm:w-auto">
                      {['24h', '1W', '1M', '1Y', 'All', 'Log'].map((tf) => (
                        <button
                          key={tf}
                          onClick={() => setTimeframe(tf)}
                          className={`flex-1 sm:flex-none px-2 sm:px-3 py-1 text-xs rounded transition-colors ${
                            timeframe === tf 
                              ? 'bg-green-600 text-white' 
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Interactive Price Chart */}
                <div className="mt-4 sm:mt-6 h-64 sm:h-80 lg:h-96 bg-gray-800/50 rounded-lg border border-gray-700 p-2 sm:p-4 relative overflow-hidden">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading live chart data...</p>
                      </div>
                    </div>
                  ) : (chartType === 'line' ? cryptoData.priceHistory.length > 1 : cryptoData.candlestickData.length > 1) ? (
                    <PriceChart 
                      data={chartType === 'line' ? cryptoData.priceHistory : cryptoData.candlestickData}
                      height={320}
                      color={cryptoData.change24h >= 0 ? '#10B981' : '#EF4444'}
                      showGradient={chartType === 'line'}
                      chartType={chartType}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Building price history...</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Chart overlay info */}
                  {!isLoading && (
                    <>
                      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-gray-900/90 rounded-lg p-2 sm:p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="text-xs text-gray-400">Current Price</div>
                          <div className={`text-xs px-1.5 py-0.5 rounded ${
                            chartType === 'line' 
                              ? 'bg-blue-600/20 text-blue-400' 
                              : 'bg-orange-600/20 text-orange-400'
                          }`}>
                            {chartType === 'line' ? 'Line' : 'Candles'}
                          </div>
                        </div>
                        <div className="text-sm sm:text-lg font-bold text-white">
                          ${cryptoData.price.toLocaleString(undefined, { 
                            minimumFractionDigits: cryptoData.price < 1 ? 6 : 2, 
                            maximumFractionDigits: cryptoData.price < 1 ? 8 : 2 
                          })}
                        </div>
                        <div className={`text-xs sm:text-sm ${cryptoData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {cryptoData.change24h >= 0 ? '+' : ''}{cryptoData.change24h.toFixed(2)}%
                        </div>
                      </div>
                      
                      {/* Maximize Chart Button */}
                      <button
                        onClick={() => setIsChartMaximized(true)}
                        className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-gray-900/80 hover:bg-gray-800/90 rounded-lg p-2 transition-all duration-200 hover:scale-105 z-10"
                        title="Maximize Chart"
                      >
                        <Maximize2 className="h-4 w-4 text-gray-300 hover:text-white" />
                      </button>
                      
                      {/* Price markers */}
                      {((chartType === 'line' && cryptoData.priceHistory.length > 0) || 
                        (chartType === 'candlestick' && cryptoData.candlestickData.length > 0)) && (
                        <div className="absolute top-2 sm:top-4 right-12 sm:right-16 text-xs text-gray-400 space-y-1 hidden sm:block">
                          {chartType === 'line' ? (
                            <>
                              <div>H: ${Math.max(...cryptoData.priceHistory).toLocaleString()}</div>
                              <div>L: ${Math.min(...cryptoData.priceHistory).toLocaleString()}</div>
                            </>
                          ) : (
                            <>
                              <div>H: ${Math.max(...cryptoData.candlestickData.map(c => c.high)).toLocaleString()}</div>
                              <div>L: ${Math.min(...cryptoData.candlestickData.map(c => c.low)).toLocaleString()}</div>
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Chart Actions */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <button className="flex items-center space-x-1 text-blue-400 hover:text-blue-300">
                      <ExternalLink className="h-3 w-3" />
                      <span>TradingView</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-gray-300">
                      <RefreshCw className="h-3 w-3" />
                      <span>Compare</span>
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    Powered by CoinMarketCap
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-3 sm:p-4">
                  <div className="text-xs sm:text-sm text-gray-400 mb-1">Market cap</div>
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-600 h-5 sm:h-6 w-20 sm:w-24 rounded mb-1"></div>
                  ) : (
                    <div className="text-sm sm:text-lg font-semibold truncate">{formatNumber(cryptoData.marketCap)}</div>
                  )}
                  <div className={`text-xs ${cryptoData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {cryptoData.change24h >= 0 ? '+' : ''}{cryptoData.change24h.toFixed(2)}%
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-3 sm:p-4">
                  <div className="text-xs sm:text-sm text-gray-400 mb-1">Volume (24h)</div>
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-600 h-5 sm:h-6 w-20 sm:w-24 rounded mb-1"></div>
                  ) : (
                    <div className="text-sm sm:text-lg font-semibold truncate">{formatNumber(cryptoData.volume24h)}</div>
                  )}
                  <div className="text-xs text-gray-400">Live data</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-3 sm:p-4">
                  <div className="text-xs sm:text-sm text-gray-400 mb-1">FDV</div>
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-600 h-5 sm:h-6 w-20 sm:w-24 rounded mb-1"></div>
                  ) : (
                    <div className="text-sm sm:text-lg font-semibold truncate">{formatNumber(cryptoData.fdv)}</div>
                  )}
                  <div className="text-xs text-gray-400">
                    {cryptoData.supply.max > 0 ? 'Fully diluted' : 'No max supply'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-3 sm:p-4">
                  <div className="text-xs sm:text-sm text-gray-400 mb-1">Vol/Mkt Cap (24h)</div>
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-600 h-5 sm:h-6 w-20 sm:w-24 rounded mb-1"></div>
                  ) : (
                    <div className="text-sm sm:text-lg font-semibold truncate">{cryptoData.volMarketCapRatio.toFixed(2)}%</div>
                  )}
                  <div className="text-xs text-gray-400">Liquidity ratio</div>
                </CardContent>
              </Card>
            </div>

            {/* Supply Information */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Supply Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Max. supply</span>
                  <span className="font-semibold">{formatSupply(cryptoData.supply.max)} BTC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total supply</span>
                  <span className="font-semibold">{formatSupply(cryptoData.supply.total)} BTC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Circulating supply</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{formatSupply(cryptoData.supply.current)} BTC</span>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full"
                    style={{ width: `${(cryptoData.supply.current / cryptoData.supply.max) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {((cryptoData.supply.current / cryptoData.supply.max) * 100).toFixed(1)}% of max supply in circulation
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                  CMC AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cryptoData.aiInsights.map((insight, index) => (
                    <button
                      key={index}
                      className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm group-hover:text-blue-300 transition-colors">
                          {insight.question}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            
            {/* Community Sentiment */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg flex flex-col sm:flex-row sm:items-center justify-between space-y-1 sm:space-y-0">
                  <span>Community sentiment</span>
                  <span className="text-xs sm:text-sm text-gray-400">{cryptoData.sentiment.votes.toLocaleString()} votes</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-400">Bullish</span>
                    <span className="text-red-400">Bearish</span>
                  </div>
                  
                  {/* Sentiment Bar */}
                  <div className="relative">
                    <div className="w-full bg-red-400 rounded-full h-3">
                      <div 
                        className="bg-green-400 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${cryptoData.sentiment.bullish}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-white font-semibold mt-1">
                      <span>{cryptoData.sentiment.bullish}%</span>
                      <span>{cryptoData.sentiment.bearish}%</span>
                    </div>
                  </div>

                  {/* Voting Buttons */}
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Bullish
                    </Button>
                    <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      Bearish
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Score */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-4">
                <div className="text-sm text-gray-400 mb-2">Profile score</div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full"
                      style={{ width: `${cryptoData.profileScore}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-green-400">{cryptoData.profileScore}%</span>
                </div>
              </CardContent>
            </Card>

            {/* News & Social */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg flex items-center justify-between">
                  Latest News
                  <Badge className="bg-blue-600 text-white text-xs">Live</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {cryptoData.news.map((article, index) => (
                  <div key={index} className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 space-y-1 sm:space-y-0">
                      <h4 className="text-sm font-medium text-white leading-tight flex-1 pr-0 sm:pr-2">
                        {article.title}
                      </h4>
                      <div className="flex items-center space-x-1 text-xs text-gray-400 flex-shrink-0">
                        <Clock className="h-3 w-3" />
                        <span>{article.time}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                      <span className="text-xs text-gray-400">{article.source}</span>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="flex items-center space-x-1 text-xs">
                          <ArrowUp className="h-3 w-3 text-green-400" />
                          <span className="text-green-400">18</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs">
                          <Heart className="h-3 w-3 text-red-400" />
                          <span className="text-gray-400">157</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs">
                          <MessageCircle className="h-3 w-3 text-blue-400" />
                          <span className="text-gray-400">11</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full mt-3 border-gray-600 text-gray-300">
                  See More
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Target className="h-4 w-4 mr-2" />
                  Set Price Alert
                </Button>
                <Button variant="outline" className="w-full border-gray-600 text-gray-300">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Add to Watchlist
                </Button>
                <Button variant="outline" className="w-full border-gray-600 text-gray-300">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Technical Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Maximized Chart Modal */}
      {isChartMaximized && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur effect */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={() => setIsChartMaximized(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-gray-900/95 border border-gray-700 rounded-xl shadow-2xl w-[95vw] h-[90vh] max-w-7xl p-3 sm:p-6 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  {CRYPTO_ICONS[currentSymbol] ? (
                    <img 
                      src={CRYPTO_ICONS[currentSymbol]} 
                      alt={currentSymbol} 
                      width={32}
                      height={32}
                      className="rounded-full object-cover" 
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{displayInfo.icon}</span>
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-white">{displayInfo.name} Chart</h2>
                    <p className="text-sm text-gray-400">{currentSymbol} • {timeframe}</p>
                  </div>
                </div>
                
                {/* Chart Type Toggle */}
                <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => setChartType('line')}
                    className={`px-3 py-1 rounded text-sm transition-all ${
                      chartType === 'line'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Line
                  </button>
                  <button
                    onClick={() => setChartType('candlestick')}
                    className={`px-3 py-1 rounded text-sm transition-all ${
                      chartType === 'candlestick'
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Candles
                  </button>
                </div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => setIsChartMaximized(false)}
                className="bg-gray-800/80 hover:bg-gray-700/90 rounded-lg p-2 transition-all duration-200 hover:scale-105"
                title="Minimize Chart"
              >
                <Minimize2 className="h-5 w-5 text-gray-300 hover:text-white" />
              </button>
            </div>
            
            {/* Maximized Chart */}
            <div className="h-[calc(100%-5rem)] bg-gray-800/30 rounded-lg border border-gray-700 p-4 relative">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400 text-lg">Loading live chart data...</p>
                  </div>
                </div>
              ) : (chartType === 'line' ? cryptoData.priceHistory.length > 1 : cryptoData.candlestickData.length > 1) ? (
                <PriceChart 
                  data={chartType === 'line' ? cryptoData.priceHistory : cryptoData.candlestickData}
                  height={Math.min(window.innerHeight * 0.8, 800)}
                  color={cryptoData.change24h >= 0 ? '#10B981' : '#EF4444'}
                  showGradient={chartType === 'line'}
                  chartType={chartType}
                  animateEntry={true}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Building price history...</p>
                  </div>
                </div>
              )}
              
              {/* Enhanced Chart Info Overlay */}
              {!isLoading && (
                <div className="absolute top-4 left-4 bg-gray-900/90 rounded-lg p-4 min-w-[200px]">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="text-sm text-gray-400">Live Price</div>
                    <div className={`text-sm px-2 py-1 rounded ${
                      chartType === 'line' 
                        ? 'bg-blue-600/20 text-blue-400' 
                        : 'bg-orange-600/20 text-orange-400'
                    }`}>
                      {chartType === 'line' ? 'Line Chart' : 'Candlestick'}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    ${cryptoData.price.toLocaleString(undefined, { 
                      minimumFractionDigits: cryptoData.price < 1 ? 6 : 2, 
                      maximumFractionDigits: cryptoData.price < 1 ? 8 : 2 
                    })}
                  </div>
                  <div className={`text-lg ${cryptoData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {cryptoData.change24h >= 0 ? '+' : ''}{cryptoData.change24h.toFixed(2)}% (24h)
                  </div>
                  
                  {/* Additional Stats */}
                  {((chartType === 'line' && cryptoData.priceHistory.length > 0) || 
                    (chartType === 'candlestick' && cryptoData.candlestickData.length > 0)) && (
                    <div className="mt-3 pt-3 border-t border-gray-700 text-sm text-gray-400 space-y-1">
                      {chartType === 'line' ? (
                        <>
                          <div>24h High: ${Math.max(...cryptoData.priceHistory).toLocaleString()}</div>
                          <div>24h Low: ${Math.min(...cryptoData.priceHistory).toLocaleString()}</div>
                        </>
                      ) : (
                        <>
                          <div>24h High: ${Math.max(...cryptoData.candlestickData.map(c => c.high)).toLocaleString()}</div>
                          <div>24h Low: ${Math.min(...cryptoData.candlestickData.map(c => c.low)).toLocaleString()}</div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CryptoDetail