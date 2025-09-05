import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import type { MathematicalFoundation, ExpertSpecialist } from '../types';

const MathematicalFoundations: React.FC = () => {
  const foundations: MathematicalFoundation[] = [
    {
      principle: 'High Entropy Architecture',
      description: 'Embracing chaos to achieve order through systematic entropy maximization',
      formula: 'H(X) = -∑ P(x_i) log₂ P(x_i)',
      application:
        'Exponential pruning algorithm that removes low-information samples while preserving linguistic complexity',
    },
    {
      principle: 'Mixture of Experts (MoE)',
      description: 'Specialized AI experts each mastering different aspects of human language',
      formula: 'y = ∑ᵢ G(x)ᵢ × Eᵢ(x)',
      application: 'Dynamic routing between specialized models for optimal performance',
    },
    {
      principle: 'Speaker Diarization',
      description: 'Advanced mathematical clustering with temporal coherence',
      formula: 'D(t) = argmax_s P(s|x_t, θ)',
      application: 'Real-time speaker tracking in multi-speaker environments',
    },
    {
      principle: 'Semantic Correction Engine',
      description:
        'Intelligent context-aware correction system that combines acoustic, linguistic, and semantic information',
      formula: 'S_{corrected} = \\arg\\max_S P(S|A, L, C)',
      application:
        'Multi-modal correction pipeline that analyzes acoustic confidence, linguistic patterns, and contextual coherence to provide semantically accurate transcriptions beyond simple word-level corrections',
    },
  ];

  const experts: ExpertSpecialist[] = [
    {
      name: 'SVO Expert',
      description: 'Masters sentence structure and grammatical patterns',
      activationRate: 78,
      specialty: 'Syntactic Analysis',
    },
    {
      name: 'Gender Expert',
      description: 'Understands gender-sensitive linguistic nuances',
      activationRate: 82,
      specialty: 'Sociolinguistic Patterns',
    },
    {
      name: 'Phonetic Expert',
      description: 'Excels at acoustically challenging segments',
      activationRate: 91,
      specialty: 'Acoustic Processing',
    },
    {
      name: 'Semantic Expert',
      description: 'Grasps context and meaning',
      activationRate: 74,
      specialty: 'Contextual Understanding',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-2 relative z-10 w-full">
        <header className="mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              The Science Behind the Magic
            </span>
          </h2>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 shadow-xl max-w-7xl mx-auto">
            <p className="text-xl text-slate-700 mb-6">
              Discover the rigorous mathematical principles and scientific innovations that power
              Pingala V1's revolutionary approach to speech recognition.
            </p>

            {/* Philosophical Introduction */}
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 rounded-xl p-6 border border-amber-200/50 mt-6">
              <p className="text-lg text-slate-700 leading-relaxed">
                Just as the ancient mathematician Pingala revealed the profound elegance underlying
                binary sequences and combinatorial patterns in his mātrāmeru, Pingala V1
                demonstrates how timeless mathematical principles can illuminate the path to
                breakthrough innovations. The model's architecture embodies the same fundamental
                insight that guided Pingala's work: that complex systems emerge from simple,
                mathematically precise foundations— where everything, indeed, starts from zero.
              </p>
            </div>
          </div>
        </header>

        {/* Mathematical Foundations */}
        <div className="mb-16 my-10">
          <h3 className="text-3xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Core Mathematical Principles
            </span>
          </h3>
          <div className="grid w-full max-w-full sm:grid-cols-1 lg:grid-cols-2 gap-8">
            {foundations.map((foundation, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 lg:p-8 border border-purple-500/30 shadow-xl transition-all duration-300 transform md:hover:scale-105 max-w-full"
              >
                <h4 className="text-2xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {foundation.principle}
                  </span>
                </h4>
                <p className="text-slate-700 mb-6 text-lg">{foundation.description}</p>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-200/50">
                  <div className="text-sm font-semibold text-blue-800 mb-3">
                    Mathematical Foundation:
                  </div>
                  <BlockMath math={foundation.formula} />
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200/50">
                  <div className="text-sm font-semibold text-green-800">
                    <strong>Application:</strong> {foundation.application}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High Entropy Architecture Deep Dive */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-slate-900 mb-6">
            High Entropy Architecture: Finding Order from Chaos
          </h3>
          <div className="prose prose-lg max-w-none text-slate-700 space-y-6">
            <p>
              Following ancient principles of finding mathematical harmony within apparent disorder,
              Pingala V1's approach lies in a counterintuitive strategy: embracing chaos to achieve
              order. While most ASR models try to clean and organize their training data, Pingala V1
              does the opposite—it seeks out high entropy, high-chaos data that forces the model to
              become more robust, much like how ancient scholars found profound patterns within the
              complexity of natural phenomena.
            </p>
            <p>
              The mathematical foundation is elegantly simple yet powerful. This entropy formula
              guides an exponential pruning algorithm that systematically removes low-information
              samples while preserving the linguistic complexity that makes real-world speech so
              challenging. It's like training a pianist not just on Mozart, but on jazz
              improvisation, street musicians, and everything in between.
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 mt-8 border border-blue-200">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">
              Entropy Calculation Process
            </h4>
            <div className="space-y-4">
              <div className="text-center">
                <BlockMath math="H(X) = -\sum_{i=1}^{n} P(x_i) \log_2 P(x_i)" />
              </div>
              <div className="text-sm text-blue-800">
                Where <InlineMath math="P(x_i)" /> represents the probability of each linguistic
                pattern, and the algorithm maximizes information content while maintaining semantic
                coherence.
              </div>
            </div>
          </div>
        </div>

        {/* Expert Specialists */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-slate-900 mb-6">
            The Expert Specialists: A Symphony of Specialized Knowledge
          </h3>
          <p className="text-lg text-slate-600 mb-8">
            Perhaps Pingala V1's most innovative feature is its Mixture of Experts (MoE)
            architecture, where specialized AI "experts" each master different aspects of human
            language. This approach mirrors both how the human brain processes language and the
            ancient scholarly tradition of specialized knowledge domains, where different masters
            excelled in different aspects of learning. Just as traditional scholarship recognized
            that true understanding emerges from the collaboration of specialized expertise, Pingala
            V1's architecture demonstrates that modern AI can benefit from this time-tested
            organizational principle.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {experts.map((expert, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold text-slate-900">{expert.name}</h4>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{expert.activationRate}%</div>
                    <div className="text-xs text-slate-500">Activation Rate</div>
                  </div>
                </div>

                <p className="text-slate-700 mb-3">{expert.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600">{expert.specialty}</span>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${expert.activationRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Speaker Diarization */}
        <div>
          <h3 className="text-2xl font-semibold text-slate-900 mb-6">
            Speaker Diarization: Solving the Cocktail Party Problem
          </h3>
          <div className="prose prose-lg max-w-none text-slate-700 space-y-4">
            <p>
              One of Pingala V1's most impressive capabilities is its ability to distinguish between
              different speakers in real-time—what researchers call the "cocktail party problem."
              Using advanced mathematical clustering with temporal coherence, Pingala V1 can track
              who's speaking when, even in noisy, multi-speaker environments.
            </p>
            <p>
              The algorithm employs speaker embeddings in high-dimensional space, clustering
              speakers while maintaining temporal consistency. It's like having a perfect memory for
              voices, even when multiple people are talking over each other.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MathematicalFoundations;
