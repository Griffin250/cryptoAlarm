import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Lock, Mail, User, Loader2, Eye, EyeOff } from 'lucide-react';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
}

// Password strength interface for future enhancement
// interface PasswordStrength {
//   score: number;
//   feedback: string[];
//   isStrong: boolean;
// }

export default function AuthForm() {
  const { signIn, signUp, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  
  const [formError, setFormError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [activeTab, setActiveTab] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear errors when switching tabs or changing input
  useEffect(() => {
    setFormError(null);
    setValidationErrors({});
    if (error) clearError();
  }, [activeTab, error, clearError]);

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters long';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    return undefined;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return undefined;
  };

  const validateName = (name: string, fieldName: string): string | undefined => {
    if (!name) return `${fieldName} is required`;
    if (name.length < 2) return `${fieldName} must be at least 2 characters long`;
    if (!/^[a-zA-Z\s]+$/.test(name)) return `${fieldName} can only contain letters and spaces`;
    return undefined;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    setFormError(null);
    setValidationErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  };

  const validateForm = (isSignUp: boolean = false): ValidationErrors => {
    const errors: ValidationErrors = {};

    errors.email = validateEmail(formData.email);
    errors.password = validatePassword(formData.password);

    if (isSignUp) {
      errors.firstName = validateName(formData.firstName, 'First name');
      errors.lastName = validateName(formData.lastName, 'Last name');
      errors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);
    }

    return errors;
  };

  const hasValidationErrors = (errors: ValidationErrors): boolean => {
    return Object.values(errors).some(error => error !== undefined);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    // Basic validation
    const errors = validateForm(false);
    if (hasValidationErrors(errors)) {
      setValidationErrors(errors);
      setIsSubmitting(false);
      return;
    }

    const { error } = await signIn(formData.email, formData.password);
    
    if (error) {
      setFormError(error);
    }
    setIsSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    // Full validation for sign up
    const errors = validateForm(true);
    if (hasValidationErrors(errors)) {
      setValidationErrors(errors);
      setIsSubmitting(false);
      return;
    }

    const metadata = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: `${formData.firstName} ${formData.lastName}`.trim()
    };

    const { error } = await signUp(formData.email, formData.password, metadata);
    
    if (error) {
      setFormError(error);
    } else {
      setFormError(null);
      // Show success message
      setFormError('Success! Please check your email to verify your account.');
      // Reset form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg px-4">
      <Card className="w-full max-w-md crypto-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            Welcome to CryptoAlarm
          </CardTitle>
          <p className="text-gray-300 mt-2">
            Monitor cryptocurrency prices with smart alerts
          </p>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4 mt-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className={`pl-10 bg-gray-800/50 border-gray-600 text-white ${
                        validationErrors.email ? 'border-red-500' : ''
                      }`}
                      required
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className={`pl-10 pr-10 bg-gray-800/50 border-gray-600 text-white ${
                        validationErrors.password ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.password}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#3861FB] hover:bg-[#2851FB] text-white"
                  disabled={loading || isSubmitting}
                >
                  {(loading || isSubmitting) ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4 mt-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-gray-300">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First name"
                        className="pl-10 bg-gray-800/50 border-gray-600 text-white"
                        required
                      />
                    </div>
                    {validationErrors.firstName && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.firstName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-gray-300">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last name"
                        className="pl-10 bg-gray-800/50 border-gray-600 text-white"
                        required
                      />
                    </div>
                    {validationErrors.lastName && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.lastName}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className={`pl-10 bg-gray-800/50 border-gray-600 text-white ${
                        validationErrors.email ? 'border-red-500' : ''
                      }`}
                      required
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a password"
                      className={`pl-10 pr-10 bg-gray-800/50 border-gray-600 text-white ${
                        validationErrors.password ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.password}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className={`pl-10 pr-10 bg-gray-800/50 border-gray-600 text-white ${
                        validationErrors.confirmPassword ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.confirmPassword}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#3861FB] hover:bg-[#2851FB] text-white"
                  disabled={loading || isSubmitting}
                >
                  {(loading || isSubmitting) ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          {(error || formError) && (
            <Alert 
              variant={formError?.includes('Success') ? "default" : "destructive"} 
              className={`mt-4 ${formError?.includes('Success') ? 'border-green-500 text-green-400' : ''}`}
            >
              <AlertDescription className={formError?.includes('Success') ? 'text-green-400' : ''}>
                {error || formError}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export { AuthForm };