import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Copy, Check } from 'lucide-react';

const Deploy = () => {
  const [copied, setCopied] = useState(false);
  const [typedCommand, setTypedCommand] = useState('');
  const command = 'docker run -d --gpus=disabled -p 8080:8080 shunya/zeroedge:latest';

  useEffect(() => {
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < command.length) {
        setTypedCommand(prev => prev + command[index]);
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deploymentFeatures = [
    { title: 'Air-gapped installation support', icon: '🔒' },
    { title: 'FIPS-validated cryptography', icon: '🛡️' },
    { title: 'HIPAA & GDPR compliance built-in', icon: '📋' },
    { title: 'Zero cloud dependencies', icon: '☁️' },
    { title: 'Works on any x86/ARM CPU', icon: '💻' },
  ];

  return (
    <section id="deploy" className="py-8 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Deploy{' '}
            <span className="bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] bg-clip-text text-transparent">
              On-Premises
            </span>
          </h2>
          <p className="text-2xl text-gray-600">One Command</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Command Section */}
          <div className="space-y-6">
            <Card className="bg-gray-900 text-white overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0]">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Terminal</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyToClipboard}
                    className="text-white border-white hover:bg-white hover:text-gray-900"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="font-mono text-sm">
                  <span className="text-green-400">$ </span>
                  <span className="text-white">
                    {typedCommand}
                    <span className="animate-pulse">|</span>
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                That's it! Your ASR engine is now running locally.
              </h3>
              <p className="text-gray-600">
                No complex setup, no cloud dependencies, no vendor lock-in. Just pure speech
                recognition power running on your hardware.
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Enterprise-Ready Features</h3>
            <div className="space-y-4">
              {deploymentFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`flex items-center space-x-4 p-4 bg-gray-50 rounded-lg transform transition-all duration-500 delay-${index * 100} hover:bg-gray-100`}
                >
                  <div className="text-2xl">{feature.icon}</div>
                  <span className="text-gray-900 font-medium">{feature.title}</span>
                </div>
              ))}
            </div>

            <Card className="mt-8">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Architecture Overview</h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>Your Application</span>
                    <span>→</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span>Shunya ASR Engine</span>
                    <span>→</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>Your CPU (x86/ARM)</span>
                    <span>✓</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Deploy;
