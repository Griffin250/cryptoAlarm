'use client'

import { useEffect } from "react"
import { Button } from "../../../components/ui/button"
import ResponsiveNavbar from "../../../components/ResponsiveNavbar"
import Link from "next/link"
import { Bell } from "lucide-react"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function DashboardAlertsPage() {
  // Redirect to main alerts page
  useEffect(() => {
    window.location.href = '/alerts'
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      <ResponsiveNavbar 
        title="Redirecting..." 
        subtitle="Taking you to alerts page" 
      />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Bell className="h-12 w-12 text-[#3861FB] mx-auto animate-pulse" />
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#3861FB] border-t-transparent mx-auto"></div>
          <p className="text-gray-300">Redirecting to alerts page...</p>
          <Link href="/alerts">
            <Button className="bg-[#3861FB] hover:bg-[#2851FB]">
              Go to Alerts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}