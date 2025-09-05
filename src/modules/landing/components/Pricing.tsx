import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

const Pricing = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="pricing"
      className="py-8 md:py-12 lg:py-16 bg-gradient-to-b from-blue-50 via-pink-50 to-purple-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Pricing Tiers
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-4">
            CPU-first pricing that scales with your needs
          </p>
          <p className="text-base text-gray-600 font-medium">
            No GPU required — liberate your infrastructure costs
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Explorer Tier */}
          <Card className="relative hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-xl border-gray-200/50">
            <CardHeader className="text-center p-6">
              <CardTitle className="text-xl font-bold text-gray-900">Explorer</CardTitle>
              <div className="text-3xl font-bold text-purple-600 mt-3">Free</div>
              <p className="text-gray-700 mt-2 text-sm">Start your journey with basic features</p>
            </CardHeader>
            <CardContent className="space-y-3 p-6 pt-0">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">Up to 100 hours/month</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">5 languages</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">Community support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">Docker deployment</span>
                </div>
              </div>
              <Button
                size="default"
                className="w-full mt-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white hover:opacity-90"
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Innovator Tier */}
          <Card className="relative hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-purple-500 bg-white/80 backdrop-blur-xl">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                Popular
              </span>
            </div>
            <CardHeader className="text-center p-6">
              <CardTitle className="text-xl font-bold text-gray-900">Innovator</CardTitle>
              <div className="text-3xl font-bold text-purple-600 mt-3">Pro</div>
              <p className="text-gray-700 mt-2 text-sm">Advanced features for growing teams</p>
            </CardHeader>
            <CardContent className="space-y-3 p-6 pt-0">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">Unlimited usage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">50+ languages</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">Priority support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">SLA guarantees</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">Custom fine-tuning</span>
                </div>
              </div>
              <Button
                size="default"
                className="w-full mt-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white hover:opacity-90"
              >
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>

          {/* Pioneer Tier */}
          <Card className="relative hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-xl border-gray-200/50">
            <CardHeader className="text-center p-6">
              <CardTitle className="text-xl font-bold text-gray-900">Pioneer</CardTitle>
              <div className="text-3xl font-bold text-purple-600 mt-3">Enterprise</div>
              <p className="text-gray-700 mt-2 text-sm">
                Custom solutions for visionary organizations
              </p>
            </CardHeader>
            <CardContent className="space-y-3 p-6 pt-0">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">All 150+ languages</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">Dedicated support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">On-premises deployment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">Custom integrations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">Training & consulting</span>
                </div>
              </div>
              <Button
                onClick={scrollToContact}
                size="default"
                className="w-full mt-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-90 transition-opacity"
              >
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-700 mb-4 text-sm">Need a custom solution? We're here to help.</p>
          <Button
            size="lg"
            onClick={scrollToContact}
            variant="outline"
            className="border-purple-500 text-purple-600 hover:bg-purple-50"
          >
            Contact for Custom Pricing
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
