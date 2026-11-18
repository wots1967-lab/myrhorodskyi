import { useReveal } from '@/hooks/useReveal';
import { Button } from '@/components/ui/button';
import { Instagram, Send } from 'lucide-react';
import { BOT_URL } from '@/lib/links';
import BookingSteps from '@/components/sections/BookingSteps';

const linkClass =
  'inline-flex min-h-11 items-center gap-2.5 px-1 font-medium text-foreground transition-colors hover:text-secondary';

const ContactSection = () => {
  const head = useReveal();
  const action = useReveal({ margin: '-40px' });

  return (
    <section id="contact" className="section-padding relative z-10">
      <div className="container-custom glass-card rounded-3xl px-5 py-12 sm:px-10 md:px-12 md:py-16 lg:px-16 lg:py-20">
        <div
          ref={head.ref}
          className={`reveal${head.revealed ? ' revealed' : ''} text-center max-w-3xl mx-auto`}
        >
          <span className="text-secondary font-medium tracking-widest uppercase text-sm">Контакти</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4 text-balance">
            Готовий зробити перший крок?
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Запишися на консультацію через Telegram-бот або напиши особисто.
          </p>
        </div>

        <BookingSteps />

        <div
          ref={action.ref}
          className={`reveal${action.revealed ? ' revealed' : ''} mt-12 md:mt-14 flex flex-col items-center text-center`}
        >
          <Button variant="cta" size="xl" asChild className="w-full sm:w-auto px-5 sm:px-10 text-[15px] sm:text-base md:text-lg">
            <a href={BOT_URL} target="_blank" rel="noopener noreferrer">
              <Send size={18} />
              Записатися на консультацію
            </a>
          </Button>

          <p className="mt-8 text-sm text-muted-foreground">або напиши особисто</p>
          <div className="mt-1 flex items-center justify-center gap-5">
            <a href="https://t.me/sigurdpsy" target="_blank" rel="noopener noreferrer" aria-label="Telegram: @sigurdpsy" className={linkClass}>
              <Send size={18} className="text-secondary" strokeWidth={1.75} />
              @sigurdpsy
            </a>
            <span aria-hidden="true" className="h-4 w-px bg-border" />
            <a href="https://www.instagram.com/sigurd.psy/" target="_blank" rel="noopener noreferrer" aria-label="Instagram: @sigurd.psy" className={linkClass}>
              <Instagram size={18} className="text-secondary" strokeWidth={1.75} />
              @sigurd.psy
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
