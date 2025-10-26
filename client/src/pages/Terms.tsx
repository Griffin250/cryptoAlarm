import React from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import StandardNavbar from '../components/StandardNavbar'
import { Link } from 'react-router-dom'
import { Shield, FileText, Scale } from 'lucide-react'

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      <StandardNavbar 
        title="Terms of Service" 
        subtitle="Our terms and conditions" 
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3861FB]/20 rounded-full mb-4">
              <Scale className="h-8 w-8 text-[#3861FB]" />
            </div>
            
            <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
            <p className="text-gray-300 text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Terms Content */}
          <div className="space-y-8">
            
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-[#3861FB]" />
                  1. Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  By accessing and using CryptoAlarm ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-[#16C784]" />
                  2. Description of Service
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  CryptoAlarm provides cryptocurrency price monitoring and alert services. Our platform allows users to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Set price alerts for various cryptocurrencies</li>
                  <li>Receive notifications via email, SMS, or voice calls</li>
                  <li>Track portfolio performance</li>
                  <li>Access market data and analytics</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">3. User Accounts</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  To access certain features of the Service, you may be required to create an account. You are responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and up-to-date information</li>
                  <li>Notifying us of any unauthorized use of your account</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">4. Acceptable Use</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>You agree not to use the Service to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Violate any laws or regulations</li>
                  <li>Interfere with or disrupt the Service</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use automated scripts or bots without permission</li>
                  <li>Transmit spam, viruses, or malicious code</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">5. Financial Disclaimer</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  CryptoAlarm is a monitoring and alerting service only. We do not provide financial advice, and our service 
                  should not be considered as investment recommendations. Cryptocurrency trading carries significant risk, 
                  and you should:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Conduct your own research before making investment decisions</li>
                  <li>Understand the risks associated with cryptocurrency trading</li>
                  <li>Never invest more than you can afford to lose</li>
                  <li>Consult with qualified financial advisors when needed</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">6. Subscription and Billing</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Premium features require a subscription. By subscribing, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Pay all charges associated with your subscription</li>
                  <li>Automatic renewal unless cancelled</li>
                  <li>Our refund policy as outlined in our billing terms</li>
                  <li>Price changes with 30 days advance notice</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">7. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  CryptoAlarm and its affiliates shall not be liable for any indirect, incidental, special, consequential, 
                  or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other 
                  intangible losses, resulting from your use of the Service.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">8. Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  We reserve the right to modify these terms at any time. We will notify users of significant changes 
                  via email or through the Service. Continued use of the Service after changes constitutes acceptance 
                  of the new terms.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">9. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Email: legal@cryptoalarm.com</li>
                  <li>Address: [Your Business Address]</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Footer Actions */}
          <div className="text-center space-y-6 pt-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/privacy">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  Privacy Policy
                </Button>
              </Link>
              <Link to="/disclaimer">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  Disclaimer
                </Button>
              </Link>
              <Link to="/contact">
                <Button className="bg-[#3861FB] hover:bg-[#2851FB] text-white">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsPage