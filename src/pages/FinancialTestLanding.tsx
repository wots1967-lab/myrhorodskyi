import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Clock, FileText, Target, Brain, Shield } from 'lucide-react';
import usePageSEO from '@/hooks/usePageSEO';

const FinancialTestLanding = () => {
  usePageSEO({
    title: 'Глибокий аналіз фінансової особистості | Психолог Сергій Миргородський',
    description: 'Безкоштовний психодіагностичний тест: 140 питань, 14 блоків. Фінансовий психологічний портрет, карта внутрішніх блокувань, діагностика фінансової стелі.',
    canonical: 'https://myrhorodskyi.com/tests/finansova-osobystist',
    keywords: 'фінансова психологія, тест фінансова особистість, фінансові переконання, грошові блоки',
  });

  const benefits = [
    { icon: Brain, text: 'Фінансовий психологічний портрет' },
    { icon: Target, text: 'Карта ключових блоків, що зупиняють твоє зростання' },
    { icon: Shield, text: 'Діагностику фінансової стелі' },
    { icon: FileText, text: 'Звіт для передачі консультанту/терапевту (PDF)' },
  ];

  const howTo = [
    'Відповідай чесно — тут немає правильних чи неправильних відповідей',
    'Якщо потрібна пауза — натисни "Пауза", прогрес збережеться',
    'Автозбереження працює після кожної відповіді',
    'Можна повернутися до попередніх блоків',
    'На відкриті питання відповідай першою думкою — не фільтруй',
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-16 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/90" />
        <div className="container-custom section-padding py-16 relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
            Глибокий аналіз фінансової особистості
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-4 flex items-center justify-center gap-4 flex-wrap">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 140 питань</span>
            <span>·</span>
            <span>60–90 хвилин</span>
            <span>·</span>
            <span>безкоштовно</span>
            <span>·</span>
            <span>конфіденційно</span>
          </p>
          <p className="text-primary-foreground/70 text-base max-w-xl mx-auto">
            Психодіагностичний інструмент, що досліджує твої глибинні переконання, емоційні патерни та поведінкові сценарії у стосунках з грошима. Результат — структурований звіт для роботи з консультантом.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          {/* What you get */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Що ти отримаєш</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((b) => (
                <div key={b.text} className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border">
                  <b.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How to take */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Як проходити</h2>
            <ol className="space-y-3">
              {howTo.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center flex-shrink-0 font-medium">{i + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>

          {/* CTA */}
          <div className="text-center mb-8">
            <Button variant="cta" size="lg" asChild className="text-lg px-10 py-6">
              <Link to="/tests/finansova-osobystist/take">Почати тест</Link>
            </Button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground/60 text-center max-w-lg mx-auto">
            Тест є діагностичним інструментом і не замінює психотерапію. Для клінічних станів звертайся до фахівця. Усі дані обробляються локально у твоєму браузері.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FinancialTestLanding;
