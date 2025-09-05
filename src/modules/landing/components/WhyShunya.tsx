import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';

const features = [
  {
    title: 'Zero Noise',
    description: 'Acoustic modeling that strips away background chaos',
    icon: '🔇',
    gradient: 'from-blue-500 to-purple-600',
  },
  {
    title: 'Zero Latency',
    description: 'Real-time inference on commodity CPUs',
    icon: '⚡',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    title: 'Zero Barriers',
    description: 'Deploy behind your own firewall, no cloud lock-in',
    icon: '🚀',
    gradient: 'from-pink-500 to-red-600',
  },
  {
    title: 'Near-Zero Error',
    description: 'Consistently < 1% WER on noisy, multi-accent corpora',
    icon: '🎯',
    gradient: 'from-red-500 to-orange-600',
  },
];

const WhyShunya = () => {
  const [visibleCards, setVisibleCards] = useState<boolean[]>(
    new Array(features.length).fill(false)
  );
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleCards(prev => {
              const newVisible = [...prev];
              newVisible[index] = true;
              return newVisible;
            });
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
      id="why-shunya"
      className="py-8 md:py-12 lg:py-16 bg-gradient-to-b from-purple-50 to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why{' '}
            <span className="bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] bg-clip-text text-transparent">
              Shunya
            </span>
          </h2>
          <div className="max-w-4xl mx-auto space-y-4 text-lg text-gray-700">
            <p>
              Shunya (शून्य) means "zero"—the birthplace of all numbers, ideas, and possibilities.
            </p>
            <p>At Shunya Labs, zero isn't nothing; it's everything:</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              ref={el => (cardRefs.current[index] = el)}
              data-index={index}
              className={`transform transition-all duration-700 delay-${index * 200} ${
                visibleCards[index]
                  ? 'translate-y-0 opacity-100 scale-100'
                  : 'translate-y-12 opacity-0 scale-95'
              }`}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer border-2 hover:border-[#2d4cc8]">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}
                      >
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#2d4cc8] transition-colors">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center space-x-4 p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] flex items-center justify-center">
              <span className="text-white font-bold text-2xl">∞</span>
            </div>
            <p className="text-xl font-medium text-gray-900">
              "From zero we build infinity—voice interfaces that simply work, anywhere."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyShunya;
