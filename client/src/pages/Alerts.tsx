import React, { useState } from 'react'
import StandardNavbar from '../components/StandardNavbar'
import AlertManager from '../components/AlertManager'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Bell } from 'lucide-react'

const AlertsPage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <StandardNavbar />
        <main className="pt-16 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Loading...</div>
          </div>
        </main>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <StandardNavbar />
        <main className="pt-16 px-4">
          <Card className="max-w-md mx-auto bg-gray-900/50 border-gray-700">
            <CardHeader className="text-center">
              <Bell className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <CardTitle className="text-white">Sign In Required</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-400 mb-6">
                Please sign in to manage your crypto alerts
              </p>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
              >
                Sign In / Sign Up
              </Button>
            </CardContent>
          </Card>
        </main>
        {showAuthModal && (
          <AuthModal 
            isOpen={showAuthModal} 
            onClose={() => setShowAuthModal(false)} 
          />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <StandardNavbar />
      <main className="pt-16 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <AlertManager />
        </div>
      </main>
    </div>
  )
}

export default AlertsPage