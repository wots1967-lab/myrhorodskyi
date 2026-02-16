import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, RotateCcw, Shield, AlertTriangle, Puzzle } from 'lucide-react';
import { cn } from '@/lib/utils';
import usePageSEO from '@/hooks/usePageSEO';

const questions = [
  "Чи часто Ви відчуваєте потяг до нових вражень, щоб струсити з себе апатію, відчути збудження?",
  "Чи часто Ви відчуваєте, що потребуєте друзів, які можуть Вас зрозуміти, підбадьорити або втішити?",
  "Ви безтурботна людина?",
  "Чи важко Вам відмовитися від своїх намірів (сказати \"ні\")?",
  "Ви обдумуєте свої справи не поспішаючи, вважаєте за краще почекати, перш ніж діяти?",
  "Ви завжди стримуєте свої обіцянки, навіть якщо це Вам невигідно?",
  "У Вас часто бувають спади і підйоми настрою?",
  "Ви зазвичай дієте і говорите швидко, не роздумуючи?",
  "Чи виникало у Вас коли-небудь почуття, що Ви нещасні, хоча серйозної причини для цього не було?",
  "Чи зробили б Ви майже все, що завгодно, \"на спір\"?",
  "Чи виникає у Вас відчуття боязкості і зніяковіння, коли Ви хочете познайомитися з особою протилежної статі?",
  "Чи буває, що Ви сердитеся?",
  "Чи часто Ви дієте під впливом хвилинного настрою?",
  "Вас часто турбує думка про те, що Ви зробили або сказали щось таке, чого не слід було робити або говорити?",
  "Ви віддаєте перевагу читанню книг перед зустрічами з людьми?",
  "Вас легко образити?",
  "Ви любите часто бувати в компаніях?",
  "Чи бувають у Вас думки, якими Вам не хотілося б ділитися з іншими?",
  "Чи вірно, що іноді Ви сповнені енергії, так що все горить в руках, а іноді зовсім мляві?",
  "Ви прагнете обмежити коло своїх знайомств невеликою кількістю найближчих друзів?",
  "Ви багато мрієте?",
  "Коли на Вас кричать, Ви відповідаєте тим же?",
  "Вас часто турбує почуття провини?",
  "Чи всі Ваші звички хороші і бажані?",
  "Чи здатні Ви дати волю почуттям і повеселитися в галасливій компанії?",
  "Чи можна сказати, що нерви у Вас часто бувають напружені до межі?",
  "Ви вважаєте, що Вас вважають за людину жваву і веселу?",
  "Після того, як справу зроблено, чи часто Ви подумки повертаєтеся до неї і думаєте, що могли б зробити її краще?",
  "Ви зазвичай мовчите, перебуваючи в товаристві інших людей?",
  "Ви іноді пліткуєте?",
  "Чи буває, що Вам не спиться через те, що різні думки лізуть у голову?",
  "Якщо Ви хочете дізнатися про щось, то Ви віддаєте перевагу тому, щоб прочитати про це в книзі, ніж запитати у друзів?",
  "Чи буває у Вас сильне серцебиття?",
  "Чи подобається Вам робота, що вимагає пильної уваги?",
  "Чи бувають у Вас напади тремтіння?",
  "Якби Ви знали, що сказане Вами ніколи не буде розголошено, Ви б завжди висловлювалися в дусі загальноприйнятого?",
  "Вам неприємно бувати в компанії, де постійно жартують один над одним?",
  "Ви дратівливі?",
  "Чи подобається Вам робота, що вимагає швидкої дії?",
  "Чи хвилюєтеся Ви з приводу якихось неприємних подій, які могли б трапитися?",
  "Ви ходите повільно і неквапливо?",
  "Ви коли-небудь запізнювалися на побачення або на роботу?",
  "Вам часто сняться кошмари?",
  "Чи вірно, що Ви так любите поговорити, що не пропускаєте нагоди поспілкуватися з незнайомою людиною?",
  "Чи турбують Вас які-небудь болі?",
  "Ви почувалися б дуже нещасним, якби тривалий час були позбавлені широкого спілкування з людьми?",
  "Чи можете Ви назвати себе нервовою людиною?",
  "Чи є серед Ваших знайомих люди, які Вам явно не подобаються?",
  "Ви впевнена в собі людина?",
  "Вас легко зачіпає критика Ваших недоліків або Вашої роботи?",
  "Ви вважаєте, що важко отримати справжнє задоволення від заходів, у яких бере участь багато людей?",
  "Вас турбує відчуття, що Ви чимось гірші за інших?",
  "Ви легко змогли б внести пожвавлення в нудну компанію?",
  "Чи буває, що Ви говорите про речі, в яких зовсім не розбираєтеся?",
  "Ви турбуєтеся про своє здоров'я?",
  "Ви любите пожартувати над іншими?",
  "Ви страждаєте від безсоння?",
];

