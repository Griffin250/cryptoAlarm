'use client'

import { AuthProvider } from "../../../lib/AuthContext"
import AlertManagerNew from "../../../components/AlertManagerNew"
import { DebugInfo } from "../../../components/DebugInfo"
import Link from "next/link"
import { ArrowLeft, Bell } from "lucide-react"

export default function AlertsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#1e2c47] to-[#0B1426]">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-[#3861FB]" />
            <h1 className="text-2xl font-bold text-white">CryptoAlarm Management</h1>
          </div>
        </div>

        {/* Auth Provider wrapping the alert system */}
        <AuthProvider>
          <div className="space-y-6">
            {/* Debug Info */}
            <DebugInfo />
            
            {/* Alert Manager */}
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-lg border border-gray-700 p-6">
              <AlertManagerNew />
            </div>
          </div>
        </AuthProvider>

        {/* Footer */}
        <footer className="mt-12 py-8 border-t border-gray-800">
          <div className="text-center text-gray-400 text-sm">
            <p>© 2025 CryptoAlarm. Smart alerts for smart traders.</p>
            <p className="mt-1">Voice notifications • Real-time monitoring • Supabase Powered</p>
          </div>
        </footer>
      </div>
    </div>
  )
}