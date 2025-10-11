"use client"
import React from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import Link from 'next/link'
import { 
  AlertTriangle, Home, ArrowLeft, Bell, Search, 
  TrendingUp, Zap, RefreshCw, ChevronRight
} from 'lucide-react'

const NotFound = () => {
  const suggestions = [
    {
      icon: <Home className="h-5 w-5" />,
      title: "Go Home",
      description: "Return to the main CryptoAlarm landing page",
      href: "/",
      color: "text-[#3861FB]"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Launch Dashboard",
      description: "Access the crypto monitoring dashboard",
      href: "/dashboard",
      color: "text-[#16C784]"
    },
    {
      icon: <Bell className="h-5 w-5" />,
      title: "Set Up Alerts",
      description: "Configure price alerts for your crypto portfolio",
      href: "/dashboard",
      color: "text-[#EA3943]"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#3861FB] rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-[#16C784] rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-[#EA3943] rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 backdrop-blur-lg bg-[#0B1426]/80 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="bg-gradient-to-br from-[#3861FB] to-[#4F46E5] p-2 rounded-xl">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CryptoAlarm</h1>
                <p className="text-xs text-gray-400">Never Miss a Move</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* 404 Animation */}
          <div className="mb-12">
            <div className="relative inline-block">
              <div className="text-9xl sm:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3861FB] to-[#16C784] animate-shimmer">
                404
              </div>
              <div className="absolute inset-0 text-9xl sm:text-[12rem] font-bold text-[#3861FB]/20 animate-pulse">
                404
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-16 space-y-6">
            <div className="flex justify-center mb-6">
              <div className="bg-[#EA3943]/20 p-4 rounded-full animate-bounce">
                <AlertTriangle className="h-12 w-12 text-[#EA3943]" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Page Not Found
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Oops! The crypto price you&apos;re looking for seems to have moved. 
              Don&apos;t worry, we&apos;ll help you get back on track with your monitoring.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            {suggestions.map((suggestion, index) => (
              <Link key={index} href={suggestion.href}>
                <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 cursor-pointer group">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={`${suggestion.color} mx-auto w-12 h-12 rounded-full bg-current/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      {suggestion.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#3861FB] transition-colors">
                      {suggestion.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {suggestion.description}
                    </p>
                    <div className="flex items-center justify-center text-gray-500 group-hover:text-[#3861FB] transition-colors">
                      <span className="text-sm">Click to continue</span>
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Search Alternative */}
          <Card className="bg-gradient-to-r from-[#3861FB]/10 to-[#16C784]/10 border-[#3861FB]/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-[#3861FB]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Looking for something specific?
              </h3>
              <p className="text-gray-300 mb-6">
                Try our main dashboard to explore all available crypto monitoring features
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-[#3861FB] to-[#4F46E5] hover:from-[#2851FB] hover:to-[#3B3D94] text-white px-6 py-3">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Explore Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 px-6 py-3"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Refresh Page
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Fun Crypto Quote */}
          <div className="mt-16 p-6 rounded-xl bg-gray-900/50 border border-gray-700 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-[#F7931A]" />
            </div>
            <blockquote className="text-lg italic text-gray-300 mb-2">
              &ldquo;In crypto, the only constant is change... except for 404 errors, those are forever.&rdquo;
            </blockquote>
            <cite className="text-sm text-gray-500">— Anonymous Crypto Trader</cite>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Logo Section */}
            <Link href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity cursor-pointer group">
              <div className="bg-gradient-to-br from-[#3861FB] to-[#4F46E5] p-3 rounded-xl group-hover:scale-105 transition-transform duration-300">
                <Bell className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">CryptoAlarm</h1>
                <p className="text-sm text-gray-400">Professional Crypto Monitoring</p>
              </div>
            </Link>

            {/* Version Badge - Enhanced */}
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30 px-6 py-3 rounded-full backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#16C784] rounded-full animate-pulse"></div>
                <span className="text-[#3861FB] font-bold text-lg">v1.0.15</span>
                <div className="w-2 h-2 bg-[#16C784] rounded-full animate-pulse delay-1000"></div>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="text-center lg:text-right space-y-1">
              <div className="text-gray-400 text-base font-medium">
                © 2025 CryptoAlarm. Even our 404s are professional.
              </div>
              <div className="text-gray-500 text-sm">
                Lost? No worries - our crypto alerts will keep you on track! 📍
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default NotFound