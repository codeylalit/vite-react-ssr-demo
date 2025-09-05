import Navigation from '@/shared/components/layout/Navigation';
import Footer from '@/shared/components/layout/Footer';
import { useSEO, SEO_CONFIGS } from '@/shared/hooks/useSEO';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Crosshair, Eye, MapPin } from 'lucide-react';
import AboutUsHero from '../components/AboutUsHero';
import MissionAndVison from '../components/MissionAndVison';
import OurOrigin from '../components/OurOrigin';
import LegacyInFourLetters from '../components/LegacyInFourLetters';
import CoreBenifits from '../components/CoreBenifits';
import MileStone from '../components/MileStone';
import GlobalFootPrint from '../components/GlobalFootPrint';

// Legacy products data

const AboutUs = () => {
  // Apply SEO configuration for About page
  useSEO(SEO_CONFIGS.about);

  return (
    <div className="min-h-screen">
      <Navigation />

      <AboutUsHero />

      <MissionAndVison />

      <OurOrigin />

      <LegacyInFourLetters />

      <CoreBenifits />

      <MileStone />

      <GlobalFootPrint />

      <Footer />
    </div>
  );
};

export default AboutUs;
