"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../lib/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import Link from "next/link";
import { 
  Settings, Bell, Phone, Globe, Shield, User, Volume2, Moon, Sun,
  Smartphone, Mail, Zap, AlertTriangle, CheckCircle, Save, ArrowLeft, 
  Eye, EyeOff, Key, CreditCard, Database, Clock, Target, Percent,
  BarChart3, Crown, Lock, Unlock, AlertCircle, Info
} from "lucide-react";
import ResponsiveNavbar from "../../components/ResponsiveNavbar";
import ProfileAvatar from "../../components/ProfileAvatar";

export default function SettingsPage() {
  const { user, profile, updateProfile, loading } = useAuth();
  const [activeSection, setActiveSection] = useState("alerts");
  const [saveMessage, setSaveMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    // Alert Settings
    phoneNumber: "",
    emailAlerts: true,
    phoneAlerts: true,
    alertSound: true,
    alertFrequency: "immediate", // "immediate", "5min", "15min", "1hour"
    priceChangeThreshold: 5, // percentage
    volumeThreshold: 1000000,
    
    // Notification Settings
    pushNotifications: true,
    emailNotifications: true,
    smsBackup: false,
    marketingEmails: false,
    newsletter: true,
    weeklyReports: true,
    
    // Account Settings
    autoSave: true,
    sessionTimeout: "1hour", // "30min", "1hour", "4hours", "never"
    dataExport: false,
    accountStatus: "active",
    
    // Security Settings
    twoFactorAuth: false,
    loginNotifications: true,
    passwordExpiry: "never", // "30days", "90days", "never"
    trustedDevices: [],
    
    // Appearance Settings
    theme: "dark", // "light", "dark", "auto"
    currency: "USD", // "USD", "EUR", "BTC", "ETH"
    timezone: "auto",
    compactMode: false,
    
    // Advanced Settings
    apiAccess: false,
    webhookUrl: "",
    dataRetention: "1year", // "6months", "1year", "2years", "forever"
    debugMode: false
  });

  // Initialize settings from profile
  useEffect(() => {
    if (profile) {
      setSettings(prev => ({
        ...prev,
        phoneNumber: profile.phone || "",
        emailAlerts: profile.preferences?.notifications !== false,
        emailNotifications: profile.preferences?.notifications !== false,
        marketingEmails: profile.preferences?.marketing || false,
        newsletter: profile.preferences?.newsletter !== false,
      }));
    }
  }, [profile]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Update profile with relevant settings
      const profileUpdate = {
        phone: settings.phoneNumber,
        preferences: {
          notifications: settings.emailNotifications,
          marketing: settings.marketingEmails,
          newsletter: settings.newsletter
        }
      };
      
      const result = await updateProfile(profileUpdate);
      if (result.error) {
        throw new Error(result.error);
      }
      
      setSaveMessage("Settings saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveMessage("Error saving settings. Please try again.");
      setTimeout(() => setSaveMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const sections = [
    { id: "alerts", name: "Alert Settings", icon: Bell, color: "text-[#3861FB]" },
    { id: "notifications", name: "Notifications", icon: Volume2, color: "text-[#16C784]" },
    { id: "account", name: "Account", icon: User, color: "text-[#EA3943]" },
    { id: "security", name: "Security", icon: Shield, color: "text-orange-500" },
    { id: "appearance", name: "Appearance", icon: Moon, color: "text-purple-500" },
    { id: "advanced", name: "Advanced", icon: Settings, color: "text-gray-400" }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-300 mb-6">Please sign in to access settings.</p>
          <Link href="/dashboard">
            <Button className="bg-[#3861FB] hover:bg-[#2851FB] text-white">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#3861FB]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      <ResponsiveNavbar 
        title="Settings"
        subtitle="Manage your account preferences"
        showBackButton={true}
        backUrl="/dashboard"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings", href: "/settings" }
        ]}
        actions={[
          <Button 
            key="save"
            onClick={handleSave}
            disabled={isLoading}
            className="bg-[#16C784] hover:bg-[#14B575] text-white"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save All
              </>
            )}
          </Button>
        ]}
      />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Save Message */}
          {saveMessage && (
            <Alert className="mb-6 bg-[#16C784]/10 border-[#16C784]/30">
              <CheckCircle className="h-4 w-4 text-[#16C784]" />
              <AlertDescription className="text-[#16C784]">
                {saveMessage}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <ProfileAvatar 
                      user={user} 
                      profile={profile} 
                      size="sm"
                      className=""
                    />
                    <div>
                      <CardTitle className="text-white text-sm">
                        {profile?.first_name && profile?.last_name 
                          ? `${profile.first_name} ${profile.last_name}`
                          : 'User Settings'
                        }
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {user?.email}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <nav className="space-y-2">
                    {sections.map((section) => (
                      <Button
                        key={section.id}
                        variant={activeSection === section.id ? "secondary" : "ghost"}
                        className={`w-full justify-start text-left ${
                          activeSection === section.id 
                            ? "bg-[#3861FB]/20 text-[#3861FB] border-[#3861FB]/30" 
                            : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                        }`}
                        onClick={() => setActiveSection(section.id)}
                      >
                        <section.icon className={`h-4 w-4 mr-3 ${
                          activeSection === section.id ? "text-[#3861FB]" : section.color
                        }`} />
                        {section.name}
                      </Button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              {/* Alert Settings */}
              {activeSection === "alerts" && (
                <div className="space-y-6">
                  <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Bell className="h-5 w-5 mr-2 text-[#3861FB]" />
                        Alert Configuration
                      </CardTitle>
                      <CardDescription>
                        Configure how and when you receive cryptocurrency alerts
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-gray-300 mb-2 block">
                            Phone Number for Alerts
                          </label>
                          <Input
                            value={settings.phoneNumber}
                            onChange={(e) => handleSettingChange('phoneNumber', e.target.value)}
                            placeholder="+1 (555) 123-4567"
                            className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            Used for voice call alerts when price targets are reached
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-300 mb-2 block">
                            Alert Frequency
                          </label>
                          <select
                            value={settings.alertFrequency}
                            onChange={(e) => handleSettingChange('alertFrequency', e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3861FB]/50 focus:border-[#3861FB]"
                          >
                            <option value="immediate">Immediate</option>
                            <option value="5min">Every 5 minutes</option>
                            <option value="15min">Every 15 minutes</option>
                            <option value="1hour">Every hour</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Phone className="h-5 w-5 text-[#16C784]" />
                            <div>
                              <div className="text-white font-medium">Voice Call Alerts</div>
                              <div className="text-gray-400 text-sm">Get phone calls when targets are reached</div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.phoneAlerts}
                            onChange={(e) => handleSettingChange('phoneAlerts', e.target.checked)}
                            className="w-4 h-4 text-[#3861FB] bg-gray-800 border-gray-600 rounded focus:ring-[#3861FB] focus:ring-2"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Mail className="h-5 w-5 text-[#3861FB]" />
                            <div>
                              <div className="text-white font-medium">Email Alerts</div>
                              <div className="text-gray-400 text-sm">Receive email notifications for price changes</div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.emailAlerts}
                            onChange={(e) => handleSettingChange('emailAlerts', e.target.checked)}
                            className="w-4 h-4 text-[#3861FB] bg-gray-800 border-gray-600 rounded focus:ring-[#3861FB] focus:ring-2"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Volume2 className="h-5 w-5 text-orange-500" />
                            <div>
                              <div className="text-white font-medium">Alert Sound</div>
                              <div className="text-gray-400 text-sm">Play sound when alerts trigger</div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.alertSound}
                            onChange={(e) => handleSettingChange('alertSound', e.target.checked)}
                            className="w-4 h-4 text-[#3861FB] bg-gray-800 border-gray-600 rounded focus:ring-[#3861FB] focus:ring-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Target className="h-5 w-5 mr-2 text-[#EA3943]" />
                        Alert Thresholds
                      </CardTitle>
                      <CardDescription>
                        Set minimum thresholds for triggering alerts
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-300 mb-2 block">
                            Price Change Threshold (%)
                          </label>
                          <Input
                            type="number"
                            value={settings.priceChangeThreshold}
                            onChange={(e) => handleSettingChange('priceChangeThreshold', parseFloat(e.target.value))}
                            className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            Minimum percentage change to trigger alerts
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-300 mb-2 block">
                            Volume Threshold (USD)
                          </label>
                          <Input
                            type="number"
                            value={settings.volumeThreshold}
                            onChange={(e) => handleSettingChange('volumeThreshold', parseInt(e.target.value))}
                            className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            Minimum trading volume for alerts
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Notification Settings */}
              {activeSection === "notifications" && (
                <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Volume2 className="h-5 w-5 mr-2 text-[#16C784]" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>
                      Manage your notification and communication settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="h-5 w-5 text-[#3861FB]" />
                          <div>
                            <div className="text-white font-medium">Push Notifications</div>
                            <div className="text-gray-400 text-sm">Browser notifications for alerts</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.pushNotifications}
                          onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                          className="w-4 h-4 text-[#3861FB] bg-gray-800 border-gray-600 rounded focus:ring-[#3861FB] focus:ring-2"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-[#16C784]" />
                          <div>
                            <div className="text-white font-medium">Email Notifications</div>
                            <div className="text-gray-400 text-sm">Receive notifications via email</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                          className="w-4 h-4 text-[#3861FB] bg-gray-800 border-gray-600 rounded focus:ring-[#3861FB] focus:ring-2"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="h-5 w-5 text-orange-500" />
                          <div>
                            <div className="text-white font-medium">SMS Backup</div>
                            <div className="text-gray-400 text-sm">SMS notifications when email fails</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.smsBackup}
                          onChange={(e) => handleSettingChange('smsBackup', e.target.checked)}
                          className="w-4 h-4 text-[#3861FB] bg-gray-800 border-gray-600 rounded focus:ring-[#3861FB] focus:ring-2"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-5 w-5 text-purple-500" />
                          <div>
                            <div className="text-white font-medium">Marketing Emails</div>
                            <div className="text-gray-400 text-sm">Product updates and promotions</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.marketingEmails}
                          onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
                          className="w-4 h-4 text-[#3861FB] bg-gray-800 border-gray-600 rounded focus:ring-[#3861FB] focus:ring-2"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <BarChart3 className="h-5 w-5 text-[#16C784]" />
                          <div>
                            <div className="text-white font-medium">Weekly Reports</div>
                            <div className="text-gray-400 text-sm">Summary of your alerts and market activity</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.weeklyReports}
                          onChange={(e) => handleSettingChange('weeklyReports', e.target.checked)}
                          className="w-4 h-4 text-[#3861FB] bg-gray-800 border-gray-600 rounded focus:ring-[#3861FB] focus:ring-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Account Settings */}
              {activeSection === "account" && (
                <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <User className="h-5 w-5 mr-2 text-[#EA3943]" />
                      Account Management
                    </CardTitle>
                    <CardDescription>
                      Manage your account settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Save className="h-5 w-5 text-[#3861FB]" />
                          <div>
                            <div className="text-white font-medium">Auto-Save Settings</div>
                            <div className="text-gray-400 text-sm">Automatically save changes</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.autoSave}
                          onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                          className="w-4 h-4 text-[#3861FB] bg-gray-800 border-gray-600 rounded focus:ring-[#3861FB] focus:ring-2"
                        />
                      </div>

                      <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3 mb-3">
                          <Clock className="h-5 w-5 text-orange-500" />
                          <div>
                            <div className="text-white font-medium">Session Timeout</div>
                            <div className="text-gray-400 text-sm">Auto-logout after inactivity</div>
                          </div>
                        </div>
                        <select
                          value={settings.sessionTimeout}
                          onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                          className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3861FB]/50 focus:border-[#3861FB]"
                        >
                          <option value="30min">30 minutes</option>
                          <option value="1hour">1 hour</option>
                          <option value="4hours">4 hours</option>
                          <option value="never">Never</option>
                        </select>
                      </div>
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                      <h4 className="text-white font-medium mb-4 flex items-center">
                        <Database className="h-4 w-4 mr-2 text-[#16C784]" />
                        Data Management
                      </h4>
                      <div className="space-y-3">
                        <Link href="/profile">
                          <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800">
                            <User className="h-4 w-4 mr-2" />
                            Edit Profile Information
                          </Button>
                        </Link>
                        
                        <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800">
                          <Database className="h-4 w-4 mr-2" />
                          Export Account Data
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Security Settings */}
              {activeSection === "security" && (
                <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-orange-500" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your account security and privacy
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert className="bg-orange-500/10 border-orange-500/30">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <AlertDescription className="text-orange-300">
                        Security features are coming soon. Enable two-factor authentication for enhanced security.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Shield className="h-5 w-5 text-[#16C784]" />
                          <div>
                            <div className="text-white font-medium">Two-Factor Authentication</div>
                            <div className="text-gray-400 text-sm">Add extra security to your account</div>
                          </div>
                        </div>
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                          Coming Soon
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Bell className="h-5 w-5 text-[#3861FB]" />
                          <div>
                            <div className="text-white font-medium">Login Notifications</div>
                            <div className="text-gray-400 text-sm">Get notified of new login attempts</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.loginNotifications}
                          onChange={(e) => handleSettingChange('loginNotifications', e.target.checked)}
                          className="w-4 h-4 text-[#3861FB] bg-gray-800 border-gray-600 rounded focus:ring-[#3861FB] focus:ring-2"
                        />
                      </div>
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                      <h4 className="text-white font-medium mb-4 flex items-center">
                        <Key className="h-4 w-4 mr-2 text-[#EA3943]" />
                        Password & Access
                      </h4>
                      <div className="space-y-3">
                        <Link href="/security">
                          <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800">
                            <Key className="h-4 w-4 mr-2" />
                            Change Password
                          </Button>
                        </Link>
                        
                        <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800">
                          <Smartphone className="h-4 w-4 mr-2" />
                          Manage Trusted Devices
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Appearance Settings */}
              {activeSection === "appearance" && (
                <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Moon className="h-5 w-5 mr-2 text-purple-500" />
                      Appearance & Display
                    </CardTitle>
                    <CardDescription>
                      Customize how CryptoAlarm looks and feels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-3 block">
                          Theme
                        </label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3 p-3 bg-gray-800/30 border border-gray-700 rounded-lg">
                            <input
                              type="radio"
                              id="theme-dark"
                              name="theme"
                              value="dark"
                              checked={settings.theme === "dark"}
                              onChange={(e) => handleSettingChange('theme', e.target.value)}
                              className="w-4 h-4 text-[#3861FB] bg-gray-800 border-gray-600 focus:ring-[#3861FB] focus:ring-2"
                            />
                            <Moon className="h-4 w-4 text-purple-500" />
                            <label htmlFor="theme-dark" className="text-white">Dark Mode</label>
                          </div>
                          
                          <div className="flex items-center space-x-3 p-3 bg-gray-800/30 border border-gray-700 rounded-lg">
                            <input
                              type="radio"
                              id="theme-light"
                              name="theme"
                              value="light"
                              checked={settings.theme === "light"}
                              onChange={(e) => handleSettingChange('theme', e.target.value)}
                              className="w-4 h-4 text-[#3861FB] bg-gray-800 border-gray-600 focus:ring-[#3861FB] focus:ring-2"
                            />
                            <Sun className="h-4 w-4 text-yellow-500" />
                            <label htmlFor="theme-light" className="text-white">Light Mode</label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Default Currency
                        </label>
                        <select
                          value={settings.currency}
                          onChange={(e) => handleSettingChange('currency', e.target.value)}
                          className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3861FB]/50 focus:border-[#3861FB]"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="BTC">BTC (₿)</option>
                          <option value="ETH">ETH (Ξ)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <BarChart3 className="h-5 w-5 text-[#3861FB]" />
                        <div>
                          <div className="text-white font-medium">Compact Mode</div>
                          <div className="text-gray-400 text-sm">Show more information in less space</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.compactMode}
                        onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                        className="w-4 h-4 text-[#3861FB] bg-gray-800 border-gray-600 rounded focus:ring-[#3861FB] focus:ring-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Advanced Settings */}
              {activeSection === "advanced" && (
                <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-gray-400" />
                      Advanced Settings
                    </CardTitle>
                    <CardDescription>
                      Developer options and advanced configurations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert className="bg-[#3861FB]/10 border-[#3861FB]/30">
                      <Info className="h-4 w-4 text-[#3861FB]" />
                      <AlertDescription className="text-[#3861FB]">
                        Advanced features are designed for developers and power users.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Key className="h-5 w-5 text-orange-500" />
                          <div>
                            <div className="text-white font-medium">API Access</div>
                            <div className="text-gray-400 text-sm">Enable programmatic access to your alerts</div>
                          </div>
                        </div>
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                          Coming Soon
                        </Badge>
                      </div>

                      <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3 mb-3">
                          <Zap className="h-5 w-5 text-[#16C784]" />
                          <div>
                            <div className="text-white font-medium">Webhook URL</div>
                            <div className="text-gray-400 text-sm">Receive alerts via HTTP POST requests</div>
                          </div>
                        </div>
                        <Input
                          value={settings.webhookUrl}
                          onChange={(e) => handleSettingChange('webhookUrl', e.target.value)}
                          placeholder="https://your-server.com/webhook"
                          className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                          disabled
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="h-5 w-5 text-[#EA3943]" />
                          <div>
                            <div className="text-white font-medium">Debug Mode</div>
                            <div className="text-gray-400 text-sm">Show additional debugging information</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.debugMode}
                          onChange={(e) => handleSettingChange('debugMode', e.target.checked)}
                          className="w-4 h-4 text-[#3861FB] bg-gray-800 border-gray-600 rounded focus:ring-[#3861FB] focus:ring-2"
                        />
                      </div>
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                      <h4 className="text-white font-medium mb-4 flex items-center">
                        <Database className="h-4 w-4 mr-2 text-purple-500" />
                        Data Retention
                      </h4>
                      <select
                        value={settings.dataRetention}
                        onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
                        className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3861FB]/50 focus:border-[#3861FB]"
                      >
                        <option value="6months">6 months</option>
                        <option value="1year">1 year</option>
                        <option value="2years">2 years</option>
                        <option value="forever">Forever</option>
                      </select>
                      <p className="text-xs text-gray-400 mt-2">
                        How long to keep your alert history and account data
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}