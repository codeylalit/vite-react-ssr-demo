import { MadaStreamTrustFeatures as trustFeatures } from '../data/MadaStream';
import { CheckCircle } from 'lucide-react';

const MadaStreamTrustworthy = () => {
  return (
    <>
      {/* Trustworthy & Transparent */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Trustworthy & Transparent</h2>
          </div>

          <div className="grid md:grid-cols-1 gap-8 max-w-3xl mx-auto">
            {trustFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-lg text-foreground">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default MadaStreamTrustworthy;
