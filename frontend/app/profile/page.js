"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../lib/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import Link from "next/link";
import { 
  User, Mail, Phone, Calendar, MapPin, Edit3, Save, X,
  Shield, Bell, CreditCard, Globe, Download, Upload,
  Settings, Star, Award, TrendingUp, BarChart3
} from "lucide-react";
import ResponsiveNavbar from "../../components/ResponsiveNavbar";
import ProfileAvatar from "../../components/ProfileAvatar";

export default function ProfilePage() {
  const { user, profile, updateProfile, updateAvatar, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    location: "",
    bio: "",
    preferences: {
      notifications: true,
      marketing: false,
      newsletter: true
    }
  });

  // Initialize form data
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
        location: profile.location || "",
        bio: profile.bio || "",
        preferences: {
          notifications: profile.preferences?.notifications !== false,
          marketing: profile.preferences?.marketing || false,
          newsletter: profile.preferences?.newsletter !== false
        }
      });
    }
  }, [profile]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      const result = await updateProfile(formData);
      if (result.error) {
        throw new Error(result.error);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  const handleCancel = () => {
    // Reset form data to original profile data
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
        location: profile.location || "",
        bio: profile.bio || "",
        preferences: {
          notifications: profile.preferences?.notifications !== false,
          marketing: profile.preferences?.marketing || false,
          newsletter: profile.preferences?.newsletter !== false
        }
      });
    }
    setIsEditing(false);
  };

  const handleAvatarUpdate = async (avatarData, file) => {
    try {
      const result = await updateAvatar(avatarData);
      if (result?.error) {
        throw new Error(result.error);
      }
      console.log("Avatar updated successfully");
      return result;
    } catch (error) {
      console.error("Error updating avatar:", error);
      const errorMessage = error.message || "Error updating avatar. Please try again.";
      alert(errorMessage);
      throw error; // Re-throw so ProfileAvatar component can handle it
    }
  };

  // If not authenticated, redirect to login
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A] flex items-center justify-center">
        <ResponsiveNavbar 
          title="Profile"
          subtitle="Manage your account information"
          showBackButton={true}
          backUrl="/dashboard"
        />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-300 mb-6">Please sign in to access your profile.</p>
          <Link href="/dashboard">
            <Button className="bg-[#3861FB] hover:bg-[#2851FB] text-white">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // If loading authentication state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A] flex items-center justify-center">
        <ResponsiveNavbar 
          title="Profile"
          subtitle="Loading..."
          showBackButton={true}
          backUrl="/dashboard"
        />
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#3861FB]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      <ResponsiveNavbar 
        title="My Profile"
        subtitle="Manage your account information"
        showBackButton={true}
        backUrl="/dashboard"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Profile", href: "/profile" }
        ]}
      />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="mb-8">
            <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                  {/* Profile Avatar - Editable */}
                  <ProfileAvatar 
                    user={user} 
                    profile={profile} 
                    size="xl"
                    editable={true}
                    onAvatarUpdate={handleAvatarUpdate}
                    className=""
                  />

                  {/* User Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl font-bold text-white mb-2">
                      {profile?.first_name && profile?.last_name 
                        ? `${profile.first_name} ${profile.last_name}`
                        : profile?.full_name || 'User'
                      }
                    </h1>
                    <p className="text-gray-300 mb-4">{user?.email}</p>
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                      <Badge className="bg-[#16C784]/20 text-[#16C784] border-[#16C784]/30">
                        ✅ Verified Email
                      </Badge>
                      <Badge className="bg-[#3861FB]/20 text-[#3861FB] border-[#3861FB]/30">
                        🔔 Alerts Active
                      </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      {!isEditing ? (
                        <Button 
                          onClick={() => setIsEditing(true)}
                          className="bg-[#3861FB] hover:bg-[#2851FB] text-white"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      ) : (
                        <div className="space-x-2">
                          <Button 
                            onClick={handleSave}
                            className="bg-[#16C784] hover:bg-[#14B575] text-white"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button 
                            onClick={handleCancel}
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <User className="h-5 w-5 mr-2 text-[#3861FB]" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        First Name
                      </label>
                      {isEditing ? (
                        <Input
                          value={formData.first_name}
                          onChange={(e) => handleInputChange('first_name', e.target.value)}
                          placeholder="Enter first name"
                          className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                        />
                      ) : (
                        <div className="text-white bg-gray-800/30 border border-gray-700 rounded-lg px-3 py-2">
                          {profile?.first_name || "Not set"}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Last Name
                      </label>
                      {isEditing ? (
                        <Input
                          value={formData.last_name}
                          onChange={(e) => handleInputChange('last_name', e.target.value)}
                          placeholder="Enter last name"
                          className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                        />
                      ) : (
                        <div className="text-white bg-gray-800/30 border border-gray-700 rounded-lg px-3 py-2">
                          {profile?.last_name || "Not set"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter phone number"
                        className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                      />
                    ) : (
                      <div className="text-white bg-gray-800/30 border border-gray-700 rounded-lg px-3 py-2">
                        {profile?.phone || "Not set"}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Location
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Enter your location"
                        className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                      />
                    ) : (
                      <div className="text-white bg-gray-800/30 border border-gray-700 rounded-lg px-3 py-2">
                        {profile?.location || "Not set"}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="Tell us about yourself..."
                        rows={3}
                        className="w-full bg-gray-800/50 border border-gray-600 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#3861FB]/50 focus:border-[#3861FB]"
                      />
                    ) : (
                      <div className="text-white bg-gray-800/30 border border-gray-700 rounded-lg px-3 py-2 min-h-[80px]">
                        {profile?.bio || "No bio available"}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Account Preferences */}
              <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-[#3861FB]" />
                    Account Preferences
                  </CardTitle>
                  <CardDescription>
                    Manage your notification and communication preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                      <div>
                        <div className="text-white font-medium">Push Notifications</div>
                        <div className="text-gray-400 text-sm">Receive alerts for price movements</div>
                      </div>
                      {isEditing ? (
                        <input
                          type="checkbox"
                          checked={formData.preferences.notifications}
                          onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                          className="w-4 h-4 text-[#3861FB] bg-gray-800 border-gray-600 rounded focus:ring-[#3861FB] focus:ring-2"
                        />
                      ) : (
                        <Badge className={profile?.preferences?.notifications !== false 
                          ? "bg-[#16C784]/20 text-[#16C784] border-[#16C784]/30" 
                          : "bg-gray-600/20 text-gray-400 border-gray-600/30"
                        }>
                          {profile?.preferences?.notifications !== false ? "Enabled" : "Disabled"}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                      <div>
                        <div className="text-white font-medium">Marketing Emails</div>
                        <div className="text-gray-400 text-sm">Receive updates and promotions</div>
                      </div>
                      {isEditing ? (
                        <input
                          type="checkbox"
                          checked={formData.preferences.marketing}
                          onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                          className="w-4 h-4 text-[#3861FB] bg-gray-800 border-gray-600 rounded focus:ring-[#3861FB] focus:ring-2"
                        />
                      ) : (
                        <Badge className={profile?.preferences?.marketing 
                          ? "bg-[#16C784]/20 text-[#16C784] border-[#16C784]/30" 
                          : "bg-gray-600/20 text-gray-400 border-gray-600/30"
                        }>
                          {profile?.preferences?.marketing ? "Enabled" : "Disabled"}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                      <div>
                        <div className="text-white font-medium">Newsletter</div>
                        <div className="text-gray-400 text-sm">Weekly crypto market insights</div>
                      </div>
                      {isEditing ? (
                        <input
                          type="checkbox"
                          checked={formData.preferences.newsletter}
                          onChange={(e) => handlePreferenceChange('newsletter', e.target.checked)}
                          className="w-4 h-4 text-[#3861FB] bg-gray-800 border-gray-600 rounded focus:ring-[#3861FB] focus:ring-2"
                        />
                      ) : (
                        <Badge className={profile?.preferences?.newsletter !== false 
                          ? "bg-[#16C784]/20 text-[#16C784] border-[#16C784]/30" 
                          : "bg-gray-600/20 text-gray-400 border-gray-600/30"
                        }>
                          {profile?.preferences?.newsletter !== false ? "Enabled" : "Disabled"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Stats */}
              <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Account Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-[#3861FB]" />
                      <span className="text-gray-300 text-sm">Active Alerts</span>
                    </div>
                    <span className="text-white font-semibold">3</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-[#16C784]" />
                      <span className="text-gray-300 text-sm">Triggered Today</span>
                    </div>
                    <span className="text-white font-semibold">1</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-[#EA3943]" />
                      <span className="text-gray-300 text-sm">Member Since</span>
                    </div>
                    <span className="text-white font-semibold text-sm">
                      {user?.created_at 
                        ? new Date(user.created_at).toLocaleDateString()
                        : 'Recently'
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/dashboard">
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800/50">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Dashboard
                    </Button>
                  </Link>
                  
                  <Link href="/settings">
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800/50">
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </Button>
                  </Link>
                  
                  <Link href="/security">
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800/50">
                      <Shield className="h-4 w-4 mr-2" />
                      Security Settings
                    </Button>
                  </Link>
                  
                  <Link href="/premium">
                    <Button variant="ghost" className="w-full justify-start text-[#16C784] hover:text-[#14B575] hover:bg-[#16C784]/10">
                      <Star className="h-4 w-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card className="bg-gradient-to-br from-[#16C784]/10 to-[#3861FB]/10 border-[#16C784]/30 backdrop-blur-lg">
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 text-[#16C784] mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Premium Ready</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Upgrade to unlock advanced features and priority support
                  </p>
                  <Link href="/premium">
                    <Button className="bg-[#16C784] hover:bg-[#14B575] text-white w-full">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}