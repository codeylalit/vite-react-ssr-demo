import { Card, CardContent } from '@/shared/components/ui/card';
import { Brain, MessageCircle, Mic } from 'lucide-react';

const AryaEchoHowItWorks = () => {
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
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto flex items-center justify-center">
                  <Mic className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground leading-tight">
                  You talk or type
                </h3>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto flex items-center justify-center">
                  <Brain className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground leading-tight">
                  A1 listens and thinks
                </h3>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground leading-tight">
                  Gives a smart, relevant reply
                </h3>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              It uses powerful AI tech (2 billion parameters) to do this, but you don&apos;t need to
              worry about the math.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AryaEchoHowItWorks;
