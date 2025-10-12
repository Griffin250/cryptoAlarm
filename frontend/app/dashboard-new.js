'use client'

import { useAuth } from '../lib/AuthContext'
import { AuthForm } from '../components/AuthForm'
import AlertManagerNew from '../components/AlertManagerNew'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Bell, TrendingUp, Users, Target, LogOut, User } from 'lucide-react'

export default function Dashboard() {
  const { user, profile, signOut, loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthForm />
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Bell className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">CryptoAlarm</h1>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                v2.0
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">
                  {profile?.full_name || user?.email || 'User'}
                </span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋
              </h2>
              <p className="text-gray-600 mt-2">
                Manage your cryptocurrency alerts and stay ahead of the market.
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-4">
              <Card className="p-4 min-w-[100px]">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">BTC</p>
                    <p className="text-lg font-bold">$67,234</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 min-w-[100px]">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">ETH</p>
                    <p className="text-lg font-bold">$2,847</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="w-5 h-5 text-blue-600" />
                Smart Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Set intelligent price targets and percentage-based alerts for any cryptocurrency.
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">Real-time</Badge>
                <Badge variant="secondary" className="text-xs">Multi-condition</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Live Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Connect to Binance WebSocket for real-time price updates every second.
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">WebSocket</Badge>
                <Badge variant="secondary" className="text-xs">Low Latency</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-purple-600" />
                Multi-Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Access your alerts from any device with cloud sync and offline support.
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">Cloud Sync</Badge>
                <Badge variant="secondary" className="text-xs">PWA</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert Manager */}
        <AlertManagerNew />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; 2025 CryptoAlarm. Built with Next.js, Supabase, and ❤️</p>
            <p className="mt-1">
              Stay updated with the latest crypto trends and never miss a trading opportunity.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}