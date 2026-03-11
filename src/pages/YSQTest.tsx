import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, ArrowRight, RotateCcw, Download, AlertTriangle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import usePageSEO, { createTestJsonLd } from '@/hooks/usePageSEO';
import KeyboardHints from '@/components/KeyboardHints';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

// --- DATA ---

const questions = [
  { id: 1, category: "ED", text: "Здебільшого я не мав(ла) когось, хто був би готовий мене вислухати, зрозуміти мої почуття або справді звернути увагу на мої потреби." },
  { id: 19, category: "ED", text: "Глибоко в душі я відчуваю, що ніхто мене не знає по-справжньому і не розуміє." },
  { id: 37, category: "ED", text: "Я не відчуваю, що маю право просити інших про емоційну підтримку." },
  { id: 55, category: "ED", text: "Я завжди відчував(ла), що мені чогось не вистачає в житті, і я не можу це заповнити." },
  { id: 73, category: "ED", text: "Мене ніхто ніколи не любив так, як мені було потрібно." },
  { id: 2, category: "AB", text: "Я дуже боюся, що люди, яких я люблю, залишать мене." },
  { id: 20, category: "AB", text: "Я чіпляюся за близьких людей, бо боюся, що вони підуть." },
  { id: 38, category: "AB", text: "Навіть коли я з кимось близький(а), я відчуваю, що це не триватиме довго." },
  { id: 56, category: "AB", text: "Я часто переживаю, що партнери мене покинуть заради когось кращого." },
  { id: 74, category: "AB", text: "Люди завжди йдуть з мого життя в той момент, коли я їх найбільше потребую." },
  { id: 3, category: "MA", text: "Я вважаю, що більшість людей думають тільки про себе." },
  { id: 21, category: "MA", text: "Якщо я буду необачним(ою), люди цим скористаються." },
  { id: 39, category: "MA", text: "Я часто перевіряю мотиви інших людей; я їм не дуже довіряю." },
  { id: 57, category: "MA", text: "Значно безпечніше нікому не довіряти." },
  { id: 75, category: "MA", text: "Зазвичай я шукаю прихований мотив, коли люди роблять для мене щось хороше." },
  { id: 4, category: "DS", text: "Ніхто з тих, кого я люблю, не захотів би бути зі мною, якби знав про мої справжні недоліки." },
  { id: 22, category: "DS", text: "Я відчуваю, що в моїй сутності є щось фундаментально неправильне або дефективне." },
  { id: 40, category: "DS", text: "Якщо інші дізнаються, який я насправді, вони не зможуть мене прийняти." },
  { id: 58, category: "DS", text: "Я приховую своє справжнє 'я', тому що воно неприйнятне." },
  { id: 76, category: "DS", text: "Я часто відчуваю сором через те, ким я є." },
  { id: 5, category: "SI", text: "Я почуваюся чужим(ою) більшості людей." },
  { id: 23, category: "SI", text: "Я нікуди не вписуюся." },
  { id: 41, category: "SI", text: "Я відчуваю себе ізольованим(ою) і самотнім(ою), навіть якщо навколо є люди." },
  { id: 59, category: "SI", text: "Я не відчуваю приналежності до жодної групи чи спільноти." },
  { id: 77, category: "SI", text: "Я завжди був(ла) 'на узбіччі' в будь-якій компанії." },
  { id: 6, category: "DI", text: "Я не можу впоратися з повсякденними проблемами без допомоги." },
  { id: 24, category: "DI", text: "Я маю потребу в тому, щоб хтось показував мені, що і як робити." },
  { id: 42, category: "DI", text: "Мені дуже важко приймати рішення самостійно." },
  { id: 60, category: "DI", text: "Я вважаю, що інші набагато краще справляються з життям, ніж я." },
  { id: 78, category: "DI", text: "Я сумніваюся у своїх судженнях при вирішенні повсякденних справ." },
  { id: 7, category: "VH", text: "Я не можу позбутися відчуття, що ось-ось станеться щось жахливе." },
  { id: 25, category: "VH", text: "Я боюся, що можу захворіти на серйозну хворобу, навіть якщо лікар каже, що все добре." },
  { id: 43, category: "VH", text: "Мене непокоять страхи опинитися без грошей або стати безхатченком." },
  { id: 61, category: "VH", text: "Я часто думаю, що можу з'їхати з глузду або втратити контроль над собою." },
  { id: 79, category: "VH", text: "Здається, що світ – дуже небезпечне місце." },
  { id: 8, category: "EM", text: "Мені важко відокремити свої власні потреби та бажання від потреб близьких." },
  { id: 26, category: "EM", text: "Я відчуваю провину, коли намагаюся відокремитися від своїх батьків або партнера." },
  { id: 44, category: "EM", text: "Я переймаю погляди тих людей, з якими перебуваю поруч." },
  { id: 62, category: "EM", text: "Я часто відчуваю, що не маю власної ідентичності поза стосунками." },
  { id: 80, category: "EM", text: "Я дуже залучений(а) у проблеми та інтереси моїх батьків." },
  { id: 9, category: "FA", text: "Майже нічого з того, що я роблю на роботі чи навчанні, не дотягує до рівня інших." },
  { id: 27, category: "FA", text: "Я вірю, що врешті-решт зазнаю невдачі у всьому, за що беруся." },
  { id: 45, category: "FA", text: "Я не такий(а) розумний(а) або талановитий(а), як більшість моїх знайомих." },
  { id: 63, category: "FA", text: "Порівняно з іншими, я багато в чому зазнав(ла) поразки." },
  { id: 81, category: "FA", text: "Я відчуваю себе некомпетентним(ою), коли йдеться про кар'єру або досягнення." },
  { id: 10, category: "SU", text: "Я відмовляюся від своїх бажань, щоб задовольнити інших людей." },
  { id: 28, category: "SU", text: "Я роблю те, що хочуть інші, щоб вони на мене не злилися." },
  { id: 46, category: "SU", text: "Мені дуже складно вимагати дотримання моїх прав." },
  { id: 64, category: "SU", text: "Я краще дозволю іншим приймати рішення, ніж вступатиму в конфлікт." },
  { id: 82, category: "SU", text: "Я так багато роблю для інших, що не маю часу та енергії для себе." },
  { id: 11, category: "SS", text: "Моя місія – дбати про оточуючих, навіть якщо для цього доводиться жертвувати своїм комфортом." },
  { id: 29, category: "SS", text: "Я відчуваю себе хорошою людиною лише тоді, коли допомагаю іншим." },
  { id: 47, category: "SS", text: "Мені боляче, коли інші страждають, і я відчуваю обов'язок допомогти їм." },
  { id: 65, category: "SS", text: "Мене часто сприймають як людину, на яку завжди можна покластися." },
  { id: 83, category: "SS", text: "Мої власні потреби відходять на задній план порівняно з потребами інших." },
  { id: 12, category: "AS", text: "Мені потрібно, щоб мене всі любили і приймали." },
  { id: 30, category: "AS", text: "Моя самооцінка залежить від того, що про мене думають інші люди." },
  { id: 48, category: "AS", text: "Я наполегливо працюю над своєю зовнішністю та статусом, щоб вразити інших." },
  { id: 66, category: "AS", text: "Якщо на мене не звертають уваги або мене не хвалять, я відчуваю свою нікчемність." },
  { id: 84, category: "AS", text: "Я часто змінюю свою поведінку залежно від того, з ким спілкуюся, щоб сподобатися." },
  { id: 13, category: "NP", text: "Навіть якщо зараз все добре, я чекаю, що скоро все зіпсується." },
  { id: 31, category: "NP", text: "Я частіше схильний(а) помічати негативні аспекти ситуації, ігноруючи позитивні." },
  { id: 49, category: "NP", text: "Все хороше в житті врешті-решт руйнується." },
  { id: 67, category: "NP", text: "Я боюся, що найгірші з моїх передбачень збудуться." },
  { id: 85, category: "NP", text: "Я ретельно планую все, щоб уникнути катастрофи." },
  { id: 14, category: "EI", text: "Я тримаю свої почуття під контролем, щоб інші вважали мене раціональним." },
  { id: 32, category: "EI", text: "Мені важко бути теплим(ою) і спонтанним(ою) з іншими людьми." },
  { id: 50, category: "EI", text: "Я відчуваю себе ніяково, коли розмова заходить про почуття." },
  { id: 68, category: "EI", text: "Я можу контролювати свій гнів, щоб нікому не нашкодити." },
  { id: 86, category: "EI", text: "Я намагаюся завжди виглядати оптимістично і ніколи не показую смутку." },
  { id: 15, category: "US", text: "Я повинен(на) бути найкращим(ою) майже у всьому, що я роблю." },
  { id: 33, category: "US", text: "Мене рідко влаштовують результати моєї роботи, я завжди міг(ла) б краще." },
  { id: 51, category: "US", text: "Я відчуваю постійний тиск у необхідності досягати більшого." },
  { id: 69, category: "US", text: "Моє життя — це безперервний список справ, які потрібно виконати." },
  { id: 87, category: "US", text: "Я дуже суворо суджу себе і свої помилки." },
  { id: 16, category: "ET", text: "Я вважаю, що мені не слід підкорятися звичайним правилам або обмеженням." },
  { id: 34, category: "ET", text: "Я маю право отримувати те, що хочу і коли хочу." },
  { id: 52, category: "ET", text: "Мене дратує, коли інші люди кажуть мені, що я не можу мати те, що хочу." },
  { id: 70, category: "ET", text: "Зазвичай я ставлю свої інтереси вище за інтереси інших." },
  { id: 88, category: "ET", text: "Я вважаю себе особливою людиною." },
  { id: 17, category: "IS", text: "Я не можу змусити себе виконувати рутинні та нудні справи." },
  { id: 35, category: "IS", text: "Коли я відчуваю сильні емоції, я не можу їх контролювати." },
  { id: 53, category: "IS", text: "Я легко здаюся, якщо завдання здається занадто складним." },
  { id: 71, category: "IS", text: "Я часто дію імпульсивно, про що потім шкодую." },
  { id: 89, category: "IS", text: "Мені складно відмовляти собі в моментальних задоволеннях." },
  { id: 18, category: "PU", text: "За помилки потрібно карати — як мене, так і інших." },
  { id: 36, category: "PU", text: "Якби я не стримував(ла) себе, я був(ла) би дуже злим(ою) на багатьох людей." },
  { id: 54, category: "PU", text: "Я не визнаю виправдань: якщо людина зробила щось погане, вона повинна за це відповісти." },
  { id: 72, category: "PU", text: "Я часто буваю нетерпимим(ою) до помилок інших людей." },
  { id: 90, category: "PU", text: "Я вважаю, що я заслуговую на покарання за те, що я зробив(ла) не так." },
];

