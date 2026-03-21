import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Banknote, Clock, Heart, Home } from 'lucide-react';

const rules = [
  {
    icon: Banknote,
    text: 'Сесія підтверджується повною передоплатою не пізніше ніж за 24 години до початку',
  },
  {
    icon: Clock,
    text: 'Якщо сесія пропускається або скасовується пізніше — вона вважається проведеною',
  },
  {
    icon: Heart,
    text: 'Екстрена ситуація? Напиши — домовимося і перенесемо без питань',
  },
  {
    icon: Home,
    text: "Для сесії потрібне тихе комфортне місце та стабільний відео/аудіозв'язок",
  },
];

const RulesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-padding relative z-10" ref={ref}>
      <div className="container-custom glass-card-dark rounded-3xl p-8 md:p-12 lg:p-16 shadow-lg">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary-foreground/70 font-medium tracking-widest uppercase text-sm">
            Важлива інформація
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mt-3">
            Правила проведення консультацій
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rules.map((rule, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-4 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
                <rule.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <p className="text-primary-foreground/90 text-sm leading-relaxed">{rule.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RulesSection;
