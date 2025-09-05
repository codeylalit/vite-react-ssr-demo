import { Button } from '@/shared/components/ui/button';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const PingalaVerbatimHero = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 md:h-screen">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, #3B82F6 2px, transparent 0), radial-gradient(circle at 75px 75px, #06B6D4 2px, transparent 0) `,
              backgroundSize: '100px 100px',
            }}
          />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-30 blur-lg animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 h-full flex flex-col">
          <div className="text-center my-auto">
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Pingala V1
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              Our local, offline speech‑to‑text (Automatic Speech Recognition) engine. <br />
              No cloud needed—everything runs on your device.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="p-0 text-lg bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] hover:from-[#1a1947]/90 hover:to-[#2d4cc8]/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl "
              >
                <Link to="/#hero-audio-sample" className="flex items-center px-8 py-4 ">
                  <Play className="w-5 h-5 mr-2" />
                  Live Demo
                </Link>
              </Button>
              {/* <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-blue-300 text-blue-600 hover:bg-blue-50">
                <Download className="w-5 h-5 mr-2" />
                Free Trial
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PingalaVerbatimHero;
