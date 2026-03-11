import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, RotateCcw, Shield, Heart, Brain, Sparkles, Baby, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import usePageSEO, { createTestJsonLd } from '@/hooks/usePageSEO';
import KeyboardHints, { HINTS_SCALE } from '@/components/KeyboardHints';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

// --- DATA ---

const questions = [
  { id: 1, text: "Я виправляю помилки інших людей, навіть якщо мене про це не просять.", category: "CP" },
  { id: 2, text: "Мене дратує, коли люди порушують встановлені правила.", category: "CP" },
  { id: 3, text: "Я використовую слова 'повинен', 'зобов'язаний', 'завжди', 'ніколи'.", category: "CP" },
  { id: 4, text: "Я критично оцінюю себе та свої досягнення.", category: "CP" },
  { id: 5, text: "Я вважаю, що точно знаю, як правильно вчинити в більшості ситуацій.", category: "CP" },
  { id: 6, text: "Я роблю зауваження, коли хтось поводиться неналежним чином.", category: "CP" },
  { id: 7, text: "Я наполягаю на своєму, якщо впевнений(а), що маю рацію.", category: "CP" },
  { id: 8, text: "Я співчуваю людям, коли їм важко, і намагаюся їх втішити.", category: "NP" },
  { id: 9, text: "Я із задоволенням допомагаю іншим, навіть шкодячи своєму часу.", category: "NP" },
  { id: 10, text: "Мені легко хвалити інших за їхні успіхи та досягнення.", category: "NP" },
  { id: 11, text: "Я беру на себе відповідальність за проблеми близьких мені людей.", category: "NP" },
  { id: 12, text: "Я відчуваю потребу дбати про тих, хто слабший або потребує допомоги.", category: "NP" },
  { id: 13, text: "Я уважно вислуховую людину, коли вона ділиться своїм болем.", category: "NP" },
  { id: 14, text: "Я часто даю поради і намагаюся 'врятувати' інших із складних ситуацій.", category: "NP" },
  { id: 15, text: "Я приймаю рішення на основі фактів та логіки, а не емоцій.", category: "A" },
  { id: 16, text: "Я можу спокійно вислухати критику і визнати свої помилки.", category: "A" },
  { id: 17, text: "Перед тим як щось зробити, я збираю необхідну інформацію.", category: "A" },
  { id: 18, text: "У конфліктних ситуаціях я шукаю компроміс і конструктивне рішення.", category: "A" },
  { id: 19, text: "Я планую свої справи та бюджет наперед.", category: "A" },
  { id: 20, text: "Я усвідомлюю наслідки своїх вчинків і несу за них відповідальність.", category: "A" },
  { id: 21, text: "Я здатний(а) змінити свою думку, проаналізувавши нові факти.", category: "A" },
  { id: 22, text: "Я вмію щиро радіти простим речам і дуріти.", category: "FC" },
  { id: 23, text: "Я дію спонтанно, спираючись на своє 'хочу'.", category: "FC" },
  { id: 24, text: "Мені подобається творити, вигадувати щось нове і нестандартне.", category: "FC" },
  { id: 25, text: "Я відкрито виражаю свої почуття (як радість, так і сум).", category: "FC" },
  { id: 26, text: "Я легко гублюся в часі, коли займаюся улюбленою справою (хобі).", category: "FC" },
  { id: 27, text: "Я люблю грати в ігри заради самого процесу, а не лише для перемоги.", category: "FC" },
  { id: 28, text: "Я легко захоплююся новими ідеями і проектами з ентузіазмом.", category: "FC" },
  { id: 29, text: "Я часто відчуваю провину або сором, коли щось іде не так.", category: "CC" },
  { id: 30, text: "Мені дуже важко сказати 'ні' та відмовити в проханні.", category: "CC" },
  { id: 31, text: "Я підлаштовуюся під думку авторитетних людей або більшості.", category: "CC" },
  { id: 32, text: "Я часто відчуваю себе безпорадним(ою), пригніченим(ою) або 'менше', ніж інші.", category: "CC" },
  { id: 33, text: "Я намагаюся бути зручним(ою) для всіх, щоб уникнути конфлікту.", category: "CC" },
  { id: 34, text: "Я тримаю свої негативні емоції в собі, побоюючись відкинення.", category: "CC" },
  { id: 35, text: "Я сильно переживаю через те, що про мене подумають інші.", category: "CC" },
  { id: 36, text: "Коли мені кажуть, що я щось 'повинен' зробити, я роблю навпаки.", category: "RC" },
  { id: 37, text: "Я часто сперечаюся з керівництвом або правилами просто з принципу.", category: "RC" },
  { id: 38, text: "Я можу саботувати справу, якщо вважаю, що мене до неї змушують.", category: "RC" },
  { id: 39, text: "Мене дратують авторитети, і я хочу довести їм, що вони не праві.", category: "RC" },
  { id: 40, text: "Мені подобається шокувати людей своєю поведінкою або зовнішнім виглядом.", category: "RC" },
  { id: 41, text: "Якщо мене критикують, я відповідаю агресією та нападаю у відповідь.", category: "RC" },
  { id: 42, text: "Я навмисне ігнорую поради інших лише для того, щоб зробити по-своєму.", category: "RC" },
];

