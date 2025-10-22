"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { Bell, CheckCircle } from "lucide-react";

export default function TestAlertsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A] flex flex-col items-center justify-center">
      <Card className="bg-gray-900/70 border-gray-700 w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="h-6 w-6 text-[#3861FB] animate-pulse" />
            Test Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-gray-300 text-lg">Send a test alert to verify your notification settings.</div>
          <Button className="bg-[#3861FB] hover:bg-[#2851FB] text-white w-full">Send Test Alert</Button>
          <div className="flex items-center gap-2 text-green-400 text-sm mt-4">
            <CheckCircle className="h-4 w-4" />
            Test alert sent successfully!
          </div>
          <Link href="/alerts" className="block mt-6 text-[#3861FB] hover:underline text-center">Back to Alerts</Link>
        </CardContent>
      </Card>
    </div>
  );
}