import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="section-padding bg-background" ref={ref}>
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-display text-5xl text-primary">СМ</span>
                  </div>
                  <p className="text-muted-foreground text-sm">Фото психолога</p>
                </div>
              </div>
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-secondary/20 rounded-full blur-2xl" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-secondary font-medium tracking-widest uppercase text-sm">
              Про мене
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
              Консультації та особисте наставництво
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Я психолог з понад 3-річним досвідом у сфері консультування та особистого наставництва.
                Моя місія — допомогти вам знайти гармонію в повсякденному житті, розкрити власний
                потенціал і навчитися керувати емоціями для досягнення справжнього щастя та
                внутрішнього задоволення.
              </p>
              <p>
                Я працюю з інтеграцією найефективніших підходів: когнітивно-поведінкова терапія,
                психодинамічна терапія, схема-терапія та інші сучасні методи. Також використовую
                техніки медитації та візуалізації, щоб допомогти вам розслабитися, активувати
                внутрішні ресурси та знайти власні рішення.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8"
            >
              <Button variant="cta" size="lg" asChild>
                <a href="#help" className="inline-flex items-center gap-2">
                  Більше
                  <ArrowDown size={18} />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
