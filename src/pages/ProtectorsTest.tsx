import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Download, RotateCcw, Shield, Crown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import usePageSEO from '@/hooks/usePageSEO';
import KeyboardHints, { HINTS_SCALE } from '@/components/KeyboardHints';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';

// --- DATA ---

const questions = [
  { id: 1, category: "Perfectionist", text: "Я постійно прагну до ідеалу та відчуваю провину, якщо роблю помилки." },
  { id: 6, category: "Perfectionist", text: "Мені складно делегувати завдання, бо ніхто не зробить це так добре, як я." },
  { id: 11, category: "Perfectionist", text: "Я живу за жорстким розкладом або правилами і нервую, коли вони порушуються." },
  { id: 16, category: "Perfectionist", text: "Я часто прокручую в голові минулі розмови, думаючи, що міг/могла б сказати краще." },
  { id: 21, category: "Perfectionist", text: "Якщо я не продуктивний/а, я відчуваю себе непотрібним/ою." },
  { id: 2, category: "Caretaker", text: "Я часто ставлю потреби інших людей вище за свої власні." },
  { id: 7, category: "Caretaker", text: "Я відчуваю дискомфорт, коли комусь поруч погано, і відразу намагаюся це 'полагодити'." },
  { id: 12, category: "Caretaker", text: "Мені дуже важко казати 'ні', особливо близьким людям." },
  { id: 17, category: "Caretaker", text: "Я відчуваю себе цінним/ою лише тоді, коли допомагаю іншим або дбаю про них." },
  { id: 22, category: "Caretaker", text: "Я часто беру на себе відповідальність за емоції інших людей." },
  { id: 3, category: "Critic", text: "Мій внутрішній голос часто жорстоко засуджує мене за найменші промахи." },
  { id: 8, category: "Critic", text: "Я часто порівнюю себе з іншими і відчуваю, що програю їм." },
  { id: 13, category: "Critic", text: "Я вірю, що сувора критика до себе — це єдиний спосіб досягти успіху." },
  { id: 18, category: "Critic", text: "Я часто лякаю себе найгіршими сценаріями майбутнього, щоб 'бути готовим/ою'." },
  { id: 23, category: "Critic", text: "Що б я не зробив/ла, мені здається, що цього недостатньо." },
  { id: 4, category: "Avoider", text: "Коли виникає конфлікт або складна емоція, я намагаюся відволіктися (соцмережі, їжа, серіали)." },
  { id: 9, category: "Avoider", text: "Я часто відкладаю важливі справи на потім (прокрастинація), бо вони викликають тривогу." },
  { id: 14, category: "Avoider", text: "Я можу емоційно 'відключатися' або відчувати порожнечу під час серйозних сварок." },
  { id: 19, category: "Avoider", text: "Я уникаю глибоких розмов про свої почуття та страхи." },
  { id: 24, category: "Avoider", text: "Коли мені боляче, я вважаю за краще просто забути про це і йти далі." },
  { id: 5, category: "Aggressor", text: "Найкращий захист для мене — це напад. Я швидко стаю в оборонну або агресивну позицію." },
  { id: 10, category: "Aggressor", text: "Якщо я відчуваю загрозу або несправедливість, я можу дуже сильно та імпульсивно розізлитися." },
  { id: 15, category: "Aggressor", text: "Я часто використовую сарказм або цинізм, щоб тримати людей на відстані." },
  { id: 20, category: "Aggressor", text: "Я швидше покажу гнів і роздратування, ніж свою слабкість або сум." },
  { id: 25, category: "Aggressor", text: "Люди часто кажуть, що я буваю занадто різким/ою або авторитарним/ою." },
];

const responseOptions = [
  { value: 1, label: "Зовсім не про мене" },
  { value: 2, label: "Швидше не про мене" },
  { value: 3, label: "Важко сказати (50/50)" },
  { value: 4, label: "Швидше про мене" },
  { value: 5, label: "Дуже точно про мене" },
];

