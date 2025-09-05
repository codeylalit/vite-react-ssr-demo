import React from 'react';
import { X, Download, Smartphone, Monitor, Zap } from 'lucide-react';
import { usePWA } from '../../services/pwa/PWAService';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

interface PWAInstallPromptProps {
  onClose?: () => void;
  showDetails?: boolean;
  position?: 'top' | 'bottom' | 'center';
  variant?: 'banner' | 'modal' | 'card';
}

export function PWAInstallPrompt({
  onClose,
  showDetails = true,
  position = 'bottom',
  variant = 'banner',
}: PWAInstallPromptProps) {
  const { installPrompt, install, platform, capabilities } = usePWA();
  const [isInstalling, setIsInstalling] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);

  const handleInstall = async () => {
    setIsInstalling(true);

    try {
      const result = await install();

      if (result) {
        setIsVisible(false);
        onClose?.();
      }
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!installPrompt.canInstall || !isVisible) {
    return null;
  }

  const getPlatformIcon = () => {
    switch (platform) {
      case 'android':
        return <Smartphone className="h-5 w-5" />;
      case 'ios':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  const getPlatformName = () => {
    switch (platform) {
      case 'android':
        return 'Android';
      case 'ios':
        return 'iOS';
      case 'windows':
        return 'Windows';
      case 'macos':
        return 'macOS';
      case 'linux':
        return 'Linux';
      default:
        return 'Desktop';
    }
  };

  const benefits = [
    { icon: <Zap className="h-4 w-4" />, text: 'Faster loading' },
    { icon: <Download className="h-4 w-4" />, text: 'Offline access' },
    { icon: <Smartphone className="h-4 w-4" />, text: 'Native app experience' },
  ];

  if (variant === 'banner') {
    return (
      <div
        className={`fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg animate-slide-up`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {getPlatformIcon()}
            <div>
              <h3 className="font-semibold">Install Zero Voice Infinity</h3>
              <p className="text-sm opacity-90">
                Get the full app experience for {getPlatformName()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={handleInstall}
              disabled={isInstalling}
              variant="secondary"
              size="sm"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              {isInstalling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2" />
                  Installing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Install
                </>
              )}
            </Button>

            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getPlatformIcon()}
                <div>
                  <CardTitle>Install App</CardTitle>
                  <CardDescription>
                    Add Zero Voice Infinity to your {getPlatformName()}
                  </CardDescription>
                </div>
              </div>
              <Button onClick={handleClose} variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {showDetails && (
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Installing the app gives you:</p>

                <div className="space-y-2">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="text-green-500">{benefit.icon}</div>
                      <span>{benefit.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="secondary">
                    {capabilities.hasNotifications ? 'Push Notifications' : 'No Notifications'}
                  </Badge>
                  <Badge variant="secondary">
                    {capabilities.hasBackgroundSync ? 'Background Sync' : 'No Background Sync'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          )}

          <CardFooter className="flex space-x-2">
            <Button onClick={handleClose} variant="outline" className="flex-1">
              Maybe Later
            </Button>
            <Button onClick={handleInstall} disabled={isInstalling} className="flex-1">
              {isInstalling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Installing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Install Now
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Card variant
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center space-x-3">
          {getPlatformIcon()}
          <div>
            <CardTitle className="text-lg">Install Zero Voice Infinity</CardTitle>
            <CardDescription>Get the native app experience on {getPlatformName()}</CardDescription>
          </div>
        </div>
      </CardHeader>

      {showDetails && (
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center p-2 rounded-lg bg-muted">
                  <div className="flex justify-center mb-1 text-primary">{benefit.icon}</div>
                  <p className="text-xs">{benefit.text}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1 pt-2">
              <Badge variant="outline" className="text-xs">
                Size: ~2MB
              </Badge>
              <Badge variant="outline" className="text-xs">
                Platform: {getPlatformName()}
              </Badge>
            </div>
          </div>
        </CardContent>
      )}

      <CardFooter className="flex space-x-2">
        <Button onClick={handleClose} variant="outline" className="flex-1">
          Not Now
        </Button>
        <Button onClick={handleInstall} disabled={isInstalling} className="flex-1">
          {isInstalling ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Installing...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Install
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Hook for controlling PWA install prompt
export function usePWAInstallPrompt() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasBeenShown, setHasBeenShown] = React.useState(false);
  const { installPrompt } = usePWA();

  React.useEffect(() => {
    // Show install prompt after a delay if available
    const timer = setTimeout(() => {
      if (installPrompt.canInstall && !hasBeenShown) {
        setIsVisible(true);
        setHasBeenShown(true);
      }
    }, 5000); // Show after 5 seconds

    return () => clearTimeout(timer);
  }, [installPrompt.canInstall, hasBeenShown]);

  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);

  return {
    isVisible,
    show,
    hide,
    canInstall: installPrompt.canInstall,
  };
}

export default PWAInstallPrompt;
