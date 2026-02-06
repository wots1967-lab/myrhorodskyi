import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Brain, Waves, Users } from 'lucide-react';

const helpItems = [
  {
    icon: Brain,
    title: 'Пізнати краще себе та свої емоції',
    description:
      'Дозвольте мені провести вас у внутрішній світ вашої особистості. Разом ми розглянемо ваші думки, патерни поведінки, переживання та емоції, щоб ви здобули глибше розуміння себе та зрозуміли, які фактори впливають на ваше життя.',
  },
  {
    icon: Waves,
    title: 'Подолати стрес та тривогу',
    description:
      'Зі мною ви зможете розробити стратегії для подолання стресу та тривоги. Я надам вам інструменти для зменшення напруження та збільшення внутрішньої рівноваги.',
  },
  {
    icon: Users,
    title: 'Вирішити конфлікти та покращити взаємини',
    description:
      'Через спеціалізовані методи та техніки, я допоможу вам розв\'язати конфлікти та покращити комунікацію з іншими людьми. Розберемо складні ситуації та знайдемо способи побудувати здорові взаємини.',
  },
];

const HelpSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="help" className="section-padding relative z-10" ref={ref}>
      <div className="container-custom glass-card rounded-3xl p-8 md:p-12 lg:p-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Чим я можу допомогти?
          </h2>
        </motion.div>

        {/* Cards Grid - 3 columns */}
        <div className="grid md:grid-cols-3 gap-8">
          {helpItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-secondary/15 rounded-2xl flex items-center justify-center">
                <item.icon className="w-10 h-10 text-secondary" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HelpSection;
