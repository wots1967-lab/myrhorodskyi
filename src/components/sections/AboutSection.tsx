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
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
              Сергій Миргородський.
            </h2>
            <p className="text-secondary font-medium text-lg mb-6">Психолог, психотерапевт.</p>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Я не вірю у швидкі поради або поверхневі розмови "про життя". Моя мета як терапевта — надати вам інструменти для роботи з власною свідомістю та допомогти розібрати механізми, які роками гальмували ваш розвиток.
              </p>
              <p>
                У своїй практиці я використовую інтегративний підхід з акцентом на Когнітивно-поведінкову терапію (КПТ) та Схема-терапію. Це методи з найвищим рівнем доказової ефективності у світі.
              </p>
              <p className="text-lg font-medium text-foreground mt-6 mb-2">
                Чому обирають роботу зі мною:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-secondary font-bold mt-0.5">·</span>
                  <span><strong className="text-foreground">Глибина та структурність:</strong> Ми не хапаємося за симптоми, ми шукаємо ядро проблеми.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary font-bold mt-0.5">·</span>
                  <span><strong className="text-foreground">Чіткий контракт:</strong> Ви розумієте, що ми робимо, навіщо, і які результати очікувати.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary font-bold mt-0.5">·</span>
                  <span><strong className="text-foreground">Абсолютна конфіденційність:</strong> Я працюю з підприємцями, топменеджерами та публічними особами. Ваша безпека — базовий принцип моєї практики.</span>
                </li>
              </ul>
              <p className="text-foreground font-medium mt-4">
                Більше 5 років практики та понад 3000 годин консультацій.
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
