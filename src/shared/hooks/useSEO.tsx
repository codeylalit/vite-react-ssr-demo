import { useEffect } from 'react';

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: readonly string[] | string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  siteName?: string;
  locale?: string;
  twitterHandle?: string;
  canonicalUrl?: string;
  structuredData?: object;
  noIndex?: boolean;
  noFollow?: boolean;
}

const DEFAULT_SEO: Required<Omit<SEOData, 'structuredData'>> = {
  title: 'Shunya Labs - Advanced ASR & Voice AI Technology Platform',
  description:
    "Meet the world's most advanced Automatic Speech Recognition (ASR) engine by Shunya Labs. Support for 100+ languages, real-time transcription, and enterprise-grade voice AI solutions.",
  keywords: [
    'ASR',
    'speech recognition',
    'voice AI',
    'automatic speech recognition',
    'voice technology',
    'transcription',
    'multilingual ASR',
    'real-time speech',
    'voice analytics',
    'AI transcription',
    'speech to text',
    'voice processing',
    'language models',
    'voice synthesis',
    'audio processing',
    'Shunya Labs',
  ],
  image: '/logo.png',
  url: 'https://shunyalabs.ai',
  type: 'website',
  siteName: 'Shunya Labs',
  locale: 'en_US',
  twitterHandle: '@shunya_labs',
  canonicalUrl: 'https://shunyalabs.ai',
  noIndex: false,
  noFollow: false,
};

export const useSEO = (seoData: Partial<SEOData> = {}) => {
  const mergedSEO = { ...DEFAULT_SEO, ...seoData };

  useEffect(() => {
    // Update document title
    if (mergedSEO.title) {
      document.title = mergedSEO.title;
    }

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }

      meta.content = content;
    };

    // Basic meta tags
    updateMetaTag('description', mergedSEO.description);
    updateMetaTag('keywords', mergedSEO.keywords.join(', '));
    updateMetaTag('author', 'Shunya Labs');
    updateMetaTag(
      'robots',
      `${mergedSEO.noIndex ? 'noindex' : 'index'},${mergedSEO.noFollow ? 'nofollow' : 'follow'}`
    );

    // Open Graph tags
    updateMetaTag('og:title', mergedSEO.title, true);
    updateMetaTag('og:description', mergedSEO.description, true);
    updateMetaTag('og:image', `${mergedSEO.url}${mergedSEO.image}`, true);
    updateMetaTag('og:url', mergedSEO.canonicalUrl, true);
    updateMetaTag('og:type', mergedSEO.type, true);
    updateMetaTag('og:site_name', mergedSEO.siteName, true);
    updateMetaTag('og:locale', mergedSEO.locale, true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:site', mergedSEO.twitterHandle);
    updateMetaTag('twitter:creator', mergedSEO.twitterHandle);
    updateMetaTag('twitter:title', mergedSEO.title);
    updateMetaTag('twitter:description', mergedSEO.description);
    updateMetaTag('twitter:image', `${mergedSEO.url}${mergedSEO.image}`);

    // Additional SEO tags
    updateMetaTag('theme-color', '#2d4cc8');
    updateMetaTag('msapplication-TileColor', '#2d4cc8');
    updateMetaTag('apple-mobile-web-app-title', 'ZeroVoice');

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = mergedSEO.canonicalUrl;

    // Structured Data (JSON-LD)
    if (mergedSEO.structuredData) {
      let structuredDataScript = document.querySelector(
        'script[type="application/ld+json"]'
      ) as HTMLScriptElement;
      if (!structuredDataScript) {
        structuredDataScript = document.createElement('script');
        structuredDataScript.type = 'application/ld+json';
        document.head.appendChild(structuredDataScript);
      }
      structuredDataScript.textContent = JSON.stringify(mergedSEO.structuredData);
    }

    // Language and direction
    document.documentElement.lang = mergedSEO.locale.split('_')[0];
    document.documentElement.dir = 'ltr';
  }, [mergedSEO]);

  return mergedSEO;
};

