// Import the language data from the landing module
import { languages as allLanguages, scripts as allScripts, regions } from '../../landing/data/languages';

export type LanguageStatus = 'available' | 'coming-soon';

export interface Language {
  code: string;
  name: string;
  native: string;
  speakers: string;
  script: string;
  status: LanguageStatus;
  sampleText: string;
  region: string;
  flag?: string;
}

export interface Script {
  name: string;
  icon: string;
  speakerCount: number;
}

export interface AudioSettings {
  chunkDuration: number;
  silenceThreshold: number;
  noiseReduction: boolean;
  autoGain: boolean;
  sampleRate: number;
  bitrate: number;
}

/**
 * Load and process language data for the realtime module
 */
export function loadLanguageData(): Promise<Language[]> {
  return new Promise((resolve) => {
    // Convert the landing module data to the format expected by realtime
    const realtimeLanguages: Language[] = allLanguages.map(lang => ({
      code: lang.code,
      name: lang.name,
      native: lang.native,
      speakers: lang.speakers,
      script: lang.script,
      status: lang.status,
      sampleText: lang.sampleText,
      region: lang.region,
      flag: getFlagEmoji(lang.code)
    }));

    resolve(realtimeLanguages);
  });
}

/**
 * Get only available languages for transcription
 */
export function getAvailableLanguages(): Language[] {
  return allLanguages
    .filter(lang => lang.status === 'available')
    .map(lang => ({
      code: lang.code,
      name: lang.name,
      native: lang.native,
      speakers: lang.speakers,
      script: lang.script,
      status: lang.status,
      sampleText: lang.sampleText,
      region: lang.region,
      flag: getFlagEmoji(lang.code)
    }));
}

/**
 * Get script mapping with icons and speaker counts
 */
export function getScriptMapping(): Record<string, Script> {
  const scriptMap: Record<string, Script> = {};
  
  allScripts.forEach(script => {
    const languagesWithScript = allLanguages.filter(lang => lang.script === script);
    scriptMap[script] = {
      name: script,
      icon: getScriptIcon(script),
      speakerCount: languagesWithScript.length
    };
  });

  return scriptMap;
}

/**
 * Filter languages based on search term
 */
export function filterLanguages(languages: Language[], searchTerm: string): Language[] {
  if (!searchTerm) return languages;
  
  const term = searchTerm.toLowerCase();
  return languages.filter(lang =>
    lang.name.toLowerCase().includes(term) ||
    lang.native.toLowerCase().includes(term) ||
    lang.code.toLowerCase().includes(term)
  );
}

/**
 * Get languages by script
 */
export function getLanguagesByScript(script: string): Language[] {
  return getAvailableLanguages().filter(lang => lang.script === script);
}

/**
 * Get language by code
 */
export function getLanguageByCode(code: string): Language | undefined {
  return getAvailableLanguages().find(lang => lang.code === code);
}

/**
 * Get scripts used by available languages
 */
export function getAvailableScripts(): Script[] {
  const availableLanguages = getAvailableLanguages();
  const scriptCounts: Record<string, number> = {};
  
  availableLanguages.forEach(lang => {
    scriptCounts[lang.script] = (scriptCounts[lang.script] || 0) + 1;
  });

  return Object.keys(scriptCounts).map(script => ({
    name: script,
    icon: getScriptIcon(script),
    speakerCount: scriptCounts[script]
  }));
}

/**
 * Get flag emoji for language codes
 */
