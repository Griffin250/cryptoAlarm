"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import Link from "next/link";
import Image from "next/image";
import { 
  Crown, Check, Star, Zap, Shield, Phone, Mail, Globe,
  Users, BarChart3, Bell, Target, Smartphone, Monitor,
  Calendar, CreditCard, Gift, ArrowRight, X, ChevronDown,
  AlertTriangle, CheckCircle, Lock, Sparkles
} from "lucide-react";

const PremiumPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
    city: "",
    zipCode: "",
    country: "US"
  });
  const [currentStep, setCurrentStep] = useState(1); // 1: Plan Selection, 2: Details, 3: Payment

  // Pricing plans
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
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowCheckout(true);
    setCurrentStep(2);
  };

  const handleStartFreeTrial = (plan) => {
    setSelectedPlan(plan);
    setShowCheckout(true);
    setCurrentStep(2);
  };

  const handleSubmit = () => {
    // Mock payment processing
    alert(`Order submitted for ${selectedPlan.name} plan! You'll receive a confirmation email shortly.`);
    setShowCheckout(false);
    setCurrentStep(1);
    setSelectedPlan(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-[#0B1426]/80 border-b border-gray-800">
        <div className="container mx-auto px-3 sm:px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity cursor-pointer min-w-0">
              <div className="bg-gradient-to-br from-[#3861FB] to-[#4F46E5] p-2 rounded-xl flex-shrink-0">
                <Image 
                  src="/cryptoAlarmLogo.png" 
                  alt="CryptoAlarm Logo" 
                  width={20} 
                  height={20} 
                  className="sm:w-6 sm:h-6 object-contain"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-white">CryptoAlarm</h1>
                <p className="text-xs text-gray-400 hidden sm:block">Premium Plans</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <Link href="/dashboard">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  Dashboard
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

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
            {plans.map((plan, index) => (
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
                      {formatPrice(isAnnual ? plan.annualPrice / 12 : plan.monthlyPrice)}
                      <span className="text-lg text-gray-400">/month</span>
                    </div>
                    {isAnnual && (
                      <div className="text-sm text-gray-500">
                        Billed annually ({formatPrice(plan.annualPrice)})
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

      {/* Features Comparison */}
      <section className="py-20 bg-gray-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Compare All Features</h2>
            <p className="text-xl text-gray-300">See what&apos;s included in each plan</p>
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
                              <Check className="h-5 w-5 text-[#16C784] mx-auto" />
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
                    setCurrentStep(1);
                    setSelectedPlan(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Progress Steps */}
              <div className="flex items-center space-x-4 mt-4">
                <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-[#16C784]' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-[#16C784]' : 'bg-gray-600'}`}>
                    {currentStep > 1 ? <Check className="h-4 w-4 text-white" /> : '1'}
                  </div>
                  <span className="text-sm">Plan</span>
                </div>
                <div className={`h-px flex-1 ${currentStep >= 2 ? 'bg-[#16C784]' : 'bg-gray-600'}`} />
                <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-[#16C784]' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-[#16C784]' : 'bg-gray-600'}`}>
                    {currentStep > 2 ? <Check className="h-4 w-4 text-white" /> : '2'}
                  </div>
                  <span className="text-sm">Details</span>
                </div>
                <div className={`h-px flex-1 ${currentStep >= 3 ? 'bg-[#16C784]' : 'bg-gray-600'}`} />
                <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-[#16C784]' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-[#16C784]' : 'bg-gray-600'}`}>
                    {currentStep > 3 ? <Check className="h-4 w-4 text-white" /> : '3'}
                  </div>
                  <span className="text-sm">Payment</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 2: Personal Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Plan Summary */}
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Selected Plan: {selectedPlan.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">
                        {isAnnual ? 'Annual' : 'Monthly'} Subscription
                      </span>
                      <span className="text-white font-bold">
                        {formatPrice(isAnnual ? selectedPlan.annualPrice : selectedPlan.monthlyPrice)}
                        {isAnnual ? '/year' : '/month'}
                      </span>
                    </div>
                    {currentStep === 2 && (
                      <div className="mt-2 p-2 bg-[#16C784]/10 border border-[#16C784]/30 rounded text-center">
                        <span className="text-[#16C784] font-medium">15-Day Free Trial Included</span>
                      </div>
                    )}
                  </div>

                  {/* Personal Information Form */}
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]"
                        placeholder="john@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Company (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]"
                        placeholder="Your Company"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={() => setCurrentStep(3)}
                      className="bg-[#3861FB] hover:bg-[#2851FB] text-white"
                      disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone}
                    >
                      Continue to Payment
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Back
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">{selectedPlan.name} Plan</span>
                        <span className="text-white">
                          {formatPrice(isAnnual ? selectedPlan.annualPrice : selectedPlan.monthlyPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#16C784]">
                        <span>15-Day Free Trial</span>
                        <span>-{formatPrice(isAnnual ? selectedPlan.annualPrice : selectedPlan.monthlyPrice)}</span>
                      </div>
                      <div className="border-t border-gray-700 pt-2 flex justify-between font-bold">
                        <span className="text-white">Total Due Today</span>
                        <span className="text-white">$0.00</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        After trial: {formatPrice(isAnnual ? selectedPlan.annualPrice : selectedPlan.monthlyPrice)} 
                        {isAnnual ? '/year' : '/month'}
                      </p>
                    </div>
                  </div>

                  {/* Payment Form */}
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Payment Information</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          CVV *
                        </label>
                        <input
                          type="text"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]"
                          placeholder="123"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Billing Address *
                      </label>
                      <input
                        type="text"
                        value={formData.billingAddress}
                        onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]"
                        placeholder="123 Main Street"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]"
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]"
                          placeholder="10001"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <Alert className="border-[#16C784]/30 bg-[#16C784]/10">
                    <Shield className="h-4 w-4 text-[#16C784]" />
                    <AlertDescription className="text-[#16C784]">
                      Your payment information is encrypted and secure. We use industry-standard SSL encryption.
                    </AlertDescription>
                  </Alert>

                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={handleSubmit}
                      className="bg-[#16C784] hover:bg-[#14B575] text-white"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Start Free Trial
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Back
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-300">Everything you need to know about our premium plans</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                q: "How does the 15-day free trial work?",
                a: "Start any premium plan risk-free for 15 days. No credit card required. Full access to all features. Cancel anytime before the trial ends."
              },
              {
                q: "Can I change plans later?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise plans."
              },
              {
                q: "Is there a setup fee?",
                a: "No setup fees for any plan. You only pay the monthly or annual subscription fee. Enterprise plans include free onboarding."
              },
              {
                q: "Do you offer refunds?",
                a: "Yes, we offer a 30-day money-back guarantee on all plans. If you're not satisfied, get a full refund within 30 days."
              },
              {
                q: "Can I cancel anytime?",
                a: "Absolutely. Cancel your subscription anytime from your dashboard. No cancellation fees or long-term commitments."
              }
            ].map((faq, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                  <p className="text-gray-300 text-sm">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <Link href="/" className="flex items-center justify-center space-x-3">
              <div className="bg-gradient-to-br from-[#3861FB] to-[#4F46E5] p-2 rounded-xl">
                <Image 
                  src="/cryptoAlarmLogo.png" 
                  alt="CryptoAlarm Logo" 
                  width={24} 
                  height={24} 
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">CryptoAlarm</h1>
                <p className="text-xs text-gray-400">Premium Crypto Monitoring</p>
              </div>
            </Link>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <div className="text-gray-400 text-sm">
                © 2025 CryptoAlarm. All rights reserved.
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30 px-6 py-3 rounded-full">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#16C784] rounded-full animate-pulse"></div>
                <span className="text-[#3861FB] font-bold text-lg">v1.0.15</span>
                <div className="w-2 h-2 bg-[#16C784] rounded-full animate-pulse delay-1000"></div>
              </div>
            </div>
            
            <div className="text-center lg:text-right">
              <div className="text-gray-400 text-sm">
                Secure payments • 15-day free trial • Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PremiumPage;