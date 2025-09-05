import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import LanguageRegionModal from './LanguageRegionModal';
import { regions as parsedRegions, regionStyles, Region } from '../data/languages';
import { Globe } from 'lucide-react';

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

interface LanguageCoverageProps {
  onLanguageSelect?: (language: Language) => void;
}

const LanguageCoverage: React.FC<LanguageCoverageProps> = ({ onLanguageSelect }) => {
  const [visibleRegions, setVisibleRegions] = useState<boolean[]>(() =>
    new Array(parsedRegions.length).fill(false)
  );
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Immediate animation for each region
            Array.from({ length: parsedRegions.length }, (_, index) => index).forEach(index => {
              setTimeout(
                () => {
                  setVisibleRegions(prev => {
                    const newVisible = [...prev];
                    newVisible[index] = true;
                    return newVisible;
                  });
                },
                reducedMotion ? 0 : index * 20
              );
            });
          }
        });
      },
      { threshold: 0.05, rootMargin: '100px' }
    );

    if (sectionsRef.current) observer.observe(sectionsRef.current);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const languageRegions = parsedRegions.sort((a, b) => b.languages.length - a.languages.length);

  return (
    <section
      id="languages"
      className="py-8 md:py-12 lg:py-16 bg-gradient-to-b from-white via-purple-50 to-orange-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            <span className="text-gray-900">Understand Everyone. </span>
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Speak to Anyone.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto mb-12">
            Comprehensive speech recognition across 216 languages and dialects.
          </p>

          {/* Key Stats */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
            <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-amber-200/50 shadow-sm">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] bg-clip-text text-transparent mb-1">
                216
              </div>
              <div className="text-sm text-gray-600">Languages Supported</div>
            </div>
            <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-purple-200/50 shadow-sm">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] bg-clip-text text-transparent mb-1">
                96.8%
              </div>
              <div className="text-sm text-gray-600">Global Population Coverage</div>
            </div>
            <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-orange-200/50 shadow-sm">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] bg-clip-text text-transparent mb-1">
                1M+
              </div>
              <div className="text-sm text-gray-600">Minimum Native Speakers</div>
            </div>
          </div>
        </div>

        {/* Language Regions Grid */}
        <div ref={sectionsRef} className="relative mb-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Language Regions</h3>
            <p className="text-gray-600">
              Explore our comprehensive language coverage across the globe
            </p>
          </div>

          {/* Responsive Grid Container with Better Distribution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto justify-items-center">
            {languageRegions.map((region, index) => {
              const style = regionStyles[region.name] || regionStyles.default;
              const Icon = style.icon || Globe;
              return (
                <Card
                  key={region.name}
                  onClick={() => {
                    setSelectedRegion(region);
                    setIsModalOpen(true);
                  }}
                  className={`cursor-pointer group hover:scale-105 transition-all duration-700 transform w-full max-w-sm ${
                    visibleRegions[index] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: `${reducedMotion ? 0 : index * 50}ms` }}
                >
                  <CardHeader className={`relative bg-gradient-to-br ${style.bgGradient} p-4`}>
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
                    />

                    <div className="relative z-10">
                      <Icon
                        className={`w-6 h-6 mb-2 bg-gradient-to-br ${style.gradient} text-transparent bg-clip-text group-hover:scale-110 transition-transform duration-300`}
                      />

                      <CardTitle className="text-lg font-bold text-gray-900 mb-2">
                        {region.name}
                      </CardTitle>

                      <Badge
                        className={`bg-gradient-to-r ${style.gradient} text-white border-0 mb-2`}
                      >
                        {region.count} Languages
                      </Badge>

                      <p className="text-sm text-gray-600">{region.description}</p>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {region.languages.slice(0, 12).map((lang, langIndex) => (
                        <span
                          key={langIndex}
                          className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                        >
                          {lang.name}
                        </span>
                      ))}
                      {region.languages.length > 12 && (
                        <span className="inline-block text-xs text-gray-500 px-2 py-1">
                          +{region.languages.length - 12} more...
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Philosophy Statement */}
        {/* <div className="text-center">
          <div className="max-w-3xl mx-auto">
            <div
              className="space-y-4 p-4 lg:p-6 bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl border border-purple-700/30 relative z-10 shadow-lg"
              style={{
                fontFamily: '"Noto Serif Devanagari", "Devanagari Sangam MN", "Mangal", serif',
                position: 'relative',
                isolation: 'isolate',
              }}
            >
              <div className="text-lg sm:text-xl lg:text-2xl bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent font-semibold">
                śruteḥ śabdamūlatvāt
              </div>
              <div className="text-sm text-purple-200 italic">
                Reality being rooted in sound, it has words as its basis.
              </div>
            </div>
          </div>
        </div> */}

        {/* Region Detail Modal */}
        <LanguageRegionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          region={selectedRegion}
          onLanguageSelect={onLanguageSelect}
        />
      </div>
    </section>
  );
};

export default LanguageCoverage;
