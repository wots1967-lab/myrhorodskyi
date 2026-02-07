import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import psychologistPhoto from '@/assets/psychologist-photo.jpg';

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="section-padding relative z-10" ref={ref}>
      <div className="container-custom glass-card rounded-3xl p-8 md:p-12 lg:p-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden">
              <img
                src={psychologistPhoto}
                alt="Сергій Миргородський — психолог"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Про мене
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-lg font-medium text-foreground">
                Я психолог з більш ніж 5-річним досвідом у сфері консультування та особистого наставництва.
              </p>
              <p>
                Моя місія - допомогти вам знаходити гармонію в буденному житті, розкривати власний
                потенціал і керувати емоціями для досягнення щасливого життя в задоволення.
              </p>
              <p>
                Мої навички включають використання інтегративного підходу (когнітивно-поведінкової
                терапії, психодинамічної терапії, схема-терапії) та майндфулнес практик.
              </p>
              <p>
                Також я застосовую техніки медитації та візуалізації, щоб допомогти клієнтам
                розслабитися, опанувати внутрішні ресурси та знайти рішення.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
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
