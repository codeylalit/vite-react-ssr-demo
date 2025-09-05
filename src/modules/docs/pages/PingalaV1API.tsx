import React, { useEffect, useRef, useState } from 'react';
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
import {
  Code,
  ExternalLink,
  Copy,
  CheckCircle,
  Globe,
  Users,
  FileText,
  Settings,
  Shield,
  AlertTriangle,
  Zap,
  Monitor,
} from 'lucide-react';
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

const PingalaV1API = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16 max-w-7xl">
        {/* Hero Header */}
        <div className="relative space-y-3 sm:space-y-4 md:space-y-6 text-center mb-6 sm:mb-8 md:mb-10">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#1a1947]/10 via-[#2d4cc8]/8 to-[#4c7cf0]/5 rounded-xl sm:rounded-2xl md:rounded-3xl blur-xl sm:blur-2xl md:blur-3xl"></div>
          <div className="absolute inset-0 -z-20 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-indigo-50/50 rounded-xl sm:rounded-2xl md:rounded-3xl"></div>

          <div className="space-y-2 sm:space-y-3 md:space-y-5">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] bg-clip-text text-transparent px-2"
              style={{ lineHeight: '2' }}
            >
              Pingala V1 API
            </h1>
            <h2 className="text-base sm:text-lg md:text-xl text-gray-700 font-medium">
              Developer Documentation
            </h2>
          </div>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-2 sm:px-4">
            Transform audio and video into accurate text with our AI-powered transcription service,
            which supports 216 languages, speaker diarization, and script transliteration.
          </p>

          <div className="flex items-center justify-center mt-3 sm:mt-4 w-full">
            <div className="flex flex-row items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-full text-xs sm:text-sm bg-white/50 backdrop-blur-sm">
              <span className="text-gray-700 font-medium whitespace-nowrap flex items-center">
                Base URL:
              </span>
              <a
                href="https://asr.shunyalabs.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-800 font-medium break-all hover:text-blue-600 transition-colors flex items-center"
              >
                https://asr.shunyalabs.ai
              </a>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <Card className="p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Quick Start</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
            Get started with just a few lines of code:
          </p>

          <CodeBlock
            language="bash"
            code={`curl -X POST "https://asr.shunyalabs.ai/transcribe" \\
  -H "x-user-id: YOUR_API_KEY" \\
  -F "audio=@audio.mp3;type=audio/mpeg" \\
  -F "language_code=en" \\
  -F "enable_diarization=true"`}
          />
        </Card>

        {/* What This API Does */}
        <Card className="p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
            What This API Does
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
            This transcription service handles the heavy lifting of converting spoken audio into
            structured text. Whether you're building a podcast platform, meeting transcription tool,
            or multilingual content management system, this API provides production-ready speech
            recognition capabilities.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
            The service automatically identifies different speakers, handles multiple languages, and
            can even transliterate text between different writing systems. Files up to 1GB are
            processed efficiently through intelligent chunking.
          </p>
        </Card>

        {/* Core Capabilities */}
        <Card className="p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
            Core Capabilities
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start gap-2 sm:gap-3">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                    Multi-language Processing
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Support for major world languages including English, Bengali, Hindi, Spanish,
                    French, German, Chinese, Japanese, Arabic, and many more. The auto-detection
                    feature automatically identifies the language if you're unsure about what you're
                    working with.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                    Speaker Identification
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Automatically identify and separate different speakers in your audio. Each
                    segment comes back labelled with speaker identifiers, making it easy to build
                    conversation analysis tools or meeting summaries.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                    Script Conversion
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Convert transcribed text between writing systems. For example, transcribe Hindi
                    audio and get the output in Latin script, or convert Arabic text to Roman
                    characters. Particularly useful for international applications.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start gap-2 sm:gap-3">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                    Flexible File Support
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Process both audio files (MP3, WAV, FLAC, etc.) and video files (MP4, MOV, AVI,
                    etc.). The service extracts audio from video automatically, so you can work with
                    whatever format your users upload.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                    Smart Processing
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Large files are automatically split into optimal chunks for better accuracy and
                    performance. You don't need to worry about preprocessing - just send the file
                    and get results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* API Reference */}
        <Card className="p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
            API Reference
          </h2>

          <Tabs defaultValue="authentication" className="w-full">
            <ScrollArea className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 text-xs h-auto p-1 gap-1">
                <TabsTrigger value="authentication" className="text-xs px-2 py-2 whitespace-nowrap">
                  Auth
                </TabsTrigger>
                <TabsTrigger value="transcribe" className="text-xs px-2 py-2 whitespace-nowrap">
                  Transcribe
                </TabsTrigger>
                <TabsTrigger value="web-apps" className="text-xs px-2 py-2 whitespace-nowrap">
                  Web Apps
                </TabsTrigger>
                <TabsTrigger value="languages" className="text-xs px-2 py-2 whitespace-nowrap">
                  Languages
                </TabsTrigger>
                <TabsTrigger value="examples" className="text-xs px-2 py-2 whitespace-nowrap">
                  Examples
                </TabsTrigger>
                <TabsTrigger value="errors" className="text-xs px-2 py-2 whitespace-nowrap">
                  Errors
                </TabsTrigger>
                <TabsTrigger value="support" className="text-xs px-2 py-2 whitespace-nowrap">
                  Support
                </TabsTrigger>
              </TabsList>
            </ScrollArea>

            <TabsContent value="authentication" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Authentication</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  We support two authentication methods depending on your use case.
                </p>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h4 className="text-base sm:text-lg font-medium mb-2 sm:mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      <span className="text-sm sm:text-base">
                        API Key Authentication (Recommended for Servers)
                      </span>
                    </h4>
                    <p className="text-gray-600 mb-2 sm:mb-3 text-sm sm:text-base">
                      This is the straightforward approach for backend services and server-to-server
                      integrations. Include your API key in the x-user-id header with every request.
                    </p>
                    <CodeBlock language="bash" code={`x-user-id: YOUR_API_KEY`} />
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-medium mb-2 sm:mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      <span className="text-sm sm:text-base">
                        JWT Bearer Token (For Web Applications)
                      </span>
                    </h4>
                    <p className="text-gray-600 mb-2 sm:mb-3 text-sm sm:text-base">
                      For frontend applications where you can't expose API keys directly to
                      browsers, use JWT tokens. These are temporary tokens you generate on your
                      backend and pass to your frontend code.
                    </p>
                    <CodeBlock language="bash" code={`Authorization: Bearer <jwt_token>`} />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="transcribe" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  Main Transcription Endpoint
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    <span className="font-medium text-blue-900 text-sm sm:text-base">POST</span>
                    <code className="text-blue-800 text-sm sm:text-base">/transcribe</code>
                  </div>
                  <p className="text-blue-700 text-xs sm:text-sm">
                    This is where the magic happens. Send an audio or video file and get back
                    structured transcription data with timing information and speaker
                    identification.
                  </p>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h4 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
                      Required Parameters
                    </h4>
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                      <div className="min-w-[600px] sm:min-w-0">
                        <table className="w-full border-collapse border border-gray-300 text-xs sm:text-sm">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left font-medium">
                                Parameter
                              </th>
                              <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left font-medium">
                                Type
                              </th>
                              <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left font-medium">
                                Description
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-300 px-2 sm:px-4 py-2 font-mono text-blue-600">
                                audio
                              </td>
                              <td className="border border-gray-300 px-2 sm:px-4 py-2">File</td>
                              <td className="border border-gray-300 px-2 sm:px-4 py-2">
                                The audio or video file you want transcribed
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
                      Optional Parameters
                    </h4>
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                      <div className="min-w-[800px] sm:min-w-0">
                        <table className="w-full border-collapse border border-gray-300 text-xs sm:text-sm">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left font-medium">
                                Parameter
                              </th>
                              <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left font-medium">
                                Type
                              </th>
                              <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left font-medium">
                                Default
                              </th>
                              <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left font-medium">
                                Description
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-300 px-2 sm:px-4 py-2 font-mono text-blue-600">
                                language_code
                              </td>
                              <td className="border border-gray-300 px-2 sm:px-4 py-2">String</td>
                              <td className="border border-gray-300 px-2 sm:px-4 py-2 font-mono text-green-600">
                                "auto"
                              </td>
                              <td className="border border-gray-300 px-2 sm:px-4 py-2">
                                Specific language code or let the system detect automatically
                              </td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-2 sm:px-4 py-2 font-mono text-blue-600">
                                enable_diarization
                              </td>
                              <td className="border border-gray-300 px-2 sm:px-4 py-2">Boolean</td>
                              <td className="border border-gray-300 px-2 sm:px-4 py-2 font-mono text-green-600">
                                true
                              </td>
                              <td className="border border-gray-300 px-2 sm:px-4 py-2">
                                Whether to identify different speakers
                              </td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-2 sm:px-4 py-2 font-mono text-blue-600">
                                output_script
                              </td>
                              <td className="border border-gray-300 px-2 sm:px-4 py-2">String</td>
                              <td className="border border-gray-300 px-2 sm:px-4 py-2 font-mono text-green-600">
                                "auto"
                              </td>
                              <td className="border border-gray-300 px-2 sm:px-4 py-2">
                                Convert output to a specific writing system
                              </td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-2 sm:px-4 py-2 font-mono text-blue-600">
                                chunk_size
                              </td>
                              <td className="border border-gray-300 px-2 sm:px-4 py-2">Integer</td>
                              <td className="border border-gray-300 px-2 sm:px-4 py-2 font-mono text-green-600">
                                120
                              </td>
                              <td className="border border-gray-300 px-2 sm:px-4 py-2">
                                Processing chunk size in seconds (60, 120, or 180)
                              </td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-2 sm:px-4 py-2 font-mono text-blue-600">
                                index
                              </td>
                              <td className="border border-gray-300 px-2 sm:px-4 py-2">Integer</td>
                              <td className="border border-gray-300 px-2 sm:px-4 py-2 font-mono text-green-600">
                                0
                              </td>
                              <td className="border border-gray-300 px-2 sm:px-4 py-2">
                                Model variant to use for languages with multiple models
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
                      Response Format
                    </h4>
                    <p className="text-gray-600 mb-2 sm:mb-3 text-sm sm:text-base">
                      The response gives you both the complete text and individual segments with
                      precise timing. Each segment tells you who spoke, what they said, and exactly
                      when they said it.
                    </p>
                    <CodeBlock
                      language="json"
                      code={`{
  "success": true,
  "text": "Complete transcribed text with all speakers combined",
  "segments": [
    {
      "start": 0.0,
      "end": 5.2,
      "text": "Hello, welcome to our meeting",
      "speaker": "SPEAKER_00"
    },
    {
      "start": 5.3,
      "end": 8.1,
      "text": "Thanks for having me",
      "speaker": "SPEAKER_01"
    }
  ],
  "detected_language": "English",
  "language_probability": 0.99,
  "unique_speakers": ["SPEAKER_00", "SPEAKER_01"],
  "total_time": 15.5,
  "model_used": "english_en"
}`}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="web-apps" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  Setting Up Web Applications
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  If you're building a web application, you'll need to handle authentication
                  securely. Never put your API key directly in frontend JavaScript - users can see
                  it and potentially abuse it.
                </p>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  Instead, create an endpoint on your backend that generates temporary JWT tokens:
                </p>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h4 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
                      Backend Token Generation
                    </h4>
                    <CodeBlock
                      language="javascript"
                      code={`// Example for Vercel/Netlify serverless functions
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.TRANSCRIBE_API_KEY; // Store securely
  const timestamp = Math.floor(Date.now() / 1000);
  
  const payload = {
    iat: timestamp,
    exp: timestamp + 3600, // Expires in 1 hour
    service: 'transcription'
  };

  const token = jwt.sign(payload, apiKey, { algorithm: 'HS256' });
  
  return res.status(200).json({ 
    token,
    expires_in: 3600,
    issued_at: timestamp
  });
}`}
                    />
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
                      Frontend Implementation
                    </h4>
                    <CodeBlock
                      language="javascript"
                      code={`class TranscriptionService {
  constructor() {
    this.token = null;
    this.tokenExpiry = null;
  }

  async getToken() {
    const now = Date.now() / 1000;
    
    // Reuse token if it's still valid (with 5 minute buffer)
    if (this.token && this.tokenExpiry && this.tokenExpiry > now + 300) {
      return this.token;
    }

    const response = await fetch('/api/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    this.token = data.token;
    this.tokenExpiry = now + data.expires_in;
    
    return this.token;
  }

  async transcribeAudio(audioFile, options = {}) {
    const token = await this.getToken();
    
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('language_code', options.language_code || 'auto');
    formData.append('enable_diarization', options.enable_diarization ?? true);
    
    const response = await fetch('https://asr.shunyalabs.ai/transcribe', {
      method: 'POST',
      headers: { 'Authorization': \`Bearer \${token}\` },
      body: formData
    });

    return await response.json();
  }
}

// Usage
const transcription = new TranscriptionService();
const result = await transcription.transcribeAudio(audioFile, {
  language_code: 'en',
  enable_diarization: true
});`}
                    />
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">
                    <strong>Security Note:</strong> This setup keeps your API key secure on the
                    backend while allowing your frontend to make authenticated requests through
                    temporary tokens.
                  </p>
                </div>

                <div className="mt-4 sm:mt-6">
                  <h4 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
                    Language Support
                  </h4>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                    Beyond the specialized models, the service supports over 220 languages through
                    multilingual models. Just use "auto" for automatic detection or specify the
                    language code directly:
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-3 sm:mb-4">
                    <div>French (fr)</div>
                    <div>German (de)</div>
                    <div>Spanish (es)</div>
                    <div>Portuguese (pt)</div>
                    <div>Chinese (zh)</div>
                    <div>Japanese (ja)</div>
                    <div>Korean (ko)</div>
                    <div>Arabic (ar)</div>
                    <div>Russian (ru)</div>
                    <div>And many others</div>
                  </div>

                  <p className="text-gray-600 text-sm sm:text-base">
                    When you're not sure what language you're dealing with, set language_code to
                    "auto" and the system will detect it automatically. The response includes the
                    detected language and a confidence score.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="languages" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  Available Languages (216 languages)
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  Beyond the specialized models, the service supports over 220 languages through
                  multilingual models. Just use "auto" for automatic detection or specify the
                  language code directly.
                </p>

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
                          <p className="text-sm sm:text-base text-gray-600">
                            Hindi, Bengali, Tamil, Marathi, Telugu, Kannada, Gujarati, Malayalam,
                            Urdu, Punjabi, Nepali, and 31+ regional languages
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Available Languages:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="space-y-2">
                              <div className="font-medium text-gray-700">Major Languages:</div>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>Hindi - hi</li>
                                <li>Bengali - bn (bn-IN, bn-BD)</li>
                                <li>Tamil - ta</li>
                                <li>Marathi - mr</li>
                                <li>Telugu - te</li>
                                <li>Kannada - kn</li>
                                <li>Gujarati - gu</li>
                                <li>Malayalam - ml</li>
                                <li>Urdu - ur</li>
                                <li>Punjabi - pa</li>
                                <li>Nepali - ne</li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <div className="font-medium text-gray-700">Regional Languages:</div>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>Awadhi - awa</li>
                                <li>Bhojpuri - bho</li>
                                <li>Bodo - brx</li>
                                <li>Chhattisgarhi - hne</li>
                                <li>Dogri - doi</li>
                                <li>Garo - grt</li>
                                <li>Gondi - gon</li>
                                <li>Haryanvi - bgc</li>
                                <li>Ho - hoc</li>
                                <li>Kashmiri - ks</li>
                                <li>Khasi - kha</li>
                                <li>Khond - kxv</li>
                              </ul>
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
                                <li>Latin (Romanized)</li>
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
                          <p className="text-sm sm:text-base text-gray-600">
                            English variants, French variants, Spanish variants, German, Italian,
                            Russian, and 40+ others
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Available Languages:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="space-y-2">
                              <div className="font-medium text-gray-700">English Variants:</div>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>Global - en</li>
                                <li>UK - en-GB</li>
                                <li>US - en-US</li>
                                <li>India - en-IN</li>
                                <li>Australia - en-AU</li>
                                <li>Canada - en-CA</li>
                                <li>South Africa - en-ZA</li>
                                <li>New Zealand - en-NZ</li>
                                <li>Ireland - en-IE</li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <div className="font-medium text-gray-700">Major Languages:</div>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>French - fr (fr-FR, fr-CA, fr-BE, fr-CH, fr-AF)</li>
                                <li>Spanish - es (es-ES, es-CO, es-AR, es-CL, es-MX)</li>
                                <li>Portuguese - pt (pt-BR, pt-PT, pt-AF)</li>
                                <li>German - de</li>
                                <li>Italian - it</li>
                                <li>Russian - ru</li>
                                <li>Polish - pl</li>
                                <li>Dutch - nl</li>
                                <li>Swedish - sv</li>
                                <li>Norwegian - no</li>
                                <li>Danish - da</li>
                                <li>Finnish - fi</li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <div className="font-medium text-gray-700">Scripts:</div>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>Latin</li>
                                <li>Cyrillic</li>
                                <li>Greek</li>
                                <li>Armenian</li>
                                <li>Georgian</li>
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
                          <p className="text-sm sm:text-base text-gray-600">
                            Chinese variants, Japanese, Korean, Vietnamese, Thai, Indonesian,
                            Tagalog, and 44+ others
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Available Languages:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="space-y-2">
                              <div className="font-medium text-gray-700">Chinese Variants:</div>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>Global - zh</li>
                                <li>Mandarin - zh-CN</li>
                                <li>Cantonese - zh-HK</li>
                                <li>Wu - wuu</li>
                                <li>Min - nan</li>
                                <li>Hakka - hak</li>
                                <li>Gan - gan</li>
                                <li>Xiang - hsn</li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <div className="font-medium text-gray-700">Major Languages:</div>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>Japanese - ja</li>
                                <li>Korean - ko</li>
                                <li>Vietnamese - vi</li>
                                <li>Thai - th</li>
                                <li>Indonesian - id</li>
                                <li>Malay - ms</li>
                                <li>Mongolian - mn</li>
                                <li>Hmong - hmn</li>
                                <li>Mien - ium</li>
                                <li>Javanese - jv</li>
                                <li>Sundanese - su</li>
                                <li>Madurese - mad</li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <div className="font-medium text-gray-700">Scripts:</div>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>Chinese</li>
                                <li>Japanese</li>
                                <li>Korean</li>
                                <li>Thai</li>
                                <li>Latin</li>
                                <li>Mongolian</li>
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
                          <p className="text-sm sm:text-base text-gray-600">
                            Swahili, Hausa, Yoruba, Igbo, Amharic, Arabic variants, and 44+ others
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Available Languages:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="space-y-2">
                              <div className="font-medium text-gray-700">Major Languages:</div>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>Swahili - sw</li>
                                <li>Oromo - om</li>
                                <li>Somali - so</li>
                                <li>Hausa - ha</li>
                                <li>Yoruba - yo</li>
                                <li>Igbo - ig</li>
                                <li>Fulani - ff</li>
                                <li>Akan - ak</li>
                                <li>Twi - tw</li>
                                <li>Ewe - ee</li>
                                <li>Ga - gaa</li>
                                <li>Wolof - wo</li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <div className="font-medium text-gray-700">Regional Languages:</div>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>Mandinka - mnk</li>
                                <li>Bambara - bm</li>
                                <li>Lingala - ln</li>
                                <li>Kikongo - kg</li>
                                <li>Kinyarwanda - rw</li>
                                <li>Kirundi - rn</li>
                                <li>Luganda - lg</li>
                                <li>Luo - luo</li>
                                <li>Kikuyu - ki</li>
                                <li>Shona - sn</li>
                                <li>Ndebele - nd</li>
                                <li>Zulu - zu</li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <div className="font-medium text-gray-700">Scripts:</div>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>Latin</li>
                                <li>Arabic</li>
                                <li>Ethiopic</li>
                                <li>N'Ko</li>
                                <li>Vai</li>
                                <li>Adlam</li>
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
                          <p className="text-sm sm:text-base text-gray-600">
                            Arabic variants, Hebrew, Persian, Turkish, Kurdish variants, and 15+
                            others
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Available Languages:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="space-y-2">
                              <div className="font-medium text-gray-700">Arabic Variants:</div>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>Global - ar</li>
                                <li>Egyptian - ar-EG</li>
                                <li>Gulf - ar-AE</li>
                                <li>Levantine - ar-LB</li>
                                <li>Sudanese - ar-SD</li>
                                <li>Iraqi - ar-IQ</li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <div className="font-medium text-gray-700">Major Languages:</div>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>Hebrew - he</li>
                                <li>Persian - fa</li>
                                <li>Kurdish Sorani - ckb</li>
                                <li>Kurdish Kurmanji - kmr</li>
                                <li>Pashto - ps</li>
                                <li>Balochi - bal</li>
                                <li>Dari - prs</li>
                                <li>Tajik - tg</li>
                                <li>Uyghur - ug</li>
                                <li>Kazakh - kk</li>
                                <li>Kyrgyz - ky</li>
                                <li>Uzbek - uz</li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <div className="font-medium text-gray-700">Scripts:</div>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>Arabic</li>
                                <li>Hebrew</li>
                                <li>Persian</li>
                                <li>Latin</li>
                                <li>Cyrillic</li>
                                <li>Armenian</li>
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
                          <p className="text-sm sm:text-base text-gray-600">
                            Spanish variants, Portuguese variants, Quechua, Guarani, Maya languages,
                            and indigenous languages
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Available Languages:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="space-y-2">
                              <div className="font-medium text-gray-700">Indigenous Languages:</div>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>Quechua - qu</li>
                                <li>Aymara - ay</li>
                                <li>Guarani - gn</li>
                                <li>Nahuatl - nah</li>
                                <li>Maya K'iche' - quc</li>
                                <li>Maya Q'eqchi' - kek</li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <div className="font-medium text-gray-700">Creole Languages:</div>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>Haitian Creole - ht</li>
                                <li>Jamaican Patois - jam</li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <div className="font-medium text-gray-700">Scripts:</div>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>Latin</li>
                                <li>Maya (Ancient)</li>
                                <li>Aztec (Ancient)</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="mt-4 sm:mt-6">
                  <h4 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">Usage Examples:</h4>
                  <CodeBlock
                    language="bash"
                    code={`# Use specific language codes
curl -F "language_code=hi" ...          # Hindi
curl -F "language_code=zh-CN" ...       # Mandarin Chinese  
curl -F "language_code=ar-EG" ...       # Egyptian Arabic
curl -F "language_code=es-MX" ...       # Mexican Spanish

# Or use auto-detection
curl -F "language_code=auto" ...        # Detects any of the above`}
                  />
                </div>

                <div className="mt-4 sm:mt-6">
                  <h4 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
                    Script Transliteration
                  </h4>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                    This feature converts the transcribed text between different writing systems.
                    It's particularly useful if you're building applications for international
                    audiences or need to standardize text output.
                  </p>
                  <CodeBlock
                    language="bash"
                    code={`# Example: Transcribe Hindi audio but get output in Roman letters
curl -F "language_code=hi" \\
     -F "output_script=Latin" \\
     ...`}
                  />

                  <div className="mt-3 sm:mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Available Output Scripts:
                    </p>
                    <div className="text-xs text-gray-600">
                      auto, Latin, Devanagari, Bengali, Arabic, Chinese, Japanese, Korean, Cyrillic,
                      Hebrew, Gujarati, Kannada, Malayalam, Tamil, Telugu, Thai, Sinhala
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="examples" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Code Examples</h3>

                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <h4 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
                      Python Integration
                    </h4>
                    <CodeBlock
                      language="python"
                      code={`import requests

def transcribe_file(file_path, language='auto', enable_speakers=True):
    url = "https://asr.shunyalabs.ai/transcribe"
    headers = {"x-user-id": "YOUR_API_KEY"}
    
    # Determine MIME type based on file extension
    mime_types = {
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '.m4a': 'audio/mp4',
        '.mp4': 'video/mp4',
        '.mov': 'video/quicktime'
    }
    
    file_ext = file_path.lower()[-4:]
    mime_type = mime_types.get(file_ext, 'audio/mpeg')
    
    with open(file_path, "rb") as audio_file:
        files = {"audio": (file_path, audio_file, mime_type)}
        data = {
            "language_code": language,
            "enable_diarization": enable_speakers,
            "chunk_size": 120
        }
        
        response = requests.post(url, headers=headers, files=files, data=data)
        return response.json()

# Basic usage
result = transcribe_file("meeting_recording.mp3", "en")
print(f"Full transcript: {result['text']}")

# Print each speaker segment
for segment in result['segments']:
    speaker = segment['speaker']
    text = segment['text']
    start_time = segment['start']
    print(f"{speaker} ({start_time:.1f}s): {text}")`}
                    />
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
                      Node.js Integration
                    </h4>
                    <CodeBlock
                      language="javascript"
                      code={`const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

async function transcribeFile(filePath, options = {}) {
  const form = new FormData();
  form.append('audio', fs.createReadStream(filePath));
  form.append('language_code', options.language || 'auto');
  form.append('enable_diarization', options.enableSpeakers ?? true);
  form.append('chunk_size', options.chunkSize || 120);
  
  const response = await fetch('https://asr.shunyalabs.ai/transcribe', {
    method: 'POST',
    headers: {
      'x-user-id': 'YOUR_API_KEY',
      ...form.getHeaders()
    },
    body: form
  });
  
  if (!response.ok) {
    throw new Error(\`API request failed: \${response.status}\`);
  }
  
  return await response.json();
}

// Usage examples
try {
  // Basic transcription
  const result = await transcribeFile('interview.wav', {
    language: 'en',
    enableSpeakers: true
  });
  
  console.log('Detected language:', result.detected_language);
  console.log('Number of speakers:', result.unique_speakers.length);
  console.log('Full transcript:', result.text);
  
  // Process segments
  result.segments.forEach(segment => {
    console.log(\`\${segment.speaker}: \${segment.text}\`);
  });
  
} catch (error) {
  console.error('Transcription failed:', error.message);
}`}
                    />
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
                      Multilingual Processing Example
                    </h4>
                    <CodeBlock
                      language="python"
                      code={`def process_multilingual_audio(file_path):
    """
    Process audio that might contain multiple languages
    """
    # First, try auto-detection
    result = transcribe_file(file_path, language='auto')
    
    print(f"Detected language: {result['detected_language']}")
    print(f"Confidence: {result['language_probability']:.2f}")
    
    # If confidence is low, the audio might be multilingual
    if result['language_probability'] < 0.8:
        print("Low confidence - might be multilingual content")
        
        # You could try processing with multilingual models
        # or split the audio and process segments separately
    
    return result

# Usage
result = process_multilingual_audio("mixed_language_meeting.mp4")`}
                    />
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
                      File Formats and Requirements
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium mb-2 sm:mb-3">Audio Formats</h5>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li>• MP3 - Use MIME type audio/mpeg</li>
                            <li>• WAV - Use MIME type audio/wav</li>
                            <li>• M4A - Use MIME type audio/mp4</li>
                            <li>• FLAC - Use MIME type audio/flac</li>
                            <li>• OGG - Use MIME type audio/ogg</li>
                            <li>• AAC - Use MIME type audio/aac</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2 sm:mb-3">File Size Limits:</h5>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li>• Maximum file size: 1GB per request</li>
                            <li>• Processing time scales with file length</li>
                            <li>• Large files are automatically chunked for optimal performance</li>
                          </ul>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2 sm:mb-3">
                          Video Formats (Audio Extracted)
                        </h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• MP4 - Use MIME type video/mp4</li>
                          <li>• MOV - Use MIME type video/quicktime</li>
                          <li>• AVI - Use MIME type video/x-msvideo</li>
                          <li>• MKV - Use MIME type video/x-matroska</li>
                          <li>• WebM - Use MIME type video/webm</li>
                        </ul>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-1 sm:gap-2">
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Important</p>
                          <p className="text-sm text-yellow-700 mt-1">
                            Always specify the correct MIME type when uploading files. This is
                            especially critical when using curl:
                          </p>
                          <div className="mt-1 sm:mt-2 text-xs">
                            <p className="text-yellow-700">
                              # Correct - specify MIME type explicitly
                            </p>
                            <p className="text-yellow-600">
                              curl -F "audio=@file.mp3;type=audio/mpeg" ...
                            </p>
                            <p className="text-yellow-700 mt-1">
                              # Incorrect - may cause format detection errors
                            </p>
                            <p className="text-yellow-600">curl -F "audio=@file.mp3" ...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="errors" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Error Handling</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  The API uses standard HTTP status codes and provides detailed error messages to
                  help you diagnose issues quickly.
                </p>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                      Common Error Responses
                    </h4>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                          <Badge variant="destructive">400</Badge>
                          <h5 className="font-medium">Bad Request - File Format Issues</h5>
                        </div>
                        <CodeBlock
                          language="json"
                          code={`{
  "detail": "File must be audio or video format"
}`}
                        />
                        <p className="text-gray-600 text-sm mt-1 sm:mt-2">
                          This usually happens when the MIME type isn't specified correctly or the
                          file format isn't supported.
                        </p>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                          <Badge variant="destructive">401</Badge>
                          <h5 className="font-medium">Unauthorized - Authentication Problems</h5>
                        </div>
                        <CodeBlock
                          language="json"
                          code={`{
  "detail": "User not identified"
}`}
                        />
                        <p className="text-gray-600 text-sm mt-1 sm:mt-2">
                          Check that your API key is correct and included in the x-user-id header.
                        </p>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                          <Badge variant="destructive">413</Badge>
                          <h5 className="font-medium">Payload Too Large</h5>
                        </div>
                        <CodeBlock
                          language="json"
                          code={`{
  "detail": "File too large"
}`}
                        />
                        <p className="text-gray-600 text-sm mt-1 sm:mt-2">
                          Files must be under 1GB. Consider splitting larger files.
                        </p>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                          <Badge variant="destructive">500</Badge>
                          <h5 className="font-medium">Internal Server Error</h5>
                        </div>
                        <CodeBlock
                          language="json"
                          code={`{
  "detail": "Audio conversion failed: <specific error message>"
}`}
                        />
                        <p className="text-gray-600 text-sm mt-1 sm:mt-2">
                          This indicates a processing error. The error message will give you
                          specifics about what went wrong.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
                      Troubleshooting Common Issues
                    </h4>
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <h5 className="font-medium text-gray-800 mb-1 sm:mb-2">
                          "File must be audio or video format" Error
                        </h5>
                        <p className="text-gray-600 text-sm mb-1 sm:mb-2">
                          This is the most common issue and usually relates to MIME type detection:
                        </p>
                        <ul className="text-xs text-gray-600 space-y-1 ml-3 sm:ml-4">
                          <li>• Always specify MIME types explicitly in your requests</li>
                          <li>
                            • If you're using conda/miniconda, try deactivating the environment:
                          </li>
                          <li className="ml-4">conda deactivate</li>
                          <li className="ml-4">export LD_LIBRARY_PATH=""</li>
                          <li>• Make sure the file isn't corrupted</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-800 mb-1 sm:mb-2">
                          Token Expiration Issues
                        </h5>
                        <p className="text-gray-600 text-sm mb-1 sm:mb-2">
                          For JWT authentication, implement proper token refresh logic:
                        </p>
                        <CodeBlock
                          language="javascript"
                          code={`// Check if token is expiring soon and refresh automatically
if (this.tokenExpiry && this.tokenExpiry < Date.now()/1000 + 300) {
    await this.refreshToken();
}`}
                        />
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-800 mb-1 sm:mb-2">
                          Processing Timeouts
                        </h5>
                        <p className="text-gray-600 text-sm sm:text-base">For very large files:</p>
                        <ul className="text-xs text-gray-600 space-y-1 ml-3 sm:ml-4 mt-1 sm:mt-2">
                          <li>• Try smaller chunk sizes (60 seconds instead of 120)</li>
                          <li>• Consider pre-processing to reduce file size</li>
                          <li>• Split extremely long recordings into smaller segments</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="support" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Support</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  Need help with the API? Here are the best ways to get support and find answers to
                  common questions.
                </p>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h4 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">Getting Help</h4>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h5 className="font-medium text-blue-900 mb-1 sm:mb-2">Email Support</h5>
                        <p className="text-blue-800 text-sm sm:text-base">
                          For technical questions, API issues, or account-related inquiries, email
                          us at <strong>0@shunyalabs.ai</strong>
                        </p>
                      </div>

                      <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h5 className="font-medium text-green-900 mb-1 sm:mb-2">Documentation</h5>
                        <p className="text-green-800 text-sm sm:text-base">
                          Check the other tabs in this documentation for detailed examples, error
                          handling, and best practices.
                        </p>
                      </div>

                      <div className="p-3 sm:p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <h5 className="font-medium text-purple-900 mb-1 sm:mb-2">Health Check</h5>
                        <p className="text-purple-800 text-sm sm:text-base">
                          Use the health check endpoint to verify API status and model availability
                          before reporting issues.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
                      Common Support Topics
                    </h4>
                    <ul className="space-y-1 sm:space-y-2 text-gray-600 text-sm">
                      <li>
                        • <strong>Authentication Issues:</strong> Check your API key format and
                        ensure it's included in the correct header
                      </li>
                      <li>
                        • <strong>File Format Problems:</strong> Verify MIME types and ensure files
                        are valid audio/video formats
                      </li>
                      <li>
                        • <strong>Processing Errors:</strong> Check file size limits and try smaller
                        chunk sizes for large files
                      </li>
                      <li>
                        • <strong>Language Detection:</strong> Use "auto" for automatic detection or
                        specify exact language codes
                      </li>
                      <li>
                        • <strong>Rate Limiting:</strong> Implement proper queuing for high-volume
                        applications
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
                      Before Contacting Support
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base mb-2 sm:mb-3">
                      To help us assist you faster, please include the following information:
                    </p>
                    <ul className="space-y-1 sm:space-y-2 text-gray-600 text-sm ml-3 sm:ml-4">
                      <li>• Your API key (first few characters only)</li>
                      <li>• The exact error message you're receiving</li>
                      <li>• File format and size you're trying to process</li>
                      <li>• Language code you're using</li>
                      <li>• Code snippet showing how you're making the request</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Health Check */}
        <Card className="p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Monitor className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Monitoring and Health Checks
            </h2>
          </div>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
            Keep tabs on API status and model availability:
          </p>

          <CodeBlock language="bash" code={`curl -X GET "https://asr.shunyalabs.ai/health"`} />

          <div className="mt-3 sm:mt-4">
            <h4 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">Response:</h4>
            <CodeBlock
              language="json"
              code={`{
  "status": "healthy",
  "models_loaded": true,
  "whisper_model_instances": 8,
  "hf_pipeline_instances": 5,
  "available_whisper_languages": ["english", "multilingual"],
  "available_hf_languages": ["bengali", "devanagari", "marathi", "nepali", "tamil"],
  "cuda_available": true,
  "diarization_pipeline_loaded": true,
  "timestamp": 1703123456.789
}`}
            />
          </div>

          <div className="mt-3 sm:mt-4 text-sm text-gray-600">
            <p className="mb-1 sm:mb-2 text-sm sm:text-base">This endpoint tells you:</p>
            <ul className="space-y-1 sm:space-y-1.5 ml-3 sm:ml-4 text-sm sm:text-base">
              <li>• Whether the service is operational</li>
              <li>• How many model instances are loaded</li>
              <li>• Which specialized language models are available</li>
              <li>• Whether GPU acceleration is active</li>
              <li>• Whether speaker diarization is working</li>
            </ul>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base">
              Use this for monitoring dashboards or automated health checks in production systems.
            </p>
          </div>
        </Card>
        {/* Performance and Rate Limits */}
        <Card className="p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
            Performance and Rate Limits
          </h2>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">File Processing</h3>
              <ul className="space-y-1 sm:space-y-1.5 text-gray-600 text-sm sm:text-base">
                <li>• Files are processed in chunks for optimal performance</li>
                <li>
                  • Chunk sizes: 60, 120, or 180 seconds (120 is the sweet spot for most use cases)
                </li>
                <li>• Processing time varies based on file length and enabled features</li>
              </ul>

              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 mt-4 sm:mt-6">
                Concurrent Requests
              </h3>
              <ul className="space-y-1 sm:space-y-1.5 text-gray-600 text-sm sm:text-base">
                <li>• The service handles multiple concurrent requests</li>
                <li>• No hard rate limits, but processing capacity is finite</li>
                <li>• Consider implementing queuing for high-volume applications</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Optimization Tips</h3>
              <ul className="space-y-1 sm:space-y-1.5 text-gray-600 text-sm sm:text-base">
                <li>• Use appropriate chunk sizes for your content type</li>
                <li>• Disable speaker diarization if you don't need it (saves processing time)</li>
                <li>• Pre-process audio to remove silence if possible</li>
                <li>• Cache results when transcribing the same content multiple times</li>
              </ul>
            </div>
          </div>
        </Card>
        {/* Production Deployment */}
        <Card className="p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
            Production Deployment
          </h2>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                Security Checklist
              </h3>
              <ul className="space-y-1 sm:space-y-1.5 text-gray-600 text-sm sm:text-base">
                <li>• Store API keys in environment variables, never in code</li>
                <li>• Use JWT tokens for frontend applications</li>
                <li>• Implement proper CORS settings for web applications</li>
                <li>• Add request validation and rate limiting on your end</li>
              </ul>

              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 mt-4 sm:mt-6">
                Error Handling
              </h3>
              <ul className="space-y-1 sm:space-y-1.5 text-gray-600 text-sm sm:text-base">
                <li>• Always check HTTP status codes</li>
                <li>• Log error responses for debugging</li>
                <li>• Implement retry logic for transient failures</li>
                <li>• Provide meaningful error messages to users</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                Scaling Considerations
              </h3>
              <ul className="space-y-1 sm:space-y-1.5 text-gray-600 text-sm sm:text-base">
                <li>• Queue long transcription jobs for better user experience</li>
                <li>• Consider webhook callbacks for asynchronous processing</li>
                <li>• Cache frequently requested transcriptions</li>
                <li>• Monitor usage to predict capacity needs</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Getting API Key */}
        <Card className="p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
            Getting Your API Key
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
            To access the Multi-Language Transcription API, email <strong>0@shunyalabs.ai</strong>{' '}
            to request your API key. Include details about your use case and expected usage volume
            for faster processing.
          </p>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            Once you receive your key, you can immediately start transcribing audio in any of the
            216 supported languages and dialects.
          </p>

          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-medium text-sm sm:text-base">
              Ready to get started? The examples and documentation above provide everything you need
              for a solid integration.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PingalaV1API;
