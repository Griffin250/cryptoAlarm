"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import Link from "next/link";
import { 
  User, Bell, Settings, Crown, Calendar, Phone, Mail, 
  MapPin, Globe, Shield, CreditCard, Award, Activity,
  CheckCircle, AlertTriangle, Star, TrendingUp, Zap,
  Clock, Target, BarChart3, Upload, Camera, Edit
} from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview"); // "overview", "subscription", "activity", "achievements"
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    joinDate: "January 2024",
    timezone: "EST (UTC-5)",
    subscription: "Pro",
    subscriptionStatus: "active",
    subscriptionExpiry: "March 15, 2025",
    totalAlerts: 147,
    successfulAlerts: 138,
    alertSuccessRate: 93.9,
    totalSaved: 12847.32,
    portfolioValue: 125847.32,
    planType: "Professional",
    planPrice: "$29.99/month"
  };

  const subscriptionFeatures = [
    { name: "Voice Call Alerts", included: true, limit: "Unlimited" },
    { name: "Email Notifications", included: true, limit: "Unlimited" },
    { name: "SMS Backup", included: true, limit: "100/month" },
    { name: "Portfolio Tracking", included: true, limit: "Unlimited assets" },
    { name: "Advanced Conditions", included: false, limit: "Coming soon" },
    { name: "API Access", included: false, limit: "Coming soon" },
    { name: "Team Collaboration", included: false, limit: "Enterprise only" },
    { name: "Priority Support", included: true, limit: "24/7" }
  ];

  const recentActivity = [
    { id: 1, type: "alert", description: "BTC price alert triggered at $67,234", time: "2 hours ago", status: "success" },
    { id: 2, type: "login", description: "Logged in from Chrome (New York)", time: "1 day ago", status: "info" },
    { id: 3, type: "alert", description: "ETH alert created for $3,500 target", time: "2 days ago", status: "success" },
    { id: 4, type: "payment", description: "Monthly subscription renewed", time: "5 days ago", status: "success" },
    { id: 5, type: "settings", description: "Phone number updated", time: "1 week ago", status: "info" }
  ];

  const achievements = [
    { id: 1, name: "First Alert", description: "Created your first price alert", icon: Bell, earned: true, date: "Jan 15, 2024" },
    { id: 2, name: "Portfolio Master", description: "Added 5+ cryptocurrencies to portfolio", icon: Target, earned: true, date: "Jan 28, 2024" },
    { id: 3, name: "Alert Pro", description: "100+ successful alerts", icon: Star, earned: true, date: "Feb 20, 2024" },
    { id: 4, name: "Early Adopter", description: "Joined during beta period", icon: Crown, earned: true, date: "Jan 10, 2024" },
    { id: 5, name: "Profit Maker", description: "Made $10K+ through alerts", icon: TrendingUp, earned: false, date: null },
    { id: 6, name: "Consistency King", description: "90+ day streak of active monitoring", icon: Activity, earned: false, date: null }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-[#0B1426]/80 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side - Navigation */}
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
                <div className="bg-gradient-to-br from-[#3861FB] to-[#4F46E5] p-2 rounded-xl">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">CryptoAlarm</h1>
                  <div className="text-xs text-gray-400 flex items-center">
                    <span>User Profile</span>
                  </div>
                </div>
              </Link>

              {/* Breadcrumb */}
              <div className="flex items-center space-x-2 text-sm">
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <span className="text-gray-600">/</span>
                <span className="text-white font-medium">Profile</span>
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                size="sm" 
                className="bg-[#3861FB] hover:bg-[#2851FB] text-white"
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
              
              <div className="flex items-center space-x-2">
                <Link href="/dashboard/portfolio">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Globe className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard/settings">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Profile Header */}
        <Card className="bg-gray-800/50 border-gray-700 mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-[#3861FB] to-[#4F46E5] rounded-full flex items-center justify-center text-4xl font-bold text-white">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-[#16C784] p-2 rounded-full text-white hover:bg-[#14B575] transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{userData.name}</h1>
                    <div className="flex items-center justify-center md:justify-start space-x-4 text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{userData.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{userData.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    <Badge className="bg-[#16C784]/20 text-[#16C784] border-[#16C784]/30 text-lg px-4 py-2">
                      <Crown className="h-4 w-4 mr-2" />
                      {userData.subscription} Member
                    </Badge>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center md:text-left">
                    <div className="text-2xl font-bold text-white">{userData.totalAlerts}</div>
                    <div className="text-gray-400 text-sm">Total Alerts</div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="text-2xl font-bold text-green-500">{userData.alertSuccessRate}%</div>
                    <div className="text-gray-400 text-sm">Success Rate</div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="text-2xl font-bold text-[#3861FB]">${userData.totalSaved.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">Profits Saved</div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="text-2xl font-bold text-white">{userData.joinDate}</div>
                    <div className="text-gray-400 text-sm">Member Since</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 mb-6 bg-gray-800/30 p-1 rounded-lg w-fit">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${activeTab === "overview" ? "bg-[#3861FB] text-white" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("overview")}
          >
            <User className="h-4 w-4 mr-2" />
            Overview
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${activeTab === "subscription" ? "bg-[#3861FB] text-white" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("subscription")}
          >
            <Crown className="h-4 w-4 mr-2" />
            Subscription
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${activeTab === "activity" ? "bg-[#3861FB] text-white" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("activity")}
          >
            <Activity className="h-4 w-4 mr-2" />
            Activity
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${activeTab === "achievements" ? "bg-[#3861FB] text-white" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("achievements")}
          >
            <Award className="h-4 w-4 mr-2" />
            Achievements
          </Button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        defaultValue={userData.name}
                        disabled={!isEditing}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB] disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                      <input
                        type="email"
                        defaultValue={userData.email}
                        disabled={!isEditing}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB] disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                      <input
                        type="tel"
                        defaultValue={userData.phone}
                        disabled={!isEditing}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB] disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                      <input
                        type="text"
                        defaultValue={userData.location}
                        disabled={!isEditing}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB] disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Timezone</label>
                      <select
                        defaultValue={userData.timezone}
                        disabled={!isEditing}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB] disabled:opacity-50"
                      >
                        <option value="EST">EST (UTC-5)</option>
                        <option value="PST">PST (UTC-8)</option>
                        <option value="UTC">UTC</option>
                        <option value="GMT">GMT</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Statistics */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Account Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                      <Bell className="h-8 w-8 text-[#3861FB] mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{userData.totalAlerts}</div>
                      <div className="text-gray-400 text-sm">Total Alerts</div>
                    </div>
                    <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                      <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-500">{userData.successfulAlerts}</div>
                      <div className="text-gray-400 text-sm">Successful</div>
                    </div>
                    <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-[#16C784] mx-auto mb-2" />
                      <div className="text-2xl font-bold text-[#16C784]">{userData.alertSuccessRate}%</div>
                      <div className="text-gray-400 text-sm">Success Rate</div>
                    </div>
                    <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                      <BarChart3 className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-400">${userData.portfolioValue.toLocaleString()}</div>
                      <div className="text-gray-400 text-sm">Portfolio Value</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === "subscription" && (
            <div className="space-y-6">
              {/* Current Plan */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Crown className="h-5 w-5 mr-2" />
                    Current Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{userData.planType} Plan</h3>
                      <p className="text-gray-400">{userData.planPrice}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                        <span className="text-gray-400 text-sm">Expires: {userData.subscriptionExpiry}</span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Button className="bg-[#3861FB] hover:bg-[#2851FB] text-white mr-2">
                        Upgrade Plan
                      </Button>
                      <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        Manage Billing
                      </Button>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    <h4 className="text-white font-medium mb-3">Plan Features</h4>
                    {subscriptionFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {feature.included ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-gray-500" />
                          )}
                          <span className={feature.included ? "text-white" : "text-gray-500"}>
                            {feature.name}
                          </span>
                        </div>
                        <span className="text-gray-400 text-sm">{feature.limit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Billing History */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Billing History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { date: "Jan 15, 2025", amount: "$29.99", status: "Paid", method: "•••• 4242" },
                      { date: "Dec 15, 2024", amount: "$29.99", status: "Paid", method: "•••• 4242" },
                      { date: "Nov 15, 2024", amount: "$29.99", status: "Paid", method: "•••• 4242" },
                    ].map((invoice, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                        <div>
                          <div className="text-white font-medium">{invoice.date}</div>
                          <div className="text-gray-400 text-sm">Professional Plan • {invoice.method}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">{invoice.amount}</div>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-900/50 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500/20' :
                        activity.status === 'warning' ? 'bg-yellow-500/20' :
                        activity.status === 'error' ? 'bg-red-500/20' : 'bg-blue-500/20'
                      }`}>
                        {activity.type === 'alert' && <Bell className="h-4 w-4 text-green-400" />}
                        {activity.type === 'login' && <Shield className="h-4 w-4 text-blue-400" />}
                        {activity.type === 'payment' && <CreditCard className="h-4 w-4 text-green-400" />}
                        {activity.type === 'settings' && <Settings className="h-4 w-4 text-blue-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-white">{activity.description}</div>
                        <div className="text-gray-400 text-sm flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => {
                const IconComponent = achievement.icon;
                return (
                  <Card key={achievement.id} className={`border ${
                    achievement.earned 
                      ? "bg-gray-800/50 border-[#16C784]/30" 
                      : "bg-gray-800/30 border-gray-700"
                  }`}>
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                        achievement.earned 
                          ? "bg-[#16C784]/20 text-[#16C784]" 
                          : "bg-gray-700 text-gray-500"
                      }`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <h3 className={`font-bold mb-2 ${
                        achievement.earned ? "text-white" : "text-gray-400"
                      }`}>
                        {achievement.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">
                        {achievement.description}
                      </p>
                      {achievement.earned ? (
                        <Badge className="bg-[#16C784]/20 text-[#16C784] border-[#16C784]/30">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Earned {achievement.date}
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-700/50 text-gray-400 border-gray-600">
                          Not Earned Yet
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}