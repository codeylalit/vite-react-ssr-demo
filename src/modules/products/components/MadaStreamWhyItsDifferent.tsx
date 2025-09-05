import { MadaStreamBenefits as benefits } from '../data/MadaStream';
import { CheckCircle } from 'lucide-react';

const MadaStreamWhyItsDifferent = () => {
  return (
    <>
      {/* Why It's Different */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why It&apos;s Different</h2>
          </div>

          <div className="grid md:grid-cols-1 gap-8 max-w-3xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-lg text-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default MadaStreamWhyItsDifferent;
