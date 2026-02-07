import { Link } from 'react-router-dom';
import { MessageCircle, Instagram } from 'lucide-react';
import logo from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer className="relative z-10 glass-card-dark text-primary-foreground">
      <div className="container-custom section-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Logo" className="h-10 w-10 brightness-0 invert" />
              <div>
                <span className="font-display text-lg font-semibold">
                  Сергій Миргородський
                </span>
                <span className="block text-xs opacity-80">Психолог</span>
              </div>
            </Link>
            <p className="text-sm opacity-80 leading-relaxed">
              Допомагаю знайти гармонію в житті та розкрити внутрішній потенціал.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Навігація</h4>
            <ul className="space-y-2">
              {[
                { label: 'Головна', href: '/' },
                { label: 'Про мене', href: '/#about' },
                { label: 'Послуги', href: '/#services' },
                { label: 'Контакти', href: '/#contact' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Послуги</h4>
            <ul className="space-y-2">
              {[
                'Індивідуальні консультації',
                'Особисте наставництво',
                'Пакети консультацій',
                'Курси та програми',
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm opacity-80">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Контакти</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <MessageCircle size={18} className="opacity-80" />
                <a
                  href="https://t.me/sigurdpsy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  @sigurdpsy
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Instagram size={18} className="opacity-80" />
                <a
                  href="https://www.instagram.com/sigurd.psy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  @sigurd.psy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-60">
            © {new Date().getFullYear()} Сергій Миргородський. Всі права захищені.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
              Політика конфіденційності
            </Link>
            <Link to="/terms" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
              Умови використання
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
