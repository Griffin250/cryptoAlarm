"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import Link from "next/link";
import ResponsiveNavbar from "../../../components/ResponsiveNavbar";

// Force dynamic rendering to avoid build-time issues
export const dynamic = 'force-dynamic'
import { 
  Settings, Bell, Phone, Globe, Shield, User, Volume2, Moon, Sun,
  Smartphone, Mail, Zap, AlertTriangle, CheckCircle, Save,
  ArrowLeft, Eye, EyeOff, Key, CreditCard, Database
} from "lucide-react";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("alerts"); // "alerts", "notifications", "account", "security", "appearance", "advanced"
  const [phoneNumber, setPhoneNumber] = useState("+1234567890");
  const [email, setEmail] = useState("user@example.com");
  const [alertSound, setAlertSound] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsBackup, setSmsBackup] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSave = () => {
    // Mock save functionality
    setSaveMessage("Settings saved successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const sections = [
    { id: "alerts", name: "Alert Settings", icon: Bell },
    { id: "notifications", name: "Notifications", icon: Volume2 },
    { id: "account", name: "Account", icon: User },
    { id: "security", name: "Security", icon: Shield },
    { id: "appearance", name: "Appearance", icon: Moon },
    { id: "advanced", name: "Advanced", icon: Settings }
  ];

  const settingsBreadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Settings" }
  ];

  const settingsActions = [
    <>
      {saveMessage && (
        <div key="save-message" className="flex items-center space-x-2 text-green-400">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">{saveMessage}</span>
        </div>
      )}
      <Button 
        key="save-button"
        onClick={handleSave} 
        size="sm" 
        className="bg-[#16C784] hover:bg-[#14B575] text-white w-full md:w-auto"
      >
        <Save className="h-4 w-4 mr-2" />
        Save Changes
      </Button>
    </>
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
      <ResponsiveNavbar 
        title="CryptoAlarm"
        subtitle="Settings & Preferences"
        breadcrumbs={settingsBreadcrumbs}
        actions={settingsActions}
        showBackButton={true}
        backUrl="/dashboard"
        isConnected={true}
      />

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const IconComponent = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeSection === section.id 
                            ? "bg-[#3861FB] text-white" 
                            : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{section.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Alert Settings */}
            {activeSection === "alerts" && (
              <div className="space-y-6">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Voice Call Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number for Alerts
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]"
                          placeholder="+1234567890"
                        />
                        <Button size="sm" className="bg-[#3861FB] hover:bg-[#2851FB]">
                          <Phone className="h-4 w-4 mr-2" />
                          Test Call
                        </Button>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        Voice calls will be made to this number when price alerts trigger
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Alert Sound Effects</h4>
                        <p className="text-gray-400 text-sm">Play sound during voice calls</p>
                      </div>
                      <button
                        onClick={() => setAlertSound(!alertSound)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          alertSound ? "bg-[#16C784]" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            alertSound ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Alert Frequency Limit
                      </label>
                      <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]">
                        <option value="immediate">Immediate (No limit)</option>
                        <option value="5min">Maximum 1 per 5 minutes</option>
                        <option value="15min">Maximum 1 per 15 minutes</option>
                        <option value="1hour">Maximum 1 per hour</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Alert Conditions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Price Change Threshold
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <input
                            type="number"
                            placeholder="5"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]"
                          />
                          <p className="text-gray-400 text-xs mt-1">Percentage change</p>
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="1000"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]"
                          />
                          <p className="text-gray-400 text-xs mt-1">Dollar amount</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Notifications */}
            {activeSection === "notifications" && (
              <div className="space-y-6">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Volume2 className="h-5 w-5 mr-2" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Email Notifications</h4>
                        <p className="text-gray-400 text-sm">Receive email alerts for price changes</p>
                      </div>
                      <button
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          emailNotifications ? "bg-[#16C784]" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            emailNotifications ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">SMS Backup</h4>
                        <p className="text-gray-400 text-sm">SMS backup if voice call fails</p>
                      </div>
                      <button
                        onClick={() => setSmsBackup(!smsBackup)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          smsBackup ? "bg-[#16C784]" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            smsBackup ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Account Settings */}
            {activeSection === "account" && (
              <div className="space-y-6">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          defaultValue="John"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Doe"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Timezone
                      </label>
                      <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]">
                        <option value="UTC">UTC</option>
                        <option value="EST">Eastern Standard Time</option>
                        <option value="PST">Pacific Standard Time</option>
                        <option value="GMT">Greenwich Mean Time</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Security Settings */}
            {activeSection === "security" && (
              <div className="space-y-6">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]"
                        placeholder="Enter new password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]"
                        placeholder="Confirm new password"
                      />
                    </div>

                    <Button className="bg-[#EA3943] hover:bg-[#D13340] text-white">
                      <Key className="h-4 w-4 mr-2" />
                      Update Password
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Two-Factor Authentication</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Enable 2FA</h4>
                        <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                      </div>
                      <Badge className="bg-[#EA3943]/20 text-[#EA3943] border-[#EA3943]/30">
                        Coming Soon
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Appearance Settings */}
            {activeSection === "appearance" && (
              <div className="space-y-6">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Moon className="h-5 w-5 mr-2" />
                      Appearance Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Dark Mode</h4>
                        <p className="text-gray-400 text-sm">Use dark theme across the application</p>
                      </div>
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          darkMode ? "bg-[#16C784]" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            darkMode ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Theme Color
                      </label>
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { name: "Blue", color: "#3861FB" },
                          { name: "Green", color: "#16C784" },
                          { name: "Purple", color: "#8B5CF6" },
                          { name: "Orange", color: "#F59E0B" }
                        ].map((theme) => (
                          <button
                            key={theme.name}
                            className="flex flex-col items-center p-3 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
                          >
                            <div
                              className="w-8 h-8 rounded-full mb-2"
                              style={{ backgroundColor: theme.color }}
                            />
                            <span className="text-gray-300 text-sm">{theme.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Advanced Settings */}
            {activeSection === "advanced" && (
              <div className="space-y-6">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Advanced Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Auto-Save Settings</h4>
                        <p className="text-gray-400 text-sm">Automatically save changes</p>
                      </div>
                      <button
                        onClick={() => setAutoSave(!autoSave)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          autoSave ? "bg-[#16C784]" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            autoSave ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        API Update Interval
                      </label>
                      <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3861FB]">
                        <option value="1">1 second</option>
                        <option value="2" selected>2 seconds</option>
                        <option value="5">5 seconds</option>
                        <option value="10">10 seconds</option>
                      </select>
                    </div>

                    <Alert className="border-amber-500/50 bg-amber-500/10">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <AlertDescription className="text-amber-200">
                        Changing update intervals may affect performance and API rate limits.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-red-400">Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-red-500/30 rounded-lg bg-red-500/5">
                      <div>
                        <h4 className="text-red-400 font-medium">Delete Account</h4>
                        <p className="text-gray-400 text-sm">Permanently delete your account and all data</p>
                      </div>
                      <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/20">
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}