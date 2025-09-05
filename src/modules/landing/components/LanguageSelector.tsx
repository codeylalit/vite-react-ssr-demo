import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown, Users } from 'lucide-react';
import { Language } from '../types';
import { languages as parsedLanguages } from '../data/languages';
import { getLanguageStatistics } from '../utils/languageStats';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  className?: string;
}

// Convert parsed language metadata into the selector-friendly structure.
const baseAvailable: Language[] = parsedLanguages.map(l => ({
  code: l.code,
  name: l.name,
  native: l.native,
  speakers: l.speakers,
  region: l.region,
  sampleText: l.sampleText,
  // Use a generic flag placeholder. Real flag mapping can be added later.
  flag: '🏳️',
  isAvailable: l.status === 'available',
}));

// Remove autodetect language option and export only the base available languages
export const availableLanguages: Language[] = baseAvailable.filter(l => l.isAvailable);

// Coming Soon languages sorted by speaker count (high to low)
const comingSoonLanguages: Language[] = baseAvailable
  .filter(l => !l.isAvailable)
  .map(l => ({
    code: l.code,
    name: l.name,
    native: l.native,
    speakers: l.speakers,
    region: l.region,
    sampleText: l.sampleText,
    flag: '🏳️',
    isAvailable: false,
  }));

// All languages combined for filtering
const allLanguages: Language[] = [...availableLanguages, ...comingSoonLanguages];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [reducedMotion, setReducedMotion] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Memoized filtered languages for performance, separated by availability
  const filteredLanguages = useMemo(() => {
    const filtered = allLanguages.filter(
      lang =>
        lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.native.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const parseSpeakers = (val: string): number => {
      const match = val.match(/([\d.]+)\s*([MBK]?)/i);
      if (!match) return 0;
      const num = parseFloat(match[1]);
      const suffix = match[2]?.toUpperCase();
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

    const available = filtered
      .filter(lang => lang.isAvailable)
      .sort((a, b) => parseSpeakers(b.speakers) - parseSpeakers(a.speakers));

    const comingSoon = filtered
      .filter(lang => !lang.isAvailable)
      .sort((a, b) => parseSpeakers(b.speakers) - parseSpeakers(a.speakers));

    return [...available, ...comingSoon];
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = useCallback(
    (language: Language) => {
      // Only allow selection of available languages
      if (language.isAvailable) {
        onLanguageChange(language);
        setIsOpen(false);
        setSearchTerm('');
      }
    },
    [onLanguageChange]
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
      {/* Selected Language Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/90 backdrop-blur-sm border border-purple-200/50 rounded-2xl px-4 py-3 text-left transition-all duration-300 hover:bg-white hover:border-purple-300 group shadow-sm hover:shadow-md"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Current language: ${selectedLanguage.native}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl" role="img" aria-label={selectedLanguage.name}>
              {selectedLanguage.flag}
            </span>
            <div>
              <div className="text-gray-900 font-medium text-sm">{selectedLanguage.native}</div>
              <div className="text-gray-600 text-xs flex items-center space-x-1">
                <Users className="w-3 h-3" aria-hidden="true" />
                <span>{selectedLanguage.speakers} speakers</span>
              </div>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-purple-600 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-purple-200/50 rounded-2xl shadow-2xl overflow-hidden md:absolute md:top-full md:left-0 md:right-0 md:mt-2 max-md:fixed max-md:top-1/2 max-md:left-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2 max-md:w-[90vw] max-md:max-w-sm max-md:max-h-[80vh]"
          role="listbox"
          aria-label="Language selection"
          style={{
            zIndex: 99999,
          }}
        >
          {/* Search */}
          <div className="p-4 border-b border-purple-100">
            <input
              type="text"
              placeholder="Search languages..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-purple-50/50 border border-purple-200 rounded-xl px-4 py-2.5 text-gray-900 text-sm placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 focus:bg-white transition-all duration-200"
              aria-label="Search languages"
            />
          </div>

          {/* Language List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredLanguages.map(language => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language)}
                disabled={!language.isAvailable}
                className={`w-full p-4 text-left transition-all duration-200 border-b border-purple-100/50 last:border-b-0 group flex items-center space-x-3 ${
                  language.isAvailable
                    ? 'hover:bg-purple-50/50 cursor-pointer md:hover:scale-[1.01]'
                    : 'opacity-50 cursor-not-allowed bg-gray-50/50'
                }`}
                role="option"
                aria-selected={selectedLanguage.code === language.code}
                aria-label={`${language.isAvailable ? 'Select' : 'Coming soon:'} ${language.name} (${language.native})`}
              >
                <span
                  className={`text-xl transition-transform duration-200 ${
                    !reducedMotion && language.isAvailable ? 'md:group-hover:scale-110' : ''
                  } ${!language.isAvailable ? 'grayscale' : ''}`}
                  role="img"
                  aria-label={language.name}
                >
                  {language.flag}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div
                      className={`font-medium text-sm transition-colors duration-200 ${
                        language.isAvailable
                          ? `text-gray-900 ${!reducedMotion ? 'md:group-hover:text-purple-700' : ''}`
                          : 'text-gray-500'
                      }`}
                    >
                      {language.native}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          language.isAvailable
                            ? 'text-purple-700 bg-purple-100'
                            : 'text-gray-500 bg-gray-200'
                        }`}
                      >
                        {language.speakers}
                      </div>
                      {!language.isAvailable && (
                        <div className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full font-medium">
                          Coming Soon
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`text-xs mb-2 ${
                      language.isAvailable ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  >
                    {language.name} • {language.region}
                  </div>

                  <div
                    className={`text-xs italic leading-relaxed transition-opacity duration-200 ${
                      language.isAvailable
                        ? `text-gray-500 opacity-75 ${!reducedMotion ? 'md:group-hover:opacity-100' : 'opacity-100'}`
                        : 'text-gray-400 opacity-60'
                    }`}
                  >
                    "{language.sampleText}"
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gradient-to-r from-purple-50/60 to-pink-50/60 border-t border-purple-100">
            <div className="text-center">
              <p className="text-xs text-purple-600">
                Don't see your language? We support 216 languages.
              </p>
              <div className="text-xs text-purple-500 mt-1">216 available • 18 coming soon</div>
              <button
                className="text-xs bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 transition-all duration-300 mt-1 font-medium md:hover:scale-105"
                onClick={() => {
                  // Close dropdown and scroll to language regions section
                  setIsOpen(false);
                  const languageRegionsSection = document.getElementById('languages');
                  if (languageRegionsSection) {
                    languageRegionsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                aria-label="View all supported languages"
              >
                View all languages →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
