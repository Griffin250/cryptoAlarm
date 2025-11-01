'use client';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Plus,
  Shield,
  CheckCircle,
  Wallet,
  Link2,
  Copy,
  Trash2,
  RefreshCw,
  BarChart3,
  Bell,
  Calculator,
} from 'lucide-react';
import { walletService } from '../../lib/walletService';
import { supabase } from '../../lib/supabase';

const mockPortfolio = {
  totalValue: 125847.32,
  totalInvested: 98000.0,
  totalPnL: 27847.32,
  pnlPercentage: 28.41,
};

const supportedWallets = [
  { id: 'phantom', name: 'Phantom', icon: '👻', type: 'browser', networks: ['Solana'] },
  { id: 'binance', name: 'Binance', icon: '🔶', type: 'exchange', networks: ['Binance'] },
  { id: 'coinbase', name: 'Coinbase', icon: '🔵', type: 'mobile', networks: ['Ethereum'] },
];

export default function PortfolioPage() {
  const [activeView, setActiveView] = useState('wallets');
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [selectedWalletType, setSelectedWalletType] = useState('');
  const [connectedWallets, setConnectedWallets] = useState([]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatNumber = (num, decimals = 4) =>
    new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(num);

  const connectWallet = async (walletType) => {
    try {
      let result;
      if (walletType === 'binance') {
        const apiKey = document.querySelector('input[placeholder="Enter your Binance API key"]')?.value;
        const apiSecret = document.querySelector('input[placeholder="Enter your Binance secret key"]')?.value;
        result = await walletService.connectBinanceWallet(apiKey, apiSecret);
      } else if (walletType === 'phantom') {
        result = await walletService.connectPhantomWallet();
      } else if (walletType === 'coinbase') {
        result = await walletService.connectCoinbaseWallet();
      }

      if (result?.success) {
        const wallet = supportedWallets.find((w) => w.id === walletType);
        const newWallet = {
          id: Date.now(),
          name: wallet.name,
          type: wallet.type,
          address: result.address || 'API Connected',
          status: 'connected',
          lastSync: 'Just now',
          icon: wallet.icon,
          networks: wallet.networks,
          balance: 0,
        };
        setConnectedWallets((p) => [...p, newWallet]);
        setShowAddWallet(false);
        setSelectedWalletType('');
      } else {
        throw new Error(result?.message || 'Failed to connect');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || String(err));
    }
  };

  const refreshWallet = async (walletId) => {
    try {
      setConnectedWallets((prev) => prev.map((w) => (w.id === walletId ? { ...w, status: 'syncing' } : w)));
      const wallet = connectedWallets.find((w) => w.id === walletId);
      if (!wallet) return;
      const result = await walletService.getWalletBalances(wallet.type, wallet.address);
      if (result.success) {
        setConnectedWallets((prev) => prev.map((w) => (w.id === walletId ? { ...w, balances: result.balances, status: 'connected', lastSync: new Date().toLocaleTimeString() } : w)));
      }
    } catch (err) {
      console.error(err);
      setConnectedWallets((prev) => prev.map((w) => (w.id === walletId ? { ...w, status: 'error' } : w)));
    }
  };

  const disconnectWallet = async (walletId) => {
    try {
      const res = await walletService.disconnectWallet(walletId);
      if (res.success) setConnectedWallets((p) => p.filter((w) => w.id !== walletId));
    } catch (err) {
      console.error(err);
    }
  };

  const copyAddress = (address) => navigator.clipboard.writeText(address || '');

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
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
              <CardTitle className="text-sm font-medium text-gray-400">Connected Wallets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{connectedWallets.length}</div>
              <div className="text-gray-400 text-sm mt-2">Active connections</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-4 sm:mb-6 bg-gray-800/30 p-1 rounded-lg w-full sm:w-fit overflow-x-auto">
          <Button variant="ghost" size="sm" className={`${activeView === 'wallets' ? 'bg-[#3861FB] text-white' : 'text-gray-400 hover:text-white'} flex-shrink-0`} onClick={() => setActiveView('wallets')}>
            <Wallet className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline ml-2">Wallets</span>
          </Button>
        </div>

        {activeView === 'wallets' && (
          <div className="space-y-6">
            {/* Connected Wallets Section */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Wallet className="h-5 w-5 mr-2" />
                    Connected Wallets
                  </CardTitle>
                  <Button onClick={() => setShowAddWallet(true)} size="sm" className="bg-[#3861FB] hover:bg-[#2851FB] text-white">
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
                    <Button onClick={() => setShowAddWallet(true)} className="bg-[#3861FB] hover:bg-[#2851FB] text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Connect Your First Wallet
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {connectedWallets.map((wallet) => (
                      <div key={wallet.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700 group transition-shadow hover:shadow-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-2xl shadow-inner">{wallet.icon || '🔗'}</div>
                          <div>
                            <div className="text-white font-semibold flex items-center space-x-2">
                              <span>{wallet.name}</span>
                              {/* Quick action: view on explorer */}
                              {wallet.address && (
                                <a
                                  href={`https://etherscan.io/address/${wallet.address}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="View on Explorer"
                                  className="ml-1 text-blue-400 hover:underline text-xs"
                                >
                                  Explorer
                                </a>
                              )}
                            </div>
                            <div className="text-gray-400 text-sm flex items-center space-x-2">
                              <span>{wallet.address}</span>
                              <button
                                onClick={() => copyAddress(wallet.address)}
                                className="text-gray-500 hover:text-gray-300 transition-colors"
                                title="Copy Address"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="text-gray-500 text-xs">Last sync: {wallet.lastSync}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            {wallet.balances?.map((b, i) => (
                              <div key={i} className="text-white font-semibold flex items-center space-x-1">
                                <span>{formatNumber(b.balance, 4)}</span>
                                <span>{b.symbol}</span>
                              </div>
                            ))}
                            <div className="flex items-center text-sm mt-1">
                              <div className={`w-2 h-2 rounded-full mr-2 ${wallet.status === 'connected' ? 'bg-green-500' : wallet.status === 'syncing' ? 'bg-yellow-500' : 'bg-red-500'}`} title={wallet.status === 'connected' ? 'Connected' : wallet.status === 'syncing' ? 'Syncing' : 'Error'} />
                              <span className={wallet.status === 'connected' ? 'text-green-400' : wallet.status === 'syncing' ? 'text-yellow-400' : 'text-red-400'}>{wallet.status}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => refreshWallet(wallet.id)} className="text-gray-400 hover:text-white" title="Refresh Wallet"><RefreshCw className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => disconnectWallet(wallet.id)} className="text-red-400 hover:text-red-300" title="Remove Wallet"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Why Connect External Wallets Section */}
            <div className="mt-8">
              <h2 className="text-white text-xl font-bold mb-6">Why Connect External Wallets?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center bg-gray-800/60 rounded-lg p-6 border border-gray-700">
                  <BarChart3 className="h-10 w-10 text-blue-400 mb-3" />
                  <div className="text-white font-semibold text-lg mb-1">Complete Portfolio View</div>
                  <div className="text-gray-400 text-center text-sm">Track all your crypto assets across multiple wallets and exchanges in one place.</div>
                </div>
                <div className="flex flex-col items-center bg-gray-800/60 rounded-lg p-6 border border-gray-700">
                  <Bell className="h-10 w-10 text-green-400 mb-3" />
                  <div className="text-white font-semibold text-lg mb-1">Smart Alerts</div>
                  <div className="text-gray-400 text-center text-sm">Set alerts based on your total portfolio value across all connected wallets.</div>
                </div>
                <div className="flex flex-col items-center bg-gray-800/60 rounded-lg p-6 border border-gray-700">
                  <Shield className="h-10 w-10 text-red-400 mb-3" />
                  <div className="text-white font-semibold text-lg mb-1">Secure & Private</div>
                  <div className="text-gray-400 text-center text-sm">Read-only access ensures your funds stay secure. We never store private keys.</div>
                </div>
              </div>
            </div>

            {/* Add Wallet Modal */}
            {showAddWallet && (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Connect External Wallet</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setShowAddWallet(false)} className="text-gray-400 hover:text-white">✕</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white font-medium mb-4">Choose Wallet Type</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {supportedWallets.map((w) => (
                          <button key={w.id} onClick={() => setSelectedWalletType(w.id)} className={`p-4 rounded-lg border text-left transition-all hover:scale-105 ${selectedWalletType === w.id ? 'border-[#3861FB] bg-[#3861FB]/10' : 'border-gray-600 bg-gray-900/50 hover:border-gray-500'}`}>
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="text-2xl">{w.icon}</div>
                              <div>
                                <div className="text-white font-semibold">{w.name}</div>
                                <div className="text-xs rounded px-2 py-0.5" style={{ backgroundColor: `${w.color || '#444'}20`, color: w.color || '#888' }}>{w.type}</div>
                              </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-2">{w.description}</p>
                            <div className="flex flex-wrap gap-1">{w.networks?.map((n) => <div key={n} className="bg-gray-700 text-gray-300 text-xs rounded px-2 py-0.5">{n}</div>)}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedWalletType && (
                      <div className="space-y-4">
                        <div className="border-t border-gray-700 pt-4">
                          <h4 className="text-white font-medium mb-3">Connection Details</h4>
                          {selectedWalletType === 'binance' && (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">API Key</label>
                                <input type="text" placeholder="Enter your Binance API key" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Secret Key</label>
                                <input type="password" placeholder="Enter your Binance secret key" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]" />
                              </div>
                            </div>
                          )}
                          {selectedWalletType === 'phantom' && (
                            <div className="space-y-3">
                              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                <div className="flex items-start space-x-2">
                                  <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5" />
                                  <div>
                                    <p className="text-blue-200 text-sm font-medium">Browser Extension Required</p>
                                    <p className="text-blue-300 text-xs">Make sure Phantom is installed in your browser.</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button onClick={() => connectWallet(selectedWalletType)} className="bg-[#16C784] hover:bg-[#14B575] text-white"><Link2 className="h-4 w-4 mr-2" />Connect Wallet</Button>
                          <Button variant="outline" onClick={() => { setShowAddWallet(false); setSelectedWalletType(''); }} className="border-gray-600 text-gray-300 hover:bg-gray-700">Cancel</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
