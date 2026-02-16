import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, RotateCcw, Shield, AlertTriangle, Drama } from 'lucide-react';
import { cn } from '@/lib/utils';
import usePageSEO from '@/hooks/usePageSEO';
import { useTestKeyboard } from '@/hooks/useTestKeyboard';

const questions = [
  // Machiavellianism (1-9)
  "Нерозумно розповідати свої таємниці.",
  "Мені подобається використовувати хитрі маніпуляції, щоб досягти свого.",
  "Потрібно будь-що залучити важливих людей на свій бік.",
  "Уникайте прямих конфліктів з іншими, оскільки вони можуть бути корисними в майбутньому.",
  "Розумно відстежувати інформацію, яку пізніше можна використати проти людей.",
  "Варто чекати слушного моменту, щоб помститися людям.",
  "Є речі, які слід приховувати від інших, тому що їм не потрібно цього знати.",
  "Переконайтеся, що ваші плани приносять користь вам, а не іншим.",
  "Більшістю людей можна маніпулювати.",
  // Narcissism (10-18)
  "Люди бачать у мені природженого лідера.",
  "Я ненавиджу бути в центрі уваги.", // reverse 11
  "Багато групових занять були б нудними без мене.",
  "Я знаю, що я особливий / особлива, тому що всі мені про це говорять.",
  "Мені подобається знайомитися з важливими людьми.",
  "Я почуваюся ніяково, якщо хтось робить мені комплімент.", // reverse 15
  "Мене порівнювали з відомими людьми.",
  "Я пересічна людина.", // reverse 17
  "Я наполягаю на отриманні поваги, на яку заслуговую.",
  // Psychopathy (19-27)
  "Мені подобається мститися владі або авторитетам.",
  "Я намагаюся уникати небезпечних ситуацій.", // reverse 20
  "Помста має бути швидкою і жорстокою.",
  "Люди часто кажуть, що я неконтрольований / неконтрольована.",
  "Це правда, що я можу бути жорстоким / жорстокою до інших.",
  "Люди, які зв'язуються зі мною, завжди про це шкодують.",
  "Я ніколи не мав / мала проблем із законом.", // reverse 25
  "Мені подобається займатися сексом з людьми, яких я майже не знаю.",
  "Я скажу що завгодно, щоб отримати те, що хочу.",
];

const REVERSE_ITEMS = new Set([10, 14, 16, 19, 24]); // 0-indexed versions of Q11,15,17,20,25

const responseOptions = [
  { value: 1, label: "Зовсім не згоден" },
  { value: 2, label: "Не згоден" },
  { value: 3, label: "Нейтрально" },
  { value: 4, label: "Згоден" },
  { value: 5, label: "Цілком згоден" },
];

type TraitLevel = 'low' | 'moderate' | 'high';

const getTraitLevel = (avg: number): TraitLevel => {
  if (avg <= 2.5) return 'low';
  if (avg <= 3.5) return 'moderate';
  return 'high';
};

