import React from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import type { PingalaBenchmark } from '../types';

const LeaderboardResults: React.FC = () => {
  const benchmarks: PingalaBenchmark[] = [
    {
      dataset: 'SPGISpeech (Spontaneous)',
      pingalaWER: 1.13,
      competitorWER: 1.81,
      improvement: 38,
      description: 'Spoken Wikipedia transcription benchmark',
    },
    {
      dataset: 'VoxPopuli (Multilingual)',
      pingalaWER: 3.55,
      competitorWER: 5.44,
      improvement: 35,
      description: 'European Parliament speeches',
    },
    {
      dataset: 'AMI (Meetings)',
      pingalaWER: 4.8,
      competitorWER: 8.71,
      improvement: 45,
      description: 'Meeting transcriptions',
    },
    {
      dataset: 'Gigaspeech (Multi-domain)',
      pingalaWER: 4.36,
      competitorWER: 9.41,
      improvement: 54,
      description: 'Diverse audio content',
    },
    {
      dataset: 'Earnings22 (Finance)',
      pingalaWER: 6.43,
      competitorWER: 9.53,
      improvement: 33,
      description: 'Corporate earnings calls',
    },
    {
      dataset: 'TEDLIUM',
      pingalaWER: 2.08,
      competitorWER: 2.54,
      improvement: 18,
      description: 'TED talk presentations',
    },
  ];

  const competitors = [
    { name: 'IBM Granite 3.3 8B', improvement: '31.0%' },
    { name: 'NVIDIA Parakeet TDT', improvement: '33.2%' },
    { name: 'Microsoft Phi 4', improvement: '34.2%' },
    { name: 'NVIDIA Canary 1B', improvement: '36.4%' },
  ];

  return (
    <section className=" bg-gradient-to-b from-purple-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <header className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              The Moment Everything Changed
            </span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-slate-600 mb-8">
              When the Open ASR Leaderboard updated with Pingala V1's results, the research
              community took notice. Out of 47 competing models from tech giants like IBM, NVIDIA,
              and Microsoft, Pingala V1 had not just won—it had dominated.
            </p>

            {/* Mathematical Context */}
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 rounded-xl p-6 border border-amber-200/50 mb-8">
              <p className="text-lg text-slate-700 leading-relaxed">
                This achievement represents more than competitive success—it validates the
                fundamental principle that mathematical elegance can drive practical breakthroughs.
                Just as Pingala's ancient work revealed the power of binary foundations, Pingala
                V1's dominance demonstrates that when you start from mathematical first principles,
                extraordinary results follow.
              </p>
            </div>
          </div>
        </header>

        {/* Championship Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-3xl p-12 mb-16 text-center shadow-2xl border border-blue-500/30 relative overflow-hidden">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20 blur-3xl"></div>
          <div className="relative z-10">
            <div className="text-8xl font-bold mb-6 animate-bounce">🏆</div>
            <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
              #1 on Open ASR Leaderboard
            </h3>
            <div className="grid md:grid-cols-4 gap-8 mt-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-yellow-200">47</div>
                <div className="text-base opacity-90">Competing Models</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-green-200">6/8</div>
                <div className="text-base opacity-90">Dataset Championships</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-blue-200">1.56x</div>
                <div className="text-base opacity-90">RTFx Speed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-purple-200">≈ 50%</div>
                <div className="text-base opacity-90">Performance Lead</div>
              </div>
            </div>
          </div>
        </div>

        {/* Breaking Down the Competition */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Breaking Down the Competition
          </h3>
          <p className="text-lg text-slate-600 mb-8 text-center max-w-3xl mx-auto">
            The Open ASR Leaderboard results read like a mathematical symphony of dominance. Here's
            how Pingala V1 performed against the industry's best:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {competitors.map((competitor, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold text-slate-900">{competitor.name}</h4>
                  <p className="text-sm text-slate-600">Industry Leading Model</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">+{competitor.improvement}</div>
                  <div className="text-xs text-slate-500">Pingala V1 Advantage</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Benchmark Results */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Dataset-Specific Performance
          </h3>
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="text-left p-4">Benchmark Dataset</th>
                    <th className="text-center p-4">Pingala V1 WER (%)</th>
                    <th className="text-center p-4">Comparison (%)</th>
                    <th className="text-center p-4">Performance Gap</th>
                    <th className="text-left p-4">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {benchmarks.map((benchmark, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4 font-semibold text-slate-900">{benchmark.dataset}</td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full font-semibold ${
                            benchmark.improvement > 0
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {benchmark.pingalaWER}%
                        </span>
                      </td>
                      <td className="p-4 text-center text-slate-600">{benchmark.competitorWER}%</td>
                      <td className="p-4 text-center">
                        <span
                          className={`font-bold ${
                            benchmark.improvement > 0 ? 'text-green-600' : 'text-orange-600'
                          }`}
                        >
                          {benchmark.improvement > 0 ? '+' : ''}
                          {benchmark.improvement}%
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-600">{benchmark.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-600 mb-4">
              Even in the two datasets where Pingala V1 placed second, the margins were
              competitive—demonstrating consistent excellence across all domains. With 6
              championships out of 8 datasets, Pingala V1 achieves a 75% championship rate.
            </p>
          </div>
        </div>

        {/* Statistical Significance */}
        <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Statistical Significance
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h4 className="font-semibold text-slate-900 mb-2">Computational Efficiency</h4>
              <div className="bg-white rounded-lg p-4">
                <BlockMath math="O(n \\log n)" />
                <p className="text-sm text-slate-600 mt-2">vs competitors&apos; O(n²)</p>
                <p className="text-blue-600 font-semibold">2.3x latency advantage</p>
              </div>
            </div>

            <div className="text-center">
              <h4 className="font-semibold text-slate-900 mb-2">Effect Size</h4>
              <div className="bg-white rounded-lg p-4">
                <BlockMath math="d = 1.92" />
                <p className="text-sm text-slate-600 mt-2">Cohen's d (large effect)</p>
                <p className="text-blue-600 font-semibold">p &lt; 0.001</p>
              </div>
            </div>

            <div className="text-center">
              <h4 className="font-semibold text-slate-900 mb-2">Real-Time Processing</h4>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">1.56x</div>
                <p className="text-sm text-slate-600 mt-2">RTFx speed</p>
                <p className="text-blue-600 font-semibold">Real-time transcription</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardResults;
