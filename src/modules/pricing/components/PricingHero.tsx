import { Check, ArrowRight, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';

const scrollToPricingTable = (e: React.MouseEvent) => {
  e.preventDefault();
  const element = document.getElementById('pricing-table');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const PricingHero = () => {
  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-[calc(100vh-4rem)] py-16 md:py-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, #3B82F6 2px, transparent 0), radial-gradient(circle at 75px 75px, #10B981 2px, transparent 0)`,
              backgroundSize: '100px 100px',
            }}
          />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-green-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-30 blur-lg animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="text-center">
            {/* Badge - made smaller on mobile */}
            <div className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 bg-blue-50 border border-blue-200 rounded-full mb-4 md:mb-6">
              <Star className="w-3 h-3 md:w-4 md:h-4 text-blue-600 mr-2" />
              <span className="text-blue-800 text-xs md:text-sm font-medium">New: Pingala V1</span>
            </div>

            {/* Title - adjusted font sizes */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-midnight mb-4 md:mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Pingala V1 Pricing
              </span>
            </h1>

            {/* Subtitles - adjusted font sizes and spacing */}
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-4 md:mb-6 max-w-4xl mx-auto leading-relaxed px-2">
              The World's Most Efficient Speech AI — Built on CPUs. Engineered for India & Beyond.
            </p>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-5xl mx-auto leading-relaxed px-2">
              Pingala V1 by Shunya Labs delivers multilingual, real-time, and semantically enhanced
              speech recognition across 216 languages — optimized to run on CPUs, not GPUs.
            </p>

            {/* Feature badges - stack on mobile */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center items-center mb-6 md:mb-8">
              <div className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-green-50 border border-green-200 rounded-full w-full md:w-auto">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600 mr-2 md:mr-3 flex-shrink-0" />
                <span className="text-green-800 text-sm md:text-base font-medium">
                  Try it Free: First 10,000 hours
                </span>
              </div>
              <div className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-blue-50 border border-blue-200 rounded-full w-full md:w-auto">
                <Zap className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mr-2 md:mr-3 flex-shrink-0" />
                <span className="text-blue-800 text-sm md:text-base font-medium">
                  CPU-Optimized • 216 Languages
                </span>
              </div>
            </div>

            {/* CTA buttons - stack on mobile */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center px-4 md:px-0">
              <Button
                size="lg"
                className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                onClick={scrollToPricingTable}
              >
                View Pricing Plans
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="w-full md:w-auto" asChild>
                <Link to="/early-access">Start Free Trial</Link>
              </Button>
            </div>

            {/* Key Benefits - adjust grid for mobile */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-12 md:mt-16 max-w-4xl mx-auto px-4 md:px-0">
              <div className="text-center p-4">
                <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Check className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">WER as low as 2.94%</h3>
                <p className="text-sm text-gray-600">Industry best in Indian languages</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">CPU-Optimized</h3>
                <p className="text-sm text-gray-600">No expensive GPU infrastructure needed</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">216 Languages</h3>
                <p className="text-sm text-gray-600">Global and Indic language support</p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingHero;
