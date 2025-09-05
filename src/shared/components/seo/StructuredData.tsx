import React from 'react';

interface StructuredDataProps {
  data: object;
}

/**
 * Component for adding structured data (JSON-LD) to specific sections
 * This helps search engines understand the content better
 */
export const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
};

// Predefined structured data schemas for common use cases
export const STRUCTURED_DATA_SCHEMAS = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Shunya Labs',
    url: 'https://shunyalabs.ai',
    logo: 'https://www.shunyalabs.ai/logo.png',
    description:
      'Shunya Labs is an advanced voice AI technology company specializing in automatic speech recognition and voice processing solutions.',
    foundingDate: '2023',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '2810 N Church Street',
      addressLocality: 'Wilmington',
      addressRegion: 'Delaware',
      postalCode: '19802',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-000-000-0000',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
    sameAs: [
      'https://twitter.com/shunya_labs',
      'https://linkedin.com/company/shunya-labs',
      'https://github.com/shunya-labs',
    ],
    makesOffer: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'SoftwareApplication',
        name: 'Advanced ASR Engine',
        description: 'Advanced ASR engine with 100+ language support',
      },
    },
  },

  product: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Shunya Labs ASR Engine',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, API',
    description:
      'Advanced Automatic Speech Recognition (ASR) engine by Shunya Labs supporting 100+ languages with real-time transcription capabilities.',
    url: 'https://shunyalabs.ai',
    softwareVersion: '2.0',
    releaseNotes: 'Enhanced accuracy and expanded language support',
    downloadUrl: 'https://shunyalabs.ai/dashboard',
    screenshot: 'https://www.shunyalabs.ai/logo.png',
    applicationSubCategory: 'Voice Recognition Software',
    publisher: {
      '@type': 'Organization',
      name: 'Shunya Labs',
      url: 'https://shunyalabs.ai',
    },
    creator: {
      '@type': 'Organization',
      name: 'Shunya Labs',
    },
    offers: {
      '@type': 'Offer',
      category: 'SaaS',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'USD',
        price: '0.01',
        unitText: 'per minute',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1000',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Enterprise Customer',
        },
        datePublished: '2024-12-01',
        reviewBody:
          'Exceptional accuracy and fast processing by Shunya Labs. Perfect for our multilingual customer support.',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
      },
    ],
  },

  faq: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Shunya Labs?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Shunya Labs is an advanced voice AI technology company specializing in automatic speech recognition and voice processing solutions, offering the world's most advanced ASR engine with 100+ language support.",
        },
      },
      {
        '@type': 'Question',
        name: 'What does Shunya Labs offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Shunya Labs offers advanced Automatic Speech Recognition (ASR) technology, supporting 100+ languages with real-time transcription capabilities and enterprise-grade accuracy.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many languages does Shunya Labs support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Shunya Labs supports over 100 languages including major languages like English, Spanish, French, German, Chinese, Hindi, Arabic, and many more regional languages.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the accuracy rate?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Shunya Labs' ASR engine achieves industry-leading accuracy rates of 95%+ for major languages and 90%+ for most supported languages, depending on audio quality and language complexity.",
        },
      },
      {
        '@type': 'Question',
        name: 'Is Shunya Labs suitable for enterprise use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Shunya Labs is designed for enterprise applications with features like API integration, custom model training, real-time processing, and enterprise-grade security.',
        },
      },
    ],
  },

  breadcrumbList: (items: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),
};

export default StructuredData;
