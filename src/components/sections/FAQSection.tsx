import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { HelpCircle, LucideIcon, Clock, UserCheck, Lock, ShieldOff, Pill, MessageCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs: { question: string; icon: LucideIcon; answer: string }[] = [
  {
    question: 'Як зрозуміти, що мені потрібен психолог?',
    icon: HelpCircle,
    answer:
      'Якщо це питання вже виникло — скоріш за все, потрібен. Психолог корисний не тільки в кризі. Іноді достатньо того, що ти хочеш краще розуміти себе, свої реакції і рішення.',
  },
  {
    question: 'Скільки сесій мені потрібно?',
    icon: Clock,
    answer:
      'Залежить від запиту. Для конкретної ситуації може вистачити 3–5 зустрічей. Для глибшої роботи — від 10. Ми обговоримо це на першій зустрічі. Ти завжди вільний зупинитися.',
  },
  {
    question: 'Що буде на першій зустрічі?',
    icon: UserCheck,
    answer:
      'Знайомство та збір інформації. Ти розповідаєш, з чим прийшов, ми формулюємо запит. Я пояснюю, як працюю. Без тиску. Мета — зрозуміти, чи комфортно нам працювати разом.',
  },
  {
    question: 'Чи конфіденційно те, що я розповім?',
    icon: Lock,
    answer:
      'Так. Все, що ти скажеш на сесії, залишається між нами. Я не записую сесії без твоєї згоди і не передаю інформацію третім сторонам.',
  },
  {
    question: 'З чим ти не працюєш?',
    icon: ShieldOff,
    answer:
      "Я не працюю з психотичними розладами, залежностями від речовин та важкими психіатричними діагнозами, що потребують медикаментозного лікування. В таких випадках перенаправлю до профільного спеціаліста.",
  },
  {
    question: 'Чи можеш виписати рецепт на ліки?',
    icon: Pill,
    answer:
      "Ні, я психолог. Але я співпрацюю з кваліфікованими психіатрами — якщо потрібна медикаментозна підтримка, допоможу з'єднатися з потрібним спеціалістом.",
  },
  {
    question: 'Мого запиту немає у списку?',
    icon: MessageCircle,
    answer:
      'Напиши мені. Список на сайті не вичерпний. Якщо зможу допомогти — скажу. Якщо ні — теж скажу і порекомендую колегу.',
  },
];

const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-padding relative z-10" ref={ref}>
      <div className="container-custom glass-card rounded-3xl p-8 md:p-12 lg:p-16">
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
