import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { AlertCircle, UserCheck, CalendarDays, BookOpen } from 'lucide-react';

const subsections = [
  {
    icon: AlertCircle,
    title: 'Чесно на старті',
    text: 'Швидких результатів не обіцяю. Терапія — це спільна робота, і вона потребує твоєї залученості. Моя задача — дати тобі інструменти та розуміння, щоб згодом ти міг справлятися з більшістю ситуацій самостійно. Я працюю на твою автономію.',
  },
  {
    icon: UserCheck,
    title: 'Перша зустріч',
    text: 'Ми знайомимося. Ти розповідаєш, з чим прийшов — без тиску і без потреби знати «правильні слова». Я збираю інформацію, яка допоможе зрозуміти твою ситуацію, і ми разом чітко формулюємо запит — над чим саме будемо працювати. Також пояснюю, як працюю і що можеш очікувати. Ми вирішуємо, чи підходимо одне одному. Якщо ні — скажу чесно.',
  },
  {
    icon: CalendarDays,
    title: 'Ритм роботи',
    text: 'Оптимально — раз на тиждень. Іноді рідше, залежно від запиту і етапу. Кількість сесій залежить від глибини: комусь вистачає 5–10 зустрічей, комусь потрібно більше часу.',
  },
  {
    icon: BookOpen,
    title: 'Між сесіями',
    text: 'Терапія не закінчується після дзвінка. Я можу запропонувати рефлексивні вправи, практики або матеріали для самостійної роботи. Якщо виникне питання між зустрічами — можеш написати, відповім по можливості.',
  },
];

const TherapyProcessSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="therapy" className="section-padding relative z-10" ref={ref}>
      <div className="container-custom glass-card rounded-3xl p-8 md:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Як проходить терапія зі мною
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {subsections.map((sub, index) => (
            <motion.div
              key={sub.title}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card/80 border border-border rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-secondary/15 rounded-xl flex items-center justify-center shrink-0">
                  <sub.icon className="w-5 h-5 text-secondary" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {sub.title}
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{sub.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TherapyProcessSection;
