import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Brain, Clock, Target, Heart, Dna } from 'lucide-react';
import usePageSEO from '@/hooks/usePageSEO';

const tests = [
  {
    icon: Brain,
    title: 'Шкала тривоги Бека (BAI)',
    description: 'Оцініть рівень вашої тривожності за допомогою стандартизованого тесту з 21 питання',
    duration: '~5 хвилин',
    available: true,
    link: '/tests/beck-anxiety',
  },
  {
    icon: Dna,
    title: 'Тест Бровермана (Нейромедіатори)',
    description: 'Оцініть баланс нейромедіаторів за допомогою комплексного тесту з 140 питань',
    duration: '~15-20 хвилин',
    available: true,
    link: '/tests/broverman',
  },
  {
    icon: Heart,
    title: 'Шкала депресії Бека (BDI)',
    description: 'Оцініть наявність та ступінь депресивних симптомів за допомогою визнаного у світі тесту',
    duration: '~5-10 хвилин',
    available: true,
    link: '/tests/beck-depression',
  },
  {
    icon: Target,
    title: 'Шкала сприйнятого стресу (PSS-10)',
    description: 'Визначте рівень вашого стресового навантаження за останній місяць',
    duration: '~3 хвилини',
    available: true,
    link: '/tests/pss10',
  },
];

const Tests = () => {
  usePageSEO({
    title: 'Психологічні тести онлайн — Психолог Сергій Миргородський',
    description: 'Безкоштовні психологічні тести онлайн: шкала тривоги Бека, тест нейромедіаторів Бровермана. Перевірте свій емоційний стан.',
    canonical: 'https://myrhorodskyi.lovable.app/tests',
    keywords: 'психологічні тести онлайн, тест тривожності, шкала Бека, тест нейромедіаторів, психологічна діагностика',
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 pb-16 bg-primary">
        <div className="container-custom section-padding py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Психологічні тести
            </h1>
            <p className="text-xl text-primary-foreground/80">
              Дізнайтеся більше про свій емоційний стан за допомогою науково обґрунтованих психологічних тестів
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tests Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tests.map((test, index) => (
              <motion.div
                key={test.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 shadow-sm border border-border card-hover text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <test.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {test.title}
                </h3>
                <p className="text-muted-foreground mb-4">{test.description}</p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
                  <Clock size={16} />
                  {test.duration}
                </div>
                {test.available ? (
                  <Button variant="cta" className="w-full" asChild>
                    <Link to={test.link}>Пройти тест</Link>
                  </Button>
                ) : (
                  <Button variant="ctaOutline" className="w-full" disabled>
                    Скоро доступно
                  </Button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Coming Soon Notice */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center bg-muted rounded-2xl p-8"
          >
            <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
              Більше тестів незабаром!
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Ми готуємо якісні психологічні тести для вас. Пройдіть доступні тести вже зараз або запишіться на консультацію.
            </p>
            <Button variant="cta" size="lg" asChild>
              <a href="https://t.me/SigurdPSYBot?start=64f8747ec7512692c00d1788" target="_blank" rel="noopener noreferrer">Записатися на консультацію</a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tests;
