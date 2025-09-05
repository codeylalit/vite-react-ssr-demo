import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import {
  Mic,
  Volume2,
  FileText,
  CheckCircle,
  Clock,
  Star,
  Scroll,
  Brain,
  Infinity,
  Sparkles,
  Network,
} from 'lucide-react';

// Mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

const ModelLineup = () => {
  const [visibleModels, setVisibleModels] = useState<boolean[]>([false, false, false, false]);
  const [visibleTimeline, setVisibleTimeline] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const models = [
    {
      name: 'Pingala V1',
      heritage: 'Named after Pingala (c. 3rd–2nd century BCE)',
      sanskritName: 'पिङ्गल',
      historicalContribution:
        'Invented the binary number system (mātrāmeru), discovered the Fibonacci sequence 1500 years before Fibonacci, developed combinatorial mathematics, and created algorithmic approaches to prosody and poetry meter analysis',
      modernConnection:
        'Every 0 and 1 in digital computation, sequence analysis in ML algorithms, combinatorial optimization, and pattern recognition in speech processing',
      type: 'Speech Recognition',
      status: 'available',
      statusLabel: 'Available Now',
      description: 'CPU-native ASR with industry-leading 3.37% WER across 216 languages',
      capabilities: [
        '3.37% average WER',
        'CPU-only processing',
        '216 languages supported',
        'Real-time transcription',
        'Self-hosted deployment',
        '161x real-time factor',
      ],
      icon: Mic,
      gradient: 'from-blue-400 to-indigo-500',
      bgGradient: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      philosophical:
        '"From binary mathematics to sequential patterns—the same elegance that governs computation, natural sequences, and human speech"',
      timelinePeriod: '3rd–2nd century BCE',
      constellation: '🔵🔵🔵🔵🔵', // Binary pattern
    },
    {
      name: 'Aryabhata V1 2B',
      heritage: 'Named after Aryabhata (476–550 CE)',
      sanskritName: 'आर्यभट',
      historicalContribution:
        "Gave zero its place-value meaning, calculated π to 4 decimal places, explained lunar eclipses and Earth's rotation, developed trigonometric tables, created astronomical algorithms, and established mathematical methods for planetary motion calculations",
      modernConnection:
        'Zero-value concepts in neural networks, trigonometric functions in signal processing, astronomical precision in GPS systems, and algorithmic thinking in AI model architectures',
      type: 'Multimodal Speech-Language',
      status: 'development',
      statusLabel: 'In Development',
      description:
        'Advanced multimodal model combining speech recognition with language understanding',
      capabilities: [
        'Speech + text integration',
        'Contextual understanding',
        'Multi-turn conversations',
        'Semantic reasoning',
        'Cross-modal attention',
        'Cultural context awareness',
      ],
      icon: Brain,
      gradient: 'from-green-400 to-blue-500',
      bgGradient: 'from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      philosophical:
        '"As Aryabhata revolutionized mathematics with zero and systematic astronomy, this model revolutionizes communication with contextual understanding"',
      timelinePeriod: '476–550 CE',
      constellation: '⭐🌟⭐🌟⭐', // Stars for astronomical work
    },
    {
      name: 'Bharata V1',
      heritage: 'Named after Bharata Muni (c. 200 BCE–200 CE)',
      sanskritName: 'भरत मुनि',
      historicalContribution:
        'Authored Nātya Shastra (the science of dramaturgy), systematized 9 emotional expressions (navarasas), developed musical scales and rhythm patterns, created gestural language systems, and established the theoretical foundation for Indian classical arts',
      modernConnection:
        'Emotional AI systems, prosodic patterns in speech synthesis, gestural recognition technologies, rhythm analysis in music generation, and multimodal expression understanding',
      type: 'Text-to-Speech',
      status: 'planned',
      statusLabel: 'Coming Soon',
      description: 'Natural voice synthesis with emotional intelligence and cultural authenticity',
      capabilities: [
        'Emotional expression',
        'Cultural authenticity',
        'Real-time generation',
        'Custom voice cloning',
        'Multilingual support',
        'Prosodic control',
      ],
      icon: Volume2,
      gradient: 'from-purple-400 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      philosophical:
        '"As Bharata mapped the grammar of human expression across voice, gesture, and emotion, this model maps the complete spectrum of natural communication"',
      timelinePeriod: '200 BCE–200 CE',
      constellation: '🎭🎪🎨🎵🎬', // Performing arts symbols
    },
    {
      name: 'Madhava V1',
      heritage: 'Named after Madhava (c. 1340–1425 CE)',
      sanskritName: 'माधव',
      historicalContribution:
        'Developed calculus and infinite series 300 years before Newton and Leibniz, created trigonometric series expansions, discovered the concept of mathematical analysis, established convergence criteria for infinite series, and laid the foundation for mathematical analysis',
      modernConnection:
        'Infinite series in neural network training, calculus-based optimization algorithms, convergence analysis in machine learning, and differential reasoning in AI systems',
      type: 'Graph Neural Networks & Reasoning',
      status: 'planned',
      statusLabel: 'Coming Soon',
      description:
        'Advanced reasoning engine combining graph neural networks with sophisticated logical inference for complex mathematical understanding',
      capabilities: [
        'Graph-based reasoning',
        'Logical inference',
        'Complex relationship modeling',
        'Mathematical proof assistance',
        'Scientific discovery support',
        'Multi-hop logical reasoning',
      ],
      icon: Network,
      gradient: 'from-orange-400 to-red-500',
      bgGradient: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      philosophical:
        '"As Madhava pioneered infinite mathematical series, this model explores infinite connections in the web of knowledge and reasoning"',
      timelinePeriod: '1340–1425 CE',
      constellation: '∞📊🔗🧮📈', // Mathematical and network symbols
    },
  ];

  const isMobile = useIsMobile();

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleTimeline(true);
            models.forEach((_, index) => {
              setTimeout(
                () => {
                  setVisibleModels(prev => {
                    const newVisible = [...prev];
                    newVisible[index] = true;
                    return newVisible;
                  });
                },
                isMobile ? index * 200 : 200 + index * 100
              );
            });
          }
        });
      },
      { threshold: 0.05, rootMargin: '100px' }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isMobile]);

  // Helper to determine transform classes based on screen size
  const getCardTransformClass = (isVisible: boolean): string => {
    if (isVisible) return 'translate-y-0 opacity-100';
    return isMobile ? 'translate-y-4 opacity-0' : 'translate-x-12 opacity-0';
  };

  return (
    <section
      ref={sectionRef}
      id="models"
      className="py-8 md:py-12 lg:py-16 relative bg-gradient-to-b from-pink-50 via-slate-50 to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mathematical Heritage Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gray-900">Mathematical </span>
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Legacy
            </span>
          </h2>
        </div>

        {/* Model Cards as Ancient Scrolls */}
        <div className="space-y-8">
          {models.map((model, index) => (
            <Card
              key={model.name}
              className={`group border-0 bg-white/80 backdrop-blur-xl overflow-hidden transform transition-all duration-1000 hover:scale-[1.02] hover:shadow-2xl ${getCardTransformClass(
                visibleModels[index]
              )}`}
              style={{
                transitionDelay: `${isMobile ? index * 200 : 200 + index * 100}ms`,
                border: '1px solid rgba(251, 146, 60, 0.3)',
              }}
            >
              <div className="flex flex-col lg:grid lg:grid-cols-3 gap-0">
                {/* Heritage Story Section */}
                <div className="lg:col-span-1 bg-gradient-to-b from-orange-50 to-pink-50 p-4 sm:p-6 relative">
                  {/* Scroll decorations - adjusted positioning for mobile */}
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                    <Scroll className="w-4 h-4 sm:w-6 sm:h-6 text-orange-500/60" />
                  </div>
                  <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500/40" />
                  </div>

                  <div className="space-y-3 sm:space-y-4 pr-8 sm:pr-6">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-purple-600 mb-2 break-words">
                        {model.heritage.split('(')[0].replace('Named after ', '')}
                      </h3>
                      <p className="text-xs text-orange-600 mb-3">
                        {model.heritage.split('(')[1]?.replace(')', '') || model.timelinePeriod}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Historical Contribution
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {model.historicalContribution}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Modern Connection
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {model.modernConnection}
                      </p>
                    </div>

                    <div className="pt-3 sm:pt-4 border-t border-orange-400/20">
                      <p className="text-xs text-purple-600 italic leading-relaxed">
                        {model.philosophical}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Model Information Section */}
                <div className="lg:col-span-2 p-4 sm:p-6">
                  <div className="mb-4 sm:mb-6">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3 sm:mb-2">
                        <div className="flex items-center space-x-3">
                          <model.icon
                            className={`w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br ${model.gradient} text-transparent bg-clip-text flex-shrink-0`}
                          />
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                            {model.name}
                          </h3>
                        </div>
                        <Badge
                          variant={model.status === 'available' ? 'default' : 'outline'}
                          className={`self-start sm:self-auto ${
                            model.status === 'available'
                              ? 'bg-green-100 text-green-700 border-green-300'
                              : model.status === 'development'
                                ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                : 'bg-purple-100 text-purple-700 border-purple-300'
                          }`}
                        >
                          {model.status === 'available' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {model.status === 'development' && <Clock className="w-3 h-3 mr-1" />}
                          {model.status === 'planned' && <Star className="w-3 h-3 mr-1" />}
                          {model.statusLabel}
                        </Badge>
                      </div>

                      <Badge
                        variant="outline"
                        className="mb-3 sm:mb-4 text-xs bg-blue-50 text-blue-700 border-blue-300"
                      >
                        {model.type}
                      </Badge>

                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 sm:mb-6">
                        {model.description}
                      </p>
                    </div>
                  </div>

                  {/* Capabilities Grid */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                      <Brain className="w-4 h-4 mr-2 text-orange-600" />
                      Core Capabilities
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {model.capabilities.map((capability, capIndex) => (
                        <div
                          key={capIndex}
                          className={`flex items-center space-x-2 p-2 sm:p-3 rounded-lg bg-orange-50/50 border border-orange-200/50 transform transition-all duration-300 hover:bg-orange-100/50 group-hover:scale-105 ${getCardTransformClass(
                            visibleModels[index]
                          )}`}
                          style={{
                            transitionDelay: `${isMobile ? index * 200 + capIndex * 50 : 200 + index * 100 + capIndex * 50}ms`,
                          }}
                        >
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-700">{capability}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Heritage Summary */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 border-purple-500/30 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-6">
                <Infinity className="w-8 h-8 text-amber-400 mr-3" />
                <h3 className="text-3xl font-bold text-white">A Heritage of Innovation</h3>
                <Infinity className="w-8 h-8 text-amber-400 ml-3" />
              </div>

              <p className="text-gray-200 max-w-4xl mx-auto leading-relaxed text-lg mb-6">
                Our models are rooted in civilization's timeless logic — from Pingala's binaries to
                Madhava's infinite series. These thinkers knew: even when infinity is taken from
                infinity, what remains is still infinite. That's not just philosophy — it's our
                architecture.
              </p>

              <div className="text-center">
                <div
                  className="space-y-4 p-6 lg:p-8 bg-gradient-to-r from-white via-amber-50 to-orange-50 rounded-xl border-2 border-amber-300/80 relative z-10 inline-block shadow-xl"
                  style={{
                    fontFamily: '"Noto Serif Devanagari", "Devanagari Sangam MN", "Mangal", serif',
                    position: 'relative',
                    isolation: 'isolate',
                  }}
                >
                  <div className="text-sm sm:text-base lg:text-lg bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 bg-clip-text text-transparent font-bold leading-relaxed">
                    pūrṇamadaḥ pūrṇamidaṁ pūrṇāt pūrṇamudacyate |
                    <br />
                    pūrṇasya pūrṇamādāya pūrṇamevāvaśiṣyate ||
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl text-amber-800 italic font-medium">
                    That is infinity, this is infinity; from infinity comes infinity.
                    <br />
                    Taking infinity from infinity, infinity alone remains.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CSS for animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes float {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            25% {
              transform: translateY(-10px) rotate(90deg);
            }
            50% {
              transform: translateY(-5px) rotate(180deg);
            }
            75% {
              transform: translateY(-8px) rotate(270deg);
            }
          }
          
          @keyframes float-delayed {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            33% {
              transform: translateY(-8px) rotate(120deg);
            }
            66% {
              transform: translateY(-3px) rotate(240deg);
            }
          }
          
          .animate-float {
            animation: float 15s ease-in-out infinite;
          }
          
          .animate-float-delayed {
            animation: float-delayed 18s ease-in-out infinite;
          }
        `,
        }}
      />
    </section>
  );
};

export default ModelLineup;
