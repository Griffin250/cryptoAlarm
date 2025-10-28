import React from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Link } from 'react-router-dom'
import { ArrowLeft, Home, Bell } from 'lucide-react'

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A] flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg max-w-md mx-auto">
          <CardHeader className="text-center pb-4">
            <div className="bg-gradient-to-br from-[#3861FB] to-[#4F46E5] p-4 rounded-full w-20 h-20 mx-auto mb-4">
              <Bell className="h-12 w-12 text-white" />
            </div>
            <CardTitle className="text-white text-3xl mb-2">404</CardTitle>
            <h2 className="text-xl text-gray-300">Page Not Found</h2>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-gray-400">
                Oops! The page you're looking for doesn't exist.
              </p>
              <p className="text-gray-500 text-sm">
                It might have been moved, deleted, or you entered the wrong URL.
              </p>
            </div>

            <div className="space-y-3">
              <Link to="/" className="block">
                <Button className="bg-[#3861FB] hover:bg-[#2851FB] text-white w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Home
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="border-gray-600 text-gray-300 hover:bg-gray-800 w-full"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-500">
                Need help? Contact our support team.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#3861FB] rounded-full opacity-60 animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-[#16C784] rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute bottom-1/4 left-3/4 w-1.5 h-1.5 bg-[#EA3943] rounded-full opacity-50 animate-bounce"></div>
        </div>
      </div>
    </div>
  )
}

export default NotFound