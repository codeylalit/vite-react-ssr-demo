import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { BookOpen, Code, Zap, Download, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';

const Docs = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const jsCode = `// Initialize Zero Voice Infinity
import { ZeroVoiceClient } from 'zero-voice-infinity';

const client = new ZeroVoiceClient({
  apiKey: 'your-api-key-here'
});

// Text to Speech
const result = await client.tts.synthesize({
  text: "Hello World!",
  voice: "emma",
  language: "en-US"
});`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
          <p className="text-gray-600 mt-1">Learn how to integrate Zero Voice Infinity</p>
        </div>
        <Button className="bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] text-white">
          <ExternalLink className="h-4 w-4 mr-2" />
          Full Documentation
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>Get started in minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { title: 'Get API Key', icon: '🔑' },
              { title: 'Install SDK', icon: '📦' },
              { title: 'First Call', icon: '⚡' },
              { title: 'Explore', icon: '🚀' },
            ].map((step, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">{step.icon}</div>
                <h3 className="font-medium">{step.title}</h3>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Code Example</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{jsCode}</code>
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 bg-gray-800 border-gray-700 text-gray-300"
              onClick={() => copyToClipboard(jsCode, 'js')}
            >
              {copiedCode === 'js' ? (
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-400" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copiedCode === 'js' ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'API Reference', desc: 'Complete API documentation', icon: BookOpen },
          { title: 'SDK Guide', desc: 'Language-specific guides', icon: Code },
          { title: 'Examples', desc: 'Sample applications', icon: Zap },
          { title: 'Voice Gallery', desc: 'Browse available voices', icon: Download },
        ].map((resource, index) => {
          const Icon = resource.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-[#2d4cc8]" />
                  <span>{resource.title}</span>
                  <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                </CardTitle>
                <CardDescription>{resource.desc}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Docs;