const responseOptions = [
  { value: 1, label: "Ніколи" },
  { value: 2, label: "Рідко" },
  { value: 3, label: "Іноді" },
  { value: 4, label: "Часто" },
  { value: 5, label: "Майже завжди" },
];

type ScaleKey = 'CP' | 'NP' | 'A' | 'FC' | 'CC' | 'RC';

const scales: Record<ScaleKey, { label: string; short: string; icon: React.ElementType; color: string }> = {
  CP: { label: "Контролюючий Батько", short: "КБ", icon: Shield, color: "hsl(210, 35%, 35%)" },
  NP: { label: "Опікаючий Батько", short: "ОБ", icon: Heart, color: "hsl(28, 55%, 40%)" },
  A:  { label: "Дорослий", short: "Д", icon: Brain, color: "hsl(168, 40%, 30%)" },
  FC: { label: "Вільна Дитина", short: "ВД", icon: Sparkles, color: "hsl(38, 60%, 50%)" },
  CC: { label: "Слухняна Дитина", short: "СД", icon: Baby, color: "hsl(250, 30%, 50%)" },
  RC: { label: "Бунтуюча Дитина", short: "БД", icon: Flame, color: "hsl(0, 50%, 45%)" },
};

const descriptions: Record<ScaleKey, string> = {
  CP: "Відповідає за мораль, правила, критику та структуру. У позитивному прояві — це захист, принциповість і порядок. У негативному — жорсткість, тиск, знецінення себе та інших.",
  NP: "Виражається через турботу, підтримку, емпатію. У позитиві — це тепле заохочення та допомога. У негативі — гіперпіклування (рятівництво), що робить інших безпорадними і не дає їм проявляти самостійність.",
  A: "Стан об'єктивного аналізу \"тут і зараз\". Робота з фактами, логічне мислення, пошук оптимальних рішень без емоційних упереджень. Усвідомленість та відповідальність за своє життя.",
  FC: "Джерело енергії, життя, творчості, спонтанності та щирої радості. Це наші природні бажання («Хочу!»). У негативному прояві може виглядати як повна безвідповідальність та ігнорування потреб інших.",
  CC: "Стан, у якому людина підлаштовується під очікування інших. Часто супроводжується страхом відкинення, почуттям провини, сорому та тривоги. Людина в цьому стані намагається бути «зручною», уникає конфліктів і не вміє говорити «ні».",
  RC: "Стан активного чи пасивного опору контролю та авторитетам. Замість того щоб підкоритися (як Слухняна Дитина), Бунтар робить усе навпаки з почуття гніву чи протесту. Часто це боротьба заради боротьби, що шкодить самій людині (наприклад, саботаж власного успіху на зло комусь).",
};

const scaleKeys: ScaleKey[] = ['CP', 'NP', 'A', 'FC', 'CC', 'RC'];
const barColors = scaleKeys.map(k => scales[k].color);
const MAX_SCORE = 35; // 7 questions × 5 points

// --- COMPONENT ---

