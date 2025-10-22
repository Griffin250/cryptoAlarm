"use client";
import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { User, Upload, X } from "lucide-react";
import Image from "next/image";

export default function ProfileAvatar({ 
  user, 
  profile, 
  size = "md", 
  editable = false, 
  onAvatarUpdate,
  showName = false,
  className = ""
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Size configurations
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm", 
    lg: "w-16 h-16 text-base",
    xl: "w-24 h-24 text-lg"
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  // Generate user initials
  const generateInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    }
    
    if (profile?.full_name) {
      const nameParts = profile.full_name.trim().split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
      }
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return "U";
  };

  // Get display name
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

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    
    try {
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Convert to base64 or upload to service
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64 = e.target.result;
          
          if (onAvatarUpdate) {
            const result = await onAvatarUpdate(base64, file);
            if (result && result.error) {
              throw new Error(result.error);
            }
          }
        } catch (error) {
          console.error('Error updating avatar:', error);
          alert('Error updating avatar: ' + error.message);
          setPreviewUrl(null); // Reset preview on error
        } finally {
          setIsUploading(false);
        }
      };
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
        setIsUploading(false);
        setPreviewUrl(null);
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading image. Please try again.');
      setIsUploading(false);
    }
  };

  // Clear preview
  const clearPreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const avatarUrl = previewUrl || profile?.avatar_url;
  const initials = generateInitials();
  const displayName = getDisplayName();

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Avatar Container */}
      <div className="relative">
        <div className={`
          ${sizeClasses[size]} 
          bg-gradient-to-br from-[#3861FB] to-[#4F46E5] 
          rounded-full flex items-center justify-center 
          overflow-hidden border-2 border-gray-600/30
          transition-all duration-200 hover:scale-105
        `}>
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={`${displayName}'s avatar`}
              width={size === 'xl' ? 96 : size === 'lg' ? 64 : size === 'md' ? 40 : 32}
              height={size === 'xl' ? 96 : size === 'lg' ? 64 : size === 'md' ? 40 : 32}
              className="w-full h-full object-cover"
              onError={() => {
                // Fallback to initials if image fails to load
                setPreviewUrl(null);
              }}
            />
          ) : (
            <span className="font-bold text-white">
              {initials}
            </span>
          )}
        </div>

        {/* Upload Button - Show when editable */}
        {editable && (
          <div className="absolute -bottom-1 -right-1">
            <Button
              variant="secondary"
              size="sm"
              className="w-6 h-6 p-0 rounded-full bg-[#3861FB] hover:bg-[#2851FB] text-white"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              ) : (
                <Upload className="h-3 w-3" />
              )}
            </Button>
          </div>
        )}

        {/* Clear Preview Button */}
        {editable && previewUrl && (
          <div className="absolute -top-1 -right-1">
            <Button
              variant="destructive"
              size="sm"
              className="w-5 h-5 p-0 rounded-full"
              onClick={clearPreview}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Hidden File Input */}
        {editable && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        )}
      </div>

      {/* User Name Display */}
      {showName && (
        <div className="flex-1 min-w-0">
          <div className="text-white font-semibold truncate">
            {displayName}
          </div>
          {user?.email && (
            <div className="text-gray-400 text-sm truncate">
              {user.email}
            </div>
          )}
        </div>
      )}
    </div>
  );
}