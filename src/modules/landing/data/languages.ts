// Import the CSV data instead of markdown
import csvData from '../../../../docs/api/lang.csv?raw';
import { Globe, Heart, Sparkles, Users, Map, Compass, Building } from 'lucide-react';

export type LanguageStatus = 'available' | 'coming-soon';

export interface LanguageMeta {
  code: string; // ISO code like en, en-GB, hi, etc.
  name: string; // English name (with any variant)
  native: string; // Native script/name
  speakers: string; // Human-readable speaker count – e.g. 15M
  script: string; // Script family e.g. Latin, Devanagari
  status: LanguageStatus;
  sampleText: string;
  region: string; // Region heading the language belongs to
}

export interface Region {
  name: string;
  description: string;
  languages: LanguageMeta[];
  count: number; // number of languages in the region (derived)
}

/**
 * Parse the CSV file from docs/api into structured data that can
 * be consumed by UI components. The CSV file is imported as a raw string
 * via Vite (`?raw`).
 */
function parseLanguageCSV(csvContent: string): Region[] {
  const lines = csvContent?.split(/\r?\n/);
  const regions: Region[] = [];
  const regionMap: Record<string, Region> = {};

  // Region headers to descriptions mapping
  const regionDescriptions: Record<string, string> = {
    'Indic': 'Complete coverage of the Indian subcontinent',
    'Asian': 'Comprehensive East & Southeast Asian coverage',
    'European': 'From major languages to regional dialects',
    'African': "Celebrating the continent's rich linguistic heritage",
    'Middle Eastern': 'Bridge between continents and cultures',
    'North American': 'Languages of North America including indigenous varieties',
    'South American': 'Languages of South America including indigenous varieties',
  };

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Skip header line
    if (trimmedLine.startsWith('Region,Language Name')) {
      continue;
    }

    // Parse language data lines - Updated CSV structure:
    // Region,Language Name (Native),[EN] Name,Code,Native Speakers (M),Status,Sample Text,Script
    const parts = trimmedLine.split(',');
    if (parts.length >= 8) {
      const [region, nativeName, englishName, code, speakers, status, sampleText, script] = parts.map(p => p.trim());

      // Skip if this is just a region name without language data
      if (!code || !englishName || englishName === region) continue;

      const languageStatus: LanguageStatus = status.toLowerCase().includes('available')
        ? 'available'
        : 'coming-soon';

      // Create region if it doesn't exist
      if (!regionMap[region]) {
        regionMap[region] = {
          name: region,
          description: regionDescriptions[region] || 'Diverse linguistic coverage',
          languages: [],
          count: 0,
        };
        regions.push(regionMap[region]);
      }

      // Add to region (allow duplicates for regional display)
      regionMap[region].languages.push({
        code: code.trim(),
        name: englishName.trim(),
        native: nativeName.trim(),
        speakers: speakers.trim() + 'M',
        script: script.trim(),
        status: languageStatus,
        sampleText: sampleText.trim() || 'Everything starts from zero',
        region: region,
      });
    }
  }

  // Update counts for each region
  regions.forEach(region => {
    region.count = region.languages.length;
  });

  return regions;
}

export const regions: Region[] = parseLanguageCSV(csvData);

// Create deduplicated languages array for dropdowns to avoid React key conflicts
export const languages: LanguageMeta[] = (() => {
  const seenLanguageCodes: Set<string> = new Set();
  const deduplicatedLanguages: LanguageMeta[] = [];

  regions.forEach(region => {
    region.languages.forEach(language => {
      if (!seenLanguageCodes.has(language.code)) {
        seenLanguageCodes.add(language.code);
        deduplicatedLanguages.push(language);
      }
    });
  });

  return deduplicatedLanguages;
})();
export const scripts: string[] = Array.from(new Set(languages.map(l => l.script))).sort();

// Helper for region styling – updated for new region names
export const regionStyles: Record<
  string,
  { gradient: string; bgGradient: string; icon: typeof Globe }
> = {
  'Indic': {
    gradient: 'from-orange-400 to-red-500',
    bgGradient: 'from-orange-50 to-red-50',
    icon: Heart,
  },
  'Asian': {
    gradient: 'from-green-400 to-blue-500',
    bgGradient: 'from-green-50 to-blue-50',
    icon: Sparkles,
  },
  'European': {
    gradient: 'from-blue-400 to-indigo-500',
    bgGradient: 'from-blue-50 to-indigo-50',
    icon: Globe,
  },
  'African': {
    gradient: 'from-yellow-400 to-orange-500',
    bgGradient: 'from-yellow-50 to-orange-50',
    icon: Users,
  },
  'Middle Eastern': {
    gradient: 'from-purple-400 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50',
    icon: Building,
  },
  'North American': {
    gradient: 'from-teal-400 to-cyan-500',
    bgGradient: 'from-teal-50 to-cyan-50',
    icon: Compass,
  },
  'South American': {
    gradient: 'from-emerald-400 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-50',
    icon: Map,
  },
  // Default fallback style
  default: {
    gradient: 'from-gray-400 to-gray-600',
    bgGradient: 'from-gray-50 to-gray-100',
    icon: Globe,
  },
};
