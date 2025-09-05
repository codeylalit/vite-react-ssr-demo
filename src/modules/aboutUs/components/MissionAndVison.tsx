import { Crosshair, Eye } from 'lucide-react';

const MissionAndVison = () => {
  return (
    <>
      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-midnight mb-8 text-center">Mission & Vision</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center group h-full">
              <div className="rounded-2xl p-8 border border-primary/20 hover:border-primary/30 transition-all duration-300 group flex flex-col h-full">
                <div className="group-hover:scale-110 transition-transform duration-300 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">
                    <Crosshair />
                  </span>
                </div>
                <h3 className="text-2xl font-semibold text-green-600 mb-4">Mission</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Put private, real-time voice intelligence on every device—no GPUs, no leaks, no
                  excuses.
                </p>
              </div>
            </div>

            <div className="text-center group h-full">
              <div className=" rounded-2xl p-8 border border-electric-blue/20 hover:border-electric-blue/30 transition-all duration-300 group flex flex-col h-full">
                <div className="group-hover:scale-110 transition-transform duration-300 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">
                    <Eye />
                  </span>
                </div>
                <h3 className="text-2xl font-semibold text-electric-blue mb-4">Vision</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Machines that listen as clearly as humans without stealing the conversation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MissionAndVison;