const ExpandedEgoStatesTest = () => {
  usePageSEO({
    title: 'Тест: Розширений Профіль Его-станів (6 станів) — онлайн безкоштовно',
    description: 'Пройдіть розширений тест Его-станів з 6 шкалами на основі транзакційного аналізу. 42 питання: Контролюючий Батько, Опікаючий Батько, Дорослий, Вільна Дитина, Слухняна Дитина, Бунтуюча Дитина.',
    canonical: 'https://myrhorodskyi.com/tests/rozshyrenyi-profil-ego-staniv',
    keywords: 'розширений тест его-станів, 6 его-станів тест, транзакційний аналіз тест онлайн, его-стани бунтуюча дитина, слухняна дитина тест',
    jsonLd: createTestJsonLd({
      name: 'Тест: Розширений Профіль Его-станів',
      description: 'Глибинний аналіз особистості на основі транзакційного аналізу з 6 функціональними его-станами.',
      url: 'https://myrhorodskyi.com/tests/rozshyrenyi-profil-ego-staniv',
      questionCount: 42,
      duration: 'PT10M',
    }),
  });

  const [stage, setStage] = useState<'intro' | 'test' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<(number | null)[]>(new Array(42).fill(null));

  const answeredCount = responses.filter(r => r !== null).length;
  const progress = (answeredCount / questions.length) * 100;

  const handleResponse = useCallback((value: number) => {
    setResponses(prev => {
      const next = [...prev];
      next[currentQuestion] = value;
      return next;
    });
    setTimeout(() => {
      setCurrentQuestion(prev => (prev < questions.length - 1 ? prev + 1 : prev));
    }, 300);
  }, [currentQuestion]);

  const calculateScores = () => {
    const scores: Record<ScaleKey, number> = { CP: 0, NP: 0, A: 0, FC: 0, CC: 0, RC: 0 };
    questions.forEach((q, i) => {
      if (responses[i] !== null) {
        scores[q.category as ScaleKey] += responses[i]!;
      }
    });
    return scores;
  };

  const startTest = () => {
    setStage('test');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitTest = () => {
    if (responses.some(r => r === null)) {
      const first = responses.findIndex(r => r === null);
      if (first !== -1) setCurrentQuestion(first);
      return;
    }
    setStage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetTest = () => {
    setStage('intro');
    setCurrentQuestion(0);
    setResponses(new Array(42).fill(null));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard navigation
  useEffect(() => {
    if (stage !== 'test') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case '1': case '2': case '3': case '4': case '5': {
          e.preventDefault();
          handleResponse(parseInt(e.key));
          break;
        }
        case 'Enter': {
          e.preventDefault();
          if (currentQuestion === questions.length - 1) submitTest();
          else setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1));
          break;
        }
        case 'Backspace': {
          e.preventDefault();
          setCurrentQuestion(prev => Math.max(0, prev - 1));
          break;
        }
        case 'ArrowRight':
        case 'ArrowDown': {
          e.preventDefault();
          const cur = responses[currentQuestion];
          const next = cur === null ? 1 : Math.min(cur + 1, 5);
          handleResponse(next);
          break;
        }
        case 'ArrowLeft':
        case 'ArrowUp': {
          e.preventDefault();
          const cur2 = responses[currentQuestion];
          const prev = cur2 === null ? 5 : Math.max(cur2 - 1, 1);
          handleResponse(prev);
          break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, currentQuestion, responses, handleResponse]);

  const scores = calculateScores();

  const radarData = scaleKeys.map(key => ({
    subject: scales[key].short,
    value: scores[key],
    fullMark: MAX_SCORE,
  }));

  const barData = scaleKeys.map(key => ({
    name: scales[key].short,
    fullName: scales[key].label,
    value: scores[key],
    percentage: Math.round((scores[key] / MAX_SCORE) * 100),
  }));

  const dominant = scaleKeys.reduce((a, b) => (scores[b] > scores[a] ? b : a), 'CP' as ScaleKey);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-8 bg-primary">
        <div className="container-custom section-padding py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Тест: Розширений Профіль Его-станів
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Глибинний аналіз вашої особистості на основі транзакційного аналізу (6 станів)
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <AnimatePresence mode="wait">

            {/* INTRO */}
            {stage === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-border shadow-lg overflow-hidden">
                  <CardContent className="p-8 md:p-12 space-y-8">
                    <div>
                      <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                        Розширений Профіль Его-станів
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Цей тест допоможе визначити, як розподіляється ваша психологічна енергія.
                        Оцініть 42 твердження залежно від того, наскільки часто ви так поводитеся чи почуваєтеся.
                        Відповідайте швидко та інтуїтивно.
                      </p>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      На відміну від класичного тесту з 5 станами, цей опитувальник розділяє Адаптовану Дитину на два окремі стани —{' '}
                      <strong className="text-foreground">Слухняну / Пригнічену Дитину</strong> та{' '}
                      <strong className="text-foreground">Бунтуючу Дитину</strong>, що дає точніший профіль.
                    </p>

                    <div className="bg-muted rounded-xl p-6">
                      <h3 className="font-semibold text-foreground mb-3">Інструкція</h3>
                      <p className="text-muted-foreground">
                        Для кожного твердження оберіть, наскільки часто воно стосується вас:
                      </p>
                      <ul className="mt-3 space-y-1 text-muted-foreground text-sm">
                        <li><span className="font-medium text-foreground">1</span> — Ніколи</li>
                        <li><span className="font-medium text-foreground">2</span> — Рідко</li>
                        <li><span className="font-medium text-foreground">3</span> — Іноді</li>
                        <li><span className="font-medium text-foreground">4</span> — Часто</li>
                        <li><span className="font-medium text-foreground">5</span> — Майже завжди</li>
                      </ul>
                    </div>

                    {/* 6 states preview */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {scaleKeys.map(key => {
                        const s = scales[key];
                        const Icon = s.icon;
                        return (
                          <div key={key} className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/50">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${s.color}15` }}>
                              <Icon className="w-4 h-4" style={{ color: s.color }} />
                            </div>
                            <span className="text-sm font-medium text-foreground">{s.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                        42 твердження
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                        ~10 хвилин
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                        6 шкал
                      </span>
                    </div>

                    <Button variant="cta" size="xl" className="w-full" onClick={startTest}>
                      Почати тест
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Progress */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      Запитання {currentQuestion + 1} з {questions.length}
                    </span>
                    <span className="text-sm font-medium text-foreground">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Question */}
                <Card className="border-border shadow-lg">
                  <CardContent className="p-8 md:p-10">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="text-center text-muted-foreground text-sm mb-2 font-medium tracking-wide uppercase">
                          Твердження {currentQuestion + 1}
                        </p>
                        <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-10 text-center leading-relaxed">
                          {questions[currentQuestion].text}
                        </h2>

                        <div className="grid grid-cols-5 gap-2 md:gap-3">
                          {responseOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleResponse(option.value)}
                              className={cn(
                                "group relative flex flex-col items-center gap-2 p-4 md:p-5 rounded-xl border-2 cursor-pointer transition-all duration-200",
                                responses[currentQuestion] === option.value
                                  ? "border-primary bg-primary/5 shadow-md"
                                  : "border-border hover:border-primary/40 hover:bg-muted/50 hover:shadow-sm"
                              )}
                            >
                              <span className={cn(
                                "text-xl md:text-2xl font-display font-bold transition-colors",
                                responses[currentQuestion] === option.value
                                  ? "text-primary"
                                  : "text-muted-foreground group-hover:text-foreground"
                              )}>
                                {option.value}
                              </span>
                              <span className={cn(
                                "text-[10px] md:text-xs text-center leading-tight transition-colors",
                                responses[currentQuestion] === option.value
                                  ? "text-primary font-medium"
                                  : "text-muted-foreground"
                              )}>
                                {option.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
                      <Button
                        variant="ghost"
                        onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestion === 0}
                      >
                        ← Назад
                      </Button>
                      {currentQuestion === questions.length - 1 ? (
                        <Button variant="cta" size="lg" onClick={submitTest} disabled={responses.some(r => r === null)}>
                          Завершити тест
                        </Button>
                      ) : (
                        <Button variant="outline" onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}>
                          Далі →
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Question dots */}
                <div className="mt-6 flex flex-wrap justify-center gap-1.5">
                  {questions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentQuestion(i)}
                      className={cn(
                        "w-2.5 h-2.5 rounded-full transition-all duration-200",
                        i === currentQuestion ? "bg-primary scale-125"
                          : responses[i] !== null ? "bg-primary/40" : "bg-border"
                      )}
                      aria-label={`Питання ${i + 1}`}
                    />
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
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                    Ваша Розширена Егограма
                  </h2>
                  <p className="text-muted-foreground">Розподіл вашої психологічної енергії за 6 станами</p>
                </div>

                {/* Radar Chart */}
                <Card className="border-border shadow-lg">
                  <CardContent className="p-6 md:p-10">
                    <div className="w-full" style={{ height: 400 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
                          <PolarGrid stroke="hsl(168, 20%, 85%)" />
                          <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: 'hsl(168, 30%, 15%)', fontSize: 14, fontWeight: 600 }}
                          />
                          <PolarRadiusAxis
                            angle={90}
                            domain={[0, MAX_SCORE]}
                            tick={{ fill: 'hsl(168, 15%, 40%)', fontSize: 11 }}
                            tickCount={6}
                          />
                          <Radar
                            name="Его-стан"
                            dataKey="value"
                            stroke="hsl(168, 56%, 23%)"
                            fill="hsl(168, 56%, 23%)"
                            fillOpacity={0.15}
                            strokeWidth={2.5}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Bar Chart */}
                <Card className="border-border shadow-lg">
                  <CardContent className="p-6 md:p-10">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-6 text-center">
                      Бали за шкалами
                    </h3>
                    <div className="w-full" style={{ height: 320 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(168, 20%, 90%)" />
                          <XAxis dataKey="name" tick={{ fill: 'hsl(168, 30%, 15%)', fontSize: 13, fontWeight: 600 }} />
                          <YAxis domain={[0, MAX_SCORE]} tick={{ fill: 'hsl(168, 15%, 40%)', fontSize: 12 }} />
                          <Tooltip
                            formatter={(value: number, _name: string, props: any) => [
                              `${value} / ${MAX_SCORE} (${props.payload.percentage}%)`,
                              props.payload.fullName,
                            ]}
                            contentStyle={{
                              borderRadius: '12px',
                              border: '1px solid hsl(168, 20%, 85%)',
                              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                              fontSize: '13px',
                            }}
                          />
                          <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={44}>
                            {barData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={barColors[index]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Score summary */}
                    <div className="mt-8 grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
                      {scaleKeys.map((key, i) => {
                        const s = scales[key];
                        const Icon = s.icon;
                        return (
                          <div key={key} className="text-center">
                            <div
                              className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded-xl flex items-center justify-center mb-2"
                              style={{ backgroundColor: `${barColors[i]}15` }}
                            >
                              <Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: barColors[i] }} />
                            </div>
                            <p className="text-lg md:text-2xl font-display font-bold text-foreground">{scores[key]}</p>
                            <p className="text-[10px] md:text-xs text-muted-foreground font-medium">{s.short}</p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Dominant state */}
                <Card className="border-border shadow-lg bg-primary/[0.03]">
                  <CardContent className="p-6 md:p-8 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Ваш домінуючий Его-стан</p>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      {scales[dominant].label}
                    </h3>
                    <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                      {descriptions[dominant]}
                    </p>
                  </CardContent>
                </Card>

                {/* Descriptions Accordion */}
                <Card className="border-border shadow-lg">
                  <CardContent className="p-6 md:p-8">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                      Опис кожного Его-стану
                    </h3>
                    <Accordion type="single" collapsible className="w-full">
                      {scaleKeys.map((key, i) => {
                        const s = scales[key];
                        const Icon = s.icon;
                        return (
                          <AccordionItem key={key} value={key} className="border-border">
                            <AccordionTrigger className="hover:no-underline py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: `${barColors[i]}15` }}
                                >
                                  <Icon className="w-4 h-4" style={{ color: barColors[i] }} />
                                </div>
                                <span className="font-semibold text-foreground text-left">
                                  {s.label} ({s.short})
                                </span>
                                <span className="ml-auto mr-3 text-sm font-medium text-muted-foreground">
                                  {scores[key]}/{MAX_SCORE}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed pl-11">
                              {descriptions[key]}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </CardContent>
                </Card>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="cta" size="xl" className="flex-1" asChild>
                    <a
                      href="https://t.me/SigurdPSYBot?start=64f8747ec7512692c00d1788"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Записатися на консультацію для розбору результатів
                    </a>
                  </Button>
                  <Button variant="outline" size="xl" onClick={resetTest}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Пройти ще раз
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>

      <Footer />
      {stage === 'test' && <KeyboardHints hints={HINTS_SCALE(5)} />}
    </div>
  );
};

export default ExpandedEgoStatesTest;
