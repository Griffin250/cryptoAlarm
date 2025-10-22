"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import ResponsiveNavbar from "../../components/ResponsiveNavbar";
import { 
  HelpCircle, Search, MessageCircle, Mail, Phone, 
  FileText, Video, ExternalLink, ChevronRight,
  Bell, Settings, CreditCard, Shield, Zap, Star
} from "lucide-react";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqItems = [
    {
      question: "How do I set up price alerts?",
      answer: "Go to the Dashboard, select a cryptocurrency, and set your target price. You'll receive a voice call when the price is reached.",
      category: "Alerts"
    },
    {
      question: "What cryptocurrencies are supported?",
      answer: "We support 11+ major cryptocurrencies including Bitcoin, Ethereum, BNB, Solana, XRP, Dogecoin, Cardano, Shiba Inu, USDC, Sui, and Pepe.",
      category: "General"
    },
    {
      question: "How much does the Premium plan cost?",
      answer: "The Premium plan is $29.99/month and includes unlimited voice alerts, priority support, and advanced features.",
      category: "Billing"
    },
    {
      question: "Can I change my phone number?",
      answer: "Yes, you can update your phone number in Settings > Notifications. Make sure to verify the new number for alerts to work properly.",
      category: "Settings"
    },
    {
      question: "Why didn't I receive an alert call?",
      answer: "Check that your phone number is correct and verified. Also ensure your phone can receive calls and isn't in Do Not Disturb mode.",
      category: "Troubleshooting"
    },
    {
      question: "How accurate are the price updates?",
      answer: "Prices are updated every 2 seconds via Binance WebSocket connection, providing real-time accuracy for your alerts.",
      category: "Technical"
    }
  ];

  const helpTopics = [
    {
      title: "Getting Started",
      description: "Learn the basics of CryptoAlarm",
      icon: <Zap className="h-5 w-5" />,
      articles: 8,
      color: "text-[#3861FB]"
    },
    {
      title: "Setting Up Alerts",
      description: "Configure price and percentage alerts",
      icon: <Bell className="h-5 w-5" />,
      articles: 12,
      color: "text-[#16C784]"
    },
    {
      title: "Account Settings",
      description: "Manage your profile and preferences",
      icon: <Settings className="h-5 w-5" />,
      articles: 6,
      color: "text-yellow-500"
    },
    {
      title: "Billing & Subscriptions",
      description: "Payments, plans, and upgrades",
      icon: <CreditCard className="h-5 w-5" />,
      articles: 5,
      color: "text-purple-500"
    },
    {
      title: "Security & Privacy",
      description: "Keep your account safe",
      icon: <Shield className="h-5 w-5" />,
      articles: 4,
      color: "text-red-500"
    },
    {
      title: "Premium Features",
      description: "Advanced tools and capabilities",
      icon: <Star className="h-5 w-5" />,
      articles: 10,
      color: "text-orange-500"
    }
  ];

  const contactOptions = [
    {
      title: "Email Support",
      description: "Get help via email within 24 hours",
      icon: <Mail className="h-6 w-6 text-[#3861FB]" />,
      action: "Send Email",
      href: "mailto:support@cryptoalarm.com"
    },
    {
      title: "Live Chat",
      description: "Chat with our support team instantly",
      icon: <MessageCircle className="h-6 w-6 text-[#16C784]" />,
      action: "Start Chat",
      badge: "Available 9AM-6PM EST"
    },
    {
      title: "Phone Support",
      description: "Call us for urgent issues (Premium only)",
      icon: <Phone className="h-6 w-6 text-yellow-500" />,
      action: "Call Now",
      href: "tel:+1-555-CRYPTO",
      premium: true
    }
  ];

  const filteredFAQs = faqItems.filter(item => 
    searchQuery === '' || 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      <ResponsiveNavbar 
        title="Help & Support" 
        subtitle="Get the help you need" 
        showBackButton={true}
        backUrl="/profile"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Search */}
          <div className="mb-8">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-6">
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search for help articles, FAQs, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-600 text-white text-lg h-12"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Help Topics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {helpTopics.map((topic, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 transition-colors cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`${topic.color}`}>
                        {topic.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold group-hover:text-[#3861FB] transition-colors">
                          {topic.title}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">
                          {topic.description}
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {topic.articles} articles
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* FAQ Section */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredFAQs.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No FAQs found matching your search.</p>
                    </div>
                  ) : (
                    filteredFAQs.map((faq, index) => (
                      <div key={index} className="border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-white font-medium pr-4">
                            {faq.question}
                          </h4>
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            {faq.category}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Support */}
            <div className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Contact Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactOptions.map((option, index) => (
                    <div key={index} className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-start space-x-3">
                        {option.icon}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-white font-medium">{option.title}</h4>
                            {option.premium && (
                              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs">
                                Premium
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mb-3">
                            {option.description}
                          </p>
                          {option.badge && (
                            <Badge variant="outline" className="text-xs mb-2">
                              {option.badge}
                            </Badge>
                          )}
                          {option.href ? (
                            <Link href={option.href}>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full"
                              >
                                {option.action}
                                <ExternalLink className="h-3 w-3 ml-2" />
                              </Button>
                            </Link>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="w-full"
                              disabled={option.premium}
                            >
                              {option.action}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/dashboard" className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <span className="text-white">Dashboard</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  <Link href="/settings" className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <span className="text-white">Settings</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  <Link href="/premium" className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <span className="text-white">Premium Plans</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                </CardContent>
              </Card>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}