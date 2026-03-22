import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string;
  ogType?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown>;
}

const BASE_URL = 'https://myrhorodskyi.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;
const SITE_NAME = 'Психолог Сергій Миргородський';

const usePageSEO = ({ title, description, canonical, keywords, ogType = 'website', ogImage, jsonLd }: SEOProps) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Basic meta
    setMeta('description', description);
    if (keywords) setMeta('keywords', keywords);

    // Open Graph
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', ogType, true);
    setMeta('og:locale', 'uk_UA', true);
    setMeta('og:site_name', SITE_NAME, true);
    setMeta('og:image', ogImage || DEFAULT_OG_IMAGE, true);

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage || DEFAULT_OG_IMAGE);

    // Canonical & og:url
    if (canonical) {
      setMeta('og:url', canonical, true);
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }

    // JSON-LD structured data
    if (jsonLd) {
      const existingScript = document.querySelector('script[data-page-jsonld]');
      if (existingScript) existingScript.remove();
      
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-page-jsonld', 'true');
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);

      return () => {
        script.remove();
      };
    }
  }, [title, description, canonical, keywords, ogType, ogImage, jsonLd]);
};

export default usePageSEO;

// Reusable JSON-LD generator for psychological tests
export function createTestJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  questionCount: number;
  duration: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": opts.name,
    "description": opts.description,
    "url": opts.url,
    "educationalLevel": "beginner",
    "inLanguage": "uk",
    "numberOfQuestions": opts.questionCount,
    "timeRequired": opts.duration,
    "isAccessibleForFree": true,
    "provider": {
      "@type": "Person",
      "name": "Сергій Миргородський",
      "jobTitle": "Психолог",
      "url": "https://myrhorodskyi.com",
    },
    "about": {
      "@type": "Thing",
      "name": "Психологічне тестування",
    },
  };
}
