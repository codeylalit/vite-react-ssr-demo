import { languages, regions } from '../data/languages';

// Parse speaker count string to number
export function parseSpeakerCount(speakerStr: string): number {
  if (!speakerStr || speakerStr === '-') return 0;

  const cleanStr = speakerStr.replace(/[,+]/g, '').trim();
  const match = cleanStr.match(/([\d.]+)\s*([MBK]?)/i);

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
      return num * 1_000_000; // Default to millions if no suffix
  }
}

// Calculate total speakers for available languages
export function getTotalAvailableSpeakers(): number {
  return languages
    .filter(lang => lang.status === 'available')
    .reduce((total, lang) => total + parseSpeakerCount(lang.speakers), 0);
}

// Calculate total speakers for all languages
export function getTotalAllSpeakers(): number {
  return languages.reduce((total, lang) => total + parseSpeakerCount(lang.speakers), 0);
}

// Calculate global population coverage percentage (assuming 8B total population)
export function getGlobalCoveragePercentage(): number {
  const GLOBAL_POPULATION = 8_000_000_000;
  const availableSpeakers = getTotalAvailableSpeakers();
  return Math.min((availableSpeakers / GLOBAL_POPULATION) * 100, 100);
}

// Get language counts
export function getLanguageCounts() {
  const availableLanguages = languages.filter(lang => lang.status === 'available');
  const comingSoonLanguages = languages.filter(lang => lang.status === 'coming-soon');

  return {
    total: languages.length,
    available: availableLanguages.length,
    comingSoon: comingSoonLanguages.length,
    regions: regions.length,
  };
}

// Get formatted language count for display
export function getFormattedLanguageCount(includeTotal: boolean = false): string {
  const counts = getLanguageCounts();
  if (includeTotal) {
    return `${counts.total}+`;
  }
  return `${counts.available}+`;
}

// Get formatted coverage percentage
export function getFormattedCoveragePercentage(): string {
  return `${getGlobalCoveragePercentage().toFixed(1)}%`;
}

// Format speaker count for display
export function formatSpeakerCount(count: number): string {
  if (count >= 1_000_000_000) {
    return `${(count / 1_000_000_000).toFixed(1)}B`;
  } else if (count >= 1_000_000) {
    return `${Math.round(count / 1_000_000)}M`;
  } else if (count >= 1_000) {
    return `${Math.round(count / 1_000)}K`;
  }
  return count.toString();
}

// Get comprehensive language statistics
export function getLanguageStatistics() {
  const counts = getLanguageCounts();
  const availableSpeakers = getTotalAvailableSpeakers();
  const totalSpeakers = getTotalAllSpeakers();
  const coveragePercentage = getGlobalCoveragePercentage();

  return {
    totalLanguages: counts.total,
    availableLanguages: counts.available,
    comingSoonLanguages: counts.comingSoon,
    totalRegions: counts.regions,
    availableSpeakers,
    totalSpeakers,
    coveragePercentage,
    formattedCoverage: getFormattedCoveragePercentage(),
    formattedAvailableSpeakers: formatSpeakerCount(availableSpeakers),
    formattedTotalSpeakers: formatSpeakerCount(totalSpeakers),
  };
}

// Get pricing tier language counts (for pricing component)
export function getPricingTierCounts() {
  const availableLanguages = getLanguageCounts().available;

  return {
    basic: Math.min(5, availableLanguages),
    professional: Math.min(50, availableLanguages),
    enterprise: availableLanguages,
  };
}

export default {
  parseSpeakerCount,
  getTotalAvailableSpeakers,
  getTotalAllSpeakers,
  getGlobalCoveragePercentage,
  getLanguageCounts,
  getFormattedLanguageCount,
  getFormattedCoveragePercentage,
  formatSpeakerCount,
  getLanguageStatistics,
  getPricingTierCounts,
};
