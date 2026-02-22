import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

// Arranged so short + long topics pair well in rows of 2–3
const topicRows: string[][] = [
  ['Віднайти мотивацію', 'Впоратись з розставанням', 'Міграція, переїзд'],
  ['Підвищити самооцінку', 'Позбутися травматичного досвіду'],
  ['Пережити зраду', 'Досягти змін у житті', 'Вийти з кризи'],
  ['Відновити здатність радіти', 'Підвищити лібідо'],
  ['Баланс між життям і роботою', 'Вийти з аб\'юзивних стосунків'],
  ['Покращити якість життя', 'Позбутися вигорання', 'Побороти апатію'],
  ['Навчитися радіти життю', 'Вийти зі співзалежних відносин'],
  ['Подолати панічні атаки', 'Прибрати фінансові блоки', 'Зменшити стрес'],
  ['Позбутись психосоматичних розладів', 'Покращити сексуальне життя'],
  ['Усвідомити свої бажання', 'Налагодити бізнес стосунки', 'Знайти нові сенси'],
  ['Позбутися безсоння', 'Розвинути емоційний інтелект'],
  ['Стати продуктивніше', 'Знайти нові цілі', 'Особистісне зростання'],
  ['Відбудувати особисті кордони', 'Налагодити стосунки з батьками'],
  ['Досліджувати себе', 'Налагодити режим сну', 'Видихнути втому'],
  ['Адаптуватися в новій країні', 'Позбутись нав\'язливих думок'],
  ['Побудувати здорові стосунки', 'Емоційно відновитись', 'Побороти комплекси'],
  ['Стосунки та конфлікти на роботі', 'Краще розуміти свої емоції'],
  ['Прийняти і полюбити себе', 'Навчитися самоконтролю', 'Вийти з депресії'],
  ['Пережити втрату', 'Позбутися тривоги', 'Реалізувати себе в професії'],
  ['Пройти сепарацію', 'Покращити якість життя'],
];

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

  let globalIndex = 0;

  return (
    <section className="section-padding relative z-10" ref={ref}>
      <div className="container-custom glass-card rounded-3xl p-8 md:p-12 lg:p-16">
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
          className="flex flex-col gap-2.5 md:gap-3"
        >
          {topicRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2.5 md:gap-3">
              {row.map((topic) => {
                const isSelected = selected.has(topic);
                const idx = globalIndex++;
                return (
                  <motion.button
                    key={topic}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      duration: 0.3,
                      delay: 0.03 * Math.min(idx, 20),
                      scale: { duration: 0.1 },
                    }}
                    onClick={() => toggleTopic(topic)}
                    className={`flex-1 px-4 py-2.5 rounded-full text-sm font-medium cursor-pointer select-none border text-center transition-colors duration-150 ${
                      isSelected
                        ? 'bg-secondary text-secondary-foreground border-secondary shadow-md'
                        : 'bg-card/80 text-foreground border-border hover:bg-secondary/15 hover:border-secondary/50 hover:text-secondary'
                    }`}
                    whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
                    whileTap={{ scale: 0.97, transition: { duration: 0.05 } }}
                  >
                    {topic}
                  </motion.button>
                );
              })}
            </div>
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