// Scoring keys (1-indexed question numbers)
const E_YES = new Set([1, 3, 8, 10, 13, 17, 22, 25, 27, 39, 44, 46, 49, 53, 56]);
const E_NO = new Set([5, 15, 20, 29, 32, 34, 37, 41, 51]);
const N_YES = new Set([2, 4, 7, 9, 11, 14, 16, 19, 21, 23, 26, 28, 31, 33, 35, 38, 40, 43, 45, 47, 50, 52, 55, 57]);
const L_YES = new Set([6, 24, 36]);
const L_NO = new Set([12, 18, 30, 42, 48, 54]);

type Temperament = 'sanguine' | 'choleric' | 'melancholic' | 'phlegmatic';

const calculateScores = (responses: (boolean | null)[]) => {
  let e = 0, n = 0, l = 0;
  responses.forEach((val, idx) => {
    const qNum = idx + 1;
    if (val === true) {
      if (E_YES.has(qNum)) e++;
      if (N_YES.has(qNum)) n++;
      if (L_YES.has(qNum)) l++;
    } else if (val === false) {
      if (E_NO.has(qNum)) e++;
      if (L_NO.has(qNum)) l++;
    }
  });
  return { e, n, l };
};

const getTemperament = (e: number, n: number): Temperament => {
  if (e >= 12 && n < 12) return 'sanguine';
  if (e >= 12 && n >= 12) return 'choleric';
  if (e < 12 && n >= 12) return 'melancholic';
  return 'phlegmatic';
};

const temperamentData: Record<Temperament, { emoji: string; label: string; color: string; bgColor: string; borderColor: string; description: string; strengths: string; weaknesses: string }> = {
  sanguine: {
    emoji: '🟡', label: 'Сангвінік',
    color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200',
    description: 'Ви — життєрадісна, енергійна та товариська людина. Ви легко адаптуєтеся до нових умов, швидко знаходите спільну мову з людьми та любите бути в центрі уваги. Ваші емоції виникають швидко, але вони неглибокі та швидко змінюються.',
    strengths: 'Оптимізм, комунікабельність, стресостійкість, лідерські якості.',
    weaknesses: 'Непостійність, схильність кидати почате, поверхневість.',
  },
  choleric: {
    emoji: '🔴', label: 'Холерик',
    color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200',
    description: 'Ви — активна, пристрасна та рішуча людина, проте іноді буваєте запальною. Ви відрізняєтеся високою працездатністю та ініціативністю, але вам може бракувати терпіння. Ваші емоційні реакції сильні та бурхливі.',
    strengths: 'Енергійність, цілеспрямованість, здатність долати перешкоди, пристрасність.',
    weaknesses: 'Запальність, нетерплячість, конфліктність, різкі зміни настрою.',
  },
  phlegmatic: {
    emoji: '🟢', label: 'Флегматик',
    color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200',
    description: 'Ви — спокійна, виважена та наполеглива людина. Вас важко вивести з рівноваги. Ви послідовні у своїх діях, надійні та працьовиті. Ваші почуття глибокі, але зовні ви їх майже не проявляєте.',
    strengths: 'Врівноваженість, надійність, терпіння, висока працездатність.',
    weaknesses: 'Повільність у прийнятті рішень, "сухість" емоцій, слабка адаптація до змін.',
  },
  melancholic: {
    emoji: '🔵', label: 'Меланхолік',
    color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200',
    description: 'Ви — чутлива, вразлива людина з глибоким внутрішнім світом. Ви тонко відчуваєте настрій оточуючих і схильні до співпереживання. У звичних умовах ви можете бути дуже продуктивні, особливо у творчості.',
    strengths: 'Чутливість, емпатія, творчі здібності, глибина почуттів, відповідальність.',
    weaknesses: 'Тривожність, вразливість, схильність до песимізму, швидка втомлюваність.',
  },
};

