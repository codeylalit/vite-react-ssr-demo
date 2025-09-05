import { CheckCircle } from 'lucide-react';
import { pingalaVerbatimBenefits as benefits } from '../data/PingalaVerbatim';

const PingalaVerbatimWhyChoosePingala = () => {
  return (
    <>
      {/* Why Choose Pingala */}
      <section className="py-20 bg-accent/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose Pingala V1?</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <p className="text-lg text-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PingalaVerbatimWhyChoosePingala;
