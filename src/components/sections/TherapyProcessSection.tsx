import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Search, Target, RefreshCw, Award } from 'lucide-react';

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Діагностична сесія',
    description:
      'Ми знайомимось, прояснюємо ваш запит, я розповідаю про можливі шляхи вирішення. Ми визначаємо, чи підходимо ми один одному для спільної роботи.',
  },
  {
    icon: Target,
    number: '02',
    title: 'Формування цілей та стратегії',
    description:
      'Ми ставимо чіткі цілі терапії. Ви отримуєте розуміння того, як саме працює ваша психіка у контексті вашого запиту.',
  },
  {
    icon: RefreshCw,
    number: '03',
    title: 'Глибинна робота (Процес терапії)',
    description:
      'Регулярні зустрічі (зазвичай 1 раз на тиждень по 50 хвилин). Робота не закінчується в кабінеті — ви отримуватимете завдання для закріплення нових патернів поведінки.',
  },
  {
    icon: Award,
    number: '04',
    title: 'Завершення та автономність',
    description:
      'Моя кінцева мета — зробити так, щоб ви більше мене не потребували. Ви стаєте власним терапевтом.',
  },
];

const TherapyProcessSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-padding relative z-10" ref={ref}>
      <div className="container-custom glass-card rounded-3xl p-8 md:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Як буде побудована наша робота
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 mx-auto mb-4 bg-secondary/15 rounded-xl flex items-center justify-center">
                <step.icon className="w-7 h-7 text-secondary" strokeWidth={1.5} />
              </div>
              <span className="text-secondary font-display text-sm font-bold tracking-wider">
                {step.number}
              </span>
              <h3 className="font-display text-lg font-semibold text-foreground mt-2 mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TherapyProcessSection;
