import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

const HeroSection = () => {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Overlay for hero - smooth fade to transparent at bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/8 to-transparent" />

      {/* Content */}
      <div className="relative z-10 container-custom section-padding text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <img
              src={logo}
              alt="Logo"
              className="h-20 w-20 mx-auto brightness-0 invert opacity-90"
            />
          </motion.div>

          {/* Title */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-cream/80 text-lg md:text-xl font-medium tracking-widest uppercase mb-4"
          >
            Сергій Миргородський · Психолог
          </motion.p>

          <h1
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-6 leading-tight"
          >
            Глибинна психотерапія для тих, хто готовий до фундаментальних змін.
          </h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-10"
          >
            <p className="text-cream/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Допомагаю подолати внутрішні обмеження та вийти на новий рівень якості життя, кар'єри та стосунків. Без "магічних таблеток" — лише науково доведена ефективність.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="hero" size="xl" asChild>
              <a href="https://t.me/SigurdPSYBot?start=64f8747ec7512692c00d1788" target="_blank" rel="noopener noreferrer">Записатись на діагностичну сесію</a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="#about">Дізнатися більше</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            className="opacity-60"
          >
            {/* Leaf-like double chevron pointing down */}
            <path
              d="M8 10C12 16 14 18 16 20C18 18 20 16 24 10"
              stroke="hsl(40, 33%, 95%)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M10 16C13 21 15 23 16 25C17 23 19 21 22 16"
              stroke="hsl(40, 33%, 95%)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
