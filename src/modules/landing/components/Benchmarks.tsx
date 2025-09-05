import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { TrendingUp, Zap, Target, Globe, Award, Trophy, Medal, Crown } from 'lucide-react';

const benchmarkData = [
  {
    dataset: 'SPGISpeech',
    pingala: 1.13,
    previousBest: 1.81,
    improvement: 38,
    description: 'Spoken Wikipedia transcription benchmark',
    rank: 1,
    icon: Crown,
    verified: true,
    best_name: 'assemblyai/assembly_best',
  },
  {
    dataset: 'VoxPopuli',
    pingala: 3.47,
    previousBest: 5.44,
    improvement: 35,
    description: 'European Parliament speeches',
    rank: 1,
    icon: Crown,
    best_name: 'nvidia/parakeet-rnnt-1.1b',
  },
  {
    dataset: 'AMI',
    pingala: 3.52,
    previousBest: 8.71,
    improvement: 45,
    description: 'Meeting transcriptions',
    rank: 1,
    icon: Crown,
    best_name: 'nyrahealth/CrisperWhisper',
  },
  {
    dataset: 'Gigaspeech',
    pingala: 4.26,
    previousBest: 9.41,
    improvement: 54,
    description: 'Diverse audio content',
    rank: 1,
    icon: Crown,
    best_name: 'revai/fusion',
  },
  {
    dataset: 'Earnings22',
    pingala: 4.36,
    previousBest: 9.53,
    improvement: 33,
    description: 'Corporate earnings calls',
    rank: 1,
    icon: Crown,
    best_name: 'ibm-granite/granite-speech-3.3-8b',
  },
  {
    dataset: 'TEDLIUM',
    pingala: 2.14,
    previousBest: 2.54,
    improvement: 18,
    description: 'TED talk presentations',
    rank: 1,
    icon: Crown,
    best_name: 'speechmatics/enhanced',
  },
  {
    dataset: 'LibriSpeech Clean',
    pingala: 1.87,
    previousBest: 1.4,
    improvement: -26,
    description: 'Clean audiobook readings',
    rank: 2,
    icon: Medal,
    verified: true,
    best_name: 'nvidia/parakeet-tdt-1.1b',
  },
  {
    dataset: 'LibriSpeech Other',
    pingala: 2.81,
    previousBest: 2.5,
    improvement: -14,
    description: 'Noisy audiobook readings',
    rank: 2,
    icon: Medal,
    verified: true,
    best_name: 'nvidia/parakeet-rnnt-1.1b',
  },
];

const achievementStats = [
  {
    label: 'Championships',
    value: '6/8',
    icon: Trophy,
    color: 'from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0]',
    description: 'Datasets dominated',
  },
  {
    label: 'Average WER',
    value: '2.94%',
    icon: Target,
    color: 'from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0]',
    description: 'Industry leading accuracy',
  },
  {
    label: 'CPU RTFx',
    value: '157.93x',
    icon: Zap,
    color: 'from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0]',
    description: 'Real-time performance',
  },
  {
    label: 'Global Rank',
    value: '#1',
    icon: Crown,
    color: 'from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0]',
    description: 'HuggingFace Leaderboard',
  },
];

