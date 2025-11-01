import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useAuth } from '../context/AuthContext'
import { Loader2, Mail, Lock, User as UserIcon } from 'lucide-react'
import { useToast } from '../hooks/use-toast'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  redirectTo?: string
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, redirectTo = '/dashboard' }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

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
          onClose()
          navigate(redirectTo)
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

  const handleClose = () => {
    setEmail('')
    setPassword('')
    setFullName('')
    setMode('signin')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gray-900/95 backdrop-blur-lg border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
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
                className="pl-10 bg-gray-800 border-gray-700 text-white"
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
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
                required
                minLength={6}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#3861FB] hover:bg-[#2851FB] text-white"
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

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-[#3861FB] hover:text-[#2851FB] font-medium"
            >
              {mode === 'signin' 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal
