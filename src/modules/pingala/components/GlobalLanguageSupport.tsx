import React, { useState, useEffect } from 'react';
import { Globe, Users, Sparkles, Heart } from 'lucide-react';
import { LanguageDataService } from '../services';
import type { LanguageSupport, Region } from '../types';

const GlobalLanguageSupport: React.FC = () => {
  const [languageRegions, setLanguageRegions] = useState<LanguageSupport[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [statistics, setStatistics] = useState({
    totalLanguages: 0,
    availableLanguages: 0,
    totalSpeakers: 0,
    coveragePercentage: 0,
    regions: 0,
  });
  const [regionStyles, setRegionStyles] = useState<any>({});

  useEffect(() => {
    // Load data from the language service
    const loadLanguageData = () => {
      const languageSupportData = LanguageDataService.getLanguageSupportData();
      const regionData = LanguageDataService.getLanguageRegions();
      const stats = LanguageDataService.getLanguageStatistics();
      const styles = LanguageDataService.getRegionStyles();

      setLanguageRegions(languageSupportData);
      setRegions(regionData);
      setStatistics(stats);
      setRegionStyles(styles);
    };

    loadLanguageData();
  }, []);

  const formatPopulation = (population: number) => {
    if (population >= 1000000000) {
      return `${(population / 1000000000).toFixed(1)}B`;
    }
    return `${Math.round(population / 1000000)}M`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B`;
    }
    if (num >= 1000000) {
      return `${Math.round(num / 1000000)}M`;
    }
    return num.toString();
  };

  return (
    <section className="py-8 sm:py-16 bg-gradient-to-b from-indigo-50 via-purple-50 to-blue-50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <header className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              216 Languages: The Global Revolution
            </span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-slate-600 mb-8">
              Perhaps most remarkably, Pingala V1 doesn't just excel in English. It supports 216
              languages, covering {statistics.coveragePercentage.toFixed(1)}% of the global
              population. This isn't just impressive—it's revolutionary for global communication.
            </p>
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <p className="text-lg text-blue-800">
                The mathematical beauty lies in how Pingala V1 maintains the{' '}
                <strong>"Everything starts from Zero"</strong> principle across all
                languages—recognizing that the concept of beginning, of mathematical zero, is
                universal across human cultures.
              </p>
            </div>
          </div>
        </header>

        {/* Global Coverage Statistics */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 mb-12 sm:mb-16 shadow-2xl border border-blue-500/30 relative overflow-hidden">
          {/* Glowing background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-blue-400/10 to-indigo-400/10 blur-3xl"></div>
          <div className="relative z-10">
            <div className="text-center mb-10">
              <h3 className="text-3xl sm:text-4xl font-bold mb-8 bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
                Global Language Coverage
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-300 mb-2">
                    216
                  </div>
                  <div className="text-sm sm:text-base opacity-90">
                    <span className="block sm:hidden">Languages</span>
                    <span className="hidden sm:block">Available Languages</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-300 mb-2">
                    {statistics.coveragePercentage.toFixed(1)}%
                  </div>
                  <div className="text-sm sm:text-base opacity-90">
                    <span className="block sm:hidden">Population</span>
                    <span className="hidden sm:block">Global Population</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-indigo-300 mb-2">
                    {formatNumber(statistics.totalSpeakers)}
                  </div>
                  <div className="text-sm sm:text-base opacity-90">
                    <span className="block sm:hidden">People Served</span>
                    <span className="hidden sm:block">People Served</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-violet-300 mb-2">
                    {statistics.regions}
                  </div>
                  <div className="text-sm sm:text-base opacity-90">
                    <span className="block sm:hidden">Regions</span>
                    <span className="hidden sm:block">Language Regions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Language Regions */}
        <div className="mb-12 sm:mb-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8 text-center">
            Regional Language Distribution
          </h3>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {regions.map((region, index) => {
              const style = regionStyles[region.name] || regionStyles.default;
              const Icon = style?.icon || Globe;

              return (
                <div
                  key={region.name}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 group hover:scale-105"
                >
                  {/* Header with gradient */}
                  <div
                    className={`p-6 bg-gradient-to-br ${style?.bgGradient || 'from-gray-50 to-gray-100'} relative`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${style?.gradient || 'from-gray-400 to-gray-600'} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
                    />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <Icon
                          className={`w-8 h-8 bg-gradient-to-br ${style?.gradient || 'from-gray-400 to-gray-600'} text-transparent bg-clip-text group-hover:scale-110 transition-transform duration-300`}
                        />
                        <div className="text-right">
                          <div
                            className={`text-3xl font-bold bg-gradient-to-br ${style?.gradient || 'from-gray-400 to-gray-600'} bg-clip-text text-transparent`}
                          >
                            {region.languages.filter(lang => lang.status === 'available').length}
                          </div>
                          <div className="text-xs text-slate-500">Available Languages</div>
                        </div>
                      </div>
                      <h4 className="text-xl font-semibold text-slate-900 mb-2">{region.name}</h4>
                      <p className="text-sm text-slate-600">{region.description}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="text-lg font-semibold text-green-600">
                        {formatPopulation(
                          region.languages
                            .filter(lang => lang.status === 'available')
                            .reduce((sum, lang) => {
                              const speakers =
                                LanguageDataService.parseLanguageSpeakers?.(lang.speakers) || 0;
                              return sum + speakers;
                            }, 0)
                        )}
                      </div>
                      <div className="text-sm text-slate-600">speakers reached</div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-slate-700 mb-2">
                        Available Languages:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {region.languages
                          .filter(lang => lang.status === 'available')
                          .slice(0, 6)
                          .map((lang, idx) => (
                            <span
                              key={idx}
                              className={`bg-gradient-to-r ${style?.gradient || 'from-blue-400 to-indigo-500'} text-white px-3 py-1 rounded-full text-xs font-medium`}
                            >
                              {lang.name}
                            </span>
                          ))}
                        {region.languages.filter(lang => lang.status === 'available').length >
                          6 && (
                          <span className="text-xs text-slate-500 px-2 py-1">
                            +
                            {region.languages.filter(lang => lang.status === 'available').length -
                              6}{' '}
                            more...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-World Impact */}
        <div className="mb-12 sm:mb-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8 text-center">
            Real-World Impact: From Call Centers to Content Creation
          </h3>
          <div className="prose prose-lg max-w-none text-slate-700 space-y-6">
            <p>
              The implications of Pingala V1's breakthrough extend far beyond academic benchmarks.
              The enhanced cleaning algorithms are revolutionizing customer service with
              crystal-clear transcriptions. In media production, the verbatim accuracy is
              eliminating the need for manual corrections. In global businesses, the 216 language
              support is breaking down communication barriers that have existed for decades.
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">Call Centers</h4>
              <p className="text-slate-600">
                Crystal-clear transcriptions revolutionizing customer service across 216 languages
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">Media Production</h4>
              <p className="text-slate-600">
                Verbatim accuracy eliminating manual corrections in global content creation
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">Global Business</h4>
              <p className="text-slate-600">
                Breaking down communication barriers with mathematical precision
              </p>
            </div>
          </div>
        </div>

        {/* Semantic Correction Engine */}
        <div className="bg-slate-50 rounded-xl p-6 sm:p-8 border border-slate-200">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 text-center">
            The Semantic Correction Engine
          </h3>
          <div className="prose prose-lg max-w-none text-slate-700 text-center">
            <p>
              The semantic correction engine alone represents a quantum leap in understanding
              context. By combining acoustic, linguistic, and semantic information, Pingala V1
              doesn't just transcribe words—it understands meaning, catching errors that would slip
              past traditional systems across all 216 supported languages.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalLanguageSupport;
