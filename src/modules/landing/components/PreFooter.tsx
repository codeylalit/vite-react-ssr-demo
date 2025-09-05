import { Button } from '@/shared/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PreFooter = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-800 to-blue-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to hear the difference?</h2>
        <p className="text-xl mb-8 text-blue-100">
          Join the early access program and experience CPU-first voice AI
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" className="px-8 py-4 text-lg" asChild>
            <Link to="/early-access">
              Get Early Access
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-4 text-lg bg-transparent border-white text-white hover:bg-white hover:text-blue-400"
            asChild
          >
            <Link to="/contact">Book Demo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PreFooter;
