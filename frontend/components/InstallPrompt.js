"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Download, X } from "lucide-react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    setDeferredPrompt(null);
  };

  if (!showInstallBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md">
      <div className="bg-gradient-to-r from-[#3861FB] to-[#4F46E5] p-4 rounded-lg shadow-lg border border-blue-500/30">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">Install CryptoAlarm</p>
            <p className="text-blue-100 text-xs">Add to your home screen for quick access</p>
          </div>
          <div className="flex items-center space-x-2 ml-3">
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white text-blue-600 hover:bg-blue-50 border-white text-xs px-3"
              onClick={handleInstall}
            >
              <Download className="h-3 w-3 mr-1" />
              Install
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-white hover:bg-white/20 p-1"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}