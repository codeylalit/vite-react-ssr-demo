import React from 'react';
import { LanguageDataService } from '../services';
import { getLanguageStatistics } from '../../landing/utils/languageStats';

const PingalaHero: React.FC = () => {
  const statistics = LanguageDataService.getLanguageStatistics();
  const languageStats = getLanguageStatistics();

  return (
    <article className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-blue-50 sm:pt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 relative z-10">
        {/* Article Header */}
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-slate-900">Pingala V1 Achieves </span>
            <span className="bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] bg-clip-text text-transparent animate-gradient">
              #1 Ranking:
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
              The Mathematical Revolution
            </span>
            <br />
            <span className="text-slate-900">in Speech Recognition</span>
          </h1>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/50 p-4 sm:p-6 mb-6 sm:mb-8 mx-auto max-w-4xl">
            <p className="mb-3 sm:mb-4 text-base sm:text-lg">
              <strong className="bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
                By Sourav Banerjee, Ayushi Agarwal, Zareen Sultana, Ayush Kumar Bar, and Aditya
                Singh Rathore
              </strong>
            </p>
            <p className="italic text-amber-700">Shunya Labs Research Team</p>
          </div>
        </header>

        {/* Heritage Section */}
        <section className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-4 sm:p-6 border border-amber-200/50 shadow-lg mb-8 sm:mb-12 mx-auto max-w-6xl">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
                Heritage & Inspiration
              </span>
            </h3>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-amber-200/50">
              <p className="text-base sm:text-lg text-slate-700 mb-2 sm:mb-3">
                <strong>Named after Pingala (c. 3rd–2nd century BCE)</strong>, the ancient Indian
                mathematician whose pioneering work on binary number systems (mātrāmeru) and
                combinatorial sequences laid the mathematical foundations for modern computation.
                His work on binary sequences predates and influenced what would later become known
                as the Fibonacci sequence.
              </p>
              <p className="text-base text-slate-600 italic">
                "From ancient binary foundations to modern speech recognition"
              </p>
            </div>
          </div>
        </section>

        {/* Model Modes Section */}
        <section className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl mb-8 sm:mb-12 border border-purple-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Pingala V1: Two Operational Modes
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-200/50 shadow-md">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Enhanced Mode
                  </span>
                </h3>
                <p className="text-slate-700 mb-4">
                  Optimized for call center and business use cases with intelligent processing
                  capabilities.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li>Filler word correction and cleanup</li>
                  <li>Advanced noise reduction</li>
                  <li>Conversation flow optimization</li>
                  <li>Semantic coherence enhancement</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-200/50 shadow-md">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Verbatim Mode
                  </span>
                </h3>
                <p className="text-slate-700 mb-4">
                  Designed for media, entertainment, and legal applications requiring exact
                  transcription.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li>Preserves all speech elements</li>
                  <li>Captures hesitations and pauses</li>
                  <li>Maintains speaker characteristics</li>
                  <li>Exact word-for-word accuracy</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Abstract */}
        <section className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl mb-8 sm:mb-12 border border-purple-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50"></div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Abstract
              </span>
            </h2>
            <div className="text-base sm:text-lg leading-relaxed space-y-3 sm:space-y-4">
              <p className="text-slate-700">
                <strong className="bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] bg-clip-text text-transparent font-bold">
                  Everything Starts From Zero:
                </strong>{' '}
                In the competitive landscape of Automatic Speech Recognition (ASR), a breakthrough
                has emerged that fundamentally challenges existing paradigms. We present Pingala V1,
                an ASR model that has achieved the #1 ranking on the prestigious Open ASR
                Leaderboard with an unprecedented average Word Error Rate (WER) of 2.94% across
                eight comprehensive benchmarks, representing about 50% improvement over the closest
                competitor. Following the mathematical legacy of its namesake, Pingala V1
                demonstrates that ancient principles of binary computation and sequential analysis
                remain profoundly relevant in modern AI.
              </p>
              <p className="text-slate-700">
                This research details the mathematical foundations underlying Pingala V1's superior
                performance, including our novel high-entropy architecture, Mixture of Experts (MoE)
                specialization, and advanced speaker diarization capabilities across 216 languages.
                Our dual-mode approach—Enhanced mode for call center optimization and Verbatim mode
                for media applications—demonstrates that mathematical elegance and practical
                performance can converge to create transformative breakthroughs in speech
                recognition technology.
              </p>
            </div>
          </div>
        </section>

        {/* Key Findings Highlight */}
        <section className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white p-6 sm:p-8 rounded-2xl text-center shadow-xl border border-blue-500/30 transform hover:scale-105 transition-transform duration-300">
            <div className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3">#1</div>
            <div className="text-sm sm:text-base font-semibold">
              Ranking on Open ASR Leaderboard
            </div>
            <div className="text-xs sm:text-sm mt-1 sm:mt-2 opacity-90">
              Out of 47 competing models
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 text-white p-6 sm:p-8 rounded-2xl text-center shadow-xl border border-green-500/30 transform hover:scale-105 transition-transform duration-300">
            <div className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3">2.94%</div>
            <div className="text-sm sm:text-base font-semibold">Average Word Error Rate</div>
            <div className="text-xs sm:text-sm mt-1 sm:mt-2 opacity-90">
              about 50% better than closest competitor
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600 text-white p-6 sm:p-8 rounded-2xl text-center shadow-xl border border-purple-500/30 transform hover:scale-105 transition-transform duration-300">
            <div className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3">216</div>
            <div className="text-sm sm:text-base font-semibold">Available Languages</div>
            <div className="text-xs sm:text-sm mt-1 sm:mt-2 opacity-90">
              Covering {languageStats.formattedCoverage} of global population
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 sm:p-8 border border-indigo-200/50 shadow-lg max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Everything Starts From Zero:
            </span>
            <br />
            <span className="text-slate-900">
              How Mathematical Precision Transformed ASR Forever
            </span>
          </h2>
          <div className="text-base sm:text-lg leading-relaxed space-y-4 sm:space-y-6 max-w-none">
            <p className="text-slate-700">
              In the competitive world of Automatic Speech Recognition (ASR), where tech giants
              battle for supremacy, a breakthrough has emerged that's reshaping everything we
              thought we knew about speech technology. Meet
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold mx-1">
                Pingala V1
              </span>
              , the ASR model that has not only claimed the #1 spot on the prestigious Open ASR
              Leaderboard but has done so with such mathematical elegance that it's forcing the
              entire industry to rethink their approach.
            </p>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-purple-200/50">
              <p className="text-slate-700">
                The numbers tell a remarkable story: an average Word Error Rate (WER) of just
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold mx-1">
                  2.94%
                </span>
                across eight comprehensive benchmarks, crushing the competition by an impressive
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-bold mx-1">
                  about 50% margin
                </span>
                . But behind these statistics lies something far more profound—a philosophical and
                mathematical revolution guided by the principle that
                <em className="bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] bg-clip-text text-transparent font-bold text-xl">
                  "Everything starts from Zero."
                </em>
              </p>
            </div>
          </div>
        </section>

        {/* CSS Animations */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes gradient {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
              }
              .animate-gradient {
                animation: gradient 3s ease-in-out infinite;
                background-size: 200% 200%;
              }
            `,
          }}
        />
      </div>
    </article>
  );
};

export default PingalaHero;