const STORAGE_KEY = 'eysenck-epi-progress';

const EysenckGraph = ({ e, n }: { e: number; n: number }) => {
  const size = 280;
  const padding = 30;
  const inner = size - padding * 2;
  const cx = padding + (e / 24) * inner;
  const cy = padding + ((24 - n) / 24) * inner;
  const mid = size / 2;

  return (
    <div className="flex justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background quadrants */}
        <rect x={padding} y={padding} width={inner / 2} height={inner / 2} fill="hsl(210 80% 95%)" rx="4" />
        <rect x={mid} y={padding} width={inner / 2} height={inner / 2} fill="hsl(0 80% 95%)" rx="4" />
        <rect x={padding} y={mid} width={inner / 2} height={inner / 2} fill="hsl(140 60% 95%)" rx="4" />
        <rect x={mid} y={mid} width={inner / 2} height={inner / 2} fill="hsl(45 80% 95%)" rx="4" />

        {/* Axes */}
        <line x1={padding} y1={mid} x2={size - padding} y2={mid} stroke="hsl(0 0% 70%)" strokeWidth="1" />
        <line x1={mid} y1={padding} x2={mid} y2={size - padding} stroke="hsl(0 0% 70%)" strokeWidth="1" />

        {/* Labels */}
        <text x={mid} y={padding - 8} textAnchor="middle" fontSize="11" fill="hsl(0 0% 40%)">Нейротизм (24)</text>
        <text x={mid} y={size - padding + 18} textAnchor="middle" fontSize="11" fill="hsl(0 0% 40%)">Стабільність (0)</text>
        <text x={padding - 5} y={mid} textAnchor="end" fontSize="11" fill="hsl(0 0% 40%)" dominantBaseline="middle">Інтр.</text>
        <text x={size - padding + 5} y={mid} textAnchor="start" fontSize="11" fill="hsl(0 0% 40%)" dominantBaseline="middle">Екстр.</text>

        {/* Quadrant labels */}
        <text x={padding + inner / 4} y={padding + inner / 4} textAnchor="middle" fontSize="10" fill="hsl(210 60% 50%)" dominantBaseline="middle">Меланхолік</text>
        <text x={mid + inner / 4} y={padding + inner / 4} textAnchor="middle" fontSize="10" fill="hsl(0 60% 50%)" dominantBaseline="middle">Холерик</text>
        <text x={padding + inner / 4} y={mid + inner / 4} textAnchor="middle" fontSize="10" fill="hsl(140 50% 40%)" dominantBaseline="middle">Флегматик</text>
        <text x={mid + inner / 4} y={mid + inner / 4} textAnchor="middle" fontSize="10" fill="hsl(40 70% 45%)" dominantBaseline="middle">Сангвінік</text>

        {/* User dot */}
        <circle cx={cx} cy={cy} r="8" fill="hsl(var(--primary))" stroke="white" strokeWidth="2" />
        <text x={cx} y={cy - 14} textAnchor="middle" fontSize="11" fontWeight="bold" fill="hsl(var(--primary))">
          ({e}, {n})
        </text>
      </svg>
    </div>
  );
};

