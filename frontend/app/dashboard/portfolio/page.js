"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import Link from "next/link";
import ResponsiveNavbar from "../../../components/ResponsiveNavbar";
import { 
  TrendingUp, TrendingDown, ArrowLeft, Plus, Minus, 
  DollarSign, Percent, BarChart3, PieChart, Target,
  Calculator, Calendar, Globe, Zap, Star, Bell, User, Settings,
  Wallet, Link2, Shield, Key, CheckCircle, AlertCircle,
  ExternalLink, Copy, Trash2, RefreshCw
} from "lucide-react";

// Mock portfolio data - In real app, this would come from API/database
const mockPortfolio = {
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

const mockTransactions = [
  { id: 1, type: "buy", symbol: "BTC", amount: 0.5, price: 43000, date: "2024-01-15", total: 21500 },
  { id: 2, type: "buy", symbol: "ETH", amount: 3.2, price: 2750, date: "2024-01-20", total: 8800 },
  { id: 3, type: "sell", symbol: "BTC", amount: 0.1, price: 65000, date: "2024-02-10", total: 6500 },
  { id: 4, type: "buy", symbol: "SOL", amount: 25, price: 185, date: "2024-02-15", total: 4625 }
];

// Portfolio performance data (mock historical data)
const mockPerformanceData = [
  { date: "2024-01-01", value: 85000, btc: 42000, eth: 2400, sol: 150, ada: 0.45 },
  { date: "2024-01-15", value: 92000, btc: 45000, eth: 2600, sol: 165, ada: 0.48 },
  { date: "2024-02-01", value: 98000, btc: 48000, eth: 2750, sol: 180, ada: 0.52 },
  { date: "2024-02-15", value: 105000, btc: 51000, eth: 2900, sol: 195, ada: 0.55 },
  { date: "2024-03-01", value: 112000, btc: 54000, eth: 3100, sol: 210, ada: 0.57 },
  { date: "2024-03-15", value: 118000, btc: 58000, eth: 3200, sol: 220, ada: 0.56 },
  { date: "2024-04-01", value: 121000, btc: 62000, eth: 3300, sol: 225, ada: 0.58 },
  { date: "2024-04-15", value: 125847, btc: 67234, eth: 3456, sol: 234, ada: 0.58 }
];

// Asset location data (where assets are stored)
const mockAssetLocations = [
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

// Performance metrics
const mockPerformanceMetrics = {
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

// Supported wallet types
const supportedWallets = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "🦊",
    type: "browser",
    description: "Browser extension wallet for Ethereum and EVM chains",
    networks: ["Ethereum", "BSC", "Polygon"],
    color: "#FF6B35"
  },
  {
    id: "phantom",
    name: "Phantom",
    icon: "👻",
    type: "browser",
    description: "Multi-chain wallet for Solana, Ethereum, and Bitcoin",
    networks: ["Solana", "Ethereum", "Bitcoin"],
    color: "#AB9FF2"
  },
  {
    id: "binance",
    name: "Binance Wallet",
    icon: "🔶",
    type: "exchange",
    description: "Connect via Binance API for portfolio tracking",
    networks: ["Binance", "BSC"],
    color: "#F0B90B"
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "🔵",
    type: "mobile",
    description: "Mobile and browser wallet from Coinbase",
    networks: ["Ethereum", "Bitcoin", "Litecoin"],
    color: "#0052FF"
  },
  {
    id: "trust",
    name: "Trust Wallet",
    icon: "🛡️",
    type: "mobile",
    description: "Mobile wallet supporting 70+ blockchains",
    networks: ["Multi-chain"],
    color: "#3375BB"
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "🔗",
    type: "protocol",
    description: "Connect any WalletConnect compatible wallet",
    networks: ["Multi-chain"],
    color: "#3B99FC"
  }
];

// Simple Chart Components
const LineChart = ({ data, title, color = "#3861FB" }) => {
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

const DonutChart = ({ data, title }) => {
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

const BarChart = ({ data, title, color = "#16C784" }) => {
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

export default function Portfolio() {
  const [activeView, setActiveView] = useState("overview"); // "overview", "holdings", "transactions", "wallets"
  const [sortBy, setSortBy] = useState("value"); // "value", "pnl", "allocation"
  const [sortOrder, setSortOrder] = useState("desc");
  const [connectedWallets, setConnectedWallets] = useState([
    {
      id: 1,
      name: "MetaMask",
      type: "browser",
      address: "0x742d...3f4a",
      balance: 2.4567,
      status: "connected",
      lastSync: "2 mins ago"
    }
  ]);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [selectedWalletType, setSelectedWalletType] = useState("");

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num, decimals = 4) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  // Wallet connection functions
  const connectWallet = async (walletType) => {
    try {
      // Mock connection logic - in real app, this would integrate with actual wallets
      const wallet = supportedWallets.find(w => w.id === walletType);
      if (!wallet) return;

      // Simulate connection process
      const newWallet = {
        id: Date.now(),
        name: wallet.name,
        type: wallet.type,
        address: generateMockAddress(walletType),
        balance: Math.random() * 10,
        status: "connected",
        lastSync: "Just now",
        icon: wallet.icon,
        networks: wallet.networks
      };

      setConnectedWallets(prev => [...prev, newWallet]);
      setShowAddWallet(false);
      setSelectedWalletType("");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const disconnectWallet = (walletId) => {
    setConnectedWallets(prev => prev.filter(w => w.id !== walletId));
  };

  const refreshWallet = async (walletId) => {
    setConnectedWallets(prev => prev.map(wallet => 
      wallet.id === walletId 
        ? { ...wallet, lastSync: "Just now", status: "syncing" }
        : wallet
    ));
    
    // Simulate refresh delay
    setTimeout(() => {
      setConnectedWallets(prev => prev.map(wallet => 
        wallet.id === walletId 
          ? { ...wallet, status: "connected", balance: Math.random() * 10 }
          : wallet
      ));
    }, 2000);
  };

  const generateMockAddress = (walletType) => {
    const prefixes = {
      metamask: "0x",
      phantom: "0x",
      binance: "bnb",
      coinbase: "0x",
      trust: "0x",
      walletconnect: "0x"
    };
    const prefix = prefixes[walletType] || "0x";
    const randomHex = Math.random().toString(16).substring(2, 8);
    return `${prefix}${randomHex}...${Math.random().toString(16).substring(2, 6)}`;
  };

  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
    // You could add a toast notification here
  };

  const sortedHoldings = [...mockPortfolio.holdings].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
  });

  const portfolioBreadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Portfolio" }
  ];

  const portfolioActions = [
    <Button 
      key="add-transaction"
      size="sm" 
      className="bg-[#3861FB] hover:bg-[#2851FB] text-white w-full md:w-auto"
      onClick={() => {/* Add transaction logic */}}
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Transaction
    </Button>
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      <ResponsiveNavbar 
        title="CryptoAlarm"
        subtitle="Portfolio Management"
        breadcrumbs={portfolioBreadcrumbs}
        actions={portfolioActions}
        showBackButton={true}
        backUrl="/dashboard"
        isConnected={true}
      />

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Portfolio Summary */}
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

        {/* Tab Navigation */}
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

        {/* Overview Tab */}
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

            {/* Asset Location Chart */}
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

            {/* Risk Analysis */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Risk Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="h-8 w-8 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-green-500">
                      {mockAssetLocations.filter(l => l.riskLevel === 'low').reduce((sum, l) => sum + l.percentage, 0).toFixed(1)}%
                    </div>
                    <div className="text-gray-400">Low Risk</div>
                    <div className="text-gray-500 text-sm mt-1">Cold storage, hardware wallets</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <AlertCircle className="h-8 w-8 text-yellow-500" />
                    </div>
                    <div className="text-2xl font-bold text-yellow-500">
                      {mockAssetLocations.filter(l => l.riskLevel === 'medium').reduce((sum, l) => sum + l.percentage, 0).toFixed(1)}%
                    </div>
                    <div className="text-gray-400">Medium Risk</div>
                    <div className="text-gray-500 text-sm mt-1">Hot wallets, browser extensions</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <div className="text-2xl font-bold text-red-500">
                      {mockAssetLocations.filter(l => l.riskLevel === 'high').reduce((sum, l) => sum + l.percentage, 0).toFixed(1)}%
                    </div>
                    <div className="text-gray-400">High Risk</div>
                    <div className="text-gray-500 text-sm mt-1">Exchanges, DeFi protocols</div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
                    <div>
                      <h4 className="text-amber-200 font-medium">Security Recommendation</h4>
                      <p className="text-amber-300 text-sm mt-1">
                        Consider moving more assets to cold storage. Currently {mockAssetLocations.filter(l => l.riskLevel === 'high').reduce((sum, l) => sum + l.percentage, 0).toFixed(1)}% 
                        of your portfolio is in high-risk locations.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Holdings Tab */}
        {activeView === "holdings" && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Holdings</CardTitle>
                <div className="flex items-center space-x-2">
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-700 text-white text-sm rounded px-3 py-1 border border-gray-600"
                  >
                    <option value="value">Sort by Value</option>
                    <option value="pnl">Sort by P&L</option>
                    <option value="allocation">Sort by Allocation</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedHoldings.map((holding, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{holding.icon}</div>
                      <div>
                        <div className="text-white font-semibold">{holding.name}</div>
                        <div className="text-gray-400 text-sm">{formatNumber(holding.amount)} {holding.symbol}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-white font-semibold">{formatCurrency(holding.value)}</div>
                      <div className="text-gray-400 text-sm">{holding.allocation.toFixed(1)}% of portfolio</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-gray-400 text-sm">Avg Buy: {formatCurrency(holding.avgBuyPrice)}</div>
                      <div className="text-gray-400 text-sm">Current: {formatCurrency(holding.currentPrice)}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`font-semibold ${holding.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {holding.pnl >= 0 ? '+' : ''}{formatCurrency(holding.pnl)}
                      </div>
                      <div className={`text-sm flex items-center ${holding.pnlPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {holding.pnlPercentage >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {holding.pnlPercentage >= 0 ? '+' : ''}{holding.pnlPercentage.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transactions Tab */}
        {activeView === "transactions" && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge className={tx.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                        {tx.type === 'buy' ? <Plus className="h-3 w-3 mr-1" /> : <Minus className="h-3 w-3 mr-1" />}
                        {tx.type.toUpperCase()}
                      </Badge>
                      <div>
                        <div className="text-white font-medium">{tx.symbol}</div>
                        <div className="text-gray-400 text-sm">{tx.date}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-white">{formatNumber(tx.amount, 2)} {tx.symbol}</div>
                      <div className="text-gray-400 text-sm">@ {formatCurrency(tx.price)}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-white font-semibold">{formatCurrency(tx.total)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Wallets Tab */}
        {activeView === "wallets" && (
          <div className="space-y-6">
            {/* Connected Wallets */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Wallet className="h-5 w-5 mr-2" />
                    Connected Wallets
                  </CardTitle>
                  <Button 
                    onClick={() => setShowAddWallet(true)}
                    size="sm" 
                    className="bg-[#3861FB] hover:bg-[#2851FB] text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Wallet
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {connectedWallets.length === 0 ? (
                  <div className="text-center py-8">
                    <Wallet className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">No Wallets Connected</h3>
                    <p className="text-gray-400 mb-4">Connect your external wallets to track your full portfolio</p>
                    <Button 
                      onClick={() => setShowAddWallet(true)}
                      className="bg-[#3861FB] hover:bg-[#2851FB] text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Connect Your First Wallet
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {connectedWallets.map((wallet) => (
                      <div key={wallet.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                            {wallet.icon || "🔗"}
                          </div>
                          <div>
                            <div className="text-white font-semibold">{wallet.name}</div>
                            <div className="text-gray-400 text-sm flex items-center space-x-2">
                              <span>{wallet.address}</span>
                              <button 
                                onClick={() => copyAddress(wallet.address)}
                                className="text-gray-500 hover:text-gray-300 transition-colors"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="text-gray-500 text-xs">
                              Last sync: {wallet.lastSync}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-white font-semibold">
                              {formatNumber(wallet.balance, 4)} ETH
                            </div>
                            <div className="flex items-center text-sm">
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                wallet.status === 'connected' ? 'bg-green-500' :
                                wallet.status === 'syncing' ? 'bg-yellow-500' : 'bg-red-500'
                              }`} />
                              <span className={
                                wallet.status === 'connected' ? 'text-green-400' :
                                wallet.status === 'syncing' ? 'text-yellow-400' : 'text-red-400'
                              }>
                                {wallet.status === 'connected' ? 'Connected' :
                                 wallet.status === 'syncing' ? 'Syncing...' : 'Disconnected'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => refreshWallet(wallet.id)}
                              className="text-gray-400 hover:text-white"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => disconnectWallet(wallet.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add Wallet Modal/Form */}
            {showAddWallet && (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Connect External Wallet</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowAddWallet(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white font-medium mb-4">Choose Wallet Type</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {supportedWallets.map((wallet) => (
                          <button
                            key={wallet.id}
                            onClick={() => setSelectedWalletType(wallet.id)}
                            className={`p-4 rounded-lg border text-left transition-all hover:scale-105 ${
                              selectedWalletType === wallet.id
                                ? 'border-[#3861FB] bg-[#3861FB]/10'
                                : 'border-gray-600 bg-gray-900/50 hover:border-gray-500'
                            }`}
                          >
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="text-2xl">{wallet.icon}</div>
                              <div>
                                <div className="text-white font-semibold">{wallet.name}</div>
                                <Badge 
                                  className="text-xs"
                                  style={{ backgroundColor: `${wallet.color}20`, color: wallet.color, borderColor: `${wallet.color}50` }}
                                >
                                  {wallet.type}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-2">{wallet.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {wallet.networks.map((network) => (
                                <Badge key={network} className="bg-gray-700 text-gray-300 text-xs">
                                  {network}
                                </Badge>
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedWalletType && (
                      <div className="space-y-4">
                        <div className="border-t border-gray-700 pt-4">
                          <h4 className="text-white font-medium mb-3">Connection Details</h4>
                          
                          {/* Different connection forms based on wallet type */}
                          {selectedWalletType === 'binance' && (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                  API Key
                                </label>
                                <input
                                  type="text"
                                  placeholder="Enter your Binance API key"
                                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                  Secret Key
                                </label>
                                <input
                                  type="password"
                                  placeholder="Enter your Binance secret key"
                                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]"
                                />
                              </div>
                              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                                <div className="flex items-start space-x-2">
                                  <Shield className="h-4 w-4 text-amber-400 mt-0.5" />
                                  <div>
                                    <p className="text-amber-200 text-sm font-medium">Security Notice</p>
                                    <p className="text-amber-300 text-xs">
                                      Only enable &quot;Read&quot; permissions. Never share your API keys.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {(selectedWalletType === 'metamask' || selectedWalletType === 'phantom') && (
                            <div className="space-y-3">
                              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                <div className="flex items-start space-x-2">
                                  <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5" />
                                  <div>
                                    <p className="text-blue-200 text-sm font-medium">Browser Extension Required</p>
                                    <p className="text-blue-300 text-xs">
                                      Make sure you have {supportedWallets.find(w => w.id === selectedWalletType)?.name} installed in your browser.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {selectedWalletType === 'walletconnect' && (
                            <div className="space-y-3">
                              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                                <div className="flex items-start space-x-2">
                                  <Link2 className="h-4 w-4 text-purple-400 mt-0.5" />
                                  <div>
                                    <p className="text-purple-200 text-sm font-medium">Universal Connection</p>
                                    <p className="text-purple-300 text-xs">
                                      Scan QR code with any WalletConnect compatible mobile wallet.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-3">
                          <Button
                            onClick={() => connectWallet(selectedWalletType)}
                            className="bg-[#16C784] hover:bg-[#14B575] text-white"
                          >
                            <Link2 className="h-4 w-4 mr-2" />
                            Connect Wallet
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowAddWallet(false);
                              setSelectedWalletType("");
                            }}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Wallet Integration Benefits */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Why Connect External Wallets?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#3861FB]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BarChart3 className="h-6 w-6 text-[#3861FB]" />
                    </div>
                    <h3 className="text-white font-medium mb-2">Complete Portfolio View</h3>
                    <p className="text-gray-400 text-sm">
                      Track all your crypto assets across multiple wallets and exchanges in one place.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#16C784]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Bell className="h-6 w-6 text-[#16C784]" />
                    </div>
                    <h3 className="text-white font-medium mb-2">Smart Alerts</h3>
                    <p className="text-gray-400 text-sm">
                      Set alerts based on your total portfolio value across all connected wallets.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#EA3943]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="h-6 w-6 text-[#EA3943]" />
                    </div>
                    <h3 className="text-white font-medium mb-2">Secure & Private</h3>
                    <p className="text-gray-400 text-sm">
                      Read-only access ensures your funds stay secure. We never store private keys.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}