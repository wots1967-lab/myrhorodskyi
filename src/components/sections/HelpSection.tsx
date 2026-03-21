import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
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

        {/* Cards Grid - 3 columns */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {helpItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.08 }}
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
