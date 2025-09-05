const AboutUsHero = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 md:h-screen">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, #1E90FF 2px, transparent 0), radial-gradient(circle at 75px 75px, #8B5CF6 2px, transparent 0)`,
              backgroundSize: '100px 100px',
            }}
          />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-30 blur-lg animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:py-32 h-full flex flex-col">
          <div className="text-center my-auto">
            <h1 className="text-5xl lg:text-7xl font-bold text-midnight mb-6 tracking-tight">
              We silence the static
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                so every voice is heard.
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              A squad of first-principles engineers, math nerds, and privacy hawks, we rebuild
              speech tech from the silicon up—real-time, on-prem, and fearless. Zero noise, infinite
              voice: that’s not a slogan; it’s our daily sprint target.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUsHero;
