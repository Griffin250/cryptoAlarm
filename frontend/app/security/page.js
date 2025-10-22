"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Input } from "../../components/ui/input";
import ResponsiveNavbar from "../../components/ResponsiveNavbar";
import { useAuth } from "../../lib/AuthContext";
import AuthModal from "../../components/AuthModal";
import { 
  Shield, Lock, Eye, EyeOff, Key, AlertTriangle, 
  CheckCircle, Smartphone, Mail, Clock
} from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function SecurityPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const { user, loading, isAuthenticated } = useAuth();

  // Show auth modal if user is not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [loading, isAuthenticated]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
        <ResponsiveNavbar 
          title="Security" 
          subtitle="Account security settings" 
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#3861FB] border-t-transparent"></div>
        </div>
      </div>
    );
  }

  // Show auth modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
        <ResponsiveNavbar 
          title="Security" 
          subtitle="Account security settings" 
        />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-[#3861FB] mx-auto mb-4" />
                <CardTitle className="text-white">Sign In Required</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-300">
                  Please sign in to access your security settings.
                </p>
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  className="w-full bg-[#3861FB] hover:bg-[#2851FB]"
                >
                  Sign In
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    );
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    // TODO: Implement password change logic
    setIsChangingPassword(true);
    // Simulate API call
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      <ResponsiveNavbar 
        title="Security Settings" 
        subtitle="Manage your account security" 
        showBackButton={true}
        backUrl="/profile"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Security Overview */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-[#16C784]" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-[#16C784]/30 bg-[#16C784]/10">
                <CheckCircle className="h-4 w-4 text-[#16C784]" />
                <AlertDescription className="text-[#16C784]">
                  Your account is secured with email authentication.
                </AlertDescription>
              </Alert>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
                  <Mail className="h-5 w-5 text-[#3861FB]" />
                  <div>
                    <div className="text-white text-sm font-medium">Email Verified</div>
                    <div className="text-gray-400 text-xs">{user?.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
                  <Key className="h-5 w-5 text-[#16C784]" />
                  <div>
                    <div className="text-white text-sm font-medium">Password Protected</div>
                    <div className="text-gray-400 text-xs">Strong encryption</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <div>
                    <div className="text-white text-sm font-medium">Session Active</div>
                    <div className="text-gray-400 text-xs">Secure connection</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Current Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Enter current password"
                      className="bg-gray-800/50 border-gray-600 text-white pr-10"
                      disabled={isChangingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Enter new password"
                      className="bg-gray-800/50 border-gray-600 text-white pr-10"
                      disabled={isChangingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm new password"
                      className="bg-gray-800/50 border-gray-600 text-white pr-10"
                      disabled={isChangingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="bg-[#3861FB] hover:bg-[#2851FB]"
                  disabled={isChangingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
                >
                  {isChangingPassword ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Updating Password...
                    </div>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                Account Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-yellow-500/30 bg-yellow-500/10">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="text-yellow-500">
                  These actions are irreversible. Please proceed with caution.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Delete Account</div>
                    <div className="text-gray-400 text-sm">Permanently delete your account and all data</div>
                  </div>
                  <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}