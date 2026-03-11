import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, RotateCcw, Users, Shield, Heart, Brain, Sparkles, Baby } from 'lucide-react';
import { cn } from '@/lib/utils';
import usePageSEO, { createTestJsonLd } from '@/hooks/usePageSEO';
import KeyboardHints, { HINTS_EGO_STATES } from '@/components/KeyboardHints';
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
  "Я твердо кажу людям, як їм поводитися, встановлюю правила.",
  "Я намагаюсь детально обдумувати, перш ніж щось зробити.",
  "Я роблю так, як мене просять.",
  "Я співчуваю людям, які мають проблеми.",
  "Я отримую задоволення, коли я з іншими людьми.",
  "Мені подобається піклуватися про інших людей.",
  "Мені подобається розв'язувати задачі логічно та системно.",
  "Я кажу людям, що їм потрібно робити, керую, ініціюю.",
  "Я показую людям свої почуття без ніяковості.",
  "Я людина вихована та ввічлива.",
  "Я внутрішньо бунтую і невдоволений, коли від мене чогось хочуть.",
  "Якщо на роботі з'являється новачок, я намагаюся показати йому, що і де знаходиться.",
  "Я можу залишатися спокійним у складній ситуації.",
  "Коли я впевнений, що правий, я наполягаю, щоб інші слухали мене.",
  "Я ставлю багато запитань, якщо мені цікаво.",
  "Робота швидко мені набридає.",
  "Люди очікують від мене, що я знаю відповідь.",
  "Мене просять піклуватися про нових співробітників.",
  "Я легко знаходжу спільну мову з людьми, які ввічливі зі мною.",
  "Я продовжую мислити логічно навіть у складних обставинах.",
  "Мій стиль роботи систематичний.",
  "Я одягаюся приблизно в такому ж стилі, як і інші в тому місці, куди йду.",
  "Я роблю щось за інших, коли думаю, що їм важко впоратися самостійно.",
  "Я згадую свій минулий досвід рішень, коли у мене виникають проблеми.",
  "Люди кажуть, що я людина творча та винахідлива.",
  "Я бажаю керувати і давати вказівки сам, а не дотримуватися чиїхось вказівок.",
  "Я занадто багато піклуюся про інших людей.",
  "Я занадто емоційний у порівнянні з іншими.",
  "Я очікую, що більш обізнана людина вирішить, що мені робити, і розставить пріоритети.",
  "Я враховую всі точки зору, коли приймаю рішення.",
  "Я заохочую людей проявляти свої здібності.",
  "Люди скаржаться, що я поводжуся владно.",
  "У мене є час насолоджуватися собою.",
  "Люди кажуть, що я дуже ввічливий.",
  "Люди відзначають мій рівний характер та збалансовані погляди.",
  "Я проявляю свої почуття, коли радію або сумую, так, що іншим людям зрозумілі мої стани.",
  "Я спостерігаю за кимось, навіть якщо він міг би впоратися сам.",
  "Я намагаюся аналізувати жарти, що псує їх для інших.",
  "Люди роблять те, що я їм кажу.",
  "Я занадто легко погоджуюся з тим, що кажуть інші.",
];

const responseOptions = [
  { value: 0, label: "Невірно для мене" },
  { value: 1, label: "Іноді вірно" },
  { value: 2, label: "Переважно вірно" },
  { value: 3, label: "Майже завжди вірно" },
];

