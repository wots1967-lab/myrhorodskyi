import { motion } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

const ServicesSection = () => {
  const { prices } = useCurrency();

  const services = [
    {
      title: 'Індивідуальна сесія',
      description: '50 хвилин, онлайн, один на один. Підходить і для першого знайомства з терапією, і для роботи з конкретним запитом.',
      price: prices.consultation,
      cta: 'Обрати',
    },
    {
      badge: 'ПОПУЛЯРНО',
      badgeColor: 'bg-secondary',
      title: 'Пакет «5 сесій»',
      description: "П'ять зустрічей — мінімальний обсяг, щоб побачити перші зміни в патернах. Для тих, хто готовий працювати регулярно.",
      price: prices.pack5,
      saving: `економія ${prices.pack5saving}`,
      cta: 'Обрати пакет',
    },
    {
      title: 'Пакет «10 сесій»',
      description: 'Десять зустрічей для глибшої роботи. Достатньо простору, щоб розібрати патерни, попрацювати з ними і закріпити нову поведінку.',
      price: prices.pack10,
      saving: `економія ${prices.pack10saving}`,
      cta: 'Обрати пакет',
    },
    {
      title: 'Особисте наставництво',
      description: "Стратегічна робота над конкретними життєвими цілями: кар'єра, стосунки, самореалізація. Для тих, хто знає напрямок, але потребує супроводу на шляху.",
      price: prices.mentorship,
      cta: 'Дізнатися більше',
    },
  ];

  return (
    <section id="services" className="section-padding relative z-10">
      <div className="container-custom glass-card rounded-3xl p-8 md:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-medium tracking-widest uppercase text-sm">
            Послуги
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            Послуги та ціни
          </h2>
        </motion.div>

        <div className="space-y-6 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative bg-card rounded-2xl p-8 card-hover shadow-sm border border-border"
            >
              {service.badge && (
                <div className={`absolute -top-3 left-6 ${service.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1`}>
                  <Star size={12} />
                  {service.badge}
                </div>
              )}

              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-1">
                  <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-3">
                    {service.title} — {service.price}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    {service.description}
                  </p>
                  {service.saving && (
                    <p className="text-primary text-sm flex items-center gap-1">
                      <Check size={14} />
                      {service.saving}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-start lg:items-end gap-3 lg:min-w-[180px]">
                  <Button variant="ctaOutline" size="lg" className="w-full lg:w-auto" asChild>
                    <a href="#contact">{service.cta}</a>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-muted-foreground italic mt-8 max-w-2xl mx-auto"
        >
          Якщо не знаєш, який формат обрати — починай з індивідуальної сесії. Розберемося разом.
        </motion.p>
      </div>
    </section>
  );
};

export default ServicesSection;
