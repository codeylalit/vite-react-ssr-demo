import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown, Users, Globe, Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuickTooltip, TooltipMessages } from './Tooltip';
import { languages, scripts } from '../../landing/data/languages';

interface LangScriptSelectorProps {
  selectedLanguage: string;
  selectedScript: string;
  onLanguageChange: (languageCode: string) => void;
  onScriptChange: (script: string) => void;
}

export const LangScriptSelector: React.FC<LangScriptSelectorProps> = ({
  selectedLanguage,
  selectedScript,
  onLanguageChange,
  onScriptChange
}) => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isScriptOpen, setIsScriptOpen] = useState(false);
  const [languageSearchTerm, setLanguageSearchTerm] = useState('');
  
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const scriptDropdownRef = useRef<HTMLDivElement>(null);

  // Function to find the script for a given language code from the CSV data
  const getScriptForLanguage = useCallback((languageCode: string): string => {
    // First try exact match
    const exactMatch = languages.find(lang => 
      lang.code === languageCode && lang.status === 'available'
    );
    
    if (exactMatch) {
      return exactMatch.script;
    }
    
    // Fallback to base language code if no exact match (e.g., en-US -> en)
    const baseCode = languageCode.split('-')[0];
    const baseMatch = languages.find(lang => 
      lang.code === baseCode && lang.status === 'available'
    );
    
    if (baseMatch) {
      return baseMatch.script;
    }
    
    // If still no match, try to find any language that starts with the base code
    const partialMatch = languages.find(lang => 
      lang.code.startsWith(baseCode) && lang.status === 'available'
    );
    
    if (partialMatch) {
      return partialMatch.script;
    }
    
    // Default fallback to Latin if no entries found
    return 'Latin';
  }, []);

  // Helper function to parse speaker count for sorting
  const parseSpeakerCount = (speakers: string): number => {
    const match = speakers.match(/(\d+(?:\.\d+)?)\s*([MK]?)/i);
    if (!match) return 0;
    
    const number = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    
    if (unit === 'M') return number * 1000000;
    if (unit === 'K') return number * 1000;
    return number;
  };

  // Get unique language options from the parsed data, ordered by speaker count (descending)
  const availableLanguages = useMemo(() => {
    const uniqueLanguages = languages.filter(lang => lang.status === 'available').reduce((acc, lang) => {
      if (!acc.some(l => l.code === lang.code)) {
        acc.push(lang);
      }
      return acc;
    }, [] as typeof languages);
    
    // Sort by speaker count descending
    return uniqueLanguages.sort((a, b) => parseSpeakerCount(b.speakers) - parseSpeakerCount(a.speakers));
  }, []);

  // Get available scripts, ordered by total speaker count (descending)
  const availableScripts = useMemo(() => {
    const scriptTotals = scripts.map(script => {
      const scriptLanguages = languages.filter(lang => lang.script === script);
      const totalSpeakers = scriptLanguages.reduce((sum, lang) => sum + parseSpeakerCount(lang.speakers), 0);
      
      return {
        name: script,
        icon: getScriptIcon(script),
        speakerCount: scriptLanguages.length,
        totalSpeakers
      };
    });
    
    // Sort by total speaker count descending
    return scriptTotals.sort((a, b) => b.totalSpeakers - a.totalSpeakers);
  }, []);

  // Get current language details
  const currentLanguage = useMemo(() => {
    return availableLanguages.find(lang => lang.code === selectedLanguage) || availableLanguages[0];
  }, [selectedLanguage, availableLanguages]);

  // Filtered languages for search
  const filteredLanguages = useMemo(() => {
    if (!languageSearchTerm) return availableLanguages;
    return availableLanguages.filter(lang =>
      lang.name.toLowerCase().includes(languageSearchTerm.toLowerCase()) ||
      lang.native.toLowerCase().includes(languageSearchTerm.toLowerCase())
    );
  }, [languageSearchTerm, availableLanguages]);

  // Get flag emoji for language codes - Fixed mapping
  const getFlagEmoji = (code: string) => {
    const flagMap: Record<string, string> = {
      // English variants
      'en': '🇺🇸', 'en-US': '🇺🇸', 'en-GB': '🇬🇧', 'en-AU': '🇦🇺', 'en-CA': '🇨🇦',
      'en-IN': '🇮🇳', 'en-ZA': '🇿🇦', 'en-NZ': '🇳🇿', 'en-IE': '🇮🇪',
      
      // Indian languages
      'hi': '🇮🇳', 'bn': '🇧🇩', 'bn-IN': '🇮🇳', 'bn-BD': '🇧🇩', 'te': '🇮🇳', 'ta': '🇮🇳',
      'gu': '🇮🇳', 'kn': '🇮🇳', 'ml': '🇮🇳', 'mr': '🇮🇳', 'pa': '🇮🇳',
      'ur': '🇵🇰', 'ne': '🇳🇵', 'as': '🇮🇳', 'or': '🇮🇳', 'ks': '🇮🇳',
      'sd': '🇵🇰', 'mai': '🇮🇳', 'bho': '🇮🇳', 'mag': '🇮🇳', 'awa': '🇮🇳',
      'brx': '🇮🇳', 'hne': '🇮🇳', 'doi': '🇮🇳', 'grt': '🇮🇳', 'gon': '🇮🇳',
      'bgc': '🇮🇳', 'hoc': '🇮🇳', 'kha': '🇮🇳', 'kxv': '🇮🇳', 'kok': '🇮🇳',
      'mni': '🇮🇳', 'mwr': '🇮🇳', 'lus': '🇮🇳', 'unr': '🇮🇳', 'sat': '🇮🇳',
      'tcy': '🇮🇳', 'bfy': '🇮🇳', 'mup': '🇮🇳', 'raj': '🇮🇳',
      
      // French variants
      'fr': '🇫🇷', 'fr-FR': '🇫🇷', 'fr-CA': '🇨🇦', 'fr-BE': '🇧🇪', 'fr-CH': '🇨🇭', 'fr-AF': '🇫🇷',
      
      // Spanish and Portuguese
      'es': '🇪🇸', 'es-ES': '🇪🇸', 'pt': '🇵🇹', 'pt-BR': '🇧🇷', 'pt-PT': '🇵🇹', 'pt-AF': '🇵🇹',
      
      // Other European languages
      'de': '🇩🇪', 'it': '🇮🇹', 'ru': '🇷🇺', 'pl': '🇵🇱', 'nl': '🇳🇱', 'sv': '🇸🇪', 
      'no': '🇳🇴', 'da': '🇩🇰', 'fi': '🇫🇮', 'hu': '🇭🇺', 'cs': '🇨🇿', 'sk': '🇸🇰',
      'sl': '🇸🇮', 'hr': '🇭🇷', 'sr': '🇷🇸', 'bg': '🇧🇬', 'ro': '🇷🇴', 'el': '🇬🇷',
      'lt': '🇱🇹', 'lv': '🇱🇻', 'et': '🇪🇪', 'sq': '🇦🇱', 'mk': '🇲🇰', 'be': '🇧🇾',
      'uk': '🇺🇦', 'mo': '🇲🇩', 'ca': '🇪🇸', 'eu': '🇪🇸', 'gl': '🇪🇸', 'cy': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
      'ga': '🇮🇪', 'oc': '🇫🇷', 'sc': '🇮🇹', 'nds': '🇩🇪', 'bar': '🇩🇪', 'scn': '🇮🇹', 'nap': '🇮🇹',
      
      // Asian languages
      'zh': '🇨🇳', 'zh-CN': '🇨🇳', 'zh-HK': '🇭🇰', 'wuu': '🇨🇳', 'nan': '🇨🇳', 'hak': '🇨🇳',
      'gan': '🇨🇳', 'hsn': '🇨🇳', 'ja': '🇯🇵', 'ko': '🇰🇷', 'vi': '🇻🇳', 'th': '🇹🇭',
      'id': '🇮🇩', 'ms': '🇲🇾', 'tl': '🇵🇭', 'ceb': '🇵🇭', 'hil': '🇵🇭', 'war': '🇵🇭',
      'bcl': '🇵🇭', 'pag': '🇵🇭', 'pam': '🇵🇭', 'ilo': '🇵🇭', 'jv': '🇮🇩', 'su': '🇮🇩',
      'mad': '🇮🇩', 'bug': '🇮🇩', 'ace': '🇮🇩', 'lo': '🇱🇦', 'km': '🇰🇭', 'my': '🇲🇲',
      'mnw': '🇲🇲', 'shn': '🇲🇲', 'bo': '🇨🇳', 'mn': '🇲🇳', 'hmn': '🇨🇳', 'ium': '🇨🇳',
      'tpi': '🇵🇬', 'si': '🇱🇰', 'dz': '🇧🇹', 'fj': '🇫🇯', 'tet': '🇹🇱',
      
      // African languages
      'sw': '🇰🇪', 'am': '🇪🇹', 'om': '🇪🇹', 'ti': '🇪🇷', 'so': '🇸🇴', 'ha': '🇳🇬',
      'yo': '🇳🇬', 'ig': '🇳🇬', 'ff': '🇳🇬', 'ak': '🇬🇭', 'tw': '🇬🇭', 'ee': '🇬🇭',
      'gaa': '🇬🇭', 'wo': '🇸🇳', 'mnk': '🇲🇱', 'bm': '🇲🇱', 'ln': '🇨🇩', 'kg': '🇨🇩',
      'rw': '🇷🇼', 'rn': '🇧🇮', 'lg': '🇺🇬', 'luo': '🇰🇪', 'ki': '🇰🇪', 'sn': '🇿🇼',
      'nd': '🇿🇼', 'zu': '🇿🇦', 'xh': '🇿🇦', 'af': '🇿🇦', 'st': '🇿🇦', 'tn': '🇿🇦',
      'ss': '🇿🇦', 've': '🇿🇦', 'ts': '🇿🇦', 'ar-MA': '🇲🇦', 'ar-TD': '🇹🇩', 'ber': '🇲🇦',
      'mg': '🇲🇬', 'ny': '🇲🇼',
      
      // Middle Eastern languages
      'ar': '🇸🇦', 'fa': '🇮🇷', 'he': '🇮🇱', 'tr': '🇹🇷',
      
      'default': '🌐'
    };
    
    const baseCode = code.split('-')[0];
    return flagMap[code] || flagMap[baseCode] || flagMap['default'];
  };

  // Get script icon
  function getScriptIcon(script: string): string {
    const scriptIcons: Record<string, string> = {
      'Latin': '🔤',
      'Devanagari': '🕉️',
      'Cyrillic': 'Я',
      'Arabic': '📜',
      'Chinese': '漢',
      'Japanese': 'あ',
      'Korean': '한',
      'Bengali': 'অ',
      'Tamil': 'அ',
      'Gujarati': 'અ',
      'Thai': 'ก',
      'Greek': 'Ω',
      'Hebrew': 'א',
      'Gurmukhi': 'ਗ',
      'Kannada': 'ಕ',
      'Malayalam': 'മ',
      'Telugu': 'త',
      'Odia': 'ଓ',
      'Ethiopic': 'ሀ',
      'Myanmar': 'က',
      'Khmer': 'ក',
      'Lao': 'ກ',
      'Tibetan': 'ཀ',
      'Sinhala': 'ක',
      'Mongolian': 'ᠮ',
      'Lontara': 'ᨀ',
      'Mon': 'ဗ'
    };
    
    return scriptIcons[script] || '🔡';
  }

  // Handle clicking outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
      if (scriptDropdownRef.current && !scriptDropdownRef.current.contains(event.target as Node)) {
        setIsScriptOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = useCallback((lang: typeof availableLanguages[0]) => {
    onLanguageChange(lang.code);
    
    // Automatically select the most common script for this language
    const mostCommonScript = getScriptForLanguage(lang.code);
    onScriptChange(mostCommonScript);
    
    setIsLanguageOpen(false);
    setLanguageSearchTerm('');
  }, [onLanguageChange, onScriptChange, getScriptForLanguage]);

  const handleScriptSelect = useCallback((script: string) => {
    onScriptChange(script);
    setIsScriptOpen(false);
  }, [onScriptChange]);

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {/* Side-by-side layout: Language, Script */}
      {/* Language Selector */}
      <div className="relative w-full" ref={languageDropdownRef}>
        <button
          onClick={() => setIsLanguageOpen(!isLanguageOpen)}
          className="w-full bg-white/90 backdrop-blur-sm border border-purple-200/50 rounded-xl px-3 py-2.5 text-left transition-all duration-300 hover:bg-white hover:border-purple-300 group shadow-sm hover:shadow-md"
          aria-expanded={isLanguageOpen}
          aria-haspopup="listbox"
          aria-label={`Current language: ${currentLanguage.native}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg" role="img" aria-label={currentLanguage.name}>
                {getFlagEmoji(currentLanguage.code)}
              </span>
              <div>
                <div className="text-gray-900 font-medium text-sm">{currentLanguage.native}</div>
                <div className="text-gray-600 text-xs flex items-center space-x-1">
                  <Users className="w-3 h-3" aria-hidden="true" />
                  <span>{currentLanguage.speakers} speakers</span>
                </div>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-purple-600 transition-transform duration-200 ${
                isLanguageOpen ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </div>
        </button>

        {/* Language Dropdown */}
        {isLanguageOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-purple-200/50 rounded-2xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto z-50"
            role="listbox"
            aria-label="Language selection"
          >
            {/* Search */}
            <div className="p-4 border-b border-purple-100">
              <input
                type="text"
                placeholder="Search languages..."
                value={languageSearchTerm}
                onChange={(e) => setLanguageSearchTerm(e.target.value)}
                className="w-full bg-purple-50/50 border border-purple-200 rounded-xl px-4 py-2.5 text-gray-900 text-sm placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 focus:bg-white transition-all duration-200"
                aria-label="Search languages"
              />
            </div>
            
            {/* Language Options */}
            <div className="max-h-64 overflow-y-auto">
              {filteredLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang)}
                  className={cn(
                    "w-full p-4 text-left transition-all duration-200 border-b border-purple-100/50 last:border-b-0 group flex items-center space-x-3",
                    selectedLanguage === lang.code ? 'bg-purple-50/60' : 'hover:bg-purple-50/50'
                  )}
                  role="option"
                  aria-selected={selectedLanguage === lang.code}
                >
                  <span className="text-xl" role="img" aria-label={lang.name}>
                    {getFlagEmoji(lang.code)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm text-gray-900">{lang.native}</div>
                        <div className="text-xs text-gray-600 flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{lang.speakers}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{lang.name}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Script Selector */}
      <div className="relative w-full" ref={scriptDropdownRef}>
        <button
          onClick={() => setIsScriptOpen(!isScriptOpen)}
          className="w-full bg-white/90 backdrop-blur-sm border border-purple-200/50 rounded-xl px-3 py-2.5 text-left transition-all duration-300 hover:bg-white hover:border-purple-300 group shadow-sm hover:shadow-md"
          aria-expanded={isScriptOpen}
          aria-haspopup="listbox"
          aria-label={`Current script: ${selectedScript}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg" role="img" aria-label={selectedScript}>
                {getScriptIcon(selectedScript)}
              </span>
              <div>
                <div className="text-gray-900 font-medium text-sm">{selectedScript}</div>
                <div className="text-gray-600 text-xs flex items-center space-x-1">
                  <Type className="w-3 h-3" aria-hidden="true" />
                  <span>Writing system</span>
                </div>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-purple-600 transition-transform duration-200 ${
                isScriptOpen ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </div>
        </button>

        {/* Script Dropdown */}
        {isScriptOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-purple-200/50 rounded-2xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto z-50"
            role="listbox"
            aria-label="Script selection"
          >
            {availableScripts.map((script) => (
              <button
                key={script.name}
                onClick={() => handleScriptSelect(script.name)}
                className={cn(
                  "w-full p-4 text-left transition-all duration-200 border-b border-purple-100/50 last:border-b-0 group flex items-center space-x-3",
                  selectedScript === script.name ? 'bg-purple-50/60' : 'hover:bg-purple-50/50'
                )}
                role="option"
                aria-selected={selectedScript === script.name}
              >
                <span className="text-xl" role="img" aria-label={script.name}>
                  {script.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm text-gray-900">{script.name}</div>
                      <div className="text-xs text-gray-600">{script.speakerCount} languages</div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LangScriptSelector;
