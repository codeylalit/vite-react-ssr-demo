import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Cpu, Shield, Calculator, Code } from 'lucide-react';
import { getLanguageStatistics } from '../utils/languageStats';

const features = [
  {
    icon: Cpu,
    title: 'CPU-first Architecture',
    description:
      'Engineered from the ground up for commodity processors. No GPU dependency, no vendor lock-in.',
    benefit: 'Deploy anywhere, anytime',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
  },
  {
    icon: Shield,
    title: 'Privacy by Design',
    description:
      'Zero bytes leave your premises. Air-gap friendly with HIPAA, and SOC 2 compliance.',
    benefit: 'Your data stays yours',
    gradient: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-50',
  },
  {
    icon: Calculator,
    title: 'Built for Real-World Accuracy',
    description: 'High accuracy: <3% WER, noise-resilient. (e.g. call center, street audio)',
    benefit: 'Under‑3% WER',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50',
  },
  {
    icon: Code,
    title: 'Open & Portable',
    description:
      'Standard APIs, multiple SDKs, container-ready. Integrate with your existing stack in minutes.',
    benefit: 'No platform prison',
    gradient: 'from-orange-500 to-yellow-500',
    bgGradient: 'from-orange-50 to-yellow-50',
  },
];

const WhyShunyaLabs = () => {
  const languageStats = getLanguageStatistics();

  return (
    <section className="py-24 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-midnight mb-4">Why Shunya Labs?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We solve the fundamental problems that make voice AI expensive, slow, and insecure.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map(feature => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br ${feature.bgGradient} hover:scale-105`}
              >
                <CardHeader className="space-y-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 text-electric-blue text-sm font-medium border border-blue-200">
                      {feature.benefit}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Colorful Stats Section */}
        {/* <div className="mt-20 bg-gradient-to-r from-electric-blue via-purple-500 to-pink-500 rounded-2xl p-12 text-white shadow-2xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
                              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-200 to-white bg-clip-text text-transparent">{languageStats.totalLanguages}+ languages</div>
              <div className="text-blue-100">Your&apos;s included</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">20×</div>
              <div className="text-blue-100">Lower TCO vs GPU clouds</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-200 to-white bg-clip-text text-transparent">0 bytes</div>
              <div className="text-blue-100">Data leaving your premises</div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default WhyShunyaLabs;
