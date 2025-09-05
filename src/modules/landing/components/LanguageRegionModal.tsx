import React, { useMemo, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from '@/shared/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Badge } from '@/shared/components/ui/badge';
import { Users, CheckCircle, Clock, Globe, BarChart3 } from 'lucide-react';
import { Region, LanguageMeta, regionStyles } from '../data/languages';
import { cn } from '@/lib/utils';

// Reuse parsed types
type LanguageDetail = LanguageMeta;
type RegionMeta = Region;

// Language type for Hero component integration
interface Language {
  code: string;
  name: string;
  native: string;
  region: string;
  flag: string;
  speakers: string;
  isAvailable?: boolean;
}

interface LanguageRegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  region: RegionMeta | null;
  onLanguageSelect?: (language: Language) => void;
}

// Custom DialogContent without close button
const DialogContentWithoutClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
      {/* No close button here */}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContentWithoutClose.displayName = 'DialogContentWithoutClose';

// Helper function to parse speaker counts
const parseSpeakers = (val: string): number => {
  const m = val.match(/([\d.]+)\s*([MBK]?)/i);
  if (!m) return 0;
  const num = parseFloat(m[1]);
  const suffix = m[2]?.toUpperCase();
  switch (suffix) {
    case 'B':
      return num * 1_000_000_000;
    case 'M':
      return num * 1_000_000;
    case 'K':
      return num * 1_000;
    default:
      return num;
  }
};

