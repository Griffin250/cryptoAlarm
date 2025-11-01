import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  User, Shield, Bell, Settings, Phone, Mail, Lock, 
  Save, Eye, EyeOff, Smartphone, Volume2, Moon, Sun,
  Key, AlertTriangle, Clock, Globe, Palette, Database,
  BarChart3, Target, Zap, CheckCircle, AlertCircle,
  CreditCard, Download, Upload
} from 'lucide-react';
import StandardNavbar from '../components/StandardNavbar';
import { useAuth } from '../context/AuthContext';

const sections = [
  { id: 'account', name: 'Account & Profile', icon: User, color: 'text-blue-600' },
  { id: 'alerts', name: 'Alert Settings', icon: Bell, color: 'text-orange-500' },
  { id: 'security', name: 'Security & Privacy', icon: Shield, color: 'text-green-600' },
  { id: 'notifications', name: 'Notifications', icon: Smartphone, color: 'text-purple-600' },
  { id: 'appearance', name: 'Appearance', icon: Palette, color: 'text-pink-600' },
  { id: 'advanced', name: 'Advanced', icon: Settings, color: 'text-gray-600' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Account settings
    fullName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    
    // Alert settings
    voiceAlerts: true,
    emailAlerts: true,
    smsAlerts: false,
    alertSound: true,
    alertFrequency: 'immediate',
    priceThreshold: 5,
    volumeThreshold: 1000000,
    
    // Security settings
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: '1hour',
    trustedDevices: true,
    
    // Notification settings
    pushNotifications: true,
    weeklyReports: true,
    marketingEmails: false,
    priceAlerts: true,
    
    // Appearance settings
    theme: 'dark',
    currency: 'USD',
    timezone: 'auto',
    compactMode: false,
    
    // Advanced settings
    apiAccess: false,
    dataRetention: '1year',
    autoBackup: true,
    debugMode: false,
  });

  const { user } = useAuth();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save functionality
    console.log('Saving settings:', formData);
  };

  return (
    <>
      <StandardNavbar title="Settings" subtitle="Manage your account preferences" />
      
      <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Customize your CryptoAlarm experience</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {user?.email || 'User Settings'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left font-medium transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                          activeSection === section.id 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                        onClick={() => setActiveSection(section.id)}
                      >
                        <section.icon className={`h-5 w-5 ${section.color}`} />
                        <span className="truncate">{section.name}</span>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeSection === 'account' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        Account Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                              id="fullName"
                              value={formData.fullName}
                              onChange={(e) => handleInputChange('fullName', e.target.value)}
                              placeholder="Enter your full name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="your@email.com"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="flex gap-2">
                            <Phone className="h-5 w-5 mt-2 text-gray-400" />
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              placeholder="+1 (555) 123-4567"
                              className="flex-1"
                            />
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Required for voice call alerts</p>
                        </div>
                        <Button type="submit" className="w-full">
                          <Save className="h-4 w-4 mr-2" />
                          Save Account Settings
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-red-600" />
                        Change Password
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSave} className="space-y-4">
                        <div>
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showPassword ? "text" : "password"}
                              value={formData.currentPassword}
                              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={(e) => handleInputChange('newPassword', e.target.value)}
                            placeholder="Enter new password"
                          />
                          <p className="text-sm text-gray-500 mt-1">Must be at least 8 characters</p>
                        </div>
                        <Button type="submit" variant="destructive" className="w-full">
                          <Key className="h-4 w-4 mr-2" />
                          Update Password
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === 'alerts' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-orange-500" />
                        Alert Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Phone className="h-5 w-5 text-green-600" />
                              <div>
                                <div className="font-medium">Voice Call Alerts</div>
                                <div className="text-sm text-gray-500">Phone calls for critical alerts</div>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={formData.voiceAlerts}
                              onChange={(e) => handleInputChange('voiceAlerts', e.target.checked)}
                              className="h-4 w-4"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Mail className="h-5 w-5 text-blue-600" />
                              <div>
                                <div className="font-medium">Email Alerts</div>
                                <div className="text-sm text-gray-500">Email notifications</div>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={formData.emailAlerts}
                              onChange={(e) => handleInputChange('emailAlerts', e.target.checked)}
                              className="h-4 w-4"
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Volume2 className="h-5 w-5 text-purple-600" />
                              <div>
                                <div className="font-medium">Alert Sound</div>
                                <div className="text-sm text-gray-500">Play sound for alerts</div>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={formData.alertSound}
                              onChange={(e) => handleInputChange('alertSound', e.target.checked)}
                              className="h-4 w-4"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label>Alert Frequency</Label>
                            <select
                              value={formData.alertFrequency}
                              onChange={(e) => handleInputChange('alertFrequency', e.target.value)}
                              className="w-full mt-1 px-3 py-2 border rounded-lg"
                            >
                              <option value="immediate">Immediate</option>
                              <option value="5min">Every 5 minutes</option>
                              <option value="15min">Every 15 minutes</option>
                              <option value="1hour">Every hour</option>
                            </select>
                          </div>

                          <div>
                            <Label>Price Change Threshold (%)</Label>
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4 text-gray-400" />
                              <Input
                                type="number"
                                value={formData.priceThreshold}
                                onChange={(e) => handleInputChange('priceThreshold', parseFloat(e.target.value))}
                                placeholder="5"
                                min="0.1"
                                step="0.1"
                              />
                            </div>
                          </div>

                          <div>
                            <Label>Volume Threshold (USD)</Label>
                            <div className="flex items-center gap-2">
                              <BarChart3 className="h-4 w-4 text-gray-400" />
                              <Input
                                type="number"
                                value={formData.volumeThreshold}
                                onChange={(e) => handleInputChange('volumeThreshold', parseInt(e.target.value))}
                                placeholder="1000000"
                                min="0"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button onClick={handleSave} className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        Save Alert Settings
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === 'security' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      Security & Privacy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                          <div>
                            <div className="font-medium">Two-Factor Authentication</div>
                            <div className="text-sm text-gray-500">Add an extra layer of security</div>
                          </div>
                        </div>
                        <div className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">Coming Soon</div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Bell className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="font-medium">Login Notifications</div>
                            <div className="text-sm text-gray-500">Get notified of new logins</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.loginNotifications}
                          onChange={(e) => handleInputChange('loginNotifications', e.target.checked)}
                          className="h-4 w-4"
                        />
                      </div>

                      <div>
                        <Label>Session Timeout</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <select
                            value={formData.sessionTimeout}
                            onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-lg"
                          >
                            <option value="30min">30 minutes</option>
                            <option value="1hour">1 hour</option>
                            <option value="4hours">4 hours</option>
                            <option value="never">Never</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleSave} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Security Settings
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'notifications' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-purple-600" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                              <div className="font-medium">Push Notifications</div>
                              <div className="text-sm text-gray-500">Browser notifications</div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={formData.pushNotifications}
                            onChange={(e) => handleInputChange('pushNotifications', e.target.checked)}
                            className="h-4 w-4"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                            <div>
                              <div className="font-medium">Weekly Reports</div>
                              <div className="text-sm text-gray-500">Summary emails</div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={formData.weeklyReports}
                            onChange={(e) => handleInputChange('weeklyReports', e.target.checked)}
                            className="h-4 w-4"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-orange-600" />
                            <div>
                              <div className="font-medium">Marketing Emails</div>
                              <div className="text-sm text-gray-500">Product updates</div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={formData.marketingEmails}
                            onChange={(e) => handleInputChange('marketingEmails', e.target.checked)}
                            className="h-4 w-4"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <div>
                              <div className="font-medium">Price Alerts</div>
                              <div className="text-sm text-gray-500">Critical price changes</div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={formData.priceAlerts}
                            onChange={(e) => handleInputChange('priceAlerts', e.target.checked)}
                            className="h-4 w-4"
                          />
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleSave} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Notification Settings
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'appearance' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-pink-600" />
                      Appearance & Display
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label>Theme</Label>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <input
                              type="radio"
                              name="theme"
                              value="light"
                              checked={formData.theme === 'light'}
                              onChange={(e) => handleInputChange('theme', e.target.value)}
                            />
                            <Sun className="h-5 w-5 text-yellow-500" />
                            <span>Light Mode</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <input
                              type="radio"
                              name="theme"
                              value="dark"
                              checked={formData.theme === 'dark'}
                              onChange={(e) => handleInputChange('theme', e.target.value)}
                            />
                            <Moon className="h-5 w-5 text-blue-500" />
                            <span>Dark Mode</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label>Currency Display</Label>
                          <select
                            value={formData.currency}
                            onChange={(e) => handleInputChange('currency', e.target.value)}
                            className="w-full mt-1 px-3 py-2 border rounded-lg"
                          >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="BTC">BTC (₿)</option>
                            <option value="ETH">ETH (Ξ)</option>
                          </select>
                        </div>

                        <div>
                          <Label>Timezone</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <select
                              value={formData.timezone}
                              onChange={(e) => handleInputChange('timezone', e.target.value)}
                              className="flex-1 px-3 py-2 border rounded-lg"
                            >
                              <option value="auto">Auto-detect</option>
                              <option value="UTC">UTC</option>
                              <option value="EST">EST</option>
                              <option value="PST">PST</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleSave} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Appearance Settings
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'advanced' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-gray-600" />
                      Advanced Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-800 dark:text-blue-200">Advanced Features</span>
                      </div>
                      <p className="text-sm text-blue-600 dark:text-blue-300">
                        These settings are for advanced users and developers.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center gap-3">
                          <Zap className="h-5 w-5 text-orange-500" />
                          <div>
                            <div className="font-medium">API Access</div>
                            <div className="text-sm text-gray-500">Programmatic access to alerts</div>
                          </div>
                        </div>
                        <div className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">Coming Soon</div>
                      </div>

                      <div>
                        <Label>Data Retention Period</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Database className="h-4 w-4 text-gray-400" />
                          <select
                            value={formData.dataRetention}
                            onChange={(e) => handleInputChange('dataRetention', e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-lg"
                          >
                            <option value="6months">6 months</option>
                            <option value="1year">1 year</option>
                            <option value="2years">2 years</option>
                            <option value="forever">Forever</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Download className="h-5 w-5 text-green-600" />
                          <div>
                            <div className="font-medium">Auto Backup</div>
                            <div className="text-sm text-gray-500">Automatic data backups</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.autoBackup}
                          onChange={(e) => handleInputChange('autoBackup', e.target.checked)}
                          className="h-4 w-4"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={handleSave} className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        Save Advanced Settings
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Upload className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
