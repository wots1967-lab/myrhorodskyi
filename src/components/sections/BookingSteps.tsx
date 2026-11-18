import { useReveal } from '@/hooks/useReveal';

const steps = [
  {
    title: 'Натисни «Записатися»',
    text: 'Відкриється Telegram-бот.',
  },
  {
    title: 'Заповни дані',
    text: 'Вкажи вік і запит (якщо він є), поділися контактами.',
  },
  {
    title: 'Очікуй мого повідомлення',
    text: 'Зазвичай відповідаю протягом 48 годин. Я зв’яжуся з тобою, і ми оберемо зручний час.',
  },
];

/**
 * Три кроки запису без рамок: кружечки на тонкій лінії.
 * На телефоні лінія вертикальна, на великих екранах — горизонтальна.
 * Кроки з'являються по черзі, коли блок доскролюють до екрана.
 */
const BookingSteps = () => {
  const { ref, revealed } = useReveal({ margin: '-60px' });
  const on = revealed ? ' revealed' : '';

  return (
    <div ref={ref} className="mt-12 md:mt-16 max-w-4xl mx-auto">
      <ol className="relative grid gap-8 sm:grid-cols-3 sm:gap-8 md:gap-12">
        {/* Горизонтальна лінія від центра першого кружечка до центра третього */}
        <span
          aria-hidden="true"
          className={`draw-line-x${on} hidden sm:block absolute top-[22px] left-[16.666%] right-[16.666%] h-px bg-gradient-to-r from-secondary/15 via-secondary/45 to-secondary/15`}
        />
        {steps.map((step, index) => (
          <li
            key={step.title}
            className={`reveal${on} relative flex gap-4 sm:flex-col sm:items-center sm:gap-5 sm:text-center`}
            style={{ transitionDelay: `${index * 140}ms` }}
          >
            {/* Вертикальна лінія до наступного кроку (тільки телефон) */}
            {index < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={`draw-line-y${on} sm:hidden absolute left-[21px] top-[52px] -bottom-6 w-px bg-secondary/30`}
              />
            )}
            <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-secondary/50 bg-card font-display text-xl font-semibold text-secondary lining-nums">
              {index + 1}
            </span>
            <div className="pt-1.5 sm:pt-0 sm:max-w-[17rem]">
              <h3 className="font-display text-lg lg:text-xl font-semibold text-foreground leading-snug">
                {step.title}
              </h3>
              <p className="mt-1.5 text-muted-foreground leading-relaxed">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default BookingSteps;