// Format speaker count for display
const formatSpeakers = (count: number): string => {
  if (count >= 1_000_000_000) {
    return `${(count / 1_000_000_000).toFixed(1)}B`;
  } else if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  } else if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`;
  }
  return count.toString();
};

// Calculate percentage of global population (assuming 8B total)
const calculateCoveragePercentage = (speakers: number): string => {
  const percentage = (speakers / 8_000_000_000) * 100;
  return `${percentage.toFixed(1)}%`;
};

// Convert LanguageMeta to Language format for Hero component
const convertToLanguage = (lang: LanguageDetail): Language => {
  // Simple flag mapping - in a real app, this would be more sophisticated
  const flagMap: Record<string, string> = {
    en: '🇺🇸',
    'en-GB': '🇬🇧',
    hi: '🇮🇳',
    es: '🇪🇸',
    fr: '🇫🇷',
    de: '🇩🇪',
    zh: '🇨🇳',
    ja: '🇯🇵',
    ko: '🇰🇷',
    ar: '🇸🇦',
    pt: '🇵🇹',
    ru: '🇷🇺',
    it: '🇮🇹',
    nl: '🇳🇱',
    sv: '🇸🇪',
    no: '🇳🇴',
    da: '🇩🇰',
    fi: '🇫🇮',
    pl: '🇵🇱',
    tr: '🇹🇷',
    he: '🇮🇱',
    th: '🇹🇭',
    vi: '🇻🇳',
    id: '🇮🇩',
    ms: '🇲🇾',
    tl: '🇵🇭',
    ur: '🇵🇰',
    bn: '🇧🇩',
    ta: '🇮🇳',
    te: '🇮🇳',
    ml: '🇮🇳',
    kn: '🇮🇳',
    gu: '🇮🇳',
    or: '🇮🇳',
    pa: '🇮🇳',
    as: '🇮🇳',
    mr: '🇮🇳',
    ne: '🇳🇵',
    si: '🇱🇰',
    my: '🇲🇲',
    km: '🇰🇭',
    lo: '🇱🇦',
    ka: '🇬🇪',
    am: '🇪🇹',
    sw: '🇰🇪',
    ha: '🇳🇬',
    yo: '🇳🇬',
    ig: '🇳🇬',
    zu: '🇿🇦',
    xh: '🇿🇦',
    af: '🇿🇦',
    default: '🌍',
  };

  return {
    code: lang.code,
    name: lang.name,
    native: lang.native,
    region: lang.region,
    flag: flagMap[lang.code] || flagMap['default'],
    speakers: lang.speakers,
    isAvailable: lang.status === 'available',
  };
};

// Enhanced counter animation hook that works with formatted strings
const useFormattedCounterAnimation = (targetValue: string, duration: number = 1000) => {
  const [currentValue, setCurrentValue] = React.useState('0');

  React.useEffect(() => {
    // Extract numeric value and suffix from formatted string
    const extractNumber = (str: string): { number: number; suffix: string } => {
      const match = str.match(/^([\d.]+)([KMBT]?)$/);
      if (match) {
        return { number: parseFloat(match[1]), suffix: match[2] };
      }
      // Handle percentage
      const percentMatch = str.match(/^([\d.]+)%$/);
      if (percentMatch) {
        return { number: parseFloat(percentMatch[1]), suffix: '%' };
      }
      // Handle plain numbers
      const numericValue = parseFloat(str);
      if (!isNaN(numericValue)) {
        return { number: numericValue, suffix: '' };
      }
      return { number: 0, suffix: '' };
    };

    const target = extractNumber(targetValue);

    // If it's not a number, just return the original value
    if (target.number === 0 && targetValue !== '0' && !targetValue.includes('0')) {
      setCurrentValue(targetValue);
      return;
    }

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentNumber = Math.floor(target.number * easeOut);

      // Format the animated value with appropriate suffix
      let formattedValue: string;
      if (target.suffix === '%') {
        formattedValue = `${currentNumber.toFixed(1)}%`;
      } else if (target.suffix) {
        formattedValue = `${currentNumber}${target.suffix}`;
      } else {
        formattedValue = currentNumber.toString();
      }

      setCurrentValue(formattedValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [targetValue, duration]);

  return currentValue;
};

// Legacy counter animation hook for numeric-only values
const useCounterAnimation = (targetValue: number, duration: number = 1000) => {
  const [currentValue, setCurrentValue] = React.useState(0);

  React.useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCurrentValue(Math.floor(targetValue * easeOut));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [targetValue, duration]);

  return currentValue;
};

// Animated Language Pill Component
const AnimatedLanguagePill: React.FC<{
  lang: LanguageDetail;
  delay: number;
  isAvailable: boolean;
  onLanguageSelect?: (language: Language) => void;
  onClose?: () => void;
}> = React.memo(({ lang, delay, isAvailable, onLanguageSelect, onClose }) => {
  const [isClicked, setIsClicked] = React.useState(false);

  const handleClick = useCallback(() => {
    if (onLanguageSelect && isAvailable) {
      setIsClicked(true);
      onLanguageSelect(convertToLanguage(lang));

      // Close the modal after a brief moment to show the success animation
      setTimeout(() => {
        setIsClicked(false);
        if (onClose) {
          onClose();
        }
      }, 600);
    }
  }, [lang, isAvailable, onLanguageSelect, onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  return (
    <div
      className={`group inline-flex items-center space-x-2 sm:space-x-3 px-3 py-3 sm:px-4 sm:py-3 rounded-lg border transition-all duration-300 ease-out min-h-[48px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
        ${
          isAvailable
            ? `border-purple-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${isClicked ? 'success-selected' : ''}`
            : 'border-gray-200/50 bg-white/60 backdrop-blur-sm shadow-sm opacity-75 hover:opacity-90 active:opacity-80'
        }`}
      style={{
        animationDelay: `${delay}ms`,
        transform: 'translateY(20px) scale(0.9)',
        opacity: 0,
        animation: 'fadeInUp 400ms ease-out forwards',
      }}
      tabIndex={0}
      role="button"
      aria-label={`${lang.native} (${lang.name}) - ${lang.speakers} speakers, ${lang.script} script${isAvailable ? ', click to select' : ', coming soon'}`}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      <div className="flex flex-col min-w-0 flex-1">
        <span className="font-semibold text-sm sm:text-base text-gray-900 truncate">
          {lang.native}
        </span>
        <span className="text-xs text-gray-600 truncate">{lang.name}</span>
      </div>
      <Badge
        variant="outline"
        className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shrink-0 transition-all duration-200"
      >
        {lang.script}
      </Badge>
      <div className="flex items-center text-xs text-gray-600 whitespace-nowrap shrink-0">
        <Users className="w-3 h-3 mr-1" />
        <span className="font-medium">{formatSpeakers(parseSpeakers(lang.speakers))}</span>
      </div>
    </div>
  );
});

// Enhanced Statistics Card Component with animations
const StatisticsCard: React.FC<{
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient?: boolean;
  colorTheme?: 'green' | 'blue' | 'purple' | 'orange';
}> = ({ title, value, subtitle, icon, gradient = false, colorTheme = 'purple' }) => {
  const animatedValue = useFormattedCounterAnimation(value, 1200);
  const displayValue = animatedValue;

  const colorClasses = {
    green: {
      gradient: 'bg-gradient-to-r from-green-500 to-emerald-600',
      bg: 'bg-green-100',
      text: 'text-green-600',
      border: 'border-green-200/50',
    },
    blue: {
      gradient: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      border: 'border-blue-200/50',
    },
    purple: {
      gradient: 'bg-gradient-to-r from-purple-500 to-blue-600',
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      border: 'border-purple-200/50',
    },
    orange: {
      gradient: 'bg-gradient-to-r from-orange-500 to-red-600',
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      border: 'border-orange-200/50',
    },
  };

  const colors = colorClasses[colorTheme];

  return (
    <div
      className={`group bg-white/90 backdrop-blur-sm rounded-xl p-4 sm:p-6 border-2 ${colors.border} shadow-sm hover:shadow-lg transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1`}
    >
      {/* Enhanced Header with Icon */}
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 rounded-xl shadow-sm ${gradient ? colors.gradient : colors.bg} transition-transform duration-300 group-hover:scale-110`}
        >
          <div className={`w-5 h-5 sm:w-6 sm:h-6 ${gradient ? 'text-white' : colors.text}`}>
            {icon}
          </div>
        </div>
        {gradient && (
          <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-60"></div>
        )}
      </div>

      {/* Main Value with Enhanced Typography */}
      <div
        className={`text-2xl sm:text-3xl font-bold mb-3 leading-tight transition-all duration-300 ${
          gradient
            ? 'bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] bg-clip-text text-transparent'
            : 'text-gray-900'
        }`}
      >
        {displayValue}
      </div>

      {/* Title and Subtitle with Better Spacing */}
      <div className="space-y-1">
        <div className="text-sm sm:text-base font-semibold text-gray-700">{title}</div>
        <div className="text-xs sm:text-sm text-gray-500 leading-relaxed">{subtitle}</div>
      </div>

      {/* Subtle Bottom Border Accent */}
      <div
        className={`mt-4 h-1 rounded-full bg-gradient-to-r ${
          gradient ? colors.gradient : `${colors.bg} opacity-30`
        } transition-all duration-300 group-hover:h-1.5`}
      ></div>
    </div>
  );
};

// Enhanced Section Header Component
const SectionHeader: React.FC<{
  title: string;
  icon: React.ReactNode;
  count: number;
  isAvailable: boolean;
}> = ({ title, icon, count, isAvailable }) => (
  <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b-2 border-gradient-to-r from-purple-100 to-blue-100">
    <div className="flex items-center space-x-4 sm:space-x-5">
      <div
        className={`p-3 sm:p-4 rounded-xl shadow-lg ${
          isAvailable
            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
            : 'bg-gradient-to-r from-orange-500 to-red-500'
        }`}
      >
        <div className="text-white w-6 h-6 sm:w-7 sm:h-7">{icon}</div>
      </div>
      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h3>
        <p className="text-sm sm:text-base text-gray-600 font-medium">
          {count} languages available
        </p>
      </div>
    </div>
    <div className="flex items-center space-x-3">
      <Badge
        variant={isAvailable ? 'default' : 'secondary'}
        className={`px-4 py-2 sm:px-5 sm:py-3 rounded-full text-sm sm:text-base font-bold shadow-md ${
          isAvailable
            ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800'
            : 'bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800'
        } text-white border-0 transition-all duration-200 hover:scale-105`}
      >
        {count}
      </Badge>
    </div>
  </div>
);

const LanguageRegionModal: React.FC<LanguageRegionModalProps> = ({
  isOpen,
  onClose,
  region,
  onLanguageSelect,
}) => {
  const processedData = useMemo(() => {
    if (!region) return null;

    const sorted = [...region.languages].sort(
      (a, b) => parseSpeakers(b.speakers) - parseSpeakers(a.speakers)
    );

    const available = sorted.filter(l => l.status === 'available');
    const comingSoon = sorted.filter(l => l.status !== 'available');

    // Calculate statistics
    const availableSpeakers = available.reduce(
      (sum, lang) => sum + parseSpeakers(lang.speakers),
      0
    );
    const comingSoonSpeakers = comingSoon.reduce(
      (sum, lang) => sum + parseSpeakers(lang.speakers),
      0
    );
    const totalSpeakers = availableSpeakers + comingSoonSpeakers;

    const topAvailable = available[0];
    const topComingSoon = comingSoon[0];

    return {
      available,
      comingSoon,
      availableSpeakers,
      comingSoonSpeakers,
      totalSpeakers,
      topAvailable,
      topComingSoon,
    };
  }, [region]);

  // Optimized close handler
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleClose]);

  if (!region || !processedData) return null;

  const {
    available,
    comingSoon,
    availableSpeakers,
    comingSoonSpeakers,
    totalSpeakers,
    topAvailable,
    topComingSoon,
  } = processedData;

  // Get subtle region colors instead of bright gradients
  const regionColorMap: Record<string, string> = {
    'Indic': 'bg-gradient-to-r from-orange-100 to-red-100 border-orange-200/50',
    'Asian': 'bg-gradient-to-r from-green-100 to-blue-100 border-green-200/50',
    'European': 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-200/50',
    'African': 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-200/50',
    'Middle Eastern': 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200/50',
    'North American': 'bg-gradient-to-r from-teal-100 to-cyan-100 border-teal-200/50',
    'South American': 'bg-gradient-to-r from-emerald-100 to-teal-100 border-emerald-200/50',
    default: 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-200/50',
  };

  const headerColorClass = regionColorMap[region.name] || regionColorMap['default'];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContentWithoutClose
        className="max-w-4xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-lg border border-purple-200/50 shadow-2xl mx-4 my-4 sm:mx-auto sm:my-8"
        role="dialog"
        aria-labelledby="region-modal-title"
        aria-describedby="region-modal-description"
      >
        {/* Enhanced Header with Subtle Colors */}
        <DialogHeader
          className={`rounded-t-2xl sm:rounded-t-3xl ${headerColorClass} p-4 sm:p-6 text-gray-800 relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-white/30"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex-1">
                <DialogTitle
                  id="region-modal-title"
                  className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900"
                >
                  {region.name}
                </DialogTitle>
                <p
                  id="region-modal-description"
                  className="text-base sm:text-lg max-w-2xl leading-relaxed text-gray-700"
                >
                  {region.description}
                </p>
              </div>
              <div className="flex items-center space-x-3 sm:ml-4">
                <Badge
                  variant="secondary"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/60 text-gray-700 backdrop-blur-sm border border-white/50 text-sm"
                >
                  <Globe className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  {region.count} Languages
                </Badge>
              </div>
            </div>

            {/* Header Statistics */}
            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/50">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {formatSpeakers(totalSpeakers)}
                </div>
                <div className="text-xs sm:text-sm text-gray-700">Total Native Speakers</div>
              </div>
              <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/50">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {calculateCoveragePercentage(totalSpeakers)}
                </div>
                <div className="text-xs sm:text-sm text-gray-700">Global Population</div>
              </div>
              <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/50 sm:col-span-2 md:col-span-1">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {available.length + comingSoon.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-700">Languages Total</div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 sm:p-8 space-y-8 sm:space-y-12">
          {/* Available Languages Section */}
          {available.length > 0 && (
            <div
              className="space-y-6 sm:space-y-8"
              style={{
                opacity: 0,
                transform: 'translateY(20px)',
                animation: 'fadeInUp 600ms ease-out forwards',
              }}
            >
              <SectionHeader
                title="Available Languages"
                icon={<CheckCircle className="w-5 h-5" />}
                count={available.length}
                isAvailable={true}
              />

              {/* Available Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                <StatisticsCard
                  title="Available Languages"
                  value={available.length.toString()}
                  subtitle="Ready to use"
                  icon={<CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
                  gradient={true}
                  colorTheme="green"
                />
                <StatisticsCard
                  title="Native Speakers"
                  value={formatSpeakers(availableSpeakers)}
                  subtitle={`${calculateCoveragePercentage(availableSpeakers)} of global population`}
                  icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />}
                  colorTheme="blue"
                />
                <StatisticsCard
                  title="Most Spoken"
                  value={topAvailable?.native || 'N/A'}
                  subtitle={`${topAvailable ? formatSpeakers(parseSpeakers(topAvailable.speakers)) : '0'} speakers`}
                  icon={<BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />}
                  colorTheme="purple"
                />
              </div>

              {/* Available Language Pills */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {available.map((lang, index) => (
                  <AnimatedLanguagePill
                    key={lang.code}
                    lang={lang}
                    delay={index * 50}
                    isAvailable={true}
                    onLanguageSelect={onLanguageSelect}
                    onClose={handleClose}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Section Divider */}
          {available.length > 0 && comingSoon.length > 0 && (
            <div className="border-t border-gray-200 my-8"></div>
          )}

          {/* Coming Soon Languages Section */}
          {comingSoon.length > 0 && (
            <div
              className="space-y-6 sm:space-y-8"
              style={{
                opacity: 0,
                transform: 'translateY(20px)',
                animation: 'fadeInUp 600ms ease-out forwards',
                animationDelay: '300ms',
              }}
            >
              <SectionHeader
                title="Coming Soon"
                icon={<Clock className="w-5 h-5" />}
                count={comingSoon.length}
                isAvailable={false}
              />

              {/* Coming Soon Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                <StatisticsCard
                  title="Coming Soon"
                  value={comingSoon.length.toString()}
                  subtitle="In development"
                  icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
                  colorTheme="orange"
                />
                <StatisticsCard
                  title="Native Speakers"
                  value={formatSpeakers(comingSoonSpeakers)}
                  subtitle={`${calculateCoveragePercentage(comingSoonSpeakers)} of global population`}
                  icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />}
                  colorTheme="blue"
                />
                <StatisticsCard
                  title="Most Spoken"
                  value={topComingSoon?.native || 'N/A'}
                  subtitle={`${topComingSoon ? formatSpeakers(parseSpeakers(topComingSoon.speakers)) : '0'} speakers`}
                  icon={<BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />}
                  colorTheme="purple"
                />
              </div>

              {/* Coming Soon Language Pills */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {comingSoon.map((lang, index) => (
                  <AnimatedLanguagePill
                    key={lang.code}
                    lang={lang}
                    delay={(available.length + index) * 50}
                    isAvailable={false}
                    onLanguageSelect={onLanguageSelect}
                    onClose={handleClose}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CSS Animations */}
        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes modalEntrance {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(-50%) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(-50%) scale(1);
            }
          }



          /* Apply modal entrance animation */
          [data-state="open"] {
            animation: modalEntrance 300ms ease-out;
          }



          /* Success selection animation */
          @keyframes successPulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
            }
          }

          .success-selected {
            animation: successPulse 600ms ease-out;
            border-color: rgba(34, 197, 94, 0.5) !important;
            background-color: rgba(34, 197, 94, 0.05) !important;
          }

          /* Reduced motion support */
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.1ms !important;
              animation-delay: 0ms !important;
              transition-duration: 0.1ms !important;
            }
          }
        `}</style>
      </DialogContentWithoutClose>
    </Dialog>
  );
};

export default LanguageRegionModal;
