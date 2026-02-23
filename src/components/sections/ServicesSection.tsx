import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star, Video, Clock } from 'lucide-react';

const services = [
  {
    title: 'Індивідуальна психотерапія',
    description:
      'Глибока робота над вашим запитом. Аналіз поточного стану, виявлення обмежуючих схем використання доказових протоколів для досягнення стійких змін.',
    details: ['Онлайн (Zoom/Google Meet)', '50 хвилин'],
    price: '$100',
    cta: 'Записатись',
  },
  {
    badge: 'ПОПУЛЯРНО',
    badgeColor: 'bg-secondary',
    title: 'Курс терапії (Пакети сесій)',
    description:
      'Оптимальний формат для вирішення конкретної проблеми (наприклад, тривожного розладу або депресивного епізоду) згідно з протоколами КПТ. Забезпечує стабільність процесу та вашу мотивацію йти до кінця.',
    options: [
      {
        name: 'Пакет 5 сесій',
        price: '$225',
        saving: 'вигода $25',
      },
      {
        name: 'Пакет 10 сесій',
        price: '$450',
        saving: 'вигода $50',
      },
    ],
    cta: 'Обрати пакет',
  },
  {
    title: 'Особистий супровід',
    description:
      'Формат для підприємців та керівників. Поєднання психотерапії та менторингу для подолання криз, прийняття складних рішень, роботи з "синдромом самозванця" на високих позиціях.',
    price: 'від $100 / сесія',
    priceNote: 'або $500/місяць за комплексний супровід',
    cta: 'Залишити заявку',
  },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="services" className="section-padding relative z-10" ref={ref}>
      <div className="container-custom glass-card rounded-3xl p-8 md:p-12 lg:p-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-medium tracking-widest uppercase text-sm">
            Послуги
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            Формати взаємодії
          </h2>
        </motion.div>

        {/* Services List */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative bg-card rounded-2xl p-8 card-hover shadow-sm border border-border"
            >
              {/* Badge */}
              {service.badge && (
                <div
                  className={`absolute -top-3 left-6 ${service.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1`}
                >
                  <Star size={12} />
                  {service.badge}
                </div>
              )}

              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Details (format, duration) */}
                  {service.details && (
                    <div className="flex flex-wrap gap-4 mb-4">
                      {service.details.map((detail, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          {i === 0 ? <Video size={14} className="text-secondary" /> : <Clock size={14} className="text-secondary" />}
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Options for packages */}
                  {service.options && (
                    <div className="space-y-2 mb-4">
                      {service.options.map((option) => (
                        <div key={option.name} className="flex items-center gap-2 text-sm">
                          <Check size={16} className="text-primary" />
                          <span className="text-foreground font-medium">{option.name}</span>
                          <span className="text-secondary font-bold">{option.price}</span>
                          <span className="text-primary text-xs">({option.saving})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price & CTA */}
                <div className="flex flex-col items-start lg:items-end gap-3 lg:min-w-[200px]">
                  {service.price && (
                    <div className="text-right">
                      <span className="font-display text-3xl font-bold text-secondary">
                        {service.price}
                      </span>
                      {service.priceNote && (
                        <p className="text-xs text-muted-foreground mt-1">{service.priceNote}</p>
                      )}
                    </div>
                  )}
                  <Button variant="ctaOutline" size="lg" className="w-full lg:w-auto" asChild>
                    <a href="#contact">{service.cta}</a>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
