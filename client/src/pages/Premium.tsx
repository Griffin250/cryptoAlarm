import React from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import ResponsiveNavbar from '../components/ResponsiveNavbar'
import { Link } from 'react-router-dom'
import { 
  Crown, CheckCircle, X, Shield, Star, 
  Bell, BarChart3, Phone, Globe
} from 'lucide-react'

const PremiumPage: React.FC = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with crypto alerts",
      features: [
        "5 Active alerts",
        "Email notifications", 
        "Basic portfolio tracking",
        "Community support",
        "Mobile app access"
      ],
      limitations: [
        "No voice call alerts",
        "Limited crypto support",
        "Basic analytics",
        "No advanced features"
      ],
      buttonText: "Current Plan",
      buttonClass: "bg-gray-600 text-white cursor-not-allowed",
      popular: false
    },
    {
      name: "Pro", 
      price: "$9.99",
      period: "month",
      description: "Advanced features for serious crypto traders",
      features: [
        "Unlimited alerts",
        "Voice call notifications",
        "Advanced portfolio analytics", 
        "Priority support",
        "All crypto pairs",
        "Price movement analysis",
        "Custom alert conditions",
        "Export data & reports"
      ],
      limitations: [],
      buttonText: "Upgrade to Pro",
      buttonClass: "bg-[#3861FB] hover:bg-[#2851FB] text-white",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$49.99", 
      period: "month",
      description: "Professional tools for trading teams and institutions",
      features: [
        "Everything in Pro",
        "Team management",
        "API access",
        "White-label solution",
        "Dedicated account manager", 
        "Custom integrations",
        "Advanced security features",
        "24/7 phone support",
        "Custom alert logic",
        "Institutional-grade infrastructure"
      ],
      limitations: [],
      buttonText: "Contact Sales",
      buttonClass: "bg-[#16C784] hover:bg-[#16C784]/80 text-white",
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      <ResponsiveNavbar 
        title="Premium Plans" 
        subtitle="Upgrade your crypto trading experience" 
        showBackButton={true}
        backUrl="/"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <Badge className="bg-gradient-to-r from-[#16C784] to-[#3861FB] text-white px-4 py-2 text-lg">
              <Crown className="h-4 w-4 mr-2" />
              Premium Features
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Supercharge Your
              <br />
              <span className="bg-gradient-to-r from-[#16C784] to-[#3861FB] bg-clip-text text-transparent">
                Crypto Trading
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Unlock professional-grade features, unlimited alerts, and advanced analytics 
              to stay ahead in the crypto market.
            </p>
          </div>

          {/* Pricing Plans */}
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative bg-gray-900/50 border-gray-700 hover:bg-gray-900/70 transition-all duration-300 ${
                plan.popular ? 'border-[#3861FB] scale-105' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#3861FB] text-white px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl text-white mb-2">{plan.name}</CardTitle>
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400 ml-2">/{plan.period}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{plan.description}</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="text-white font-semibold">What's included:</h4>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-[#16C784] flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-gray-400 font-semibold text-sm">Limitations:</h4>
                      {plan.limitations.map((limitation, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <X className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-400 text-sm">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button className={`w-full ${plan.buttonClass} mt-6`}>
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Comparison */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Why Upgrade to Premium?</h2>
              <p className="text-gray-300">
                Get access to professional features that give you an edge in crypto trading
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Phone className="h-12 w-12 text-[#3861FB] mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Voice Call Alerts</h3>
                  <p className="text-gray-400 text-sm">Get instant phone calls when your price targets are reached</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-12 w-12 text-[#16C784] mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Advanced Analytics</h3>
                  <p className="text-gray-400 text-sm">Professional portfolio analytics and performance tracking</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Bell className="h-12 w-12 text-[#EA3943] mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Unlimited Alerts</h3>
                  <p className="text-gray-400 text-sm">Set as many price alerts as you need across all crypto pairs</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Priority Support</h3>
                  <p className="text-gray-400 text-sm">Get priority customer support and dedicated assistance</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl text-center">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-white font-semibold mb-2">Can I cancel anytime?</h4>
                  <p className="text-gray-300 text-sm">Yes, you can cancel your subscription at any time. No long-term contracts or hidden fees.</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Do you offer refunds?</h4>
                  <p className="text-gray-300 text-sm">We offer a 7-day money-back guarantee for all premium plans. Try risk-free!</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">How do voice alerts work?</h4>
                  <p className="text-gray-300 text-sm">We use professional telephony services to call your phone instantly when alerts trigger. Works worldwide.</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Is my data secure?</h4>
                  <p className="text-gray-300 text-sm">Yes, we use enterprise-grade security and encryption. Your data is never shared with third parties.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-white">
              Ready to Upgrade?
            </h2>
            <p className="text-gray-300 mb-8">
              Join thousands of traders who trust CryptoAlarm for professional crypto monitoring.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#3861FB] hover:bg-[#2851FB] text-white px-8 py-4">
                <Crown className="h-5 w-5 mr-2" />
                Start Free Trial
              </Button>
              <Link to="/coming-soon">
                <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4">
                  <Globe className="h-5 w-5 mr-2" />
                  View Roadmap
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PremiumPage