import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import StandardNavbar from '../components/StandardNavbar'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import { 
  TrendingUp, Plus,
  BarChart3, PieChart, 
  Calculator, Calendar, Globe, Shield,
  Wallet
} from 'lucide-react'

// Import crypto icons
import BTC_ICON from '/cryptoIcons/BTC.png';
import ETH_ICON from '/cryptoIcons/ETH.png';
import SOL_ICON from '/cryptoIcons/SOL.png';
import ADA_ICON from '/cryptoIcons/ADA.png';

// Create crypto icon mapping
const CRYPTO_ICONS: Record<string, string> = {
  BTC: BTC_ICON,
  ETH: ETH_ICON,
  SOL: SOL_ICON,
  ADA: ADA_ICON,
};

interface Holding {
  symbol: string
  name: string
  icon: string
  amount: number
  avgBuyPrice: number
  currentPrice: number
  value: number
  pnl: number
  pnlPercentage: number
  allocation: number
}

interface Portfolio {
  totalValue: number
  totalInvested: number
  totalPnL: number
  pnlPercentage: number
  holdings: Holding[]
}

interface Transaction {
  id: number
  type: 'buy' | 'sell'
  symbol: string
  amount: number
  price: number
  date: string
  total: number
}

interface AssetLocation {
  location: string
  type: string
  assets: Array<{symbol: string; amount: number; value: number}>
  totalValue: number
  percentage: number
  riskLevel: string
  icon: string
}

interface PerformanceMetrics {
  dayChange: number
  dayChangePercent: number
  weekChange: number
  weekChangePercent: number
  monthChange: number
  monthChangePercent: number
  yearChange: number
  yearChangePercent: number
  maxDrawdown: number
  sharpeRatio: number
  volatility: number
  totalTrades: number
  winRate: number
}

// Mock portfolio data - identical to old frontend
const mockPortfolio: Portfolio = {
  totalValue: 125847.32,
  totalInvested: 98000.00,
  totalPnL: 27847.32,
  pnlPercentage: 28.41,
  holdings: [
    {
      symbol: "BTC",
      name: "Bitcoin",
      icon: "₿",
      amount: 1.2345,
      avgBuyPrice: 45000,
      currentPrice: 67234.56,
      value: 82969.81,
      pnl: 27543.45,
      pnlPercentage: 49.65,
      allocation: 65.94
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      icon: "Ξ",
      amount: 8.7654,
      avgBuyPrice: 2800,
      currentPrice: 3456.78,
      value: 30297.92,
      pnl: 5766.60,
      pnlPercentage: 23.53,
      allocation: 24.08
    },
    {
      symbol: "SOL",
      name: "Solana", 
      icon: "◎",
      amount: 45.123,
      avgBuyPrice: 180,
      currentPrice: 234.56,
      value: 10585.12,
      pnl: 2460.75,
      pnlPercentage: 30.29,
      allocation: 8.41
    },
    {
      symbol: "ADA",
      name: "Cardano",
      icon: "◈", 
      amount: 3500,
      avgBuyPrice: 0.55,
      currentPrice: 0.58,
      value: 2030.00,
      pnl: 105.00,
      pnlPercentage: 5.45,
      allocation: 1.61
    }
  ]
};

const mockTransactions: Transaction[] = [
  { id: 1, type: "buy", symbol: "BTC", amount: 0.5, price: 43000, date: "2024-01-15", total: 21500 },
  { id: 2, type: "buy", symbol: "ETH", amount: 3.2, price: 2750, date: "2024-01-20", total: 8800 },
  { id: 3, type: "sell", symbol: "BTC", amount: 0.1, price: 65000, date: "2024-02-10", total: 6500 },
  { id: 4, type: "buy", symbol: "SOL", amount: 25, price: 185, date: "2024-02-15", total: 4625 }
];

