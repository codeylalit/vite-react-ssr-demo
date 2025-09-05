import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import {
  Badge,
  Building,
  Check,
  Shield,
  Zap,
  Globe,
  Clock,
  Sparkles,
  Calculator,
  CreditCard,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const PricingTires = () => {
  const [selectedTab, setSelectedTab] = useState('cloud');
  const [selectedModel, setSelectedModel] = useState('english-verbatim');
  const [selectedMode, setSelectedMode] = useState('batch');
  const [usageHours, setUsageHours] = useState(100);

  const modelVariants = [
    {
      id: 'english-verbatim',
      name: 'English (Verbatim)',
      batchPrice: 0.065,
      realtimePrice: 0.08,
      description: 'Fully verbatim, filler words retained',
      icon: Clock,
      features: [
        'Fully verbatim transcription',
        'Filler words retained',
        'Batch processing',
        'Real-time streaming',
      ],
      popular: false,
    },
    {
      id: 'english-enhanced',
      name: 'English (Enhanced)',
      batchPrice: 0.08,
      realtimePrice: 0.1,
      description: 'Semantic cleanup, punctuation & formatting',
      icon: Sparkles,
      features: [
        'Semantic cleanup',
        'Punctuation & formatting',
        'Enhanced processing',
        'Real-time streaming',
      ],
      popular: true,
    },
    {
      id: 'multilingual',
      name: 'Multilingual (216 languages)',
      batchPrice: 0.11,
      realtimePrice: 0.14,
      description: 'Auto-normalized output, semantic layer',
      icon: Globe,
      features: [
        '216 languages supported',
        'Auto-normalized output',
        'Semantic layer',
        'Real-time streaming',
      ],
      popular: false,
    },
  ];

  const selectedModelData = modelVariants.find(model => model.id === selectedModel);
  const currentPrice =
    selectedMode === 'batch' ? selectedModelData?.batchPrice : selectedModelData?.realtimePrice;
  const monthlyCost = (currentPrice || 0) * usageHours;

  return (
    <section id="pricing-table" className="py-8 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation - made more compact on mobile */}
        <div className="flex justify-center mb-8 md:mb-12 overflow-x-auto">
          <div className="bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedTab('cloud')}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-md text-sm md:text-base font-bold transition-all whitespace-nowrap ${
                selectedTab === 'cloud'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ☁️ Cloud API
            </button>
            <button
              onClick={() => setSelectedTab('self-hosted')}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-md text-sm md:text-base font-bold transition-all whitespace-nowrap ${
                selectedTab === 'self-hosted'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🏢 Self-Hosted
            </button>
          </div>
        </div>

        {selectedTab === 'cloud' && (
          <>
            {/* Section titles - adjusted spacing */}
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-midnight mb-3 md:mb-4">
                💰 Simple, Transparent Pricing
              </h2>
              <p className="text-base md:text-lg text-gray-600">
                No credit card. No API throttling. Just blazing-fast transcription.
              </p>
            </div>

            {/* Model Selection - adjust grid for mobile */}
            <div className="mb-6 md:mb-8">
              <h3 className="text-lg md:text-xl font-semibold text-midnight mb-4 md:mb-6 text-center">
                Choose Your Model
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
                {modelVariants.map(model => {
                  const Icon = model.icon;
                  return (
                    <Card
                      key={model.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedModel === model.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${model.popular ? 'ring-2 ring-blue-200' : ''}`}
                      onClick={() => setSelectedModel(model.id)}
                    >
                      {model.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-blue-600 text-white px-3 py-1 text-xs">
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      <CardHeader className="text-center pb-4">
                        <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                        <CardDescription>{model.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Batch:</span>
                            <span className="font-semibold">${model.batchPrice}/hr</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Real-time:</span>
                            <span className="font-semibold">${model.realtimePrice}/hr</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Mode Selection - made more compact on mobile */}
            <div className="mb-6 md:mb-8 overflow-x-auto">
              <h3 className="text-lg md:text-xl font-semibold text-midnight mb-4 md:mb-6 text-center">
                Processing Mode
              </h3>
              <div className="flex justify-center min-w-max">
                <div className="bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setSelectedMode('batch')}
                    className={`px-6 py-3 rounded-md font-medium transition-all ${
                      selectedMode === 'batch'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    📦 Batch Processing
                  </button>
                  <button
                    onClick={() => setSelectedMode('realtime')}
                    className={`px-6 py-3 rounded-md font-medium transition-all ${
                      selectedMode === 'realtime'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    ⚡ Real-Time Streaming
                  </button>
                </div>
              </div>
            </div>

            {/* Usage Calculator - full width on mobile */}
            <div className="mb-6 md:mb-8">
              <h3 className="text-lg md:text-xl font-semibold text-midnight mb-4 md:mb-6 text-center">
                Usage Calculator
              </h3>
              <div className="w-full md:max-w-md mx-auto">
                <div className="bg-gray-50 rounded-lg p-4 md:p-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hours per month: {usageHours}
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="1000"
                      value={usageHours}
                      onChange={e => setUsageHours(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>10 hrs</span>
                      <span>100 hrs</span>
                      <span>500 hrs</span>
                      <span>1000 hrs</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      ${monthlyCost.toFixed(2)}/month
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedModelData?.name} • {selectedMode === 'batch' ? 'Batch' : 'Real-time'}{' '}
                      • {usageHours} hours
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Table - Mobile Cards + Desktop Table */}
            <div className="mb-8 md:mb-12">
              <h3 className="text-lg md:text-xl font-semibold text-midnight mb-4 md:mb-6 text-center">
                Complete Pricing Table
              </h3>

              {/* Mobile Card Layout */}
              <div className="block md:hidden space-y-4">
                {[
                  {
                    model: 'English (Verbatim)',
                    modes: [
                      {
                        type: 'Batch',
                        price: '$0.065/hr',
                        features: 'Fully verbatim, filler words retained',
                      },
                      {
                        type: 'Real-Time',
                        price: '$0.08/hr',
                        features: 'Live captions, low-latency streams',
                      },
                    ],
                  },
                  {
                    model: 'English (Enhanced)',
                    modes: [
                      {
                        type: 'Batch',
                        price: '$0.08/hr',
                        features: 'Semantic cleanup, punctuation & formatting',
                      },
                      {
                        type: 'Real-Time',
                        price: '$0.10/hr',
                        features: 'Enhanced live speech-to-text',
                      },
                    ],
                  },
                  {
                    model: 'Multilingual (216 languages)',
                    modes: [
                      {
                        type: 'Batch',
                        price: '$0.11/hr',
                        features: 'Auto-normalized output, semantic layer',
                      },
                      {
                        type: 'Real-Time',
                        price: '$0.14/hr',
                        features: 'High-accuracy live multilingual ASR',
                      },
                    ],
                  },
                ].map((modelData, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                  >
                    <h4 className="font-semibold text-gray-800 mb-3">{modelData.model}</h4>
                    <div className="space-y-3">
                      {modelData.modes.map((mode, modeIndex) => (
                        <div key={modeIndex} className="border-l-4 border-blue-500 pl-3">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-gray-700">{mode.type}</span>
                            <span className="font-bold text-green-600">{mode.price}</span>
                          </div>
                          <p className="text-sm text-gray-600">{mode.features}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">
                        Model Variant
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700">Mode</th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700">
                        Price (USD/hr)
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">
                        Key Features
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-6 font-medium">English (Verbatim)</td>
                      <td className="text-center py-4 px-6">Batch</td>
                      <td className="text-center py-4 px-6 font-bold text-green-600">$0.065/hr</td>
                      <td className="py-4 px-6">Fully verbatim, filler words retained</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-6"></td>
                      <td className="text-center py-4 px-6">Real-Time</td>
                      <td className="text-center py-4 px-6 font-bold text-green-600">$0.08/hr</td>
                      <td className="py-4 px-6">Live captions, low-latency streams</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-6 font-medium">English (Enhanced)</td>
                      <td className="text-center py-4 px-6">Batch</td>
                      <td className="text-center py-4 px-6 font-bold text-green-600">$0.08/hr</td>
                      <td className="py-4 px-6">Semantic cleanup, punctuation & formatting</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-6"></td>
                      <td className="text-center py-4 px-6">Real-Time</td>
                      <td className="text-center py-4 px-6 font-bold text-green-600">$0.10/hr</td>
                      <td className="py-4 px-6">Enhanced live speech-to-text</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-6 font-medium">Multilingual (216 languages)</td>
                      <td className="text-center py-4 px-6">Batch</td>
                      <td className="text-center py-4 px-6 font-bold text-green-600">$0.11/hr</td>
                      <td className="py-4 px-6">Auto-normalized output, semantic layer</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-6"></td>
                      <td className="text-center py-4 px-6">Real-Time</td>
                      <td className="text-center py-4 px-6 font-bold text-green-600">$0.14/hr</td>
                      <td className="py-4 px-6">High-accuracy live multilingual ASR</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Free Trial Banner - adjusted padding */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 md:p-6 mb-8 md:mb-12">
              <div className="text-center">
                <h3 className="text-xl font-bold text-green-800 mb-2">Try it Free</h3>
                <p className="text-green-700">
                  First 10,000 hours (English Verbatim) per organization – FREE.
                </p>
                <p className="text-sm text-green-600 mt-2">
                  No credit card. No API throttling. Just blazing-fast transcription.
                </p>
                <Button
                  className="mt-4 bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] hover:from-[#1a1947]/90 hover:to-[#2d4cc8]/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl "
                  asChild
                >
                  <Link to="/early-access">Start Free Trial</Link>
                </Button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 md:p-8 mt-8 md:mt-16">
              <h3 className="text-xl md:text-2xl font-bold text-midnight mb-4 md:mb-6 text-center">
                🧩 Build Your Own Pingala Plan
              </h3>
              <p className="text-base md:text-lg text-gray-600 text-center mb-6 md:mb-8">
                Mix and match features, deployment types, and billing tiers based on your product
                needs.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="font-semibold mb-2">Real-Time Transcription</h4>
                  <p className="text-sm text-gray-600 mb-2">Add to any batch plan</p>
                  <p className="text-green-600 font-bold">+30% per hour</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="font-semibold mb-2">Multilingual Support</h4>
                  <p className="text-sm text-gray-600 mb-2">216 languages (Indic + global)</p>
                  <p className="text-green-600 font-bold">+20% per hour</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="font-semibold mb-2">Enhanced Processing</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Filler removal, smart casing, semantic cleanup
                  </p>
                  <p className="text-green-600 font-bold">+$0.03/hr</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="font-semibold mb-2">CPU-Optimized SDK</h4>
                  <p className="text-sm text-gray-600 mb-2">Self-hosted deployments</p>
                  <p className="text-green-600 font-bold">From $249/mo</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="font-semibold mb-2">Enterprise SLA & Support</h4>
                  <p className="text-sm text-gray-600 mb-2">Dedicated success engineer</p>
                  <p className="text-green-600 font-bold">Custom pricing</p>
                </div>
              </div>

              <div className="text-center mt-8">
                <p className="text-sm text-gray-600 mb-4">
                  💡 Only pay for what you use. No seat-based pricing.
                  <br />
                  Build your stack: one language or 216, batch or real-time, hosted or private.
                </p>
                <Button
                  className="mt-4 bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] hover:from-[#1a1947]/90 hover:to-[#2d4cc8]/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl "
                  asChild
                >
                  <Link to="/early-access">Contact US</Link>
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Self-Hosted Section - adjust grid for mobile */}
        {selectedTab === 'self-hosted' && (
          <>
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-midnight mb-3 md:mb-4">
                Self-Hosted Pricing – Shunya Labs AI
              </h2>
              <p className="text-base md:text-lg text-gray-600">
                Deploy Pingala V1 models in your own infrastructure with complete control and
                compliance.
              </p>
            </div>

            {/* Included Free Usage Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 md:p-6 mb-8 md:mb-12">
              <div className="text-center">
                <h3 className="text-xl font-bold text-green-800 mb-4">Included Free Usage</h3>
                <div className="text-3xl font-bold text-green-600 mb-2">10,000 hours</div>
                <p className="text-green-700 mb-2">
                  of transcription per calendar month at no cost.
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Applies to any self-hosted deployment of Pingala V1 models.</p>
                  <p>• Usage resets automatically at the start of each month.</p>
                </div>
              </div>
            </div>

            {/* Additional Usage Pricing */}
            <div className="mb-8 md:mb-12">
              <h3 className="text-lg md:text-xl font-semibold text-midnight mb-4 md:mb-6 text-center">
                Additional Usage Beyond Free Tier
              </h3>
              <p className="text-center text-gray-600 mb-6">
                Once the monthly limit of 10,000 free hours is exceeded, billing is based on the
                specific model you use:
              </p>

              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="min-w-[768px] px-4 md:px-0">
                  <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Model</th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-700">
                          Price per Hour of Transcription
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-4 px-6 font-medium">Pingala V1 – English Verbatim</td>
                        <td className="text-center py-4 px-6 font-bold text-green-600">
                          $0.04 / hour
                        </td>
                        <td className="py-4 px-6">
                          Optimized for high-accuracy English transcription in verbatim format.
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-4 px-6 font-medium">
                          Pingala V1 – Universal (216 Languages)
                        </td>
                        <td className="text-center py-4 px-6 font-bold text-green-600">
                          $0.06 / hour
                        </td>
                        <td className="py-4 px-6">
                          Supports 216 languages, dialects, and accents for global coverage.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="text-center mt-4 text-sm text-gray-600">
                <p>• Billing is tied to your billing account.</p>
                <p>• Charges are calculated monthly based on additional usage hours.</p>
              </div>
            </div>

            {/* Implementation & Support Services */}
            <div className="mb-8 md:mb-12">
              <h3 className="text-lg md:text-xl font-semibold text-midnight mb-4 md:mb-6 text-center">
                Implementation & Support Services
              </h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4 text-center">
                  We offer expert guidance for compliance-ready, real-time deployments of Pingala V1
                  in your own infrastructure.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Our implementation support includes:
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-3">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">
                          Voice Activity Detection (VAD) integration
                        </span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">
                          Denoising & channel cleanup for better transcription accuracy
                        </span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">
                          Real-time streaming transcription setup
                        </span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">
                          Deployment optimization for large-scale workloads
                        </span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">End-to-end testing and tuning</span>
                      </li>
                    </ul>
                  </div>

                  <div className="text-center">
                    <div className="bg-white rounded-lg p-6 border">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Professional Implementation Support
                      </h4>
                      <div className="text-2xl font-bold text-blue-600">$700 / hour</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* License & Compliance */}
            <div className="mb-8 md:mb-12">
              <h3 className="text-lg md:text-xl font-semibold text-midnight mb-4 md:mb-6 text-center">
                License & Compliance
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="space-y-4 text-gray-700">
                  <p>
                    All self-hosted deployments of Pingala V1 are governed by our{' '}
                    <strong>Responsible AI License (RAIL)</strong>.
                  </p>
                  <p>This license ensures ethical, compliant, and responsible use of AI models.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="text-sm">
                        License details:{' '}
                        <a
                          href="https://www.shunyalabs.ai/license"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Shunya Labs RAIL-M License
                        </a>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <span className="text-sm">
                        Models on:{' '}
                        <a
                          href="https://huggingface.co/shunyalabs"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Shunya Labs on Hugging Face
                        </a>
                      </span>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <p className="text-sm font-medium text-yellow-800">
                      ⚠️ Compliance with the RAIL license is mandatory even in self-hosted
                      environments.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                className="bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] hover:from-[#1a1947]/90 hover:to-[#2d4cc8]/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                asChild
              >
                <Link to="/contact">Contact Sales for Self-Hosted Deployment</Link>
              </Button>
            </div>
          </>
        )}

        {/* Why Choose Pingala - adjust grid for mobile */}
        {/* <div className="mt-8 md:mt-16">
          <h3 className="text-xl md:text-2xl font-bold text-midnight mb-6 md:mb-8 text-center">
            💎 Why Choose Pingala?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">WER as low as 2.94%</h4>
              <p className="text-sm text-gray-600">Industry best in Indian languages</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">216 languages</h4>
              <p className="text-sm text-gray-600">Supported for transcription</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Semantic enhancement</h4>
              <p className="text-sm text-gray-600">Clean, readable transcripts</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Runs on CPUs</h4>
              <p className="text-sm text-gray-600">No expensive GPU infrastructure needed</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Private deployment</h4>
              <p className="text-sm text-gray-600">Your data, your control</p>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default PricingTires;