type SchemaKey = 'ED' | 'AB' | 'MA' | 'DS' | 'SI' | 'DI' | 'VH' | 'EM' | 'FA' | 'SU' | 'SS' | 'AS' | 'NP' | 'EI' | 'US' | 'ET' | 'IS' | 'PU';

const schemaKeys: SchemaKey[] = ['ED', 'AB', 'MA', 'DS', 'SI', 'DI', 'VH', 'EM', 'FA', 'SU', 'SS', 'AS', 'NP', 'EI', 'US', 'ET', 'IS', 'PU'];

const schemaNames: Record<SchemaKey, string> = {
  ED: "Емоційна депривація",
  AB: "Покинутість / Нестабільність",
  MA: "Недовіра / Очікування жорстокого поводження",
  DS: "Дефективність / Сором",
  SI: "Соціальна ізоляція / Відчуження",
  DI: "Залежність / Некомпетентність",
  VH: "Вразливість до шкоди та хвороб",
  EM: "Злиття / Нерозвинене Я",
  FA: "Неуспішність",
  SU: "Покірність",
  SS: "Самопожертва",
  AS: "Пошук схвалення та визнання",
  NP: "Негативізм / Песимізм",
  EI: "Емоційне пригнічення",
  US: "Жорсткі стандарти / Гіперкритичність",
  ET: "Грандіозність / Привілейованість",
  IS: "Недостатній самоконтроль",
  PU: "Каральність (Пунітивність)",
};