// Performance metrics
const mockPerformanceMetrics: PerformanceMetrics = {
  dayChange: 2847.32,
  dayChangePercent: 2.31,
  weekChange: 8934.21,
  weekChangePercent: 7.64,
  monthChange: 15678.43,
  monthChangePercent: 14.26,
  yearChange: 27847.32,
  yearChangePercent: 28.41,
  maxDrawdown: -12.7,
  sharpeRatio: 1.85,
  volatility: 18.4,
  totalTrades: 47,
  winRate: 72.3
};

// Asset location data
const mockAssetLocations: AssetLocation[] = [
  {
    location: "MetaMask Wallet",
    type: "hot_wallet",
    assets: [
      { symbol: "ETH", amount: 5.2345, value: 18089.76 },
      { symbol: "BTC", amount: 0.3456, value: 23226.45 }
    ],
    totalValue: 41316.21,
    percentage: 32.8,
    riskLevel: "medium",
    icon: "🦊"
  },
  {
    location: "Binance Exchange",
    type: "exchange",
    assets: [
      { symbol: "BTC", amount: 0.7889, value: 53007.36 },
      { symbol: "SOL", amount: 25.123, value: 5892.34 },
      { symbol: "ADA", amount: 2000, value: 1160.00 }
    ],
    totalValue: 60059.70,
    percentage: 47.7,
    riskLevel: "high",
    icon: "🔶"
  },
  {
    location: "Hardware Wallet",
    type: "cold_wallet",
    assets: [
      { symbol: "BTC", amount: 0.1, value: 6723.45 },
      { symbol: "ETH", amount: 3.5309, value: 12208.16 }
    ],
    totalValue: 18931.61,
    percentage: 15.0,
    riskLevel: "low",
    icon: "🔒"
  },
  {
    location: "DeFi Protocols",
    type: "defi",
    assets: [
      { symbol: "SOL", amount: 20, value: 4693.12 },
      { symbol: "ADA", amount: 1500, value: 870.00 }
    ],
    totalValue: 5563.12,
    percentage: 4.4,
    riskLevel: "high",
    icon: "🌐"
  }
];

// Portfolio performance data (mock historical data)
const mockPerformanceData = [
  { date: "2024-01-01", value: 85000 },
  { date: "2024-01-15", value: 92000 },
  { date: "2024-02-01", value: 98000 },
  { date: "2024-02-15", value: 105000 },
  { date: "2024-03-01", value: 112000 },
  { date: "2024-03-15", value: 118000 },
  { date: "2024-04-01", value: 121000 },
  { date: "2024-04-15", value: 125847 }
];

// Simple Chart Components
const LineChart: React.FC<{data: any[]; title: string; color?: string}> = ({ data, title, color = "#3861FB" }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  return (
    <div className="w-full h-64 relative">
      <h4 className="text-white font-medium mb-4">{title}</h4>
      <div className="relative h-48 bg-gray-900/30 rounded-lg p-4">
        <svg className="w-full h-full" viewBox="0 0 400 150">
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line 
              key={i}
              x1="0" 
              y1={30 * i} 
              x2="400" 
              y2={30 * i} 
              stroke="#374151" 
              strokeWidth="0.5"
              opacity="0.3"
            />
          ))}
          
          {/* Chart line and area */}
          <path
            d={`M ${data.map((point, index) => {
              const x = (index / (data.length - 1)) * 400;
              const y = 150 - ((point.value - minValue) / range) * 120;
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}`}
            fill="none"
            stroke={color}
            strokeWidth="2"
          />
          
          <path
            d={`M ${data.map((point, index) => {
              const x = (index / (data.length - 1)) * 400;
              const y = 150 - ((point.value - minValue) / range) * 120;
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')} L 400 150 L 0 150 Z`}
            fill={`url(#gradient-${title})`}
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 400;
            const y = 150 - ((point.value - minValue) / range) * 120;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill={color}
                className="hover:r-4 transition-all"
              />
            );
          })}
        </svg>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 -ml-12">
          <span>${(maxValue / 1000).toFixed(0)}K</span>
          <span>${((maxValue + minValue) / 2000).toFixed(0)}K</span>
          <span>${(minValue / 1000).toFixed(0)}K</span>
        </div>
      </div>
    </div>
  );
};

