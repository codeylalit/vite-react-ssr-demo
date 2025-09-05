import React, { useState, useEffect } from 'react';
import { AlertTriangle, Smartphone, Download, Copy, Check, RefreshCw, Shield } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

interface TwoFactorSetupProps {
  onComplete: (backupCodes: string[]) => void;
  onCancel: () => void;
}

interface TwoFactorVerifyProps {
  onVerify: (code: string) => Promise<boolean>;
  onCancel: () => void;
  isBackupCode?: boolean;
}

interface TwoFactorManageProps {
  isEnabled: boolean;
  onEnable: () => void;
  onDisable: () => void;
  onRegenerateBackupCodes: () => Promise<string[]>;
  backupCodesRemaining: number;
}

// Mock QR Code component (in real app, use qrcode library)
const QRCodePlaceholder: React.FC<{ value: string }> = ({ value }) => (
  <div className="w-64 h-64 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg">
    <div className="text-center">
      <div className="text-sm text-gray-500 mb-2">QR Code</div>
      <div className="text-xs text-gray-400 break-all p-2">{value}</div>
    </div>
  </div>
);

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<'setup' | 'verify' | 'backup'>('setup');
  const [verificationCode, setVerificationCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Generate secret key and QR code URL
    generateSecretKey();
  }, []);

  const generateSecretKey = () => {
    // In real app, get this from your backend
    const secret = 'JBSWY3DPEHPK3PXP'; // Example secret
    const appName = 'Zero Voice Infinity';
    const userEmail = 'user@example.com'; // Get from auth context

    setSecretKey(secret);
    setQrCodeUrl(`otpauth://totp/${appName}:${userEmail}?secret=${secret}&issuer=${appName}`);
  };

  const handleVerifySetup = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      // In real app, verify the code with your backend
      const isValid = await mockVerifyTOTP(verificationCode, secretKey);

      if (isValid) {
        // Generate backup codes
        const codes = generateBackupCodes();
        setBackupCodes(codes);
        setStep('backup');
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const generateBackupCodes = (): string[] => {
    // Generate 10 backup codes
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString().substr(2, 8));
    }
    return codes;
  };

  const handleDownloadBackupCodes = () => {
    const content = backupCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zero-voice-infinity-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyBackupCodes = async () => {
    try {
      await navigator.clipboard.writeText(backupCodes.join('\n'));
    } catch (err) {
      console.error('Failed to copy backup codes:', err);
    }
  };

  const handleCompleteSetup = () => {
    onComplete(backupCodes);
  };

  if (step === 'setup') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Set Up Two-Factor Authentication
          </CardTitle>
          <CardDescription>Secure your account with an authenticator app</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <QRCodePlaceholder value={qrCodeUrl} />
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Step 1: Install an authenticator app</h4>
              <p className="text-sm text-gray-600">
                Download an app like Google Authenticator, Authy, or 1Password on your phone.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Step 2: Scan the QR code</h4>
              <p className="text-sm text-gray-600">
                Open your authenticator app and scan the QR code above.
              </p>
            </div>

            <div>
              <Label htmlFor="manual-key">Or enter this key manually:</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input id="manual-key" value={secretKey} readOnly className="font-mono text-sm" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(secretKey)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button onClick={() => setStep('verify')} className="flex-1">
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'verify') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Verify Your Setup</CardTitle>
          <CardDescription>Enter the 6-digit code from your authenticator app</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="verification-code">Verification Code</Label>
            <Input
              id="verification-code"
              value={verificationCode}
              onChange={e => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="text-center text-lg font-mono tracking-widest"
              maxLength={6}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep('setup')} className="flex-1">
              Back
            </Button>
            <Button
              onClick={handleVerifySetup}
              disabled={isVerifying || verificationCode.length !== 6}
              className="flex-1"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'backup') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Save Your Backup Codes</CardTitle>
          <CardDescription>
            Store these codes in a safe place. You can use them to access your account if you lose
            your phone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              These codes will only be shown once. Make sure to save them securely.
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-2 font-mono text-sm">
              {backupCodes.map((code, index) => (
                <div key={index} className="text-center py-1">
                  {code}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadBackupCodes} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" onClick={handleCopyBackupCodes} className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>

          <Button onClick={handleCompleteSetup} className="w-full">
            Complete Setup
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export const TwoFactorVerify: React.FC<TwoFactorVerifyProps> = ({
  onVerify,
  onCancel,
  isBackupCode = false,
}) => {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!code || (isBackupCode ? code.length !== 8 : code.length !== 6)) {
      setError(
        `Please enter a valid ${isBackupCode ? '8-digit backup code' : '6-digit verification code'}`
      );
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const isValid = await onVerify(code);
      if (!isValid) {
        setError('Invalid code. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          {isBackupCode
            ? 'Enter one of your backup codes'
            : 'Enter the 6-digit code from your authenticator app'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <Label htmlFor="auth-code">{isBackupCode ? 'Backup Code' : 'Verification Code'}</Label>
          <Input
            id="auth-code"
            value={code}
            onChange={e =>
              setCode(e.target.value.replace(/\D/g, '').slice(0, isBackupCode ? 8 : 6))
            }
            placeholder={isBackupCode ? '12345678' : '000000'}
            className="text-center text-lg font-mono tracking-widest"
            maxLength={isBackupCode ? 8 : 6}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleVerify}
            disabled={isVerifying || (isBackupCode ? code.length !== 8 : code.length !== 6)}
            className="flex-1"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const TwoFactorManage: React.FC<TwoFactorManageProps> = ({
  isEnabled,
  onEnable,
  onDisable,
  onRegenerateBackupCodes,
  backupCodesRemaining,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [newBackupCodes, setNewBackupCodes] = useState<string[]>([]);

  const handleRegenerateBackupCodes = async () => {
    setIsLoading(true);
    try {
      const codes = await onRegenerateBackupCodes();
      setNewBackupCodes(codes);
    } catch (err) {
      console.error('Failed to regenerate backup codes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadBackupCodes = () => {
    const content = newBackupCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zero-voice-infinity-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDisable = () => {
    setShowDisableConfirm(false);
    onDisable();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Two-Factor Authentication
            </span>
            <Badge variant={isEnabled ? 'default' : 'secondary'}>
              {isEnabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isEnabled ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Two-factor authentication adds an extra layer of security to your account. When
                enabled, you'll need to enter a code from your authenticator app in addition to your
                password.
              </p>
              <Button onClick={onEnable}>Enable Two-Factor Authentication</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-4 w-4" />
                <span className="text-sm">Two-factor authentication is enabled</span>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Backup Codes</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    You have {backupCodesRemaining} backup codes remaining.
                    {backupCodesRemaining <= 2 && (
                      <span className="text-orange-600 ml-1">
                        Consider regenerating your backup codes.
                      </span>
                    )}
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleRegenerateBackupCodes}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      'Regenerate Backup Codes'
                    )}
                  </Button>
                </div>

                {newBackupCodes.length > 0 && (
                  <div className="space-y-2">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Your old backup codes are no longer valid. Save these new codes in a safe
                        place.
                      </AlertDescription>
                    </Alert>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                        {newBackupCodes.map((code, index) => (
                          <div key={index} className="text-center py-1">
                            {code}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button variant="outline" onClick={handleDownloadBackupCodes}>
                      <Download className="h-4 w-4 mr-2" />
                      Download New Codes
                    </Button>
                  </div>
                )}

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Disable Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    This will remove the extra security layer from your account.
                  </p>
                  {!showDisableConfirm ? (
                    <Button variant="destructive" onClick={() => setShowDisableConfirm(true)}>
                      Disable 2FA
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="destructive" onClick={handleDisable}>
                        Confirm Disable
                      </Button>
                      <Button variant="outline" onClick={() => setShowDisableConfirm(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Mock TOTP verification (replace with real implementation)
const mockVerifyTOTP = async (code: string, secret: string): Promise<boolean> => {
  // In a real app, you'd verify this on your backend
  await new Promise(resolve => setTimeout(resolve, 1000));
  return code.length === 6 && /^\d+$/.test(code);
};

export default {
  TwoFactorSetup,
  TwoFactorVerify,
  TwoFactorManage,
};
