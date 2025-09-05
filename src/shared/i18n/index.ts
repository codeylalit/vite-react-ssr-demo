import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Note: Translation resources are loaded via backend for better performance
// This allows for lazy loading and reduces initial bundle size

// Supported languages configuration
export const supportedLanguages = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false },
  it: { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', rtl: false },
  pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', rtl: false },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false },
  ko: { name: 'Korean', nativeName: '한국어', flag: '🇰🇷', rtl: false },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳', rtl: false },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  he: { name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', rtl: true },
} as const;

export type SupportedLanguage = keyof typeof supportedLanguages;

// Resources will be loaded dynamically via backend
// This provides better performance and allows for runtime language switching

// Development mode detection
const isDevelopment = import.meta.env.DEV;

// Language detection options
const detectionOptions = {
  // Order of language detection methods
  order: ['localStorage', 'navigator', 'htmlTag'],

  // Cache user language in localStorage
  caches: ['localStorage'],

  // Cookie settings (if using cookie caching)
  cookieMinutes: 160,
  cookieDomain: 'localhost',

  // Exclude certain paths from detection
  excludeCacheFor: ['cimode'],

  // HTML tag to check for language
  htmlTag: document.documentElement,

  // Fallback language if detection fails
  fallbackLng: 'en',
};

i18n
  // Load translation backend for additional languages
  .use(Backend)

  // Detect user language
  .use(LanguageDetector)

  // Pass the i18n instance to react-i18next
  .use(initReactI18next)

  // Initialize i18next
  .init({
    // Fallback language
    fallbackLng: 'en',

    // Only load base language (e.g., "en") and ignore region codes (e.g., "en-GB")
    load: 'languageOnly',

    // List of explicitly supported languages
    supportedLngs: Object.keys(supportedLanguages),

    // If a detected language isn't explicitly listed above, fall back to its base language
    nonExplicitSupportedLngs: true,

    // Default namespace
    defaultNS: 'common',

    // Namespaces to load by default
    ns: ['common', 'auth', 'dashboard', 'landing'],

    // Debug mode for development
    debug: isDevelopment,

    // Language detection configuration
    detection: detectionOptions,

    // Backend configuration for lazy loading
    backend: {
      // Path to load additional translations
      loadPath: '/locales/{{lng}}/{{ns}}.json',

      // Allow cross-origin requests
      crossDomain: true,

      // Request options
      requestOptions: {
        cache: 'default',
      },
    },

    // React-specific options
    react: {
      // Use React.Suspense for async translations
      useSuspense: false,

      // Bind i18n instance to component
      bindI18n: 'languageChanged',

      // Bind i18n store to component
      bindI18nStore: 'added removed',

      // Default translation component
      defaultTransParent: 'div',

      // Escape translated values
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'span'],
    },

    // Interpolation options
    interpolation: {
      // React already escapes by default
      escapeValue: false,

      // Format function for custom formatting
      format: (value, format, lng) => {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        if (format === 'currency' && lng) {
          return new Intl.NumberFormat(lng, {
            style: 'currency',
            currency: 'USD',
          }).format(value);
        }
        if (format === 'number' && lng) {
          return new Intl.NumberFormat(lng).format(value);
        }
        if (format === 'date' && lng) {
          return new Intl.DateTimeFormat(lng).format(new Date(value));
        }
        return value;
      },
    },

    // Resources are loaded dynamically via backend

    // Pluralization options
    pluralSeparator: '_',

    // Key separator for nested translations
    keySeparator: '.',

    // Namespace separator
    nsSeparator: ':',

    // Return key if translation is missing (useful for development)
    returnEmptyString: false,
    returnNull: false,

    // Load all namespaces on init
    preload: ['en'],

    // Clean code on language change
    cleanCode: true,

    // Save missing translations
    saveMissing: isDevelopment,

    // Missing key handler for development
    missingKeyHandler: isDevelopment
      ? (lng, ns, key, fallbackValue) => {
          console.warn(`Missing translation: ${lng}.${ns}.${key}`);
        }
      : undefined,
  });

// Export default instance
export default i18n;

// Utility functions
export const getCurrentLanguage = (): SupportedLanguage => {
  return (i18n.language?.split('-')[0] as SupportedLanguage) || 'en';
};

export const changeLanguage = async (language: SupportedLanguage): Promise<void> => {
  await i18n.changeLanguage(language);

  // Update document direction for RTL languages
  const isRTL = supportedLanguages[language].rtl;
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = language;

  // Store preference in localStorage
  localStorage.setItem('i18nextLng', language);
};

export const isRTLLanguage = (language?: string): boolean => {
  const lang = (language || getCurrentLanguage()) as SupportedLanguage;
  return supportedLanguages[lang]?.rtl || false;
};

export const getLanguageInfo = (language: SupportedLanguage) => {
  return supportedLanguages[language];
};

// Initialize document direction on load
const initLanguage = getCurrentLanguage();
document.documentElement.dir = isRTLLanguage(initLanguage) ? 'rtl' : 'ltr';
document.documentElement.lang = initLanguage;
