import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const topics = ['Віднайти мотивацію', 'Міграція, переїзд', 'Пережити зраду', 'Досягти змін у житті', 'Впоратись з розставанням', 'Відновити здатність радіти', 'Підвищити лібідо', 'Підвищити самооцінку', 'Баланс між життям і роботою', 'Вийти з аб\'юзивних стосунків', 'Позбутися травматичного досвіду', 'Вийти з кризи', 'Вийти зі співзалежних відносин', 'Покращити якість життя', 'Позбутися вигорання', 'Подолати панічні атаки', 'Побороти апатію', 'Навчитися радіти життю', 'Позбутись психосоматичних розладів', 'Прибрати фінансові блоки', 'Покращити сексуальне життя', 'Усвідомити свої бажання', 'Налагодити бізнес стосунки', 'Знайти нові сенси', 'Позбутися безсоння', 'Розвинути емоційний інтелект', 'Стати продуктивніше', 'Знайти нові цілі', 'Особистісне зростання', 'Відбудувати особисті кордони', 'Налагодити стосунки з батьками', 'Досліджувати себе', 'Зменшити стрес', 'Налагодити режим сну', 'Адаптуватися в новій країні', 'Позбутись нав\'язливих думок', 'Видихнути втому', 'Побудувати здорові стосунки', 'Емоційно відновитись', 'Побороти комплекси', 'Стосунки та конфлікти на роботі', 'Краще розуміти свої емоції', 'Прийняти і полюбити себе', 'Навчитися самоконтролю', 'Вийти з депресії', 'Пережити втрату', 'Позбутися тривоги', 'Реалізувати себе в професії', 'Пройти сепарацію'];

// Split topics into rows for marquee effect
const rows = [
  topics.slice(0, 10),
  topics.slice(10, 20),
  topics.slice(20, 30),
  topics.slice(30, 40),
  topics.slice(40, 49),
];

const MarqueeRow = ({ items, duration, reverse, selected, onToggle }: {
  items: string[];
  duration: number;
  reverse?: boolean;
  selected: Set<string>;
  onToggle: (t: string) => void;
}) => {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden w-full">
      <motion.div
        className="flex gap-3 w-max"
        animate={{ x: reverse ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((topic, i) => {
          const isSelected = selected.has(topic);
          return (
            <button
              key={`${topic}-${i}`}
              onClick={() => onToggle(topic)}
              className={`px-5 py-3 rounded-full text-sm md:text-base font-medium cursor-pointer select-none border whitespace-nowrap transition-colors duration-150 ${
                isSelected
                  ? 'bg-secondary text-secondary-foreground border-secondary shadow-md'
                  : 'bg-card/90 text-foreground border-border hover:bg-secondary/15 hover:border-secondary/50 hover:text-secondary'
              }`}
            >
              {topic}
            </button>
          );
        })}
      </motion.div>
    </div>
  );
};

const TopicsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleTopic = (topic: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });
  };

  return (
    <section className="section-padding relative z-10" ref={ref}>
      <div className="container-custom glass-card rounded-3xl p-8 md:p-12 lg:p-16 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Я підійду якщо ти хочеш:
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-3"
        >
          {rows.map((row, i) => (
            <MarqueeRow
              key={i}
              items={row}
              duration={30 + i * 5}
              reverse={i % 2 === 1}
              selected={selected}
              onToggle={toggleTopic}
            />
          ))}
        </motion.div>

        {selected.size > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-8">
            <a
              href="https://t.me/SigurdPSYBot?start=64f8747ec7512692c00d1788"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Записатися на консультацію
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TopicsSection;
