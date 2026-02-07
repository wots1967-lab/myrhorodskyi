import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
const services = [{
  title: 'Індивідуальна психологічна консультація',
  description: 'Один з найефективніших методів впоратися з різноманітними психологічними запитами. Індивідуальна консультація допоможе зосередитися на ваших потребах та вирішити особисті питання з професійною підтримкою.',
  price: '50$',
  
  cta: 'Обрати'
}, {
  badge: 'ПОПУЛЯРНО',
  badgeColor: 'bg-secondary',
  title: 'Пакети консультацій',
  description: 'Оберіть інтенсивний підхід до вашого розвитку. Пакетні консультації — це чудова можливість для тих, хто прагне глибоко працювати над собою та досягненням цілей за привабливою ціною.',
  options: [{
    name: 'Пакет "5×50"',
    price: '230$',
    saving: 'економія 20$'
  }, {
    name: 'Пакет "10×50"',
    price: '450$',
    saving: 'економія 50$'
  }],
  cta: 'Обрати пакет'
}, {
  title: 'Особисте наставництво',
  description: 'З сесією особистого наставництва ви отримаєте мою повну увагу та підтримку на вашому шляху до особистісної трансформації, досягнення цілей та глибоких змін.',
  price: '70$',
  
  cta: 'Дізнатися більше'
}];
const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-100px'
  });
  return <section id="services" className="section-padding relative z-10" ref={ref}>
      <div className="container-custom glass-card rounded-3xl p-8 md:p-12 lg:p-16">
        {/* Header */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={isInView ? {
        opacity: 1,
        y: 0
      } : {}} transition={{
        duration: 0.6
      }} className="text-center mb-16">
          <span className="text-secondary font-medium tracking-widest uppercase text-sm">
            Послуги
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            Послуги та ціни
          </h2>
        </motion.div>

        {/* Services List */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {services.map((service, index) => <motion.div key={service.title} initial={{
          opacity: 0,
          y: 30
        }} animate={isInView ? {
          opacity: 1,
          y: 0
        } : {}} transition={{
          duration: 0.6,
          delay: index * 0.1
        }} className={`relative bg-card rounded-2xl p-8 card-hover shadow-sm ${'border border-border'}`}>
              {/* Badge */}
              {service.badge && <div className={`absolute -top-3 left-6 ${service.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1`}>
                  <Star size={12} />
                  {service.badge}
                </div>}

              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Options for packages */}
                  {service.options && <div className="space-y-2 mb-4">
                      {service.options.map(option => <div key={option.name} className="flex items-center gap-2 text-sm">
                          <Check size={16} className="text-primary" />
                          <span className="text-foreground font-medium">{option.name}</span>
                          <span className="text-secondary font-bold">{option.price}</span>
                          <span className="text-primary text-xs">({option.saving})</span>
                        </div>)}
                    </div>}
                </div>

                {/* Price & CTA */}
                <div className="flex flex-col items-start lg:items-end gap-3 lg:min-w-[180px]">
                  {service.price && <div className="text-right">
                      <span className="font-display text-3xl font-bold text-secondary">
                        {service.price}
                      </span>
                      
                    </div>}
                  <Button variant="ctaOutline" size="lg" className="w-full lg:w-auto" asChild>
                    <a href="#contact">{service.cta}</a>
                  </Button>
                </div>
              </div>
            </motion.div>)}
        </div>
      </div>
    </section>;
};
export default ServicesSection;