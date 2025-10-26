import React from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import StandardNavbar from '../components/StandardNavbar'
import { Link } from 'react-router-dom'
import { Shield, Lock, Eye, Database, Share2 } from 'lucide-react'

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      <StandardNavbar 
        title="Privacy Policy" 
        subtitle="How we protect and use your data" 
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#16C784]/20 rounded-full mb-4">
              <Shield className="h-8 w-8 text-[#16C784]" />
            </div>
            
            <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
            <p className="text-gray-300 text-lg">
              Your privacy matters to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-gray-400">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Privacy Content */}
          <div className="space-y-8">
            
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center">
                  <Database className="h-5 w-5 mr-2 text-[#3861FB]" />
                  1. Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>We collect information you provide directly to us, such as when you:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Create an account:</strong> Email address, username, and password</li>
                  <li><strong>Set up alerts:</strong> Cryptocurrency preferences and price targets</li>
                  <li><strong>Contact us:</strong> Messages, feedback, and support requests</li>
                  <li><strong>Use our service:</strong> Usage patterns and preferences</li>
                </ul>
                
                <h4 className="text-white font-semibold mt-6">Automatically Collected Information:</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage analytics (pages visited, features used, time spent)</li>
                  <li>Performance metrics and error logs</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-[#16C784]" />
                  2. How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Provide our service:</strong> Send price alerts and notifications</li>
                  <li><strong>Improve functionality:</strong> Enhance features and user experience</li>
                  <li><strong>Customer support:</strong> Respond to your questions and requests</li>
                  <li><strong>Security:</strong> Protect against fraud and unauthorized access</li>
                  <li><strong>Analytics:</strong> Understand how our service is used</li>
                  <li><strong>Communications:</strong> Send service-related updates (with your consent)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center">
                  <Share2 className="h-5 w-5 mr-2 text-purple-500" />
                  3. Information Sharing
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>We do <strong>NOT</strong> sell, trade, or rent your personal information to third parties. We may share information only in these limited cases:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Service providers:</strong> Trusted partners who help us operate our service (e.g., Twilio for SMS, email providers)</li>
                  <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business transfers:</strong> In the event of a merger or acquisition</li>
                  <li><strong>With your consent:</strong> When you explicitly agree to sharing</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-[#EA3943]" />
                  4. Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>We implement industry-standard security measures to protect your information:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
                  <li><strong>Authentication:</strong> Secure login with password hashing</li>
                  <li><strong>Access controls:</strong> Limited access to personal data on a need-to-know basis</li>
                  <li><strong>Monitoring:</strong> Continuous monitoring for security threats</li>
                  <li><strong>Regular audits:</strong> Periodic security assessments and updates</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">5. Your Rights and Choices</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>You have the following rights regarding your personal information:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Access:</strong> Request a copy of your personal information</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                  <li><strong>Portability:</strong> Export your data in a portable format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                </ul>
                
                <p className="mt-4">
                  To exercise these rights, contact us at privacy@cryptoalarm.com or through your account settings.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">6. Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Remember your preferences and settings</li>
                  <li>Keep you logged in to your account</li>
                  <li>Analyze how our service is used</li>
                  <li>Improve performance and user experience</li>
                </ul>
                
                <p className="mt-4">
                  You can control cookie settings through your browser preferences. Note that disabling cookies may affect functionality.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">7. Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>We integrate with third-party services to provide our functionality:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Cryptocurrency APIs:</strong> For real-time price data</li>
                  <li><strong>Notification services:</strong> For SMS and voice calls (Twilio)</li>
                  <li><strong>Analytics:</strong> For service improvement (anonymized)</li>
                  <li><strong>Authentication:</strong> Supabase for secure user management</li>
                </ul>
                
                <p className="mt-4">
                  These services have their own privacy policies, and we recommend reviewing them.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">8. Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Our service is not intended for children under 18 years of age. We do not knowingly collect 
                  personal information from children under 18. If you are a parent or guardian and believe 
                  your child has provided us with personal information, please contact us.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">9. International Users</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  CryptoAlarm is operated from [Your Country]. If you are accessing our service from outside 
                  [Your Country], please be aware that your information may be transferred to, stored, and 
                  processed in [Your Country] where our servers are located and our central database is operated.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">10. Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Email: privacy@cryptoalarm.com</li>
                  <li>Support: support@cryptoalarm.com</li>
                  <li>Address: [Your Business Address]</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Footer Actions */}
          <div className="text-center space-y-6 pt-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/terms">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  Terms of Service
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

export default PrivacyPage