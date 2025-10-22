"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, Menu, X, Settings, User, Bell, BarChart3, 
  Globe, Star, Plus, Search, Wifi, WifiOff, LogOut, Crown
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import AuthModal from "./AuthModal";
import UserAccountDropdown from "./UserAccountDropdown";

export default function ResponsiveNavbar({ 
  title = "CryptoAlarm",
  subtitle = "Professional Trading Platform",
  breadcrumbs = [],
  actions = [],
  showBackButton = false,
  backUrl = "/dashboard",
  isConnected = true
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, profile, signOut, isAuthenticated, loading } = useAuth();

  // Close mobile menu on window resize or outside click
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('nav')) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-[#0B1426]/90 border-b border-gray-800/50">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left Side - Logo & Navigation */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <div className="flex items-center space-x-2 flex-shrink-0">
                {showBackButton && (
                  <Link href={backUrl} className="flex items-center">
                    <ArrowLeft className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  </Link>
                )}
                
                <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer">
                  <div className="bg-gradient-to-br from-[#3861FB] to-[#4F46E5] p-2 rounded-xl">
                    <Image 
                      src="/cryptoAlarmLogo.png" 
                      alt="CryptoAlarm Logo" 
                      width={16} 
                      height={16} 
                      className="object-contain"
                    />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-lg font-bold text-white">{title}</h1>
                    <div className="text-xs text-gray-400 flex items-center">
                      <span>{subtitle}</span>
                    </div>
                  </div>
                  <div className="sm:hidden">
                    <h1 className="text-base font-bold text-white">{title}</h1>
                  </div>
                </Link>
              </div>

              {/* Breadcrumbs - Desktop only */}
              {breadcrumbs.length > 0 && (
                <div className="hidden lg:flex items-center space-x-2 text-sm flex-shrink-0">
                  {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {index > 0 && <span className="text-gray-600">/</span>}
                      {crumb.href ? (
                        <Link href={crumb.href} className="text-gray-400 hover:text-white transition-colors">
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="text-white font-medium">{crumb.label}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center space-x-1 flex-shrink-0">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard/portfolio">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Globe className="h-4 w-4 mr-2" />
                    Portfolio
                  </Button>
                </Link>
                <Link href="/premium">
                  <Button variant="ghost" size="sm" className="text-[#16C784] hover:text-[#14B575] hover:bg-[#16C784]/10">
                    <Star className="h-4 w-4 mr-2" />
                    Premium
                  </Button>
                </Link>
              </nav>
            </div>

            {/* Right Side - Actions & Status */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Connection Status - Hidden on mobile */}
              <div className="hidden sm:flex items-center space-x-2">
                {isConnected ? (
                  <>
                    <Wifi className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-500 font-medium hidden md:inline">Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-red-500 font-medium hidden md:inline">Disconnected</span>
                  </>
                )}
              </div>

              {/* Custom Actions */}
              <div className="hidden md:flex items-center space-x-2">
                {actions.map((action, index) => (
                  <div key={index}>{action}</div>
                ))}
              </div>

              {/* Desktop Action Buttons */}
              <div className="hidden md:flex items-center space-x-2">
                {loading ? (
                  <div className="w-8 h-8 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                  </div>
                ) : isAuthenticated ? (
                  <UserAccountDropdown />
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => setAuthModalOpen(true)}
                  >
                    <User className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-800/50 bg-[#0B1426]/95 backdrop-blur-lg">
            <div className="container mx-auto px-4 py-4">
              {/* Mobile Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm 
                             focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                             placeholder:text-muted-foreground transition-all duration-200"
                  />
                </div>
              </div>

              {/* Breadcrumbs - Mobile */}
              {breadcrumbs.length > 0 && (
                <div className="mb-4 pb-4 border-b border-gray-800/50">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    {breadcrumbs.map((crumb, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {index > 0 && <span className="text-gray-600">/</span>}
                        {crumb.href ? (
                          <Link 
                            href={crumb.href} 
                            className="text-gray-400 hover:text-white transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {crumb.label}
                          </Link>
                        ) : (
                          <span className="text-white font-medium">{crumb.label}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Mobile Navigation */}
              <nav className="space-y-2">
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                    <BarChart3 className="h-4 w-4 mr-3" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/portfolio" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                    <Globe className="h-4 w-4 mr-3" />
                    Portfolio
                  </Button>
                </Link>
                <Link href="/premium" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-[#16C784] hover:text-[#14B575] hover:bg-[#16C784]/10">
                    <Star className="h-4 w-4 mr-3" />
                    Premium
                  </Button>
                </Link>
                
                {/* Custom Mobile Actions */}
                {actions.length > 0 && (
                  <div className="border-t border-gray-800/50 pt-2 mt-2 space-y-2">
                    {actions.map((action, index) => (
                      <div key={index} className="w-full">
                        {action}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="border-t border-gray-800/50 pt-2 mt-2">
                  {loading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                    </div>
                  ) : isAuthenticated ? (
                    <>
                      <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                          <User className="h-4 w-4 mr-3" />
                          My Profile
                        </Button>
                      </Link>
                      <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                          <Bell className="h-4 w-4 mr-3" />
                          My Alerts
                        </Button>
                      </Link>
                      <Link href="/premium" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-[#16C784] hover:text-[#14B575] hover:bg-[#16C784]/10">
                          <Crown className="h-4 w-4 mr-3" />
                          Premium Plan
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => {
                          signOut();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setAuthModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <User className="h-4 w-4 mr-3" />
                      Sign In
                    </Button>
                  )}
                </div>
                
                {/* Mobile Connection Status */}
                <div className="sm:hidden border-t border-gray-800/50 pt-2 mt-2">
                  <div className="flex items-center space-x-2 px-3 py-2">
                    {isConnected ? (
                      <>
                        <Wifi className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-500 font-medium">Connected</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-red-500 font-medium">Disconnected</span>
                      </>
                    )}
                  </div>
                </div>
              </nav>
            </div>
          </div>
        )}
      </nav>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
}