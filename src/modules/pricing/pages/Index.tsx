import Navigation from '@/shared/components/layout/Navigation';
import Footer from '@/shared/components/layout/Footer';
import { useSEO, SEO_CONFIGS } from '@/shared/hooks/useSEO';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Link } from 'react-router-dom';
import { Check, Zap, Building, Shield } from 'lucide-react';
import PricingHero from '../components/PricingHero';
import PricingTires from '../components/PricingTires';
import PricingFAQ from '../components/PricingFAQ';

const Pricing = () => {
  // Apply SEO configuration for Pricing page
  useSEO(SEO_CONFIGS.pricing);

  return (
    <div className="min-h-screen">
      <Navigation />

      <PricingHero />

      <div id="pricing">
        <PricingTires />
      </div>

      <PricingFAQ />

      <Footer />
    </div>
  );
};

export default Pricing;
