import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Progress } from '@/shared/components/ui/progress';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  loginSchema,
  signupSchema,
  type LoginFormData,
  type SignupFormData,
} from '@/lib/validators/auth';
import { sanitizeFormData } from '@/lib/security/sanitize';
import { storeAuthTokens, storeUserData, validatePasswordStrength } from '@/lib/security/auth';
import { ComponentErrorBoundary } from '@/shared/components/common/ErrorBoundary';
import { LoadingSpinner } from '@/shared/components/common/LoadingStates';

interface LoginModalProps {
  children: React.ReactNode;
  onLoginSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ children, onLoginSuccess }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    feedback: string[];
  } | null>(null);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      // Sanitize form data
      const sanitizedData = sanitizeFormData(data);

      // Mock login - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock tokens
      const tokens = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };

      const user = {
        id: 'user_123',
        name: 'Demo User',
        email: sanitizedData.email,
        role: 'user',
        plan: 'Developer',
        isEmailVerified: true,
      };

      storeAuthTokens(tokens);
      storeUserData(user);

      setIsOpen(false);
      onLoginSuccess?.();
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      loginForm.setError('root', {
        message: 'Login failed. Please check your credentials.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);

    try {
      // Sanitize form data
      const sanitizedData = sanitizeFormData(data);

      // Mock signup - replace with actual registration
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock tokens
      const tokens = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };

      const user = {
        id: 'user_123',
        name: sanitizedData.name,
        email: sanitizedData.email,
        role: 'user',
        plan: 'Developer',
        isEmailVerified: false,
      };

      storeAuthTokens(tokens);
      storeUserData(user);

      setIsOpen(false);
      onLoginSuccess?.();
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
      signupForm.setError('root', {
        message: 'Registration failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Watch password field for strength validation
  const watchedPassword = signupForm.watch('password');
  React.useEffect(() => {
    if (watchedPassword) {
      const strength = validatePasswordStrength(watchedPassword);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(null);
    }
  }, [watchedPassword]);

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (score: number) => {
    if (score <= 1) return 'Very Weak';
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Fair';
    if (score <= 4) return 'Good';
    return 'Strong';
  };

  return (
    <ComponentErrorBoundary>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[480px] bg-white border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] bg-clip-text text-transparent">
              Welcome to Zero Voice Infinity
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100">
              <TabsTrigger value="login" className="text-gray-700">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-gray-700">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                {loginForm.formState.errors.root && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{loginForm.formState.errors.root.message}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-gray-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 border-gray-300 focus:border-[#2d4cc8] focus:ring-[#2d4cc8]"
                      {...loginForm.register('email')}
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-red-600">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 border-gray-300 focus:border-[#2d4cc8] focus:ring-[#2d4cc8]"
                      {...loginForm.register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-red-600">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] hover:from-[#1a1947]/90 hover:via-[#2d4cc8]/90 hover:to-[#4c7cf0]/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" text="Signing in..." />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-[#2d4cc8] hover:text-[#1a1947] transition-colors"
                  >
                    Forgot your password?
                  </button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                {signupForm.formState.errors.root && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{signupForm.formState.errors.root.message}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-gray-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10 border-gray-300 focus:border-[#2d4cc8] focus:ring-[#2d4cc8]"
                      {...signupForm.register('name')}
                    />
                  </div>
                  {signupForm.formState.errors.name && (
                    <p className="text-sm text-red-600">
                      {signupForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-gray-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 border-gray-300 focus:border-[#2d4cc8] focus:ring-[#2d4cc8]"
                      {...signupForm.register('email')}
                    />
                  </div>
                  {signupForm.formState.errors.email && (
                    <p className="text-sm text-red-600">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      className="pl-10 pr-10 border-gray-300 focus:border-[#2d4cc8] focus:ring-[#2d4cc8]"
                      {...signupForm.register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {signupForm.formState.errors.password && (
                    <p className="text-sm text-red-600">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}

                  {passwordStrength && watchedPassword && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Password Strength:</span>
                        <span
                          className={`font-medium ${passwordStrength.score >= 4 ? 'text-green-600' : 'text-orange-600'}`}
                        >
                          {getPasswordStrengthText(passwordStrength.score)}
                        </span>
                      </div>
                      <Progress
                        value={(passwordStrength.score / 5) * 100}
                        className={`h-2 ${getPasswordStrengthColor(passwordStrength.score)}`}
                      />
                      {passwordStrength.feedback.length > 0 && (
                        <ul className="text-xs text-gray-600 space-y-1">
                          {passwordStrength.feedback.map((feedback, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {feedback}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password" className="text-gray-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 border-gray-300 focus:border-[#2d4cc8] focus:ring-[#2d4cc8]"
                      {...signupForm.register('confirmPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {signupForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-600">
                      {signupForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || (passwordStrength && passwordStrength.score < 4)}
                  className="w-full bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] hover:from-[#1a1947]/90 hover:via-[#2d4cc8]/90 hover:to-[#4c7cf0]/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" text="Creating account..." />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>

                <div className="text-center text-xs text-gray-500">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </ComponentErrorBoundary>
  );
};
