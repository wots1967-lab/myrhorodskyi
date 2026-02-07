import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { FileText, Video, BookOpen, Download } from 'lucide-react';
import usePageSEO from '@/hooks/usePageSEO';

const categories = [
  { id: 'articles', label: 'Статті', icon: FileText },
  { id: 'videos', label: 'Відео', icon: Video },
  { id: 'guides', label: 'Гайди', icon: BookOpen },
];

const placeholderResources = [
  {
    category: 'articles',
    title: '5 способів справитися зі стресом',
    description: 'Практичні поради для щоденного використання',
    type: 'Стаття',
  },
  {
    category: 'articles',
    title: 'Як розпізнати тривожність',
    description: 'Ознаки та симптоми тривожного розладу',
    type: 'Стаття',
  },
  {
    category: 'videos',
    title: 'Техніка дихання 4-7-8',
    description: 'Відеоінструкція з розслаблюючою технікою',
    type: 'Відео',
  },
  {
    category: 'guides',
    title: 'Щоденник емоцій',
    description: 'Шаблон для відстеження емоційного стану',
    type: 'PDF гайд',
  },
];

const Resources = () => {
  usePageSEO({
    title: 'Корисні матеріали — Психолог Сергій Миргородський',
    description: 'Статті, відео та гайди з психології. Корисні матеріали для вашого психологічного здоров\'я від психолога Сергія Миргородського.',
    canonical: 'https://myrhorodskyi.lovable.app/resources',
    keywords: 'статті психологія, гайди психолога, психологічне здоровʼя, поради психолога',
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
              Додаткові матеріали
            </h1>
            <p className="text-xl text-primary-foreground/80">
              Корисні статті, відео та гайди для вашого психологічного здоров'я
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                <cat.icon size={18} />
                {cat.label}
              </Button>
            ))}
          </motion.div>

          {/* Resources Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeholderResources.map((resource, index) => (
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
                <Button variant="ghost" className="text-secondary" disabled>
                  <Download size={16} className="mr-2" />
                  Скоро
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
              Більше матеріалів вже скоро!
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Ми регулярно додаємо нові корисні матеріали. Підпишіться, щоб не пропустити.
            </p>
            <Button variant="cta" size="lg" asChild>
              <a href="https://t.me/SigurdPSYBot?start=64f8747ec7512692c00d1788" target="_blank" rel="noopener noreferrer">Підписатися</a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;
