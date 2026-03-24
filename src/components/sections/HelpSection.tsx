import { Brain, Flame, Users, Compass, Globe, ShieldAlert } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

const helpItems = [
  {
    icon: Brain,
    title: 'Тривога та панічні атаки',
    description: 'Тривога, яку навіть не можеш пояснити. Серце калатає, думки біжать по колу, тіло напружене. Ми розберемося, звідки це йде, і ти отримаєш інструменти, щоб справлятися з цим самостійно.',
  },
  {
    icon: Flame,
    title: 'Вигорання та втрата сенсу',
    description: 'Все нібито нормально, але сил ні на що немає. Ранок починається з «треба». Ми знайдемо, де ти себе загубив, і повернемо контакт із тим, що тобі справді важливо.',
  },
  {
    icon: Users,
    title: 'Стосунки та конфлікти',
    description: 'Ті самі сценарії з різними людьми. Надто багато віддаєш або навпаки — тримаєш дистанцію. Ми подивимося на патерни і знайдемо спосіб будувати близькість, де тобі добре.',
  },
  {
    icon: Compass,
    title: 'Криза ідентичності',
    description: 'Ти живеш чуже життя або відчуваєш, що старе вже не підходить, а нового ще не бачиш. Ми пройдемо через це так, щоб ти вийшов з більш чітким розумінням себе.',
  },
  {
    icon: Globe,
    title: 'Міграція та адаптація',
    description: 'Нова країна, нові правила, відчуття, що ти нікуди не належиш. Тут про горювання за тим, що залишив, і пошук опори в новій реальності.',
  },
  {
    icon: ShieldAlert,
    title: 'Самооцінка та внутрішня критика',
    description: 'Внутрішній голос, який постійно каже, що ти недостатньо. Ми знайдемо, звідки він узявся, і ти навчишся ставитися до себе з чесною повагою.',
  },
];

const HelpCard = ({ item, index }: { item: typeof helpItems[0]; index: number }) => {
  const { ref, revealed } = useReveal({ margin: '-60px', amount: 0.3 });

  return (
    <div
      ref={ref}
      className={`reveal${revealed ? ' revealed' : ''}`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className="group relative rounded-2xl border bg-card/20 p-6 cursor-default overflow-hidden transition-all duration-300 border-border/40 hover:border-secondary/40">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/[0.06] via-secondary/[0.03] to-transparent rounded-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
        <div className="relative z-10 mb-5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 bg-secondary/10 group-hover:bg-secondary/20 group-hover:scale-[1.08]">
            <item.icon className="w-6 h-6 text-secondary" strokeWidth={1.5} />
          </div>
        </div>
        <h3 className="relative z-10 font-display text-lg font-semibold text-foreground mb-3">
          {item.title}
        </h3>
        <p className="relative z-10 text-muted-foreground leading-relaxed text-sm">
          {item.description}
        </p>
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-secondary/50 to-transparent transition-transform duration-300 origin-center scale-x-0 group-hover:scale-x-100" />
      </div>
    </div>
  );
};

const HelpSection = () => {
  const { ref, revealed } = useReveal({ margin: '-100px' });

  return (
    <section id="help" className="section-padding relative z-10">
      <div className="container-custom glass-card rounded-3xl p-8 md:p-12 lg:p-16">
        <div ref={ref} className={`reveal${revealed ? ' revealed' : ''} text-center mb-12 md:mb-16`}>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Чим я можу допомогти?
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {helpItems.map((item, index) => (
            <HelpCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HelpSection;
