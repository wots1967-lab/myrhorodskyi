import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const categories = [
  {
    title: 'Емоційний стан',
    topics: ['Тривога', 'Панічні атаки', 'Депресія', 'Апатія', 'Вигорання', 'Безсоння', "Нав'язливі думки", 'Психосоматика', 'Втома, що не проходить', 'Емоційне виснаження']
  },
  {
    title: 'Стосунки',
    topics: ['Конфлікти в парі', 'Розставання та зрада', "Аб'юзивні стосунки", 'Співзалежність', 'Сепарація від батьків', 'Побудова здорових стосунків', 'Сексуальне життя та лібідо', 'Бізнес-стосунки та конфлікти на роботі']
  },
  {
    title: 'Особистість та розвиток',
    topics: ['Самооцінка', 'Пошук себе', 'Особистісне зростання', 'Мотивація', 'Продуктивність', 'Емоційний інтелект', 'Самоконтроль', 'Фінансові блоки', 'Реалізація в професії', 'Нові цілі та сенси']
  },
  {
    title: 'Кризи та зміни',
    topics: ['Міграція', 'Адаптація в новій країні', 'Втрата та горювання', 'Вихід з кризи', 'Баланс роботи та життя', 'Прийняття себе', 'Відбудова кордонів']
  }
];

const TopicsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  const toggleTopic = (topic: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });
  };

  const toggleCategory = (title: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  return (
    <section className="section-padding relative z-10" ref={ref}>
      <div className="container-custom glass-card rounded-3xl p-8 md:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Я підійду якщо:
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3 max-w-4xl mx-auto"
        >
          {categories.map((cat) => {
            const isOpen = openCategories.has(cat.title);
            const selectedCount = cat.topics.filter(t => selected.has(t)).length;

            return (
              <div key={cat.title} className="rounded-2xl border border-border/50 bg-card/30 transition-colors hover:bg-card/60">
                <button
                  onClick={() => toggleCategory(cat.title)}
                  className="w-full flex items-center justify-between px-5 py-4 md:px-6 md:py-5 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-lg md:text-xl font-semibold text-secondary">
                      {cat.title}
                    </h3>
                    {selectedCount > 0 && (
                      <span className="text-xs font-medium bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">
                        {selectedCount}
                      </span>
                    )}
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-wrap gap-2.5 md:gap-3 px-5 pb-5 md:px-6 md:pb-6">
                        {cat.topics.map((topic) => {
                          const isSelected = selected.has(topic);
                          return (
                            <button
                              key={topic}
                              onClick={() => toggleTopic(topic)}
                              className={`px-4 py-2.5 rounded-full text-sm font-medium cursor-pointer select-none border transition-all duration-150 ${
                                isSelected
                                  ? 'bg-secondary text-secondary-foreground border-secondary shadow-md scale-[1.03]'
                                  : 'bg-card/80 text-foreground border-border hover:bg-secondary/15 hover:border-secondary/50 hover:text-secondary active:scale-95'
                              }`}
                            >
                              {topic}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
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
