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
import { Badge } from '@/shared/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Heart,
  Globe,
  Zap,
  Copy,
  Languages,
  Sliders,
  CheckCircle,
  Brain,
  Mic,
  Music,
  Eye,
  Shield,
  Users,
  Book,
  Accessibility,
  Bot,
  GraduationCap,
  Play,
  Headphones,
  MessageSquare,
} from 'lucide-react';
import BharaReasonHeroSection from '../components/BharaReasonHeroSection';
import BharaReasonCoreCapabilities from '../components/BharaReasonCoreCapabilities';
import BharaReasonHowItWorks from '../components/BharaReasonHowItWorks';
import BharaReasonUseCase from '../components/BharaReasonUseCase';
import BharaReasonBuiltForTrust from '../components/BharaReasonBuiltForTrust';
import BharaReasonSpecial from '../components/BharaReasonSpecial';
import BharaReasonGetStarted from '../components/BharaReasonGetStarted';

const BharaReason = () => {
  // Apply SEO configuration for Reason product page
  useSEO(SEO_CONFIGS.reason);

  return (
    <div className="min-h-screen">
      <Navigation />

      <BharaReasonHeroSection />
      <BharaReasonCoreCapabilities />
      <BharaReasonHowItWorks />
      <BharaReasonUseCase />
      <BharaReasonBuiltForTrust />
      <BharaReasonSpecial />
      <BharaReasonGetStarted />

      <Footer />
    </div>
  );
};

export default BharaReason;
