import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, Send, MessageCircle, Instagram } from 'lucide-react';
import { toast } from 'sonner';

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success('Дякуємо! Ваше повідомлення надіслано. Ми зв\'яжемося з вами найближчим часом.');
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="section-padding relative z-10" ref={ref}>
      <div className="container-custom glass-card rounded-3xl p-8 md:p-12 lg:p-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Side - Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-secondary font-medium tracking-widest uppercase text-sm">
              Контакти
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
              Готові зробити перший крок?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Запишіться на безкоштовну консультацію вже сьогодні
            </p>

            <div className="space-y-6">
              <a
                href="mailto:contact@myrhorodskyi.com"
                className="flex items-center gap-4 p-4 bg-muted rounded-xl hover:bg-muted/70 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">contact@myrhorodskyi.com</p>
                </div>
              </a>

              <a
                href="tel:+380000000000"
                className="flex items-center gap-4 p-4 bg-muted rounded-xl hover:bg-muted/70 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Телефон</p>
                  <p className="font-medium text-foreground">+380 (00) 000-00-00</p>
                </div>
              </a>

              <a
                href="https://t.me/username"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-muted rounded-xl hover:bg-muted/70 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telegram</p>
                  <p className="font-medium text-foreground">@username</p>
                </div>
              </a>

              <a
                href="https://instagram.com/username"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-muted rounded-xl hover:bg-muted/70 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Instagram</p>
                  <p className="font-medium text-foreground">@username</p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-lg border border-border">
              <h3 className="font-display text-2xl font-semibold text-foreground mb-6">
                Записатися на консультацію
              </h3>

              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Ім'я *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Ваше ім'я"
                    className="h-12"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="h-12"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Телефон
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+380 (00) 000-00-00"
                    className="h-12"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Повідомлення
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Розкажіть коротко про вашу ситуацію..."
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="cta"
                  size="xl"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Надсилаємо...'
                  ) : (
                    <>
                      <Send size={18} />
                      Записатися на консультацію
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Надсилаючи форму, ви погоджуєтесь з нашою{' '}
                  <a href="/privacy" className="text-secondary hover:underline">
                    політикою конфіденційності
                  </a>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
