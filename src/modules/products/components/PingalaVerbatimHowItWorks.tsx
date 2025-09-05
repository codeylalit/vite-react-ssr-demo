import { Card, CardContent } from '@/shared/components/ui/card';

const PingalaVerbatimHowItWorks = () => {
  return (
    <>
      {/* How It Works */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto flex items-center justify-center text-primary-foreground font-bold text-xl">
                  1
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground leading-tight">
                    Integrate our SDK or REST API
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto flex items-center justify-center text-primary-foreground font-bold text-xl">
                  2
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground leading-tight">
                    Send your audio stream
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto flex items-center justify-center text-primary-foreground font-bold text-xl">
                  3
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground leading-tight">
                    Get back fully transcribed text—quickly and privately
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default PingalaVerbatimHowItWorks;