const categories: Record<string, {
  label: string;
  description: string;
  protectsFrom: string;
  cost: string;
}> = {
  Perfectionist: {
    label: "Перфекціоніст",
    description: "Ця частина намагається уникнути критики та сорому через бездоганність. Вона вірить, що якщо ви все зробите ідеально, ніхто не зможе вас відкинути.",
    protectsFrom: "Страх бути відкинутим, засудженим, недостатньо хорошим. Захищає від глибинного сорому та вразливості.",
    cost: "Постійне виснаження та відчуття, що ви ніколи не розслабляєтеся. Прокрастинація через страх зробити неідеально.",
  },
  Caretaker: {
    label: "Доглядач",
    description: "Захищає від покинутості та відчуття непотрібності через фокус на інтересах інших. Вона вірить, що вас любитимуть лише тоді, коли ви корисні.",
    protectsFrom: "Страх бути покинутим, непотрібним, самотнім. Захищає від відчуття власної нікчемності.",
    cost: "Втрата контакту зі своїми власними бажаннями та вигорання. Образа на тих, для кого ви «жертвуєте».",
  },
  Critic: {
    label: "Внутрішній Критик",
    description: "Атакує вас першим, щоб це не зробили інші. Вона вірить, що суворість — єдиний спосіб змусити вас розвиватися і не бути вразливим.",
    protectsFrom: "Страх несподіваного удару ззовні. Якщо ви вже знаєте свої недоліки, ніхто не зможе здивувати вас критикою.",
    cost: "Низька самооцінка та постійний внутрішній біль. Депресивні стани та відчуття безнадії.",
  },
  Avoider: {
    label: "Уникаючий",
    description: "Заморожує біль, відволікає увагу, щоб уникнути перевантаження емоціями. Використовує «анестезію» (їжа, екранний час, сон).",
    protectsFrom: "Нестерпний емоційний біль, травматичні спогади, відчуття безпорадності перед інтенсивними переживаннями.",
    cost: "Відчуження від реального життя та нездатність вирішувати глибинні конфлікти. Емоційне оніміння.",
  },
  Aggressor: {
    label: "Агресор",
    description: "Використовує гнів, щоб ніхто не побачив вашу вразливість. Вона відштовхує людей раніше, ніж вони встигнуть завдати болю.",
    protectsFrom: "Глибока вразливість, страх бути зрадженим або використаним. Захищає маленьку дитину всередині.",
    cost: "Руйнування стосунків та ізоляція. Люди бояться вашої реакції і тримаються на відстані.",
  },
};

const categoryKeys = Object.keys(categories);

const barColors = [
  'hsl(168, 56%, 23%)',
  'hsl(28, 55%, 40%)',
  'hsl(168, 40%, 35%)',
  'hsl(220, 30%, 40%)',
  'hsl(0, 40%, 45%)',
];

type Stage = 'intro' | 'test' | 'results';

