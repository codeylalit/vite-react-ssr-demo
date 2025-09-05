import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { ExternalLink, Heart, Brain, Zap, Globe, Users, Award } from 'lucide-react';
import { getLanguageStatistics } from '../utils/languageStats';

const OrganizationInfo = () => {
  const languageStats = getLanguageStatistics();

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-b from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Born from Innovation
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-4">
            Shunya Labs: A Deeptech Venture by United We Care
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* United We Care */}
          <Card className="relative hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-xl border-blue-200/50">
            <CardHeader className="text-center p-8">
              <div className="flex justify-center mb-4">
                <img
                  src="/logo uwc.png"
                  alt="United We Care"
                  className="h-16 w-auto hover:opacity-80 transition-opacity duration-200"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">United We Care</CardTitle>
              <p className="text-lg text-muted-foreground">AI Mental Health. Zero Wait.</p>
            </CardHeader>
            <CardContent className="space-y-6 p-8 pt-0">
              <div className="text-left">
                <strong>
                  We imagined a world where mental health is always within reach — so we built it.
                </strong>
                <p className="text-foreground leading-relaxed mb-6">
                  Stella, our AI-powered wellness engine, redefined what support can feel like:
                  intelligent, empathetic, always on. United We Care isn't just advancing technology
                  — we're shaping the future of human connection.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Core Focus Areas
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>AI-driven mental health assessments</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Accessible digital therapeutics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Organizational wellness programs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Ethical AI in healthcare</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Heart className="w-3 h-3 mr-1" />
                  Mental Health
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                  <Brain className="w-3 h-3 mr-1" />
                  AI Healthcare
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Users className="w-3 h-3 mr-1" />
                  Wellness Platform
                </span>
              </div>

              <Button
                asChild
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:opacity-90"
              >
                <a
                  href="https://www.unitedwecare.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  Visit United We Care
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Shunya Labs */}
          <Card className="relative hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-xl border-purple-200/50">
            <CardHeader className="text-center p-8">
              <div className="flex justify-center mb-4">
                <img
                  src="/shortlogo.png"
                  alt="Shunya Labs"
                  className="h-16 w-auto hover:opacity-80 transition-opacity duration-200"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Shunya Labs</CardTitle>
              <p className="text-lg text-muted-foreground">First-Principles AI Labs</p>
            </CardHeader>
            <CardContent className="space-y-6 p-8 pt-0">
              <p className="text-gray-700 leading-relaxed">
                <strong>ShunyaLabs is engineering the next layer of Voice intelligence.</strong> We
                build real-time, on-premise AI for voice, language, and reasoning — fast, private,
                and human-aware. No bloat. No black boxes. Just pure, first-principles tech built
                for trust, not trends.
              </p>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-purple-600" />
                  Key Achievements
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Pingala V1 #1 ranking on Open ASR Leaderboard</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>216 languages supported with 2.94% WER</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Mathematical foundations in speech AI</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>CPU-first architecture for cost efficiency</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <Zap className="w-3 h-3 mr-1" />
                  AI Research
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Globe className="w-3 h-3 mr-1" />
                  Speech Recognition
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  <Brain className="w-3 h-3 mr-1" />
                  Machine Learning
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Partnership Message */}
        {/* <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-teal-50 rounded-2xl p-8 border border-purple-200/50 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                From Mental Health to Speech AI
              </span>
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Shunya Labs emerged from the visionary research team at United We Care, bringing the
              same commitment to human-centered technology innovation. From revolutionizing mental
              healthcare accessibility to breaking down global communication barriers, our journey
              represents a natural evolution—applying AI to solve humanity's most pressing
              challenges, one breakthrough at a time.
            </p>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default OrganizationInfo;