const schemaDescriptions: Record<SchemaKey, string> = {
  ED: "Ви відчуваєте, що ваші емоційні потреби — у теплі, увазі, розумінні та близькості — систематично не задовольняються. Це може проявлятися як відчуття порожнечі, самотності навіть у стосунках, труднощі з проханням про підтримку. Часто формується в дитинстві, коли батьки були емоційно холодними або недоступними.",
  AB: "Ви живете з постійним страхом, що близькі люди вас покинуть, зникнуть або замінять кимось іншим. Це може проявлятися як ревнощі, тривожна прив'язаність, потреба в постійних запевненнях у коханні. Схема часто формується через нестабільність значущих фігур у дитинстві — розлучення, втрати, непередбачувану поведінку батьків.",
  MA: "Ви очікуєте, що інші люди будуть вас використовувати, обманювати, маніпулювати або завдавати шкоди. Це проявляється як підозріливість, труднощі з довірою, постійний пошук прихованих мотивів. Схема зазвичай формується через досвід жорстокого поводження, зради або зловживання в ранньому віці.",
  DS: "Ви відчуваєте себе дефективним(ою), неповноцінним(ою) або недостойним(ою) любові у своїй основі. Це глибоке переконання, що з вами щось фундаментально не так, і якщо інші побачать справжнього вас — вони відвернуться. Проявляється як сором, приховування себе, уникання близькості.",
  SI: "Ви відчуваєте себе ізольованим(ою) від решти світу, не належите жодній групі чи спільноті. Це відчуття «чужого серед своїх», неможливість вписатися. Схема часто формується, коли дитина росла в середовищі, де відрізнялася від оточення або була виключена з соціальних груп.",
  DI: "Ви вірите, що не здатні впоратися з повсякденним життям без допомоги інших. Це проявляється як нерішучість, потреба в підтримці при прийнятті рішень, відчуття безпорадності. Схема формується, коли батьки надмірно опікали дитину або підривали її впевненість у власних здібностях.",
  VH: "Ви живете в постійному очікуванні катастрофи — хвороби, фінансового краху, нещасного випадку чи втрати контролю. Тривога за безпеку домінує над повсякденним життям. Схема часто формується в сім'ях, де батьки самі були надмірно тривожними або де дитина пережила травматичні події.",
  EM: "Вам важко відокремити себе від значущих людей — батьків чи партнера. Ваші потреби, бажання та ідентичність зливаються з їхніми. Це може проявлятися як відсутність власних цілей, почуття провини за самостійність, відчуття порожнечі без іншої людини поруч.",
  FA: "Ви глибоко переконані, що зазнаєте невдачі в усьому, за що беретеся, порівняно з іншими. Це проявляється як знецінення своїх досягнень, відчуття некомпетентності, уникання нових викликів. Схема часто формується через критику, порівняння з іншими або відсутність підтримки досягнень у дитинстві.",
  SU: "Ви систематично підкоряєте свої потреби, бажання та рішення іншим людям — через страх конфлікту, покарання або відкидання. Це проявляється як пасивність, невміння відстоювати свої межі, накопичення гніву та образ. Схема формується в авторитарних сім'ях або там, де прояв волі каралися.",
  SS: "Ви надмірно зосереджені на задоволенні потреб інших за рахунок власних. Це може виглядати як «синдром рятівника» — постійна допомога, жертовність, відчуття відповідальності за чужі емоції. Схема формується, коли дитина мусила піклуватися про емоційно нестабільних батьків або заслуговувати любов через турботу.",
  AS: "Ваша самооцінка та відчуття цінності залежать від визнання, уваги та схвалення інших людей. Ви можете підлаштовувати свою поведінку, зовнішність чи досягнення під очікування оточення. Схема формується, коли любов батьків була умовною — залежала від успіхів, поведінки чи відповідності їхнім стандартам.",
  NP: "Ви фокусуєтеся на негативних аспектах життя, очікуєте найгіршого та знецінюєте позитивне. Це хронічний песимізм, що проявляється як тривожне планування, катастрофізація та нездатність насолоджуватися моментом. Схема часто формується через досвід численних втрат або в середовищі постійної критики.",
  EI: "Ви придушуєте свої емоції, спонтанність та вразливість, вважаючи їх ознакою слабкості або загрозою. Це проявляється як надмірний контроль, «замороженість» почуттів, труднощі з теплотою та інтимністю. Схема формується в сім'ях, де емоції висміювалися, ігнорувалися або каралися.",
  US: "Ви встановлюєте для себе нереалістично високі стандарти й постійно відчуваєте тиск відповідати їм. Це проявляється як перфекціонізм, самокритика, хронічне незадоволення результатами, трудоголізм. Схема формується, коли батьки цінували лише досягнення або коли любов була «платою» за бездоганність.",
  ET: "Ви вважаєте себе особливим(ою), вищим(ою) за інших, і вірите, що маєте право на привілеї та виключення з правил. Це може проявлятися як нетерпимість до обмежень, конкурентність, труднощі зі співпереживанням. Схема формується через надмірну вседозволеність або ідеалізацію дитини батьками.",
  IS: "Вам важко контролювати імпульси, витримувати рутину та відкладати задоволення заради довгострокових цілей. Це проявляється як прокрастинація, емоційні спалахи, труднощі з дисципліною. Схема формується, коли батьки не встановлювали чітких меж або не навчили дитину самоконтролю.",
  PU: "Ви схильні суворо карати себе та інших за помилки, не залишаючи простору для прощення чи розуміння. Це проявляється як жорсткість, нетерпимість, гнів до порушників правил, самопокарання. Схема формується в суворих, караючих сім'ях, де помилки не прощалися.",
};

