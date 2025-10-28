import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Link } from 'react-router-dom'
import StandardNavbar from '../components/StandardNavbar'
import { 
  Crown, CheckCircle, X, Shield, Star, 
  Bell, BarChart3, Phone, Globe, Gift,
  Target, Sparkles, Check, ArrowRight
} from 'lucide-react'



const PremiumPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [showCheckout, setShowCheckout] = useState(false)

  const plans = [
    {
      id: "starter",
      name: "Starter",
      icon: <Bell className="h-8 w-8" />,
      description: "Perfect for individual traders getting started",
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      color: "#3861FB",
      popular: false,
      features: [
        "5 Active Price Alerts",
        "Voice Call Notifications", 
        "Email Alerts",
        "3 Cryptocurrencies",
        "Basic Portfolio Tracking",
        "Mobile App Access",
        "Community Support"
      ],
      limits: {
        alerts: 5,
        cryptos: 3,
        wallets: 1,
        apiCalls: "1,000/month"
      }
    },
    {
      id: "professional",
      name: "Professional",
      icon: <Target className="h-8 w-8" />,
      description: "Advanced features for serious crypto traders",
      monthlyPrice: 29.99,
      annualPrice: 299.99,
      color: "#16C784",
      popular: true,
      features: [
        "50 Active Price Alerts",
        "Voice + SMS Notifications",
        "Advanced Alert Conditions", 
        "11+ Cryptocurrencies",
        "Full Portfolio Management",
        "Multiple Wallet Connections",
        "Technical Analysis Alerts",
        "Priority Support",
        "Custom Alert Sounds"
      ],
      limits: {
        alerts: 50,
        cryptos: "11+",
        wallets: 5,
        apiCalls: "10,000/month"
      }
    },
    {
      id: "enterprise",
      name: "Enterprise",
      icon: <Crown className="h-8 w-8" />,
      description: "Comprehensive solution for trading teams",
      monthlyPrice: 99.99,
      annualPrice: 999.99,
      color: "#EA3943",
      popular: false,
      features: [
        "Unlimited Price Alerts",
        "Multi-Channel Notifications",
        "Team Collaboration Tools",
        "All Cryptocurrencies",
        "Advanced Analytics",
        "Unlimited Wallet Connections",
        "Custom API Integration",
        "Dedicated Account Manager",
        "White-label Options",
        "SLA Guarantee"
      ],
      limits: {
        alerts: "Unlimited",
        cryptos: "All",
        wallets: "Unlimited",
        apiCalls: "Unlimited"
      }
    },
    {
      id: "institutional",
      name: "Institutional",
      icon: <Shield className="h-8 w-8" />,
      description: "Enterprise-grade solution for institutions",
      monthlyPrice: 499.99,
      annualPrice: 4999.99,
      color: "#8B5CF6",
      popular: false,
      features: [
        "Everything in Enterprise",
        "Institutional-grade Security",
        "Compliance & Reporting",
        "Multi-tenant Architecture",
        "Custom Integrations",
        "On-premise Deployment",
        "24/7 Dedicated Support", 
        "Risk Management Tools",
        "Audit Trail & Logging",
        "Custom SLA Terms"
      ],
      limits: {
        alerts: "Unlimited",
        cryptos: "All + DeFi",
        wallets: "Enterprise",
        apiCalls: "Enterprise"
      }
    }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const handleStartFreeTrial = (plan: any) => {
    setSelectedPlan(plan);
    // Mock free trial start
    alert(`Starting 15-day free trial for ${plan.name} plan! You'll receive a confirmation email shortly.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      <StandardNavbar 
        title="CryptoPass Premium" 
        subtitle="Unlock advanced crypto alert features" 
      />

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <Badge className="bg-[#16C784]/20 text-[#16C784] border-[#16C784]/30 mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              Premium Plans Available
            </Badge>
            <h1 className="text-5xl font-bold text-white mb-6">
              Choose Your Perfect Plan
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Unlock the full potential of crypto trading with our premium features. 
              From individual traders to large institutions, we have the perfect solution for you.
            </p>
          </div>

          {/* Free Trial Banner */}
          <div className="bg-gradient-to-r from-[#16C784]/20 to-[#3861FB]/20 border border-[#16C784]/30 rounded-2xl p-6 mb-12 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-4">
              <Gift className="h-8 w-8 text-[#16C784]" />
              <div>
                <h3 className="text-2xl font-bold text-white">15-Day Free Trial</h3>
                <p className="text-gray-300">Try any premium plan risk-free. No credit card required to start.</p>
              </div>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-lg ${!isAnnual ? 'text-white font-semibold' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                isAnnual ? "bg-[#16C784]" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isAnnual ? "translate-x-9" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-lg ${isAnnual ? 'text-white font-semibold' : 'text-gray-400'}`}>
              Annual
            </span>
            {isAnnual && (
              <Badge className="bg-[#EA3943]/20 text-[#EA3943] border-[#EA3943]/30 ml-2">
                Save 17%
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative bg-gray-800/50 border-gray-700 hover:scale-105 transition-all duration-300 ${
                  plan.popular ? 'ring-2 ring-[#16C784] shadow-xl shadow-[#16C784]/20' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#16C784] text-white px-4 py-1 text-sm font-semibold">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div 
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: `${plan.color}20`, color: plan.color }}
                  >
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                  
                  <div className="mt-6">
                    <div className="text-4xl font-bold text-white">
                      {formatCurrency(isAnnual ? plan.annualPrice / 12 : plan.monthlyPrice)}
                      <span className="text-lg text-gray-400">/month</span>
                    </div>
                    {isAnnual && (
                      <div className="text-sm text-gray-500">
                        Billed annually ({formatCurrency(plan.annualPrice)})
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features List */}
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-[#16C784] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Usage Limits */}
                  <div className="border-t border-gray-700 pt-4 space-y-2">
                    <h4 className="text-white font-medium text-sm mb-2">Usage Limits</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-gray-400">Alerts: <span className="text-white">{plan.limits.alerts}</span></div>
                      <div className="text-gray-400">Cryptos: <span className="text-white">{plan.limits.cryptos}</span></div>
                      <div className="text-gray-400">Wallets: <span className="text-white">{plan.limits.wallets}</span></div>
                      <div className="text-gray-400">API: <span className="text-white">{plan.limits.apiCalls}</span></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    <Button 
                      onClick={() => handleStartFreeTrial(plan)}
                      className="w-full bg-gradient-to-r from-[#16C784] to-[#14B575] hover:from-[#14B575] hover:to-[#12A368] text-white"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Start Free Trial
                    </Button>
                    <Button 
                      onClick={() => handlePlanSelect(plan)}
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                      style={{ borderColor: plan.color, color: plan.color }}
                    >
                      Choose {plan.name}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison Table */}
      <section className="py-20 bg-gray-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Compare All Features</h2>
            <p className="text-xl text-gray-300">See what's included in each plan</p>
          </div>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-6 text-white font-semibold">Features</th>
                      {plans.map(plan => (
                        <th key={plan.id} className="text-center p-6 text-white font-semibold min-w-[150px]">
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: "Price Alerts", values: ["5", "50", "Unlimited", "Unlimited"] },
                      { feature: "Voice Calls", values: ["✓", "✓", "✓", "✓"] },
                      { feature: "SMS Notifications", values: ["✗", "✓", "✓", "✓"] },
                      { feature: "Email Alerts", values: ["✓", "✓", "✓", "✓"] },
                      { feature: "Portfolio Tracking", values: ["Basic", "Full", "Advanced", "Enterprise"] },
                      { feature: "Wallet Connections", values: ["1", "5", "Unlimited", "Enterprise"] },
                      { feature: "Technical Analysis", values: ["✗", "✓", "✓", "✓"] },
                      { feature: "Team Collaboration", values: ["✗", "✗", "✓", "✓"] },
                      { feature: "API Access", values: ["✗", "✗", "✓", "✓"] },
                      { feature: "Priority Support", values: ["✗", "✓", "✓", "24/7 Dedicated"] }
                    ].map((row, index) => (
                      <tr key={index} className="border-b border-gray-800">
                        <td className="p-6 text-gray-300 font-medium">{row.feature}</td>
                        {row.values.map((value, valueIndex) => (
                          <td key={valueIndex} className="p-6 text-center">
                            {value === "✓" ? (
                              <CheckCircle className="h-5 w-5 text-[#16C784] mx-auto" />
                            ) : value === "✗" ? (
                              <X className="h-5 w-5 text-gray-500 mx-auto" />
                            ) : (
                              <span className="text-white">{value}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Premium Features Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
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
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
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
                  <p className="text-gray-300 text-sm">We offer a 15-day money-back guarantee for all premium plans. Try risk-free!</p>
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
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
      </section>

      {/* Checkout Modal */}
      {showCheckout && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gray-800 border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-2xl">
                  Complete Your Order
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCheckout(false);
                    setSelectedPlan(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Plan Summary */}
              <div className="bg-gray-900/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Selected Plan: {selectedPlan.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">
                    {isAnnual ? 'Annual' : 'Monthly'} Subscription
                  </span>
                  <span className="text-white font-bold">
                    {formatCurrency(isAnnual ? selectedPlan.annualPrice : selectedPlan.monthlyPrice)}
                    {isAnnual ? '/year' : '/month'}
                  </span>
                </div>
                <div className="mt-2 p-2 bg-[#16C784]/10 border border-[#16C784]/30 rounded text-center">
                  <span className="text-[#16C784] font-medium">15-Day Free Trial Included</span>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  onClick={() => {
                    alert(`Free trial started for ${selectedPlan.name} plan! You'll receive a confirmation email shortly.`);
                    setShowCheckout(false);
                    setSelectedPlan(null);
                  }}
                  className="bg-[#16C784] hover:bg-[#14B575] text-white px-8 py-3"
                >
                  Start Your Free Trial
                </Button>
                <p className="text-gray-400 text-sm mt-2">No credit card required</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default PremiumPage