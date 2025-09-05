import React from 'react';
import { Card } from '@/shared/components/ui/card';

const featuredLanguages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'de', name: 'German', native: 'Deutsch' },
];

const LanguageCards = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Featured Languages</h3>
        <p className="text-gray-600">
          Experience seamless transcription across cultures and continents
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
        {featuredLanguages.map((language, index) => (
          <Card
            key={language.code}
            className="p-4 text-center hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="space-y-2">
              <div className="text-2xl font-bold text-[#2d4cc8] group-hover:scale-110 transition-transform">
                {language.native}
              </div>
              <div className="text-xs text-gray-600">{language.name}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500 mb-4">+ 140 more languages available</p>
        <button className="text-[#2d4cc8] hover:text-[#1a1947] font-medium transition-colors">
          See All Languages →
        </button>
      </div>
    </div>
  );
};

export default LanguageCards;
