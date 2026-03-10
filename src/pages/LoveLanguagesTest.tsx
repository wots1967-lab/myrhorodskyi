import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, RotateCcw, Heart, MessageCircle, Gift, HandHelping, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import usePageSEO from '@/hooks/usePageSEO';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';

// --- DATA ---

const questions = [
  { id: 1, option1: { text: "Мені подобається отримувати слова підтримки та вдячності.", category: "A" }, option2: { text: "Мені подобається, коли ми обіймаємося.", category: "E" } },
  { id: 2, option1: { text: "Мені подобається проводити час наодинці з близькою людиною.", category: "B" }, option2: { text: "Я відчуваю любов, коли хтось допомагає мені з практичними справами.", category: "D" } },
  { id: 3, option1: { text: "Я ціную, коли мені дарують подарунки.", category: "C" }, option2: { text: "Мені подобається довго розмовляти з коханою людиною.", category: "B" } },
  { id: 4, option1: { text: "Я відчуваю любов, коли хтось робить щось корисне для мене.", category: "D" }, option2: { text: "Мене роблять щасливим(ою) ніжні дотики.", category: "E" } },
  { id: 5, option1: { text: "Мені важливо відчувати фізичну близькість (обійми, поцілунки).", category: "E" }, option2: { text: "Я відчуваю любов, коли отримую сюрпризи та подарунки.", category: "C" } },
  { id: 6, option1: { text: "Мені подобається планувати спільний відпочинок і бути разом.", category: "B" }, option2: { text: "Я люблю триматися за руки з коханою людиною.", category: "E" } },
  { id: 7, option1: { text: "Мені приємно отримувати видимі символи любові (подарунки).", category: "C" }, option2: { text: "Я відчуваю свою цінність, коли мене хвалять.", category: "A" } },
  { id: 8, option1: { text: "Мені подобається сидіти поруч із коханою людиною.", category: "E" }, option2: { text: "Мені подобається, коли мені говорять, що я добре виглядаю.", category: "A" } },
  { id: 9, option1: { text: "Мені приємно проводити час разом, займаючись спільною справою.", category: "B" }, option2: { text: "Мене радують маленькі подарунки, які мені приносять.", category: "C" } },
  { id: 10, option1: { text: "Мене надихають слова підтримки від партнера.", category: "A" }, option2: { text: "Я відчуваю любов, коли партнер розв'язує мої проблеми.", category: "D" } },
  { id: 11, option1: { text: "Мені важливо бути поруч і проводити час разом.", category: "B" }, option2: { text: "Мені подобається чути добрі слова на свою адресу.", category: "A" } },
  { id: 12, option1: { text: "Мовчки допомагати мені з роботою — це прояв любові.", category: "D" }, option2: { text: "Регулярні обійми дають мені відчуття безпеки.", category: "E" } },
  { id: 13, option1: { text: "Мені приємно чути похвалу.", category: "A" }, option2: { text: "Я радію подарункам, обраним спеціально для мене.", category: "C" } },
  { id: 14, option1: { text: "Я відчуваю близькість, коли ми розмовляємо наодинці.", category: "B" }, option2: { text: "Я відчуваю близькість через фізичний контакт.", category: "E" } },
  { id: 15, option1: { text: "Мені приємно, коли помічають мої досягнення і хвалять.", category: "A" }, option2: { text: "Мені приємно, коли хтось робить для мене те, що я не люблю робити сам(а).", category: "D" } },
  { id: 16, option1: { text: "Я обожнюю ніжні поцілунки.", category: "E" }, option2: { text: "Мені важливо, щоб ми разом чимось захоплювалися.", category: "B" } },
  { id: 17, option1: { text: "Я ціную будь-які подарунки, як знак уваги.", category: "C" }, option2: { text: "Я ціную, коли партнер допомагає мені з домашніми справами.", category: "D" } },
  { id: 18, option1: { text: "Компліменти допомагають мені відчувати себе коханим(ою).", category: "A" }, option2: { text: "Я хочу, щоб ми просто проводили час удвох.", category: "B" } },
  { id: 19, option1: { text: "Я відчуваю любов через тілесний контакт, коли ми поруч.", category: "E" }, option2: { text: "Я відчуваю любов, коли партнер бере на себе частину моїх обов'язків.", category: "D" } },
  { id: 20, option1: { text: "Якщо мені допомагають, це означає, що мене люблять.", category: "D" }, option2: { text: "Мій настрій підіймається, коли я отримую подарунок.", category: "C" } },
  { id: 21, option1: { text: "Мені важливо відчувати безроздільну увагу партнера.", category: "B" }, option2: { text: "Мені важливо, щоб партнер зробив щось корисне для мене.", category: "D" } },
  { id: 22, option1: { text: "Я обожнюю отримувати подарунки без приводу.", category: "C" }, option2: { text: "Я обожнюю чути слова вдячності від партнера.", category: "A" } },
  { id: 23, option1: { text: "Мене тішать продумані подарунки.", category: "C" }, option2: { text: "Мене тішить, коли партнер бере на себе мої хатні клопоти.", category: "D" } },
  { id: 24, option1: { text: "Найкращий час — це час, проведений разом, не відволікаючись.", category: "B" }, option2: { text: "Найкращий прояв любові — це маленькі приємні подарунки.", category: "C" } },
  { id: 25, option1: { text: "Мені приємно, коли партнер просто знаходиться поруч.", category: "B" }, option2: { text: "Мені приємно, коли партнер робить для мене винятки і допомагає.", category: "D" } },
  { id: 26, option1: { text: "Для мене важливі дотики та обійми протягом дня.", category: "E" }, option2: { text: "Для мене важливо чути підбадьорливі слова.", category: "A" } },
  { id: 27, option1: { text: "Коли мене цінують на словах, я відчуваю любов.", category: "A" }, option2: { text: "Коли ми разом обговорюємо важливі речі, я відчуваю любов.", category: "B" } },
  { id: 28, option1: { text: "Подарунки від партнера для мене дуже особливі.", category: "C" }, option2: { text: "Дотики партнера роблять мене дуже щасливим(ою).", category: "E" } },
  { id: 29, option1: { text: "Коли мені допомагають фізично, я відчуваю турботу.", category: "D" }, option2: { text: "Коли мені щось приємне говорять, я відчуваю турботу.", category: "A" } },
  { id: 30, option1: { text: "Мені необхідні регулярні обійми та фізичний контакт.", category: "E" }, option2: { text: "Мені необхідно періодично отримувати подарунки як знак любові.", category: "C" } },
];

const categoryLabels: Record<string, string> = {
  A: "Слова заохочення",
  B: "Якісний час",
  C: "Отримання подарунків",
  D: "Акти служіння",
  E: "Фізичний дотик",
};

const categoryIcons: Record<string, typeof Heart> = {
  A: MessageCircle,
  B: Clock,
  C: Gift,
  D: HandHelping,
  E: Heart,
};

const categoryColors: Record<string, string> = {
  A: "hsl(168, 56%, 23%)",
  B: "hsl(28, 55%, 40%)",
  C: "hsl(340, 50%, 50%)",
  D: "hsl(168, 40%, 35%)",
  E: "hsl(350, 60%, 55%)",
};

const categoryDescriptions: Record<string, string> = {
  A: "Для вас слова мають величезне значення. Компліменти, слова підтримки, висловлення вдячності та любові змушують вас відчувати себе цінними. Жорстокі слова чи критика, навпаки, ранять глибоко і надовго.",
  B: "Для вас найважливіше — отримувати неподільну увагу партнера. Бути разом, спілкуватися без телефонів і телевізора, уважно слухати одне одного — це те, що дає вам відчуття справжньої любові та близькості.",
  C: "Ви сприймаєте подарунки як візуальні символи любові. Для вас важлива не їхня ціна, а увага, час і зусилля, вкладені у вибір. Подарунок показує, що про вас думали і про вас піклуються.",
  D: "Ваша мова — це турбота у діях. Допомога по дому, приготування вечері або виконання зобов'язань говорять вам про любов більше, ніж будь-які слова. Ваше гасло: \"Дії звучать гучніше за слова\".",
  E: "Ви відчуваєте любов через фізичний контакт: обійми, поцілунки, тримання за руки, дотики під час розмови. Без цього зв'язку ви можете почуватися самотньо і не відчувати себе коханими.",
};

type Screen = 'intro' | 'quiz' | 'results';

