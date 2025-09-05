import React from 'react';
import Header from '@/shared/components/layout/Header';
import Footer from '@/shared/components/layout/Footer';
import { useSEO } from '@/shared/hooks/useSEO';
import { StructuredData, STRUCTURED_DATA_SCHEMAS } from '@/shared/components/seo/StructuredData';

// Pingala components
import PingalaHero from '../components/PingalaHero';
import MathematicalFoundations from '../components/MathematicalFoundations';
import LeaderboardResults from '../components/LeaderboardResults';
import GlobalLanguageSupport from '../components/GlobalLanguageSupport';
import Navigation from '@/shared/components/layout/Navigation';

const PingalaPage: React.FC = () => {
  // Apply SEO optimization for Pingala research article
  useSEO({
    title:
      'Pingala V1 Achieves #1 Ranking: The Mathematical Revolution in Speech Recognition | Shunya Labs',
    description:
      'Everything starts from Zero - Pingala V1 ASR model achieves #1 on Open ASR Leaderboard with 3.37% WER, 216 languages, Enhanced & Verbatim modes. Named after ancient mathematician Pingala (c. 3rd–2nd century BCE), combining historical binary foundations with revolutionary AI. Research breakthrough by Shunya Labs team.',
    keywords: [
      'Pingala V1',
      'Pingala',
      'ASR',
      'speech recognition',
      'Enhanced mode',
      'Verbatim mode',
      'mathematical precision',
      'Open ASR Leaderboard',
      '200 languages',
      'scientific AI',
      'automatic speech recognition',
      'voice AI',
      'mathematical ASR',
      'entropy dataset',
      'mixture of experts',
      'speaker diarization',
      'semantic correction',
      'leaderboard champion',
      'everything starts from zero',
      'mathematical foundations',
      'binary mathematics',
      'ancient mathematician',
      'mātrāmeru',
      'historical AI',
      'WER 3.37%',
      'RTFx 157.93',
      'Shunya Labs',
      'research paper',
      'journalistic article',
      'breakthrough technology',
      'AI research',
      'machine learning',
      'call center optimization',
      'media transcription',
      'filler correction',
      'noise reduction',
    ],
    canonicalUrl: '/pingala',
  });

  return (
    <div className="min-h-screen transition-colors bg-white">
      {/* SEO Structured Data */}
      <StructuredData
        data={{
          ...STRUCTURED_DATA_SCHEMAS.organization,
          name: 'Pingala V1 ASR Research',
          description: '#1 ASR Model with Mathematical Precision - Research by Shunya Labs',
        }}
      />
      <StructuredData
        data={{
          ...STRUCTURED_DATA_SCHEMAS.product,
          name: 'Pingala V1: Mathematical Revolution in Speech Recognition',
          description:
            'Research article on Pingala V1 ASR model achieving #1 ranking with 3.37% WER across 216 languages, featuring Enhanced and Verbatim modes',
        }}
      />

      {/* <Header /> */}
      <Navigation />

      {/* 1. Hero Section - Article Header & Introduction */}
      <PingalaHero />

      {/* 2. Mathematical Foundations - The Science Behind the Magic */}
      <MathematicalFoundations />

      {/* 3. Leaderboard Results - The Moment Everything Changed */}
      <LeaderboardResults />

      {/* 4. Global Language Support - 200+ Languages Revolution */}
      <GlobalLanguageSupport />

      {/* 5. Conclusion and Future Publication */}
      <section className="py-16 bg-gradient-to-b from-blue-50 via-purple-50 to-indigo-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl font-bold mb-12">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Conclusion: A New Era Begins
            </span>
          </h2>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30 shadow-xl mb-12">
            <div className="text-lg leading-relaxed text-slate-700 space-y-6">
              <p>
                Pingala V1's #1 ranking on the Open ASR Leaderboard marks more than just a technical
                achievement—it represents the dawn of a new era in speech recognition. By proving
                that mathematical elegance and practical performance can go hand in hand, the team
                at Shunya Labs has set a new standard for what's possible when
                <strong className="bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] bg-clip-text text-transparent font-bold text-xl mx-1">
                  "Everything starts from Zero."
                </strong>
              </p>
              <p>
                This principle finds its deepest expression in the model's connection to its ancient
                namesake—Pingala (c. 3rd–2nd century BCE), the mathematician whose work on binary
                number systems and combinatorial sequences laid the foundation for modern
                computational thinking. Just as Pingala's mātrāmeru revealed the elegant patterns
                underlying complex mathematical relationships, Pingala V1 demonstrates that the
                binary foundations of computation—the simple dance between 0 and 1—remain as
                relevant today as they were millennia ago. The model's architecture embodies this
                timeless wisdom: that from the simplest mathematical principles, the most profound
                breakthroughs emerge.
              </p>
              <p>
                In a field where incremental improvements are the norm, Pingala V1 has delivered a
                revolution. With its
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-bold mx-1">
                  around 50%
                </span>
                performance advantage,
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-bold mx-1">
                  216 languages
                </span>
                support, and mathematical foundations that promise even greater breakthroughs ahead,
                the future of speech recognition has never looked brighter.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-2xl p-10 mb-12 shadow-2xl border border-blue-500/30 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-red-400/10 blur-3xl"></div>
            <div className="relative z-10">
              <p className="text-2xl font-bold mb-6 bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                The leaderboard speaks for itself: #1 out of 47 models, with championship
                performance that redefines what's possible.
              </p>
              <p className="text-lg opacity-95">
                But perhaps more importantly, Pingala V1 has shown that when you start from
                mathematical first principles—when you truly embrace that everything starts from
                zero—you can achieve the extraordinary.
              </p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-10 border border-purple-500/30 shadow-xl mb-12 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Research Publication
                </span>
              </h3>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200/50 mb-6">
                <p className="text-xl text-amber-800 font-semibold">
                  A detailed paper will be published in due course of time.
                </p>
              </div>
              <p className="text-slate-600">
                This article presents the key findings and innovations behind Pingala V1's
                record-breaking performance. Detailed technical specifications and complete
                experimental protocols will be made available in the forthcoming peer-reviewed
                research paper.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200/50 shadow-lg">
            <p className="text-lg text-slate-700 mb-6 italic">
              The Pingala V1 research team at Shunya Labs continues to push the boundaries of what's
              possible in speech recognition technology.
            </p>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-purple-200/50">
              <p className="text-lg text-slate-700">
                <strong className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  About the Authors:
                </strong>{' '}
                Sourav Banerjee, Ayushi Agarwal, Zareen Sultana, Ayush Kumar Bar, and Aditya Singh
                Rathore are researchers at Shunya Labs, where they focus on applying mathematical
                principles to advance artificial intelligence and speech recognition technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PingalaPage;
