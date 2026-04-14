import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinancialTest } from '@/hooks/useFinancialTest';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const FinancialTestFinish = () => {
  const navigate = useNavigate();
  const { saveResult, answeredCount, totalQuestions } = useFinancialTest();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [wantsConsultation, setWantsConsultation] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleSubmit = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Введи коректний email');
      return;
    }
    if (!consent) return;

    const slug = saveResult(email, name || undefined, phone || undefined, wantsConsultation);
    navigate(`/test-result/${slug}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border p-8 max-w-md w-full shadow-lg">
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Тест завершено!</h1>
          <p className="text-muted-foreground">
            Відповідей: {answeredCount} з {totalQuestions}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {emailError && <p className="text-destructive text-sm mt-1">{emailError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Ім'я <span className="text-muted-foreground">(опціонально)</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Як до тебе звертатися"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Телефон <span className="text-muted-foreground">(опціонально)</span></label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+380..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 accent-primary" />
            <span className="text-sm text-muted-foreground">Я погоджуюсь на обробку даних відповідно до політики конфіденційності</span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={wantsConsultation} onChange={(e) => setWantsConsultation(e.target.checked)} className="mt-1 accent-primary" />
            <span className="text-sm text-muted-foreground">Хочу розгорнутий розбір від консультанта</span>
          </label>

          <Button variant="cta" onClick={handleSubmit} disabled={!consent} className="w-full mt-4" size="lg">
            Отримати результат
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinancialTestFinish;