// Scoring: question indices (0-based)
const scales: Record<string, { label: string; short: string; questions: number[]; icon: React.ElementType; color: string }> = {
  KB: {
    label: "Контролюючий Батько",
    short: "КБ",
    questions: [0, 7, 13, 16, 23, 25, 31, 38],
    icon: Shield,
    color: "hsl(168, 56%, 23%)",
  },
  OB: {
    label: "Опікаючий Батько",
    short: "ОБ",
    questions: [3, 5, 11, 17, 22, 26, 30, 36],
    icon: Heart,
    color: "hsl(28, 55%, 40%)",
  },
  D: {
    label: "Дорослий",
    short: "Д",
    questions: [1, 6, 12, 19, 20, 29, 34, 37],
    icon: Brain,
    color: "hsl(168, 40%, 35%)",
  },
  VD: {
    label: "Вільна Дитина",
    short: "ВД",
    questions: [4, 8, 14, 15, 24, 27, 32, 35],
    icon: Sparkles,
    color: "hsl(28, 45%, 55%)",
  },
  AD: {
    label: "Адаптована Дитина",
    short: "АД",
    questions: [2, 9, 10, 18, 21, 28, 33, 39],
    icon: Baby,
    color: "hsl(168, 35%, 50%)",
  },
};

const descriptions: Record<string, string> = {
  KB: "Відповідає за встановлення меж, дотримання правил, критику та структуру. У позитиві — це захист і порядок, у негативі — жорсткість, директивність та знецінення.",
  OB: "Виражається через турботу, підтримку, емпатію та допомогу іншим. У позитиві — це тепле заохочення, у негативі — гіперпіклування, яке не дає іншим проявляти самостійність.",
  D: "Стан об'єктивного аналізу «тут і зараз». Робота з фактами, логічне мислення, пошук оптимальних рішень без зайвих емоцій та упереджень.",
  VD: "Джерело енергії, спонтанності, творчості, щирої радості та інтуїції. Це наші природні бажання («Хочу!»). У негативі може проявлятися як безвідповідальність.",
  AD: "Стан, у якому ми підлаштовуємося під очікування інших, дотримуємося соціальних норм. Це також бунт проти правил або надмірна поступливість всупереч власним інтересам.",
};

const barColors = [
  "hsl(168, 56%, 23%)",
  "hsl(28, 55%, 40%)",
  "hsl(168, 40%, 35%)",
  "hsl(28, 45%, 55%)",
  "hsl(168, 35%, 50%)",
];

// --- COMPONENT ---

