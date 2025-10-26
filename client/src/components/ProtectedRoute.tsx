import React from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  showModal?: boolean;
  fallbackComponent?: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/auth',
  showModal = false,
  fallbackComponent: FallbackComponent
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#3861FB]"></div>
      </div>
    );
  }

  // If not authenticated, handle based on props
  if (!isAuthenticated) {
    // Store intended destination for redirect after login
    sessionStorage.setItem('redirectAfterAuth', location.pathname);
    
    if (showModal) {
      return (
        <>
          <div className="blur-sm pointer-events-none">
            {children}
          </div>
          <AuthModal 
            isOpen={true} 
            onClose={() => {}} // Prevent closing without auth
          />
        </>
      );
    }
    
    if (FallbackComponent) {
      return <FallbackComponent />;
    }
    
    // Default: redirect to auth page
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;