import { Badge } from '@/shared/components/ui/badge';

const MadaStreamHeroSection = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 md:h-screen">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, #F97316 2px, transparent 0), radial-gradient(circle at 75px 75px, #EAB308 2px, transparent 0)`,
              backgroundSize: '100px 100px',
            }}
          />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-30 blur-lg animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 h-full flex flex-col">
          <div className="text-center my-auto">
            <div className="flex justify-center mb-8">
              <Badge
                variant="secondary"
                className="text-lg px-6 py-3 bg-gradient-to-r from-orange-500/90 to-yellow-500/90 text-white backdrop-blur-sm border-0 shadow-lg animate-pulse"
              >
                🚀 Coming Soon
              </Badge>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                M1
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              Built for logic. Designed for discovery.
            </p>

            <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl p-8 mb-8 max-w-4xl mx-auto shadow-lg">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4">
                What Is It?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                This is our advanced reasoning engine that blends Graph Neural Networks (GNNs) with
                logical inference systems. It helps machines understand complex structures, reason
                over them, and even support tasks like mathematical proofs, scientific modeling, and
                multi-step logical thinking.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether it&apos;s analyzing a research paper or solving a multi-variable equation,
                this engine thinks beyond linear models.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MadaStreamHeroSection;
