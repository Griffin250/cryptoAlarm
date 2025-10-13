'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Zap, Bot, TrendingUp, Search, Briefcase, Brain, Star, Clock, Users, Shield, Rocket, ChevronRight, Sparkles, Target, BarChart3, Globe } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import Link from 'next/link';

export default function ComingSoonPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const upcomingFeatures = [
    {
      id: 1,
      name: "Why Is It Moving?",
      tagline: "AI-Powered Market Intelligence",
      iconName: "Zap",
      description: "Get instant, AI-driven explanations for every crypto price movement in real-time.",
      longDescription: "Our advanced AI system monitors thousands of data sources including news, social media, whale movements, technical indicators, and market sentiment to provide you with instant explanations of why any cryptocurrency is moving. No more guessing – know exactly what's driving the market.",
      benefits: [
        "Real-time analysis of price movements",
        "AI-powered news sentiment analysis", 
        "Social media trend detection",
        "Whale wallet monitoring",
        "Technical pattern recognition"
      ],
      howItWorks: "Our AI continuously scans news feeds, social platforms, blockchain data, and technical indicators. When a significant price movement occurs, it correlates multiple data points to provide you with a comprehensive explanation within seconds.",
      releaseDate: "Q1 2026",
      gradient: "from-yellow-400 via-orange-500 to-red-500",
      bgPattern: "⚡"
    },
    {
      id: 2,
      name: "AI Trading Agents",
      tagline: "Autonomous Trading Revolution",
      iconName: "Bot",
      description: "Deploy intelligent trading bots that learn, adapt, and execute trades based on your strategy.",
      longDescription: "Create and deploy sophisticated AI trading agents that continuously learn from market patterns, your preferences, and successful strategies. These agents operate 24/7, making split-second decisions while adhering to your risk parameters and investment goals.",
      benefits: [
        "24/7 automated trading execution",
        "Machine learning strategy optimization",
        "Risk management protocols",
        "Multi-exchange integration",
        "Backtesting and simulation tools"
      ],
      howItWorks: "You define your trading strategy, risk tolerance, and goals. Our AI agents then execute trades automatically, learning from each transaction to improve performance over time. All trades are transparent and can be monitored in real-time.",
      releaseDate: "Q2 2026",
      gradient: "from-blue-400 via-purple-500 to-indigo-600",
      bgPattern: "🤖"
    },
    {
      id: 3,
      name: "Technical Analyzer Pro",
      tagline: "Advanced Chart Intelligence",
      iconName: "BarChart3",
      description: "Professional-grade technical analysis with AI-enhanced pattern recognition and predictions.",
      longDescription: "Access institutional-level technical analysis tools powered by AI. Our system identifies complex chart patterns, support/resistance levels, and provides probabilistic forecasts based on historical data and current market conditions.",
      benefits: [
        "Advanced pattern recognition",
        "AI-powered price predictions",
        "Multi-timeframe analysis",
        "Custom indicator creation",
        "Professional charting tools"
      ],
      howItWorks: "Our AI analyzes price charts across multiple timeframes, identifying patterns invisible to the human eye. It combines traditional technical indicators with machine learning models to provide accurate signals and probability-based predictions.",
      releaseDate: "Q3 2026",
      gradient: "from-green-400 via-emerald-500 to-teal-600",
      bgPattern: "📊"
    },
    {
      id: 4,
      name: "Fundamental Scanner",
      tagline: "Deep Value Discovery Engine",
      iconName: "Search",
      description: "Comprehensive fundamental analysis engine that uncovers hidden gems and red flags.",
      longDescription: "Dive deep into the fundamentals of any cryptocurrency project. Our scanner analyzes tokenomics, team credentials, partnerships, development activity, community engagement, and financial metrics to provide comprehensive investment insights.",
      benefits: [
        "Tokenomics analysis and scoring",
        "Team and partnership verification",
        "GitHub development tracking",
        "Community sentiment analysis",
        "Risk assessment algorithms"
      ],
      howItWorks: "Our engine continuously monitors project fundamentals, GitHub repositories, social channels, and partnership announcements. It scores projects based on multiple criteria and alerts you to significant changes in fundamental health.",
      releaseDate: "Q4 2026",
      gradient: "from-purple-400 via-pink-500 to-rose-600",
      bgPattern: "🔍"
    },
    {
      id: 5,
      name: "Portfolio Optimizer",
      tagline: "AI-Driven Asset Allocation",
      iconName: "Briefcase",
      description: "Optimize your portfolio allocation using advanced AI algorithms and risk management.",
      longDescription: "Maximize returns while minimizing risk with our AI-powered portfolio optimization engine. It considers your risk tolerance, investment goals, market conditions, and correlation patterns to suggest optimal asset allocation strategies.",
      benefits: [
        "Risk-adjusted return optimization",
        "Dynamic rebalancing alerts",
        "Correlation analysis",
        "Diversification scoring",
        "Tax-loss harvesting suggestions"
      ],
      howItWorks: "Input your current portfolio and investment parameters. Our AI analyzes thousands of allocation scenarios, considering risk metrics, historical performance, and market correlations to recommend optimal portfolio adjustments.",
      releaseDate: "Q1 2027",
      gradient: "from-orange-400 via-amber-500 to-yellow-600",
      bgPattern: "💼"
    },
    {
      id: 6,
      name: "Market Sentiment AI",
      tagline: "Emotion-Driven Market Intelligence",
      iconName: "Brain",
      description: "Advanced sentiment analysis across social media, news, and market data for trading insights.",
      longDescription: "Harness the power of crowd psychology with our advanced sentiment analysis engine. We process millions of social media posts, news articles, and market indicators to gauge market emotion and predict sentiment-driven price movements.",
      benefits: [
        "Real-time sentiment scoring",
        "Social media trend analysis",
        "News sentiment correlation",
        "Fear & Greed index tracking",
        "Contrarian signal detection"
      ],
      howItWorks: "Our AI processes text from Twitter, Reddit, Telegram, news outlets, and trading forums using natural language processing to determine market sentiment. It identifies sentiment shifts before they reflect in price movements.",
      releaseDate: "Q2 2027",
      gradient: "from-pink-400 via-rose-500 to-red-600",
      bgPattern: "🧠"
    }
  ];

  const stats = [
    { label: "Features in Development", value: "6", iconName: "Rocket" },
    { label: "Expected Beta Users", value: "10K+", iconName: "Users" },
    { label: "AI Models Training", value: "50+", iconName: "Brain" },
    { label: "Data Sources", value: "1000+", iconName: "Globe" }
  ];

  // Track mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-rotate active feature every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % upcomingFeatures.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [upcomingFeatures.length]);

  // Icon renderer function
  const renderIcon = (iconName, className, colorClass) => {
    const iconColor = colorClass || getIconColor(iconName);
    const fullClassName = `${className} ${iconColor}`;
    const icons = {
      Zap: <Zap className={fullClassName} />,
      Bot: <Bot className={fullClassName} />,
      BarChart3: <BarChart3 className={fullClassName} />,
      Search: <Search className={fullClassName} />,
      Briefcase: <Briefcase className={fullClassName} />,
      Brain: <Brain className={fullClassName} />,
      Rocket: <Rocket className={fullClassName} />,
      Users: <Users className={fullClassName} />,
      Globe: <Globe className={fullClassName} />
    };
    return icons[iconName] || <Zap className={fullClassName} />;
  };

  const getIconColor = (iconName) => {
    const colors = {
      Zap: "text-yellow-400",
      Bot: "text-blue-400",
      BarChart3: "text-green-400",
      Search: "text-purple-400",
      Briefcase: "text-orange-400",
      Brain: "text-pink-400",
      Rocket: "text-red-400",
      Users: "text-cyan-400",
      Globe: "text-indigo-400"
    };
    return colors[iconName] || "text-white";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Mouse Follower Effect */}
      <div 
        className="absolute pointer-events-none z-10"
        style={{
          left: mousePosition.x - 100,
          top: mousePosition.y - 100,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="w-48 h-48 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-20 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-white hover:text-purple-300 hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full border border-purple-500/30 mb-6">
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              <span className="text-purple-300 font-medium">Coming Soon</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6 animate-in slide-in-from-bottom-4 duration-1000">
              The Future of Crypto
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-in slide-in-from-bottom-4 duration-1000 delay-200">
              Revolutionary AI-powered features that will transform how you trade, analyze, and understand cryptocurrency markets.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 animate-in zoom-in-50 delay-300" style={{ animationDelay: `${300 + index * 100}ms` }}>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2 text-purple-400">
                    {renderIcon(stat.iconName, "w-5 h-5", "text-purple-400")}
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Feature Navigation Dots */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {upcomingFeatures.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeFeature === index 
                    ? 'bg-purple-400 scale-125' 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {upcomingFeatures.map((feature, index) => (
            <Card 
              key={feature.id}
              className={`group relative overflow-hidden bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 cursor-pointer animate-in slide-in-from-bottom-4 delay-${index * 100 + 500} ${
                activeFeature === index ? 'ring-2 ring-purple-500/50 scale-105' : ''
              }`}
              onClick={() => setActiveFeature(index)}
              onMouseEnter={() => setActiveFeature(index)}
            >
              {/* Background Pattern */}
              <div className="absolute top-4 right-4 text-6xl opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                {feature.bgPattern}
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300 animate-float`} style={{animationDelay: `${index * 0.5}s`}}>
                    {renderIcon(feature.iconName, "w-8 h-8")}
                  </div>
                  <Badge variant="outline" className="border-purple-500/50 text-purple-300 group-hover:border-purple-400 group-hover:text-purple-200 transition-colors">
                    {feature.releaseDate}
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold text-white group-hover:text-purple-200 transition-colors">
                  {feature.name}
                </CardTitle>
                <CardDescription className="text-lg font-medium text-purple-300">
                  {feature.tagline}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>

                {activeFeature === index && (
                  <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-purple-400" />
                        How It Works
                      </h4>
                      <p className="text-gray-300 leading-relaxed">
                        {feature.howItWorks}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <Star className="w-5 h-5 mr-2 text-yellow-400" />
                        Key Benefits
                      </h4>
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center text-gray-300">
                            <ChevronRight className="w-4 h-4 mr-2 text-green-400" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">
                        {feature.longDescription}
                      </h4>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-3xl p-8 md:p-12 border border-purple-500/30 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Be Among the First to Experience the Future
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Join our exclusive waitlist to get early access to these revolutionary features. 
              Be part of the next generation of crypto trading and analysis tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group animate-gradient"
              >
                <Clock className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Join Waitlist
                <Sparkles className="w-4 h-4 ml-2 group-hover:animate-spin" />
              </Button>
              
              <Link href="/dashboard">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 hover:scale-105 px-8 py-3 rounded-xl font-semibold transition-all duration-300 group"
                >
                  Try Current Features
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center mt-8 text-sm text-gray-400">
              <Shield className="w-4 h-4 mr-2" />
              No spam, unsubscribe anytime. Your data is secure.
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        
        .animate-gradient {
          animation: gradientMove 3s ease-in-out infinite;
          background-size: 200% 200%;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes gradientMove {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}