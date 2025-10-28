import React from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import StandardNavbar from '../components/StandardNavbar'
import { Link } from 'react-router-dom'
import { 
  Sparkles, ArrowRight, Star, Zap, Crown, CheckCircle, 
  BarChart3, Users, Shield, Globe, Smartphone, Bell
} from 'lucide-react'

const ComingSoonPage: React.FC = () => {
  const upcomingFeatures = [
    {
      name: "Why Is It Moving?",
      description: "AI-powered explanations for every crypto price movement with real-time market analysis and sentiment tracking.",
      icon: <BarChart3 className="h-8 w-8 text-[#3861FB]" />,
      eta: "Q1 2025",
      status: "In Development"
    },
    {
      name: "AI Trading Agents",
      description: "Intelligent automated trading bots with advanced risk management and portfolio optimization algorithms.",
      icon: <Zap className="h-8 w-8 text-[#16C784]" />,
      eta: "Q2 2025", 
      status: "Design Phase"
    },
    {
      name: "Technical Analyzer Pro",
      description: "Advanced chart pattern recognition, technical indicator analysis, and professional trading signals.",
      icon: <BarChart3 className="h-8 w-8 text-[#EA3943]" />,
      eta: "Q1 2025",
      status: "In Development"
    },
    {
      name: "Social Sentiment Engine",
      description: "Real-time social media sentiment analysis, news aggregation, and community sentiment tracking.",
      icon: <Users className="h-8 w-8 text-purple-500" />,
      eta: "Q2 2025",
      status: "Research Phase"
    },
    {
      name: "Portfolio Optimizer AI",
      description: "AI-driven portfolio rebalancing with risk assessment and automated diversification strategies.",
      icon: <Shield className="h-8 w-8 text-[#16C784]" />,
      eta: "Q3 2025",
      status: "Planning"
    },
    {
      name: "Multi-Exchange Integration",
      description: "Connect multiple exchanges, unified portfolio tracking, and cross-platform trade execution.",
      icon: <Globe className="h-8 w-8 text-[#3861FB]" />,
      eta: "Q2 2025",
      status: "Design Phase"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Development':
        return 'bg-[#16C784]/20 text-[#16C784]'
      case 'Design Phase':
        return 'bg-[#3861FB]/20 text-[#3861FB]'
      case 'Research Phase':
        return 'bg-purple-500/20 text-purple-400'
      case 'Planning':
        return 'bg-gray-500/20 text-gray-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      <StandardNavbar 
        title="Coming Soon" 
        subtitle="Future features and roadmap" 
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-lg">
                <Sparkles className="h-4 w-4 mr-2" />
                Coming Soon
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              The Future of
              <br />
              <span className="bg-gradient-to-r from-[#3861FB] to-purple-500 bg-clip-text text-transparent">
                Crypto Trading
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We're building the most advanced crypto trading platform with AI-powered insights, 
              automated strategies, and professional-grade tools. Get ready for the next evolution of crypto trading.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/alerts">
                <Button size="lg" className="bg-[#3861FB] hover:bg-[#2851FB] text-white px-8 py-4 text-lg">
                  <Crown className="h-5 w-5 mr-2" />
                  Try Current Features
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-4 text-lg"
              >
                <Bell className="h-5 w-5 mr-2" />
                Get Notified
              </Button>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Development Roadmap</h2>
              <p className="text-gray-300">
                Track our progress as we build the future of crypto trading
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingFeatures.map((feature, index) => (
                <Card key={index} className="bg-gray-900/50 border-gray-700 hover:bg-gray-900/70 transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      {feature.icon}
                      <Badge className={getStatusColor(feature.status)}>
                        {feature.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-xl">{feature.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#3861FB] font-semibold">ETA: {feature.eta}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Beta Access */}
          <Card className="bg-gradient-to-r from-[#3861FB]/20 to-purple-500/20 border-[#3861FB]/30">
            <CardContent className="p-12 text-center space-y-6">
              <Star className="h-16 w-16 text-yellow-400 mx-auto" />
              
              <h2 className="text-3xl font-bold text-white">
                Get Early Access
              </h2>
              
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Be among the first to experience these revolutionary features. 
                Join our beta program and help shape the future of crypto trading.
              </p>

              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-[#3861FB] to-purple-500 hover:from-[#2851FB] hover:to-purple-600 text-white px-8 py-4 text-lg"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Join Beta Program
                </Button>
                
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-[#16C784]" />
                    <span>Free Access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-[#16C784]" />
                    <span>Early Features</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-[#16C784]" />
                    <span>Direct Feedback</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Features */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-white">
              Available Now
            </h2>
            <p className="text-gray-300 mb-8">
              Don't wait! Start using our current professional features today.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Bell className="h-12 w-12 text-[#3861FB] mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Smart Alerts</h3>
                  <p className="text-gray-400 text-sm">Price & percentage-based alerts with voice calls</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-12 w-12 text-[#16C784] mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Portfolio Tracking</h3>
                  <p className="text-gray-400 text-sm">Real-time portfolio monitoring and performance</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Smartphone className="h-12 w-12 text-[#EA3943] mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Mobile Optimized</h3>
                  <p className="text-gray-400 text-sm">Professional mobile experience on all devices</p>
                </CardContent>
              </Card>
            </div>

            <div className="pt-8">
              <Link to="/dashboard">
                <Button size="lg" className="bg-[#16C784] hover:bg-[#16C784]/80 text-white px-8 py-4">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Explore Current Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComingSoonPage