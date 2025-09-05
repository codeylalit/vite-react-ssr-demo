import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DocsSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/docs');
  };

  return (
    // Start Building Banner Section
    <section className="py-12 bg-gradient-to-br from-primary/10 via-electric-blue/10 to-purple-500/10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/5 bg-[size:40px_40px]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-electric-blue/5"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Banner Content */}
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-green-600/20 ring-inset mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Pingala V1: Available Now
          </div>

          {/* Main Heading */}
          <h2
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-electric-blue to-purple-500 bg-clip-text text-transparent mb-6"
            style={{ lineHeight: '2' }}
          >
            Start Building
          </h2>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Get started building with our State-of-the-Art Open Models
          </p>

          {/* CTA Button */}
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] hover:from-[#0f0d1f] hover:via-[#1e1b3e] hover:to-[#2d4cc8] text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DocsSection;