const traitColors: Record<TraitLevel, { color: string; bgColor: string; borderColor: string }> = {
  low: { color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  moderate: { color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  high: { color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
};

const traitLevelLabels: Record<TraitLevel, string> = {
  low: 'Низький',
  moderate: 'Помірний',
  high: 'Високий',
};

interface TraitInterpretation {
  high: string;
  moderate: string;
  low: string;
}

const interpretations: Record<string, TraitInterpretation> = {
  mach: {
    high: "Ви схильні використовувати маніпуляції, стратегічне мислення та цинізм для досягнення своїх цілей. Ви можете ставити власну вигоду вище за моральні принципи.",
    moderate: "Ви маєте збалансований підхід, використовуючи стратегічне мислення, але не нехтуючи інтересами інших.",
    low: "Ви схильні до чесності, відкритості та довіри до людей. Ви рідко використовуєте маніпуляції.",
  },
  narc: {
    high: "Ви маєте високу потребу в увазі, захопленні та визнанні. Ви можете відчувати свою перевагу над іншими та мати грандіозні плани.",
    moderate: "Ви маєте здорову самооцінку та впевненість у собі, але не залежні від постійного схвалення.",
    low: "Ви схильні бути скромним, уникати центру уваги і, можливо, недооцінювати свої досягнення.",
  },
  psych: {
    high: "Ви можете бути імпульсивним, схильним до ризику та мати знижений рівень емпатії або каяття. Ви можете діяти без огляду на наслідки.",
    moderate: "Ви можете іноді проявляти черствість або імпульсивність, але загалом контролюєте свою поведінку.",
    low: "Ви маєте високий рівень емпатії, обережності та турботи про почуття інших.",
  },
};

const calculateScores = (responses: (number | null)[]) => {
  const score = (idx: number) => {
    const val = responses[idx] ?? 0;
    return REVERSE_ITEMS.has(idx) ? 6 - val : val;
  };

  let mach = 0, narc = 0, psych = 0;
  for (let i = 0; i < 9; i++) mach += score(i);
  for (let i = 9; i < 18; i++) narc += score(i);
  for (let i = 18; i < 27; i++) psych += score(i);

  return {
    mach: +(mach / 9).toFixed(1),
    narc: +(narc / 9).toFixed(1),
    psych: +(psych / 9).toFixed(1),
  };
};

const STORAGE_KEY = 'dark-triad-progress';

const DarkTriadTest = () => {
  usePageSEO({
    title: 'Темна Тріада (SD3) — Тест онлайн',
    description: 'Пройдіть тест Коротка Темна Тріада (SD3) онлайн. 27 питань для оцінки Макіавеллізму, Нарцисизму та Психопатії.',
    canonical: 'https://myrhorodskyi.lovable.app/tests/temna-triada',
    keywords: 'темна тріада тест, макіавеллізм, нарцисизм, психопатія, SD3 тест онлайн',
  });

  const [stage, setStage] = useState<'intro' | 'test' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<(number | null)[]>(new Array(27).fill(null));
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.responses?.length === 27) {
          setResponses(data.responses);
          setCurrentQuestion(data.currentQuestion || 0);
          if (data.responses.some((r: number | null) => r !== null)) setStage('test');
        }
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (stage === 'test') {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ responses, currentQuestion }));
    }
  }, [responses, currentQuestion, stage]);

  const progress = (responses.filter(r => r !== null).length / questions.length) * 100;
  const allAnswered = responses.every(r => r !== null);
  const scores = calculateScores(responses);

  const handleResponse = (value: number) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = value;
    setResponses(newResponses);
    setShowValidation(false);
  };

  const goNext = () => {
    if (responses[currentQuestion] === null) { setShowValidation(true); return; }
    if (currentQuestion < questions.length - 1) { setCurrentQuestion(p => p + 1); setShowValidation(false); }
  };

  const goPrev = () => {
    if (currentQuestion > 0) { setCurrentQuestion(p => p - 1); setShowValidation(false); }
  };

  const submitTest = () => {
    if (!allAnswered) {
      setShowValidation(true);
      const first = responses.findIndex(r => r === null);
      if (first !== -1) setCurrentQuestion(first);
      return;
    }
    setStage('results');
    sessionStorage.removeItem(STORAGE_KEY);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetTest = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setStage('intro');
    setCurrentQuestion(0);
    setResponses(new Array(27).fill(null));
    setShowValidation(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startTest = () => { setStage('test'); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleKeyboardNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) goNext();
    else if (allAnswered) submitTest();
  }, [currentQuestion, allAnswered, responses]);

  useTestKeyboard({
    isActive: stage === 'test',
    optionsCount: 5,
    currentValue: responses[currentQuestion] !== null ? responses[currentQuestion]! - 1 : null,
    onSelect: (idx) => handleResponse(idx + 1),
    onNext: handleKeyboardNext,
    onPrev: goPrev,
  });

  const TraitCard = ({ label, score, traitKey }: { label: string; score: number; traitKey: string }) => {
    const level = getTraitLevel(score);
    const colors = traitColors[level];
    const interp = interpretations[traitKey][level];
    return (
      <Card className={cn("border-2 shadow-lg", colors.borderColor, colors.bgColor)}>
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-semibold text-foreground">{label}</h3>
            <Badge className={cn("text-sm px-3 py-1", colors.bgColor, colors.color, "border", colors.borderColor)}>
              {traitLevelLabels[level]}
            </Badge>
          </div>
          <p className={cn("text-4xl font-bold mb-1", colors.color)}>{score.toFixed(1)}</p>
          <p className="text-sm text-muted-foreground mb-4">з 5.0</p>
          <div className="relative h-3 bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 rounded-full overflow-hidden mb-4">
            <div
              className="absolute top-0 h-full w-1 bg-foreground shadow-lg"
              style={{ left: `${((score - 1) / 4) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mb-4">
            <span>1.0</span>
            <span>2.5</span>
            <span>3.5</span>
            <span>5.0</span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">{interp}</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-8 bg-primary">
        <div className="container-custom section-padding py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Drama className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Коротка Темна Тріада (SD3)
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Short Dark Triad
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <AnimatePresence mode="wait">
            {stage === 'intro' && (
              <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                <Card className="border-border shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-display text-2xl md:text-3xl text-foreground">Про тест</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                      Тест "Коротка Темна Тріада" (Short Dark Triad, SD3) — це науково обґрунтований інструмент для оцінки трьох соціально неприйнятних рис особистості:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li><strong className="text-foreground">Макіавеллізм:</strong> Схильність до маніпуляцій, цинізм та стратегічний розрахунок.</li>
                      <li><strong className="text-foreground">Нарцисизм:</strong> Потреба в увазі, грандіозність та почуття власної значущості.</li>
                      <li><strong className="text-foreground">Психопатія:</strong> Імпульсивність, низька емпатія та схильність до ризику.</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed">
                      Тест складається з 27 тверджень. Будь ласка, будьте чесними — тут немає "правильних" чи "неправильних" відповідей.
                    </p>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-amber-800 text-sm">
                          <strong>Важливо:</strong> Цей тест призначений для самопізнання і не є клінічним діагнозом. Високі бали не обов'язково означають наявність розладу особистості.
                        </p>
                      </div>
                    </div>

                    <div className="bg-muted rounded-xl p-6">
                      <h3 className="font-semibold text-foreground mb-3">Інструкція</h3>
                      <p className="text-muted-foreground">
                        Оцініть, наскільки ви погоджуєтеся з кожним твердженням за шкалою від 1 (Зовсім не згоден) до 5 (Цілком згоден).
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <Badge variant="secondary">27 питань</Badge>
                      <Badge variant="secondary">~5 хвилин</Badge>
                    </div>

                    <Button variant="cta" size="lg" className="w-full" onClick={startTest}>
                      Розпочати тест
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {stage === 'test' && (
              <motion.div key="test" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Питання {currentQuestion + 1} з {questions.length}</span>
                    <span className="text-sm font-medium text-foreground">{Math.round(progress)}% завершено</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <Card className="border-border shadow-lg">
                  <CardContent className="pt-8 pb-6">
                    <AnimatePresence mode="wait">
                      <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                        <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-8 text-center">
                          {currentQuestion + 1}. {questions[currentQuestion]}
                        </h2>

                        <RadioGroup
                          value={responses[currentQuestion]?.toString() ?? ''}
                          onValueChange={(val) => handleResponse(parseInt(val))}
                          className="space-y-3"
                        >
                          {responseOptions.map((option) => (
                            <Label
                              key={option.value}
                              htmlFor={`option-${option.value}`}
                              className={cn(
                                "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                                responses[currentQuestion] === option.value
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50 hover:bg-muted/50"
                              )}
                            >
                              <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                              <span className="text-foreground">{option.label}</span>
                            </Label>
                          ))}
                        </RadioGroup>

                        {showValidation && responses[currentQuestion] === null && (
                          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-sm mt-4 text-center">
                            Будь ласка, оберіть відповідь перед тим, як продовжити
                          </motion.p>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
                      <Button variant="outline" onClick={goPrev} disabled={currentQuestion === 0}>
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Назад
                      </Button>
                      {currentQuestion < questions.length - 1 ? (
                        <Button variant="cta" onClick={goNext}>
                          Наступне
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      ) : (
                        <Button variant="cta" onClick={submitTest} disabled={!allAnswered}>
                          Отримати результати
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestion(idx)}
                      className={cn(
                        "w-8 h-8 rounded-full text-xs font-medium transition-all",
                        idx === currentQuestion
                          ? "bg-primary text-primary-foreground"
                          : responses[idx] !== null
                          ? "bg-primary/20 text-primary hover:bg-primary/30"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                      aria-label={`Питання ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {stage === 'results' && (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="space-y-6">
                <TraitCard label="🎭 Макіавеллізм" score={scores.mach} traitKey="mach" />
                <TraitCard label="👑 Нарцисизм" score={scores.narc} traitKey="narc" />
                <TraitCard label="⚡ Психопатія" score={scores.psych} traitKey="psych" />

                <Card className="border-primary/20 bg-primary/5 shadow-lg">
                  <CardContent className="pt-6 pb-6 text-center">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      💬 Хочете обговорити результати?
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Запишіться на консультацію, щоб отримати професійну оцінку та індивідуальні рекомендації.
                    </p>
                    <Button variant="cta" size="lg" asChild>
                      <a href="https://t.me/SigurdPSYBot?start=64f8747ec7512692c00d1788" target="_blank" rel="noopener noreferrer">Записатися на консультацію</a>
                    </Button>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" onClick={resetTest}>
                    <RotateCcw className="mr-2 w-4 h-4" />
                    Пройти тест знову
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/tests">
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Повернутися до тестів
                    </Link>
                  </Button>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="bg-muted rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div className="text-sm text-muted-foreground">
                        <p className="font-semibold text-foreground mb-1">🔒 Конфіденційність</p>
                        <p>Ваші відповіді обробляються локально у вашому браузері. Ми не зберігаємо ваші результати.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                      <div className="text-sm text-muted-foreground">
                        <p className="font-semibold text-foreground mb-1">⚠️ Важливе застереження</p>
                        <p>Результати є орієнтовними і не є клінічним діагнозом. Високі бали не означають наявність розладу особистості.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DarkTriadTest;
