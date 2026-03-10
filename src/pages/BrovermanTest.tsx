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
import { ArrowLeft, ArrowRight, RotateCcw, Dna, Shield, Phone, CheckCircle2, AlertTriangle, AlertCircle, XCircle, Battery, Brain, Leaf, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import usePageSEO, { createTestJsonLd } from '@/hooks/usePageSEO';
import { useTestKeyboard } from '@/hooks/useTestKeyboard';
import KeyboardHints, { HINTS_SCALE } from '@/components/KeyboardHints';

// Question categories
const categories = [
  {
    id: 'dopamine',
    name: 'Дофамін',
    subtitle: 'Енергія, мотивація, концентрація',
    icon: Battery,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    progressColor: 'bg-violet-500',
    questions: [
      "Відчуваю втрату енергії протягом дня",
      "Важко концентруватися на завданнях",
      "Відчуваю апатію або відсутність мотивації",
      "Маю проблеми з прийняттям рішень",
      "Відчуваю втрату задоволення від речей, які раніше приносили радість",
      "Важко почати нові проекти",
      "Відчуваю фізичну або розумову втому",
      "Маю труднощі з завершенням розпочатих справ",
      "Відчуваю потребу в стимуляторах (кофеїн, цукор)",
      "Маю низьку самооцінку або впевненість",
      "Відчуваю нудьгу навіть під час цікавих занять",
      "Важко вставати вранці",
      "Відчуваю зниження лібідо",
      "Маю проблеми з короткостроковою пам'яттю",
      "Відчуваю потребу в постійній стимуляції",
      "Важко зосередитися на розмові",
      "Відчуваю емоційну притупленість",
      "Маю схильність до прокрастинації",
      "Відчуваю зниження фізичної витривалості",
      "Важко відчувати ентузіазм",
      "Відчуваю потребу в солодкому або жирному",
      "Маю труднощі з плануванням",
      "Відчуваю зниження творчих здібностей",
      "Важко підтримувати увагу тривалий час",
      "Відчуваю відсутність цілей або напрямку",
      "Маю проблеми з координацією рухів",
      "Відчуваю зниження швидкості реакції",
      "Важко відчувати радість від досягнень",
      "Відчуваю соціальну відчуженість",
      "Маю труднощі з навчанням нового",
      "Відчуваю зниження амбіцій",
      "Важко підтримувати позитивний настрій",
      "Відчуваю потребу в частих перервах",
      "Маю проблеми з ініціативністю",
      "Відчуваю загальне зниження якості життя",
    ],
  },
  {
    id: 'acetylcholine',
    name: 'Ацетилхолін',
    subtitle: "Пам'ять, креативність, швидкість мислення",
    icon: Brain,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    progressColor: 'bg-blue-500',
    questions: [
      "Важко згадати імена або слова",
      "Відчуваю \"туман\" у голові",
      "Маю проблеми з довгостроковою пам'яттю",
      "Важко вчитися новому",
      "Відчуваю зниження швидкості мислення",
      "Маю труднощі з читанням або розумінням тексту",
      "Відчуваю зниження вербальних здібностей",
      "Важко формулювати думки",
      "Маю проблеми з просторовою орієнтацією",
      "Відчуваю зниження креативності",
      "Важко запам'ятовувати нову інформацію",
      "Маю труднощі з багатозадачністю",
      "Відчуваю зниження уваги до деталей",
      "Важко слідкувати за складними розмовами",
      "Маю проблеми з розпізнаванням облич",
      "Відчуваю зниження здатності до візуалізації",
      "Важко згадати недавні події",
      "Маю труднощі з математичними обчисленнями",
      "Відчуваю зниження логічного мислення",
      "Важко концентруватися під час читання",
      "Маю проблеми з запам'ятовуванням списків",
      "Відчуваю зниження здатності до аналізу",
      "Важко вивчати нові навички",
      "Маю труднощі з розумінням інструкцій",
      "Відчуваю зниження інтелектуальної продуктивності",
      "Важко підтримувати розумову ясність",
      "Маю проблеми з концентрацією на деталях",
      "Відчуваю зниження здатності до синтезу інформації",
      "Важко запам'ятовувати числа",
      "Маю труднощі з прийняттям складних рішень",
      "Відчуваю зниження ментальної гнучкості",
      "Важко переключатися між завданнями",
      "Маю проблеми з абстрактним мисленням",
      "Відчуваю зниження здатності до навчання",
      "Важко підтримувати розумову енергію",
    ],
  },
  {
    id: 'gaba',
    name: 'ГАМК',
    subtitle: 'Спокій, стабільність, контроль тривожності',
    icon: Leaf,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    progressColor: 'bg-green-500',
    questions: [
      "Відчуваю постійну тривожність",
      "Важко розслабитися",
      "Маю проблеми зі сном (засинання або підтримання)",
      "Відчуваю м'язове напруження",
      "Маю схильність до панічних атак",
      "Відчуваю внутрішнє занепокоєння",
      "Важко заспокоїтися після стресу",
      "Маю проблеми з контролем хвилювання",
      "Відчуваю фізичні симптоми тривоги (серцебиття, пітливість)",
      "Важко відчувати спокій",
      "Маю схильність до надмірного занепокоєння",
      "Відчуваю нервозність у соціальних ситуаціях",
      "Важко контролювати негативні думки",
      "Маю проблеми з перенапруженням",
      "Відчуваю постійну настороженість",
      "Важко відпустити переживання",
      "Маю схильність до обсесивних думок",
      "Відчуваю емоційну нестабільність",
      "Важко справлятися зі змінами",
      "Маю проблеми з контролем імпульсів",
      "Відчуваю підвищену чутливість до стресу",
      "Важко зберігати емоційну рівновагу",
      "Маю схильність до дратівливості",
      "Відчуваю внутрішню напругу",
      "Важко відчувати безпеку",
      "Маю проблеми з довірою",
      "Відчуваю постійне очікування неприємностей",
      "Важко насолоджуватися моментом",
      "Маю схильність до катастрофізації",
      "Відчуваю фізичний дискомфорт від тривоги",
      "Важко контролювати страхи",
      "Маю проблеми з відчуттям стабільності",
      "Відчуваю емоційну вразливість",
      "Важко справлятися з невизначеністю",
      "Маю постійне відчуття напруги",
    ],
  },
  {
    id: 'serotonin',
    name: 'Серотонін',
    subtitle: 'Настрій, оптимізм, емоційна стабільність',
    icon: Sun,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    progressColor: 'bg-amber-500',
    questions: [
      "Відчуваю пригніченість або смуток",
      "Маю проблеми з настроєм (перепади або низький фон)",
      "Відчуваю песимізм щодо майбутнього",
      "Важко відчувати щастя",
      "Маю схильність до негативного мислення",
      "Відчуваю емоційну чутливість (легко засмучуюсь)",
      "Важко справлятися з критикою",
      "Маю проблеми з самооцінкою",
      "Відчуваю соціальну ізоляцію",
      "Важко підтримувати оптимізм",
      "Маю схильність до самокритики",
      "Відчуваю втрату інтересу до соціальних контактів",
      "Важко відчувати вдячність",
      "Маю проблеми з емоційною стійкістю",
      "Відчуваю безнадійність",
      "Важко бачити позитивні сторони ситуацій",
      "Маю схильність до руминації (пережовування думок)",
      "Відчуваю емоційну втому",
      "Важко відчувати емоційне тепло",
      "Маю проблеми з вираженням емоцій",
      "Відчуваю відчуженість від інших",
      "Важко відчувати емоційний зв'язок",
      "Маю схильність до самотності",
      "Відчуваю втрату сенсу життя",
      "Важко відчувати задоволення від стосунків",
      "Маю проблеми з емпатією",
      "Відчуваю емоційну порожнечу",
      "Важко відчувати любов до себе",
      "Маю схильність до самозвинувачення",
      "Відчуваю втрату надії",
      "Важко бачити сенс у діяльності",
      "Маю проблеми з емоційною експресією",
      "Відчуваю хронічну незадоволеність",
      "Важко відчувати внутрішній спокій",
      "Маю відчуття емоційної відірваності",
    ],
  },
];

const responseOptions = [
  { value: 0, label: "Ніколи" },
  { value: 1, label: "Рідко" },
  { value: 2, label: "Іноді" },
  { value: 3, label: "Часто" },
];

const TOTAL_QUESTIONS = 140;
const QUESTIONS_PER_CATEGORY = 35;

type DeficitLevel = 'normal' | 'mild' | 'moderate' | 'severe';

interface DeficitData {
  level: DeficitLevel;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}

const deficitLevels: Record<DeficitLevel, DeficitData> = {
  normal: {
    level: 'normal',
    label: 'Норма',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  mild: {
    level: 'mild',
    label: 'Легкий дефіцит',
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  moderate: {
    level: 'moderate',
    label: 'Помірний дефіцит',
    icon: AlertCircle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  severe: {
    level: 'severe',
    label: 'Значний дефіцит',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
};

const getDeficitLevel = (score: number): DeficitLevel => {
  if (score <= 25) return 'normal';
  if (score <= 50) return 'mild';
  if (score <= 75) return 'moderate';
  return 'severe';
};

const getProgressColor = (score: number): string => {
  if (score <= 25) return 'bg-emerald-500';
  if (score <= 50) return 'bg-yellow-500';
  if (score <= 75) return 'bg-orange-500';
  return 'bg-red-500';
};

interface InterpretationDetails {
  description: string;
  recommendations: string[];
  showCrisisInfo?: boolean;
}

interface NeurotransmitterInterpretation {
  normal: InterpretationDetails;
  mild: InterpretationDetails;
  moderate: InterpretationDetails;
  severe: InterpretationDetails;
}

const interpretations: Record<string, NeurotransmitterInterpretation> = {
  dopamine: {
    normal: {
      description: "Ваша мотивація та енергія в нормі. Ви здатні ефективно концентруватися та досягати цілей.",
      recommendations: [
        "Продовжуйте підтримувати здоровий спосіб життя",
        "Регулярна фізична активність",
        "Достатній сон (7-9 годин)",
      ],
    },
    mild: {
      description: "Можливі періодичні зниження енергії та мотивації. Це може проявлятися у втомі, труднощах з концентрацією або зниженні задоволення від діяльності.",
      recommendations: [
        "Регулярна фізична активність (30 хв/день)",
        "Збалансоване харчування з достатньою кількістю білка",
        "Достатній сон та режим дня",
        "Розгляньте добавки: L-тирозин, вітамін B6, магній",
        "Встановлюйте досяжні цілі та відзначайте успіхи",
      ],
    },
    moderate: {
      description: "Помітні проблеми з концентрацією, мотивацією та енергією, які можуть впливати на вашу повсякденну діяльність.",
      recommendations: [
        "Консультація з психологом або лікарем",
        "Структурування дня з чіткими цілями",
        "Регулярна фізична активність (особливо кардіо)",
        "Розгляньте добавки під наглядом спеціаліста (L-тирозин, родіола)",
        "Техніки підвищення мотивації (система винагород)",
        "Перевірте рівень вітаміну D, B12, заліза",
      ],
    },
    severe: {
      description: "Серйозні порушення мотивації та енергії, що значно впливають на якість життя. Можливі симптоми депресії або інших станів.",
      recommendations: [
        "Негайна консультація з лікарем для виключення медичних причин",
        "Психотерапія (когнітивно-поведінкова терапія)",
        "Медичне обстеження (гормони щитовидної залози, анемія)",
        "Можливе призначення медикаментозної терапії",
        "Не залишайтеся наодинці з проблемою",
      ],
    },
  },
  acetylcholine: {
    normal: {
      description: "Ваша пам'ять та когнітивні функції в нормі. Ви ефективно обробляєте інформацію та маєте хорошу ментальну ясність.",
      recommendations: [
        "Продовжуйте ментальні вправи та навчання",
        "Читання, головоломки, вивчення нового",
        "Достатній сон для консолідації пам'яті",
      ],
    },
    mild: {
      description: "Можливі періодичні проблеми з пам'яттю, концентрацією або швидкістю мислення.",
      recommendations: [
        "Ментальні вправи та когнітивні тренування",
        "Достатній сон (важливо для пам'яті)",
        "Продукти з холіном: яйця, риба, горіхи, броколі",
        "Розгляньте добавки: альфа-GPC, холін, вітаміни B",
        "Зменшення багатозадачності, фокус на одному завданні",
      ],
    },
    moderate: {
      description: "Помітні когнітивні труднощі, які можуть впливати на роботу, навчання або повсякденне функціонування.",
      recommendations: [
        "Консультація з неврологом або психологом",
        "Когнітивні тренування (додатки, вправи)",
        "Розгляньте добавки під наглядом спеціаліста (альфа-GPC, гінкго білоба)",
        "Перевірте рівень вітаміну B12, фолієвої кислоти",
        "Техніки покращення пам'яті (мнемотехніки)",
        "Регулярна аеробна активність (покращує когнітивні функції)",
      ],
    },
    severe: {
      description: "Серйозні когнітивні порушення, які потребують медичної уваги для виключення неврологічних проблем.",
      recommendations: [
        "Негайна консультація з неврологом",
        "Комплексне медичне обстеження",
        "Виключення деменції, хвороби Альцгеймера, інших станів",
        "Можлива медикаментозна терапія",
        "Когнітивна реабілітація",
      ],
    },
  },
  gaba: {
    normal: {
      description: "Ваш рівень тривожності в нормі. Ви здатні ефективно розслаблятися та справлятися зі стресом.",
      recommendations: [
        "Продовжуйте практики релаксації",
        "Підтримуйте здоровий баланс роботи та відпочинку",
        "Регулярна медитація або йога",
      ],
    },
    mild: {
      description: "Можлива підвищена тривожність у стресових ситуаціях або труднощі з розслабленням.",
      recommendations: [
        "Техніки релаксації: глибоке дихання, прогресивна м'язова релаксація",
        "Медитація та майндфулнес (10-15 хв/день)",
        "Регулярна фізична активність (знижує тривожність)",
        "Обмеження кофеїну та алкоголю",
        "Розгляньте добавки: магній, L-теанін, ромашка",
        "Достатній сон та режим",
      ],
    },
    moderate: {
      description: "Помітна тривожність, яка впливає на повсякденне життя, сон або соціальне функціонування.",
      recommendations: [
        "Консультація з психологом або психотерапевтом",
        "Когнітивно-поведінкова терапія (КПТ) для тривожності",
        "Техніки управління стресом",
        "Розгляньте добавки під наглядом спеціаліста (магній, ГАМК, L-теанін)",
        "Регулярна практика релаксації",
        "Можлива групова терапія або підтримка",
      ],
    },
    severe: {
      description: "Серйозні проблеми з тривожністю, можливі панічні атаки або тривожні розлади.",
      recommendations: [
        "Негайна консультація з психіатром або психотерапевтом",
        "Можлива медикаментозна терапія (анксіолітики, SSRI)",
        "Інтенсивна психотерапія (КПТ, EMDR)",
        "Не залишайтеся наодинці з проблемою",
        "Кризові лінії підтримки при гострих станах",
      ],
      showCrisisInfo: true,
    },
  },
  serotonin: {
    normal: {
      description: "Ваш настрій стабільний та позитивний. Ви здатні відчувати задоволення від життя та підтримувати емоційну рівновагу.",
      recommendations: [
        "Продовжуйте здоровий спосіб життя",
        "Регулярне перебування на сонці",
        "Соціальні контакти та підтримка",
      ],
    },
    mild: {
      description: "Можливі періодичні зниження настрою, песимізм або емоційна чутливість.",
      recommendations: [
        "Регулярна фізична активність (підвищує серотонін)",
        "Достатнє сонячне світло або світлотерапія (особливо взимку)",
        "Соціальні контакти та підтримка близьких",
        "Продукти з триптофаном: індичка, банани, горіхи, насіння",
        "Розгляньте добавки: 5-HTP, триптофан, вітамін D",
        "Практики вдячності та позитивного мислення",
      ],
    },
    moderate: {
      description: "Помітні проблеми з настроєм та емоційною стабільністю, які можуть вказувати на депресивні симптоми.",
      recommendations: [
        "Консультація з психологом або психотерапевтом",
        "Психотерапія (КПТ, міжособистісна терапія)",
        "Регулярна фізична активність (30-60 хв/день)",
        "Розгляньте добавки під наглядом спеціаліста (5-HTP, SAM-e)",
        "Перевірте рівень вітаміну D, омега-3",
        "Світлотерапія (при сезонній депресії)",
        "Техніки когнітивної реструктуризації",
      ],
    },
    severe: {
      description: "Серйозні порушення настрою, можлива клінічна депресія. Необхідна професійна допомога.",
      recommendations: [
        "Негайна консультація з психіатром або психотерапевтом",
        "Діагностика депресивного розладу",
        "Можлива медикаментозна терапія (SSRI, SNRI)",
        "Інтенсивна психотерапія",
        "Не залишайтеся наодинці",
        "При суїцидальних думках — негайна допомога",
      ],
      showCrisisInfo: true,
    },
  },
};

const BrovermanTest = () => {
  usePageSEO({
    title: 'Тест Бровермана — Тест нейромедіаторів онлайн безкоштовно',
    description: 'Пройдіть тест нейромедіаторів Бровермана онлайн безкоштовно. 140 питань для оцінки балансу дофаміну, ацетилхоліну, ГАМК та серотоніну з детальним результатом.',
    canonical: 'https://myrhorodskyi.lovable.app/tests/test-neiromediatoriv-brovermana',
    keywords: 'тест Бровермана, тест нейромедіаторів онлайн, дофамін серотонін ГАМК ацетилхолін тест, баланс нейромедіаторів безкоштовно, тест Бровермана українською',
    jsonLd: createTestJsonLd({
      name: 'Тест нейромедіаторів Бровермана',
      description: 'Комплексний тест для оцінки балансу нейромедіаторів за методикою Бровермана.',
      url: 'https://myrhorodskyi.lovable.app/tests/test-neiromediatoriv-brovermana',
      questionCount: 140,
      duration: 'PT20M',
    }),
  });
  const [stage, setStage] = useState<'intro' | 'test' | 'results'>('intro');
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionInCategory, setCurrentQuestionInCategory] = useState(0);
  const [responses, setResponses] = useState<(number | null)[]>(new Array(TOTAL_QUESTIONS).fill(null));
  const [showValidation, setShowValidation] = useState(false);

  // Save progress to sessionStorage (auto-clears on browser close)
  useEffect(() => {
    if (stage === 'test') {
      sessionStorage.setItem('broverman-progress', JSON.stringify({
        responses,
        currentCategoryIndex,
        currentQuestionInCategory,
      }));
    }
  }, [responses, currentCategoryIndex, currentQuestionInCategory, stage]);

  // Load saved progress
  useEffect(() => {
    const saved = sessionStorage.getItem('broverman-progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.responses && data.responses.length === TOTAL_QUESTIONS) {
          setResponses(data.responses);
          setCurrentCategoryIndex(data.currentCategoryIndex || 0);
          setCurrentQuestionInCategory(data.currentQuestionInCategory || 0);
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
  }, []);

  const clearSavedData = () => {
    sessionStorage.removeItem('broverman-progress');
    setResponses(new Array(TOTAL_QUESTIONS).fill(null));
    setCurrentCategoryIndex(0);
    setCurrentQuestionInCategory(0);
    setShowValidation(false);
  };

  const currentCategory = categories[currentCategoryIndex];
  const globalQuestionIndex = currentCategoryIndex * QUESTIONS_PER_CATEGORY + currentQuestionInCategory;
  const answeredCount = responses.filter(r => r !== null).length;
  const totalProgress = (answeredCount / TOTAL_QUESTIONS) * 100;
  const allAnswered = responses.every(r => r !== null);

  // Calculate category progress
  const getCategoryProgress = (categoryIndex: number) => {
    const start = categoryIndex * QUESTIONS_PER_CATEGORY;
    const end = start + QUESTIONS_PER_CATEGORY;
    const categoryResponses = responses.slice(start, end);
    return categoryResponses.filter(r => r !== null).length;
  };

  // Calculate scores
  const calculateScores = () => {
    return {
      dopamine: responses.slice(0, 35).reduce((sum: number, val) => sum + (val ?? 0), 0),
      acetylcholine: responses.slice(35, 70).reduce((sum: number, val) => sum + (val ?? 0), 0),
      gaba: responses.slice(70, 105).reduce((sum: number, val) => sum + (val ?? 0), 0),
      serotonin: responses.slice(105, 140).reduce((sum: number, val) => sum + (val ?? 0), 0),
    };
  };

  const handleResponse = (value: number) => {
    const newResponses = [...responses];
    newResponses[globalQuestionIndex] = value;
    setResponses(newResponses);
    setShowValidation(false);
  };

  const goNext = () => {
    if (responses[globalQuestionIndex] === null) {
      setShowValidation(true);
      return;
    }
    
    if (currentQuestionInCategory < QUESTIONS_PER_CATEGORY - 1) {
      setCurrentQuestionInCategory(prev => prev + 1);
    } else if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(prev => prev + 1);
      setCurrentQuestionInCategory(0);
    }
    setShowValidation(false);
  };

  const goPrev = () => {
    if (currentQuestionInCategory > 0) {
      setCurrentQuestionInCategory(prev => prev - 1);
    } else if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(prev => prev - 1);
      setCurrentQuestionInCategory(QUESTIONS_PER_CATEGORY - 1);
    }
    setShowValidation(false);
  };

  const submitTest = () => {
    if (!allAnswered) {
      setShowValidation(true);
      // Find first unanswered question
      const firstUnanswered = responses.findIndex(r => r === null);
      if (firstUnanswered !== -1) {
        const categoryIndex = Math.floor(firstUnanswered / QUESTIONS_PER_CATEGORY);
        const questionIndex = firstUnanswered % QUESTIONS_PER_CATEGORY;
        setCurrentCategoryIndex(categoryIndex);
        setCurrentQuestionInCategory(questionIndex);
      }
      return;
    }
    sessionStorage.removeItem('broverman-progress');
    setStage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetTest = () => {
    sessionStorage.removeItem('broverman-progress');
    setStage('intro');
    setCurrentCategoryIndex(0);
    setCurrentQuestionInCategory(0);
    setResponses(new Array(TOTAL_QUESTIONS).fill(null));
    setShowValidation(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startTest = () => {
    setStage('test');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKeyboardNext = useCallback(() => {
    if (globalQuestionIndex < TOTAL_QUESTIONS - 1) {
      goNext();
    } else if (allAnswered) {
      submitTest();
    }
  }, [globalQuestionIndex, allAnswered, responses]);

  useTestKeyboard({
    isActive: stage === 'test',
    optionsCount: responseOptions.length,
    currentValue: responses[globalQuestionIndex],
    onSelect: handleResponse,
    onNext: handleKeyboardNext,
    onPrev: goPrev,
  });

  const scores = calculateScores();
  const highestDeficitKey = Object.entries(scores).reduce((max, curr) => 
    curr[1] > max[1] ? curr : max
  )[0];

  const neurotransmitterNames: Record<string, string> = {
    dopamine: 'Дофамін',
    acetylcholine: 'Ацетилхолін',
    gaba: 'ГАМК',
    serotonin: 'Серотонін',
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
              <Dna className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Тест Бровермана
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Оцінка балансу нейромедіаторів
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
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
                      Тест Бровермана — це науково обґрунтований інструмент для оцінки балансу чотирьох ключових нейромедіаторів: 
                      <strong className="text-foreground"> дофаміну</strong>, 
                      <strong className="text-foreground"> ацетилхоліну</strong>, 
                      <strong className="text-foreground"> ГАМК</strong> та 
                      <strong className="text-foreground"> серотоніну</strong>. 
                      Ці хімічні речовини відіграють критичну роль у регуляції настрою, енергії, пам'яті, мотивації та емоційної стабільності.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Тест складається з 140 питань, розділених на 4 категорії по 35 питань на кожен нейромедіатор. 
                      Результати допоможуть визначити потенційні дефіцити та отримати персоналізовані рекомендації.
                    </p>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-amber-800 text-sm">
                          <strong>Важливо:</strong> Цей тест є інформаційним інструментом і не замінює професійної діагностики. 
                          Для точної оцінки вашого стану рекомендується консультація з психологом або лікарем.
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-blue-800 text-sm">
                            <strong>Конфіденційність:</strong> Ваш прогрес зберігається тимчасово лише на цьому пристрої і автоматично видаляється при закритті браузера. Жодні дані не передаються на сервер. Не використовуйте на спільних або публічних комп'ютерах.
                          </p>
                          {responses.some(r => r !== null) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2 text-blue-700 hover:text-blue-900 hover:bg-blue-100 p-0 h-auto text-sm underline"
                              onClick={clearSavedData}
                            >
                              Очистити збережені дані
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Category overview */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <div key={cat.id} className={cn("rounded-xl p-4 border", cat.bgColor, cat.borderColor)}>
                            <div className="flex items-center gap-3 mb-2">
                              <Icon className={cn("w-6 h-6", cat.color)} />
                              <h4 className={cn("font-semibold", cat.color)}>{cat.name}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">{cat.subtitle}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-muted rounded-xl p-6">
                      <h3 className="font-semibold text-foreground mb-3">Інструкція</h3>
                      <p className="text-muted-foreground">
                        Будь ласка, вкажіть, як часто ви відчуваєте описані нижче симптоми протягом останнього місяця.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <Badge variant="secondary">140 питань</Badge>
                      <Badge variant="secondary">~15-20 хвилин</Badge>
                      <Badge variant="secondary">4 категорії</Badge>
                    </div>

                    {/* Show if there's saved progress */}
                    {responses.some(r => r !== null) && (
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                        <p className="text-foreground text-sm">
                          <strong>У вас є незавершений тест!</strong> Ви відповіли на {answeredCount} з {TOTAL_QUESTIONS} питань.
                        </p>
                      </div>
                    )}

                    <Button
                      variant="cta"
                      size="lg"
                      className="w-full"
                      onClick={startTest}
                    >
                      {responses.some(r => r !== null) ? 'Продовжити тест' : 'Розпочати тест'}
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
                {/* Category tabs */}
                <div className="mb-6 grid grid-cols-4 gap-2">
                  {categories.map((cat, idx) => {
                    const Icon = cat.icon;
                    const progress = getCategoryProgress(idx);
                    const isActive = idx === currentCategoryIndex;
                    const isComplete = progress === QUESTIONS_PER_CATEGORY;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setCurrentCategoryIndex(idx);
                          setCurrentQuestionInCategory(0);
                        }}
                        className={cn(
                          "p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1",
                          isActive ? cn(cat.borderColor, cat.bgColor) : "border-border hover:border-primary/30",
                          isComplete && !isActive && "border-emerald-200 bg-emerald-50"
                        )}
                      >
                        <Icon className={cn("w-5 h-5", isActive ? cat.color : "text-muted-foreground")} />
                        <span className={cn("text-xs font-medium hidden sm:block", isActive ? cat.color : "text-muted-foreground")}>
                          {cat.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {progress}/{QUESTIONS_PER_CATEGORY}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      Питання {globalQuestionIndex + 1} з {TOTAL_QUESTIONS}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {Math.round(totalProgress)}% завершено
                    </span>
                  </div>
                  <Progress value={totalProgress} className="h-2" />
                </div>

                {/* Current category indicator */}
                <div className={cn("mb-6 p-4 rounded-xl border", currentCategory.bgColor, currentCategory.borderColor)}>
                  <div className="flex items-center gap-3">
                    <currentCategory.icon className={cn("w-6 h-6", currentCategory.color)} />
                    <div>
                      <h3 className={cn("font-semibold", currentCategory.color)}>{currentCategory.name}</h3>
                      <p className="text-sm text-muted-foreground">{currentCategory.subtitle}</p>
                    </div>
                    <span className="ml-auto text-sm font-medium text-muted-foreground">
                      {currentQuestionInCategory + 1}/{QUESTIONS_PER_CATEGORY}
                    </span>
                  </div>
                </div>

                {/* Question Card */}
                <Card className="border-border shadow-lg">
                  <CardContent className="pt-8 pb-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={globalQuestionIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-8 text-center">
                          {globalQuestionIndex + 1}. {currentCategory.questions[currentQuestionInCategory]}
                        </h2>

                        <RadioGroup
                          value={responses[globalQuestionIndex]?.toString() ?? ''}
                          onValueChange={(val) => handleResponse(parseInt(val))}
                          className="space-y-3"
                        >
                          {responseOptions.map((option) => (
                            <Label
                              key={option.value}
                              htmlFor={`option-${option.value}`}
                              className={cn(
                                "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                                responses[globalQuestionIndex] === option.value
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

                        {showValidation && responses[globalQuestionIndex] === null && (
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
                        disabled={globalQuestionIndex === 0}
                      >
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Назад
                      </Button>

                      {globalQuestionIndex < TOTAL_QUESTIONS - 1 ? (
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

                {/* Privacy notice */}
                <div className="mt-6 text-center text-xs text-muted-foreground">
                  <Shield className="inline-block w-4 h-4 mr-1" />
                  Ваші відповіді зберігаються локально у вашому браузері
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
                {/* Summary Header */}
                <Card className="border-border shadow-lg">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <Dna className="w-12 h-12 text-primary" />
                    </div>
                    <CardTitle className="font-display text-2xl md:text-3xl text-foreground">
                      Ваш нейромедіаторний профіль
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground mb-6">
                      Тест завершено! Ось ваші результати по чотирьох ключових нейромедіаторах.
                    </p>

                    {/* Quick overview */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {Object.entries(scores).map(([key, score]) => {
                        const category = categories.find(c => c.id === key)!;
                        const level = getDeficitLevel(score);
                        const levelData = deficitLevels[level];
                        const Icon = category.icon;
                        return (
                          <div 
                            key={key} 
                            className={cn(
                              "p-4 rounded-xl border",
                              levelData.bgColor,
                              levelData.borderColor
                            )}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Icon className={cn("w-6 h-6", category.color)} />
                              <span className="font-semibold text-foreground">{category.name}</span>
                            </div>
                            <div className="flex items-end gap-2">
                              <span className="text-3xl font-bold text-foreground">{score}</span>
                              <span className="text-muted-foreground mb-1">/ 105</span>
                            </div>
                            <div className="mt-2">
                              <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                                <div 
                                  className={cn("h-full transition-all", getProgressColor(score))}
                                  style={{ width: `${(score / 105) * 100}%` }}
                                />
                              </div>
                            </div>
                            <p className={cn("text-sm mt-2 font-medium", levelData.color)}>
                              {levelData.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed results for each neurotransmitter */}
                {Object.entries(scores).map(([key, score]) => {
                  const category = categories.find(c => c.id === key)!;
                  const level = getDeficitLevel(score);
                  const levelData = deficitLevels[level];
                  const interpretation = interpretations[key][level];
                  const Icon = category.icon;
                  const LevelIcon = levelData.icon;

                  return (
                    <Card key={key} className={cn("border-2", levelData.borderColor)}>
                      <CardHeader className={cn(levelData.bgColor)}>
                        <div className="flex items-center gap-4">
                          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", category.bgColor)}>
                            <Icon className={cn("w-6 h-6", category.color)} />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="font-display text-xl text-foreground flex items-center gap-2">
                              {category.name}
                              <LevelIcon className={cn("w-5 h-5", levelData.color)} />
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">{category.subtitle}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-foreground">{score}</div>
                            <div className="text-sm text-muted-foreground">з 105</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <div className={cn("p-4 rounded-xl", levelData.bgColor)}>
                          <div className="flex items-center gap-2 mb-2">
                            <LevelIcon className={cn("w-5 h-5", levelData.color)} />
                            <span className={cn("font-semibold", levelData.color)}>{levelData.label}</span>
                          </div>
                          <p className="text-muted-foreground">{interpretation.description}</p>
                        </div>

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

                        {interpretation.showCrisisInfo && (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                              <Phone className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                              <div className="text-sm">
                                <p className="font-semibold text-red-800 mb-2">Екстрена допомога:</p>
                                <ul className="space-y-1 text-red-700">
                                  <li>• Телефон довіри: <strong>7333</strong> (безкоштовно по Україні)</li>
                                  <li>• Психологічна допомога: <strong>0 800 500 335</strong></li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Overall summary */}
                <Card className="border-border shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-display text-xl text-foreground">
                      📊 Загальний висновок
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-sm text-muted-foreground mb-1">Основна область для уваги:</p>
                        <p className="font-semibold text-red-700">{neurotransmitterNames[highestDeficitKey]}</p>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                        <p className="text-sm text-muted-foreground mb-1">Сильні сторони:</p>
                        <p className="font-semibold text-emerald-700">
                          {Object.entries(scores)
                            .filter(([_, score]) => score <= 25)
                            .map(([key]) => neurotransmitterNames[key])
                            .join(', ') || 'Немає (рекомендується консультація)'}
                        </p>
                      </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                      <p className="text-foreground">
                        💡 <strong>Пам'ятайте:</strong> Баланс нейромедіаторів можна покращити через зміни способу життя, 
                        харчування, добавки та, за необхідності, професійну допомогу.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* CTA Section */}
                <Card className="border-primary bg-primary/5">
                  <CardContent className="pt-6 text-center">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                      💬 Хочете обговорити результати?
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Запишіться на консультацію, щоб отримати професійну оцінку вашого стану 
                      та індивідуальний план покращення балансу нейромедіаторів.
                    </p>
                    <Button variant="cta" size="lg" asChild>
                      <a href="https://t.me/SigurdPSYBot?start=64f8747ec7512692c00d1788" target="_blank" rel="noopener noreferrer">Записатися на консультацію</a>
                    </Button>
                  </CardContent>
                </Card>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={resetTest}
                  >
                    <RotateCcw className="mr-2 w-4 h-4" />
                    Пройти тест знову
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/tests">
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Повернутися до тестів
                    </Link>
                  </Button>
                </div>

                {/* Disclaimer */}
                <div className="bg-muted rounded-xl p-6 space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground mb-1">🔒 Конфіденційність</p>
                      <p className="text-muted-foreground">
                        Ваші відповіді обробляються локально у вашому браузері. Ми не зберігаємо ваші результати без вашої згоди.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground mb-1">⚠️ Важливе застереження</p>
                      <p className="text-muted-foreground">
                        Цей тест призначений лише для інформаційних та освітніх цілей і не є медичною діагностикою. 
                        Результати не замінюють професійну консультацію психолога, психіатра або лікаря. 
                        Дефіцит нейромедіаторів може бути пов'язаний з різними медичними станами. 
                        Не приймайте жодних добавок або медикаментів без консультації з лікарем.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
      {stage === 'test' && <KeyboardHints hints={HINTS_SCALE(7)} />}
    </div>
  );
};

export default BrovermanTest;
