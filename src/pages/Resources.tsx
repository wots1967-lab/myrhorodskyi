import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { BOT_URL } from '@/lib/links';
import usePageSEO from '@/hooks/usePageSEO';
const patternBg = '/pattern-bg.webp';

const resources = [
  {
    category: 'guides',
    title: 'Анкета Глибинного Опрацювання Образу',
    description: 'Інструмент на базі КПТ та Радикального Прийняття для роботи з образами.',
    type: 'Методика',
    link: 'https://time-dove-276.notion.site/310d5bd7dec0801da501f7e9e7dae8f7',
  },
  {
    category: 'guides',
    title: 'Програма створення майбутнього (Future Authoring)',
    description: 'Вправа для побудови чіткого бачення свого життя на 3-5 років та розробки покрокового плану його втілення.',
    type: 'Методика',
    link: 'https://time-dove-276.notion.site/Future-Authoring-310d5bd7dec080248753d422bcfa90fb',
  },
];

const Resources = () => {
  usePageSEO({
    title: 'Психологічні матеріали та статті | Психолог Сергій Миргородський',
    description: 'Корисні статті та матеріали з психології: тривога, стосунки, самооцінка, вигорання, сепарація. Практичні інструменти для самостійної роботи.',
    canonical: 'https://myrhorodskyi.com/resources',
    keywords: 'статті з психології, психологічні матеріали, самодопомога, тривога, вигорання, стосунки, самооцінка',
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
              Додаткові матеріали
            </h1>
            <p className="text-xl text-primary-foreground/80">
              Практичні методики та вправи для самостійної роботи
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Resources Grid */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-sm border border-border card-hover"
              >
                <span className="inline-block text-xs font-medium text-secondary bg-secondary/10 px-3 py-1 rounded-full mb-4">
                  {resource.type}
                </span>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {resource.title}
                </h3>
                <p className="text-muted-foreground mb-4">{resource.description}</p>
                <Button variant="ghost" className="text-secondary" asChild>
                  <a href={resource.link} target="_blank" rel="noopener noreferrer">
                    <BookOpen size={16} className="mr-2" />
                    Переглянути
                  </a>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Coming Soon Notice */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 text-center bg-muted rounded-2xl p-8"
          >
            <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
              Нові матеріали з'являтимуться тут
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Щоб не пропустити, напиши в Telegram-бот.
            </p>
            <Button variant="cta" size="lg" asChild>
              <a href={BOT_URL} target="_blank" rel="noopener noreferrer">Написати в бот</a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;
