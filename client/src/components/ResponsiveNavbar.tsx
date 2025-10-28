import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Menu, X, User, Bell, BarChart3, 
  Wifi, WifiOff, LogOut, CreditCard
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'

interface ResponsiveNavbarProps {
  title?: string
  subtitle?: string
  breadcrumbs?: Array<{ label: string; href: string }>
  actions?: React.ReactNode[]
  showBackButton?: boolean
  backUrl?: string
  isConnected?: boolean
}

const ResponsiveNavbar: React.FC<ResponsiveNavbarProps> = ({ 
  title = "CryptoAlarm",
  subtitle = "Professional Trading Platform",
  breadcrumbs = [],
  actions = [],
  showBackButton = false,
  backUrl = "/dashboard",
  isConnected = true
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  // Close mobile menu on window resize or outside click
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setMobileMenuOpen(false)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && !(event.target as Element).closest('nav')) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    document.addEventListener('click', handleClickOutside)

    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [mobileMenuOpen])

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-[#0B1426]/90 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              {/* Back Button */}
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(backUrl)}
                  className="text-gray-400 hover:text-white hover:bg-gray-800 p-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}

              {/* Logo and Title */}
              <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <div className="bg-gradient-to-br from-[#3861FB] to-[#4F46E5] p-2 rounded-xl">
                  <img 
                    src="/cryptoAlarmLogo.png" 
                    alt="CryptoAlarm Logo" 
                    width={24} 
                    height={24} 
                    className="object-contain"
                  />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-white">{title}</h1>
                  <p className="text-xs text-gray-400">{subtitle}</p>
                </div>
              </Link>

              {/* Connection Status */}
              <div className="hidden md:flex items-center space-x-2">
                {isConnected ? (
                  <div className="flex items-center space-x-2 text-green-400">
                    <Wifi className="h-4 w-4" />
                    <span className="text-xs">Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-red-400">
                    <WifiOff className="h-4 w-4" />
                    <span className="text-xs">Disconnected</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2">
              {/* Actions */}
              {actions.map((action, index) => (
                <div key={index} className="hidden md:block">
                  {action}
                </div>
              ))}

              {/* User Section */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/profile')}
                    className="hidden md:flex text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="hidden md:flex text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-[#3861FB] hover:bg-[#2851FB] text-white"
                >
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-400 hover:text-white hover:bg-gray-800 p-2"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <div className="pb-4 pt-2">
              <nav className="flex text-sm text-gray-400">
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && <span className="mx-2">/</span>}
                    <Link 
                      to={crumb.href} 
                      className="hover:text-white transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  </div>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-[#0B1426]/95 backdrop-blur-lg">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate('/dashboard')
                      setMobileMenuOpen(false)
                    }}
                    className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <BarChart3 className="h-4 w-4 mr-3" />
                    Dashboard
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate('/alerts')
                      setMobileMenuOpen(false)
                    }}
                    className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <Bell className="h-4 w-4 mr-3" />
                    Alerts
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate('/portfolio')
                      setMobileMenuOpen(false)
                    }}
                    className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <BarChart3 className="h-4 w-4 mr-3" />
                    Portfolio
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate('/virtual-card')
                      setMobileMenuOpen(false)
                    }}
                    className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <CreditCard className="h-4 w-4 mr-3" />
                    Virtual Card
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate('/profile')
                      setMobileMenuOpen(false)
                    }}
                    className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </Button>
                  
                  <div className="border-t border-gray-700 pt-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleSignOut()
                        setMobileMenuOpen(false)
                      }}
                      className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <Button
                  onClick={() => {
                    setAuthModalOpen(true)
                    setMobileMenuOpen(false)
                  }}
                  className="w-full bg-[#3861FB] hover:bg-[#2851FB] text-white"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  )
}

export default ResponsiveNavbar