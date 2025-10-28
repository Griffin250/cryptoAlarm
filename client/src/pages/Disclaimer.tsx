import React from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Alert, AlertDescription } from '../components/ui/alert'
import StandardNavbar from '../components/StandardNavbar'
import { Link } from 'react-router-dom'
import { AlertTriangle, TrendingUp, DollarSign, Info, BookOpen, Scale } from 'lucide-react'

const DisclaimerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      <StandardNavbar 
        title="Disclaimer" 
        subtitle="Important legal and financial disclaimers" 
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#EA3943]/20 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8 text-[#EA3943]" />
            </div>
            
            <h1 className="text-4xl font-bold text-white">Legal Disclaimer</h1>
            <p className="text-gray-300 text-lg">
              Important information about risks, limitations, and legal considerations
            </p>
            <p className="text-gray-400">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Warning Alert */}
          <Alert className="border-[#EA3943] bg-[#EA3943]/10">
            <AlertTriangle className="h-4 w-4 text-[#EA3943]" />
            <AlertDescription className="text-white">
              <strong>Important:</strong> Please read this disclaimer carefully before using CryptoAlarm. 
              Cryptocurrency trading involves substantial risk of loss and is not suitable for all investors.
            </AlertDescription>
          </Alert>

          {/* Disclaimer Content */}
          <div className="space-y-8">
            
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-[#EA3943]" />
                  Investment and Trading Risks
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  <strong>Cryptocurrency trading carries substantial risk of loss.</strong> Before using our service, 
                  you should carefully consider whether trading is appropriate for you given your financial situation.
                </p>
                
                <h4 className="text-white font-semibold">Key Risks Include:</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>High Volatility:</strong> Cryptocurrency prices can fluctuate dramatically</li>
                  <li><strong>Market Risk:</strong> Values can decrease rapidly due to market conditions</li>
                  <li><strong>Liquidity Risk:</strong> Some cryptocurrencies may be difficult to trade</li>
                  <li><strong>Regulatory Risk:</strong> Changes in regulations can affect cryptocurrency values</li>
                  <li><strong>Technology Risk:</strong> Blockchain and exchange vulnerabilities</li>
                  <li><strong>Total Loss:</strong> You could lose your entire investment</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-[#16C784]" />
                  Not Financial Advice
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  <strong>CryptoAlarm is a monitoring and alerting service only.</strong> We do not provide investment advice, 
                  financial planning, or trading recommendations.
                </p>
                
                <h4 className="text-white font-semibold">Our Service Does NOT:</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide investment or trading advice</li>
                  <li>Recommend specific cryptocurrencies to buy or sell</li>
                  <li>Analyze market trends or provide predictions</li>
                  <li>Offer tax, legal, or financial planning advice</li>
                  <li>Guarantee profits or prevent losses</li>
                </ul>

                <div className="mt-4 p-4 bg-[#3861FB]/10 border border-[#3861FB]/30 rounded-lg">
                  <p className="text-[#3861FB] font-semibold">
                    Always conduct your own research and consider consulting with qualified financial advisors 
                    before making investment decisions.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center">
                  <Info className="h-5 w-5 mr-2 text-[#3861FB]" />
                  Service Limitations
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>While we strive for accuracy and reliability, our service has inherent limitations:</p>
                
                <h4 className="text-white font-semibold">Technical Limitations:</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Data delays:</strong> Price data may not be real-time</li>
                  <li><strong>System downtime:</strong> Technical issues may affect alert delivery</li>
                  <li><strong>Network failures:</strong> Internet connectivity issues may impact service</li>
                  <li><strong>Third-party dependencies:</strong> We rely on external data providers</li>
                </ul>

                <h4 className="text-white font-semibold mt-4">No Guarantees:</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>We cannot guarantee alert delivery timing or accuracy</li>
                  <li>Price data accuracy depends on our data sources</li>
                  <li>Service availability may vary due to maintenance or issues</li>
                  <li>Features may change or be discontinued without notice</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center">
                  <Scale className="h-5 w-5 mr-2 text-purple-500" />
                  Limitation of Liability
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  <strong>CryptoAlarm and its affiliates shall not be liable for any losses</strong> resulting from:
                </p>
                
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Investment or trading decisions based on our alerts</li>
                  <li>Delayed, missed, or inaccurate price notifications</li>
                  <li>Service interruptions or technical failures</li>
                  <li>Third-party data provider errors or delays</li>
                  <li>Market volatility or unexpected price movements</li>
                  <li>Any direct, indirect, incidental, or consequential damages</li>
                </ul>

                <div className="mt-4 p-4 bg-[#EA3943]/10 border border-[#EA3943]/30 rounded-lg">
                  <p className="text-[#EA3943] font-semibold">
                    Maximum liability is limited to the amount you paid for our service in the past 12 months.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">Past Performance</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Any examples, case studies, or historical data mentioned in our service or communications 
                  are for illustrative purposes only and should not be considered as:
                </p>
                
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Predictions of future performance</li>
                  <li>Guarantees of similar results</li>
                  <li>Investment recommendations</li>
                  <li>Typical or expected outcomes</li>
                </ul>

                <p className="mt-4 font-semibold text-white">
                  Past performance does not guarantee future results.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">Regulatory Compliance</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Cryptocurrency regulations vary by jurisdiction and are constantly evolving. Users are responsible for:
                </p>
                
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Complying with local laws and regulations</li>
                  <li>Understanding tax implications of cryptocurrency trading</li>
                  <li>Ensuring they are legally permitted to trade cryptocurrencies</li>
                  <li>Reporting gains/losses as required by local tax authorities</li>
                </ul>

                <p className="mt-4">
                  We are not responsible for any legal or regulatory violations resulting from your use of cryptocurrencies.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-[#16C784]" />
                  Educational Purpose
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Any information provided through our service is for educational and informational purposes only. 
                  This includes:
                </p>
                
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Market data and price information</li>
                  <li>Technical documentation and guides</li>
                  <li>Blog posts and educational content</li>
                  <li>Feature descriptions and use cases</li>
                </ul>

                <p className="mt-4">
                  This information should not be construed as professional advice of any kind.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">Changes to Disclaimer</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  We may update this disclaimer from time to time to reflect changes in our service, 
                  legal requirements, or industry standards. Continued use of our service after 
                  changes constitutes acceptance of the updated disclaimer.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Footer Actions */}
          <div className="text-center space-y-6 pt-8">
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-white text-xl font-semibold mb-4">Questions or Concerns?</h3>
              <p className="text-gray-300 mb-6">
                If you have questions about this disclaimer or need clarification on any points, 
                please contact our legal team.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/terms">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    Terms of Service
                  </Button>
                </Link>
                <Link to="/privacy">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    Privacy Policy
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button className="bg-[#3861FB] hover:bg-[#2851FB] text-white">
                    Contact Legal Team
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

export default DisclaimerPage