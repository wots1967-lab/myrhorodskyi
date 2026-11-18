import { MousePointerClick, CalendarCheck, Banknote } from 'lucide-react';

const steps = [
  {
    icon: MousePointerClick,
    title: 'Натисни «Записатися»',
    text: 'Відкриється Telegram-бот.',
  },
  {
    icon: CalendarCheck,
    title: 'Обери послугу та час',
    text: 'Бот допоможе обрати формат і зручний час.',
  },
  {
    icon: Banknote,
    title: 'Підтверди передоплатою',
    text: 'Не пізніше ніж за 24 години до сесії.',
  },
];

const BookingSteps = () => (
  <div className="mb-8">
    <p className="text-secondary font-medium tracking-widest uppercase text-sm mb-4">Як записатися</p>
    <ol className="grid sm:grid-cols-3 gap-3 md:gap-4 text-left">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="flex sm:flex-col items-start gap-3 bg-card/80 border border-border rounded-xl p-4"
        >
          <span className="flex items-center gap-2 shrink-0">
            <span className="w-7 h-7 rounded-full bg-secondary text-secondary-foreground text-sm font-bold flex items-center justify-center">
              {index + 1}
            </span>
            <step.icon className="w-5 h-5 text-secondary hidden sm:block" strokeWidth={1.75} />
          </span>
          <span>
            <span className="block font-display font-semibold text-foreground leading-snug">{step.title}</span>
            <span className="block text-muted-foreground text-sm leading-relaxed mt-1">{step.text}</span>
          </span>
        </li>
      ))}
    </ol>
  </div>
);

export default BookingSteps;
