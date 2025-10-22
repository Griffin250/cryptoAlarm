"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { 
  User, Settings, LogOut, CreditCard, Bell, Shield, 
  HelpCircle, Star, ChevronDown, Crown
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import ProfileAvatar from "./ProfileAvatar";

export default function UserAccountDropdown({ trigger, onClose }) {
  // Track current route for active highlighting
  const [activePath, setActivePath] = useState(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActivePath(window.location.pathname);
    }
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, profile, signOut } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        if (onClose) onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    if (onClose) onClose();
  };

  const menuItems = [
    {
      icon: <User className="h-4 w-4" />,
      label: "My Profile",
      href: "/profile",
      description: "Manage your account details"
    },
    {
      icon: <Settings className="h-4 w-4" />,
      label: "Settings", 
      href: "/settings",
      description: "Alert preferences & notifications"
    },
    {
      icon: <Bell className="h-4 w-4" />,
      label: "My Alerts",
      href: "/dashboard",
      description: "View and manage your alerts"
    },
    {
      icon: <Crown className="h-4 w-4" />,
      label: "Premium Plan",
      href: "/premium",
      description: "Upgrade your account",
      highlight: true
    },
    {
      icon: <Shield className="h-4 w-4" />,
      label: "Security",
      href: "/security",
      description: "Password & security settings"
    },
    {
      icon: <HelpCircle className="h-4 w-4" />,
      label: "Help & Support",
      href: "/help",
      description: "Get help and contact support"
    }
  ];

    // Get user display name
    const getDisplayName = () => {
      if (profile?.first_name && profile?.last_name) {
        return `${profile.first_name} ${profile.last_name}`;
      }
      
      if (profile?.full_name) {
        return profile.full_name;
      }
      
      if (user?.email) {
        return user.email.split('@')[0];
      }
      
      return "User";
    };

    return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground flex items-center space-x-2 px-2"
        onClick={handleToggle}
      >
        <div className="flex items-center space-x-2">
          <ProfileAvatar 
            user={user} 
            profile={profile} 
            size="sm"
            className=""
          />
          <span className="text-sm text-white hidden md:inline max-w-[120px] truncate">
            {getDisplayName()}
          </span>
          <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </Button>      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-gray-900/95 backdrop-blur-lg border border-gray-700 rounded-lg shadow-xl z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200">
          {/* User Info Header */}
          <div className="p-4 border-b border-gray-700">
            <ProfileAvatar 
              user={user} 
              profile={profile} 
              size="md"
              showName={true}
              className=""
            />
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => (
              <Link key={index} href={item.href} onClick={handleItemClick}>
                <div className={`flex items-center space-x-3 px-4 py-3 transition-colors cursor-pointer group
                  ${item.highlight ? 'bg-gradient-to-r from-[#16C784]/10 to-transparent border-l-2 border-[#16C784]' : ''}
                  ${activePath === item.href ? 'bg-blue-900/60 border-l-4 border-blue-400' : 'hover:bg-gray-800/50'}
                `}>
                  <div className={`${item.highlight ? 'text-[#16C784]' : 'text-gray-400 group-hover:text-white'}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium ${item.highlight ? 'text-[#16C784]' : 'text-white'}`}> 
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {item.description}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Sign Out */}
          <div className="border-t border-gray-700 p-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}