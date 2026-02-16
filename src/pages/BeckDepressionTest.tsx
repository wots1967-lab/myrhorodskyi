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
import { ArrowLeft, ArrowRight, RotateCcw, CloudRain, Shield, Phone, CheckCircle2, AlertTriangle, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import usePageSEO from '@/hooks/usePageSEO';
import { useTestKeyboard } from '@/hooks/useTestKeyboard';

interface Question {
  title: string;
  options: string[];
}

const questions: Question[] = [
  {
    title: 'Смуток',
    options: [
      'Я не почуваюся засмученим(ою).',
      'Я почуваюся засмученим(ою).',
      'Я весь час засмучений(а) і не можу позбутися цього почуття.',
      'Я настільки засмучений(а) і нещасний(а), що не можу цього витримати.',
    ],
  },
  {
    title: 'Песимізм',
    options: [
      'Я не почуваюся збентеженим(ою) щодо майбутнього.',
      'Я почуваюся збентеженим(ою) щодо майбутнього.',
      'Я відчуваю, що мені нічого чекати в майбутньому.',
      'Я відчуваю, що майбутнє безнадійне, і нічого не зміниться на краще.',
    ],
  },
  {
    title: 'Відчуття невдачі',
    options: [
      'Я не відчуваю себе невдахою.',
      'Я відчуваю, що мав(ла) більше невдач, ніж інші люди.',
      'Коли я озираюся на своє життя, я бачу лише низку невдач.',
      'Я відчуваю себе повним невдахою як особистість.',
    ],
  },
  {
    title: 'Втрата задоволення',
    options: [
      'Я отримую стільки ж задоволення від речей, як і раніше.',
      'Я не отримую стільки задоволення від речей, як раніше.',
      'Я більше не отримую справжнього задоволення від чого-небудь.',
      'Я всім незадоволений(а) або мені все набридло.',
    ],
  },
  {
    title: 'Почуття провини',
    options: [
      'Я не почуваюся винним(ою).',
      'Я почуваюся винним(ою) значну частину часу.',
      'Я почуваюся винним(ою) більшу частину часу.',
      'Я почуваюся винним(ою) увесь час.',
    ],
  },
  {
    title: 'Відчуття покарання',
    options: [
      'Я не відчуваю, що мене карають.',
      'Я відчуваю, що мене можуть покарати.',
      'Я очікую, що мене покарають.',
      'Я відчуваю, що мене карають.',
    ],
  },
  {
    title: 'Нелюбов до себе',
    options: [
      'Я не розчарований(а) у собі.',
      'Я розчарований(а) у собі.',
      'Я відчуваю відразу до себе.',
      'Я ненавиджу себе.',
    ],
  },
  {
    title: 'Самозвинувачення',
    options: [
      'Я не відчуваю себе гіршим(ою) за інших.',
      'Я критикую себе за свої слабкості або помилки.',
      'Я весь час звинувачую себе за свої вчинки.',
      'Я звинувачую себе у всьому поганому, що трапляється.',
    ],
  },
  {
    title: 'Суїцидальні думки',
    options: [
      'Я не маю жодних думок про те, щоб покінчити з собою.',
      'У мене є думки про самогубство, але я не буду їх здійснювати.',
      'Я хотів(ла) би покінчити з собою.',
      'Я б укоротив(ла) собі віку, якби трапилася така нагода.',
    ],
  },
  {
    title: 'Плаксивість',
    options: [
      'Я плачу не більше, ніж зазвичай.',
      'Зараз я плачу більше, ніж раніше.',
      'Зараз я плачу весь час.',
      'Раніше я міг(ла) плакати, а тепер не можу, навіть якщо хочу.',
    ],
  },
  {
    title: 'Дратівливість',
    options: [
      'Я не більш роздратований(а), ніж зазвичай.',
      'Я роздратований(а) або сердитий(а) якийсь час.',
      'Я відчуваю роздратування значну частину часу.',
      'Я роздратований(а) увесь час.',
    ],
  },
  {
    title: 'Втрата інтересу до людей',
    options: [
      'Я не втратив(ла) інтересу до інших людей.',
      'Я менше цікавлюся людьми, ніж раніше.',
      'Я втратив(ла) більшу частину інтересу до інших людей.',
      'Я втратив(ла) будь-який інтерес до інших людей.',
    ],
  },
  {
    title: 'Нерішучість',
    options: [
      'Я приймаю рішення так само добре, як і раніше.',
      'Я відкладаю прийняття рішень частіше, ніж раніше.',
      'Мені важче приймати рішення, ніж раніше.',
      'Я більше не можу приймати жодних рішень.',
    ],
  },
  {
    title: 'Зміна образу тіла',
    options: [
      'Я не відчуваю, що виглядаю гірше, ніж зазвичай.',
      'Мене турбує те, що я виглядаю старим(ою) або непривабливим(ою).',
      'Я відчуваю, що в моїй зовнішності відбуваються постійні зміни, які роблять мене непривабливим(ою).',
      'Я вважаю, що виглядаю потворно.',
    ],
  },
  {
    title: 'Працездатність',
    options: [
      'Я можу працювати так само добре, як і раніше.',
      'Мені потрібно докладати додаткових зусиль, щоб почати щось робити.',
      'Мені доводиться змушувати себе щось робити.',
      'Я зовсім нічого не можу робити.',
    ],
  },
  {
    title: 'Зміни сну',
    options: [
      'Я сплю так само добре, як і зазвичай.',
      'Я сплю гірше, ніж раніше.',
      'Я прокидаюся на 1-2 години раніше, ніж зазвичай, і мені важко заснути знову.',
      'Я прокидаюся на кілька годин раніше, ніж раніше, і не можу заснути знову.',
    ],
  },
  {
    title: 'Втомлюваність',
    options: [
      'Я втомлююся не більше, ніж зазвичай.',
      'Я втомлююся легше, ніж раніше.',
      'Я втомлююся майже від усього, що роблю.',
      'Я занадто втомлений(а), щоб щось робити.',
    ],
  },
  {
    title: 'Зміни апетиту',
    options: [
      'Мій апетит не гірший, ніж зазвичай.',
      'Мій апетит не такий добрий, як раніше.',
      'Мій апетит зараз набагато гірший.',
      'У мене зовсім немає апетиту.',
    ],
  },
  {
    title: 'Втрата ваги',
    options: [
      'Останнім часом я не схуд(ла) (або схуд(ла) незначно).',
      'Я схуд(ла) більше ніж на 2 кг.',
      'Я схуд(ла) більше ніж на 5 кг.',
      'Я схуд(ла) більше ніж на 7 кг.',
    ],
  },
  {
    title: 'Стурбованість здоров\'ям',
    options: [
      'Я не турбуюся про своє здоров\'я більше, ніж зазвичай.',
      'Мене турбують фізичні проблеми, такі як біль, розлад шлунка або запор.',
      'Я дуже стурбований(а) фізичними проблемами, і мені важко думати про щось інше.',
      'Я настільки стурбований(а) своїми фізичними проблемами, що не можу думати ні про що інше.',
    ],
  },
  {
    title: 'Втрата лібідо',
    options: [
      'Я не помітив(ла) жодних змін у своєму інтересі до сексу.',
      'Я менше цікавлюся сексом, ніж раніше.',
      'Я зараз набагато менше цікавлюся сексом.',
      'Я повністю втратив(ла) інтерес до сексу.',
    ],
  },
];

type DepressionLevel = 'minimal' | 'mild' | 'moderate' | 'severe';

interface InterpretationData {
  level: DepressionLevel;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  recommendations: string[];
}

const interpretations: Record<DepressionLevel, InterpretationData> = {
  minimal: {
    level: 'minimal',
    label: 'Відсутність або мінімальна депресія',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    description: 'Ваш емоційний стан в межах норми. Ви можете відчувати звичайні коливання настрою, але вони не досягають клінічно значущого рівня депресії.',
    recommendations: [
      'Продовжуйте вести здоровий спосіб життя',
      'Зберігайте баланс роботи та відпочинку',
      'Займайтеся фізичною активністю',
    ],
  },
  mild: {
    level: 'mild',
    label: 'Легка депресія',
    icon: AlertTriangle,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description: 'Ви можете відчувати симптоми легкої депресії. Це може проявлятися як постійна втома, зниження інтересу до звичних справ або почуття смутку. Часто цей стан можна скорегувати змінами способу життя.',
    recommendations: [
      'Зверніть увагу на режим сну та харчування',
      'Спробуйте додати більше фізичної активності',
      'Спілкуйтеся з близькими та друзями',
      'Консультація психолога допоможе розібратися в причинах',
    ],
  },
  moderate: {
    level: 'moderate',
    label: 'Помірна депресія',
    icon: AlertCircle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    description: 'Ваші симптоми вказують на помірний рівень депресії. Це стан, який може суттєво впливати на якість вашого життя, роботу та стосунки.',
    recommendations: [
      'Рекомендується звернутися до психолога або психотерапевта',
      'Когнітивно-поведінкова терапія є ефективною при таких станах',
      'Не ігноруйте цей стан, він потребує уваги',
      'Спробуйте структурувати свій день та ставити маленькі досяжні цілі',
    ],
  },
  severe: {
    level: 'severe',
    label: 'Виражена (тяжка) депресія',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    description: 'Зверніть увагу! Ваш результат вказує на наявність симптомів тяжкої депресії. Цей стан вимагає професійної допомоги.',
    recommendations: [
      'Настійно рекомендується консультація лікаря-психіатра або психотерапевта',
      'Не займайтеся самолікуванням',
      "Пам'ятайте, що депресія — це хвороба, яка піддається лікуванню",
      'Якщо у вас виникають думки про небажання жити, негайно зверніться за допомогою',
    ],
  },
};

const getInterpretation = (score: number): DepressionLevel => {
  if (score <= 13) return 'minimal';
  if (score <= 19) return 'mild';
  if (score <= 28) return 'moderate';
  return 'severe';
};

const SUICIDAL_QUESTION_INDEX = 8;

const BeckDepressionTest = () => {
  usePageSEO({
    title: 'Шкала депресії Бека (BDI) — Тест онлайн',
    description: 'Пройдіть тест на депресію за шкалою Бека (BDI) онлайн. 21 питання для оцінки ступеня депресивних симптомів.',
    canonical: 'https://myrhorodskyi.lovable.app/tests/shkala-depresii-beka',
    keywords: 'шкала депресії Бека, BDI тест, тест депресії онлайн, рівень депресії',
  });

  const [stage, setStage] = useState<'intro' | 'test' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<(number | null)[]>(new Array(21).fill(null));
  const [showValidation, setShowValidation] = useState(false);

  // Load saved progress
  useEffect(() => {
    const saved = sessionStorage.getItem('beck-depression-progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.responses && data.responses.length === 21) {
          setResponses(data.responses);
          setCurrentQuestion(data.currentQuestion || 0);
          if (data.responses.some((r: number | null) => r !== null)) {
            setStage('test');
          }
        }
      } catch (e) { /* ignore */ }
    }
  }, []);

  // Save progress
  useEffect(() => {
    if (stage === 'test') {
      sessionStorage.setItem('beck-depression-progress', JSON.stringify({
        responses,
        currentQuestion,
      }));
    }
  }, [responses, currentQuestion, stage]);

  const progress = ((responses.filter(r => r !== null).length) / questions.length) * 100;
  const allAnswered = responses.every(r => r !== null);
  const totalScore = responses.reduce((sum: number, val) => sum + (val ?? 0), 0);
  const interpretation = interpretations[getInterpretation(totalScore)];
  const hasSuicidalRisk = (responses[SUICIDAL_QUESTION_INDEX] ?? 0) >= 2;

  const handleResponse = (value: number) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = value;
    setResponses(newResponses);
    setShowValidation(false);
  };

  const goNext = () => {
    if (responses[currentQuestion] === null) {
      setShowValidation(true);
      return;
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowValidation(false);
    }
  };

  const goPrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setShowValidation(false);
    }
  };

  const submitTest = () => {
    if (!allAnswered) {
      setShowValidation(true);
      const firstUnanswered = responses.findIndex(r => r === null);
      if (firstUnanswered !== -1) setCurrentQuestion(firstUnanswered);
      return;
    }
    setStage('results');
    sessionStorage.removeItem('beck-depression-progress');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetTest = () => {
    sessionStorage.removeItem('beck-depression-progress');
    setStage('intro');
    setCurrentQuestion(0);
    setResponses(new Array(21).fill(null));
    setShowValidation(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startTest = () => {
    setStage('test');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKeyboardNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      goNext();
    } else if (allAnswered) {
      submitTest();
    }
  }, [currentQuestion, allAnswered, responses]);

  useTestKeyboard({
    isActive: stage === 'test',
    optionsCount: 4,
    currentValue: responses[currentQuestion],
    onSelect: handleResponse,
    onNext: handleKeyboardNext,
    onPrev: goPrev,
  });

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-8 bg-primary">
        <div className="container-custom section-padding py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <CloudRain className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Шкала депресії Бека
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Beck Depression Inventory (BDI)
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <AnimatePresence mode="wait">
            {/* INTRODUCTION */}
            {stage === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border-border shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-display text-2xl md:text-3xl text-foreground">
                      Про тест
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                      Шкала депресії Бека (Beck Depression Inventory) — це один з найпоширеніших у світі опитувальників 
                      для визначення ступеня депресії. Він був розроблений доктором Аароном Беком і базується на клінічних 
                      спостереженнях за симптомами, що найчастіше турбують пацієнтів.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Тест складається з 21 групи тверджень. У кожній групі вам потрібно вибрати одне твердження, 
                      яке найкраще описує ваше самопочуття протягом останнього тижня, включаючи сьогоднішній день.
                    </p>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-amber-800 text-sm">
                          <strong>Важливо:</strong> Результати цього тесту носять інформаційний характер і не можуть бути 
                          використані для самостійної постановки діагнозу. Якщо ваші результати вказують на наявність депресії, 
                          або якщо ви маєте думки про заподіяння собі шкоди, обов'язково зверніться до спеціаліста.
                        </p>
                      </div>
                    </div>

                    <div className="bg-muted rounded-xl p-6">
                      <h3 className="font-semibold text-foreground mb-3">Інструкція</h3>
                      <p className="text-muted-foreground">
                        Прочитайте уважно кожну групу тверджень. Виберіть одне твердження в кожній групі, 
                        яке найкраще відповідає тому, як ви почувалися протягом цього тижня та сьогодні.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <Badge variant="secondary">21 питання</Badge>
                      <Badge variant="secondary">~5-10 хвилин</Badge>
                    </div>

                    <Button variant="cta" size="lg" className="w-full" onClick={startTest}>
                      Розпочати тест
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* TEST */}
            {stage === 'test' && (
              <motion.div
                key="test"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Progress */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      Питання {currentQuestion + 1} з {questions.length}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {Math.round(progress)}% завершено
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Question Card */}
                <Card className="border-border shadow-lg">
                  <CardContent className="pt-8 pb-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-8 text-center">
                          {currentQuestion + 1}. {currentQ.title}
                        </h2>

                        <RadioGroup
                          value={responses[currentQuestion]?.toString() ?? ''}
                          onValueChange={(val) => handleResponse(parseInt(val))}
                          className="space-y-3"
                        >
                          {currentQ.options.map((option, idx) => (
                            <Label
                              key={idx}
                              htmlFor={`q${currentQuestion}-option-${idx}`}
                              className={cn(
                                "flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all min-h-[44px]",
                                responses[currentQuestion] === idx
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50 hover:bg-muted/50"
                              )}
                            >
                              <RadioGroupItem
                                value={idx.toString()}
                                id={`q${currentQuestion}-option-${idx}`}
                                className="mt-0.5 shrink-0"
                              />
                              <span className="text-foreground text-sm md:text-base leading-relaxed">{option}</span>
                            </Label>
                          ))}
                        </RadioGroup>

                        {showValidation && responses[currentQuestion] === null && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-destructive text-sm mt-4 text-center"
                          >
                            Будь ласка, оберіть відповідь перед тим, як продовжити
                          </motion.p>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
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

                {/* Quick navigation dots */}
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

            {/* RESULTS */}
            {stage === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Suicidal risk warning */}
                {hasSuicidalRisk && (
                  <Card className="border-2 border-red-400 bg-red-50 shadow-lg">
                    <CardContent className="pt-6 pb-6">
                      <div className="flex items-start gap-4">
                        <Phone className="w-8 h-8 text-red-600 shrink-0 mt-1" />
                        <div>
                          <h3 className="font-display text-lg font-bold text-red-800 mb-2">
                            ⚠️ Важливе повідомлення
                          </h3>
                          <p className="text-red-800 mb-4">
                            Ви зазначили наявність думок про самогубство. Будь ласка, зверніться за професійною 
                            допомогою негайно. Ваше життя має цінність, і цей стан є тимчасовим і піддається лікуванню.
                          </p>
                          <div className="space-y-1 text-red-800 font-semibold">
                            <p>📞 Лінія запобігання суїцидам: <strong>7333</strong> (безкоштовно по Україні)</p>
                            <p>📞 Швидка допомога: <strong>103</strong></p>
                            <p>📞 Екстрена психологічна допомога: <strong>0 800 500 335</strong></p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Score Card */}
                <Card className={cn("border-2 shadow-lg", interpretation.borderColor, interpretation.bgColor)}>
                  <CardContent className="pt-8 pb-8 text-center">
                    <div className="mb-4">
                      <interpretation.icon className={cn("w-16 h-16 mx-auto", interpretation.color)} />
                    </div>
                    <p className="text-muted-foreground mb-2">Ваш результат</p>
                    <p className={cn("text-6xl md:text-7xl font-bold mb-2", interpretation.color)}>
                      {totalScore}
                    </p>
                    <p className="text-muted-foreground mb-4">з 63 балів</p>
                    <Badge className={cn("text-lg px-4 py-1", interpretation.bgColor, interpretation.color, "border", interpretation.borderColor)}>
                      {interpretation.label}
                    </Badge>

                    {/* Score Bar */}
                    <div className="mt-6 max-w-md mx-auto">
                      <div className="relative h-4 bg-gradient-to-r from-emerald-400 via-amber-400 via-orange-400 to-red-500 rounded-full overflow-hidden">
                        <div
                          className="absolute top-0 h-full w-1 bg-foreground shadow-lg"
                          style={{ left: `${(totalScore / 63) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0</span>
                        <span>13</span>
                        <span>19</span>
                        <span>28</span>
                        <span>63</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Interpretation Card */}
                <Card className="border-border shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-display text-xl text-foreground">
                      Інтерпретація результатів
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {interpretation.description}
                    </p>

                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Рекомендації:</h4>
                      <ul className="space-y-2">
                        {interpretation.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                            <span className="text-primary mt-1">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {(interpretation.level === 'severe' || hasSuicidalRisk) && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Phone className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                          <div className="text-red-800 text-sm">
                            <p className="font-semibold mb-2">
                              Якщо ви відчуваєте гострий стан або думки про заподіяння собі шкоди, зверніться за негайною допомогою:
                            </p>
                            <ul className="space-y-1">
                              <li>• Лінія запобігання суїцидам: <strong>7333</strong> (безкоштовно по Україні)</li>
                              <li>• Екстрена психологічна допомога: <strong>0 800 500 335</strong></li>
                              <li>• Швидка допомога: <strong>103</strong></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* CTA Card */}
                <Card className="border-primary/20 bg-primary/5 shadow-lg">
                  <CardContent className="pt-6 pb-6 text-center">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      💬 Хочете обговорити результати?
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Запишіться на консультацію, щоб отримати професійну оцінку вашого стану 
                      та індивідуальні рекомендації.
                    </p>
                    <Button variant="cta" size="lg" asChild>
                      <a href="https://t.me/SigurdPSYBot?start=64f8747ec7512692c00d1788" target="_blank" rel="noopener noreferrer">
                        Записатися на консультацію
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                {/* Actions */}
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

                {/* Privacy & Disclaimer */}
                <div className="mt-8 space-y-4">
                  <div className="bg-muted rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div className="text-sm text-muted-foreground">
                        <p className="font-semibold text-foreground mb-1">🔒 Конфіденційність</p>
                        <p>
                          Ваші відповіді обробляються локально у вашому браузері. 
                          Ми не зберігаємо ваші результати без вашої згоди.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                      <div className="text-sm text-muted-foreground">
                        <p className="font-semibold text-foreground mb-1">⚠️ Важливе застереження</p>
                        <p>
                          Цей тест призначений лише для інформаційних цілей і не є медичною діагностикою. 
                          Результати не замінюють професійну консультацію психолога або психіатра.
                        </p>
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

export default BeckDepressionTest;
