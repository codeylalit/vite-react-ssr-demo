import { Card, CardContent } from '@/shared/components/ui/card';

const CoreBenifits = () => {
  return (
    <>
      {/* Core Beliefs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-midnight mb-12 text-center">Core Beliefs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover-scale bg-white/80 backdrop-blur group hover:shadow-lg transition-all duration-300 animate-fade-in">
              <CardContent className="p-6 text-center items-center flex flex-col">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-lg">⚡</span>
                </div>
                <h3 className="font-semibold text-midnight mb-3 text-lg">Own the Stack</h3>
                <p className="text-gray-600">CPUs first, clouds optional.</p>
              </CardContent>
            </Card>

            <Card
              className="hover-scale bg-white/80 backdrop-blur group hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: '0.1s' }}
            >
              <CardContent className="p-6 text-center items-center flex flex-col">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-lg">🔒</span>
                </div>
                <h3 className="font-semibold text-midnight mb-3 text-lg">Privacy &gt; Hype</h3>
                <p className="text-gray-600">If data leaves the building, we failed.</p>
              </CardContent>
            </Card>

            <Card
              className="hover-scale bg-white/80 backdrop-blur group hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              <CardContent className="p-6 text-center items-center flex flex-col">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-lg">∑</span>
                </div>
                <h3 className="font-semibold text-midnight mb-3 text-lg">Math Wins</h3>
                <p className="text-gray-600">First principles beat brute force.</p>
              </CardContent>
            </Card>

            <Card
              className="hover-scale bg-white/80 backdrop-blur group hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              <CardContent className="p-6 text-center items-center flex flex-col">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-lg">📖</span>
                </div>
                <h3 className="font-semibold text-midnight mb-3 text-lg">Open by Default</h3>
                <p className="text-gray-600">Honest docs, clean APIs.</p>
              </CardContent>
            </Card>

            <Card
              className="hover-scale bg-white/80 backdrop-blur group hover:shadow-lg transition-all duration-300 animate-fade-in md:col-span-2 lg:col-span-1"
              style={{ animationDelay: '0.4s' }}
            >
              <CardContent className="p-6 text-center items-center flex flex-col">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-lg">🚀</span>
                </div>
                <h3 className="font-semibold text-midnight mb-3 text-lg">
                  Ship Fast, Iterate Faster
                </h3>
                <p className="text-gray-600">Weekly releases or it didn't happen.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default CoreBenifits;
