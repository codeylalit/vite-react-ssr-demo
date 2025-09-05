import Navigation from '@/shared/components/layout/Navigation';
import Footer from '@/shared/components/layout/Footer';
import { useSEO, SEO_CONFIGS } from '@/shared/hooks/useSEO';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const BookDemo = () => {
  // Apply SEO configuration for Contact page
  useSEO(SEO_CONFIGS.contact);

  // Noteforms script injection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const scriptId = 'noteforms-iframe-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.type = 'text/javascript';
        script.src = 'https://noteforms.com/widgets/iframe.min.js';
        script.onload = function () {
          if (typeof window.initEmbed === 'function') {
            window.initEmbed('contact-us-harlgv');
          }
        };
        document.body.appendChild(script);
      } else if (typeof window.initEmbed === 'function') {
        window.initEmbed('contact-us-harlgv');
      }
    }
  }, []);

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="py-24 bg-gradient-to-br from-soft-white via-white to-blue-50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-midnight mb-4">Demo Request Submitted!</h1>
              <p className="text-xl text-gray-600">
                Thank you for your interest in Shunya Labs. Our team will contact you within 24
                hours to schedule your personalized demo.
              </p>
            </div>
            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4">What happens next?</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-electric-blue rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Demo Scheduling</p>
                      <p className="text-sm text-gray-600">
                        We'll reach out to schedule your personalized demo
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-electric-blue rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Live Demonstration</p>
                      <p className="text-sm text-gray-600">
                        See our AI models in action with your use case
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-electric-blue rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Custom Proposal</p>
                      <p className="text-sm text-gray-600">
                        Receive a tailored solution and pricing for your needs
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 py-24">
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

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 hidden">
            <h1 className="text-4xl font-bold text-midnight mb-4">Book a Demo</h1>
            <p className="text-xl text-gray-600">
              Share your details here, and our team will get in touch with you.
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur shadow-xl hidden">
            <CardHeader></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input type="email" id="email" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input type="tel" id="phone" required />
                </div>

                <Button type="submit" className="w-full">
                  Request Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Noteforms Embed Start */}
          <div className="relative h-full overflow-hidden rounded-3xl shadow-md bg-white">
            <iframe
              style={{ border: 'none', width: '100%', height: '500px' }}
              id="contact-us-harlgv"
              src="https://noteforms.com/forms/contact-us-harlgv"
            ></iframe>
            {/* Noteforms Embed End */}
            <div className="absolute bottom-0 w-full h-5 md:h-12 bg-white z-10" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookDemo;