const responseOptions = [
  { value: 1, label: "Зовсім не про мене" },
  { value: 2, label: "Здебільшого не про мене" },
  { value: 3, label: "Більш правдиво, ніж ні" },
  { value: 4, label: "Помірно про мене" },
  { value: 5, label: "Здебільшого про мене" },
  { value: 6, label: "Ідеально описує мене" },
];

const THRESHOLD = 15;
const MAX_SCORE = 30;

const schemaColors: Record<SchemaKey, string> = {
  ED: "hsl(210, 35%, 40%)",
  AB: "hsl(0, 40%, 45%)",
  MA: "hsl(25, 50%, 42%)",
  DS: "hsl(280, 30%, 45%)",
  SI: "hsl(220, 30%, 50%)",
  DI: "hsl(45, 50%, 40%)",
  VH: "hsl(350, 40%, 45%)",
  EM: "hsl(190, 40%, 38%)",
  FA: "hsl(260, 25%, 48%)",
  SU: "hsl(168, 40%, 35%)",
  SS: "hsl(28, 55%, 40%)",
  AS: "hsl(300, 25%, 45%)",
  NP: "hsl(200, 30%, 42%)",
  EI: "hsl(240, 20%, 50%)",
  US: "hsl(15, 50%, 45%)",
  ET: "hsl(38, 60%, 45%)",
  IS: "hsl(340, 35%, 45%)",
  PU: "hsl(0, 50%, 40%)",
};

