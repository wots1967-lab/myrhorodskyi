import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Brain, Clock, Target, Heart } from 'lucide-react';

const placeholderTests = [
  {
    icon: Brain,
    title: 'Тест на тривожність',
    description: 'Визначте рівень вашої тривожності та отримайте рекомендації',
    duration: '5-7 хв',
  },
  {
    icon: Heart,
    title: 'Тест на депресію',
    description: 'Оцініть свій емоційний стан за шкалою Бека',
    duration: '10 хв',
  },
  {
    icon: Target,
    title: 'Тест на стрес',
    description: 'Визначте рівень стресу у вашому житті',
    duration: '7 хв',
  },
];

const Tests = () => {
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
              Пройдіть безкоштовні тести для кращого розуміння себе та своїх потреб
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tests Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {placeholderTests.map((test, index) => (
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
                <Button variant="ctaOutline" className="w-full" disabled>
                  Скоро доступно
                </Button>
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
              Тести вже незабаром!
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Ми готуємо якісні психологічні тести для вас. Результати можна буде отримати на email.
            </p>
            <Button variant="cta" size="lg" asChild>
              <a href="/#contact">Записатися на консультацію</a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tests;
