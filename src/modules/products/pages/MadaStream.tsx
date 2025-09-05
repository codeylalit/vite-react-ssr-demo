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
  Network,
  Brain,
  GitBranch,
  Calculator,
  Microscope,
  Route,
  CheckCircle,
  Infinity,
  TrendingUp,
  Zap,
  Eye,
  GraduationCap,
  FlaskConical,
  Scale,
  Shield,
  Wrench,
  Play,
  BookOpen,
  Users,
  Target,
  Search,
  Lock,
  MessageSquare,
} from 'lucide-react';
import MadaStreamHeroSection from '../components/MadaStreamHeroSection';
import MadaStreamCoreCapabilities from '../components/MadaStreamCoreCapabilities';
import MadaStreamHowItWorks from '../components/MadaStreamHowItWorks';
import MadaStreamMathInspiration from '../components/MadaStreamMathInspiration';
import MadaStreamWhyItsDifferent from '../components/MadaStreamWhyItsDifferent';
import MadaStreamUseCase from '../components/MadaStreamUseCase';
import MadaStreamTrustworthy from '../components/MadaStreamTrustworthy';
import MadaStreamCollabrate from '../components/MadaStreamCollabrate';

const MadaStream = () => {
  // Apply SEO configuration for Stream product page
  useSEO(SEO_CONFIGS.stream);

  return (
    <div className="min-h-screen">
      <Navigation />

      <MadaStreamHeroSection />
      <MadaStreamCoreCapabilities />
      <MadaStreamHowItWorks />
      <MadaStreamMathInspiration />
      <MadaStreamUseCase />
      <MadaStreamWhyItsDifferent />
      <MadaStreamTrustworthy />
      <MadaStreamCollabrate />

      <Footer />
    </div>
  );
};

export default MadaStream;