const TemperamentTest = () => {
  usePageSEO({
    title: 'Тест на темперамент Айзенка (EPI) — Тест онлайн',
    description: 'Визначте свій тип темпераменту за методикою Ганса Айзенка. 57 питань для оцінки екстраверсії та нейротизму.',
    canonical: 'https://myrhorodskyi.com/tests/temperament',
    keywords: 'тест Айзенка, темперамент тест, сангвінік холерик флегматик меланхолік, EPI тест онлайн',
  });

  const [stage, setStage] = useState<'intro' | 'test' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<(boolean | null)[]>(new Array(57).fill(null));
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.responses?.length === 57) {
          setResponses(data.responses);
          setCurrentQuestion(data.currentQuestion || 0);
          if (data.responses.some((r: boolean | null) => r !== null)) setStage('test');
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
  const temperament = temperamentData[getTemperament(scores.e, scores.n)];

  const handleResponse = useCallback((value: boolean) => {
    setResponses(prev => {
      const next = [...prev];
      next[currentQuestion] = value;
      return next;
    });
    setShowValidation(false);
  }, [currentQuestion]);

  const goNext = useCallback(() => {
    if (responses[currentQuestion] === null) { setShowValidation(true); return; }
    if (currentQuestion < questions.length - 1) { setCurrentQuestion(p => p + 1); setShowValidation(false); }
  }, [currentQuestion, responses]);

  const goPrev = useCallback(() => {
    if (currentQuestion > 0) { setCurrentQuestion(p => p - 1); setShowValidation(false); }
  }, [currentQuestion]);

  const submitTest = useCallback(() => {
    if (!allAnswered) {
      setShowValidation(true);
      const first = responses.findIndex(r => r === null);
      if (first !== -1) setCurrentQuestion(first);
      return;
    }
    setStage('results');
    sessionStorage.removeItem(STORAGE_KEY);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [allAnswered, responses]);

  const resetTest = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setStage('intro');
    setCurrentQuestion(0);
    setResponses(new Array(57).fill(null));
    setShowValidation(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startTest = () => { setStage('test'); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  // Keyboard: Enter=next, Backspace=prev, 1/Y=Yes, 2/N=No
  useEffect(() => {
    if (stage !== 'test') return;
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') return;
      switch (e.key) {
        case '1': case 'y': case 'Y': case 'т': case 'Т':
          e.preventDefault(); handleResponse(true); break;
        case '2': case 'n': case 'N': case 'н': case 'Н':
          e.preventDefault(); handleResponse(false); break;
        case 'Enter':
          e.preventDefault();
          if (currentQuestion < questions.length - 1) goNext();
          else if (allAnswered) submitTest();
          break;
        case 'Backspace': e.preventDefault(); goPrev(); break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [stage, currentQuestion, allAnswered, handleResponse, goNext, goPrev, submitTest]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-8 bg-primary">
        <div className="container-custom section-padding py-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Puzzle className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Тест на темперамент Айзенка
            </h1>
            <p className="text-lg text-primary-foreground/80">Eysenck Personality Inventory (EPI)</p>
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
                      Цей тест, розроблений психологом Гансом Айзенком, є класичним інструментом для визначення темпераменту. Він оцінює дві основні шкали вашої особистості:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li><strong className="text-foreground">Екстраверсія — Інтроверсія:</strong> Наскільки ви спрямовані на зовнішній світ або на власні переживання.</li>
                      <li><strong className="text-foreground">Нейротизм (Емоційна стабільність):</strong> Наскільки ваша нервова система стійка до стресу.</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed">
                      На перетині цих шкал визначається ваш домінуючий тип темпераменту: Сангвінік, Холерик, Флегматик або Меланхолік.
                    </p>

                    <div className="bg-muted rounded-xl p-6">
                      <h3 className="font-semibold text-foreground mb-3">Інструкція</h3>
                      <p className="text-muted-foreground">
                        Вам буде запропоновано 57 питань. Відповідайте «Так» або «Ні». Не витрачайте багато часу на роздуми — перша реакція зазвичай найбільш правдива.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <Badge variant="secondary">57 питань</Badge>
                      <Badge variant="secondary">~10-15 хвилин</Badge>
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

                        <div className="flex gap-4 justify-center">
                          <Button
                            size="lg"
                            variant={responses[currentQuestion] === true ? "cta" : "outline"}
                            className="flex-1 max-w-[160px] text-lg py-6"
                            onClick={() => handleResponse(true)}
                          >
                            Так
                          </Button>
                          <Button
                            size="lg"
                            variant={responses[currentQuestion] === false ? "cta" : "outline"}
                            className="flex-1 max-w-[160px] text-lg py-6"
                            onClick={() => handleResponse(false)}
                          >
                            Ні
                          </Button>
                        </div>

                        {showValidation && responses[currentQuestion] === null && (
                          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-sm mt-4 text-center">
                            Будь ласка, оберіть відповідь
                          </motion.p>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
                      <Button variant="outline" onClick={goPrev} disabled={currentQuestion === 0}>
                        <ArrowLeft className="mr-2 w-4 h-4" />Назад
                      </Button>
                      {currentQuestion < questions.length - 1 ? (
                        <Button variant="cta" onClick={goNext}>Наступне<ArrowRight className="ml-2 w-4 h-4" /></Button>
                      ) : (
                        <Button variant="cta" onClick={submitTest} disabled={!allAnswered}>Отримати результати</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-6 flex flex-wrap justify-center gap-1.5">
                  {questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestion(idx)}
                      className={cn(
                        "w-7 h-7 rounded-full text-[10px] font-medium transition-all",
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
                {/* Main result */}
                <Card className={cn("border-2 shadow-lg", temperament.borderColor, temperament.bgColor)}>
                  <CardContent className="pt-8 pb-8 text-center">
                    <p className="text-5xl mb-4">{temperament.emoji}</p>
                    <p className="text-muted-foreground mb-2">Ваш тип темпераменту</p>
                    <p className={cn("text-4xl md:text-5xl font-bold mb-4", temperament.color)}>{temperament.label}</p>
                    <div className="flex justify-center gap-4 flex-wrap">
                      <Badge variant="secondary">Екстраверсія: {scores.e}/24</Badge>
                      <Badge variant="secondary">Нейротизм: {scores.n}/24</Badge>
                      <Badge variant="secondary">Шкала брехні: {scores.l}/9</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Lie scale warning */}
                {scores.l > 4 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                      <p className="text-amber-800 text-sm">
                        <strong>Увага:</strong> Результати можуть бути неточними, оскільки ви намагалися відповідати соціально бажано (шкала брехні: {scores.l}/9).
                      </p>
                    </div>
                  </div>
                )}

                {/* Graph */}
                <Card className="border-border shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-display text-xl text-foreground">Координатна карта</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EysenckGraph e={scores.e} n={scores.n} />
                  </CardContent>
                </Card>

                {/* Interpretation */}
                <Card className="border-border shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-display text-xl text-foreground">{temperament.emoji} {temperament.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">{temperament.description}</p>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Сильні сторони:</p>
                      <p className="text-muted-foreground">{temperament.strengths}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Слабкі сторони:</p>
                      <p className="text-muted-foreground">{temperament.weaknesses}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* CTA */}
                <Card className="border-primary/20 bg-primary/5 shadow-lg">
                  <CardContent className="pt-6 pb-6 text-center">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">💬 Хочете обговорити результати?</h3>
                    <p className="text-muted-foreground mb-6">Запишіться на консультацію для професійної оцінки та індивідуальних рекомендацій.</p>
                    <Button variant="cta" size="lg" asChild>
                      <a href="https://t.me/SigurdPSYBot?start=64f8747ec7512692c00d1788" target="_blank" rel="noopener noreferrer">Записатися на консультацію</a>
                    </Button>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" onClick={resetTest}><RotateCcw className="mr-2 w-4 h-4" />Пройти тест знову</Button>
                  <Button variant="outline" asChild><Link to="/tests"><ArrowLeft className="mr-2 w-4 h-4" />Повернутися до тестів</Link></Button>
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
                        <p>Результати є орієнтовними і не замінюють професійну консультацію психолога.</p>
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

export default TemperamentTest;
