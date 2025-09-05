import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface TechFeature {
  title: string;
  description: string;
  specs?: string;
  icon: string;
  gradient: string;
}

const techFeatures: TechFeature[] = [
  {
    title: 'ZeroGravity™ Architecture',
    description:
      'Lattice-free Conformer-Transformer fusion, distilled with self-supervised Z-Phase pre-training',
    icon: '🚀',
    gradient: 'from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0]',
  },
  {
    title: 'CPU-Turbo Vectorization',
    description: 'AVX-512, AMX & Apple M-Series NEON fused-kernel ops, <50ms median latency',
    icon: '⚡',
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    title: 'Freedom from GPU Dependency',
    description: '161x real-time factor on commodity CPUs',
    specs: 'No GPU costs • Deploy anywhere, own forever',
    icon: '🔓',
    gradient: 'from-green-600 to-blue-600',
  },
  {
    title: 'Edge Devices',
    description: 'Rural areas, IoT',
    specs: 'Works on low-power devices • Offline capability',
    icon: '🌐',
    gradient: 'from-blue-600 to-purple-600',
  },
  {
    title: 'Air-gapped Systems',
    description: 'Government, security',
    specs: 'Complete isolation • FIPS-validated cryptography',
    icon: '🔒',
    gradient: 'from-purple-600 to-indigo-600',
  },
  {
    title: 'Startup Friendly',
    description: 'No GPU costs',
    specs: 'Lower infrastructure costs • Faster deployment',
    icon: '🚀',
    gradient: 'from-indigo-600 to-pink-600',
  },
];

const Technology = () => {
  const [visibleCards, setVisibleCards] = useState<boolean[]>(
    new Array(techFeatures.length).fill(false)
  );
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setTimeout(() => {
              setVisibleCards(prev => {
                const newVisible = [...prev];
                newVisible[index] = true;
                return newVisible;
              });
            }, index * 50);
          }
        });
      },
      { threshold: 0.05, rootMargin: '100px' }
    );

    cardRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="technology"
      className="py-8 md:py-12 lg:py-16 bg-gradient-to-b from-gray-50 via-yellow-50 to-orange-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Technology{' '}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Core
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Cutting-edge innovations that power the world's most advanced ASR engine
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
          {techFeatures.map((feature, index) => (
            <div
              key={feature.title}
              ref={el => (cardRefs.current[index] = el)}
              data-index={index}
              className={`transform transition-all duration-700 ${
                visibleCards[index]
                  ? 'translate-y-0 opacity-100 rotate-0'
                  : 'translate-y-12 opacity-0 rotate-3'
              }`}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-300 group cursor-pointer border-2 hover:border-orange-500 hover:scale-105 bg-white/90 backdrop-blur-xl border-gray-200/50">
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-3">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-800 font-semibold leading-relaxed mb-3">
                    {feature.description}
                  </p>
                  {feature.specs && (
                    <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-200 pt-3">
                      {feature.specs}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Research Section */}
        <div className="text-center">
          <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border-gray-200/50">
            <CardHeader className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Research Papers & Patents</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-gray-700 text-lg">
                  Our research is published in top-tier conferences and journals, pushing the
                  boundaries of speech recognition technology.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-8">
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">15+</div>
                    <div className="text-sm text-gray-600">Research Papers</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">8</div>
                    <div className="text-sm text-gray-600">Patents Filed</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">3</div>
                    <div className="text-sm text-gray-600">Awards Won</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Technology;