export function getFlagEmoji(code: string): string {
  const flagMap: Record<string, string> = {
    'hi': '🇮🇳', 'en': '🇺🇸', 'en-US': '🇺🇸', 'en-GB': '🇬🇧',
    'bn': '🇧🇩', 'te': '🇮🇳', 'ta': '🇮🇳', 'gu': '🇮🇳', 'kn': '🇮🇳',
    'ml': '🇮🇳', 'mr': '🇮🇳', 'pa': '🇮🇳', 'ur': '🇵🇰', 'ne': '🇳🇵',
    'as': '🇮🇳', 'or': '🇮🇳', 'ks': '🇮🇳', 'sd': '🇵🇰', 'mai': '🇮🇳',
    'bho': '🇮🇳', 'mag': '🇮🇳', 'awa': '🇮🇳', 'fr': '🇫🇷', 'de': '🇩🇪',
    'es': '🇪🇸', 'it': '🇮🇹', 'pt': '🇵🇹', 'ru': '🇷🇺', 'zh': '🇨🇳',
    'ja': '🇯🇵', 'ko': '🇰🇷', 'ar': '🇸🇦', 'th': '🇹🇭', 'vi': '🇻🇳',
    'id': '🇮🇩', 'ms': '🇲🇾', 'tl': '🇵🇭', 'sw': '🇰🇪', 'am': '🇪🇹',
    'so': '🇸🇴', 'ha': '🇳🇬', 'yo': '🇳🇬', 'ig': '🇳🇬', 'zu': '🇿🇦',
    'xh': '🇿🇦', 'af': '🇿🇦', 'tr': '🇹🇷', 'fa': '🇮🇷', 'he': '🇮🇱',
    'fi': '🇫🇮', 'sv': '🇸🇪', 'no': '🇳🇴', 'da': '🇩🇰', 'nl': '🇳🇱',
    'pl': '🇵🇱', 'cs': '🇨🇿', 'sk': '🇸🇰', 'hu': '🇭🇺', 'ro': '🇷🇴',
    'bg': '🇧🇬', 'hr': '🇭🇷', 'sr': '🇷🇸', 'uk': '🇺🇦', 'be': '🇧🇾',
    'lt': '🇱🇹', 'lv': '🇱🇻', 'et': '🇪🇪', 'sl': '🇸🇮', 'mk': '🇲🇰',
    'mt': '🇲🇹', 'is': '🇮🇸', 'ga': '🇮🇪', 'cy': '🏴󠁧󠁢󠁷󠁬󠁳󠁿', 'eu': '🇪🇸',
    'ca': '🇪🇸', 'gl': '🇪🇸', 'default': '🌐'
  };
  
  const baseCode = code.split('-')[0];
  return flagMap[baseCode] || flagMap[code] || flagMap['default'];
}

/**
 * Get script icon
 */
export function getScriptIcon(script: string): string {
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
    'Khmer': 'ক',
    'Lao': 'ກ',
    'Tibetan': 'ཀ',
    'Sinhala': 'ක',
    'Mongolian': 'ᠮ',
    'Lontara': 'ᨀ',
    'Hangul': '한',
    'Hiragana': 'ひ',
    'Katakana': 'カ',
    'Bopomofo': 'ㄅ',
    'Yi': 'ꆈ',
    'Vai': 'ꔀ',
    'Bamum': 'ꚠ',
    'Adlam': '𞤀',
    'Osage': '𐰀',
    'Hanifi Rohingya': '𐴀',
    'Wancho': '𞋀',
    'Chorasmian': '𐾰',
    'Dives Akuru': '𑤀',
    'Khitan Small Script': '𘬀',
    'Yezidi': '𐺀',
    'Old Uyghur': '𐽰',
    'Tangsa': '𖩰',
    'Toto': '𞊐',
    'Vithkuqi': '𞢀',
    'Kawi': '𑧀',
    'Nag Mundari': '𞓐'
  };
  
  return scriptIcons[script] || '🔡';
}

/**
 * Get default audio settings for a language
 */
export function getDefaultAudioSettings(languageCode: string): AudioSettings {
  // Different languages might have different optimal settings
  const baseSettings: AudioSettings = {
    chunkDuration: 250,
    silenceThreshold: 0.01,
    noiseReduction: true,
    autoGain: true,
    sampleRate: 16000,
    bitrate: 16000
  };

  // Language-specific optimizations
  const languageOptimizations: Record<string, Partial<AudioSettings>> = {
    'zh': { chunkDuration: 300 }, // Chinese benefits from slightly longer chunks
    'ja': { chunkDuration: 300 }, // Japanese benefits from slightly longer chunks
    'th': { chunkDuration: 200 }, // Thai benefits from shorter chunks
    'vi': { chunkDuration: 200 }, // Vietnamese benefits from shorter chunks
    'ar': { chunkDuration: 300 }, // Arabic benefits from slightly longer chunks
    'he': { chunkDuration: 300 }, // Hebrew benefits from slightly longer chunks
  };

  const baseCode = languageCode.split('-')[0];
  const optimizations = languageOptimizations[baseCode] || {};

  return { ...baseSettings, ...optimizations };
}

/**
 * Validate language code
 */
export function isValidLanguageCode(code: string): boolean {
  return getAvailableLanguages().some(lang => lang.code === code);
}

/**
 * Validate script name
 */
export function isValidScript(script: string): boolean {
  return allScripts.includes(script);
}

/**
 * Get language statistics
 */
export function getLanguageStats(): {
  totalLanguages: number;
  availableLanguages: number;
  comingSoonLanguages: number;
  totalScripts: number;
  regionCount: number;
} {
  const available = allLanguages.filter(lang => lang.status === 'available');
  const comingSoon = allLanguages.filter(lang => lang.status === 'coming-soon');

  return {
    totalLanguages: allLanguages.length,
    availableLanguages: available.length,
    comingSoonLanguages: comingSoon.length,
    totalScripts: allScripts.length,
    regionCount: regions.length
  };
}

// Export commonly used data
export const languages = getAvailableLanguages();
export const scripts = getAvailableScripts();
export const scriptMapping = getScriptMapping(); 