import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import HelpSection from '@/components/sections/HelpSection';
import TherapyProcessSection from '@/components/sections/TherapyProcessSection';
import TopicsSection from '@/components/sections/TopicsSection';
import ServicesSection from '@/components/sections/ServicesSection';
import RulesSection from '@/components/sections/RulesSection';
import FAQSection from '@/components/sections/FAQSection';
import ContactSection from '@/components/sections/ContactSection';
import usePageSEO from '@/hooks/usePageSEO';

const Index = () => {
  usePageSEO({
    title: 'Психолог онлайн Сергій Миргородський | Консультація українською',
    description: 'Психолог онлайн. Працюю з тривогою, вигоранням, стосунками, кризами ідентичності. Інтегративний підхід: CBT, схема-терапія, IFS, юнгіанський аналіз. Консультації українською для клієнтів в Україні та за кордоном.',
    canonical: 'https://myrhorodskyi.com/',
    keywords: 'психолог онлайн, психолог українською, консультація психолога, тривога, вигорання, стосунки, схема-терапія, юнгіанський аналіз, IFS, психолог для українців, психолог за кордоном',
  });

  return (
    <div className="min-h-[100dvh] pattern-bg">
      <div>
        <div id="scroll-sentinel" className="absolute top-0 left-0 w-full h-[1px]" />
        <Header />
        <main>
          <HeroSection />
          <AboutSection />
          <HelpSection />
          <TherapyProcessSection />
          <TopicsSection />
          <ServicesSection />
          <RulesSection />
          <FAQSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
