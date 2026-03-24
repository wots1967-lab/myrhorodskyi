import { motion } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import telegramIcon from '@/assets/telegram-icon.png';
import instagramIcon from '@/assets/instagram-icon.png';

const ContactSection = () => {

  return (
    <section id="contact" className="section-padding relative z-10">
      <div className="container-custom glass-card rounded-3xl p-8 md:p-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
            Готовий зробити перший крок?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Запишися на консультацію через Telegram-бот або напиши особисто.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button variant="cta" size="xl" asChild>
              <a
                href="https://t.me/SigurdPSYBot?start=64f8747ec7512692c00d1788"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Send size={18} />
                Записатися на консультацію
              </a>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://t.me/sigurdpsy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-muted rounded-xl hover:bg-muted/70 transition-colors"
            >
              <img src={telegramIcon} alt="Telegram" className="w-8 h-8 rounded" loading="lazy" decoding="async" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Telegram</p>
                <p className="font-medium text-foreground text-sm">@sigurdpsy</p>
              </div>
            </a>

            <a
              href="https://www.instagram.com/sigurd.psy/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-muted rounded-xl hover:bg-muted/70 transition-colors"
            >
              <img src={instagramIcon} alt="Instagram" className="w-8 h-8 rounded" loading="lazy" decoding="async" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Instagram</p>
                <p className="font-medium text-foreground text-sm">@sigurd.psy</p>
              </div>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
