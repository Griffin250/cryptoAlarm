import React from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { Bell, TrendingUp, ArrowRight, User, Settings } from 'lucide-react'

const Dashboard: React.FC = () => {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A] flex items-center justify-center">
        <Card className="bg-gray-900/50 border-gray-700 p-8">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl mb-4">
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-300">
              Please sign in to access your dashboard and manage your crypto alerts.
            </p>
            <Link to="/">
              <Button className="bg-[#3861FB] hover:bg-[#2851FB] text-white">
                Go to Home Page
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-[#0B1426]/80 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-br from-[#3861FB] to-[#4F46E5] p-2 rounded-xl">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CryptoAlarm</h1>
                <p className="text-xs text-gray-400">Dashboard</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.email}!
          </h1>
          <p className="text-gray-300">
            Monitor your crypto portfolio and manage your alerts from this dashboard.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Alerts</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
                <Bell className="h-8 w-8 text-[#3861FB]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Portfolio Value</p>
                  <p className="text-2xl font-bold text-white">$0.00</p>
                </div>
                <TrendingUp className="h-8 w-8 text-[#16C784]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">24h Change</p>
                  <p className="text-2xl font-bold text-green-400">+0.00%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-[#16C784]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Create Your First Alert</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Set up price alerts for your favorite cryptocurrencies and get notified instantly when targets are reached.
              </p>
              <Button className="bg-[#3861FB] hover:bg-[#2851FB] text-white w-full">
                Create Alert
                <Bell className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Add Portfolio Holdings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Track your crypto investments and monitor their performance in real-time.
              </p>
              <Button variant="outline" className="border-[#16C784] text-[#16C784] hover:bg-[#16C784] hover:text-white w-full">
                Add Holdings
                <TrendingUp className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-400">No recent activity yet.</p>
              <p className="text-gray-500 text-sm mt-2">
                Start by creating your first alert or adding portfolio holdings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard