import { lazy, Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import usePageSEO from '@/hooks/usePageSEO';

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
    title: 'Психолог Сергій Миргородський | Онлайн консультація українською',
    description: 'Психолог онлайн. Працюю з тривогою, вигоранням, стосунками, кризами ідентичності. Інтегративний підхід: CBT, схема-терапія, IFS, юнгіанський аналіз. Консультації українською для клієнтів в Україні та за кордоном.',
    canonical: 'https://myrhorodskyi.com/',
    keywords: 'психолог онлайн, психолог українською, консультація психолога, тривога, вигорання, стосунки, схема-терапія, юнгіанський аналіз, IFS, психолог для українців, психолог за кордоном',
  });

  return (
    <div
      className="min-h-[100dvh]"
      style={{
        backgroundImage: `url(/pattern-bg.jpg)`,
        backgroundSize: '100% auto',
        backgroundPosition: 'center top',
        backgroundRepeat: 'repeat-y',
        backgroundAttachment: 'scroll',
        backgroundColor: 'hsl(163, 50%, 12%)',
      }}
    >
      <div>
        <div id="scroll-sentinel" className="absolute top-0 left-0 w-full h-[1px]" />
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
