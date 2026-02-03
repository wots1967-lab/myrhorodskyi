import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Brain, Waves, Users, Target } from 'lucide-react';

const helpItems = [
  {
    icon: Brain,
    title: 'Пізнати краще себе та свої емоції',
    description:
      'Дозвольте мені стати вашим провідником у внутрішній світ вашої особистості. Разом ми дослідимо ваші думки, патерни поведінки та емоції, щоб ви здобули глибоке розуміння себе та усвідомили, які фактори впливають на ваше життя.',
  },
  {
    icon: Waves,
    title: 'Подолати стрес та тривогу',
    description:
      'Разом ми розробимо персональні стратегії для подолання стресу та тривоги. Ви отримаєте практичні інструменти для зменшення напруження та відновлення внутрішньої рівноваги.',
  },
  {
    icon: Users,
    title: 'Вирішити конфлікти та покращити взаємини',
    description:
      'Через спеціалізовані методи та техніки я допоможу вам розв\'язати конфлікти та покращити комунікацію з близькими людьми. Розберемо складні ситуації та знайдемо способи побудувати здорові, гармонійні взаємини.',
  },
  {
    icon: Target,
    title: 'Бути провідником у процесі саморозвитку',
    description:
      'Разом ми прокладемо шлях до вашого особистого зростання та досягнення цілей. Я буду вашою підтримкою та надійним орієнтиром на цьому шляху, допомагаючи виявити потенціал і розвиватися в обраному напрямку.',
  },
];

const HelpSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="help" className="section-padding bg-muted" ref={ref}>
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-medium tracking-widest uppercase text-sm">
            Напрямки роботи
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            Чим я можу допомогти?
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {helpItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-8 card-hover shadow-sm"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HelpSection;
