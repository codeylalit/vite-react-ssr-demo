import { CheckCircle } from 'lucide-react';
import { BharaReasonBenefits as benefits } from '../data/BharaReason';
const BharaReasonSpecial = () => {
  return (
    <>
      {/* What Makes It Special */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">What Makes It Special?</h2>
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

export default BharaReasonSpecial;
