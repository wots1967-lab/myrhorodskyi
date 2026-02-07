import { lazy, Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import usePageSEO from '@/hooks/usePageSEO';
import patternBg from '@/assets/pattern-bg.jpg';

// Lazy load below-fold sections
const AboutSection = lazy(() => import('@/components/sections/AboutSection'));
const HelpSection = lazy(() => import('@/components/sections/HelpSection'));
const TherapyProcessSection = lazy(() => import('@/components/sections/TherapyProcessSection'));
const TopicsSection = lazy(() => import('@/components/sections/TopicsSection'));
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
  usePageSEO({
    title: 'Сергій Миргородський — Психолог | Консультації онлайн',
    description: 'Психолог Сергій Миргородський — індивідуальні консультації, психотерапія, КПТ, схема-терапія. Запишіться на онлайн-консультацію.',
    canonical: 'https://myrhorodskyi.lovable.app/',
    keywords: 'психолог, Миргородський Сергій, психотерапія, знайти психолога, онлайн психолог, консультація психолога, КПТ, когнітивно-поведінкова терапія, схема-терапія, тривожність, стрес',
  });

  return (
    <div className="min-h-[100dvh] relative">
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
            <HelpSection />
            <TherapyProcessSection />
            <TopicsSection />
            <ServicesSection />
            <RulesSection />
            <FAQSection />
            <ContactSection />
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
