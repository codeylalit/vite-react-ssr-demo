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
import { Mic, Volume2, Brain, Infinity, ArrowRight } from 'lucide-react';

const products = [
  {
    name: 'Pingala V1',
    pronunciation: '',
    tagline: 'Pingala V1 — English precision or Multilingual mastery (216 languages)',
    description:
      'Pingala V1 English comes in two modes — Verbatim for word-perfect transcripts, Enhanced for context-rich clarity.',
    icon: Mic,
    href: '/product/verbatim',
    badge: 'Automatic Speech Recognition',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  {
    name: 'B1',
    pronunciation: '',
    tagline: 'Text-to-Speech Engine (Named after Bharata)',
    description:
      'Ultra-naturalistic speech synthesis engine that converts text into expressive, emotionally rich speech.',
    icon: Brain,
    href: '/product/reason',
    badge: 'Text to Speech',
    gradient: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-50',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  {
    name: 'A1',
    pronunciation: '',
    tagline: 'Voice-to-Voice Conversational AI (Named after Aryabhatta)',
    description:
      'Full-duplex voice interface powered by AI — enables spoken input, AI understanding, and spoken output.',
    icon: Volume2,
    href: '/product/echo',
    badge: 'Voice to Voice',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  {
    name: 'M1',
    pronunciation: '',
    tagline: 'Native Graph Reasoning Engine (Named after Madhava)',
    description:
      'Native reasoning engine built on knowledge graphs for interpretable, symbolic + neural decision-making.',
    icon: Infinity,
    href: '/product/stream',
    badge: 'Native Reasoning Engine',
    gradient: 'from-orange-500 to-yellow-500',
    bgGradient: 'from-orange-50 to-yellow-50',
    badgeColor: 'bg-orange-100 text-orange-700 border-orange-200',
  },
];

const ProductShowcase = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-midnight mb-4">Four Models. One Mission.</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Each model draws from ancient mathematical wisdom, engineered for modern CPU-first
            performance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => {
            const Icon = product.icon;
            const isAvailable = index === 0;
            return (
              <div
                key={product.name}
                data-featured={isAvailable ? 'true' : undefined}
                className="group/product rounded-3xl p-8 ring-1 ring-gray-200 data-featured:ring-2 data-featured:ring-indigo-600 hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white"
              >
                <div
                  className={`rounded-full px-3 py-1.5 mb-4 w-max text-sm font-semibold ${
                    isAvailable
                      ? 'bg-green-600/10 text-green-600'
                      : 'bg-orange-600/10 text-orange-600'
                  }`}
                >
                  {isAvailable ? 'Available now' : 'Coming soon'}
                </div>
                <div className="flex items-center justify-between gap-x-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${product.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex flex-col gap-x-4 mb-3">
                    <span className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-gray-200 ring-inset w-max">
                      {product.badge}
                    </span>
                    <h3
                      className={`text-lg font-semibold ${isAvailable ? 'text-indigo-600' : 'text-gray-900'}`}
                    >
                      {product.name}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-500 mb-3">{product.pronunciation}</p>

                  <p className="text-sm font-medium text-gray-900 mb-4">{product.tagline}</p>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {product.description}
                  </p>

                  <Link
                    to={product.href}
                    className={`flex items-center justify-center w-full rounded-md px-3 py-2 text-center text-sm font-semibold ring-1 ring-inset transition-all duration-200 ${
                      isAvailable
                        ? 'bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] hover:from-[#1a1947]/90 hover:to-[#2d4cc8]/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl '
                        : 'text-indigo-600 ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