const Benchmarks = () => {
  const [visibleRows, setVisibleRows] = useState<boolean[]>(
    new Array(benchmarkData.length).fill(false)
  );
  const [animatedStats, setAnimatedStats] = useState<boolean[]>(
    new Array(achievementStats.length).fill(false)
  );
  const [storyPhase, setStoryPhase] = useState(0); // 0: void, 1: emergence, 2: dominance
  const tableRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (entry.target === tableRef.current) {
              // Start story progression immediately
              setStoryPhase(1);
              setTimeout(() => setStoryPhase(2), 300);

              benchmarkData.forEach((_, index) => {
                setTimeout(() => {
                  setVisibleRows(prev => {
                    const newVisible = [...prev];
                    newVisible[index] = true;
                    return newVisible;
                  });
                }, index * 30);
              });
            }

            if (entry.target === statsRef.current) {
              achievementStats.forEach((_, index) => {
                setTimeout(() => {
                  setAnimatedStats(prev => {
                    const newAnimated = [...prev];
                    newAnimated[index] = true;
                    return newAnimated;
                  });
                }, index * 100);
              });
            }
          }
        });
      },
      { threshold: 0.05, rootMargin: '100px' }
    );

    if (tableRef.current) observer.observe(tableRef.current);
    if (statsRef.current) observer.observe(statsRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="benchmarks"
      className="py-8 md:py-12 lg:py-16 relative bg-gradient-to-b from-orange-50 via-yellow-50 to-pink-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Arc: From Zero to #1 */}
        <div className="text-center mb-4">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-gray-900">Zero</span> <span className="text-gray-700">to</span>{' '}
              <span
                className={`bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent transition-all duration-1000 ${
                  storyPhase >= 1 ? 'opacity-100 scale-100' : 'opacity-70 scale-95'
                }`}
              >
                #1
              </span>
            </h2>

            {/* Subheader */}
            <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-8 text-gray-700">
              Introducing Pingala V1
            </h3>

            {/* Story phases */}
            <div className="space-y-4 max-w-3xl mx-auto">
              <p
                className={`text-xl text-gray-700 transition-all duration-1000 ${
                  storyPhase >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                In the beginning, there was only the void of imperfect speech recognition...
              </p>

              <p
                className={`text-xl text-gray-800 transition-all duration-1000 ${
                  storyPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Then Pingala V1 emerged, carrying the wisdom of ancient mathematics...
              </p>
            </div>
          </div>

          {/* Achievement Statistics */}
          <div ref={statsRef} className="mb-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievementStats.map((stat, index) => (
                <Card
                  key={stat.label}
                  className={`group border border-gray-200 bg-white/80 backdrop-blur-xl overflow-hidden transform transition-all duration-700 hover:scale-105 hover:bg-white/90 shadow-lg ${
                    animatedStats[index] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 300}ms` }}
                >
                  <CardContent className="p-6 text-center relative">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />
                    <stat.icon
                      className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-br ${stat.color} text-transparent bg-clip-text group-hover:scale-110 transition-transform duration-300`}
                    />
                    <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">
                      {stat.value}
                    </div>
                    <div className="text-gray-700 font-medium text-sm mb-1">{stat.label}</div>
                    <div className="text-xs text-gray-600 italic">{stat.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Leaderboard */}
        <div ref={tableRef}>
          <Card className="border border-gray-300 bg-white/90 backdrop-blur-xl overflow-hidden shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] text-white p-6">
              <div className="text-center">
                <CardTitle className="text-3xl font-bold mb-2">The Leaderboard Dominance</CardTitle>
                <p className="text-blue-100 text-lg">
                  HuggingFace Open ASR Leaderboard • Real-world Performance
                </p>
                <div className="mt-4 flex justify-center space-x-8 text-sm">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span>6 Championships</span>
                  </div>
                  {/* <div className="flex items-center space-x-2">
                    <Medal className="w-4 h-4 text-gray-300" />
                    <span>2 Runner-ups</span>
                  </div> */}
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-green-400" />
                    <span>2.94% Average WER</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Desktop Table View - Hidden on Mobile */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0]">
                    <tr>
                      <th className="px-6 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                        Dataset & Context
                      </th>
                      <th className="px-6 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                        Pingala V1
                      </th>
                      <th className="px-6 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                        Comparison
                      </th>
                      <th className="px-6 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                        Performance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {benchmarkData.map((row, index) => (
                      <tr
                        key={row.dataset}
                        className={`group transform transition-all duration-500 hover:bg-gray-50 ${
                          visibleRows[index]
                            ? 'translate-x-0 opacity-100'
                            : 'translate-x-8 opacity-0'
                        }`}
                        style={{ transitionDelay: `${index * 200}ms` }}
                      >
                        <td className="px-6 py-8">
                          <div className="flex items-center space-x-3">
                            <row.icon
                              className={`w-7 h-7 ${
                                row.rank === 1 ? 'text-yellow-400' : 'text-gray-400'
                              }`}
                            />
                            <div>
                              <div className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                {row.dataset}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">{row.description}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-8">
                          <div className="text-xl font-bold text-green-600">
                            {row.pingala.toFixed(2)}% WER
                          </div>
                          <div className="text-sm text-green-700 font-medium mt-1">
                            {row.rank === 1 ? '🏆 Champion' : '🥈 Runner-up'}
                          </div>
                        </td>

                        <td className="px-6 py-8">
                          <div className="text-base font-medium text-gray-700">
                            {row.previousBest.toFixed(2)}% WER
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {row.improvement > 0 ? 'Previous best' : 'Current leader'}
                            <p className="text-xs text-gray-600 mt-1">- {row.best_name || ''}</p>
                          </div>
                        </td>

                        <td className="px-6 py-8">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                  className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                                    row.improvement > 0
                                      ? 'bg-gradient-to-r from-green-500 to-blue-500'
                                      : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                  }`}
                                  style={{
                                    width: visibleRows[index]
                                      ? `${Math.min(Math.abs(row.improvement), 100)}%`
                                      : '0%',
                                    transitionDelay: `${index * 200 + 500}ms`,
                                  }}
                                />
                              </div>
                              <span
                                className={`text-sm font-bold min-w-max ${
                                  row.improvement > 0 ? 'text-green-600' : 'text-orange-600'
                                }`}
                              >
                                {row.improvement > 0
                                  ? `${row.improvement}% better`
                                  : `${Math.abs(row.improvement)}% gap`}
                              </span>
                            </div>

                            {row.improvement > 0 && (
                              <div className="text-xs text-green-600 italic">
                                Breakthrough achieved
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View - Visible only on Mobile */}
              <div className="md:hidden bg-white">
                <div className="space-y-4 p-4">
                  {benchmarkData.map((row, index) => (
                    <Card
                      key={row.dataset}
                      className={`border border-gray-200 bg-white shadow-md transform transition-all duration-500 ${
                        visibleRows[index] ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                      }`}
                      style={{ transitionDelay: `${index * 150}ms` }}
                    >
                      <CardContent className="p-4">
                        {/* Header with Icon and Rank */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <row.icon
                              className={`w-6 h-6 ${
                                row.rank === 1 ? 'text-yellow-400' : 'text-gray-400'
                              }`}
                            />
                            <div className="text-sm font-medium">
                              {row.rank === 1 ? '🏆 Champion' : '🥈 Runner-up'}
                            </div>
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-bold ${
                              row.improvement > 0
                                ? 'bg-green-100 text-green-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}
                          >
                            {row.improvement > 0
                              ? `${row.improvement}% better`
                              : `${Math.abs(row.improvement)}% gap`}
                          </div>
                        </div>

                        {/* Dataset Name and Description */}
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{row.dataset}</h3>
                          <p className="text-sm text-gray-600">{row.description}</p>
                        </div>

                        {/* Performance Metrics */}
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="text-center">
                            <div className="text-xl font-bold text-green-600">
                              {row.pingala.toFixed(2)}%
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">
                              Pingala V1 WER
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-medium text-gray-700">
                              {row.previousBest.toFixed(2)}%
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">
                              {row.improvement > 0 ? 'Previous Best' : 'Current Leader'}
                            </div>
                          </div>
                        </div>

                        {/* Performance Bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>Performance Improvement</span>
                            <span className="font-medium">
                              {row.improvement > 0 ? 'Better' : 'Competitive'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                                row.improvement > 0
                                  ? 'bg-gradient-to-r from-green-500 to-blue-500'
                                  : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                              }`}
                              style={{
                                width: visibleRows[index]
                                  ? `${Math.min(Math.abs(row.improvement), 100)}%`
                                  : '0%',
                                transitionDelay: `${index * 150 + 300}ms`,
                              }}
                            />
                          </div>
                          {row.improvement > 0 && (
                            <div className="text-xs text-green-600 italic font-medium">
                              ✨ Breakthrough achieved
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CPU Liberation Message */}
          {/* <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-purple-950/95 to-blue-950/95 border-purple-500/30 backdrop-blur-xl shadow-2xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">
                  Freedom from GPU Dependency
                </h3>

                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center bg-black/20 p-4 rounded-lg">
                    <Globe className="w-10 h-10 mx-auto mb-3 text-blue-300" />
                    <div className="text-base font-semibold text-blue-100">Edge Devices</div>
                    <div className="text-sm text-blue-200 mt-1">Rural areas, IoT</div>
                  </div>
                  <div className="text-center bg-black/20 p-4 rounded-lg">
                    <Target className="w-10 h-10 mx-auto mb-3 text-green-300" />
                    <div className="text-base font-semibold text-green-100">Air-gapped Systems</div>
                    <div className="text-sm text-green-200 mt-1">Government, security</div>
                  </div>
                  <div className="text-center bg-black/20 p-4 rounded-lg">
                    <Zap className="w-10 h-10 mx-auto mb-3 text-yellow-300" />
                    <div className="text-base font-semibold text-yellow-100">Startup Friendly</div>
                    <div className="text-sm text-yellow-200 mt-1">No GPU costs</div>
                  </div>
                </div>

                <p className="text-xl text-blue-100 font-semibold drop-shadow-md">
                  "Deploy anywhere, own forever"
                </p>
                <p className="text-base text-blue-200 mt-3 font-medium">
                  1.56x real-time factor on commodity CPUs
                </p>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Benchmarks;
