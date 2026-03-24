import { AlertCircle, UserCheck, CalendarDays, BookOpen } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useReveal } from '@/hooks/useReveal';

const steps = [
  {
    icon: AlertCircle,
    step: '01',
    title: 'Чесно на старті',
    text: 'Швидких результатів не обіцяю. Терапія — це спільна робота, і вона потребує твоєї залученості. Моя задача — дати тобі інструменти та розуміння, щоб згодом ти міг справлятися з більшістю ситуацій самостійно. Я працюю на твою автономію.',
  },
  {
    icon: UserCheck,
    step: '02',
    title: 'Перша зустріч',
    text: 'Ми знайомимося. Ти розповідаєш, з чим прийшов — без тиску і без потреби знати «правильні слова». Я збираю інформацію, яка допоможе зрозуміти твою ситуацію, і ми разом чітко формулюємо запит — над чим саме будемо працювати. Також пояснюю, як працюю і що можеш очікувати. Ми вирішуємо, чи підходимо одне одному. Якщо ні — скажу чесно.',
  },
  {
    icon: CalendarDays,
    step: '03',
    title: 'Ритм роботи',
    text: 'Оптимально — раз на тиждень. Іноді рідше, залежно від запиту і етапу. Кількість сесій залежить від глибини: комусь вистачає 5–10 зустрічей, комусь потрібно більше часу.',
  },
  {
    icon: BookOpen,
    step: '04',
    title: 'Між сесіями',
    text: 'Терапія не закінчується після дзвінка. Я можу запропонувати рефлексивні вправи, практики або матеріали для самостійної роботи. Якщо виникне питання між зустрічами — можеш написати, відповім по можливості.',
  },
];

const TherapyCard = ({ step, index }: { step: typeof steps[0]; index: number }) => {
  const { ref, revealed } = useReveal({ margin: '-60px', amount: 0.3 });

  return (
    <div
      ref={ref}
      className={`reveal${revealed ? ' revealed' : ''}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="group relative rounded-2xl border bg-card/30 p-6 md:p-7 cursor-default transition-all duration-300 overflow-hidden border-border/50 hover:bg-card/70 hover:border-secondary/30 hover:shadow-lg hover:shadow-secondary/5">
        <span className="absolute top-4 right-5 font-display text-4xl md:text-5xl font-bold select-none leading-none text-secondary/[0.07] group-hover:text-secondary/15 transition-colors duration-300">
          {step.step}
        </span>
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 bg-secondary/10 group-hover:bg-secondary/20 group-hover:scale-[1.1]">
            <step.icon className="w-5 h-5 text-secondary" strokeWidth={1.5} />
          </div>
          <h3 className="font-display text-lg md:text-xl font-semibold text-foreground">
            {step.title}
          </h3>
        </div>
        <p className="text-muted-foreground leading-relaxed text-sm md:text-base relative z-10">
          {step.text}
        </p>
        <div className="absolute bottom-0 left-6 right-6 h-px bg-secondary/40 rounded-full transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
      </div>
    </div>
  );
};

const TherapyProcessSection = () => {
  const { ref, revealed } = useReveal({ margin: '-80px' });
  const isMobile = useIsMobile();

  return (
    <section id="therapy" className="section-padding relative z-10">
      <div className="container-custom glass-card rounded-3xl p-8 md:p-12 lg:p-16">
        <div ref={ref} className={`reveal${revealed ? ' revealed' : ''} text-center mb-10 md:mb-14`}>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Як проходить терапія зі мною
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <TherapyCard key={step.step} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TherapyProcessSection;
