import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { AlertCircle, UserCheck, CalendarDays, BookOpen } from 'lucide-react';

const steps = [
  {
    icon: AlertCircle,
    step: '01',
    title: 'Чесно на старті',
    text: 'Швидких результатів не обіцяю. Терапія — це спільна робота, і вона потребує твоєї залученості. Моя задача — дати тобі інструменти та розуміння, щоб згодом ти міг справлятися з більшістю ситуацій самостійно. Я працюю на твою автономію.',
    accent: 'hsl(var(--secondary))',
  },
  {
    icon: UserCheck,
    step: '02',
    title: 'Перша зустріч',
    text: 'Ми знайомимося. Ти розповідаєш, з чим прийшов — без тиску і без потреби знати «правильні слова». Я збираю інформацію, яка допоможе зрозуміти твою ситуацію, і ми разом чітко формулюємо запит — над чим саме будемо працювати. Також пояснюю, як працюю і що можеш очікувати. Ми вирішуємо, чи підходимо одне одному. Якщо ні — скажу чесно.',
    accent: 'hsl(var(--primary))',
  },
  {
    icon: CalendarDays,
    step: '03',
    title: 'Ритм роботи',
    text: 'Оптимально — раз на тиждень. Іноді рідше, залежно від запиту і етапу. Кількість сесій залежить від глибини: комусь вистачає 5–10 зустрічей, комусь потрібно більше часу.',
    accent: 'hsl(var(--accent))',
  },
  {
    icon: BookOpen,
    step: '04',
    title: 'Між сесіями',
    text: 'Терапія не закінчується після дзвінка. Я можу запропонувати рефлексивні вправи, практики або матеріали для самостійної роботи. Якщо виникне питання між зустрічами — можеш написати, відповім по можливості.',
    accent: 'hsl(var(--secondary))',
  },
];

const TherapyProcessSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="therapy" className="section-padding relative z-10" ref={ref}>
      <div className="container-custom glass-card rounded-3xl p-8 md:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Як проходить терапія зі мною
          </h2>
        </motion.div>

        {/* Desktop: timeline layout */}
        <div className="hidden md:block max-w-4xl mx-auto">
          {/* Step indicators */}
          <div className="flex items-center justify-between mb-8 px-4">
            {steps.map((step, i) => (
              <motion.button
                key={step.step}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                onClick={() => setActiveStep(i)}
                className="flex flex-col items-center gap-2 cursor-pointer group relative"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    activeStep === i
                      ? 'bg-secondary text-secondary-foreground shadow-lg scale-110'
                      : 'bg-card border border-border text-muted-foreground group-hover:border-secondary/50 group-hover:text-secondary'
                  }`}
                >
                  <step.icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <span
                  className={`text-sm font-medium transition-colors duration-300 ${
                    activeStep === i ? 'text-secondary' : 'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </span>
                {activeStep === i && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-3 w-8 h-0.5 bg-secondary rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Connecting line */}
          <div className="relative mx-4 mb-8">
            <div className="h-px bg-border" />
            <motion.div
              className="absolute top-0 left-0 h-px bg-secondary"
              animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>

          {/* Content card */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="bg-card/80 border border-border rounded-2xl p-8"
          >
            <div className="flex items-start gap-5">
              <span className="font-display text-5xl font-bold text-secondary/20 leading-none select-none">
                {steps[activeStep].step}
              </span>
              <div className="flex-1">
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {steps[activeStep].title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {steps[activeStep].text}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden space-y-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="flex gap-4"
            >
              {/* Timeline line + dot */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0">
                  <step.icon className="w-5 h-5 text-secondary" strokeWidth={1.5} />
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 bg-border my-2" />
                )}
              </div>

              {/* Content */}
              <div className={`pb-8 ${i === steps.length - 1 ? 'pb-0' : ''}`}>
                <span className="text-xs font-semibold text-secondary/60 tracking-wider uppercase">
                  Крок {step.step}
                </span>
                <h3 className="font-display text-lg font-semibold text-foreground mt-1 mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {step.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TherapyProcessSection;
