import Navigation from '@/shared/components/layout/Navigation';
import Footer from '@/shared/components/layout/Footer';
import { useSEO, SEO_CONFIGS } from '@/shared/hooks/useSEO';
import PingalaVerbatimHero from '../components/PingalaVerbatimHero';
import PingalaVerbatimKeyFeatures from '../components/PingalaVerbatimKeyFeatures';
import PingalaVerbatimWhyChoosePingala from '../components/PingalaVerbatimWhyChoosePingala';
import PingalaVerbatimUseCase from '../components/PingalaVerbatimUseCase';
import PingalaVerbatimHowItWorks from '../components/PingalaVerbatimHowItWorks';
import PingalaVerbatimSecureUse from '../components/PingalaVerbatimSecureUse';
import PingalaVerbatimGetStarted from '../components/PingalaVerbatimGetStarted';

const PingalaVerbatimProduct = () => {
  // Apply SEO configuration for Verbatim product page
  useSEO(SEO_CONFIGS.verbatim);

  return (
    <div className="min-h-screen">
      <Navigation />

      <PingalaVerbatimHero />
      <PingalaVerbatimKeyFeatures />
      <PingalaVerbatimWhyChoosePingala />
      <PingalaVerbatimUseCase />
      <PingalaVerbatimHowItWorks />
      <PingalaVerbatimSecureUse />
      <PingalaVerbatimGetStarted />

      <Footer />
    </div>
  );
};

export default PingalaVerbatimProduct;
