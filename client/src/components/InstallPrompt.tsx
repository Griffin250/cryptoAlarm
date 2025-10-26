import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Download, X } from 'lucide-react'

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(true) // Always show
  const [isAppInstalled, setIsAppInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      // Check for standalone mode (when app is launched from home screen)
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsAppInstalled(true)
      }
      // Check if user previously installed (stored in localStorage)
      if (localStorage.getItem('cryptoalarm-installed') === 'true') {
        setIsAppInstalled(true)
      }
    }

    checkIfInstalled()

    const handler = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      setShowInstallBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Show the prompt
      deferredPrompt.prompt()

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
        setIsAppInstalled(true)
        localStorage.setItem('cryptoalarm-installed', 'true')
      } else {
        console.log('User dismissed the install prompt')
      }

      setDeferredPrompt(null)
    } else if (isAppInstalled) {
      // App is already installed, show message
      alert('CryptoAlarm is already installed on your device!')
    } else {
      // No install prompt available, show instructions
      alert('To install CryptoAlarm:\n\n1. Open browser menu (⋮)\n2. Select "Install CryptoAlarm" or "Add to Home Screen"\n3. Follow the prompts')
    }
  }

  const handleDismiss = () => {
    // Just hide temporarily - will reappear on page refresh
    setShowInstallBanner(false)
  }

  if (!showInstallBanner) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md">
      <div className="bg-gradient-to-r from-[#3861FB] to-[#4F46E5] p-4 rounded-lg shadow-lg border border-blue-500/30">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">
              {isAppInstalled ? 'CryptoAlarm App' : 'Install CryptoAlarm App'}
            </p>
            <p className="text-blue-100 text-xs">
              {isAppInstalled 
                ? 'Already installed - Launch from home screen' 
                : 'Add to your home screen for quick access'
              }
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-3">
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white text-blue-600 hover:bg-blue-50 border-white text-xs px-3"
              onClick={handleInstall}
            >
              <Download className="h-3 w-3 mr-1" />
              {isAppInstalled ? 'Installed' : deferredPrompt ? 'Install' : 'How to Install'}
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-white hover:bg-white/20 p-1 h-8 w-8"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstallPrompt