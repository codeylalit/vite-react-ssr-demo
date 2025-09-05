import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  disabled?: boolean;
}

const languages = [
  { code: '', name: 'Auto-detect', flag: '🌐' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  disabled = false,
}) => {
  const selectedLang = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-purple-200/30 shadow-lg p-4">
      <div className="flex flex-col items-center gap-3 mb-3 text-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] flex items-center justify-center">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Language</h3>
          <p className="text-sm text-gray-600">Select your speaking language</p>
        </div>
      </div>

      <div className="relative">
        <select
          value={selectedLanguage}
          onChange={e => onLanguageChange(e.target.value)}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-3 bg-white/80 border-2 border-purple-200/50 rounded-xl',
            'text-gray-900 font-medium text-base',
            'focus:outline-none focus:ring-2 focus:ring-[#2d4cc8]/50 focus:border-[#2d4cc8]',
            'transition-all duration-200',
            'appearance-none cursor-pointer',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-100'
          )}
        >
          {languages.map(language => (
            <option key={language.code} value={language.code}>
              {language.flag} {language.name}
            </option>
          ))}
        </select>

        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>

      {/* Selected language display */}
      <div className="mt-3 p-3 bg-white/60 rounded-lg border border-purple-200/30">
        <div className="flex items-center gap-2">
          <span className="text-lg">{selectedLang.flag}</span>
          <span className="text-sm text-gray-700">
            Selected: <span className="font-medium">{selectedLang.name}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
