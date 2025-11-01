import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { useAuth } from '../context/AuthContext'
import { Loader2, Mail, Lock, User as UserIcon, ArrowLeft, Shield, Bell, TrendingUp, Eye, EyeOff } from 'lucide-react'
import { useToast } from '../hooks/use-toast'

const Auth: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn, signUp, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password)
        if (error) {
          toast({
            title: 'Sign In Failed',
            description: error,
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Welcome back!',
            description: 'You have successfully signed in.',
          })
          navigate('/dashboard')
        }
      } else {
        const { error } = await signUp(email, password, fullName)
        if (error) {
          toast({
            title: 'Sign Up Failed',
            description: error,
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Account Created!',
            description: 'Please check your email to verify your account.',
          })
          setMode('signin')
        }
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A] flex flex-col justify-center p-4 relative">
      {/* Back Home Link - Always visible */}
      <div className="w-full max-w-6xl mx-auto flex justify-start pt-4 pb-2">
        <Link to="/" className="inline-flex items-center space-x-2 text-gray-400 hover:text-white text-sm font-medium">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to home</span>
        </Link>
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#3861FB] rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-[#16C784] rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-[#EA3943] rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative z-10 flex-1">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <Link to="/" className="inline-flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-br from-[#3861FB] to-[#4F46E5] p-3 rounded-xl">
              <img 
                src="/cryptoAlarmLogo.png" 
                alt="CryptoAlarm Logo" 
                width={32} 
                height={32} 
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">CryptoAlarm</h1>
              <p className="text-gray-400">Professional Crypto Monitoring</p>
            </div>
          </Link>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Never Miss a<br />
              <span className="text-[#3861FB]">Crypto Move</span>
            </h2>
            
            <p className="text-lg text-gray-300">
              Get instant voice call alerts when your crypto price targets are reached. Professional monitoring with real-time notifications.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-[#3861FB]/20 p-2 rounded-lg">
                  <Bell className="h-5 w-5 text-[#3861FB]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Smart Alerts</h3>
                  <p className="text-gray-400 text-sm">Set price targets for 11+ cryptocurrencies</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-[#16C784]/20 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-[#16C784]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Real-time Monitoring</h3>
                  <p className="text-gray-400 text-sm">Live price updates every 2 seconds</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-[#EA3943]/20 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-[#EA3943]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Secure & Reliable</h3>
                  <p className="text-gray-400 text-sm">24/7 monitoring with voice notifications</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
  <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg">
          <CardHeader className="space-y-1">
            {/* Back Home Link for mobile (hidden, now always visible above) */}
            <CardTitle className="text-2xl font-bold text-white text-center">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-gray-400 text-center">
              {mode === 'signin' 
                ? 'Sign in to access your crypto alerts' 
                : 'Start monitoring your crypto portfolio today'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-200">
                    Full Name
                  </Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                      required={mode === 'signup'}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {mode === 'signup' && (
                  <p className="text-xs text-gray-400">Must be at least 6 characters</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#3861FB] hover:bg-[#2851FB] text-white h-11"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  mode === 'signin' ? 'Sign In' : 'Sign Up'
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900/50 text-gray-400">or</span>
                </div>
              </div>

              <div className="text-center mb-4">
                <Button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-100 disabled:opacity-60"
                  disabled
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#EA4335" d="M21.6 12.227c0-.638-.057-1.252-.163-1.84H12v3.481h5.37a4.593 4.593 0 0 1-1.993 3.013v2.497h3.22c1.89-1.744 2.983-4.314 2.983-7.151z"/><path fill="#34A853" d="M12 22c2.43 0 4.47-.805 5.96-2.188l-3.22-2.497c-.895.601-2.037.956-3.29.956-2.53 0-4.678-1.707-5.44-4.004H2.66v2.522A9.997 9.997 0 0 0 12 22z"/><path fill="#4A90E2" d="M6.56 13.267a5.996 5.996 0 0 1 0-3.534V7.211H2.66a9.997 9.997 0 0 0 0 9.578l3.9-3.522z"/><path fill="#FBBC05" d="M12 6.438c1.324 0 2.51.456 3.445 1.352l2.58-2.58C16.47 3.805 14.43 3 12 3A9.997 9.997 0 0 0 2.66 7.211l3.9 3.522C7.322 8.145 9.47 6.438 12 6.438z"/></svg>
                  Login with Google
                </Button>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-[#3861FB] hover:text-[#2851FB] font-medium text-sm"
                >
                  {mode === 'signin' 
                    ? "Don't have an account? Sign up" 
                    : 'Already have an account? Sign in'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto py-4 flex justify-between items-center text-xs text-gray-400 border-t border-gray-800 mt-8">
        <div className="space-x-4">
          <Link to="/help" className="hover:text-white">Help</Link>
          <Link to="/terms" className="hover:text-white">Terms</Link>
          <Link to="/privacy" className="hover:text-white">Privacy</Link>
        </div>
        <div>
          <a href="#" className="hover:text-white">Problems logging in?</a>
        </div>
        <span className="ml-2">v2.4.0</span>
      </footer>
    </div>
  )
}

export default Auth
