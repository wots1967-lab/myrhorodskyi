import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, RotateCcw, Sparkles, ShieldCheck, AlertTriangle, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import usePageSEO from '@/hooks/usePageSEO';
import KeyboardHints, { HINTS_SCALE } from '@/components/KeyboardHints';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

// --- DATA ---

const questions = [
  { id: 1, category: "Curiosity", text: "Я відчуваю щирий інтерес до причин поведінки інших людей, замість того, щоб одразу засуджувати їх." },
  { id: 9, category: "Curiosity", text: "Коли всередині мене виникають сильні емоції, мені цікаво дослідити, звідки вони беруться." },
  { id: 17, category: "Curiosity", text: "Я досліджую свої проблеми з позиції 'Як цікаво, чому це відбувається?', а не 'Що зі мною не так?'." },
  { id: 2, category: "Compassion", text: "Я відчуваю тепло і розуміння до своїх недоліків та помилок." },
  { id: 10, category: "Compassion", text: "Коли комусь боляче, я відчуваю відгук у серці і бажання підтримати, а не виправити чи дати пораду." },
  { id: 18, category: "Compassion", text: "Мені легко пробачати собі моменти слабкості." },
  { id: 3, category: "Clarity", text: "Я можу бачити ситуацію об'єктивно, не піддаючись впливу своїх упереджень чи страхів." },
  { id: 11, category: "Clarity", text: "Навіть у стресових ситуаціях я зберігаю здатність ясно мислити." },
  { id: 19, category: "Clarity", text: "Мені зрозуміло, які мої справжні потреби в стосунках з іншими." },
  { id: 4, category: "Confidence", text: "Я довіряю своїй здатності впоратися з життєвими викликами." },
  { id: 12, category: "Confidence", text: "Я відчуваю внутрішню опору і знаю свою цінність незалежно від досягнень." },
  { id: 20, category: "Confidence", text: "Коли я приймаю рішення, я відчуваю внутрішню впевненість, що це правильний шлях для мене." },
  { id: 5, category: "Calm", text: "Більшість часу я відчуваю фізичний та емоційний спокій." },
  { id: 13, category: "Calm", text: "Я вмію швидко повертатися до стану рівноваги після конфлікту чи стресу." },
  { id: 21, category: "Calm", text: "Я можу залишатися розслабленим(ою), навіть коли події навколо розгортаються не за планом." },
  { id: 6, category: "Creativity", text: "Я знаходжу нестандартні рішення для складних проблем." },
  { id: 14, category: "Creativity", text: "Я відчуваю, що моє життя наповнене можливостями для самовираження." },
  { id: 22, category: "Creativity", text: "Я вмію подивитися на звичні речі під новим, несподіваним кутом." },
  { id: 7, category: "Courage", text: "Я можу діяти відповідно до своїх цінностей, навіть якщо мені страшно." },
  { id: 15, category: "Courage", text: "Я готовий(а) визнавати свої помилки перед іншими." },
  { id: 23, category: "Courage", text: "Я можу встановлювати і захищати свої кордони, коли це необхідно." },
  { id: 8, category: "Connectedness", text: "Я відчуваю глибокий зв'язок з іншими людьми та світом загалом." },
  { id: 16, category: "Connectedness", text: "Я вірю, що ми всі є частиною чогось більшого." },
  { id: 24, category: "Connectedness", text: "Я можу бути повністю присутнім(ою) у спілкуванні з іншою людиною." },
];

const responseOptions = [
  { value: 1, label: "Майже ніколи" },
  { value: 2, label: "Рідко" },
  { value: 3, label: "Іноді" },
  { value: 4, label: "Часто" },
  { value: 5, label: "Майже завжди" },
];

const categories: Record<string, { label: string; description: string }> = {
  Curiosity: { label: "Цікавість", description: "Здатність підходити до свого внутрішнього світу та інших людей з відкритістю, без осуду. Цікавість дозволяє досліджувати причини поведінки замість негайного реагування." },
  Compassion: { label: "Співчуття", description: "Тепло та розуміння до себе і до інших, особливо в моменти болю та слабкості. Співчуття є протиотрутою до внутрішнього критика." },
  Clarity: { label: "Ясність", description: "Здатність бачити ситуацію об'єктивно, без спотворення страхами чи упередженнями. Ясність допомагає розуміти свої справжні потреби." },
  Confidence: { label: "Впевненість", description: "Внутрішня опора та довіра до себе. Впевненість — це не відсутність сумнівів, а здатність діяти попри них." },
  Calm: { label: "Спокій", description: "Здатність підтримувати емоційну рівновагу навіть у стресових ситуаціях. Спокій дозволяє реагувати, а не реактивно відповідати." },
  Creativity: { label: "Творчість", description: "Відкритість до нових рішень, нестандартне мислення та здатність бачити можливості для самовираження у повсякденному житті." },
  Courage: { label: "Сміливість", description: "Здатність діяти відповідно до своїх цінностей, визнавати помилки та захищати свої кордони, навіть коли це дискомфортно." },
  Connectedness: { label: "Зв'язок", description: "Відчуття глибокої єдності з іншими людьми та світом. Здатність бути повністю присутнім у стосунках." },
};

