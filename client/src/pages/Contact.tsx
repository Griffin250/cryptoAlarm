import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import StandardNavbar from '../components/StandardNavbar'
import { Link } from 'react-router-dom'
import { 
  Mail, Phone, MessageCircle, Clock, MapPin, 
  Send, User, HelpCircle, Bug, Star
} from 'lucide-react'

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Contact form submitted:', formData)
    // Show success message or redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      <StandardNavbar 
        title="Contact Support" 
        subtitle="Get in touch with our team" 
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3861FB]/20 rounded-full mb-4">
              <Mail className="h-8 w-8 text-[#3861FB]" />
            </div>
            
            <h1 className="text-4xl font-bold text-white">Contact Support</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Have questions about CryptoAlarm? Need technical support? Want to share feedback? 
              We're here to help and would love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-2xl flex items-center">
                    <MessageCircle className="h-6 w-6 mr-3 text-[#3861FB]" />
                    Send us a Message
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
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-white">Category</Label>
                      <Select onValueChange={(value) => handleInputChange('category', value)}>
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
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-white">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Please provide as much detail as possible..."
                        rows={6}
                        value={formData.message}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('message', e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 resize-none"
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
            </div>

            {/* Contact Info & Quick Links */}
            <div className="space-y-6">
              
              {/* Contact Information */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  <div className="space-y-4">
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
                        <Phone className="h-5 w-5 text-[#16C784]" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Phone Support</p>
                        <p className="text-gray-400 text-sm">+1 (555) 123-CRYPTO</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Address</p>
                        <p className="text-gray-400 text-sm">123 Crypto Street<br />Blockchain City, BC 12345</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#EA3943]/20 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-[#EA3943]" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Support Hours</p>
                        <p className="text-gray-400 text-sm">Mon-Fri: 9AM-6PM EST<br />Weekends: 10AM-4PM EST</p>
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  
                  <Link to="/coming-soon" className="block">
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Help Center & FAQ
                    </Button>
                  </Link>

                  <Link to="/coming-soon" className="block">
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800">
                      <Bug className="h-4 w-4 mr-2" />
                      Report a Bug
                    </Button>
                  </Link>

                  <Link to="/coming-soon" className="block">
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800">
                      <Star className="h-4 w-4 mr-2" />
                      Feature Request
                    </Button>
                  </Link>

                  <Link to="/coming-soon" className="block">
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800">
                      <User className="h-4 w-4 mr-2" />
                      Account Issues
                    </Button>
                  </Link>

                </CardContent>
              </Card>

              {/* Response Time */}
              <Card className="bg-gradient-to-r from-[#3861FB]/10 to-[#16C784]/10 border-[#3861FB]/30">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-[#3861FB]" />
                    Response Time
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">General Inquiries:</span>
                      <span className="text-white">24-48 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Technical Issues:</span>
                      <span className="text-white">4-12 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Critical Bugs:</span>
                      <span className="text-white">1-4 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center space-y-6 pt-8">
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h2>
              <p className="text-gray-300 mb-6">
                Check out our comprehensive documentation and community forums for instant answers.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/coming-soon">
                  <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Browse FAQ
                  </Button>
                </Link>
                <Link to="/coming-soon">
                  <Button size="lg" className="bg-[#3861FB] hover:bg-[#2851FB] text-white">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Join Community
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage