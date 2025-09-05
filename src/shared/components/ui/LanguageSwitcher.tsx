import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown, Globe, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  supportedLanguages,
  getCurrentLanguage,
  changeLanguage,
  getLanguageInfo,
  type SupportedLanguage,
} from '@/shared/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact' | 'icon-only';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showFlag?: boolean;
  showNativeName?: boolean;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

export function LanguageSwitcher({
  variant = 'default',
  size = 'default',
  showFlag = true,
  showNativeName = true,
  className,
  align = 'end',
}: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  
  const currentLanguage = getCurrentLanguage();
  const currentLanguageInfo = getLanguageInfo(currentLanguage);

  const handleLanguageChange = async (language: SupportedLanguage) => {
    if (language === currentLanguage || isChanging) return;
    
    setIsChanging(true);
    setIsOpen(false);
    
    try {
      await changeLanguage(language);
      
      // Optional: Show success message
      console.log(`Language changed to ${supportedLanguages[language].name}`);
    } catch (error) {
      console.error('Failed to change language:', error);
      // Optional: Show error message
    } finally {
      setIsChanging(false);
    }
  };

  // Button size classes
  const sizeClasses = {
    sm: 'h-8 px-2 text-xs',
    md: 'h-9 px-3 text-sm',
    lg: 'h-10 px-4 text-base',
  };

  // Render trigger button content based on variant
  const renderTriggerContent = () => {
    switch (variant) {
      case 'icon-only':
        return (
          <div className="flex items-center">
            <Globe className="h-4 w-4" />
          </div>
        );
      
      case 'compact':
        return (
          <div className="flex items-center space-x-1">
            {showFlag && <span className="text-sm">{currentLanguageInfo.flag}</span>}
            <span className="hidden sm:inline">{currentLanguage.toUpperCase()}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </div>
        );
      
      default:
        return (
          <div className="flex items-center space-x-2">
            {showFlag && <span>{currentLanguageInfo.flag}</span>}
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">
                {showNativeName ? currentLanguageInfo.nativeName : currentLanguageInfo.name}
              </span>
              {variant === 'default' && (
                <span className="text-xs text-muted-foreground">
                  {t('language.currentLanguage')}
                </span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        );
    }
  };

  // Get available languages (all supported languages)
  const availableLanguages = Object.entries(supportedLanguages).map(([code, info]) => ({
    code: code as SupportedLanguage,
    ...info,
  }));

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={size}
          className={cn(
            'justify-start',
            sizeClasses[size],
            isChanging && 'opacity-50 cursor-not-allowed',
            className
          )}
          disabled={isChanging}
          aria-label={t('language.selectLanguage')}
        >
          {renderTriggerContent()}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        align={align}
        className="w-56 max-h-80 overflow-y-auto"
        sideOffset={8}
      >
        <div className="p-2">
          <h4 className="mb-2 text-sm font-medium text-muted-foreground">
            {t('language.selectLanguage')}
          </h4>
          
          {availableLanguages.map((language) => {
            const isSelected = language.code === currentLanguage;
            const isRTL = language.rtl;
            
            return (
              <DropdownMenuItem
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={cn(
                  'flex items-center justify-between p-2 cursor-pointer',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus:bg-accent focus:text-accent-foreground',
                  isSelected && 'bg-accent text-accent-foreground',
                  isRTL && 'flex-row-reverse'
                )}
                disabled={isChanging}
              >
                <div className={cn(
                  'flex items-center space-x-3',
                  isRTL && 'space-x-reverse'
                )}>
                  <span className="text-lg">{language.flag}</span>
                  <div className={cn(
                    'flex flex-col',
                    isRTL && 'items-end'
                  )}>
                    <span className="text-sm font-medium">
                      {language.nativeName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {language.name}
                    </span>
                  </div>
                </div>
                
                {isSelected && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            );
          })}
        </div>
        
        <div className="border-t p-2">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Languages className="h-3 w-3" />
            <span>
              {availableLanguages.length} languages available
            </span>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Hook for language switching functionality
export function useLanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isChanging, setIsChanging] = useState(false);
  
  const switchLanguage = async (language: SupportedLanguage) => {
    setIsChanging(true);
    
    try {
      await changeLanguage(language);
      return true;
    } catch (error) {
      console.error('Failed to change language:', error);
      return false;
    } finally {
      setIsChanging(false);
    }
  };
  
  return {
    currentLanguage: getCurrentLanguage(),
    availableLanguages: Object.keys(supportedLanguages) as SupportedLanguage[],
    switchLanguage,
    isChanging,
    supportedLanguages,
  };
} 