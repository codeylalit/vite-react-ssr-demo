const legacyProducts = [
  {
    id: 1,
    name: 'Ping',
    letter: 'P',
    gradientClass: 'bg-gradient-to-br from-blue-500 to-cyan-400',
    roots: "Pingala's binary meter",
    impact: 'Word-perfect ASR under industrial noise',
    animationDelay: '0s',
  },
  {
    id: 2,
    name: 'Arya',
    letter: 'A',
    gradientClass: 'bg-gradient-to-br from-purple-500 to-pink-500',
    roots: "Āryabhaṭa's celestial math",
    impact: 'Lifelike TTS at < 0.2 ¢/min',
    animationDelay: '0.1s',
  },
  {
    id: 3,
    name: 'Bhara',
    letter: 'B',
    gradientClass: 'bg-gradient-to-br from-emerald-500 to-teal-500',
    roots: "Bharata Muni's nine emotions",
    impact: 'Inline intent, sentiment, redaction',
    animationDelay: '0.2s',
  },
  {
    id: 4,
    name: 'Mada',
    letter: 'M',
    gradientClass: 'bg-gradient-to-br from-orange-500 to-yellow-500',
    roots: "Mādhava's infinite series",
    impact: 'Hours-long streaming with no resets',
    animationDelay: '0.3s',
  },
];

const LegacyInFourLetters = () => {
  return (
    <>
      {/* Legacy in Four Letters */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-midnight mb-8 text-center">
            Legacy in Four Letters
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-4">
            {legacyProducts.map(product => (
              <div
                key={product.id}
                className="group/product rounded-3xl p-8 ring-1 ring-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white animate-fade-in text-left"
                style={{ animationDelay: product.animationDelay }}
              >
                <div className="flex items-center justify-between gap-x-4 mb-6">
                  <div
                    className={`w-12 h-12 ${product.gradientClass} rounded-xl flex items-center justify-center`}
                  >
                    <span className="text-white font-bold text-lg">{product.letter}</span>
                  </div>
                </div>

                <div className="mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Roots</p>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                        {product.roots}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Impact</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{product.impact}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="inline-block bg-gradient-to-r from-electric-blue to-primary bg-clip-text text-transparent">
              <p className="text-xl font-semibold italic">Ancient elegance, modern uptime.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LegacyInFourLetters;
