import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Users } from 'lucide-react';
import usePageSEO from '@/hooks/usePageSEO';

const placeholderCourses = [
  {
    title: 'Управління стресом',
    description: 'Практичний курс з техніками зменшення тривоги та відновлення балансу',
    duration: '4 тижні',
    students: '25+',
    price: 'Скоро',
  },
  {
    title: 'Емоційний інтелект',
    description: 'Розвиток навичок розпізнавання та управління емоціями',
    duration: '6 тижнів',
    students: '30+',
    price: 'Скоро',
  },
  {
    title: 'Здорові відносини',
    description: 'Побудова гармонійних стосунків з оточуючими',
    duration: '5 тижнів',
    students: '20+',
    price: 'Скоро',
  },
];

const Courses = () => {
  usePageSEO({
    title: 'Курси та програми — Психолог Сергій Миргородський',
    description: 'Навчальні курси з психології: управління стресом, емоційний інтелект, здорові відносини. Психолог Сергій Миргородський.',
    canonical: 'https://myrhorodskyi.lovable.app/courses',
    keywords: 'курси психології, управління стресом, емоційний інтелект, психолог курси онлайн',
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
              Курси та навчальні програми
            </h1>
            <p className="text-xl text-primary-foreground/80">
              Поглиблюйте знання про себе та розвивайте навички психологічного благополуччя
            </p>
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {placeholderCourses.map((course, index) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-sm border border-border card-hover"
              >
                <div className="aspect-video bg-muted rounded-xl mb-6 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground/50" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {course.title}
                </h3>
                <p className="text-muted-foreground mb-4">{course.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={16} />
                    {course.students}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl font-bold text-secondary">
                    {course.price}
                  </span>
                  <Button variant="ctaOutline" disabled>
                    Незабаром
                  </Button>
                </div>
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
              Нові курси вже скоро!
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Ми працюємо над новими навчальними програмами. Залиште свій email, щоб дізнатися першими про запуск.
            </p>
            <Button variant="cta" size="lg" asChild>
              <a href="https://t.me/SigurdPSYBot?start=64f8747ec7512692c00d1788" target="_blank" rel="noopener noreferrer">Отримати сповіщення</a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Courses;