const ProtectorsTest = () => {
  const [stage, setStage] = useState<Stage>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<(number | null)[]>(Array(25).fill(null));
  const resultRef = useRef<HTMLDivElement>(null);

  usePageSEO({
    title: 'Діагностика Захисників Психіки (IFS) — Тест онлайн українською',
    description: 'Безкоштовний тест на визначення провідних захисників психіки за моделлю IFS: Перфекціоніст, Доглядач, Критик, Уникаючий, Агресор. 25 питань, миттєві результати.',
    canonical: 'https://myrhorodskyi.com/tests/profil-zahysnykiv-ifs',
    keywords: 'IFS тест захисники, менеджери пожежники IFS, внутрішні частини психіки, психологічний тест українською',
  });

  // --- SCORING ---
  const scores = useMemo(() => {
    const s: Record<string, number> = {};
    for (const key of categoryKeys) {
      const qs = questions.filter(q => q.category === key);
      s[key] = qs.reduce((sum, q) => {
        const idx = questions.indexOf(q);
        return sum + (responses[idx] || 0);
      }, 0);
    }
    return s;
  }, [responses]);

  const sortedCategories = useMemo(() =>
    [...categoryKeys].sort((a, b) => scores[b] - scores[a]), [scores]);

  const dominantKey = sortedCategories[0];

  const chartData = useMemo(() =>
    sortedCategories.map(key => ({
      name: categories[key].label,
      score: scores[key],
      key,
    })), [sortedCategories, scores]);

  // --- HANDLERS ---
  const handleResponse = useCallback((value: number) => {
    setResponses(prev => {
      const next = [...prev];
      next[currentQuestion] = value;
      return next;
    });
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      }
    }, 300);
  }, [currentQuestion]);

  const submitTest = useCallback(() => {
    setStage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const resetTest = useCallback(() => {
    setStage('intro');
    setCurrentQuestion(0);
    setResponses(Array(25).fill(null));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const downloadPDF = useCallback(async () => {
    const el = resultRef.current;
    if (!el) return;
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf().set({
      margin: [10, 8],
      filename: 'IFS-Protectors-Profile.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    } as any).from(el).save();
  }, []);

  // --- KEYBOARD ---
  useEffect(() => {
    if (stage !== 'test') return;
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const num = parseInt(e.key);
      if (num >= 1 && num <= 5) {
        handleResponse(num);
        return;
      }
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setResponses(prev => {
            const cur = prev[currentQuestion];
            if (cur === null || cur >= 5) return prev;
            const next = [...prev];
            next[currentQuestion] = cur + 1;
            return next;
          });
          break;
        case 'ArrowDown':
          e.preventDefault();
          setResponses(prev => {
            const cur = prev[currentQuestion];
            if (cur === null || cur <= 1) return prev;
            const next = [...prev];
            next[currentQuestion] = cur - 1;
            return next;
          });
          break;
        case 'ArrowLeft':
        case 'Backspace':
          if (currentQuestion > 0) setCurrentQuestion(p => p - 1);
          break;
        case 'Enter':
          if (responses[currentQuestion] === null) break;
          if (currentQuestion === questions.length - 1) {
            if (!responses.some(r => r === null)) submitTest();
          } else {
            setCurrentQuestion(p => p + 1);
          }
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [stage, currentQuestion, responses, handleResponse, submitTest]);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const patternBg = '/pattern-bg.jpg';

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero bg */}
      <section
        className="pt-32 pb-8 bg-primary relative overflow-hidden"
        style={{ backgroundImage: `url(${patternBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-primary/85" />
        <div className="relative z-10 container-custom section-padding py-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-2">
              {stage === 'results' ? 'Ваш Профіль Захисників' : 'Профіль Внутрішніх Захисників'}
            </h1>
            {stage === 'intro' && (
              <p className="text-primary-foreground/70 text-lg">Аудит ваших стратегій виживання та управління стресом</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="section-padding">
        <div className="container-custom max-w-3xl mx-auto">
          <AnimatePresence mode="wait">

            {/* INTRO */}
            {stage === 'intro' && (
              <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <Card className="border-border shadow-lg overflow-hidden">
                  <CardContent className="p-8 md:p-12">
                    <div className="flex items-center justify-center mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Shield className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-3">
                      Діагностика Захисників Психіки
                    </h2>
                    <p className="text-center text-muted-foreground mb-8 text-lg">
                      Аудит ваших стратегій виживання та управління стресом.
                    </p>
                    <div className="bg-muted/50 rounded-xl p-6 mb-8 text-muted-foreground leading-relaxed">
                      <p>
                        У кожного з нас є частини психіки, які намагаються захистити нас від болю та вразливості. Вони роблять це по-різному: через контроль, догоджання, уникнення або напад.
                      </p>
                      <p className="mt-3">
                        Цей тест із <strong className="text-foreground">25 запитань</strong> допоможе виявити ваших провідних захисників. Діагностика займе близько <strong className="text-foreground">5 хвилин</strong>.
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-5 mb-8 border border-border">
                      <p className="text-sm font-semibold text-foreground mb-3">Шкала оцінювання:</p>
                      <div className="space-y-1.5">
                        {responseOptions.map(o => (
                          <div key={o.value} className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">{o.value}</span>
                            <span>{o.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="cta"
                      size="xl"
                      className="w-full"
                      onClick={() => { setStage('test'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    >
                      Почати діагностику
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* TEST */}
            {stage === 'test' && (
              <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Питання {currentQuestion + 1} з {questions.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <Card className="border-border shadow-lg">
                  <CardContent className="p-6 md:p-10">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="text-center text-muted-foreground text-sm mb-2 font-medium tracking-wide uppercase">
                          {categories[questions[currentQuestion].category].label}
                        </p>
                        <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-10 text-center leading-relaxed">
                          {questions[currentQuestion].text}
                        </h2>

                        {/* Response buttons */}
                        <div className="flex flex-col md:flex-row gap-3">
                          {responseOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleResponse(option.value)}
                              className={cn(
                                "group relative flex items-center md:flex-col gap-3 md:gap-2 p-4 md:p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 flex-1",
                                responses[currentQuestion] === option.value
                                  ? "border-primary bg-primary/5 shadow-md"
                                  : "border-border hover:border-primary/40 hover:bg-muted/50 hover:shadow-sm"
                              )}
                            >
                              <span className={cn(
                                "text-2xl font-display font-bold transition-colors shrink-0",
                                responses[currentQuestion] === option.value
                                  ? "text-primary"
                                  : "text-muted-foreground group-hover:text-foreground"
                              )}>
                                {option.value}
                              </span>
                              <span className={cn(
                                "text-sm md:text-xs text-left md:text-center leading-tight transition-colors",
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
                        <Button
                          variant="outline"
                          onClick={() => setCurrentQuestion(prev => prev + 1)}
                          disabled={responses[currentQuestion] === null}
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
                        i === currentQuestion ? "bg-primary scale-125"
                          : responses[i] !== null ? "bg-primary/40"
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
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                {/* Download button */}
                <div className="flex justify-end mb-4">
                  <Button variant="outline" size="sm" onClick={downloadPDF} className="gap-2">
                    <Download className="w-4 h-4" />
                    Завантажити звіт (PDF)
                  </Button>
                </div>

                <div ref={resultRef} id="pdf-content" className="space-y-8">
                  {/* Dominant Protector */}
                  <Card className="border-border shadow-lg overflow-hidden">
                    <div className="bg-primary/5 border-b border-border p-6 md:p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Crown className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground font-medium">Ваш провідний захисник</p>
                          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                            {categories[dominantKey].label}
                          </h2>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {categories[dominantKey].description}
                      </p>
                    </div>
                    <CardContent className="p-6 md:p-8">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-5 rounded-xl bg-primary/[0.03] border border-primary/10">
                          <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-5 h-5 text-primary" />
                            <h4 className="font-semibold text-foreground">Від чого захищає</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {categories[dominantKey].protectsFrom}
                          </p>
                        </div>
                        <div className="p-5 rounded-xl bg-destructive/[0.03] border border-destructive/10">
                          <div className="flex items-center gap-2 mb-3">
                            <ChevronRight className="w-5 h-5 text-destructive" />
                            <h4 className="font-semibold text-foreground">Ціна, яку ви платите</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {categories[dominantKey].cost}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bar Chart */}
                  <Card className="border-border shadow-lg">
                    <CardContent className="p-6 md:p-10">
                      <h3 className="font-display text-xl font-semibold text-foreground mb-6 text-center">
                        Порівняння активності захисників
                      </h3>
                      <div className="w-full" style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(168, 20%, 90%)" horizontal={false} />
                            <XAxis type="number" domain={[0, 25]} tick={{ fill: 'hsl(168, 15%, 40%)', fontSize: 12 }} />
                            <YAxis
                              dataKey="name"
                              type="category"
                              width={130}
                              tick={{ fill: 'hsl(168, 30%, 15%)', fontSize: 13, fontWeight: 600 }}
                            />
                            <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={28}>
                              {chartData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                              ))}
                              <LabelList
                                dataKey="score"
                                position="right"
                                style={{ fill: 'hsl(168, 30%, 15%)', fontSize: 14, fontWeight: 700 }}
                                formatter={(val: number) => `${val}/25`}
                              />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Score percentages */}
                      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
                        {sortedCategories.map(key => (
                          <div key={key} className="text-center p-3 rounded-xl bg-muted/40">
                            <p className="text-sm font-semibold text-foreground">{categories[key].label}</p>
                            <p className="text-2xl font-display font-bold text-primary">{Math.round((scores[key] / 25) * 100)}%</p>
                            <p className="text-xs text-muted-foreground">{scores[key]} / 25</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Detailed Accordion */}
                  <Card className="border-border shadow-lg">
                    <CardContent className="p-6 md:p-8">
                      <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                        Детальний аналіз кожного захисника
                      </h3>
                      <Accordion type="single" collapsible className="space-y-3">
                        {sortedCategories.map((key, i) => {
                          const cat = categories[key];
                          const pct = Math.round((scores[key] / 25) * 100);
                          return (
                            <AccordionItem key={key} value={key} className="border border-border rounded-xl px-5 data-[state=open]:bg-muted/30">
                              <AccordionTrigger className="hover:no-underline py-4">
                                <div className="flex items-center gap-3 text-left">
                                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                                    {i + 1}
                                  </span>
                                  <div>
                                    <span className="font-semibold text-foreground">{cat.label}</span>
                                    <span className="ml-3 text-sm text-muted-foreground">{scores[key]}/25 ({pct}%)</span>
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pb-5">
                                <div className="space-y-4 pl-11">
                                  <p className="text-muted-foreground leading-relaxed">{cat.description}</p>
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg bg-primary/[0.03] border border-primary/10">
                                      <p className="text-xs font-semibold text-primary mb-1">Від чого захищає</p>
                                      <p className="text-sm text-muted-foreground">{cat.protectsFrom}</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-destructive/[0.03] border border-destructive/10">
                                      <p className="text-xs font-semibold text-destructive mb-1">Ціна захисту</p>
                                      <p className="text-sm text-muted-foreground">{cat.cost}</p>
                                    </div>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    </CardContent>
                  </Card>

                  {/* CTA */}
                  <Card className="border-border shadow-lg bg-primary/[0.03]">
                    <CardContent className="p-6 md:p-10 text-center">
                      <p className="text-muted-foreground leading-relaxed mb-6 max-w-xl mx-auto">
                        Ваші захисники не є вашими ворогами; вони несуть важкий тягар, щоб врятувати вас. Допоможіть їм розслабитися в безпечному просторі. Запишіться на консультацію з психологом.
                      </p>
                      <div className="flex flex-col gap-4">
                        <Button variant="cta" size="xl" className="w-full whitespace-normal h-auto py-4" asChild>
                          <a href="https://t.me/SigurdPSYBot?start=64f8747ec7512692c00d1788" target="_blank" rel="noopener noreferrer">
                            Записатися на консультацію
                          </a>
                        </Button>
                        <Button variant="outline" size="xl" className="w-full" onClick={resetTest}>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Пройти ще раз
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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

export default ProtectorsTest;