const categoryKeys = Object.keys(categories);

type Stage = 'intro' | 'test' | 'results';

const IFSSelfTest = () => {
  const [stage, setStage] = useState<Stage>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<(number | null)[]>(Array(24).fill(null));
  const resultRef = useRef<HTMLDivElement>(null);

  usePageSEO({
    title: 'Діагностика Самості (Self) за IFS — Тест онлайн українською',
    description: 'Безкоштовний тест на рівень доступу до Самості (Self-Leadership) за моделлю IFS. 24 питання, 8 якостей, миттєві результати з радарною діаграмою.',
    canonical: 'https://myrhorodskyi.com/tests/diagnostyka-samosti-ifs',
    keywords: 'IFS тест, Самість, Self-Leadership, внутрішні сімейні системи, психологічний тест українською',
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

  const totalScore = useMemo(() => Object.values(scores).reduce((a, b) => a + b, 0), [scores]);
  const totalPercent = useMemo(() => Math.round((totalScore / 120) * 100), [totalScore]);

  const categoryPercents = useMemo(() => {
    const p: Record<string, number> = {};
    for (const key of categoryKeys) p[key] = Math.round((scores[key] / 15) * 100);
    return p;
  }, [scores]);

  const radarData = useMemo(() =>
    categoryKeys.map(key => ({
      subject: categories[key].label,
      value: scores[key],
      fullMark: 15,
    })), [scores]);

  const sorted = useMemo(() =>
    [...categoryKeys].sort((a, b) => scores[b] - scores[a]), [scores]);

  const top3 = sorted.slice(0, 3);
  const bottom2 = sorted.slice(-2).reverse();

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
    setResponses(Array(24).fill(null));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const downloadPDF = useCallback(async () => {
    const el = resultRef.current;
    if (!el) return;
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf().set({
      margin: [10, 8],
      filename: 'IFS-Self-Profile.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    }).from(el).save();
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

  const insightLevel = totalPercent >= 80 ? 'high' : totalPercent >= 50 ? 'medium' : 'low';
  const insightConfig = {
    high: {
      icon: Sparkles,
      title: 'Високий рівень доступу до Самості',
      text: 'Ваша внутрішня система збалансована і ви часто є лідером для своїх частин. Ви маєте потужний ресурс для самозцілення.',
      className: 'border-primary/30 bg-primary/5',
    },
    medium: {
      icon: ShieldCheck,
      title: 'Середній рівень доступу до Самості',
      text: 'У вас є хороший контакт із собою, але в стресових ситуаціях ваші Захисники перехоплюють керування. Робота з терапевтом допоможе поглибити цей доступ.',
      className: 'border-secondary/30 bg-secondary/5',
    },
    low: {
      icon: AlertTriangle,
      title: 'Ускладнений доступ до Самості',
      text: 'Наразі вашою системою керують Захисники. Це період, коли вам потрібна підтримка для відновлення гармонії та контакту зі своєю Самістю.',
      className: 'border-destructive/30 bg-destructive/5',
    },
  };
  const insight = insightConfig[insightLevel];

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
              {stage === 'results' ? 'Ваш Профіль Самості' : 'Діагностика рівня Самості'}
            </h1>
            {stage === 'intro' && (
              <p className="text-primary-foreground/70 text-lg">Оцінка вашої здатності перебувати в стані внутрішньої рівноваги, ясності та співчуття</p>
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
                        <Compass className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-3">
                      Діагностика рівня Самості (Self-Leadership)
                    </h2>
                    <p className="text-center text-muted-foreground mb-8 text-lg">
                      Оцінка вашої здатності перебувати в стані внутрішньої рівноваги, ясності та співчуття.
                    </p>
                    <div className="bg-muted/50 rounded-xl p-6 mb-8 text-muted-foreground leading-relaxed">
                      <p>
                        Цей тест складається з <strong className="text-foreground">24 тверджень</strong>, які вимірюють ваш доступ до <strong className="text-foreground">8 ключових якостей «Самості» (Self)</strong> за моделлю IFS (Внутрішні Сімейні Системи).
                      </p>
                      <p className="mt-3">
                        Оцініть, наскільки часто ви відчуваєте ці стани у повсякденному житті. Діагностика займе близько <strong className="text-foreground">5 хвилин</strong>.
                      </p>
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

                        {/* Response buttons - vertical on mobile, horizontal on desktop */}
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
                  {/* Total score */}
                  <Card className="border-border shadow-lg">
                    <CardContent className="p-6 md:p-10 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Загальний рівень доступу до Самості</p>
                      <p className="font-display text-5xl md:text-6xl font-bold text-foreground mb-1">{totalPercent}%</p>
                      <p className="text-muted-foreground">{totalScore} / 120 балів</p>
                    </CardContent>
                  </Card>

                  {/* Insight */}
                  <Alert className={cn("border-2 rounded-xl p-6", insight.className)}>
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 mt-0.5">
                        <insight.icon className="w-6 h-6 text-foreground" />
                      </div>
                      <AlertDescription className="space-y-1">
                        <p className="font-display font-semibold text-foreground text-lg">{insight.title}</p>
                        <p className="text-muted-foreground leading-relaxed">{insight.text}</p>
                      </AlertDescription>
                    </div>
                  </Alert>

                  {/* Radar Chart */}
                  <Card className="border-border shadow-lg">
                    <CardContent className="p-6 md:p-10">
                      <h3 className="font-display text-xl font-semibold text-foreground mb-6 text-center">
                        Профіль 8 якостей Самості
                      </h3>
                      <div className="w-full" style={{ height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                            <PolarGrid stroke="hsl(168, 20%, 85%)" />
                            <PolarAngleAxis
                              dataKey="subject"
                              tick={{ fill: 'hsl(168, 30%, 15%)', fontSize: 12, fontWeight: 600 }}
                            />
                            <PolarRadiusAxis
                              angle={90}
                              domain={[0, 15]}
                              tick={{ fill: 'hsl(168, 15%, 40%)', fontSize: 11 }}
                              tickCount={4}
                            />
                            <Radar
                              name="Self"
                              dataKey="value"
                              stroke="hsl(168, 56%, 23%)"
                              fill="hsl(168, 56%, 23%)"
                              fillOpacity={0.15}
                              strokeWidth={2.5}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Category scores grid */}
                      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                        {categoryKeys.map(key => (
                          <div key={key} className="text-center p-3 rounded-xl bg-muted/40">
                            <p className="text-sm font-semibold text-foreground">{categories[key].label}</p>
                            <p className="text-2xl font-display font-bold text-primary">{categoryPercents[key]}%</p>
                            <p className="text-xs text-muted-foreground">{scores[key]} / 15</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Strengths & Growth */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <Card className="border-border shadow-lg">
                      <CardContent className="p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="font-display text-lg font-semibold text-foreground">Ваші сильні сторони</h3>
                        </div>
                        <div className="space-y-4">
                          {top3.map((key, i) => (
                            <div key={key} className="p-4 rounded-xl bg-primary/[0.03] border border-primary/10">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-foreground">{i + 1}. {categories[key].label}</span>
                                <span className="text-sm font-bold text-primary">{categoryPercents[key]}%</span>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                Ваша здатність до {categories[key].label.toLowerCase()} є потужним ресурсом для вашої внутрішньої системи.
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Growth zones */}
                    <Card className="border-border shadow-lg">
                      <CardContent className="p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-secondary" />
                          </div>
                          <h3 className="font-display text-lg font-semibold text-foreground">Зони зростання</h3>
                        </div>
                        <div className="space-y-4">
                          {bottom2.map((key) => (
                            <div key={key} className="p-4 rounded-xl bg-secondary/[0.03] border border-secondary/10">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-foreground">{categories[key].label}</span>
                                <span className="text-sm font-bold text-secondary">{categoryPercents[key]}%</span>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {categories[key].description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* CTA */}
                  <Card className="border-border shadow-lg bg-primary/[0.03]">
                    <CardContent className="p-6 md:p-10 text-center">
                      <p className="text-muted-foreground leading-relaxed mb-6 max-w-xl mx-auto">
                        Налагодження контакту зі своєю Самістю — це ключ до зцілення внутрішніх травм. Запишіться на консультацію, щоб розібрати ваш профіль зі спеціалістом.
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

export default IFSSelfTest;
