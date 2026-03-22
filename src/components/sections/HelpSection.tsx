import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Brain, Flame, Users, Compass, Globe, ShieldAlert } from 'lucide-react';

const helpItems = [
  {
    icon: Brain,
    title: 'Тривога та панічні атаки',
    description:
      'Тривога, яку навіть не можеш пояснити. Серце калатає, думки біжать по колу, тіло напружене. Ми розберемося, звідки це йде, і ти отримаєш інструменти, щоб справлятися з цим самостійно — і під час нашої роботи, і після неї.',
  },
  {
    icon: Flame,
    title: 'Вигорання та втрата сенсу',
    description:
      'Все нібито нормально, але сил ні на що немає. Ранок починається з «треба». Робота, яка колись тішила, тепер тільки забирає. Ми знайдемо, де ти себе загубив, і повернемо контакт із тим, що тобі справді важливо.',
  },
  {
    icon: Users,
    title: 'Стосунки та конфлікти',
    description:
      'Ті самі сценарії з різними людьми. Надто багато віддаєш або навпаки — тримаєш дистанцію. Ми подивимося на патерни, які повторюються, і знайдемо спосіб будувати близькість, де тобі добре.',
  },
  {
    icon: Compass,
    title: 'Криза ідентичності та сепарація',
    description:
      'Ти живеш чуже життя або відчуваєш, що старе вже не підходить, а нового ще не бачиш. Це складний, але важливий момент. Ми пройдемо через нього так, щоб ти вийшов з більш чітким розумінням себе.',
  },
  {
    icon: Globe,
    title: 'Міграція та адаптація',
    description:
      'Нова країна, нові правила, відчуття, що ти нікуди не належиш. Тут не тільки про побут. Тут про горювання за тим, що залишив, і пошук опори в новій реальності.',
  },
  {
    icon: ShieldAlert,
    title: 'Самооцінка та внутрішня критика',
    description:
      'Внутрішній голос, який постійно каже, що ти недостатньо. Ми знайдемо, звідки він узявся, і ти навчишся ставитися до себе з чесною повагою. Не роздувати его, а просто перестати воювати з собою.',
  },
];

const HelpSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section id="help" className="section-padding relative z-10" ref={ref}>
      <div className="container-custom glass-card rounded-3xl p-8 md:p-12 lg:p-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Чим я можу допомогти?
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {helpItems.map((item, index) => {
            const isHovered = hoveredCard === index;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative rounded-2xl border border-border/50 bg-card/30 p-6 md:p-7 cursor-default transition-all duration-300 hover:bg-card/70 hover:border-secondary/30 hover:shadow-lg hover:shadow-secondary/5"
              >
                {/* Icon + Title */}
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <motion.div
                    animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="w-10 h-10 rounded-xl bg-secondary/10 group-hover:bg-secondary/20 flex items-center justify-center transition-colors duration-300 shrink-0"
                  >
                    <item.icon className="w-5 h-5 text-secondary" strokeWidth={1.5} />
                  </motion.div>
                  <h3 className="font-display text-lg md:text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base relative z-10">
                  {item.description}
                </p>

                {/* Bottom accent line on hover */}
                <motion.div
                  className="absolute bottom-0 left-6 right-6 h-px bg-secondary/40 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={isHovered ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ originX: 0 }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HelpSection;
