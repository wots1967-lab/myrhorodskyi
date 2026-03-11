import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Brain, Clock, Target, Heart, Dna, Drama, Puzzle, Users, HeartHandshake, Flame, FileText, Compass, Layers } from 'lucide-react';
import usePageSEO, { createTestJsonLd } from '@/hooks/usePageSEO';
const patternBg = '/pattern-bg.jpg';

const tests = [
  {
    icon: Brain,
    title: 'Шкала тривоги Бека (BAI)',
    description: 'Оцініть рівень вашої тривожності за допомогою стандартизованого тесту з 21 питання',
    duration: '~5 хвилин',
    available: true,
    link: '/tests/shkala-tryvohy-beka',
  },
  {
    icon: Dna,
    title: 'Тест Бровермана (Нейромедіатори)',
    description: 'Оцініть баланс нейромедіаторів за допомогою комплексного тесту з 140 питань',
    duration: '~15-20 хвилин',
    available: true,
    link: '/tests/test-neiromediatoriv-brovermana',
  },
  {
    icon: Heart,
    title: 'Шкала депресії Бека (BDI)',
    description: 'Оцініть наявність та ступінь депресивних симптомів за допомогою визнаного у світі тесту',
    duration: '~5-10 хвилин',
    available: true,
    link: '/tests/shkala-depresii-beka',
  },
  {
    icon: Target,
    title: 'Шкала сприйнятого стресу (PSS-10)',
    description: 'Визначте рівень вашого стресового навантаження за останній місяць',
    duration: '~3 хвилини',
    available: true,
    link: '/tests/shkala-stresu-pss10',
  },
  {
    icon: Drama,
    title: 'Темна Тріада (SD3)',
    description: 'Оцініть рівень трьох рис особистості: Макіавеллізму, Нарцисизму та Психопатії',
    duration: '~5 хвилин',
    available: true,
    link: '/tests/temna-triada',
  },
  {
    icon: Puzzle,
    title: 'Тест на темперамент (EPI)',
    description: 'Визначте свій тип темпераменту та особливості нервової системи за методикою Ганса Айзенка',
    duration: '~10-15 хвилин',
    available: true,
    link: '/tests/temperament-aizenka',
  },
  {
    icon: Users,
    title: 'Профіль Его-станів',
    description: 'Визначте свій унікальний профіль п\'яти функціональних Его-станів за методикою Джулі Хей (транзакційний аналіз)',
    duration: '~7 хвилин',
    available: true,
    link: '/tests/profil-ego-staniv',
  },
  {
    icon: HeartHandshake,
    title: '5 Мов Любові',
    description: 'Дізнайтеся, як ви найкраще сприймаєте та виражаєте любов у стосунках за методикою Ґері Чепмена',
    duration: '~7 хвилин',
    available: true,
    link: '/tests/5-mov-lyubovi',
  },
  {
    icon: Flame,
    title: 'Розширений Профіль Его-станів (6 станів)',
    description: 'Глибинний аналіз особистості з 6 его-станами: окреме вимірювання Слухняної та Бунтуючої Дитини для точнішого профілю',
    duration: '~10 хвилин',
    available: true,
    link: '/tests/rozshyrenyi-profil-ego-staniv',
  },
  {
    icon: FileText,
    title: 'Опитувальник Ранніх Схем Янга (YSQ-S3)',
    description: 'Глибинна діагностика 18 ранніх дезадаптивних схем за методикою схема-терапії. 90 тверджень для виявлення глибинних переконань',
    duration: '~15-20 хвилин',
    available: true,
    link: '/tests/opytuvalnyk-rannih-shem-ysq',
  },
  {
    icon: Compass,
    title: 'Діагностика Самості (Self) — IFS',
    description: 'Оцінка рівня доступу до 8 якостей Самості (Self-Leadership) за моделлю Внутрішніх Сімейних Систем. Радарна діаграма профілю',
    duration: '~5 хвилин',
    available: true,
    link: '/tests/diagnostyka-samosti-ifs',
  },
  {
    icon: Layers,
    title: 'Клінічна Шкала IFS (57 пунктів)',
    description: 'Комплексний профіль внутрішньої системи: Самість, Захисники (Критик, Доглядач, Тривожний) та Вигнанці. Радарна діаграма та клінічний аналіз',
    duration: '~10-15 хвилин',
    available: true,
    link: '/tests/klinichna-shkala-ifs',
  },
];

const Tests = () => {
  usePageSEO({
    title: 'Психологічні тести онлайн безкоштовно — Пройти тест українською',
    description: 'Безкоштовні психологічні тести онлайн українською: тест тривожності Бека, депресії, стресу, темпераменту Айзенка, темна тріада, его-стани, 5 мов любові. Миттєві результати.',
    canonical: 'https://myrhorodskyi.com/tests',
    keywords: 'психологічні тести онлайн безкоштовно, тест тривожності, тест депресії, тест на стрес, тест Айзенка, темна тріада, тест его-станів, 5 мов любові, психологічний тест українською',
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero with pattern */}
      <section
        className="pt-32 pb-16 bg-primary relative overflow-hidden"
        style={{
          backgroundImage: `url(${patternBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-primary/85" />
        <div className="container-custom section-padding py-16 relative z-10">
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
                className="bg-card rounded-2xl p-8 shadow-sm border border-border card-hover text-center flex flex-col"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <test.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {test.title}
                </h3>
                <p className="text-muted-foreground mb-4 flex-1">{test.description}</p>
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
