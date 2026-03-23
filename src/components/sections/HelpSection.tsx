import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Brain, Flame, Users, Compass, Globe, ShieldAlert } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const helpItems = [
  {
    icon: Brain,
    title: 'Тривога та панічні атаки',
    description:
      'Тривога, яку навіть не можеш пояснити. Серце калатає, думки біжать по колу, тіло напружене. Ми розберемося, звідки це йде, і ти отримаєш інструменти, щоб справлятися з цим самостійно.',
  },
  {
    icon: Flame,
    title: 'Вигорання та втрата сенсу',
    description:
      'Все нібито нормально, але сил ні на що немає. Ранок починається з «треба». Ми знайдемо, де ти себе загубив, і повернемо контакт із тим, що тобі справді важливо.',
  },
  {
    icon: Users,
    title: 'Стосунки та конфлікти',
    description:
      'Ті самі сценарії з різними людьми. Надто багато віддаєш або навпаки — тримаєш дистанцію. Ми подивимося на патерни і знайдемо спосіб будувати близькість, де тобі добре.',
  },
  {
    icon: Compass,
    title: 'Криза ідентичності',
    description:
      'Ти живеш чуже життя або відчуваєш, що старе вже не підходить, а нового ще не бачиш. Ми пройдемо через це так, щоб ти вийшов з більш чітким розумінням себе.',
  },
  {
    icon: Globe,
    title: 'Міграція та адаптація',
    description:
      'Нова країна, нові правила, відчуття, що ти нікуди не належиш. Тут про горювання за тим, що залишив, і пошук опори в новій реальності.',
  },
  {
    icon: ShieldAlert,
    title: 'Самооцінка та внутрішня критика',
    description:
      'Внутрішній голос, який постійно каже, що ти недостатньо. Ми знайдемо, звідки він узявся, і ти навчишся ставитися до себе з чесною повагою.',
  },
];

const HelpCard = ({ item, index, isMobile }: { item: typeof helpItems[0]; index: number; isMobile: boolean }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-60px', amount: 0.4 });
  const isActive = isMobile ? isInView : false;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.4, delay: isMobile ? 0 : index * 0.07 }}
      className={`group relative rounded-2xl border bg-card/20 p-6 cursor-default overflow-hidden transition-colors transition-border duration-300 ${
        isActive
          ? 'border-secondary/40'
          : 'border-border/40 hover:border-secondary/40'
      }`}
    >
      {/* Glow background — hover on desktop, inView on mobile */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-secondary/[0.06] via-secondary/[0.03] to-transparent rounded-2xl transition-opacity duration-300 ${
          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      />

      {/* Icon */}
      <div className="relative z-10 mb-5">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
            isActive
              ? 'bg-secondary/20'
              : 'bg-secondary/10 group-hover:bg-secondary/20'
          }`}
          style={{ transform: isActive ? 'scale(1.08)' : undefined, transition: 'transform 0.3s' }}
        >
          <item.icon className="w-6 h-6 text-secondary" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="relative z-10 font-display text-lg font-semibold text-foreground mb-3">
        {item.title}
      </h3>

      <p className="relative z-10 text-muted-foreground leading-relaxed text-sm">
        {item.description}
      </p>

      {/* Top accent bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-secondary/50 to-transparent transition-transform duration-300 origin-center ${
          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
      />
    </motion.div>
  );
};

const HelpSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isMobile = useIsMobile();

  return (
    <section id="help" className="section-padding relative z-10" ref={ref}>
      <div className="container-custom glass-card rounded-3xl p-8 md:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Чим я можу допомогти?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {helpItems.map((item, index) => (
            <HelpCard key={item.title} item={item} index={index} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HelpSection;