const EgoStatesTest = () => {
  usePageSEO({
    title: 'Тест Его-станів — Егограма за Джулі Хей онлайн безкоштовно',
    description: 'Пройдіть тест функціональних Его-станів за методикою Джулі Хей онлайн безкоштовно. 40 питань для визначення профілю: Контролюючий Батько, Опікаючий Батько, Дорослий, Вільна Дитина, Адаптована Дитина.',
    canonical: 'https://myrhorodskyi.com/tests/profil-ego-staniv',
    keywords: 'тест его-станів онлайн, егограма тест, транзакційний аналіз тест, его стани Джулі Хей, тест его-станів безкоштовно українською',
    jsonLd: createTestJsonLd({
      name: 'Тест: Профіль Его-станів (Егограма)',
      description: 'Тест функціональних Его-станів за методикою Джулі Хей (транзакційний аналіз).',
      url: 'https://myrhorodskyi.com/tests/profil-ego-staniv',
      questionCount: 40,
      duration: 'PT7M',
    }),
  });

  const [stage, setStage] = useState<'intro' | 'test' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<(number | null)[]>(new Array(40).fill(null));

  const progress = (responses.filter(r => r !== null).length / questions.length) * 100;

  const handleResponse = useCallback((value: number) => {
    setResponses(prev => {
      const next = [...prev];
      next[currentQuestion] = value;
      return next;
    });
    // Auto-advance after short delay
    setTimeout(() => {
      setCurrentQuestion(prev => {
        if (prev < questions.length - 1) return prev + 1;
        return prev;
      });
    }, 350);
  }, [currentQuestion]);

  const calculateScores = () => {
    const scores: Record<string, number> = {};
    Object.entries(scales).forEach(([key, scale]) => {
      scores[key] = scale.questions.reduce((sum, qIdx) => sum + (responses[qIdx] ?? 0), 0);
    });
    return scores;
  };

  const startTest = () => {
    setStage('test');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitTest = () => {
    if (responses.some(r => r === null)) {
      // Find first unanswered
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
    setResponses(new Array(40).fill(null));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard navigation
  useEffect(() => {
    if (stage !== 'test') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case '0':
        case '1':
        case '2':
        case '3': {
          e.preventDefault();
          handleResponse(parseInt(e.key));
          break;
        }
        case 'Enter': {
          e.preventDefault();
          if (currentQuestion === questions.length - 1) {
            submitTest();
          } else {
            setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1));
          }
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
          const nextVal = responses[currentQuestion] === null ? 0 : Math.min((responses[currentQuestion] as number) + 1, 3);
          handleResponse(nextVal);
          break;
        }
        case 'ArrowLeft':
        case 'ArrowUp': {
          e.preventDefault();
          const prevVal = responses[currentQuestion] === null ? 3 : Math.max((responses[currentQuestion] as number) - 1, 0);
          handleResponse(prevVal);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, currentQuestion, responses, handleResponse]);

  const scores = calculateScores();
  const maxScore = 24; // 8 questions × 3

  const radarData = Object.entries(scales).map(([key, scale]) => ({
    subject: scale.short,
    value: scores[key],
    fullMark: maxScore,
  }));

  const barData = Object.entries(scales).map(([key, scale]) => ({
    name: scale.short,
    fullName: scale.label,
    value: scores[key],
    percentage: Math.round((scores[key] / maxScore) * 100),
  }));

  // Find dominant state
  const dominant = Object.entries(scores).reduce((a, b) => (b[1] > a[1] ? b : a), ['', 0]);

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
              <Users className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Тест: Ваш профіль Его-станів
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Дізнайтеся, як ви взаємодієте зі світом та приймаєте рішення на основі транзакційного аналізу
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border-border shadow-lg overflow-hidden">
                  <CardContent className="p-8 md:p-12 space-y-8">
                    <div>
                      <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                        Опитувальник функціональних Его-станів
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Методика Джулі Хей (Julie Hay, «TA for Trainers») дозволяє визначити ваш унікальний профіль п'яти
                        функціональних Его-станів — Контролюючого Батька, Опікаючого Батька, Дорослого, Вільної Дитини
                        та Адаптованої Дитини.
                      </p>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      Результатом є ваша персональна <strong className="text-foreground">Егограма</strong> — візуальний
                      профіль, який показує, які стратегії поведінки ви використовуєте найчастіше у повсякденному житті.
                    </p>

                    <div className="bg-muted rounded-xl p-6">
                      <h3 className="font-semibold text-foreground mb-3">Інструкція</h3>
                      <p className="text-muted-foreground">
                        Для кожного з наведених нижче тверджень оцініть, наскільки воно підходить вам:
                      </p>
                      <ul className="mt-3 space-y-1 text-muted-foreground text-sm">
                        <li><span className="font-medium text-foreground">0</span> — Невірно для мене</li>
                        <li><span className="font-medium text-foreground">1</span> — Іноді вірно</li>
                        <li><span className="font-medium text-foreground">2</span> — Переважно вірно</li>
                        <li><span className="font-medium text-foreground">3</span> — Майже завжди вірно</li>
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                        40 тверджень
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                        ~7 хвилин
                      </span>
                    </div>

                    <Button
                      variant="cta"
                      size="xl"
                      className="w-full"
                      onClick={startTest}
                    >
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
                      Твердження {currentQuestion + 1} з {questions.length}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {Math.round(progress)}%
                    </span>
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
                          {questions[currentQuestion]}
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {responseOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleResponse(option.value)}
                              className={cn(
                                "group relative flex flex-col items-center gap-2 p-5 rounded-xl border-2 cursor-pointer transition-all duration-200",
                                responses[currentQuestion] === option.value
                                  ? "border-primary bg-primary/5 shadow-md"
                                  : "border-border hover:border-primary/40 hover:bg-muted/50 hover:shadow-sm"
                              )}
                            >
                              <span className={cn(
                                "text-2xl font-display font-bold transition-colors",
                                responses[currentQuestion] === option.value
                                  ? "text-primary"
                                  : "text-muted-foreground group-hover:text-foreground"
                              )}>
                                {option.value}
                              </span>
                              <span className={cn(
                                "text-xs text-center leading-tight transition-colors",
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
                        <Button
                          variant="cta"
                          size="lg"
                          onClick={submitTest}
                          disabled={responses.some(r => r === null)}
                        >
                          Завершити тест
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                        >
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
                        i === currentQuestion
                          ? "bg-primary scale-125"
                          : responses[i] !== null
                            ? "bg-primary/40"
                            : "bg-border"
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Title */}
                <div className="text-center">
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                    Ваша Егограма
                  </h2>
                  <p className="text-muted-foreground">Профіль функціональних Его-станів</p>
                </div>

                {/* Radar Chart */}
                <Card className="border-border shadow-lg">
                  <CardContent className="p-6 md:p-10">
                    <div className="w-full" style={{ height: 380 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                          <PolarGrid stroke="hsl(168, 20%, 85%)" />
                          <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: 'hsl(168, 30%, 15%)', fontSize: 14, fontWeight: 600 }}
                          />
                          <PolarRadiusAxis
                            angle={90}
                            domain={[0, maxScore]}
                            tick={{ fill: 'hsl(168, 15%, 40%)', fontSize: 11 }}
                            tickCount={5}
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
                    <div className="w-full" style={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(168, 20%, 90%)" />
                          <XAxis
                            dataKey="name"
                            tick={{ fill: 'hsl(168, 30%, 15%)', fontSize: 13, fontWeight: 600 }}
                          />
                          <YAxis
                            domain={[0, maxScore]}
                            tick={{ fill: 'hsl(168, 15%, 40%)', fontSize: 12 }}
                          />
                          <Tooltip
                            formatter={(value: number, _name: string, props: any) => [
                              `${value} / ${maxScore} (${props.payload.percentage}%)`,
                              props.payload.fullName,
                            ]}
                            contentStyle={{
                              borderRadius: '12px',
                              border: '1px solid hsl(168, 20%, 85%)',
                              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                              fontSize: '13px',
                            }}
                          />
                          <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={48}>
                            {barData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={barColors[index]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Score summary */}
                    <div className="mt-8 grid grid-cols-5 gap-2 md:gap-4">
                      {Object.entries(scales).map(([key, scale], i) => (
                        <div key={key} className="text-center">
                          <div
                            className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded-xl flex items-center justify-center mb-2"
                            style={{ backgroundColor: `${barColors[i]}15` }}
                          >
                            <scale.icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: barColors[i] }} />
                          </div>
                          <p className="text-lg md:text-2xl font-display font-bold text-foreground">
                            {scores[key]}
                          </p>
                          <p className="text-[10px] md:text-xs text-muted-foreground font-medium">{scale.short}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Dominant state */}
                <Card className="border-border shadow-lg bg-primary/[0.03]">
                  <CardContent className="p-6 md:p-8 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Ваш домінуючий Его-стан</p>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      {scales[dominant[0]]?.label}
                    </h3>
                    <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                      {descriptions[dominant[0]]}
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
                      {Object.entries(scales).map(([key, scale], i) => (
                        <AccordionItem key={key} value={key} className="border-border">
                          <AccordionTrigger className="hover:no-underline py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${barColors[i]}15` }}
                              >
                                <scale.icon className="w-4 h-4" style={{ color: barColors[i] }} />
                              </div>
                              <span className="font-semibold text-foreground text-left">
                                {scale.label} ({scale.short})
                              </span>
                              <span className="ml-auto mr-3 text-sm font-medium text-muted-foreground">
                                {scores[key]}/{maxScore}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed pl-11">
                            {descriptions[key]}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="cta"
                    size="xl"
                    className="flex-1"
                    asChild
                  >
                    <a
                      href="https://t.me/SigurdPSYBot?start=64f8747ec7512692c00d1788"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Записатися на консультацію для розбору результатів
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="xl"
                    onClick={resetTest}
                  >
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
      {stage === 'test' && <KeyboardHints hints={HINTS_EGO_STATES} />}
    </div>
  );
};

export default EgoStatesTest;