const HINTS = [
  { keys: ['1', '6'], label: 'обрати' },
  { keys: ['↑', '↓'], label: 'змінити' },
  { keys: ['Enter'], label: 'далі' },
  { keys: ['←'], label: 'назад' },
];

// --- COMPONENT ---

const YSQTest = () => {
  usePageSEO({
    title: 'Тест YSQ-S3 онлайн — Опитувальник ранніх дезадаптивних схем Янга українською',
    description: 'Пройдіть тест YSQ-S3 (90 питань) онлайн безкоштовно українською. Визначте 18 ранніх дезадаптивних схем за методикою Джеффрі Янга. Діагностика глибинних переконань зі схема-терапії з миттєвим результатом.',
    canonical: 'https://myrhorodskyi.com/tests/opytuvalnyk-rannih-shem-ysq',
    keywords: 'YSQ-S3 тест онлайн, опитувальник Янга українською, ранні дезадаптивні схеми тест безкоштовно, схема-терапія тест онлайн, Young Schema Questionnaire українською, тест схем Янга, опитувальник ранніх схем, YSQ тест пройти, дезадаптивні схеми діагностика',
    ogImage: 'https://myrhorodskyi.com/og-image.jpg',
    jsonLd: createTestJsonLd({
      name: 'Тест YSQ-S3 — Опитувальник ранніх дезадаптивних схем Янга',
      description: 'Пройдіть тест YSQ-S3 (90 питань) онлайн безкоштовно українською. Визначте 18 ранніх дезадаптивних схем за методикою Джеффрі Янга зі схема-терапії.',
      url: 'https://myrhorodskyi.com/tests/opytuvalnyk-rannih-shem-ysq',
      questionCount: 90,
      duration: 'PT20M',
    }),
  });

  const [stage, setStage] = useState<'intro' | 'test' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<(number | null)[]>(new Array(90).fill(null));
  const pdfRef = useRef<HTMLDivElement>(null);

  const answeredCount = responses.filter(r => r !== null).length;
  const progress = (answeredCount / questions.length) * 100;

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

  const goNext = useCallback(() => {
    if (responses[currentQuestion] === null) return;
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  }, [currentQuestion, responses]);

  const calculateResults = useCallback(() => {
    const scores: Record<SchemaKey, number> = {} as any;
    const highCounts: Record<SchemaKey, number> = {} as any;
    schemaKeys.forEach(k => { scores[k] = 0; highCounts[k] = 0; });

    questions.forEach((q, i) => {
      const val = responses[i];
      if (val !== null) {
        scores[q.category as SchemaKey] += val;
        if (val >= 5) highCounts[q.category as SchemaKey]++;
      }
    });

    return schemaKeys.map(key => ({
      key,
      name: schemaNames[key],
      score: scores[key],
      percentage: Math.round((scores[key] / MAX_SCORE) * 100),
      highCount: highCounts[key],
      isActive: scores[key] >= THRESHOLD,
    })).sort((a, b) => b.score - a.score);
  }, [responses]);

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
    setResponses(new Array(90).fill(null));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exportPDF = async () => {
    if (!pdfRef.current) return;
    const html2pdf = (await import('html2pdf.js')).default;
    (html2pdf() as any)
      .set({
        margin: [10, 8, 10, 8],
        filename: 'YSQ-S3-Результати.pdf',
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      })
      .from(pdfRef.current)
      .save();
  };

  // Keyboard navigation
  useEffect(() => {
    if (stage !== 'test') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case '1': case '2': case '3': case '4': case '5': case '6': {
          e.preventDefault();
          handleResponse(parseInt(e.key));
          break;
        }
        case 'Enter': {
          e.preventDefault();
          if (currentQuestion === questions.length - 1 && responses[currentQuestion] !== null) submitTest();
          else goNext();
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
          const next = cur === null ? 1 : Math.min(cur + 1, 6);
          handleResponse(next);
          break;
        }
        case 'ArrowLeft':
        case 'ArrowUp': {
          e.preventDefault();
          const cur2 = responses[currentQuestion];
          const prev = cur2 === null ? 6 : Math.max(cur2 - 1, 1);
          handleResponse(prev);
          break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, currentQuestion, responses, handleResponse, goNext]);

  const results = calculateResults();
  const top3 = results.slice(0, 3);
  const activeSchemas = results.filter(r => r.isActive);

  const chartData = results.map(r => ({
    name: r.key,
    fullName: r.name,
    score: r.score,
    fill: r.isActive ? schemaColors[r.key as SchemaKey] : 'hsl(var(--muted-foreground) / 0.3)',
  }));

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
              <FileText className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Опитувальник Ранніх Дезадаптивних Схем (YSQ-S3)
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Глибинна діагностика ваших глибинних переконань та життєвих сценаріїв
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
                        Опитувальник Ранніх Дезадаптивних Схем
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Цей тест складається з 90 тверджень. Будь ласка, прочитайте кожне з них і оцініть, наскільки воно добре описує вас. Намагайтеся згадати, як ви почувалися більшу частину свого життя, а не лише зараз. Тест займе близько 15-20 хвилин.
                      </p>
                    </div>

                    {/* Scale explanation */}
                    <div className="bg-muted/60 rounded-xl p-6 border border-border/50">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-4">Шкала оцінювання</h3>
                      <div className="grid gap-2">
                        {responseOptions.map(opt => (
                          <div key={opt.value} className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center shrink-0">
                              {opt.value}
                            </span>
                            <span className="text-sm text-muted-foreground">{opt.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <FileText className="w-5 h-5 shrink-0" />
                      <span>90 тверджень · ~15-20 хвилин · 18 шкал</span>
                    </div>

                    <Button onClick={startTest} variant="cta" size="xl" className="w-full">
                      Почати діагностику
                      <ArrowRight className="w-5 h-5 ml-2" />
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
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Progress */}
                <div className="sticky top-20 z-30 bg-background/95 backdrop-blur-sm py-4 -mx-4 px-4 border-b border-border/30">
                  <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
                    <span>Запитання {currentQuestion + 1} з {questions.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Question */}
                <Card className="border-border shadow-md overflow-hidden">
                  <CardContent className="p-8 md:p-10">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed mb-8">
                          {questions[currentQuestion].text}
                        </p>

                        <div className="grid gap-3">
                          {responseOptions.map(opt => (
                            <button
                              key={opt.value}
                              onClick={() => handleResponse(opt.value)}
                              className={cn(
                                "w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200",
                                "hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm",
                                "focus:outline-none focus:ring-2 focus:ring-ring",
                                responses[currentQuestion] === opt.value
                                  ? "border-primary bg-primary/10 shadow-sm"
                                  : "border-border/60 bg-card"
                              )}
                            >
                              <span className="flex items-center gap-4">
                                <span className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold shrink-0 transition-colors",
                                  responses[currentQuestion] === opt.value
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                )}>
                                  {opt.value}
                                </span>
                                <span className="text-sm md:text-base text-foreground">{opt.label}</span>
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex justify-between items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Назад
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
                      variant="ghost"
                      onClick={goNext}
                      disabled={responses[currentQuestion] === null}
                    >
                      Далі
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>

                <KeyboardHints hints={HINTS} />
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
                {/* Action buttons */}
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <Button variant="outline" onClick={resetTest}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Пройти знову
                  </Button>
                  <Button variant="cta" onClick={exportPDF}>
                    <Download className="w-4 h-4 mr-2" />
                    Завантажити звіт (PDF)
                  </Button>
                </div>

                {/* PDF Content */}
                <div ref={pdfRef} id="pdf-content" className="space-y-8">
                  {/* Header */}
                  <div className="text-center space-y-2">
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      Повний Профіль Ваших Схем
                    </h2>
                    <p className="text-muted-foreground">Результати опитувальника YSQ-S3 · {new Date().toLocaleDateString('uk-UA')}</p>
                  </div>

                  {/* Top 3 highlight */}
                  <Card className="border-2 border-secondary/30 bg-secondary/5 shadow-md">
                    <CardContent className="p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-5 h-5 text-secondary" />
                        <h3 className="font-display text-lg font-semibold text-foreground">Ваші провідні схеми</h3>
                      </div>
                      <div className="grid gap-3">
                        {top3.map((s, i) => (
                          <div key={s.key} className="flex items-center justify-between gap-4 py-2 border-b border-border/30 last:border-0">
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-full bg-secondary/20 text-secondary font-bold text-sm flex items-center justify-center">
                                {i + 1}
                              </span>
                              <span className="font-medium text-foreground text-sm md:text-base">{s.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground">{s.score}/{MAX_SCORE}</span>
                              <span className="text-xs text-muted-foreground">({s.percentage}%)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Chart */}
                  <Card className="border-border shadow-md">
                    <CardContent className="p-4 md:p-6">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-4 text-center">
                        Профіль дезадаптивних схем
                      </h3>
                      <div className="w-full" style={{ height: Math.max(500, results.length * 32) }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 5, right: 40, left: 5, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                            <XAxis
                              type="number"
                              domain={[0, MAX_SCORE]}
                              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                            />
                            <YAxis
                              type="category"
                              dataKey="name"
                              width={36}
                              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                            />
                            <Tooltip
                              formatter={(value: number, _name: string, props: any) => [
                                `${value}/${MAX_SCORE} (${Math.round((value / MAX_SCORE) * 100)}%)`,
                                props.payload.fullName
                              ]}
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '0.75rem',
                                fontSize: '13px',
                              }}
                            />
                            <ReferenceLine
                              x={THRESHOLD}
                              stroke="hsl(var(--destructive))"
                              strokeDasharray="6 4"
                              strokeWidth={1.5}
                              label={{
                                value: "Поріг = 15",
                                position: "top",
                                fill: "hsl(var(--destructive))",
                                fontSize: 11,
                              }}
                            />
                            <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={20}>
                              {chartData.map((entry, index) => (
                                <Cell key={index} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Table */}
                  <Card className="border-border shadow-md overflow-hidden">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead className="font-semibold">Схема</TableHead>
                              <TableHead className="text-center font-semibold">Абр.</TableHead>
                              <TableHead className="text-center font-semibold">Бал</TableHead>
                              <TableHead className="text-center font-semibold">%</TableHead>
                              <TableHead className="text-center font-semibold">К-ть '5-6'</TableHead>
                              <TableHead className="text-center font-semibold">Статус</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {results.map((r) => (
                              <TableRow
                                key={r.key}
                                className={cn(r.isActive && "bg-destructive/5 font-medium")}
                              >
                                <TableCell className="text-sm">{r.name}</TableCell>
                                <TableCell className="text-center text-sm font-mono">{r.key}</TableCell>
                                <TableCell className="text-center text-sm">{r.score}/{MAX_SCORE}</TableCell>
                                <TableCell className="text-center text-sm">{r.percentage}%</TableCell>
                                <TableCell className="text-center text-sm">{r.highCount}</TableCell>
                                <TableCell className="text-center text-sm whitespace-nowrap">
                                  {r.isActive ? "🔥 Виражена" : "✅ В межах норми"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Detailed descriptions for active schemas */}
                  {activeSchemas.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-display text-xl font-semibold text-foreground">
                        Детальний опис виражених схем
                      </h3>
                      <Accordion type="multiple" className="space-y-3">
                        {activeSchemas.map(s => (
                          <AccordionItem key={s.key} value={s.key} className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
                            <AccordionTrigger className="px-6 py-4 hover:bg-muted/30 hover:no-underline">
                              <div className="flex items-center gap-3 text-left">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: schemaColors[s.key as SchemaKey] }} />
                                <span className="font-display font-semibold text-foreground">{s.name}</span>
                                <span className="text-xs text-muted-foreground ml-auto mr-2">{s.score}/{MAX_SCORE}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-5">
                              <p className="text-muted-foreground leading-relaxed">
                                {schemaDescriptions[s.key as SchemaKey]}
                              </p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  )}
                </div>

                {/* CTA - outside PDF */}
                <Card className="border-2 border-primary/20 bg-primary/5 shadow-lg">
                  <CardContent className="p-8 md:p-10 text-center space-y-5">
                    <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground">
                      Робота зі схемами — це глибокий психотерапевтичний процес
                    </h3>
                    <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
                      Запишіться на консультацію, щоб розібрати ваш профіль зі спеціалістом.
                    </p>
                    <Button variant="cta" size="xl" asChild>
                      <a href="https://t.me/SigurdPSYBot?start=64f8747ec7512692c00d1788" target="_blank" rel="noopener noreferrer">
                        Записатися
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default YSQTest;
