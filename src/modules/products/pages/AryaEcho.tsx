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
  Brain,
  MessageCircle,
  Shield,
  Users,
  Heart,
  GraduationCap,
  HeadphonesIcon,
  CheckCircle,
  Infinity,
  Calculator,
  Globe,
  Bot,
  Mic,
  Type,
  MemoryStick,
  BookOpen,
  Zap,
  Lock,
} from 'lucide-react';
import AryaEchoHeroSection from '../components/AryaEchoHeroSection';
import AryaEchoKeyFeatures from '../components/AryaEchoKeyFeatures';
import AryaEchoHowItWorks from '../components/AryaEchoHowItWorks';
import AncientIndianInspiration from '../components/AryaEchoIndianInspiration';
import AryaEchoUseCase from '../components/AryaEchoUseCase';
import AryaEchoSafeAndPrivate from '../components/AryaEchoSafeAndPrivate';
import AryaEchoDevelopmentStatus from '../components/AryaEchoDevelopmentStatus';
import AryaEchoCTASection from '../components/AryaEchoCTASection';

const AryaEcho = () => {
  // Apply SEO configuration for Echo product page
  useSEO(SEO_CONFIGS.echo);

  return (
    <div className="min-h-screen">
      <Navigation />

      <AryaEchoHeroSection />
      <AryaEchoKeyFeatures />
      <AryaEchoHowItWorks />
      <AncientIndianInspiration />
      <AryaEchoUseCase />
      <AryaEchoSafeAndPrivate />
      <AryaEchoDevelopmentStatus />
      <AryaEchoCTASection />

      <Footer />
    </div>
  );
};

export default AryaEcho;
