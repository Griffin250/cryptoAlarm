import { User } from 'lucide-react';
import type { UserProfile } from '../context/AuthContext';

interface ProfileAvatarProps {
  user?: UserProfile | null;
  size?: 'sm' | 'md' | 'lg';
  showOnlineStatus?: boolean;
  className?: string;
}

export function ProfileAvatar({ 
  user, 
  size = 'md', 
  showOnlineStatus = false, 
  className = '' 
}: ProfileAvatarProps) {
  // Size variants
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  // Get user initials from first name and last name
  const getUserInitials = (user: UserProfile | null | undefined): string => {
    if (!user) return 'U';
    
    const firstName = user.first_name?.trim();
    const lastName = user.last_name?.trim();
    
    if (firstName && lastName) {
      return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (lastName) {
      return lastName.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  const initials = getUserInitials(user);

  return (
    <div className={`relative ${className}`}>
      {user?.avatar_url ? (
        <img
          src={user.avatar_url}
          alt={`${user.first_name || 'User'}'s avatar`}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-600 hover:border-gray-400 transition-colors`}
        />
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-[#3861FB] to-[#4F46E5] flex items-center justify-center text-white font-medium border-2 border-gray-600 hover:border-gray-400 transition-colors`}>
          {user?.first_name ? initials : <User className="w-1/2 h-1/2" />}
        </div>
      )}
      
      {showOnlineStatus && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#0B1426] rounded-full"></div>
      )}
    </div>
  );
}

export default ProfileAvatar;