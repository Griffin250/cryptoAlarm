'use client';

'use client';

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, TrendingDown, Plus, Minus, Shield, 
  CheckCircle, AlertCircle, Wallet, Link2, Copy, 
  Trash2, RefreshCw, BarChart3, PieChart, Calendar,
  Star, ChevronRight, Target, Globe, DollarSign, Calculator,
  Percent, Bell, Phone, Users, Award, Zap, Sparkles 
} from "lucide-react";
import { walletService } from '../../lib/walletService';
import { supabase } from '../../lib/supabase';

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
    // ... rest of the mock data ...
  ]
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
  }
];

export default function Portfolio() {
  const [activeView, setActiveView] = useState("overview");
  const [sortBy, setSortBy] = useState("value");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [selectedWalletType, setSelectedWalletType] = useState("");
  const [connectedWallets, setConnectedWallets] = useState([]);

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
      let result;

      switch (walletType) {
        case 'binance': {
          // Get the form data
          const apiKey = document.querySelector('input[placeholder="Enter your Binance API key"]').value;
          const apiSecret = document.querySelector('input[placeholder="Enter your Binance secret key"]').value;
          result = await walletService.connectBinanceWallet(apiKey, apiSecret);
          break;
        }
        case 'phantom':
          result = await walletService.connectPhantomWallet();
          break;
        case 'coinbase':
          result = await walletService.connectCoinbaseWallet();
          break;
        default:
          throw new Error('Unsupported wallet type');
      }

      if (result.success) {
        const wallet = supportedWallets.find(w => w.id === walletType);
        const newWallet = {
          id: Date.now(),
          name: wallet.name,
          type: wallet.type,
          address: result.address || 'API Connected',
          status: "connected",
          lastSync: "Just now",
          icon: wallet.icon,
          networks: wallet.networks,
          balance: 0
        };

        setConnectedWallets(prev => [...prev, newWallet]);
        setShowAddWallet(false);
        setSelectedWalletType("");
        
        // Fetch initial balances
        refreshWallet(newWallet.id);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert(error.message);
    }
  };

  const refreshWallet = async (walletId) => {
    try {
      // Set wallet to syncing state
      setConnectedWallets(prev => prev.map(wallet => 
        wallet.id === walletId 
          ? { ...wallet, lastSync: "Just now", status: "syncing" }
          : wallet
      ));

      // Get the wallet
      const wallet = connectedWallets.find(w => w.id === walletId);
      if (!wallet) return;

      // Fetch balances
      const result = await walletService.getWalletBalances(wallet.type, wallet.address);
      
      if (result.success) {
        setConnectedWallets(prev => prev.map(w => 
          w.id === walletId 
            ? { 
                ...w, 
                status: "connected", 
                balances: result.balances,
                lastSync: new Date().toLocaleTimeString()
              }
            : w
        ));
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Failed to refresh wallet:", error);
      setConnectedWallets(prev => prev.map(w => 
        w.id === walletId 
          ? { ...w, status: "error", lastSync: "Failed to sync" }
          : w
      ));
      alert(error.message);
    }
  };

  const disconnectWallet = async (walletId) => {
    try {
      const result = await walletService.disconnectWallet(walletId);
      if (result.success) {
        setConnectedWallets(prev => prev.filter(w => w.id !== walletId));
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
      alert(error.message);
    }
  };

  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
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
              <CardTitle className="text-sm font-medium text-gray-400">Connected Wallets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{connectedWallets.length}</div>
              <div className="text-gray-400 text-sm mt-2">Active connections</div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-4 sm:mb-6 bg-gray-800/30 p-1 rounded-lg w-full sm:w-fit overflow-x-auto">
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

        {/* Wallets View */}
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
                            {wallet.balances?.map((balance, index) => (
                              <div key={index} className="text-white font-semibold">
                                {formatNumber(balance.balance, 4)} {balance.symbol}
                              </div>
                            ))}
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
                                <div
                                  className="text-xs rounded px-2 py-0.5"
                                  style={{ backgroundColor: `${wallet.color}20`, color: wallet.color, borderColor: `${wallet.color}50` }}
                                >
                                  {wallet.type}
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-2">{wallet.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {wallet.networks.map((network) => (
                                <div key={network} className="bg-gray-700 text-gray-300 text-xs rounded px-2 py-0.5">
                                  {network}
                                </div>
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
                                      Only enable "Read" permissions. Never share your API keys.
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