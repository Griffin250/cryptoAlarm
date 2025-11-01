import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, User, Settings, Crown, HelpCircle, LogOut } from 'lucide-react'
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

  const { isAuthenticated, profile, user, signOut, loading } = useAuth();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/alerts', label: 'Alerts' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: 'https://crypto-pass.vercel.app/', label: 'CryptoPass' },
    { href: '#', label: 'Arbitrage bot' },
  ]

  const dropdownItems = [
    { href: '/premium', label: 'Premium' },
    { href: '/help', label: 'Help Center' },
    { href: '/coming-soon', label: 'Coming Soon' },
  ]

  type MenuItem =
    | { href: string; label: string; icon: React.ComponentType<any> }
    | { label: string; icon: React.ComponentType<any>; onClick: () => void };

  const userMenuItems: MenuItem[] = [
    { href: '/profile', label: 'View Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/premium', label: 'Upgrade to Premium', icon: Crown },
    { href: '/help', label: 'Help Center', icon: HelpCircle },
  ];

  // Add logout item if authenticated
  const fullUserMenuItems: MenuItem[] = isAuthenticated
    ? [
        ...userMenuItems,
        {
          label: 'Sign Out',
          icon: LogOut,
          onClick: async () => {
            await signOut();
            setIsUserMenuOpen(false);
            setIsMenuOpen(false);
          },
        },
      ]
    : userMenuItems;



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
                More
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
            {/* Desktop User Profile - Auth-aware */}
            <div className="hidden lg:flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-md transition-colors duration-200"
                  >
                    <ProfileAvatar user={profile || null} size="sm" />
                    <span className="hidden xl:block">
                      {profile?.full_name ? profile.full_name : user?.email}
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {/* User Dropdown Menu - Authenticated */}
                  {isUserMenuOpen && (
                    <div className="absolute top-full right-0 mt-1 w-56 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                      <div className="py-1">
                        {fullUserMenuItems.map((item) => {
                          if ('href' in item) {
                            return (
                              <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center px-4 py-2 text-sm transition-colors duration-200 text-gray-300 hover:bg-gray-700 hover:text-white"
                              >
                                <item.icon className="h-4 w-4 mr-3" />
                                {item.label}
                              </Link>
                            );
                          } else {
                            // Logout button: brown/red color
                            return (
                              <button
                                key={item.label}
                                onClick={item.onClick}
                                className="flex items-center w-full px-4 py-2 text-sm transition-colors duration-200 text-[#b91c1c] hover:bg-[#7c2d12] hover:text-white bg-transparent"
                              >
                                <item.icon className="h-4 w-4 mr-3 text-[#b91c1c]" />
                                {item.label}
                              </button>
                            );
                          }
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="px-4 py-2 text-sm font-semibold rounded-md bg-gradient-to-r from-[#3861FB] via-[#7C3AED] to-[#16C784] text-white shadow-lg hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#3861FB] transition-all duration-300 animate-pulse"
                  style={{
                    backgroundSize: '200% 200%',
                    animation: 'gradient-move 2s ease-in-out infinite',
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <svg className="h-4 w-4 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                    Get Started
                  </span>
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
              {/* User Account Dropdown - Mobile - Auth-aware */}
              <div className="border-b border-gray-700/50 pb-3 mb-3">
                <div>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between text-gray-300 hover:text-white hover:bg-gray-700/50 font-medium p-3 transition-colors duration-200"
                    onClick={() => setIsMobileAccountOpen(!isMobileAccountOpen)}
                  >
                    <div className="flex items-center space-x-3">
                      <ProfileAvatar user={profile || null} size="sm" showOnlineStatus />
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium text-white">
                          {isAuthenticated && profile?.full_name ? profile.full_name : isAuthenticated && user?.email ? user.email : 'Guest'}
                        </span>
                        <span className="text-xs text-gray-400">Account & Settings</span>
                      </div>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMobileAccountOpen ? 'rotate-180' : ''}`} />
                  </Button>
                  {isMobileAccountOpen && (
                    <div className="pl-4 space-y-1 mt-2 animate-in slide-in-from-top-1 duration-200">
                      {isAuthenticated ? (
                        fullUserMenuItems.map((item) => {
                          if ('href' in item) {
                            return (
                              <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200 text-gray-300 hover:text-white hover:bg-gray-700/50"
                              >
                                <item.icon className="h-4 w-4 mr-3" />
                                {item.label}
                              </Link>
                            );
                          } else {
                            return (
                              <button
                                key={item.label}
                                onClick={item.onClick}
                                className="flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors duration-200 text-gray-300 hover:text-white hover:bg-gray-700/50"
                              >
                                <item.icon className="h-4 w-4 mr-3" />
                                {item.label}
                              </button>
                            );
                          }
                        })
                      ) : (
                        <Link
                          to="/auth"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200 text-gray-300 hover:text-white hover:bg-gray-700/50"
                        >
                          <User className="h-4 w-4 mr-3" />
                          Sign In / Sign Up
                        </Link>
                      )}
                    </div>
                  )}
                </div>
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