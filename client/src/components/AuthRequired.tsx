import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Shield, LogIn, UserPlus } from 'lucide-react';

const AuthRequired: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#0F1837] to-[#1A1B3A] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900/50 border-gray-700 backdrop-blur-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 p-3 bg-[#3861FB]/10 rounded-full w-fit">
            <Shield className="h-8 w-8 text-[#3861FB]" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Authentication Required
          </CardTitle>
          <p className="text-gray-400 mt-2">
            Please sign in to access this page and enjoy all CryptoAlarm features.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Link to="/auth?mode=signin" className="block">
              <Button className="w-full bg-[#3861FB] hover:bg-[#2851FB] text-white">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In to Continue
              </Button>
            </Link>
            
            <Link to="/auth?mode=signup" className="block">
              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </Button>
            </Link>
          </div>
          
          <div className="text-center pt-4">
            <p className="text-xs text-gray-500">
              New to CryptoAlarm? <Link to="/" className="text-[#3861FB] hover:underline">Learn more</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthRequired;