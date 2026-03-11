import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, RotateCcw, Sparkles, ShieldCheck, AlertTriangle, Layers, Info } from 'lucide-react';
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
  // 1. Self - 8
  { id: 1, category: "Self", text: "Я відчуваю себе здатним(ою) заспокоїти себе, коли стається щось погане." },
  { id: 2, category: "Self", text: "Я відчуваю внутрішній спокій та рівновагу більшість часу." },
  { id: 3, category: "Self", text: "Я можу ставитися до своїх недоліків зі співчуттям." },
  { id: 4, category: "Self", text: "Я відчуваю ясність щодо своїх справжніх потреб і бажань." },
  { id: 5, category: "Self", text: "Мені цікаво дізнаватися про свій внутрішній світ, а не засуджувати його." },
  { id: 6, category: "Self", text: "Я відчуваю впевненість у своїй здатності вирішувати життєві труднощі." },
  { id: 7, category: "Self", text: "Я можу залишатися в контакті з людьми, не втрачаючи при цьому себе." },
  { id: 8, category: "Self", text: "Я відчуваю сміливість діяти відповідно до своїх цінностей." },
  // 2. Critic - 6
  { id: 9, category: "Critic", text: "Мій внутрішній голос постійно вказує на мої помилки та недоліки." },
  { id: 10, category: "Critic", text: "Я відчуваю, що маю бути ідеальним(ою), інакше мене відкинуть." },
  { id: 11, category: "Critic", text: "Я часто обзиваю себе подумки (наприклад, 'дурень', 'невдаха')." },
  { id: 12, category: "Critic", text: "Я вірю, що досягну успіху тільки якщо буду жорстко контролювати себе." },
  { id: 13, category: "Critic", text: "Я порівнюю себе з іншими і відчуваю, що програю їм." },
  { id: 14, category: "Critic", text: "Я ніколи не буваю повністю задоволений(а) результатами своєї роботи." },
  // 3. Pleaser - 6
  { id: 15, category: "Pleaser", text: "Я часто відмовляюся від своїх потреб, щоб зробити приємно іншим." },
  { id: 16, category: "Pleaser", text: "Мені дуже складно казати 'ні', навіть коли я перевантажений(а)." },
  { id: 17, category: "Pleaser", text: "Я відчуваю відповідальність за емоційний стан і настрій людей навколо мене." },
  { id: 18, category: "Pleaser", text: "Моя самооцінка сильно залежить від того, чи корисний(а) я для інших." },
  { id: 19, category: "Pleaser", text: "Я намагаюся завжди згладжувати конфлікти і бути 'хорошим(ою)'." },
  { id: 20, category: "Pleaser", text: "Я боюся, що якщо перестану допомагати іншим, вони відвернуться від мене." },
  // 4. Abandoned - 5
  { id: 21, category: "Abandoned", text: "Я відчуваю паніку або сильний страх, якщо мені здається, що близька людина хоче мене покинути." },
  { id: 22, category: "Abandoned", text: "Я часто чіпляюся за людей, щоб не залишитися на самоті." },
  { id: 23, category: "Abandoned", text: "Відчуття самотності для мене є нестерпним." },
  { id: 24, category: "Abandoned", text: "Я часто скасовую свої плани заради того, щоб бути з партнером." },
  { id: 25, category: "Abandoned", text: "Глибоко всередині я вірю, що люди, яких я люблю, рано чи пізно підуть." },
  // 5. Anxious - 6
  { id: 26, category: "Anxious", text: "Я часто уявляю найгірші можливі сценарії розвитку подій." },
  { id: 27, category: "Anxious", text: "Я відчуваю постійне внутрішнє напруження, ніби щось погане ось-ось станеться." },
  { id: 28, category: "Anxious", text: "Я надмірно турбуюся про речі, які більшість вважають дрібницями." },
  { id: 29, category: "Anxious", text: "Мені важко розслабитися через нав'язливі тривожні думки." },
  { id: 30, category: "Anxious", text: "Я не довіряю хорошим подіям, очікуючи, що за ними обов'язково піде віроломство." },
  { id: 31, category: "Anxious", text: "Я намагаюся передбачити і проконтролювати все, щоб уникнути неприємностей." },
  // 6. Dissociating - 5
  { id: 32, category: "Dissociating", text: "В моменти сильного стресу я ніби емоційно 'відключаюся' або 'німію'." },
  { id: 33, category: "Dissociating", text: "Коли мені боляче, я відчуваю себе відірваним(ою) від свого тіла або навколишньої реальності." },
  { id: 34, category: "Dissociating", text: "Я часто рятуюся від проблем за допомогою екранного часу, серіалів або сну." },
  { id: 35, category: "Dissociating", text: "Часом я дивлюся на ситуацію так, ніби я сторонній спостерігач власного життя." },
  { id: 36, category: "Dissociating", text: "Я навмисно уникаю розмов і думок про болючі речі, щоб нічого не відчувати." },
  // 7. Impulsive - 5
  { id: 37, category: "Impulsive", text: "Я використовую їжу, алкоголь або інші речовини, щоб швидко заглушити емоційний біль." },
  { id: 38, category: "Impulsive", text: "Мене часто тягне до імпульсивних вчинків, коли я відчуваю сум чи тривогу." },
  { id: 39, category: "Impulsive", text: "Коли виникає сильна емоція, мені дуже складно втримати себе від негайної реакції." },
  { id: 40, category: "Impulsive", text: "Мої 'шкідливі' звички відчуваються як єдиний спосіб впоратися з напругою." },
  { id: 41, category: "Impulsive", text: "Я дію імпульсивно і часто шкодую про це пізніше." },
  // 8. Raging - 5
  { id: 42, category: "Raging", text: "Коли я відчуваю, що мене критикують або відкидають, я захищаюся через напад і гнів." },
  { id: 43, category: "Raging", text: "Люди можуть вважати мене надмірно різким(ою) або агресивним(ою)." },
  { id: 44, category: "Raging", text: "Гнів дає мені відчуття сили та захищеності." },
  { id: 45, category: "Raging", text: "Я швидко виходжу з себе, якщо відчуваю несправедливість." },
  { id: 46, category: "Raging", text: "Я часто використовую сарказм, щоб тримати людей на відстані." },
  // 9. Exiles - 6
  { id: 47, category: "Exiles", text: "Глибоко в душі я відчуваю себе дефективним(ою) або таким(ою), з ким щось не так." },
  { id: 48, category: "Exiles", text: "Я часто відчуваю гострий сором за те, ким я є." },
  { id: 49, category: "Exiles", text: "Я вірю, що якби люди дізналися мене справжнього(ю), вони б мене не прийняли." },
  { id: 50, category: "Exiles", text: "Я ношу в собі відчуття безпорадності та нікчемності." },
  { id: 51, category: "Exiles", text: "Іноді мене накриває відчуття глибокого смутку, причину якого я не завжди розумію." },
  { id: 52, category: "Exiles", text: "Я часто почуваюся покинутою і нікому не потрібною дитиною." },
  // 10. Punitive - 5
  { id: 53, category: "Punitive", text: "Я вважаю, що заслуговую на покарання за свої помилки." },
  { id: 54, category: "Punitive", text: "Коли я роблю щось не так, я можу позбавляти себе задоволень або карати іншими способами." },
  { id: 55, category: "Punitive", text: "Мені важко приймати прощення від інших, оскільки я не пробачаю сам(а) собі." },
  { id: 56, category: "Punitive", text: "Я відчуваю відразу до своїх слабкостей і вразливих сторін." },
  { id: 57, category: "Punitive", text: "Я можу навмисно доводити себе до виснаження, вважаючи, що 'так мені й треба'." },
];

const responseOptions = [
  { value: 1, label: "Ніколи", sublabel: "Зовсім не про мене" },
  { value: 2, label: "Рідко", sublabel: "Швидше не про мене" },
  { value: 3, label: "Іноді", sublabel: "50 на 50" },
  { value: 4, label: "Часто", sublabel: "Швидше про мене" },
  { value: 5, label: "Майже завжди", sublabel: "Дуже точно про мене" },
];

const categories: Record<string, { label: string; questionCount: number; description: string }> = {
  Self: { label: "Самість (Self)", questionCount: 8, description: "Ядро вашої особистості — стан внутрішнього спокою, ясності, співчуття та мудрості. Коли Самість керує, ви відчуваєте гармонію та здатність справлятися з будь-якими викликами." },
  Critic: { label: "Внутрішній Критик", questionCount: 6, description: "Захисна частина, яка намагається вберегти вас від відкидання через жорстку самокритику та перфекціонізм. Вірить, що якщо ви будете ідеальними — вас не покинуть." },
  Pleaser: { label: "Доглядач / Догоджаючий", questionCount: 6, description: "Частина, яка забезпечує безпеку через турботу про інших, часто ціною власних потреб. Вірить, що ваша цінність визначається корисністю для інших." },
  Abandoned: { label: "Покинутий (Страх відкидання)", questionCount: 5, description: "Вразлива частина, яка несе біль покинутості та страх залишитися на самоті. Може провокувати чіпляння за стосунки та паніку при загрозі розставання." },
  Anxious: { label: "Тривожний / Песиміст", questionCount: 6, description: "Захисник-менеджер, який намагається передбачити та контролювати все, щоб уникнути болю. Постійно сканує середовище на загрози та готується до найгіршого." },
  Dissociating: { label: "Дисоціюючий / Уникаючий", questionCount: 5, description: "Захисник-пожежник, який 'вимикає' емоції та відключає від реальності, коли біль стає нестерпним. Це автоматичний механізм виживання." },
  Impulsive: { label: "Імпульсивний / Залежний", questionCount: 5, description: "Пожежник, який шукає негайного полегшення від болю через їжу, речовини, ризиковану поведінку або інші імпульсивні дії." },
  Raging: { label: "Гнівливий (Захист нападом)", questionCount: 5, description: "Пожежник, який захищає вразливі частини через агресію, сарказм та контратаку. Гнів створює ілюзію сили та неприступності." },
  Exiles: { label: "Вигнанці (Біль і Сором)", questionCount: 6, description: "Найвразливіші частини, які несуть дитячий біль, сором та відчуття дефективності. Вони 'вигнані' іншими частинами, щоб їхній біль не затопив систему." },
  Punitive: { label: "Самокараючий", questionCount: 5, description: "Внутрішній каратель, який вірить, що ви заслуговуєте на покарання за свої помилки та слабкості. Може проявлятися як самосаботаж та відмова від задоволень." },
};

const categoryKeys = Object.keys(categories);
const partsCategoryKeys = categoryKeys.filter(k => k !== 'Self');

type Stage = 'intro' | 'test' | 'results';

// --- Gauge Chart Component ---
const GaugeChart = ({ percentage }: { percentage: number }) => {
  const radius = 80;
  const strokeWidth = 14;
  const circumference = Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = (p: number) => {
    if (p >= 75) return 'hsl(168, 56%, 23%)';
    if (p >= 40) return 'hsl(28, 55%, 40%)';
    return 'hsl(0, 65%, 50%)';
  };

  return (
    <svg viewBox="0 0 200 120" className="w-full max-w-[280px] mx-auto">
      {/* Background arc */}
      <path
        d="M 20 110 A 80 80 0 0 1 180 110"
        fill="none"
        stroke="hsl(168, 20%, 90%)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Value arc */}
      <path
        d="M 20 110 A 80 80 0 0 1 180 110"
        fill="none"
        stroke={getColor(percentage)}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
      />
      {/* Center text */}
      <text x="100" y="95" textAnchor="middle" className="fill-foreground font-bold" style={{ fontSize: '28px', fontFamily: 'Playfair Display' }}>
        {percentage}%
      </text>
      <text x="100" y="112" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: '10px' }}>
        рівень Самості
      </text>
    </svg>
  );
};

const IFSScaleTest = () => {
  const [stage, setStage] = useState<Stage>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<(number | null)[]>(Array(57).fill(null));
  const resultRef = useRef<HTMLDivElement>(null);

  usePageSEO({
    title: 'Клінічна Шкала IFS (57 пунктів) — Комплексний профіль внутрішньої системи',
    description: 'Глибинна клінічна діагностика внутрішньої системи за моделлю IFS. 57 тверджень, 10 субшкал: Самість, Критик, Доглядач, Тривожний, Вигнанці та інші. Безкоштовно українською.',
    canonical: 'https://myrhorodskyi.com/tests/klinichna-shkala-ifs',
    keywords: 'IFS шкала, внутрішні сімейні системи, клінічний тест IFS, частини особистості, Self-Leadership, психологічний тест українською',
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

  const categoryPercents = useMemo(() => {
    const p: Record<string, number> = {};
    for (const key of categoryKeys) {
      const maxScore = categories[key].questionCount * 5;
      p[key] = Math.round((scores[key] / maxScore) * 100);
    }
    return p;
  }, [scores]);

  const selfPercent = categoryPercents.Self || 0;

  const radarData = useMemo(() =>
    partsCategoryKeys.map(key => ({
      subject: categories[key].label.split(' (')[0].split(' / ')[0],
      value: categoryPercents[key],
      fullMark: 100,
    })), [categoryPercents]);

  const sortedParts = useMemo(() =>
    [...partsCategoryKeys].sort((a, b) => categoryPercents[b] - categoryPercents[a]), [categoryPercents]);

  const top3Parts = sortedParts.slice(0, 3);

  // Current question's category label
  const currentCategoryLabel = categories[questions[currentQuestion]?.category]?.label || '';

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
    }, 350);
  }, [currentQuestion]);

  const submitTest = useCallback(() => {
    setStage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const resetTest = useCallback(() => {
    setStage('intro');
    setCurrentQuestion(0);
    setResponses(Array(57).fill(null));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const downloadPDF = useCallback(async () => {
    const el = resultRef.current;
    if (!el) return;
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf().set({
      margin: [10, 8],
      filename: 'IFS-Scale-Clinical-Profile.pdf',
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

  const insightLevel = selfPercent >= 75 ? 'high' : selfPercent >= 40 ? 'medium' : 'low';
  const insightConfig = {
    high: {
      icon: Sparkles,
      title: 'Високий контакт із Самістю',
      text: 'Ваша Самість має сильний вплив на внутрішню систему. Ви здатні спостерігати за своїми частинами з позиції спокою та співчуття. Це потужний ресурс для подальшої роботи.',
      className: 'border-primary/30 bg-primary/5',
    },
    medium: {
      icon: ShieldCheck,
      title: 'Частковий доступ до Самості',
      text: 'У вас є контакт із Самістю, але в стресових ситуаціях Захисники перехоплюють керування. Терапія IFS допоможе поглибити цей доступ та побудувати довіру між частинами.',
      className: 'border-secondary/30 bg-secondary/5',
    },
    low: {
      icon: AlertTriangle,
      title: 'Система керується Захисниками',
      text: 'Наразі ваші Захисники активно контролюють систему, обмежуючи доступ до Самості. Це не означає, що Самість відсутня — вона лише прихована. Професійна підтримка допоможе відновити контакт.',
      className: 'border-destructive/30 bg-destructive/5',
    },
  };
  const insight = insightConfig[insightLevel];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section
        className="pt-32 pb-8 bg-primary relative overflow-hidden"
        style={{ backgroundImage: `url(${patternBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-primary/85" />
        <div className="relative z-10 container-custom section-padding py-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-2">
              {stage === 'results' ? 'Ваша Внутрішня Система' : 'Клінічна Шкала IFS'}
            </h1>
            {stage === 'intro' && (
              <p className="text-primary-foreground/70 text-lg">Глибинна клінічна діагностика архітектури вашої психіки</p>
            )}
            {stage === 'results' && (
              <p className="text-primary-foreground/70 text-lg">Клінічний профіль внутрішньої системи</p>
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
                        <Layers className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-3">
                      Комплексний Профіль Внутрішньої Системи (IFS Scale)
                    </h2>
                    <p className="text-center text-muted-foreground mb-8 text-lg">
                      Глибинна клінічна діагностика архітектури вашої психіки.
                    </p>
                    <div className="bg-muted/50 rounded-xl p-6 mb-6 text-muted-foreground leading-relaxed">
                      <p>
                        Ця шкала складається з <strong className="text-foreground">57 тверджень</strong> і призначена для вимірювання активності ваших захисних і вразливих частин, а також рівня доступу до вашої справжньої <strong className="text-foreground">«Самості» (Self)</strong>.
                      </p>
                      <p className="mt-3">
                        Будь ласка, оцініть, наскільки часто і глибоко ви відчуваєте наведені стани. Тест займе близько <strong className="text-foreground">10-15 хвилин</strong>.
                      </p>
                    </div>

                    {/* Scale explanation */}
                    <div className="bg-muted/30 rounded-xl p-5 mb-8 border border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <Info className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground text-sm">Шкала оцінювання</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-sm">
                        {responseOptions.map(o => (
                          <div key={o.value} className="flex sm:flex-col items-center sm:items-center gap-2 sm:gap-1 text-center">
                            <span className="font-display font-bold text-foreground text-lg w-6 sm:w-auto">{o.value}</span>
                            <span className="text-muted-foreground text-xs">{o.sublabel}</span>
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
                      Почати глибоку діагностику
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
                    <span>Запитання {currentQuestion + 1} з {questions.length}</span>
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
                        <p className="text-center text-muted-foreground text-xs mb-2 font-medium tracking-widest uppercase">
                          {currentCategoryLabel}
                        </p>
                        <h2 className="font-display text-lg md:text-xl lg:text-2xl font-semibold text-foreground mb-10 text-center leading-relaxed">
                          {questions[currentQuestion].text}
                        </h2>

                        {/* Response buttons */}
                        <div className="flex flex-col md:flex-row gap-3">
                          {responseOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleResponse(option.value)}
                              className={cn(
                                "group relative flex items-center md:flex-col gap-3 md:gap-1.5 p-4 md:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex-1",
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
                <div className="mt-6 flex flex-wrap justify-center gap-1">
                  {questions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentQuestion(i)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-200",
                        i === currentQuestion ? "bg-primary scale-150"
                          : responses[i] !== null ? "bg-primary/40"
                          : "bg-border"
                      )}
                      aria-label={`Питання ${i + 1}`}
                    />
                  ))}
                </div>

                <KeyboardHints hints={HINTS_SCALE(5)} />
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
                  {/* Header */}
                  <div className="text-center mb-2">
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      Ваша Внутрішня Система (Клінічний Профіль)
                    </h2>
                  </div>

                  {/* Section A: Self Gauge */}
                  <Card className="border-border shadow-lg">
                    <CardContent className="p-6 md:p-10">
                      <h3 className="font-display text-xl font-semibold text-foreground mb-2 text-center">
                        Рівень Самості (Self-Leadership)
                      </h3>
                      <p className="text-center text-muted-foreground text-sm mb-6">
                        {scores.Self} / {categories.Self.questionCount * 5} балів
                      </p>
                      <GaugeChart percentage={selfPercent} />
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

                  {/* Section B: Parts Radar Chart */}
                  <Card className="border-border shadow-lg">
                    <CardContent className="p-6 md:p-10">
                      <h3 className="font-display text-xl font-semibold text-foreground mb-2 text-center">
                        Карта Ваших Захисників та Вигнанців
                      </h3>
                      <p className="text-center text-muted-foreground text-sm mb-6">
                        Рівень активності 9 типів внутрішніх частин (%)
                      </p>
                      <div className="w-full" style={{ height: 420 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="65%">
                            <PolarGrid stroke="hsl(168, 20%, 85%)" />
                            <PolarAngleAxis
                              dataKey="subject"
                              tick={{ fill: 'hsl(168, 30%, 15%)', fontSize: 10, fontWeight: 600 }}
                            />
                            <PolarRadiusAxis
                              angle={90}
                              domain={[0, 100]}
                              tick={{ fill: 'hsl(168, 15%, 40%)', fontSize: 10 }}
                              tickCount={5}
                            />
                            <Radar
                              name="Частини"
                              dataKey="value"
                              stroke="hsl(28, 55%, 40%)"
                              fill="hsl(28, 55%, 40%)"
                              fillOpacity={0.15}
                              strokeWidth={2.5}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* All categories breakdown */}
                  <Card className="border-border shadow-lg">
                    <CardContent className="p-6 md:p-10">
                      <h3 className="font-display text-xl font-semibold text-foreground mb-6 text-center">
                        Детальний аналіз усіх субшкал
                      </h3>
                      <div className="space-y-4">
                        {categoryKeys.map(key => {
                          const pct = categoryPercents[key];
                          const isSelf = key === 'Self';
                          return (
                            <div key={key}>
                              <div className="flex justify-between items-baseline mb-1.5">
                                <span className="font-medium text-foreground text-sm">{categories[key].label}</span>
                                <span className="text-sm font-display font-bold text-foreground">{pct}%</span>
                              </div>
                              <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.8, delay: 0.1 }}
                                  className={cn("h-full rounded-full", isSelf ? "bg-primary" : "bg-secondary/70")}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top 3 Active Parts */}
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-4 text-center">
                      Топ-3 найактивніших частин
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {top3Parts.map((key, i) => (
                        <Card key={key} className="border-border shadow-sm">
                          <CardContent className="p-5">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary font-display font-bold text-sm">
                                {i + 1}
                              </span>
                              <span className="font-display font-semibold text-foreground text-sm leading-tight">
                                {categories[key].label}
                              </span>
                            </div>
                            <p className="text-2xl font-display font-bold text-foreground mb-2">{categoryPercents[key]}%</p>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                              {categories[key].description}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <Card className="border-border shadow-lg bg-muted/30">
                    <CardContent className="p-6 md:p-10 text-center">
                      <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-3">
                        Робота з внутрішніми частинами потребує обережності
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-6 max-w-xl mx-auto">
                        Терапія IFS допоможе вам повернути керування Самістю, побудувати довіру між частинами та зцілити вразливих Вигнанців. Запишіться на професійну консультацію.
                      </p>
                      <div className="flex flex-col gap-3">
                        <Button variant="cta" size="lg" className="w-full whitespace-normal h-auto py-4" asChild>
                          <a href="https://t.me/SigurdPSYBot?start=64f8747ec7512692c00d1788" target="_blank" rel="noopener noreferrer">
                            Записатися на консультацію
                          </a>
                        </Button>
                        <Button variant="outline" size="lg" className="w-full gap-2" onClick={resetTest}>
                          <RotateCcw className="w-4 h-4" />
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
    </div>
  );
};

export default IFSScaleTest;
