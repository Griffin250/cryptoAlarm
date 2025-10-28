import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion.tsx'
import StandardNavbar from '../components/StandardNavbar'
import { Link } from 'react-router-dom'
import { 
  Mail, MessageCircle, Clock, Send, HelpCircle, Star,
  Shield, TrendingUp, BookOpen,
  ChevronRight, Search, Zap, Globe, Smartphone, Database, AlertTriangle
} from 'lucide-react'

interface FormData {
  name: string
  email: string
  subject: string
  category: string
  message: string
}

interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'general' | 'alerts' | 'pricing' | 'technical' | 'account'
}

const HelpPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Help form submitted:', formData)
    // Show success message or redirect
    alert('Your message has been sent! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', subject: '', category: '', message: '' })
  }

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'How do I set up price alerts for cryptocurrencies?',
      answer: 'To set up price alerts, navigate to the Alerts section in your dashboard, click "Create Alert", select your cryptocurrency, set your target price, and choose your notification method (SMS, email, or push notification).',
      category: 'alerts'
    },
    {
      id: '2',
      question: 'Is my personal and financial data secure?',
      answer: 'Yes, we use industry-standard encryption (AES-256) and follow best security practices. We never store your exchange API keys with trading permissions, only read-only access for portfolio tracking.',
      category: 'account'
    },
    {
      id: '3',
      question: 'What cryptocurrencies do you support?',
      answer: 'We support over 10,000+ cryptocurrencies from major exchanges including Bitcoin, Ethereum, and all major altcoins. Our data is sourced from reliable providers like CoinMarketCap and Binance.',
      category: 'general'
    },
    {
      id: '4',
      question: 'How much does CryptoAlarm cost?',
      answer: 'We offer a free tier with basic alerts (up to 5 alerts) and a Premium plan at $9.99/month with unlimited alerts, advanced analytics, and priority support.',
      category: 'pricing'
    },
    {
      id: '5',
      question: 'Can I use CryptoAlarm on my mobile device?',
      answer: 'Yes! CryptoAlarm is fully responsive and works on all devices. We also have a Progressive Web App (PWA) that you can install on your phone for a native app experience.',
      category: 'technical'
    },
    {
      id: '6',
      question: 'How accurate are the price alerts?',
      answer: 'Our alerts are triggered within 30 seconds of the target price being reached. We use real-time data feeds and redundant systems to ensure maximum reliability.',
      category: 'alerts'
    },
    {
      id: '7',
      question: 'Can I cancel my subscription anytime?',
      answer: 'Absolutely! You can cancel your subscription at any time from your account settings. You\'ll continue to have access until the end of your current billing period.',
      category: 'pricing'
    },
    {
      id: '8',
      question: 'What happens if I miss an alert?',
      answer: 'All alerts are logged in your dashboard with timestamps. You can view alert history and we also send follow-up notifications if you haven\'t acknowledged critical alerts.',
      category: 'alerts'
    },
    {
      id: '9',
      question: 'Do you offer API access?',
      answer: 'Yes, Premium users get access to our REST API for integrating alerts and portfolio data into their own applications. Documentation is available in the developer section.',
      category: 'technical'
    },
    {
      id: '10',
      question: 'How do I connect my exchange accounts?',
      answer: 'Go to Portfolio settings and add your exchange API keys. We only require read-only permissions for security. Supported exchanges include Binance, Coinbase Pro, and Kraken.',
      category: 'account'
    }
  ]

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const quickLinks = [
    {
      title: 'Getting Started Guide',
      description: 'Learn the basics of setting up your first crypto alert',
      icon: BookOpen,
      href: '/coming-soon',
      color: 'text-[#3861FB]',
      bgColor: 'bg-[#3861FB]/20'
    },
    {
      title: 'API Documentation',
      description: 'Integrate CryptoAlarm into your applications',
      icon: Database,
      href: '/coming-soon',
      color: 'text-[#16C784]',
      bgColor: 'bg-[#16C784]/20'
    },
    {
      title: 'Mobile App Guide',
      description: 'Install and use our PWA on mobile devices',
      icon: Smartphone,
      href: '/coming-soon',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/20'
    },
    {
      title: 'Security Best Practices',
      description: 'Keep your account and data safe',
      icon: Shield,
      href: '/coming-soon',
      color: 'text-[#EA3943]',
      bgColor: 'bg-[#EA3943]/20'
    },
    {
      title: 'Trading Strategies',
      description: 'Advanced alert setups for different trading styles',
      icon: TrendingUp,
      href: '/coming-soon',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/20'
    },
    {
      title: 'Troubleshooting',
      description: 'Common issues and solutions',
      icon: AlertTriangle,
      href: '/coming-soon',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/20'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      <StandardNavbar 
        title="Help & Support" 
        subtitle="Find answers, get help, and contact our team" 
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3861FB]/20 rounded-full mb-4">
              <HelpCircle className="h-8 w-8 text-[#3861FB]" />
            </div>
            
            <h1 className="text-4xl font-bold text-white">Help & Support Center</h1>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Find answers to common questions, learn how to use CryptoAlarm effectively, 
              or get in touch with our support team for personalized assistance.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* FAQ Section */}
            <div className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-2xl flex items-center">
                    <HelpCircle className="h-6 w-6 mr-3 text-[#3861FB]" />
                    Frequently Asked Questions
                  </CardTitle>
                  
                  {/* Search and Filter */}
                  <div className="space-y-4 pt-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search FAQs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                      />
                    </div>
                    
                    <Select onValueChange={setSelectedCategory} defaultValue="all">
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="alerts">Alerts & Notifications</SelectItem>
                        <SelectItem value="pricing">Pricing & Billing</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="account">Account & Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-2">
                    {filteredFAQs.map((faq) => (
                      <AccordionItem 
                        key={faq.id} 
                        value={faq.id}
                        className="bg-gray-800/50 border border-gray-600 rounded-lg px-4"
                      >
                        <AccordionTrigger className="text-white hover:no-underline">
                          <span className="text-left">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-300">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  
                  {filteredFAQs.length === 0 && (
                    <div className="text-center py-8">
                      <HelpCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No FAQs found matching your search.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-2xl flex items-center">
                    <MessageCircle className="h-6 w-6 mr-3 text-[#3861FB]" />
                    Contact Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Name</Label>
                        <Input
                          id="name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-white">Category</Label>
                      <Select onValueChange={(value) => handleInputChange('category', value)} required>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="general">General Question</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="billing">Billing & Subscriptions</SelectItem>
                          <SelectItem value="bug">Bug Report</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-white">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your inquiry"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-white">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Please provide as much detail as possible..."
                        rows={5}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 resize-none"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-[#3861FB] hover:bg-[#2851FB] text-white"
                      size="lg"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#3861FB]/20 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-[#3861FB]" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Email Support</p>
                      <p className="text-gray-400 text-sm">support@cryptoalarm.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#16C784]/20 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-[#16C784]" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Response Time</p>
                      <p className="text-gray-400 text-sm">Usually within 4-12 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Links & Resources */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Helpful Resources</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Explore our comprehensive guides and resources to get the most out of CryptoAlarm
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickLinks.map((link, index) => (
                <Link key={index} to={link.href}>
                  <Card className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-colors group">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 ${link.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <link.icon className={`h-6 w-6 ${link.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-2 group-hover:text-[#3861FB] transition-colors">
                            {link.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-3">
                            {link.description}
                          </p>
                          <div className="flex items-center text-[#3861FB] text-sm">
                            <span>Learn more</span>
                            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Additional Support Options */}
          <Card className="bg-gradient-to-r from-[#3861FB]/10 to-[#16C784]/10 border-[#3861FB]/30">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Still Need Help?</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Join our community or schedule a one-on-one session with our support team for personalized assistance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/coming-soon">
                  <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    <Globe className="h-5 w-5 mr-2" />
                    Community Forum
                  </Button>
                </Link>
                <Link to="/coming-soon">
                  <Button size="lg" className="bg-[#3861FB] hover:bg-[#2851FB] text-white">
                    <Zap className="h-5 w-5 mr-2" />
                    Live Chat Support
                  </Button>
                </Link>
                <Link to="/premium">
                  <Button size="lg" variant="outline" className="border-[#16C784] text-[#16C784] hover:bg-[#16C784]/10">
                    <Star className="h-5 w-5 mr-2" />
                    Premium Support
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default HelpPage