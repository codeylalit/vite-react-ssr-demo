import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/shared/components/ui/badge';
import { Card } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Button } from '@/shared/components/ui/button';
import { Cloud, Code, Github, ChevronDown } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

// Enhanced CodeBlock component with Prism.js syntax highlighting
const CodeBlock: React.FC<{ language?: string; code: string }> = ({
  language = 'typescript',
  code,
}) => {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  // Function to format code with proper indentation
  const formatCode = (code: string) => {
    // Remove leading/trailing whitespace and normalize line endings
    const normalizedCode = code.replace(/\r\n/g, '\n').trim();

    // Split into lines
    const lines = normalizedCode.split('\n');

    // Find the minimum indentation (only consider non-empty lines)
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    if (nonEmptyLines.length === 0) return normalizedCode;

    // Calculate minimum indentation
    const minIndent = Math.min(
      ...nonEmptyLines.map(line => {
        const match = line.match(/^\s*/);
        return match ? match[0].length : 0;
      })
    );

    // Remove the minimum indentation from all lines
    const formattedLines = lines.map(line => {
      if (line.trim().length === 0) return ''; // Convert empty lines to empty strings
      return line.slice(minIndent);
    });

    // Join lines and ensure no trailing empty lines
    return formattedLines.join('\n').replace(/\n+$/, '');
  };

  const formattedCode = formatCode(code);

  // Apply syntax highlighting when component mounts or code changes
  useEffect(() => {
    if (codeRef.current) {
      // Map languages to available Prism components
      const languageMapping: { [key: string]: string } = {
        dockerfile: 'bash',
        shell: 'bash',
        sh: 'bash',
        zsh: 'bash',
      };

      const highlightLanguage = languageMapping[language.toLowerCase()] || language;
      codeRef.current.className = `language-${highlightLanguage}`;
      Prism.highlightElement(codeRef.current);
    }
  }, [formattedCode, language]);

  // Copy code to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Get language display name
  const getLanguageName = (lang: string) => {
    const languageMap: { [key: string]: string } = {
      python: 'Python',
      bash: 'Bash',
      shell: 'Bash',
      dockerfile: 'Dockerfile',
      yaml: 'YAML',
      json: 'JSON',
      typescript: 'TypeScript',
      javascript: 'JavaScript',
      jsx: 'JSX',
      tsx: 'TSX',
      html: 'HTML',
      css: 'CSS',
    };
    return languageMap[lang.toLowerCase()] || lang;
  };

  return (
    <div className="relative rounded-lg bg-gray-900 border border-gray-700 shadow-lg overflow-hidden group">
      {/* Language badge */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">
          {getLanguageName(language)}
        </span>
        <div className="flex items-center space-x-2">
          {/* Copy button */}
          <button
            onClick={copyToClipboard}
            className="text-xs text-gray-400 hover:text-gray-200 transition-colors duration-200 px-2 py-1 rounded hover:bg-gray-700"
            title="Copy code"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          {/* Terminal dots */}
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
      </div>

      {/* Code content */}
      <pre className="p-4 sm:p-6 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed m-0">
        <code ref={codeRef} className={`language-${language}`}>
          {formattedCode}
        </code>
      </pre>
    </div>
  );
};

const DeveloperDocumentation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12  max-w-7xl">
        {/* Hero Header */}
        <div className="relative space-y-4 sm:space-y-6 text-center mb-8 sm:mb-10">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#1a1947]/10 via-[#2d4cc8]/8 to-[#4c7cf0]/5 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl"></div>
          <div className="absolute inset-0 -z-20 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-indigo-50/50 rounded-2xl sm:rounded-3xl"></div>

          <div className="space-y-3 sm:space-y-5">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] bg-clip-text text-transparent leading-tight px-2">
              Developer Documentation
            </h1>
          </div>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Complete guide to integrating Shunya Labs' state-of-the-art speech recognition
            technology into your applications with industry-leading accuracy and performance.
          </p>
        </div>

        {/* Integration Options */}
        <section className="mb-8 sm:mb-16 lg:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Integration Options
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Choose the deployment method that best fits your needs and infrastructure
              requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Cloud API Card */}
            <Card className="p-8 bg-gradient-to-br from-white to-blue-50/50 border border-blue-100/50 hover:shadow-xl hover:shadow-blue-100/20 hover:border-[#2d4cc8]/20 transition-all duration-300 group h-full flex flex-col">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Cloud className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0">
                    Production Ready
                  </Badge>
                </div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Cloud API</h3>
                  <p className="text-gray-600 text-sm">
                    Enterprise-grade API for instant integration
                  </p>
                </div>
                <ul className="space-y-3 text-sm mb-6 min-h-[72px]">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-[#1a1947] min-w-fit">Endpoint:</span>
                    <span className="text-gray-600 break-all">https://asr.shunyalabs.ai</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-[#1a1947] min-w-fit">Documentation:</span>
                    <span className="text-gray-600">shunyalabs.ai/api</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-[#1a1947] min-w-fit">Best for:</span>
                    <span className="text-gray-600">Production applications</span>
                  </li>
                </ul>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge
                    variant="outline"
                    className="border-[#2d4cc8]/30 text-[#1a1947] bg-[#2d4cc8]/5"
                  >
                    Instant access
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-[#2d4cc8]/30 text-[#1a1947] bg-[#2d4cc8]/5"
                  >
                    Auto scaling
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-[#2d4cc8]/30 text-[#1a1947] bg-[#2d4cc8]/5"
                  >
                    Zero infrastructure
                  </Badge>
                </div>
                <div className="mt-auto">
                  <Button
                    className="w-full bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] hover:from-[#1a1947]/90 hover:to-[#2d4cc8]/90 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={() => navigate('/api')}
                  >
                    Get Started with API
                  </Button>
                </div>
              </div>
            </Card>

            {/* Python SDK Card */}
            <Card className="p-8 bg-gradient-to-br from-white to-purple-50/50 border border-purple-100/50 hover:shadow-xl hover:shadow-purple-100/20 hover:border-[#2d4cc8]/20 transition-all duration-300 group h-full flex flex-col">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-700 border-purple-200"
                  >
                    Local Deployment
                  </Badge>
                </div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Python SDK</h3>
                  <p className="text-gray-600 text-sm">Full control with on-premise deployment</p>
                </div>
                <ul className="space-y-3 text-sm mb-6 min-h-[72px]">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-[#1a1947] min-w-fit">Package:</span>
                    <span className="text-gray-600">pingala-shunya</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-[#1a1947] min-w-fit">Best for:</span>
                    <span className="text-gray-600">On-premise deployment</span>
                  </li>
                </ul>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge
                    variant="outline"
                    className="border-purple-300 text-purple-700 bg-purple-50"
                  >
                    Full control
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-purple-300 text-purple-700 bg-purple-50"
                  >
                    Local processing
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-purple-300 text-purple-700 bg-purple-50"
                  >
                    Enterprise security
                  </Badge>
                </div>
                <div className="mt-auto">
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={() =>
                      window.open('https://pypi.org/project/pingala-shunya/', '_blank')
                    }
                  >
                    Install Python SDK
                  </Button>
                </div>
              </div>
            </Card>

            {/* Hugging Face Models Card */}
            <Card className="p-8 bg-gradient-to-br from-white to-yellow-50/50 border border-yellow-100/50 hover:shadow-xl hover:shadow-yellow-100/20 hover:border-[#2d4cc8]/20 transition-all duration-300 group h-full flex flex-col">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#FFD21E] to-[#FF9D00] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <div className="text-2xl">🤗</div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-[#6B7280] border-yellow-200"
                  >
                    Direct Access
                  </Badge>
                </div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Hugging Face Models</h3>
                  <p className="text-gray-600 text-sm">
                    Open source models for research and development
                  </p>
                </div>
                <ul className="space-y-3 text-sm mb-6 min-h-[72px]">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-[#1a1947] min-w-fit">Models:</span>
                    <span className="text-gray-600">pingala-v1-en-verbatim</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-[#1a1947] min-w-fit">Best for:</span>
                    <span className="text-gray-600">Research & fine-tuning</span>
                  </li>
                </ul>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge
                    variant="outline"
                    className="border-orange-300 text-orange-700 bg-orange-50"
                  >
                    Model ownership
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-orange-300 text-orange-700 bg-orange-50"
                  >
                    Custom modifications
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-orange-300 text-orange-700 bg-orange-50"
                  >
                    Air-gapped use
                  </Badge>
                </div>
                <div className="mt-auto">
                  <Button
                    className="w-full bg-gradient-to-r from-[#FFD21E] to-[#FF9D00] hover:from-[#FF9D00] hover:to-[#FFD21E] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={() => window.open('https://huggingface.co/shunyalabs', '_blank')}
                  >
                    Download from Hugging Face
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Model Performance */}
        <section className="mb-8 sm:mb-16 lg:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Model Performance
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Industry-leading accuracy benchmarks across multiple datasets and use cases.
            </p>
          </div>

          <Tabs defaultValue="verbatim" className="w-full">
            <TabsList className="mb-6 sm:mb-8 bg-gradient-to-r from-slate-100 to-slate-50 p-1 h-auto flex-col sm:flex-row gap-1 sm:gap-0">
              <TabsTrigger
                value="verbatim"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1a1947] data-[state=active]:to-[#2d4cc8] data-[state=active]:text-white px-3 sm:px-6 py-2 sm:py-3 font-semibold text-sm sm:text-base w-full sm:w-auto"
              >
                Pingala V1 English Verbatim
              </TabsTrigger>
              <TabsTrigger
                value="universal"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1a1947] data-[state=active]:to-[#2d4cc8] data-[state=active]:text-white px-3 sm:px-6 py-2 sm:py-3 font-semibold text-sm sm:text-base w-full sm:w-auto"
              >
                Pingala V1 Universal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="verbatim">
              <Card className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">
                      English Verbatim Model
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      Industry-leading English transcription optimized for verbatim accuracy
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="p-4 sm:p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200/50">
                      <div className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">
                        Word Error Rate
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                        2.94%
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">
                        Composite across 8 benchmarks
                      </div>
                    </div>

                    <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
                      <div className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">
                        Real-Time Factor
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] bg-clip-text text-transparent">
                        172x
                      </div>
                      <div className="text-sm text-gray-600 mt-1">On L40 GPU</div>
                    </div>

                    <div className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/50">
                      <div className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">
                        Languages
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                        English
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">
                        All regional variants
                      </div>
                    </div>
                    <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
                      <div className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">
                        Optimization
                      </div>
                      <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] bg-clip-text text-transparent">
                        Maximum accuracy
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">
                        for English content
                      </div>
                    </div>
                    <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
                      <div className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">
                        Recommended Backend
                      </div>
                      <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] bg-clip-text text-transparent">
                        CT2 (CTranslate2)
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">
                        for optimal performance
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Dataset</th>
                          <th className="text-left py-2">WER (%)</th>
                          <th className="text-left py-2">Domain</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">LibriSpeech Clean</td>
                          <td className="py-2">1.84</td>
                          <td className="py-2">Read speech</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">SPGISpeech</td>
                          <td className="py-2">1.13</td>
                          <td className="py-2">Corporate earnings</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">TedLium</td>
                          <td className="py-2">2.14</td>
                          <td className="py-2">Presentations</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">AMI</td>
                          <td className="py-2">3.52</td>
                          <td className="py-2">Meetings</td>
                        </tr>
                        <tr>
                          <td className="py-2">VoxPopuli</td>
                          <td className="py-2">3.47</td>
                          <td className="py-2">Political speech</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="universal">
              <Card className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Universal Model</h3>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      Multi-language model supporting 216 languages and dialects
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="p-4 sm:p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200/50">
                      <div className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">
                        Word Error Rate
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                        3.10%
                      </div>
                      <div className="text-sm text-gray-600 mt-1">English composite</div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
                      <div className="font-semibold text-gray-700 mb-2">Real-Time Factor</div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] bg-clip-text text-transparent">
                        146.23x
                      </div>
                      <div className="text-sm text-gray-600 mt-1">On L40 GPU</div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/50">
                      <div className="font-semibold text-gray-700 mb-2">Languages</div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                        216
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Languages & dialects</div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
                      <div className="font-semibold text-gray-700 mb-2">Optimization</div>
                      <div className="text-lg font-bold bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] bg-clip-text text-transparent">
                        Maximum accuracy
                      </div>
                      <div className="text-sm text-gray-600 mt-1">for multilingual content</div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
                      <div className="font-semibold text-gray-700 mb-2">Recommended Backend</div>
                      <div className="text-lg font-bold bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] bg-clip-text text-transparent">
                        CT2 (CTranslate2)
                      </div>
                      <div className="text-sm text-gray-600 mt-1">for optimal performance</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200/50">
                      <h4 className="font-semibold text-gray-800 mb-2">Indic Languages</h4>
                      <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                        94-97%
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Accuracy with native script support
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200/50">
                      <h4 className="font-semibold text-gray-800 mb-2">European Languages</h4>
                      <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                        95-98%
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Accuracy with excellent punctuation
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-xl border border-rose-200/50">
                      <h4 className="font-semibold text-gray-800 mb-2">Asian Languages</h4>
                      <div className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-rose-700 bg-clip-text text-transparent">
                        93-96%
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Accuracy with tone recognition
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl border border-indigo-200/50">
                      <h4 className="font-semibold text-gray-800 mb-2">African Languages</h4>
                      <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">
                        90-94%
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Accuracy with tone language support
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Model Comparison Chart */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Model Comparison Chart</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Detailed comparison between Pingala V1 English Verbatim and Universal models to help
              you choose the right model for your use case.
            </p>
          </div>

          <Card className="p-6 mb-8">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-3 font-semibold text-gray-700">Feature</th>
                    <th className="text-left py-4 px-3 font-semibold text-blue-700">
                      Pingala V1 English Verbatim
                    </th>
                    <th className="text-left py-4 px-3 font-semibold text-purple-700">
                      Pingala V1 Universal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-3 font-medium text-gray-700">Primary Focus</td>
                    <td className="py-3 px-3">English-only, maximum accuracy</td>
                    <td className="py-3 px-3">Multilingual, broad coverage</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="py-3 px-3 font-medium text-gray-700">Languages Supported</td>
                    <td className="py-3 px-3">English (all regional variants)</td>
                    <td className="py-3 px-3">216 languages</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-3 font-medium text-gray-700">Model Parameters</td>
                    <td className="py-3 px-3">764M parameters</td>
                    <td className="py-3 px-3">809M parameters</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="py-3 px-3 font-medium text-gray-700">Word Error Rate</td>
                    <td className="py-3 px-3 text-green-700 font-semibold">
                      2.94% (English composite)
                    </td>
                    <td className="py-3 px-3">3.10% (English composite)</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-3 font-medium text-gray-700">Performance (L40 GPU)</td>
                    <td className="py-3 px-3 text-blue-700 font-semibold">172x RTFx</td>
                    <td className="py-3 px-3">146x RTFx</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="py-3 px-3 font-medium text-gray-700">Performance (A100)</td>
                    <td className="py-3 px-3 text-blue-700 font-semibold">700+ RTFx</td>
                    <td className="py-3 px-3">680+ RTFx</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-3 font-medium text-gray-700">Model Size</td>
                    <td className="py-3 px-3 text-green-700 font-semibold">~1.5GB (CT2 format)</td>
                    <td className="py-3 px-3">~3GB (Transformer/CT2)</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="py-3 px-3 font-medium text-gray-700">Memory Usage</td>
                    <td className="py-3 px-3 text-green-700">Lower (764M parameters)</td>
                    <td className="py-3 px-3">Slightly higher (809M parameters)</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-3 font-medium text-gray-700">Inference Speed</td>
                    <td className="py-3 px-3 text-blue-700">Faster (optimized architecture)</td>
                    <td className="py-3 px-3">Slightly slower (larger vocabulary)</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="py-3 px-3 font-medium text-gray-700">Accuracy on English</td>
                    <td className="py-3 px-3 text-green-700 font-semibold">Best (specialized)</td>
                    <td className="py-3 px-3">Excellent (generalist)</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-3 font-medium text-gray-700">Regional Variants</td>
                    <td className="py-3 px-3">en, en-US, en-GB, en-IN, etc.</td>
                    <td className="py-3 px-3">Auto-detection across 216 codes</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="py-3 px-3 font-medium text-gray-700">Script Support</td>
                    <td className="py-3 px-3">Latin only</td>
                    <td className="py-3 px-3 text-purple-700 font-semibold">
                      26+ scripts with transliteration
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-3 font-medium text-gray-700">Speaker Diarization</td>
                    <td className="py-3 px-3 text-green-600">✅ Excellent</td>
                    <td className="py-3 px-3 text-green-600">✅ Excellent</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="py-3 px-3 font-medium text-gray-700">Word-level Timestamps</td>
                    <td className="py-3 px-3 text-green-600">✅ High precision</td>
                    <td className="py-3 px-3 text-green-600">✅ High precision</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-3 font-medium text-gray-700">
                      Voice Activity Detection
                    </td>
                    <td className="py-3 px-3 text-green-600">✅ Built-in (CT2)</td>
                    <td className="py-3 px-3 text-green-600">✅ Built-in (CT2)</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="py-3 px-3 font-medium text-gray-700">Recommended Backend</td>
                    <td className="py-3 px-3">CT2 (optimized)</td>
                    <td className="py-3 px-3">CT2 (recommended)</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-3 font-medium text-gray-700">Best Use Cases</td>
                    <td className="py-3 px-3">English podcasts, meetings, calls</td>
                    <td className="py-3 px-3">Global content, multilingual apps</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="py-3 px-3 font-medium text-gray-700">Deployment Complexity</td>
                    <td className="py-3 px-3 text-green-700">Simple (single language)</td>
                    <td className="py-3 px-3">Complex (language detection)</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-3 font-medium text-gray-700">License</td>
                    <td className="py-3 px-3">Shunya Labs RAIL-M</td>
                    <td className="py-3 px-3">Shunya Labs RAIL-M</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="py-3 px-3 font-medium text-gray-700">Commercial Support</td>
                    <td className="py-3 px-3 text-green-600">✅ Available</td>
                    <td className="py-3 px-3 text-green-600">✅ Available</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card className="p-6 border-blue-200 bg-blue-50/30">
              <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-blue-700 font-bold">
                  V
                </span>
                Choose Pingala V1 English Verbatim when:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  You only process English audio content
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Maximum accuracy is critical (legal, medical, financial transcription)
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  You need the fastest processing for English content
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Memory efficiency is important
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  You're building English-focused applications (meetings, calls, podcasts)
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-purple-200 bg-purple-50/30">
              <h3 className="text-xl font-semibold text-purple-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 text-purple-700 font-bold">
                  U
                </span>
                Choose Pingala V1 Universal when:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  You need to support multiple languages
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  Content language varies or is unknown
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  You're building global applications
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  Script transliteration is required
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  You want one model for all languages
                </li>
              </ul>
            </Card>
          </div>

          <Card className="p-6 bg-gradient-to-r from-gray-50 to-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Performance Comparison Summary
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-1">English Accuracy</div>
                <div className="font-bold text-green-700">
                  Verbatim (2.94%) &gt; Universal (3.10%)
                </div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Speed (L40)</div>
                <div className="font-bold text-blue-700">Verbatim (172x) &gt; Universal (146x)</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Parameters</div>
                <div className="font-bold text-green-700">
                  Verbatim (764M) &lt; Universal (809M)
                </div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Language Coverage</div>
                <div className="font-bold text-purple-700">
                  Universal (216 languages) &gt;&gt; Verbatim (English only)
                </div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Memory Usage</div>
                <div className="font-bold text-green-700">
                  Verbatim (1.5GB) &lt; Universal (3GB)
                </div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Complexity</div>
                <div className="font-bold text-green-700">
                  Verbatim (Simple) &lt; Universal (Complex)
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Hardware Requirements */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Hardware Requirements</h2>
          <Card className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-sm text-muted-foreground">Minimum</div>
                  <div className="text-xl font-bold">NVIDIA RTX 4070</div>
                  <div className="text-sm font-medium">12GB VRAM</div>
                </div>

                <div className="p-6 bg-gradient-to-br from-[#1a1947]/10 to-[#2d4cc8]/10 rounded-xl text-center border-2 border-[#2d4cc8]/30 shadow-lg">
                  <div className="text-sm text-gray-600">Recommended</div>
                  <div className="text-xl font-bold bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] bg-clip-text text-transparent">
                    NVIDIA L40
                  </div>
                  <div className="text-sm font-medium text-gray-700">48GB VRAM</div>
                </div>

                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-sm text-muted-foreground">Optimal</div>
                  <div className="text-xl font-bold">NVIDIA A100</div>
                  <div className="text-sm font-medium">80GB VRAM</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">GPU Model</th>
                      <th className="text-left py-2">VRAM</th>
                      <th className="text-left py-2">Verbatim RTFx</th>
                      <th className="text-left py-2">Universal RTFx</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">RTX 4060 Ti</td>
                      <td className="py-2">16GB</td>
                      <td className="py-2">~95x</td>
                      <td className="py-2">~90x</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">RTX 4070</td>
                      <td className="py-2">12GB</td>
                      <td className="py-2">~115x</td>
                      <td className="py-2">~110x</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">RTX 4080</td>
                      <td className="py-2">16GB</td>
                      <td className="py-2">~135x</td>
                      <td className="py-2">~130x</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">RTX 4090</td>
                      <td className="py-2">24GB</td>
                      <td className="py-2">~155x</td>
                      <td className="py-2">~150x</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">L40</td>
                      <td className="py-2">48GB</td>
                      <td className="py-2">~172x*</td>
                      <td className="py-2">~146x*</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">A100 (40GB)</td>
                      <td className="py-2">40GB</td>
                      <td className="py-2">~700x</td>
                      <td className="py-2">~680x</td>
                    </tr>
                    <tr>
                      <td className="py-2">A100 (80GB)</td>
                      <td className="py-2">80GB</td>
                      <td className="py-2">~750x</td>
                      <td className="py-2">~720x</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground">
                *Baseline measurements. RTFx = Real-Time Factor (higher is faster)
              </p>

              {/* Performance Notes */}
              <div className="mt-8 space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance Notes</h3>

                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
                  <h4 className="font-semibold text-gray-800 mb-3">Model Performance Comparison</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2 mt-1">•</span>
                      Both models have very similar parameter counts with minimal performance
                      difference
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2 mt-1">•</span>
                      <strong>Pingala Verbatim:</strong> 172x RTFx on L40 (764M parameters)
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2 mt-1">•</span>
                      <strong>Pingala Universal:</strong> 146x RTFx on L40 (809M parameters)
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2 mt-1">•</span>
                      A100 GPUs achieve 700+ RTFx for both models with proper optimization
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2 mt-1">•</span>
                      Performance difference primarily due to model architecture and multilingual
                      vocabulary overhead
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200/50">
                  <h4 className="font-semibold text-gray-800 mb-3">Optimization Guidelines</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2 mt-1">•</span>
                      RTFx values assume CT2 backend with FP16 precision and optimal batch sizes
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2 mt-1">•</span>
                      For production deployments, we recommend L40 or A100 for consistent
                      high-throughput performance
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/50">
                  <h4 className="font-semibold text-gray-800 mb-3">CPU Performance (Fallback)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Requirements</h5>
                      <ul className="space-y-1 text-gray-700">
                        <li className="flex items-start">
                          <span className="text-gray-500 mr-2 mt-1">•</span>
                          <strong>Minimum:</strong> 8-core CPU, 32GB RAM
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-500 mr-2 mt-1">•</span>
                          <strong>Expected RTFx:</strong> 3-4x
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Use Cases</h5>
                      <ul className="space-y-1 text-gray-700">
                        <li className="flex items-start">
                          <span className="text-gray-500 mr-2 mt-1">•</span>
                          Development and testing
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-500 mr-2 mt-1">•</span>
                          Cost-sensitive deployments
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>
        {/* Installation */}
        <section id="installation" className="mb-8 sm:mb-12 lg:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Python SDK Documentation{' '}
            </h2>
          </div>

          <Card className="p-8 bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/50 shadow-lg">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3"> Installation</h3>
                <p className="text-gray-600 mb-4"> Standard installation with all backends</p>
                <CodeBlock language="bash" code="pip install pingala-shunya" />
              </div>

              <div>
                <h3 className="text-gray-600 mb-4">Development Installation</h3>
                <CodeBlock language="bash" code='pip install "pingala-shunya[complete]"' />
              </div>
            </div>
          </Card>
        </section>

        {/* Quick Start */}
        <section id="quick-start" className="mb-8 sm:mb-12 lg:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Quick Start
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              from pingala_shunya import PingalaTranscriber
            </p>
          </div>

          <Card className="p-8 bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/50 shadow-lg">
            <CodeBlock
              language="python"
              code={`# Initialize with default settings
transcriber = PingalaTranscriber()

# Simple transcription
segments = transcriber.transcribe_file_simple("audio.wav")

for segment in segments:
    print(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}")`}
            />
          </Card>
        </section>

        {/* Advanced Usage */}
        <section id="advanced-usage" className="mb-8 sm:mb-12 lg:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Advanced Usage
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              from pingala_shunya import PingalaTranscriber
            </p>
          </div>

          <Card className="p-8 bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/50 shadow-lg">
            <CodeBlock
              language="python"
              code={`
# Initialize with specific model and backend
transcriber = PingalaTranscriber(
    model_name="shunyalabs/pingala-v1-en-verbatim",
    backend="ct2",  # or "transformers"
    device="cuda",
    compute_type="float16"
)

# Advanced transcription with full features
segments, info = transcriber.transcribe_file(
    "audio.wav",
    beam_size=10,
    word_timestamps=True,
    temperature=0.0,
    vad_filter=True,
    language="en"
)

# Process results
print(f"Language: {info.language} (confidence: {info.language_probability:.3f})")
print(f"Duration: {info.duration:.2f} seconds")

for segment in segments:
    print(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}")
    if hasattr(segment, 'words'):
        for word in segment.words:
            print(f"  '{word.word}' [{word.start:.2f}-{word.end:.2f}s]")`}
            />
          </Card>
        </section>

        {/* Model Selection */}
        <section id="model-selection" className="mb-8 sm:mb-12 lg:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Model Selection
            </h2>
          </div>

          <div className="space-y-8">
            <Card className="p-8 bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/50 shadow-lg">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    English Verbatim (highest accuracy for English) - CT2 Backend Recommended
                  </h4>
                  <CodeBlock
                    language="python"
                    code={`transcriber = PingalaTranscriber(
    model_name="shunyalabs/pingala-v1-en-verbatim",
    backend="ct2"  # Recommended for production
)`}
                  />
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Universal (216 languages) - CT2 Backend Recommended
                  </h4>
                  <CodeBlock
                    language="python"
                    code={`transcriber = PingalaTranscriber(
    model_name="shunyalabs/pingala-v1-universal", 
    backend="ct2"  # Preferred over transformers
)`}
                  />
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Auto-detection with CT2 backend (recommended)
                  </h4>
                  <CodeBlock
                    language="python"
                    code={`transcriber = PingalaTranscriber(backend="ct2")  # Uses CT2 by default`}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/50 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Backend Comparison</h3>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-3 font-semibold text-gray-700">Feature</th>
                      <th className="text-left py-4 px-3 font-semibold text-blue-700">
                        CT2 Backend
                      </th>
                      <th className="text-left py-4 px-3 font-semibold text-purple-700">
                        Transformers Backend
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-3 font-medium text-gray-700">Performance</td>
                      <td className="py-3 px-3 text-blue-700 font-semibold">
                        Fastest (CTranslate2)
                      </td>
                      <td className="py-3 px-3">Good (PyTorch)</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <td className="py-3 px-3 font-medium text-gray-700">Memory Usage</td>
                      <td className="py-3 px-3 text-blue-700 font-semibold">Lowest</td>
                      <td className="py-3 px-3">Moderate</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-3 font-medium text-gray-700">Word Timestamps</td>
                      <td className="py-3 px-3 text-green-600">Full support</td>
                      <td className="py-3 px-3">Basic support</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <td className="py-3 px-3 font-medium text-gray-700">VAD Filtering</td>
                      <td className="py-3 px-3 text-green-600">Built-in</td>
                      <td className="py-3 px-3 text-red-600">No</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-3 font-medium text-gray-700">Streaming</td>
                      <td className="py-3 px-3 text-green-600">Real-time</td>
                      <td className="py-3 px-3">Batch only</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <td className="py-3 px-3 font-medium text-gray-700">Model Support</td>
                      <td className="py-3 px-3 text-blue-700">CT2 format (Preferred)</td>
                      <td className="py-3 px-3">Any HF model</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-3 font-medium text-gray-700">Production Ready</td>
                      <td className="py-3 px-3 text-green-600">✅ Recommended</td>
                      <td className="py-3 px-3">Development/Research</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="py-3 px-3 font-medium text-gray-700">Pingala Models</td>
                      <td className="py-3 px-3 text-green-600">✅ Optimized</td>
                      <td className="py-3 px-3">Supported</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </section>

        {/* Language Support */}
        <section id="language-support" className="mb-8 sm:mb-12 lg:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Language Support
            </h2>
            <p className="text-lg font-semibold text-gray-600 max-w-2xl mx-auto">
              Complete Language Coverage (216 languages)
            </p>
          </div>

          <div className="space-y-8">
            <Card className="p-8 bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/50 shadow-lg">
              <Accordion type="single" collapsible className="w-full">
                {/* Indic Languages */}
                <AccordionItem value="indic" className="border-b border-gray-200">
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                        <span className="text-amber-700 font-bold text-sm">IN</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-amber-800">
                          Indic Languages (42 languages)
                        </h3>
                        <p className="text-sm text-gray-600">
                          Hindi, Bengali, Tamil, Marathi, Telugu, Kannada, Gujarati, Malayalam,
                          Urdu, Punjabi, Nepali, and 31+ regional languages
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div className="space-y-4">
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <div className="font-medium text-gray-700">Available Languages:</div>
                            <table className="min-w-[200px] text-sm text-gray-600 border border-gray-200 rounded">
                              <thead>
                                <tr>
                                  <th className="px-2 py-1 text-left font-semibold">Language</th>
                                  <th className="px-2 py-1 text-left font-semibold">Code</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="px-2 py-1">Hindi</td>
                                  <td className="px-2 py-1">hi</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Bengali</td>
                                  <td className="px-2 py-1">bn (bn-IN, bn-BD)</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Tamil</td>
                                  <td className="px-2 py-1">ta</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Marathi</td>
                                  <td className="px-2 py-1">mr</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Telugu</td>
                                  <td className="px-2 py-1">te</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Kannada</td>
                                  <td className="px-2 py-1">kn</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Gujarati</td>
                                  <td className="px-2 py-1">gu</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Malayalam</td>
                                  <td className="px-2 py-1">ml</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Urdu</td>
                                  <td className="px-2 py-1">ur</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Punjabi</td>
                                  <td className="px-2 py-1">pa</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Nepali</td>
                                  <td className="px-2 py-1">ne</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1 italic text-gray-400" colSpan={2}>
                                    and 31+ regional languages
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="space-y-2">
                            <div className="font-medium text-gray-700">Scripts:</div>
                            <ul className="space-y-1 text-sm text-gray-600">
                              <li>Devanagari</li>
                              <li>Bengali</li>
                              <li>Tamil</li>
                              <li>Telugu</li>
                              <li>Kannada</li>
                              <li>Malayalam</li>
                              <li>Gujarati</li>
                              <li>Gurmukhi</li>
                              <li>Arabic (for Urdu)</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* European Languages */}
                <AccordionItem value="european" className="border-b border-gray-200">
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-700 font-bold text-sm">EU</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-800">
                          European Languages (52 languages)
                        </h3>
                        <p className="text-sm text-gray-600">
                          English variants, French variants, Spanish variants, German, Italian,
                          Russian, and 40+ others
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div className="space-y-4">
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <div className="font-medium text-gray-700">Available Languages:</div>
                            <table className="min-w-[200px] text-sm text-gray-600 border border-gray-200 rounded">
                              <thead>
                                <tr>
                                  <th className="px-2 py-1 text-left font-semibold">Language</th>
                                  <th className="px-2 py-1 text-left font-semibold">Code</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="px-2 py-1">English variants</td>
                                  <td className="px-2 py-1">en, en-US, en-GB, en-IN, etc.</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">French variants</td>
                                  <td className="px-2 py-1">fr, fr-FR, fr-CA, etc.</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Spanish variants</td>
                                  <td className="px-2 py-1">es, es-ES, es-MX, etc.</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">German</td>
                                  <td className="px-2 py-1">de</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Italian</td>
                                  <td className="px-2 py-1">it</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Russian</td>
                                  <td className="px-2 py-1">ru</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1 italic text-gray-400" colSpan={2}>
                                    and 40+ others
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="space-y-2">
                            <div className="font-medium text-gray-700">Scripts:</div>
                            <ul className="space-y-1 text-sm text-gray-600">
                              <li>Latin</li>
                              <li>Cyrillic</li>
                              <li>Greek</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Asian Languages */}
                <AccordionItem value="asian" className="border-b border-gray-200">
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-700 font-bold text-sm">AS</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-purple-800">
                          Asian Languages (51 languages)
                        </h3>
                        <p className="text-sm text-gray-600">
                          Chinese variants, Japanese, Korean, Vietnamese, Thai, Indonesian, Tagalog,
                          and 44+ others
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div className="space-y-4">
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <div className="font-medium text-gray-700">Available Languages:</div>
                            <table className="min-w-[200px] text-sm text-gray-600 border border-gray-200 rounded">
                              <thead>
                                <tr>
                                  <th className="px-2 py-1 text-left font-semibold">Language</th>
                                  <th className="px-2 py-1 text-left font-semibold">Code</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="px-2 py-1">Chinese variants</td>
                                  <td className="px-2 py-1">zh, zh-CN, zh-HK</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Japanese</td>
                                  <td className="px-2 py-1">ja</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Korean</td>
                                  <td className="px-2 py-1">ko</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Vietnamese</td>
                                  <td className="px-2 py-1">vi</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Thai</td>
                                  <td className="px-2 py-1">th</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Indonesian</td>
                                  <td className="px-2 py-1">id</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Tagalog</td>
                                  <td className="px-2 py-1">tl</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1 italic text-gray-400" colSpan={2}>
                                    and 44+ others
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="space-y-2">
                            <div className="font-medium text-gray-700">Scripts:</div>
                            <ul className="space-y-1 text-sm text-gray-600">
                              <li>Chinese</li>
                              <li>Japanese</li>
                              <li>Korean</li>
                              <li>Thai</li>
                              <li>Latin</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* African Languages */}
                <AccordionItem value="african" className="border-b border-gray-200">
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-700 font-bold text-sm">AF</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-green-800">
                          African Languages (50 languages)
                        </h3>
                        <p className="text-sm text-gray-600">
                          Swahili, Hausa, Yoruba, Igbo, Amharic, Arabic variants, and 44+ others
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div className="space-y-4">
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <div className="font-medium text-gray-700">Available Languages:</div>
                            <table className="min-w-[200px] text-sm text-gray-600 border border-gray-200 rounded">
                              <thead>
                                <tr>
                                  <th className="px-2 py-1 text-left font-semibold">Language</th>
                                  <th className="px-2 py-1 text-left font-semibold">Code</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="px-2 py-1">Swahili</td>
                                  <td className="px-2 py-1">sw</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Hausa</td>
                                  <td className="px-2 py-1">ha</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Yoruba</td>
                                  <td className="px-2 py-1">yo</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Igbo</td>
                                  <td className="px-2 py-1">ig</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Amharic</td>
                                  <td className="px-2 py-1">am</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Arabic variants</td>
                                  <td className="px-2 py-1">ar, ar-EG, ar-AE, etc.</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1 italic text-gray-400" colSpan={2}>
                                    and 44+ others
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="space-y-2">
                            <div className="font-medium text-gray-700">Scripts:</div>
                            <ul className="space-y-1 text-sm text-gray-600">
                              <li>Latin</li>
                              <li>Arabic</li>
                              <li>Ethiopic</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Middle Eastern Languages */}
                <AccordionItem value="middle-eastern" className="border-b border-gray-200">
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-red-700 font-bold text-sm">ME</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-red-800">
                          Middle Eastern Languages (24 languages)
                        </h3>
                        <p className="text-sm text-gray-600">
                          Arabic variants, Hebrew, Persian, Turkish, Kurdish variants, and 15+
                          others
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div className="space-y-4">
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <div className="font-medium text-gray-700">Available Languages:</div>
                            <table className="min-w-[200px] text-sm text-gray-600 border border-gray-200 rounded">
                              <thead>
                                <tr>
                                  <th className="px-2 py-1 text-left font-semibold">Language</th>
                                  <th className="px-2 py-1 text-left font-semibold">Code</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="px-2 py-1">Arabic variants</td>
                                  <td className="px-2 py-1">ar, ar-EG, ar-AE, etc.</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Hebrew</td>
                                  <td className="px-2 py-1">he</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Persian</td>
                                  <td className="px-2 py-1">fa</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Turkish</td>
                                  <td className="px-2 py-1">tr</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Kurdish variants</td>
                                  <td className="px-2 py-1">-</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1 italic text-gray-400" colSpan={2}>
                                    and 15+ others
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="space-y-2">
                            <div className="font-medium text-gray-700">Scripts:</div>
                            <ul className="space-y-1 text-sm text-gray-600">
                              <li>Arabic</li>
                              <li>Hebrew</li>
                              <li>Latin</li>
                              <li>Cyrillic</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* American Languages */}
                <AccordionItem value="american" className="border-b border-gray-200">
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <span className="text-indigo-700 font-bold text-sm">AM</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-indigo-800">
                          American Languages (25 languages)
                        </h3>
                        <p className="text-sm text-gray-600">
                          Spanish variants, Portuguese variants, Quechua, Guarani, Maya languages,
                          and indigenous languages
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div className="space-y-4">
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <div className="font-medium text-gray-700">Available Languages:</div>
                            <table className="min-w-[200px] text-sm text-gray-600 border border-gray-200 rounded">
                              <thead>
                                <tr>
                                  <th className="px-2 py-1 text-left font-semibold">Language</th>
                                  <th className="px-2 py-1 text-left font-semibold">Code</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="px-2 py-1">Spanish variants</td>
                                  <td className="px-2 py-1">-</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Portuguese variants</td>
                                  <td className="px-2 py-1">-</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Quechua</td>
                                  <td className="px-2 py-1">qu</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Guarani</td>
                                  <td className="px-2 py-1">gn</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1">Maya languages</td>
                                  <td className="px-2 py-1">-</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1 italic text-gray-400" colSpan={2}>
                                    and indigenous languages
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="space-y-2">
                            <div className="font-medium text-gray-700">Scripts:</div>
                            <ul className="space-y-1 text-sm text-gray-600">
                              <li>Latin</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/50 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Usage Examples</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Auto-detection (works with any supported language)
                  </h4>
                  <CodeBlock
                    language="python"
                    code={`segments = transcriber.transcribe_file_simple("multilingual_audio.wav", 
                                             language_code="auto")`}
                  />
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Specific language with script conversion
                  </h4>
                  <CodeBlock
                    language="python"
                    code={`segments = transcriber.transcribe_file("hindi_audio.wav",
                                     language="hi",
                                     output_script="Latin")  # Convert to Roman`}
                  />
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Regional variants for better accuracy
                  </h4>
                  <CodeBlock
                    language="python"
                    code={`segments = transcriber.transcribe_file("mexican_spanish.wav",
                                     language="es-MX")  # Mexican Spanish`}
                  />
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Script Transliteration */}
        <section id="script-transliteration" className="mb-8 sm:mb-12 lg:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Script Transliteration
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Convert transcribed text between 26+ writing systems
            </p>
          </div>

          <div className="space-y-8">
            <Card className="p-8 bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/50 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Supported Scripts</h3>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-3 font-semibold text-gray-700">Script</th>
                      <th className="text-left py-4 px-3 font-semibold text-gray-700">Code</th>
                      <th className="text-left py-4 px-3 font-semibold text-gray-700">Languages</th>
                      <th className="text-left py-4 px-3 font-semibold text-gray-700">
                        Example Output
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-3 font-medium text-gray-700">Latin</td>
                      <td className="py-3 px-3">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          Latin
                        </Badge>
                      </td>
                      <td className="py-3 px-3">216 languages</td>
                      <td className="py-3 px-3 text-blue-600 font-mono">
                        "namaste, kaise hain aap"
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <td className="py-3 px-3 font-medium text-gray-700">Arabic</td>
                      <td className="py-3 px-3">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          Arabic
                        </Badge>
                      </td>
                      <td className="py-3 px-3">Arabic, Persian, Urdu</td>
                      <td className="py-3 px-3 text-green-600 font-mono">"مرحبا كيف حالك"</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-3 font-medium text-gray-700">Devanagari</td>
                      <td className="py-3 px-3">
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200"
                        >
                          Devanagari
                        </Badge>
                      </td>
                      <td className="py-3 px-3">Hindi, Marathi, Nepali</td>
                      <td className="py-3 px-3 text-amber-600 font-mono">"नमस्ते, कैसे हैं आप"</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <td className="py-3 px-3 font-medium text-gray-700">Chinese</td>
                      <td className="py-3 px-3">
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-700 border-purple-200"
                        >
                          Chinese
                        </Badge>
                      </td>
                      <td className="py-3 px-3">Mandarin, Cantonese</td>
                      <td className="py-3 px-3 text-purple-600 font-mono">"你好，你好吗"</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-3 font-medium text-gray-700">Cyrillic</td>
                      <td className="py-3 px-3">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Cyrillic
                        </Badge>
                      </td>
                      <td className="py-3 px-3">Russian, Bulgarian</td>
                      <td className="py-3 px-3 text-red-600 font-mono">"Привет, как дела"</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <td className="py-3 px-3 font-medium text-gray-700">Bengali</td>
                      <td className="py-3 px-3">
                        <Badge
                          variant="outline"
                          className="bg-indigo-50 text-indigo-700 border-indigo-200"
                        >
                          Bengali
                        </Badge>
                      </td>
                      <td className="py-3 px-3">Bengali, Assamese</td>
                      <td className="py-3 px-3 text-indigo-600 font-mono">"নমস্কার, কেমন আছেন"</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="py-3 px-3 font-medium text-gray-700">Tamil</td>
                      <td className="py-3 px-3">
                        <Badge
                          variant="outline"
                          className="bg-teal-50 text-teal-700 border-teal-200"
                        >
                          Tamil
                        </Badge>
                      </td>
                      <td className="py-3 px-3">Tamil</td>
                      <td className="py-3 px-3 text-teal-600 font-mono">
                        "வணக்கம், எப்படி இருக்கிறீர்கள்"
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/50 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Transliteration Examples</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Hindi to Latin script
                  </h4>
                  <CodeBlock
                    language="python"
                    code={`result = transcriber.transcribe_file("hindi.wav",
                                   language="hi",
                                   output_script="Latin")
# Output: "namaste, main theek hun"`}
                  />
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Arabic to Latin script
                  </h4>
                  <CodeBlock
                    language="python"
                    code={`result = transcriber.transcribe_file("arabic.wav",
                                   language="ar",
                                   output_script="Latin")
# Output: "ahlan wa sahlan, kayf halak"`}
                  />
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Auto-detect language, convert to Latin
                  </h4>
                  <CodeBlock
                    language="python"
                    code={`result = transcriber.transcribe_file("unknown.wav",
                                   language="auto",
                                   output_script="Latin")`}
                  />
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Performance Optimization */}
        <section id="performance-optimization" className="mb-8 sm:mb-12 lg:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Performance Optimization
            </h2>
          </div>

          <div className="space-y-8">
            <Card className="p-8 bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/50 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">GPU Optimization</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Maximum performance with CT2 backend (Recommended)
                  </h4>
                  <CodeBlock
                    language="python"
                    code={`# Maximum performance with CT2 backend (Recommended)
transcriber = PingalaTranscriber(
    model_name="shunyalabs/pingala-v1-en-verbatim",
    device="cuda",
    compute_type="float16",  # Fastest inference
    backend="ct2"  # Always prefer CT2 for production
)`}
                  />
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Memory-efficient CT2 setup for smaller GPUs
                  </h4>
                  <CodeBlock
                    language="python"
                    code={`# Memory-efficient CT2 setup for smaller GPUs
transcriber = PingalaTranscriber(
    device="cuda",
    compute_type="int8_float16",  # Reduces VRAM by ~40%
    backend="ct2"  # CT2 handles quantization better
)`}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/50 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Batch Processing</h3>

              <div>
                <CodeBlock
                  language="python"
                  code={`# Process multiple files efficiently
audio_files = ["file1.wav", "file2.wav", "file3.wav"]

for audio_file in audio_files:
    segments, info = transcriber.transcribe_file(
        audio_file,
        batch_size=8,  # Process multiple segments in parallel
        beam_size=5
    )
    # Process results...`}
                />
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/50 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Real-Time Processing</h3>

              <div className="space-y-6">
                <div>
                  <CodeBlock
                    language="python"
                    code={`# Optimized for real-time applications with CT2 backend
transcriber = PingalaTranscriber(
    model_name="shunyalabs/pingala-v1-en-verbatim",
    device="cuda",
    compute_type="float16",
    backend="ct2"  # CT2 provides superior real-time performance

# Enable VAD for real-time filtering (CT2 only)
  segments, info = transcriber.transcribe_file(
      "live_audio.wav",
      vad_filter=True,          # CT2 exclusive feature
      beam_size=1,              # Faster but less accurate
      temperature=0.0,          # Deterministic output
      chunk_size=30             # Smaller chunks for lower latency
)`}
                  />
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Command Line Interface */}
        <section id="command-line-interface" className="mb-8 sm:mb-12 lg:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Command Line Interface
            </h2>
            <p className="text-lg font-semibold text-gray-600 max-w-2xl mx-auto">
              The Python SDK includes a comprehensive CLI
            </p>
          </div>

          <Card className="p-8 bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/50 shadow-lg">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Basic transcription</h4>
                <CodeBlock language="bash" code={`pingala audio.wav`} />
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Specify model and backend
                </h4>
                <CodeBlock
                  language="bash"
                  code={`pingala audio.wav --model shunyalabs/pingala-v1-en-verbatim --backend ct2`}
                />
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Word-level timestamps with speaker identification
                </h4>
                <CodeBlock
                  language="bash"
                  code={`pingala audio.wav --word-timestamps --show-confidence`}
                />
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Multi-language with script conversion
                </h4>
                <CodeBlock
                  language="bash"
                  code={`pingala multilingual.wav --language auto --output-script Latin`}
                />
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Real-time optimized</h4>
                <CodeBlock
                  language="bash"
                  code={`pingala audio.wav --vad --beam-size 1 --device cuda`}
                />
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Generate subtitles</h4>
                <CodeBlock
                  language="bash"
                  code={`pingala video.mp4 --format srt -o subtitles.srt`}
                />
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-600 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">Full CLI Options</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      For complete documentation of all available CLI options and parameters, run:
                    </p>
                    <div className="mt-2">
                      <CodeBlock language="bash" code="pingala --help" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Hugging Face Integration */}
        <section id="hugging-face-integration" className="mb-8 sm:mb-12 lg:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Hugging Face Integration
            </h2>
          </div>

          <div className="space-y-8">
            <Card className="p-8 bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/50 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Direct Model Access</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Download and use models directly
                  </h4>
                  <CodeBlock
                    language="python"
                    code={`# Download and use models directly
from transformers import WhisperForConditionalGeneration, WhisperProcessor


# Load Pingala V1 Universal
model = WhisperForConditionalGeneration.from_pretrained(
    "shunyalabs/pingala-v1-universal"
)
processor = WhisperProcessor.from_pretrained(
    "shunyalabs/pingala-v1-universal"


# Load Pingala V1 English Verbatim (CT2 format)
from faster_whisper import WhisperModel

model = WhisperModel("shunyalabs/pingala-v1-en-verbatim
)`}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/50 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Authentication Setup</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Method 1: Environment variable
                  </h4>
                  <CodeBlock
                    language="bash"
                    code={`export HUGGINGFACE_HUB_TOKEN="hf_your_token_here"`}
                  />
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Method 2: CLI login</h4>
                  <CodeBlock language="bash" code={`huggingface-cli login`} />
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Method 3: Programmatic
                  </h4>
                  <CodeBlock
                    language="python"
                    code={`python -c "from huggingface_hub import login; login('hf_your_token')"`}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/50 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Model Specifications</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-blue-50/50 rounded-xl border border-blue-200/50">
                  <h4 className="text-lg font-semibold text-blue-800 mb-4">
                    Pingala V1 English Verbatim
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      <strong>Architecture:</strong> CTranslate2 optimized Whisper
                    </li>
                    <li>
                      <strong>Format:</strong> CT2 format for faster-whisper
                    </li>
                    <li>
                      <strong>Languages:</strong> English (all variants)
                    </li>
                    <li>
                      <strong>File Size:</strong> ~1.5GB
                    </li>
                    <li>
                      <strong>Optimization:</strong> Maximum accuracy, real-time inference
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-purple-50/50 rounded-xl border border-purple-200/50">
                  <h4 className="text-lg font-semibold text-purple-800 mb-4">
                    Pingala V1 Universal
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      <strong>Architecture:</strong> Transformer-based multilingual model
                    </li>
                    <li>
                      <strong>Format:</strong> PyTorch/Safetensors
                    </li>
                    <li>
                      <strong>Languages:</strong> 216 languages
                    </li>
                    <li>
                      <strong>File Size:</strong> ~3GB
                    </li>
                    <li>
                      <strong>Optimization:</strong> Balanced performance across languages
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Production Deployment */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Production Deployment</h2>

          {/* Scalability Considerations */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Scalability Considerations</h3>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-3">Single Instance Performance:</h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>L40 GPU: ~15x real-time for Verbatim, ~146x for Universal</li>
                <li>Concurrent streams: 4-8 depending on audio length</li>
                <li>Memory usage: 4-8GB VRAM per model instance</li>
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-3">Multi-Instance Deployment:</h4>
              <CodeBlock
                language="python"
                code={`# Load balancer approach
import asyncio
from concurrent.futures import ThreadPoolExecutor

class TranscriptionService:
    def __init__(self, num_workers=4):
        self.workers = [
            PingalaTranscriber(device=f"cuda:{i}")
            for i in range(num_workers)
        ]
        self.executor = ThreadPoolExecutor(max_workers=num_workers)
    
    async def transcribe_async(self, audio_file):
        loop = asyncio.get_event_loop()
        worker = self.workers[hash(audio_file) % len(self.workers)]
        return await loop.run_in_executor(
            self.executor, 
            worker.transcribe_file_simple, 
            audio_file
        )`}
              />
            </div>
          </div>

          {/* Docker Deployment */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Docker Deployment</h3>
            <CodeBlock
              language="dockerfile"
              code={`# Dockerfile
FROM nvidia/cuda:12.1-cudnn8-runtime-ubuntu22.04

RUN pip install pingala-shunya torch torchaudio --index-url https://download.pytorch.org/whl/cu121

COPY app.py .
CMD ["python", "app.py"]`}
            />
          </div>

          {/* Kubernetes Scaling */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Kubernetes Scaling</h3>
            <CodeBlock
              language="yaml"
              code={`# Kubernetes Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: transcription-service
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: transcription
        image: your-registry/transcription:latest
        resources:
          limits:
            nvidia.com/gpu: 1
            memory: "16Gi"
          requests:
            nvidia.com/gpu: 1 
            memory: "8Gi"`}
            />
          </div>
        </section>

        {/* Error Handling and Troubleshooting */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Error Handling and Troubleshooting</h2>

          {/* Common Issues */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Common Issues</h3>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-3">CUDA Out of Memory:</h4>
              <CodeBlock
                language="python"
                code={`# Solution: Use memory-efficient settings
transcriber = PingalaTranscriber(
    compute_type="int8_float16",  # Reduces memory by ~40%
    device="cuda"
)`}
              />
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-3">Model Download Issues:</h4>
              <CodeBlock
                language="python"
                code={`# Solution: Use local model cache
import os
os.environ["HF_HOME"] = "/path/to/cache"

# Or use local model path
transcriber = PingalaTranscriber(
    model_name="/path/to/local/model"
)`}
              />
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-3">Audio Format Issues:</h4>
              <CodeBlock
                language="python"
                code={`# Solution: Ensure proper audio preprocessing
import librosa

# Load and resample audio
audio, sr = librosa.load("audio.wav", sr=16000)
# Save resampled audio or pass numpy array directly`}
              />
            </div>
          </div>

          {/* Performance Debugging */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Performance Debugging</h3>
            <CodeBlock
              language="python"
              code={`# Performance monitoring
# Enable verbose logging
import logging
logging.basicConfig(level=logging.INFO)

# Monitor performance
import time
start_time = time.time()
segments, info = transcriber.transcribe_file("audio.wav")
processing_time = time.time() - start_time
rtf = info.duration / processing_time

print(f"Audio duration: {info.duration:.2f}s")
print(f"Processing time: {processing_time:.2f}s") 
print(f"Real-time factor: {rtf:.1f}x")`}
            />
          </div>
        </section>

        {/* Licensing & Support */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Licensing & Support</h2>

          {/* License Options */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">License Options</h3>
            <Card className="p-6">
              <h4 className="text-lg font-medium mb-4">Shunya Labs RAIL-M License:</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">
                    Free tier
                  </Badge>
                  <span>Up to 10,000 hours of audio transcription per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">
                    Attribution
                  </Badge>
                  <span>Attribution required when outputs are public</span>
                </li>
                <li className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">
                    Restriction
                  </Badge>
                  <span>No redistribution of models allowed</span>
                </li>
                <li className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">
                    Commercial
                  </Badge>
                  <span>Commercial licensing available for enterprise use</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Support Channels */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Support Channels</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://shunyalabs.ai/documentation"
                className="block p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="font-medium">Documentation</div>
                <div className="text-sm text-muted-foreground">shunyalabs.ai/documentation</div>
              </a>
              <a
                href="https://shunyalabs.ai/api"
                className="block p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="font-medium">API Reference</div>
                <div className="text-sm text-muted-foreground">shunyalabs.ai/api</div>
              </a>
              <a
                href="https://pypi.org/project/pingala-shunya"
                className="block p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="font-medium">Python SDK</div>
                <div className="text-sm text-muted-foreground">pypi.org/project/pingala-shunya</div>
              </a>
              <a
                href="https://huggingface.co/shunyalabs"
                className="block p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="font-medium">Models</div>
                <div className="text-sm text-muted-foreground">huggingface.co/shunyalabs</div>
              </a>
              <a
                href="mailto:0@shunyalabs.ai"
                className="block p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="font-medium">Commercial Support</div>
                <div className="text-sm text-muted-foreground">0@shunyalabs.ai</div>
              </a>
              <a
                href="mailto:0@shunyalabs.ai"
                className="block p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="font-medium">Technical Issues</div>
                <div className="text-sm text-muted-foreground">0@shunyalabs.ai</div>
              </a>
            </div>
          </div>

          {/* Getting Started */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Getting Started</h3>
            <Card className="p-6">
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Choose your integration method (Cloud API, Python SDK, or HF Models)</li>
                <li>Request access by emailing 0@shunyalabs.ai</li>
                <li>Install dependencies and configure your environment</li>
                <li>Start transcribing with our comprehensive examples</li>
                <li>Scale to production using our deployment guides</li>
              </ol>
            </Card>
          </div>

          {/* Call to Action */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <p className="text-lg text-gray-800">
              Ready to integrate state-of-the-art speech recognition into your application? Choose
              the option that best fits your needs and start building today.
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default DeveloperDocumentation;
