import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import HelpSection from '@/components/sections/HelpSection';
import TherapyProcessSection from '@/components/sections/TherapyProcessSection';
import ServicesSection from '@/components/sections/ServicesSection';
import RulesSection from '@/components/sections/RulesSection';
import FAQSection from '@/components/sections/FAQSection';
import ContactSection from '@/components/sections/ContactSection';
import patternBg from '@/assets/pattern-bg.jpg';

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
          <AboutSection />
          <HelpSection />
          <TherapyProcessSection />
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
