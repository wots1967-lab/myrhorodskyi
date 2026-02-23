import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Clock, BookOpen, Pill, LucideIcon } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs: { question: string; icon: LucideIcon; answer: string }[] = [
  {
    question: 'Скільки часу потрібно для вирішення моєї проблеми?',
    icon: Clock,
    answer:
      'Все індивідуально і залежить від глибини запиту. Локальний запит (наприклад, конкретна фобія або вихід з гострого стресу) може бути вирішений за 5-10 сесій у рамках КПТ. Глибинна трансформація особистості та зміна життєвих сценаріїв (Схема-терапія) — це процес, який може тривати від 6 місяців до кількох років.',
  },
  {
    question: 'Чи можна працювати без виконання "домашніх завдань"?',
    icon: BookOpen,
    answer:
      'Терапія відбувається не лише ці 50 хвилин зі мною, а й у реальному житті між сесіями. Завдання (ведення щоденників думок, поведінкові експерименти) необхідні для формування нових нейронних зв\'язків. Без вашої активної участі ефективність терапії значно знижується.',
  },
  {
    question: 'Чи працюєте ви з медикаментозним лікуванням?',
    icon: Pill,
    answer:
      'Я не є лікарем-психіатром і не призначаю препарати. Однак, якщо в процесі діагностики я бачу, що ваш стан потребує медикаментозної підтримки (наприклад, при клінічній депресії), я порекомендую вам перевірених колег-психіатрів, з якими ми зможемо вести вас спільно (тандем "ліки + психотерапія").',
  },
];

const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-padding relative z-10" ref={ref}>
      <div className="container-custom glass-card rounded-3xl p-8 md:p-12 lg:p-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-medium tracking-widest uppercase text-sm">
            FAQ
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
            Часті питання
          </h2>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="flex items-center gap-3 font-display text-lg font-semibold text-foreground">
                    <faq.icon className="w-5 h-5 text-secondary shrink-0" strokeWidth={2} />
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed pl-9">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
