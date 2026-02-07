import { lazy, Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import patternBg from '@/assets/pattern-bg.jpg';

// Lazy load below-fold sections
const AboutSection = lazy(() => import('@/components/sections/AboutSection'));
const HelpSection = lazy(() => import('@/components/sections/HelpSection'));
const TherapyProcessSection = lazy(() => import('@/components/sections/TherapyProcessSection'));
const ServicesSection = lazy(() => import('@/components/sections/ServicesSection'));
const RulesSection = lazy(() => import('@/components/sections/RulesSection'));
const FAQSection = lazy(() => import('@/components/sections/FAQSection'));
const ContactSection = lazy(() => import('@/components/sections/ContactSection'));

const SectionFallback = () => (
  <div className="section-padding">
    <div className="container-custom glass-card rounded-3xl p-8 md:p-12 lg:p-16 animate-pulse">
      <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-6" />
      <div className="h-4 bg-muted rounded w-2/3 mx-auto mb-3" />
      <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen relative">
      {/* Fixed parallax background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url(${patternBg})` }}
      />

      <div className="relative z-10">
        <Header />
        <main>
          <HeroSection />
          <Suspense fallback={<SectionFallback />}>
            <AboutSection />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <HelpSection />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <TherapyProcessSection />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <ServicesSection />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <RulesSection />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <FAQSection />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <ContactSection />
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