const LoveLanguagesTest = () => {
  const [screen, setScreen] = useState<Screen>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({ A: 0, B: 0, C: 0, D: 0, E: 0 });
  const [direction, setDirection] = useState(1);

  usePageSEO({
    title: 'Тест: 5 Мов Любові — Психолог Сергій Миргородський',
    description: 'Дізнайтеся, як ви найкраще сприймаєте та виражаєте любов у стосунках за методикою Ґері Чепмена. Безкоштовний тест онлайн.',
    canonical: 'https://myrhorodskyi.lovable.app/tests/5-mov-lyubovi',
    keywords: '5 мов любові, тест мови любові, Ґері Чепмен, психологічний тест, стосунки',
  });

  const handleAnswer = useCallback((category: string) => {
    setScores(prev => ({ ...prev, [category]: prev[category] + 1 }));
    setDirection(1);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setScreen('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentQuestion]);

  // Keyboard navigation
  useEffect(() => {
    if (screen !== 'quiz') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      const q = questions[currentQuestion];
      switch (e.key) {
        case '1':
        case 'ArrowUp': {
          e.preventDefault();
          handleAnswer(q.option1.category);
          break;
        }
        case '2':
        case 'ArrowDown': {
          e.preventDefault();
          handleAnswer(q.option2.category);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, currentQuestion, handleAnswer]);

  const resetTest = useCallback(() => {
    setScreen('intro');
    setCurrentQuestion(0);
    setScores({ A: 0, B: 0, C: 0, D: 0, E: 0 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const sortedResults = useMemo(() => {
    return Object.entries(scores)
      .map(([key, value]) => ({
        category: key,
        label: categoryLabels[key],
        score: value,
        color: categoryColors[key],
      }))
      .sort((a, b) => b.score - a.score);
  }, [scores]);

  const primaryLanguage = sortedResults[0];

  const progressPercent = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <AnimatePresence mode="wait">
        {screen === 'intro' && (
          <IntroScreen key="intro" onStart={() => { setScreen('quiz'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        )}
        {screen === 'quiz' && (
          <QuizScreen
            key="quiz"
            question={questions[currentQuestion]}
            questionIndex={currentQuestion}
            totalQuestions={questions.length}
            progressPercent={progressPercent}
            direction={direction}
            onAnswer={handleAnswer}
          />
        )}
        {screen === 'results' && (
          <ResultsScreen
            key="results"
            sortedResults={sortedResults}
            primaryLanguage={primaryLanguage}
            onReset={resetTest}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

// --- INTRO SCREEN ---

const IntroScreen = ({ onStart }: { onStart: () => void }) => (
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="pt-32 pb-20"
  >
    <div className="container-custom max-w-2xl mx-auto text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <div className="w-20 h-20 mx-auto mb-8 bg-primary/10 rounded-full flex items-center justify-center">
          <Heart className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
          Тест: 5 Мов Любові
        </h1>
        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          Дізнайтеся, як ви найкраще сприймаєте та виражаєте любов у стосунках за методикою Ґері Чепмена.
        </p>
        <p className="text-base text-muted-foreground/80 mb-10 leading-relaxed max-w-xl mx-auto">
          Тест складається з 30 пар тверджень. У кожній парі оберіть те твердження, яке найкраще описує ваші бажання та відчуття. Іноді може здаватися, що підходять обидва варіанти, але оберіть той, що для вас важливіший.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-10">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            ~7 хвилин
          </span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>30 запитань</span>
        </div>
        <Button
          variant="cta"
          size="xl"
          onClick={onStart}
          className="group"
        >
          Почати тест
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </div>
  </motion.section>
);

// --- QUIZ SCREEN ---

interface QuizScreenProps {
  question: typeof questions[0];
  questionIndex: number;
  totalQuestions: number;
  progressPercent: number;
  direction: number;
  onAnswer: (category: string) => void;
}

const QuizScreen = ({ question, questionIndex, totalQuestions, progressPercent, direction, onAnswer }: QuizScreenProps) => (
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="pt-28 pb-20"
  >
    <div className="container-custom max-w-2xl mx-auto px-4">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-muted-foreground">
            Запитання {questionIndex + 1} з {totalQuestions}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="space-y-4"
        >
          <p className="text-center text-sm text-muted-foreground mb-6 font-medium">
            Оберіть твердження, яке вам ближче:
          </p>

          <OptionCard
            text={question.option1.text}
            label="А"
            onClick={() => onAnswer(question.option1.category)}
          />

          <div className="flex items-center justify-center gap-3 py-1">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">або</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <OptionCard
            text={question.option2.text}
            label="Б"
            onClick={() => onAnswer(question.option2.category)}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  </motion.section>
);

const OptionCard = ({ text, label, onClick }: { text: string; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full text-left p-6 rounded-xl border-2 border-border bg-card",
      "transition-all duration-200 ease-out",
      "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5",
      "active:translate-y-0 active:shadow-md",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "group cursor-pointer"
    )}
  >
    <div className="flex items-start gap-4">
      <span className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
        "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
        "transition-colors duration-200"
      )}>
        {label}
      </span>
      <span className="text-foreground leading-relaxed pt-1">
        {text}
      </span>
    </div>
  </button>
);

// --- RESULTS SCREEN ---

interface ResultsScreenProps {
  sortedResults: Array<{ category: string; label: string; score: number; color: string }>;
  primaryLanguage: { category: string; label: string; score: number; color: string };
  onReset: () => void;
}

const ResultsScreen = ({ sortedResults, primaryLanguage, onReset }: ResultsScreenProps) => {
  const Icon = categoryIcons[primaryLanguage.category];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-28 pb-20"
    >
      <div className="container-custom max-w-3xl mx-auto px-4">
        {/* Primary Language Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon className="w-10 h-10 text-primary" />
          </div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Ваша основна мова любові
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            {primaryLanguage.label}
          </h2>
          <p className="text-lg text-muted-foreground">
            {primaryLanguage.score} з 12 балів
          </p>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-card rounded-2xl border border-border p-6 md:p-8 mb-8 shadow-sm"
        >
          <h3 className="font-display text-xl font-semibold text-foreground mb-2 text-center">
            Ваш профіль Мов Любові
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Ось як розподілилися ваші мови любові (максимум 12 балів для однієї мови).
          </p>
          <div className="w-full h-[300px] md:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedResults}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(168, 20%, 85%)" horizontal={false} />
                <XAxis type="number" domain={[0, 12]} tick={{ fontSize: 12, fill: 'hsl(168, 15%, 40%)' }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  tick={{ fontSize: 13, fill: 'hsl(168, 30%, 15%)' }}
                  width={150}
                />
                <Tooltip
                  formatter={(value: number) => [`${value} балів`, 'Результат']}
                  contentStyle={{
                    backgroundColor: 'hsl(40, 33%, 99%)',
                    border: '1px solid hsl(168, 20%, 85%)',
                    borderRadius: '0.75rem',
                    fontSize: '14px',
                  }}
                />
                <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={32}>
                  {sortedResults.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Descriptions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-4 mb-12"
        >
          <h3 className="font-display text-xl font-semibold text-foreground text-center mb-6">
            Розшифровка результатів
          </h3>
          {sortedResults.map((result, index) => {
            const Icon = categoryIcons[result.category];
            return (
              <Card key={result.category} className="overflow-hidden border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${result.color}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: result.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <h4 className="font-display text-lg font-semibold text-foreground">
                          {index === 0 && <Sparkles className="w-4 h-4 inline mr-1.5 text-secondary" />}
                          {result.label}
                        </h4>
                        <span
                          className="text-sm font-semibold px-3 py-1 rounded-full"
                          style={{ backgroundColor: `${result.color}15`, color: result.color }}
                        >
                          {result.score} балів
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {categoryDescriptions[result.category]}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center space-y-4"
        >
          <Button variant="cta" size="xl" asChild>
            <a
              href="https://t.me/SigurdPSYBot?start=64f8747ec7512692c00d1788"
              target="_blank"
              rel="noopener noreferrer"
            >
              Записатися на консультацію
              <ArrowRight className="w-5 h-5" />
            </a>
          </Button>
          <div>
            <Button variant="ghost" onClick={onReset} className="text-muted-foreground">
              <RotateCcw className="w-4 h-4 mr-2" />
              Пройти тест знову
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default LoveLanguagesTest;