// Predefined SEO configurations for different pages
export const SEO_CONFIGS = {
  landing: {
    title: 'Advanced ASR & Voice AI Technology Platform | Shunya Labs',
    description:
      "Meet the world's most advanced Automatic Speech Recognition (ASR) engine by Shunya Labs. Support for 100+ languages, real-time transcription, and enterprise-grade voice AI solutions.",
    keywords: [
      'ASR',
      'speech recognition',
      'voice AI',
      'automatic speech recognition',
      'voice technology',
      'transcription',
      'multilingual ASR',
      'real-time speech',
      'voice analytics',
      'AI transcription',
      'Shunya Labs',
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Shunya Labs ASR Engine',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description:
        'Advanced Automatic Speech Recognition (ASR) engine by Shunya Labs supporting 100+ languages with real-time transcription capabilities.',
      url: 'https://shunyalabs.ai',
      publisher: {
        '@type': 'Organization',
        name: 'Shunya Labs',
        url: 'https://shunyalabs.ai',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.shunyalabs.ai/logo.png',
        },
      },
      offers: {
        '@type': 'Offer',
        category: 'SaaS',
        availability: 'https://schema.org/InStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '1000',
      },
      features: [
        'Real-time Speech Recognition',
        '100+ Language Support',
        'Enterprise API Integration',
        'Voice Analytics',
        'Custom Model Training',
        'High Accuracy Transcription',
      ],
    },
  },

  verbatim: {
    title: 'Local Offline speech‑to‑text (Automatic Speech Recognition) engine | Shunya Labs',
    description:
      'Verbatim by Shunya Labs is a local, offline speech-to-text engine that delivers accurate Automatic Speech Recognition (ASR) directly on your device. No cloud, no internet dependency—fast, secure, and private speech transcription anytime, anywhere.',
    keywords: [
      'Offline speech to text',
      'Local speech recognition',
      'On-device speech to text',
      'Automatic Speech Recognition (ASR) engine',
      'Private speech to text',
      'Speech recognition without internet',
      'Secure voice transcription',
      'AI speech to text offline',
      'No cloud speech recognition',
      'Fast offline transcription',
    ],
  },

  reason: {
    title: 'Emotional & Culturally Tuned Voice AI | Shunya Labs',
    description:
      'Shunya Labs is an advanced voice AI that delivers expressive, emotionally nuanced, and culturally adapted text-to-speech in any language or tone.',
    keywords: [
      'Emotional text-to-speech AI',
      'Voice AI with prosody control',
      'Culturally tuned text-to-speech',
      'Expressive voice synthesis engine',
      'Human-like TTS',
      'Advanced speech synthesis',
      'AI voice with emotion',
      'Prosody control voice AI',
      'Multilingual expressive TTS',
    ],
  },

  echo: {
    title: 'Context-Aware Voice AI Engine | Echo by Shunya Labs',
    description:
      'Echo by Shunya Labs is a smart voice AI engine that understands speech, maintains conversational context, and responds intelligently on-device.',
    keywords: [
      'Context-aware voice AI',
      'Conversational AI engine',
      'Speech understanding AI',
      'On-device voice AI',
      'Voice AI with memory',
      'Intelligent speech processing',
      'Offline conversational AI',
      'ASR with context retention',
    ],
  },

  stream: {
    title: 'Real-Time Multilingual ASR Platform | Stream by Shunya Labs',
    description:
      'Stream by Shunya Labs is an advanced ASR & Voice AI platform offering real-time transcription in 100+ languages—fast, secure, and deployable anywhere.',
    keywords: [
      'Real-time ASR platform',
      'Multilingual speech recognition engine',
      'Live transcription AI',
      'Voice AI technology platform',
      '100+ language speech-to-text',
      'Global voice recognition engine',
      'On-prem real-time transcription',
      'Advanced ASR for developers',
    ],
  },

  pingala: {
    title: 'Ultra-Accurate, Real-Time ASR | Pingala V1 by Shunya Labs',
    description:
      'Pingala V1 by Shunya Labs is a groundbreaking ASR model—CPU-ready, ultra-low latency, 200+ languages, record-setting accuracy (under 3% WER), HIPAA-ready.',
    keywords: [
      'Ultra-accurate ASR model',
      'CPU-based speech recognition',
      'Real-time automatic speech recognition',
      'Multilingual ASR engine',
      'Low latency speech-to-text',
      '200+ languages ASR',
      'HIPAA-compliant ASR',
      'On-premise ASR deployment',
    ],
  },

  pricing: {
    title: 'Shunya Labs Pricing',
    description:
      "Explore Shunya Labs' pricing: Pro tier with base fee plus usage‑based charges—TTS billed per character, ASR billed per minute of transcription.",
    keywords: [
      'Shunya Labs pricing',
      'ASR pricing model',
      'Voice AI pricing',
      'TTS pricing per character',
      'Usage‑based ASR billing',
      'Pro tier voice AI cost',
      'ASR billed per minute',
      'TTS billed per character',
    ],
  },

  about: {
    title: 'About Shunya Labs',
    description:
      'Shunya Labs builds real-time, privacy-first AI infrastructure for voice, language & reasoning—rooted in healthcare, designed for global, on-prem deployments.',
    keywords: ['About Shunya Labs'],
  },

  contact: {
    title: 'Contact Us - Book a Demo | Shunya Labs',
    description:
      'Get in touch with Shunya Labs to book a demo of our advanced ASR and voice AI technology. Experience our speech recognition solutions firsthand.',
    keywords: [
      'Contact Shunya Labs',
      'Book demo',
      'ASR demo',
      'Voice AI demo',
      'Speech recognition demo',
      'Get in touch',
      'Shunya Labs contact',
    ],
  },

  earlyAccess: {
    title: 'Early Access Program | Shunya Labs',
    description:
      'Join the Shunya Labs Early Access Program to get exclusive access to our latest voice AI and ASR technologies before they are publicly available.',
    keywords: [
      'Early access',
      'Beta program',
      'Voice AI early access',
      'ASR beta',
      'Exclusive access',
      'Shunya Labs beta',
      'Voice technology preview',
    ],
  },

  dashboard: {
    title: 'Dashboard - Shunya Labs',
    description:
      'Manage your voice AI projects, API keys, and analytics with Shunya Labs dashboard.',
    noIndex: true,
  },

  privacy: {
    title: 'Privacy Policy - Shunya Labs',
    description: 'Learn how Shunya Labs protects your privacy and handles your data securely.',
    type: 'article' as const,
  },

  terms: {
    title: 'Terms & Conditions - Shunya Labs',
    description: 'Read the terms and conditions for using Shunya Labs services and platform.',
    type: 'article' as const,
  },
} as const;
