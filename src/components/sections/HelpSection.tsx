import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Flame, Brain, Heart, Layers } from 'lucide-react';

const helpItems = [
  {
    icon: Flame,
    title: 'Криза сенсів та втрата мотивації',
    subtitle: '"Зовні все чудово, але всередині порожнеча".',
    description:
      'Коли ви досягли значних успіхів у кар\'єрі чи бізнесі, але втратили здатність відчувати радість від результатів. Ми знайдемо причини Executive-вигорання та повернемо вам контакт із власними бажаннями.',
  },
  {
    icon: Brain,
    title: 'Складні емоційні стани та тривожність',
    subtitle: '',
    description:
      'Постійний фоновий стрес, гіперконтроль, перфекціонізм, який руйнує здоров\'я. Нав\'язливі думки або панічні атаки, які заважають нормально жити і приймати рішення.',
  },
  {
    icon: Heart,
    title: 'Труднощі у побудові глибоких стосунків',
    subtitle: '',
    description:
      'Сценарії, що повторюються (вибір "не тих" партнерів), страх близькості або відчуття самотності навіть у стосунках. Особливо актуально для людей з високими досягненнями та рівнем відповідальності.',
  },
  {
    icon: Layers,
    title: 'Пропрацювання глибинних травм (Схема-терапія)',
    subtitle: '',
    description:
      'Робота з фундаментальними переконаннями про себе та світ (напр. "я недостатньо хороший", "світу не можна довіряти"). Ми змінюємо дезадаптивні схеми поведінки, закладені ще в дитинстві, що дає стійкий і довгостроковий результат.',
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
            З якими запитами до мене звертаються найчастіше:
          </h2>
        </motion.div>

        {/* Cards Grid - 2x2 */}
        <div className="grid md:grid-cols-2 gap-8">
          {helpItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-8 border border-border shadow-sm"
            >
              <div className="w-14 h-14 mb-5 bg-secondary/15 rounded-xl flex items-center justify-center">
                <item.icon className="w-7 h-7 text-secondary" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {item.title}
              </h3>
              {item.subtitle && (
                <p className="text-secondary font-medium italic mb-3">{item.subtitle}</p>
              )}
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HelpSection;
