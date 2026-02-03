import { useState } from 'react';
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
import { ArrowLeft, ArrowRight, RotateCcw, Brain, Shield, Phone, CheckCircle2, AlertTriangle, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const questions = [
  "Відчуття оніміння та поколювання в тілі",
  "Відчуття жару",
  "Тремтіння в ногах",
  "Неможливість розслабитись",
  "Страх, що станеться найгірше",
  "Головокружіння",
  "Прискорене серцебиття",
  "Нестійкість, нестабільність",
  "Відчуття жаху, це кінець",
  "Дратівливість",
  "Тремтіння в руках",
  "Відчуття задухи",
  "Нерівна хода",
  "Страх втрати контролю",
  "Труднощі з диханням",
  "Страх смерті",
  "Переляк",
  "Шлунково-кишкові розлади",
  "Непритомність",
  "Прилив крові до обличчя",
  "Посилене потовиділення (не пов'язане зі спекою)",
];

const responseOptions = [
  { value: 0, label: "Зовсім не турбує" },
  { value: 1, label: "Злегка турбує" },
  { value: 2, label: "Середньо турбує" },
  { value: 3, label: "Дуже турбує" },
];

type AnxietyLevel = 'minimal' | 'mild' | 'moderate' | 'severe';

interface InterpretationData {
  level: AnxietyLevel;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  recommendations: string[];
}

const interpretations: Record<AnxietyLevel, InterpretationData> = {
  minimal: {
    level: 'minimal',
    label: "Мінімальна тривожність",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    description: "Ваш рівень тривожності знаходиться в межах норми. Ви добре справляєтеся зі стресовими ситуаціями та маєте здорові механізми подолання тривоги.",
    recommendations: [
      "Продовжуйте підтримувати здоровий спосіб життя",
      "Практикуйте техніки релаксації для профілактики",
      "Зберігайте баланс між роботою та відпочинком",
    ],
  },
  mild: {
    level: 'mild',
    label: "Легка тривожність",
    icon: AlertTriangle,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    description: "Ви відчуваєте легкий рівень тривожності, який може проявлятися в певних ситуаціях. Це нормальна реакція на стрес, але варто звернути увагу на ваш емоційний стан.",
    recommendations: [
      "Практикуйте техніки дихання та медитації",
      "Регулярно займайтеся фізичною активністю",
      "Розгляньте можливість консультації з психологом для вивчення стратегій подолання тривоги",
      "Зверніть увагу на режим сну та харчування",
    ],
  },
  moderate: {
    level: 'moderate',
    label: "Помірна тривожність",
    icon: AlertCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    description: "Ваш рівень тривожності є помірним і може впливати на вашу повсякденну діяльність. Рекомендується звернутися за професійною допомогою.",
    recommendations: [
      "Запишіться на консультацію з психологом для розробки індивідуального плану роботи",
      "Вивчіть техніки когнітивно-поведінкової терапії",
      "Розгляньте можливість регулярних терапевтичних сесій",
      "Практикуйте техніки заземлення та усвідомленості",
    ],
  },
  severe: {
    level: 'severe',
    label: "Виражена тривожність",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    description: "Ваш рівень тривожності є високим і може значно впливати на якість вашого життя. Настійно рекомендується звернутися за професійною психологічною допомогою.",
    recommendations: [
      "Зверніться до психолога або психотерапевта якомога швидше",
      "Розгляньте можливість регулярної терапії та, за необхідності, консультації з психіатром",
      "Не залишайтеся наодинці зі своїми переживаннями",
      "Використовуйте кризові лінії підтримки при гострих станах",
    ],
  },
};

const getInterpretation = (score: number): AnxietyLevel => {
  if (score <= 7) return 'minimal';
  if (score <= 15) return 'mild';
  if (score <= 25) return 'moderate';
  return 'severe';
};

const BeckAnxietyTest = () => {
  const [stage, setStage] = useState<'intro' | 'test' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<(number | null)[]>(new Array(21).fill(null));
  const [showValidation, setShowValidation] = useState(false);

  const progress = ((responses.filter(r => r !== null).length) / questions.length) * 100;
  const allAnswered = responses.every(r => r !== null);
  const totalScore = responses.reduce((sum: number, val) => sum + (val ?? 0), 0);
  const interpretation = interpretations[getInterpretation(totalScore)];

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
      // Find first unanswered question
      const firstUnanswered = responses.findIndex(r => r === null);
      if (firstUnanswered !== -1) {
        setCurrentQuestion(firstUnanswered);
      }
      return;
    }
    setStage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetTest = () => {
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
              <Brain className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Шкала тривоги Бека
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Beck Anxiety Inventory (BAI)
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <AnimatePresence mode="wait">
            {/* INTRODUCTION STAGE */}
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
                      Шкала тривоги Бека (BAI) — це науково обґрунтований тест, розроблений доктором Аароном Беком у 1988 році. 
                      Він використовується для вимірювання тяжкості симптомів тривоги у підлітків і дорослих віком від 17 років.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Тест складається з 21 питання про симптоми тривоги, які ви могли відчувати протягом останнього місяця, 
                      включаючи сьогодні. Відповіді допоможуть визначити рівень вашої тривожності.
                    </p>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-amber-800 text-sm">
                          <strong>Важливо:</strong> Цей тест є інформаційним інструментом і не замінює професійної діагностики. 
                          Для точної оцінки вашого стану рекомендується консультація з психологом.
                        </p>
                      </div>
                    </div>

                    <div className="bg-muted rounded-xl p-6">
                      <h3 className="font-semibold text-foreground mb-3">Інструкція</h3>
                      <p className="text-muted-foreground">
                        Будь ласка, вкажіть, наскільки сильно вас турбував той чи інший симптом 
                        протягом останнього місяця, зокрема сьогодні.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">21 питання</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">~5 хвилин</Badge>
                      </div>
                    </div>

                    <Button
                      variant="cta"
                      size="lg"
                      className="w-full"
                      onClick={startTest}
                    >
                      Розпочати тест
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* TEST STAGE */}
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
                              <RadioGroupItem
                                value={option.value.toString()}
                                id={`option-${option.value}`}
                              />
                              <span className="text-foreground">{option.label}</span>
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
                      <Button
                        variant="outline"
                        onClick={goPrev}
                        disabled={currentQuestion === 0}
                      >
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Назад
                      </Button>

                      {currentQuestion < questions.length - 1 ? (
                        <Button variant="cta" onClick={goNext}>
                          Наступне
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="cta"
                          onClick={submitTest}
                          disabled={!allAnswered}
                        >
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

            {/* RESULTS STAGE */}
            {stage === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
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
                        <span>7</span>
                        <span>15</span>
                        <span>25</span>
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

                    {interpretation.level === 'severe' && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Phone className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                          <div className="text-red-800 text-sm">
                            <p className="font-semibold mb-2">
                              Якщо ви відчуваєте гострий стан тривоги, зверніться за негайною допомогою:
                            </p>
                            <ul className="space-y-1">
                              <li>• Телефон довіри: <strong>7333</strong> (безкоштовно по Україні)</li>
                              <li>• Екстрена психологічна допомога: <strong>0 800 500 335</strong></li>
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
                      Запишіться на безкоштовну консультацію, щоб отримати професійну оцінку вашого стану 
                      та індивідуальні рекомендації.
                    </p>
                    <Button variant="cta" size="lg" asChild>
                      <a href="/#contact">Записатися на консультацію</a>
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

                {/* Privacy Disclaimer */}
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
                          Якщо ви відчуваєте серйозні симптоми тривоги, будь ласка, зверніться до кваліфікованого спеціаліста.
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

export default BeckAnxietyTest;
