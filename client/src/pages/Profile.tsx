import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import StandardNavbar from '../components/StandardNavbar'
import AuthModal from '../components/AuthModal'
import { 
  User, Mail, Phone, Calendar, MapPin, Edit3, Save, X,
  Shield, Bell, Settings, Star
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface ProfileData {
  full_name: string
  phone: string
  location: string
  preferences: {
    email: boolean
    sms: boolean
    push: boolean
  }
}

const ProfilePage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<ProfileData>({
    full_name: '',
    phone: '',
    location: '',
    preferences: {
      email: true,
      sms: false,
      push: true
    }
  })
  
  const { user, profile, updateProfile, signOut } = useAuth()

  // Show auth modal if user is not authenticated
  useEffect(() => {
    if (!user) {
      setShowAuthModal(true)
    }
  }, [user])

  // Initialize form data from profile
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone_number || '',
        location: profile.timezone || '',
        preferences: profile.notification_preferences || {
          email: true,
          sms: false,
          push: true
        }
      })
    }
  }, [profile])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
        <StandardNavbar 
          title="Profile" 
          subtitle="Manage your account" 
        />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader className="text-center">
                <User className="h-12 w-12 text-[#3861FB] mx-auto mb-4" />
                <CardTitle className="text-white">Sign In Required</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-300">
                  Please sign in to view and manage your profile.
                </p>
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  className="w-full bg-[#3861FB] hover:bg-[#2851FB]"
                >
                  Sign In to View Profile
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
    )
  }

  const handleSaveProfile = async () => {
    const updates = {
      full_name: formData.full_name,
      phone_number: formData.phone,
      timezone: formData.location,
      notification_preferences: formData.preferences,
    }
    const result = await updateProfile(updates)
    if (!result.error) {
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    // Reset form data to latest profile
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone_number || '',
        location: profile.timezone || '',
        preferences: profile.notification_preferences || {
          email: true,
          sms: false,
          push: true
        }
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      <StandardNavbar 
        title="Profile" 
        subtitle="Manage your account" 
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Profile Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-gray-300">
              Manage your account information and preferences
            </p>
          </div>

          {/* Profile Information */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <>
                    <Button
                      size="sm"
                      onClick={handleSaveProfile}
                      className="bg-[#16C784] hover:bg-[#16C784]/80"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelEdit}
                      className="text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#3861FB] to-[#4F46E5] rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">
                    {formData.full_name ? formData.full_name : 'User Profile'}
                  </h3>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  <Badge className="bg-[#16C784]/20 text-[#16C784] mt-1">
                    Verified Account
                  </Badge>
                </div>
              </div>

              {/* Profile Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Full Name
                  </label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="bg-gray-800/50 border-gray-600 text-white"
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      value={user.email || ''}
                      className="bg-gray-800/30 border-gray-600 text-gray-400 pl-10"
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-gray-800/50 border-gray-600 text-white pl-10"
                      disabled={!isEditing}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-300">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="bg-gray-800/50 border-gray-600 text-white pl-10"
                      disabled={!isEditing}
                      placeholder="Enter your location"
                    />
                  </div>
                </div>

                {/* Removed Bio field, not present in UserProfile */}
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Account Status</p>
                    <p className="text-gray-400 text-sm">Your account is active</p>
                  </div>
                  <Badge className="bg-[#16C784]/20 text-[#16C784]">
                    Active
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Member Since</p>
                    <p className="text-gray-400 text-sm">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Subscription Plan</p>
                    <p className="text-gray-400 text-sm">Free Tier</p>
                  </div>
                  <Star className="h-5 w-5 text-gray-400" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Notification Preferences</p>
                    <p className="text-gray-400 text-sm">Email & Phone alerts</p>
                  </div>
                  <Bell className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Account Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Shield className="h-4 w-4 mr-3" />
                  Security Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Bell className="h-4 w-4 mr-3" />
                  Notification Settings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-600 text-red-400 hover:bg-gray-800 mt-2"
                  onClick={async () => { await signOut(); }}
                >
                  <Shield className="h-4 w-4 mr-3" />
                  Log Out
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Active Alerts</span>
                  <span className="text-white font-medium">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Portfolio Holdings</span>
                  <span className="text-white font-medium">4 Assets</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Portfolio Value</span>
                  <span className="text-[#16C784] font-medium">$125,847.32</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Join Date</span>
                  <span className="text-white font-medium">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage