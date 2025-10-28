import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, User, Settings, Crown, HelpCircle, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button } from './ui/button'
import ProfileAvatar from './ProfileAvatar'

interface StandardNavbarProps {
  title?: string
  subtitle?: string
}

const StandardNavbar: React.FC<StandardNavbarProps> = ({ title, subtitle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileFeaturesOpen, setIsMobileFeaturesOpen] = useState(false)
  const [isMobileAccountOpen, setIsMobileAccountOpen] = useState(false)
  const { user, profile, isAuthenticated } = useAuth()
  const location = useLocation()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Reset mobile dropdowns when menu closes
  useEffect(() => {
    if (!isMenuOpen) {
      setIsMobileFeaturesOpen(false)
      setIsMobileAccountOpen(false)
    }
  }, [isMenuOpen])

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/alerts', label: 'Alerts' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/premium', label: 'CryptoPass' },
  ]

  const dropdownItems = [
    { href: '/premium', label: 'Premium' },
    { href: '/settings', label: 'Settings' },
    { href: '/profile', label: 'Profile' },
    { href: '/help', label: 'Help & Support' },
    { href: '/coming-soon', label: 'Coming Soon' },
  ]

  const userMenuItems = [
    { href: '/profile', label: 'View Profile', icon: User },
    { href: '/profile/edit', label: 'Edit Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/premium', label: 'Upgrade to Premium', icon: Crown },
    { href: '/help', label: 'Help & Support', icon: HelpCircle },
    { href: '/auth/logout', label: 'Sign Out', icon: LogOut, isLogout: true },
  ]

  const isActiveLink = (href: string) => location.pathname === href

  return (
    <nav className="bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo & App Name */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#3861FB] to-[#7C3AED] rounded-lg flex items-center justify-center p-1">
                <img 
                  src="/cryptoAlarmLogo.png" 
                  alt="CryptoAlarm Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">CryptoAlarm</h1>
                {subtitle && (
                  <p className="text-xs text-gray-400 hidden sm:block">{subtitle}</p>
                )}
              </div>
            </Link>
          </div>

          {/* Center Section - Navigation Items */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActiveLink(item.href)
                    ? 'text-[#3861FB] border-b-2 border-[#3861FB]'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-md'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Features Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-md transition-colors duration-200"
              >
                Features
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50"
                >
                  <div className="py-1">
                    {dropdownItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - User Profile */}
          <div className="flex items-center space-x-4">
            {/* Desktop User Profile */}
            <div className="hidden lg:flex items-center space-x-3">
              {isAuthenticated && user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-md transition-colors duration-200"
                  >
                    <ProfileAvatar user={profile} size="sm" />
                    <span className="hidden xl:block">
                      {profile?.first_name || user.email?.split('@')[0] || 'User'}
                      {profile?.last_name && ` ${profile.last_name}`}
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute top-full right-0 mt-1 w-56 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                      <div className="py-1">
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setIsUserMenuOpen(false)}
                            className={`flex items-center px-4 py-2 text-sm transition-colors duration-200 ${
                              item.isLogout 
                                ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300' 
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                          >
                            <item.icon className="h-4 w-4 mr-3" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-[#3861FB] hover:bg-[#2851FB] rounded-md transition-colors duration-200"
                >
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen)
                  // Reset mobile dropdown states when closing
                  if (isMenuOpen) {
                    setIsMobileFeaturesOpen(false)
                    setIsMobileAccountOpen(false)
                  }
                }}
                className="text-gray-300 hover:text-white hover:bg-gray-700/50"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-700/50 bg-gray-900/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* User Account Dropdown - Mobile */}
              <div className="border-b border-gray-700/50 pb-3 mb-3">
                {isAuthenticated && user ? (
                  <div>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between text-gray-300 hover:text-white hover:bg-gray-700/50 font-medium p-3 transition-colors duration-200"
                      onClick={() => setIsMobileAccountOpen(!isMobileAccountOpen)}
                    >
                      <div className="flex items-center space-x-3">
                        <ProfileAvatar user={profile} size="sm" showOnlineStatus />
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium text-white">
                            {profile?.first_name || user.email?.split('@')[0] || 'User'}
                            {profile?.last_name && ` ${profile.last_name}`}
                          </span>
                          <span className="text-xs text-gray-400">Account & Settings</span>
                        </div>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMobileAccountOpen ? 'rotate-180' : ''}`} />
                    </Button>
                    
                    {isMobileAccountOpen && (
                      <div className="pl-4 space-y-1 mt-2 animate-in slide-in-from-top-1 duration-200">
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                              item.isLogout 
                                ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300' 
                                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                            }`}
                          >
                            <item.icon className="h-4 w-4 mr-3" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center space-x-3 px-3 py-3 text-sm font-medium text-white bg-[#3861FB] hover:bg-[#2851FB] rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>

              {/* Main Navigation - Mobile */}
              <div className="space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Navigation
                </div>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActiveLink(item.href)
                        ? 'text-[#3861FB] bg-[#3861FB]/10 border-l-4 border-[#3861FB]'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Features Dropdown - Mobile */}
              <div className="border-t border-gray-700/50 pt-3 mt-3">
                <Button 
                  variant="ghost" 
                  className="w-full justify-between text-gray-300 hover:text-white hover:bg-gray-700/50 font-medium py-3 transition-colors duration-200"
                  onClick={() => setIsMobileFeaturesOpen(!isMobileFeaturesOpen)}
                >
                  <div className="flex items-center">
                    <Settings className="h-4 w-4 mr-3" />
                    <span className="text-sm font-medium">Features</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMobileFeaturesOpen ? 'rotate-180' : ''}`} />
                </Button>
                
                {isMobileFeaturesOpen && (
                  <div className="pl-4 space-y-1 mt-2 animate-in slide-in-from-top-1 duration-200">
                    {dropdownItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                          isActiveLink(item.href)
                            ? 'text-[#3861FB] bg-[#3861FB]/10 border-l-4 border-[#3861FB]'
                            : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Page Title Section */}
      {title && (
        <div className="border-t border-gray-700/50 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl lg:text-3xl font-bold text-white">{title}</h1>
              {subtitle && (
                <p className="text-gray-400 text-sm lg:text-base mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default StandardNavbar