import React, { useState, useCallback } from 'react';
import Header from '../../../shared/components/layout/Header';
import Hero from '../../../modules/landing/components/Hero';
import LanguageDemo from '../../../modules/landing/components/LanguageDemo';
import LanguageCoverage from '../../../modules/landing/components/LanguageCoverage';
import Benchmarks from '../../../modules/landing/components/Benchmarks';
import ModelLineup from '../../../modules/landing/components/ModelLineup';
import Pricing from '../../../modules/landing/components/Pricing';
import OrganizationInfo from '../../../modules/landing/components/OrganizationInfo';
import Footer from '../../../shared/components/layout/Footer';
import { useSEO, SEO_CONFIGS } from '../../../shared/hooks/useSEO';
import { StructuredData, STRUCTURED_DATA_SCHEMAS } from '../../../shared/components/seo/StructuredData';
import ProductShowcase from '../components/ProductShowcase';
import WhyShunyaLabs from '../components/WhyShunyaLabs';
import PreFooter from '../components/PreFooter';
import Navigator from '../../../shared/components/layout/Navigation';
import DocsSection from '../components/DocsSection';

// Language type for shared state
interface Language {
  code: string;
  name: string;
  native: string;
  region: string;
  flag: string;
  speakers: string;
  isAvailable?: boolean;
}

const Index = () => {
  // Apply SEO optimization for landing page
  useSEO(SEO_CONFIGS.landing);

  // Shared language state for Hero and LanguageCoverage integration
  const [sharedLanguage, setSharedLanguage] = useState<Language | null>(null);

  // Handler for language selection from LanguageRegionModal
  const handleLanguageSelect = useCallback((language: Language) => {
    console.log('🌍 [DEBUG] Language selected from modal:', language);
    setSharedLanguage(language);

    // Scroll to Hero section to show the selected language
    const heroSection =
      document.querySelector('section[id="hero"]') ||
      document.querySelector('[data-section="hero"]');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Handler for language updates from Hero (optional - for future bidirectional sync)
  const handleHeroLanguageChange = useCallback((language: Language) => {
    setSharedLanguage(language);
  }, []);

  return (
    <div className="min-h-screen transition-colors bg-white">
      {/* SEO Structured Data */}
      <StructuredData data={STRUCTURED_DATA_SCHEMAS.organization} />
      <StructuredData data={STRUCTURED_DATA_SCHEMAS.product} />
      <StructuredData data={STRUCTURED_DATA_SCHEMAS.faq} />

      {/* <Header /> */}
      <Navigator />

      {/* Hero with embedded demo - Clean light theme */}
      {/* <Hero
        externalLanguageSelection={sharedLanguage}
        onLanguageChange={handleHeroLanguageChange}
      /> */}

      {/* Product Showcase */}
      <ProductShowcase />
      {/* Documentation Section */}
      <DocsSection />
      {/* Why shunya labs */}
      <WhyShunyaLabs />

      {/* Language Coverage */}
      <LanguageCoverage onLanguageSelect={handleLanguageSelect} />

      {/* Benchmarks */}
      <Benchmarks />

      {/* Model Lineup */}
      {/* <ModelLineup /> */}

      {/* Pricing */}
      {/* <Pricing /> */}

      {/* Organization Information */}
      <OrganizationInfo />

      {/* Pre Footer */}
      <PreFooter />

      {/* Footer - Proper light theme */}
      <Footer />
    </div>
  );
};

export default Index;
