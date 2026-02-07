import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'З чим я не працюю?',
    icon: '❌',
    answer: `• Шизофренія
• Залежності
• Тяжкі форми ПТСР
• Паранойя
• Діти молодші 16 років`,
  },
  {
    question: 'Скільки триває терапія?',
    icon: '⏰',
    answer:
      'Буває достатньо 2-5 сесій. Планування тривалості терапії та частоти зустрічей здійснюється індивідуально, враховуючи потреби та цілі кожного клієнта. Зазвичай клієнти без виражених розладів проходять від 8 до 10 сесій терапії в середньому.',
  },
  {
    question: 'Чи можу я виписувати рецепти на медикаменти?',
    icon: '💊',
    answer:
      'Ні, я не є медичним працівником із профілем у галузі психіатрії чи неврології. Мої терапевтичні методи спрямовані на підтримку психічного здоров\'я і не включають призначення медикаментів. Однак я регулярно працюю під наглядом психіатра і в деяких випадках можу направити клієнтів до відповідного спеціаліста.',
  },
  {
    question: 'Як часто потрібно проводити терапевтичні сесії?',
    icon: '⏳',
    answer:
      'Частота проведення сесій залежить від індивідуальних потреб кожного клієнта. Як правило, стандартна частота — одна сесія на тиждень. Якщо в терапії проявляється позитивна динаміка, частота може бути плавно зменшена за згодою клієнта. Моє головне завдання — допомогти мінімізувати втручання у ваше життя та навчити навичок самостійної терапії.',
  },
  {
    question: 'Що робити, якщо я не знайшов свій запит у списку?',
    icon: '❓',
    answer:
      'Якщо ви не знайшли свій запит у переліку вище — не турбуйтеся, це цілком нормально. Можливо, ваша ситуація надто складна, щоб самостійно визначити корінь проблеми. Моя робота включає допомогу у формулюванні питання, яке необхідно вирішити.',
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
                    <span className="text-xl">{faq.icon}</span>
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