const DonutChart: React.FC<{data: any[]; title: string}> = ({ data, title }) => {
  let cumulativePercentage = 0;
  
  return (
    <div className="w-full">
      <h4 className="text-white font-medium mb-4 text-center">{title}</h4>
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {data.map((item, index) => {
              const startAngle = cumulativePercentage * 360;
              const endAngle = (cumulativePercentage + item.percentage / 100) * 360;
              cumulativePercentage += item.percentage / 100;
              
              const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
              
              const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
              
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              const colors = ['#3861FB', '#16C784', '#EA3943', '#F59E0B', '#8B5CF6'];
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={colors[index % colors.length]}
                  opacity="0.8"
                  className="hover:opacity-100 transition-opacity"
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

const BarChart: React.FC<{data: any[]; title: string; color?: string}> = ({ data, title, color = "#16C784" }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="w-full">
      <h4 className="text-white font-medium mb-4">{title}</h4>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-16 text-xs text-gray-400 text-right">{item.name}</div>
            <div className="flex-1 bg-gray-800 rounded-full h-6 relative overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color || color
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                {item.percentage}%
              </div>
            </div>
            <div className="w-20 text-xs text-gray-300 text-right">
              ${item.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PortfolioPage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [activeView, setActiveView] = useState<'overview' | 'holdings' | 'transactions' | 'wallets'>('overview')
  const [sortBy, setSortBy] = useState<'value' | 'pnl' | 'allocation'>('value')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  
  const { } = useAuth()
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num: number, decimals = 4) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const sortedHoldings = [...mockPortfolio.holdings].sort((a, b) => {
    const aValue = a[sortBy as keyof Holding] as number;
    const bValue = b[sortBy as keyof Holding] as number;
    return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      <StandardNavbar 
        title="Portfolio Management"
        subtitle="Track and manage your crypto portfolio"
      />
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Portfolio Summary Cards - Identical to old frontend */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Total Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(mockPortfolio.totalValue)}</div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 text-sm font-medium">+{mockPortfolio.pnlPercentage.toFixed(2)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Total Invested</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(mockPortfolio.totalInvested)}</div>
              <div className="text-gray-400 text-sm mt-2">Initial investment</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Total P&L</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{formatCurrency(mockPortfolio.totalPnL)}</div>
              <div className="flex items-center mt-2">
                <Calculator className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-gray-400 text-sm">Unrealized gains</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{mockPortfolio.holdings.length}</div>
              <div className="text-gray-400 text-sm mt-2">Cryptocurrencies</div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation - Identical to old frontend */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-4 sm:mb-6 bg-gray-800/30 p-1 rounded-lg w-full sm:w-fit overflow-x-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${activeView === "overview" ? "bg-[#3861FB] text-white" : "text-gray-400 hover:text-white"} flex-shrink-0`}
            onClick={() => setActiveView("overview")}
          >
            <BarChart3 className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline ml-2">Overview</span>
            <span className="sm:hidden ml-1 text-xs">Overview</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${activeView === "holdings" ? "bg-[#3861FB] text-white" : "text-gray-400 hover:text-white"} flex-shrink-0`}
            onClick={() => setActiveView("holdings")}
          >
            <PieChart className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline ml-2">Holdings</span>
            <span className="sm:hidden ml-1 text-xs">Holdings</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${activeView === "transactions" ? "bg-[#3861FB] text-white" : "text-gray-400 hover:text-white"} flex-shrink-0`}
            onClick={() => setActiveView("transactions")}
          >
            <Calendar className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline ml-2">Transactions</span>
            <span className="sm:hidden ml-1 text-xs">Txns</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${activeView === "wallets" ? "bg-[#3861FB] text-white" : "text-gray-400 hover:text-white"} flex-shrink-0`}
            onClick={() => setActiveView("wallets")}
          >
            <Wallet className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline ml-2">Wallets</span>
            <span className="sm:hidden ml-1 text-xs">Wallets</span>
          </Button>
        </div>

        {/* Overview Tab - Complete charts and metrics from old frontend */}
        {activeView === "overview" && (
          <div className="space-y-6">
            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {mockPerformanceMetrics.dayChangePercent >= 0 ? '+' : ''}{mockPerformanceMetrics.dayChangePercent.toFixed(2)}%
                  </div>
                  <div className="text-gray-400 text-sm">24h Change</div>
                  <div className={`text-sm ${mockPerformanceMetrics.dayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {mockPerformanceMetrics.dayChange >= 0 ? '+' : ''}{formatCurrency(mockPerformanceMetrics.dayChange)}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {mockPerformanceMetrics.weekChangePercent >= 0 ? '+' : ''}{mockPerformanceMetrics.weekChangePercent.toFixed(2)}%
                  </div>
                  <div className="text-gray-400 text-sm">7d Change</div>
                  <div className={`text-sm ${mockPerformanceMetrics.weekChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {mockPerformanceMetrics.weekChange >= 0 ? '+' : ''}{formatCurrency(mockPerformanceMetrics.weekChange)}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">{mockPerformanceMetrics.sharpeRatio}</div>
                  <div className="text-gray-400 text-sm">Sharpe Ratio</div>
                  <div className="text-gray-500 text-xs">Risk-adjusted return</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">{mockPerformanceMetrics.winRate}%</div>
                  <div className="text-gray-400 text-sm">Win Rate</div>
                  <div className="text-gray-500 text-xs">{mockPerformanceMetrics.totalTrades} trades</div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Portfolio Performance Chart */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Portfolio Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChart 
                    data={mockPerformanceData} 
                    title="Total Value Over Time"
                    color="#16C784"
                  />
                </CardContent>
              </Card>

              {/* Asset Allocation Chart */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Asset Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DonutChart 
                    data={mockPortfolio.holdings.map(h => ({
                      name: h.symbol,
                      percentage: h.allocation,
                      value: h.value
                    }))}
                    title="Holdings Distribution"
                  />
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {mockPortfolio.holdings.map((holding, index) => {
                      const colors = ['#3861FB', '#16C784', '#EA3943', '#F59E0B'];
                      return (
                        <div key={index} className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: colors[index % colors.length] }}
                          />
                          <div className="text-sm">
                            <span className="text-white font-medium">{holding.symbol}</span>
                            <span className="text-gray-400 ml-1">{holding.allocation.toFixed(1)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Asset Location Chart - Complete from old frontend */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Asset Locations & Security Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Location Distribution Bar Chart */}
                  <div>
                    <BarChart 
                      data={mockAssetLocations.map(location => ({
                        name: location.location,
                        value: location.totalValue,
                        percentage: location.percentage.toFixed(1),
                        color: location.riskLevel === 'low' ? '#16C784' : 
                               location.riskLevel === 'medium' ? '#F59E0B' : '#EA3943'
                      }))}
                      title="Value by Location"
                      color="#3861FB"
                    />
                  </div>
                  
                  {/* Detailed Location Breakdown */}
                  <div>
                    <h4 className="text-white font-medium mb-4">Security Analysis</h4>
                    <div className="space-y-4">
                      {mockAssetLocations.map((location, index) => (
                        <div key={index} className="bg-gray-900/50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">{location.icon}</div>
                              <div>
                                <div className="text-white font-semibold">{location.location}</div>
                                <div className="text-gray-400 text-sm capitalize">{location.type.replace('_', ' ')}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-bold">{formatCurrency(location.totalValue)}</div>
                              <div className="text-gray-400 text-sm">{location.percentage.toFixed(1)}%</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Shield className={`h-4 w-4 ${
                                location.riskLevel === 'low' ? 'text-green-500' :
                                location.riskLevel === 'medium' ? 'text-yellow-500' : 'text-red-500'
                              }`} />
                              <span className={`text-sm capitalize ${
                                location.riskLevel === 'low' ? 'text-green-400' :
                                location.riskLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
                              }`}>
                                {location.riskLevel} Risk
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            {location.assets.map((asset, assetIndex) => (
                              <div key={assetIndex} className="flex justify-between text-sm">
                                <span className="text-gray-300">
                                  {formatNumber(asset.amount, 4)} {asset.symbol}
                                </span>
                                <span className="text-gray-400">{formatCurrency(asset.value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Holdings Tab - Complete with crypto icons */}
        {activeView === "holdings" && (
          <div className="space-y-6">
            {/* Holdings Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-800/30 rounded-lg">
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'value' | 'pnl' | 'allocation')}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm"
                >
                  <option value="value">Value</option>
                  <option value="pnl">P&L</option>
                  <option value="allocation">Allocation</option>
                </select>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="text-gray-400 hover:text-white"
                >
                  {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                </Button>
              </div>
            </div>

            {/* Holdings List with crypto icons */}
            <div className="grid gap-4">
              {sortedHoldings.map((holding) => {
                // Use imported crypto icon, fallback to emoji if not available
                const cryptoIcon = CRYPTO_ICONS[holding.symbol];
                const iconElement = cryptoIcon ? (
                  <img 
                    src={cryptoIcon} 
                    alt={holding.symbol} 
                    width={40} 
                    height={40} 
                    className="rounded-full object-cover" 
                  />
                ) : (
                  <span className="text-2xl">{holding.icon}</span>
                );

                return (
                  <Card key={holding.symbol} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 flex items-center justify-center">
                            {iconElement}
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg">{holding.name}</h3>
                            <p className="text-gray-400">{holding.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold text-xl">{formatCurrency(holding.value)}</div>
                          <div className={`text-sm ${holding.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {holding.pnl >= 0 ? '+' : ''}{formatCurrency(holding.pnl)} ({holding.pnlPercentage.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">Holdings</div>
                          <div className="text-white font-medium">{formatNumber(holding.amount)} {holding.symbol}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Avg Buy Price</div>
                          <div className="text-white font-medium">{formatCurrency(holding.avgBuyPrice)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Current Price</div>
                          <div className="text-white font-medium">{formatCurrency(holding.currentPrice)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Allocation</div>
                          <div className="text-white font-medium">{holding.allocation.toFixed(2)}%</div>
                        </div>
                      </div>

                      {/* Price Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Avg Buy: {formatCurrency(holding.avgBuyPrice)}</span>
                          <span>Current: {formatCurrency(holding.currentPrice)}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${holding.pnl >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(100, Math.abs(holding.pnlPercentage))}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Transactions Tab - Complete transaction history */}
        {activeView === "transactions" && (
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === 'buy' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                        }`}>
                          {transaction.type === 'buy' ? '+' : '-'}
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {transaction.type === 'buy' ? 'Bought' : 'Sold'} {transaction.symbol}
                          </div>
                          <div className="text-gray-400 text-sm">{transaction.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">{formatNumber(transaction.amount)} {transaction.symbol}</div>
                        <div className="text-gray-400 text-sm">@ {formatCurrency(transaction.price)}</div>
                        <div className={`text-sm font-medium ${
                          transaction.type === 'buy' ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {transaction.type === 'buy' ? '-' : '+'}{formatCurrency(transaction.total)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Wallets Tab - Connect wallet functionality */}
        {activeView === "wallets" && (
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Connected Wallets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Wallet className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-white font-medium mb-2">No Wallets Connected</h3>
                  <p className="text-gray-400 mb-6">Connect your crypto wallets to automatically track your portfolio</p>
                  <Button className="bg-[#3861FB] hover:bg-[#2851FB] text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default PortfolioPage