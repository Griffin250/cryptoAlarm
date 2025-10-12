'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { toast } from './ui/toast'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export function QuickAuth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email.split('@')[0]
            }
          }
        })

        if (error) throw error

        if (data.user && !data.session) {
          toast.info('Check your email for the confirmation link!')
        } else {
          toast.success('Account created successfully!')
          window.location.reload()
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) throw error

        toast.success('Signed in successfully!')
        window.location.reload()
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const signInAsDemo = async () => {
    setLoading(true)
    try {
      // Create a demo user
      const demoEmail = `demo-${Date.now()}@cryptoalarm.demo`
      const demoPassword = 'demo123456'

      const { data, error } = await supabase.auth.signUp({
        email: demoEmail,
        password: demoPassword,
        options: {
          data: {
            full_name: 'Demo User'
          }
        }
      })

      if (error) throw error

      toast.success('Demo account created and signed in!')
      window.location.reload()
    } catch (error) {
      toast.error(`Demo signin failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isSignUp ? 'Create Account' : 'Sign In'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAuth} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </Button>
        </form>
        
        <div className="mt-4 space-y-2">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full" 
            onClick={signInAsDemo}
            disabled={loading}
          >
            Quick Demo (No email required)
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}