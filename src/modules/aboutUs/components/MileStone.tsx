import { Card, CardContent } from '@/shared/components/ui/card';

const MileStone = () => {
  return (
    <>
      {/* Milestones */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-midnight mb-12 text-center">Milestones</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover-scale bg-white/80 backdrop-blur group hover:shadow-lg transition-all duration-300 animate-fade-in">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-2xl">&lt;</span>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">200ms</div>
                <p className="text-gray-600">round-trip latency in production</p>
              </CardContent>
            </Card>

            <Card
              className="hover-scale bg-white/80 backdrop-blur group hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: '0.1s' }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">🌍</span>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">216</div>
                <p className="text-gray-600">languages & dialects</p>
              </CardContent>
            </Card>

            <Card
              className="hover-scale bg-white/80 backdrop-blur group hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">💰</span>
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
                <p className="text-gray-600">GPU cost saved for a Fortune 100 logistics client</p>
              </CardContent>
            </Card>

            <Card
              className="hover-scale bg-white/80 backdrop-blur group hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">🏆</span>
                </div>
                <div className="text-3xl font-bold text-orange-600 mb-2">#1</div>
                <p className="text-gray-600">CPU ASR on Hugging Face</p>
              </CardContent>
            </Card>

            <Card
              className="hover-scale bg-white/80 backdrop-blur group hover:shadow-lg transition-all duration-300 animate-fade-in md:col-span-2 lg:col-span-1"
              style={{ animationDelay: '0.4s' }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">🔒</span>
                </div>
                <div className="text-3xl font-bold text-teal-600 mb-2">SOC 2 Type II</div>
                <p className="text-gray-600">Compliant</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default MileStone;
