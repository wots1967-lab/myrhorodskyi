import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Download, RotateCcw, Compass, LifeBuoy } from 'lucide-react';
import { cn } from '@/lib/utils';
import usePageSEO from '@/hooks/usePageSEO';
import { useTestResultSaver } from '@/hooks/useTestResultSaver';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from 'recharts';

// --- QUESTIONS ---
type ScaleCode = 'SENS' | 'PRES' | 'SRCH' | 'SD' | 'ST' | 'FR' | 'RESP' | 'VAL' | 'VIT';

const questions: Array<{ id: number; scale: ScaleCode; reversed: boolean; text: string }> = [
  { id: 1, scale: 'SENS', reversed: false, text: 'Я відчуваю, що моє життя має сенс.' },
  { id: 2, scale: 'SD', reversed: false, text: 'Я можу подивитися на свою ситуацію збоку, навіть коли емоції сильні.' },
  { id: 3, scale: 'SRCH', reversed: false, text: 'Я зараз активно шукаю те, що зробило б моє життя більш осмисленим.' },
  { id: 4, scale: 'ST', reversed: false, text: 'Мене легко торкають краса, музика, природа чи інші люди.' },
  { id: 5, scale: 'FR', reversed: false, text: 'У більшості ситуацій я бачу кілька можливостей і можу обирати.' },
  { id: 6, scale: 'VAL', reversed: false, text: 'Я маю чітке уявлення про те, яким хочу бачити своє життя.' },
  { id: 7, scale: 'RESP', reversed: false, text: 'Якщо я щось вирішив(-ла), я доводжу це до кінця.' },
  { id: 8, scale: 'VIT', reversed: false, text: 'Я дивлюся у своє майбутнє з інтересом і надією.' },
  { id: 9, scale: 'PRES', reversed: false, text: 'Я добре розумію, що робить моє життя значущим.' },
  { id: 10, scale: 'SENS', reversed: true, text: 'Моє повсякденне життя здається мені порожнім і одноманітним.' },
  { id: 11, scale: 'SD', reversed: true, text: 'Мої тривоги й думки часто настільки захоплюють мене, що я не бачу ситуації ясно.' },
  { id: 12, scale: 'ST', reversed: false, text: 'Я відчуваю, що для мене справді важливе, і воно відгукується в мені емоційно.' },
  { id: 13, scale: 'FR', reversed: true, text: 'Мені важко ухвалювати рішення — я часто вагаюся або відкладаю їх.' },
  { id: 14, scale: 'SRCH', reversed: false, text: 'Я багато розмірковую про своє призначення.' },
  { id: 15, scale: 'RESP', reversed: false, text: 'Я готовий(-а) відповідати за наслідки своїх рішень.' },
  { id: 16, scale: 'VAL', reversed: false, text: 'Те, як я живу щодня, відповідає моїм цінностям.' },
  { id: 17, scale: 'VIT', reversed: true, text: 'Буває, мені здається, що моє життя ні для кого й ні для чого не має значення.' },
  { id: 18, scale: 'PRES', reversed: false, text: 'Я знайшов(-ла) справи, які наповнюють моє життя сенсом.' },
  { id: 19, scale: 'SENS', reversed: false, text: 'У мене є цілі, заради яких хочеться прокидатися вранці.' },
  { id: 20, scale: 'SD', reversed: false, text: 'Перш ніж діяти, я зазвичай можу спокійно зважити, що відбувається насправді.' },
  { id: 21, scale: 'ST', reversed: true, text: 'Мені буває важко відчути, що щось мене по-справжньому зворушує.' },
  { id: 22, scale: 'FR', reversed: false, text: 'Я відчуваю, що моє життя визначаю я, а не обставини.' },
  { id: 23, scale: 'RESP', reversed: true, text: 'Я часто живу «як вийде», не беручи життя у свої руки.' },
  { id: 24, scale: 'SRCH', reversed: false, text: 'Я перебуваю в пошуку нового розуміння себе і свого життя.' },
  { id: 25, scale: 'VAL', reversed: true, text: 'Я відчуваю розрив між тим, як живу, і тим, що для мене справді важливо.' },
  { id: 26, scale: 'VIT', reversed: true, text: 'Вільний час частіше приносить мені відчуття порожнечі, ніж радості.' },
  { id: 27, scale: 'PRES', reversed: true, text: 'Мені важко назвати, що саме надає моєму життю сенсу.' },
  { id: 28, scale: 'SENS', reversed: false, text: 'Озираючись на своє життя зараз, я можу сказати, що воно варте того, щоб його прожити.' },
  { id: 29, scale: 'SD', reversed: false, text: 'Мені вдається відрізняти факти від моїх страхів і припущень щодо них.' },
  { id: 30, scale: 'ST', reversed: false, text: 'Я можу щиро співпереживати іншим і радіти за них.' },
  { id: 31, scale: 'FR', reversed: false, text: 'Навіть у скрутних обставинах я знаходжу те, на що можу вплинути.' },
  { id: 32, scale: 'RESP', reversed: true, text: 'Я уникаю рішень, сподіваючись, що все вирішиться само собою.' },
  { id: 33, scale: 'SRCH', reversed: false, text: 'Останнім часом я переглядаю те, що раніше здавалося мені важливим.' },
  { id: 34, scale: 'VAL', reversed: false, text: 'По суті моє життя складається так, як мені хочеться, — навіть якщо не в деталях.' },
  { id: 35, scale: 'SENS', reversed: true, text: 'Я часто ловлю себе на думці: «Не розумію, навіщо все це».' },
  { id: 36, scale: 'VIT', reversed: true, text: 'Останнім часом я відчуваю втому від життя — ніби сили жити закінчуються.' },
  { id: 37, scale: 'PRES', reversed: false, text: 'У моєму житті є те, заради чого я готовий(-а) долати труднощі.' },
  { id: 38, scale: 'SENS', reversed: false, text: 'Навіть у складні періоди я відчуваю, що рухаюся у важливому для мене напрямку.' },
];

const scaleNames: Record<ScaleCode, string> = {
  SENS: 'Сенс і наповненість',
  PRES: 'Присутність сенсу',
  SRCH: 'Пошук сенсу',
  SD: 'Самодистанціювання',
  ST: 'Самотрансценденція',
  FR: 'Свобода',
  RESP: 'Відповідальність',
  VAL: 'Життя у згоді з цінностями',
  VIT: 'Життєва наснага та перспектива',
};

const sources = [
  'Близькі стосунки та любов',
  'Родина і турбота про близьких',
  'Творчість і самовираження',
  'Духовність або віра',
  'Особистісний розвиток',
  'Досягнення та успіх',
  'Робота чи покликання',
  'Природа',
  'Допомога іншим, служіння',
  'Спільнота і належність',
  'Традиції та культура',
  'Пізнання і навчання',
  "Тіло, здоров'я, вітальність",
  'Свобода і незалежність',
  'Задоволення і радість життя',
  'Гармонія і внутрішній спокій',
];

// Question pagination: 5,5,5,5,5,5,4,4 = 6 screens of 5 + 2 screens of 4 = 38
const qPageSizes = [5, 5, 5, 5, 5, 5, 4, 4];
// Sources pagination: 2 screens x 8
const srcPageSizes = [8, 8];

// --- SCALE INTERPRETATIONS ---
type Band = 'low' | 'mid' | 'high';
const scaleInterp: Record<ScaleCode, Record<Band, string>> = {
  SENS: {
    low: "Відчуття сенсу зараз ослаблене. У щоденному житті це часто проявляється як порожнеча на тлі зовнішнього «все нормально», механічне виконання справ і питання «навіщо все це», яке з'являється дедалі частіше. Важливо: це стан, а не риса характеру — сенс не зникає назавжди, з ним втрачається контакт. Екзистенційна терапія працює саме з відновленням цього контакту: не «придумати» сенс, а знову почати його відчувати. Перший крок — помічати моменти, коли хоч щось відгукується, навіть дрібне.",
    mid: "Сенс присутній, але нерівномірно: одні сфери живі, інші відчуваються формальними чи порожніми. Так часто буває, коли життя «розігналося» навколо обов'язків, а те, що справді наповнює, лишилося на периферії. Варто чесно подивитися, де саме порожньо — у роботі, стосунках, побуті. Це не привід ламати життя, а запрошення повернути наповнені сфери ближче до центру.",
    high: "Ви переживаєте життя як осмислене: є заради чого прокидатися, і навіть труднощі вбудовуються в більшу картину. Така внутрішня наповненість — найкращий захист від виснаження та криз. Підтримуйте її свідомо: сенс живе в конкретних справах і стосунках, а не в абстракціях.",
  },
  PRES: {
    low: "Вам зараз важко назвати, що саме робить життя значущим. Це може переживатися як розгубленість або тиха тривога «я щось пропускаю». Хороша новина: неможливість назвати сенс не означає його відсутності — часто він є, але не сформульований. Допомагає проста практика: наприкінці дня занотовувати один момент, який відчувався справжнім. За кілька тижнів із цих моментів проступає відповідь.",
    mid: "Часткове розуміння того, що надає життю значення, у вас є, але картина ще нечітка або нестійка: сьогодні відповідь очевидна, завтра сумнівна. Це нормальний робочий стан, особливо в періоди змін. Таку відповідь варто уточнювати в діалозі — з собою, близькими або терапевтом.",
    high: "Ви ясно розумієте, що наповнює ваше життя сенсом, і можете спиратися на це в рішеннях. Така ясність — рідкісний ресурс: вона дає критерій, за яким легко відрізняти «своє» від «чужого».",
  },
  SRCH: {
    low: "Активного пошуку сенсу зараз немає. Якщо сенс при цьому присутній (див. шкалу «Присутність сенсу») — це стабільність, і її не треба «лікувати». Якщо ж сенсу бракує, а пошуку немає — можливо, на нього просто не залишається сил або питання ще не визріло. Тоді починати варто не з «великих питань», а з відновлення ресурсу.",
    mid: "Питання сенсу періодично постають перед вами — це природний фон дорослого життя, особливо на переходах: зміна роботи, стосунків, віку. Такі питання не потребують негайних відповідей; важливо лише не відмахуватися від них.",
    high: "Ви в активному пошуку: багато думаєте про призначення, переглядаєте колишні орієнтири. Важливо: сам по собі інтенсивний пошук не є проблемою. У поєднанні з наявним сенсом це рух углиб; у поєднанні з порожнечею — чесна відповідь психіки на те, що старі відповіді вже не працюють. У другому випадку пошук іде значно легше з супроводом, ніж на самоті.",
  },
  SD: {
    low: "Емоції та думки зараз легко захоплюють вас цілком: у сильному переживанні важко відступити на крок і побачити ситуацію ясно. У житті це проявляється як імпульсивні реакції, накручування, рішення «на емоціях», про які потім шкодуєте. Ця здатність добре тренується: пауза перед реакцією, питання «що тут факт, а що — мій страх?», погляд на ситуацію очима стороннього. В екзистенційному аналізі це базова навичка, з якої часто починається робота.",
    mid: "У спокійному стані ви бачите ситуації тверезо, але сильні емоції ще «змивають» дистанцію. Зверніть увагу, в яких саме темах це стається найчастіше — зазвичай там, де зачеплене щось особливо важливе для вас.",
    high: "Ви вмієте відступити від власних емоцій і подивитися на ситуацію ззовні, не втрачаючи контакту з собою. Це дає ясність у складних рішеннях і захищає від імпульсивних дій. Стежте лише, щоб дистанціювання не перетворювалося на відстороненість від почуттів.",
  },
  ST: {
    low: "Емоційний контакт зі світом зараз приглушений: важко відчути, що торкає, зворушує, має цінність. Найчастіше це не «черствість», а наслідок тривалого стресу чи виснаження — психіка «вимикає звук», щоб зекономити сили. Чутливість повертається поступово: через тіло, природу, музику, живе спілкування — те, що не вимагає зусиль, а просто дозволяє відчувати. Якщо приглушеність тримається довго і стосується всього, варто обговорити це з фахівцем.",
    mid: "Ви відчуваєте, що для вас цінне, але контакт із почуттями нерівний: щось відгукується жваво, щось — ніби крізь скло. Помічайте, що саме торкає вас найбільше, — це прямі вказівки на ваші цінності.",
    high: "Ви емоційно відкриті: краса, люди, справи відгукуються у вас живо, ви здатні співпереживати й захоплюватися. За Франклом, саме така спрямованість за межі себе — до людей і справ — і є головним джерелом сенсу. Це ваша сильна сторона.",
  },
  FR: {
    low: "Зараз вам важко бачити простір вибору: обставини здаються сильнішими, рішення відкладаються або даються болісно. Часто за цим стоїть не слабкість, а страх помилки чи звичка чекати «правильного» варіанта. Свобода тренується з малого: щодня помічати хоча б одне місце, де вибір усе-таки є — навіть якщо це вибір ставлення, а не обставин. Саме з цього починав Франкл.",
    mid: "У багатьох ситуаціях ви бачите можливості, але часом застрягаєте у ваганнях або в думці «варіантів немає». Корисно розрізняти: справді немає вибору — чи вибір є, але кожен варіант чогось коштує? Друге — це вже свобода.",
    high: "Ви відчуваєте себе автором свого життя: бачите можливості, зважуєте, обираєте. Внутрішня свобода такого рівня дозволяє не застрягати в ролі жертви обставин навіть у складні часи.",
  },
  RESP: {
    low: "Рішення зараз частіше відкладаються або «зависають»: розпочате не завершується, життя йде радше «як вийде». Важливо не плутати це з лінню — найчастіше так проявляється втрачений контакт із власним «навіщо»: коли незрозуміло, заради чого, воля не вмикається. Тому працювати варто не із самодисципліною, а з поверненням до того, що для вас справді важливе, — тоді відповідальність з'являється природно.",
    mid: "Ви здатні брати відповідальність, але не все важливе доводиться до кінця. Подивіться, що саме «провисає»: часто це справи, які насправді не ваші — взяті з обов'язку чи чужих очікувань.",
    high: "Ваші рішення стають діями: ви стоїте за тим, що обрали, і приймаєте наслідки. В екзистенційному аналізі це осердя автентичного життя — коли «так» і «ні» людини мають вагу. Стежте лише за балансом: відповідальність за все і всіх — це вже перевантаження, а не чеснота.",
  },
  VAL: {
    low: "Між тим, як ви живете, і тим, що для вас важливо, відчувається розрив. Зазвичай він переживається як хронічна втома, роздратування «на рівному місці», відчуття чужого життя або не своєї ролі. Розрив не долається одним стрибком: почніть з інвентаризації — які три цінності для вас головні і скільки місця вони реально займають у вашому тижні. Різниця між відповідями і є картою роботи.",
    mid: "Частина життя узгоджена з вашими цінностями, частина — ні. Це типовий стан, але він забирає енергію: там, де живеш не своє, доводиться постійно «доплачувати» зусиллям. Визначте одну сферу з найбільшим розходженням і почніть із неї.",
    high: "Ваше щоденне життя значною мірою збігається з вашими цінностями — ви живете «своє» життя. Це дає рідкісне відчуття внутрішньої згоди, коли не треба нічого собі доводити. Оберігайте цю узгодженість під час великих змін.",
  },
  VIT: {
    low: "Ця шкала відображає базове відчуття, що жити — варто. Зараз воно ослаблене: можливі втома від життя, порожній вільний час, майбутнє без інтересу, відчуття, що ваше життя мало для кого важить. Поставтеся до цього серйозно — не як до слабкості, а як до сигналу, що ресурс на межі. Це саме той стан, з яким не варто залишатися наодинці: розмова з психотерапевтом або хоча б із близькою людиною — не «крайній захід», а нормальний перший крок.",
    mid: "Життєва наснага присутня, але нестабільна: інтерес до майбутнього і відчуття власної значущості коливаються. Зверніть увагу, що саме їх підживлює, а що виснажує, — і свідомо підсильте перше.",
    high: "У вас збережене живе відчуття, що життя варте того: майбутнє викликає інтерес, ви відчуваєте свою значущість для людей і справ. Це фундамент, на якому тримається все інше.",
  },
};

const quadrants: Record<string, { title: string; text: string }> = {
  'P-S+': { title: 'У дорозі', text: 'Сенсу поки бракує, але ви його активно шукаєте — питання вже поставлене, і це головне. Такий стан буває болісним, але він продуктивний: саме з нього виростають найглибші зміни. Завдання цього періоду — не квапити себе з «великою відповіддю», а збирати маленькі: що відгукується, а що ні. Супровід терапевта тут суттєво скорочує шлях.' },
  'P-S-': { title: 'Тиха порожнеча', text: 'Сенсу бракує, і сил чи бажання шукати його зараз немає. Так часто виглядає екзистенційний вакуум або глибока втома: не драма, а сірість і «ніяк». Це найважливіший результат цього тесту — і найвагоміша причина не залишатися з ним наодинці. Починати варто не з пошуку сенсу, а з відновлення ресурсу і живого контакту — з людьми, тілом, простими радощами.' },
  'P+S+': { title: 'Зростання', text: 'У вас є сенс — і ви продовжуєте шукати глибше. Це пошук не від порожнечі, а від зрілості: старі відповіді не зникли, але ви переросли їхню простоту. Такий стан характерний для перехідних періодів життя і дуже добре піддається роботі — терапевтичній чи коучинговій.' },
  'P+S-': { title: 'Опора', text: 'Сенс присутній і стабільний, активний пошук зараз не потрібен. Це добрий стан. Єдине, за чим варто стежити: чи опора жива, чи вже просто звична. Час від часу питайте себе: «Якби я обирав(-ла) сьогодні заново — чи обрав(-ла) би це саме?»' },
};

const pePatterns: Record<string, { title: string; text: string }> = {
  'PhighEhigh': { title: 'Цілісність', text: 'Ви і відчуваєте, і дієте: внутрішнє сприйняття та зовнішнє втілення працюють у парі. Саме це в екзистенційному аналізі і є практичною основою автентичного життя. Ваше завдання — не вдосконалюватися, а не розгубити цю узгодженість у періоди перевантаження.' },
  'PhighElow': { title: 'Багатий внутрішній світ, якому важко втілитися', text: 'Ви добре відчуваєте себе і свої цінності, але рішення та дії буксують — життя може виглядати як довге «збирання духу». Робота тут не про почуття, а про маленькі завершені кроки: одне мале рішення, доведене до кінця, дає більше, ніж місяць роздумів.' },
  'PlowEhigh': { title: 'Дія без опори на себе', text: 'Ви багато вирішуєте і робите, але контакт із власними почуттями та цінностями ослаблений. Ризик цього патерну — жити «правильно», але не «своє», і помітити це лише на етапі виснаження. Повертайте собі питання «а що я зараз відчуваю? а мені це важливо?» — до рішень, а не після.' },
  'PlowElow': { title: 'Здатності тимчасово заблоковані', text: 'І сприйняття, і дія зараз даються важко. Так зазвичай виглядає не «характер», а виснаження, тривалий стрес чи криза. Це стан, який минає — але значно швидше з підтримкою, ніж без неї.' },
};

const overallBands = {
  low: { title: 'Час прислухатися до себе', text: "Ваші відповіді свідчать про виражену екзистенційну напругу: сенс, свобода, згода з собою чи життєва наснага зараз під питанням. Це не характеристика вас як людини — це знімок періоду, і такі періоди минають. Але минають по-різному: наодинці — довго і по колу, з підтримкою — швидше і з результатом. Профіль нижче покаже, де напруга найбільша; саме звідти варто починати." },
  mid: { title: 'Є опори — і є простір для зростання', text: 'У вашому профілі є справжні опори — і є зони, які просять уваги. Це найпоширеніша і найпродуктивніша конфігурація: є на що спертися в роботі над тим, що провисає. Подивіться на дві найнижчі шкали — зазвичай саме вони «тягнуть» відчуття життя донизу, і саме робота з ними дає найшвидший ефект.' },
  high: { title: 'Високий рівень екзистенційної сповненості', text: 'Ви живете осмислено, вільно й у злагоді з собою — екзистенційні здатності працюють узгоджено. Для вас цей тест радше інструмент тонкого налаштування: гляньте, чи немає однієї шкали, що помітно відстає від решти, — навіть на високому загальному рівні вона підказує зону зростання.' },
};

function bandOf(v: number): Band {
  if (v <= 39) return 'low';
  if (v <= 69) return 'mid';
  return 'high';
}

type Stage = 'intro' | 'questions' | 'sources' | 'results';

const ExistentialProfileTest = () => {
  const { saveResult } = useTestResultSaver('ekzystentsiinyi-profil');
  const [stage, setStage] = useState<Stage>('intro');
  const [qPage, setQPage] = useState(0);
  const [srcPage, setSrcPage] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(38).fill(null));
  const [srcRatings, setSrcRatings] = useState<(number | null)[]>(Array(16).fill(null));
  const resultRef = useRef<HTMLDivElement>(null);

  usePageSEO({
    title: 'Екзистенційний профіль — тест на сенс і сповненість життя | myrhorodskyi.com',
    description: 'Тест «Екзистенційний профіль»: 38 тверджень і 16 сфер життя. Виміряй сенс, свободу, відповідальність, згоду з цінностями та життєву наснагу — за мотивами підходів Франкла та Ленгле.',
    canonical: 'https://myrhorodskyi.com/tests/ekzystentsiinyi-profil',
    keywords: 'екзистенційний тест, тест на сенс життя, Франкл, Ленгле, психологічний тест українською, сенс, самотрансценденція',
  });

  // --- Question page ranges ---
  const qRanges = useMemo(() => {
    const r: Array<[number, number]> = [];
    let start = 0;
    for (const n of qPageSizes) { r.push([start, start + n]); start += n; }
    return r;
  }, []);
  const srcRanges = useMemo(() => {
    const r: Array<[number, number]> = [];
    let start = 0;
    for (const n of srcPageSizes) { r.push([start, start + n]); start += n; }
    return r;
  }, []);

  // --- SCORING ---
  const scores = useMemo(() => {
    const byScale: Record<ScaleCode, number[]> = {
      SENS: [], PRES: [], SRCH: [], SD: [], ST: [], FR: [], RESP: [], VAL: [], VIT: [],
    };
    questions.forEach((q, idx) => {
      const raw = answers[idx];
      if (raw == null) return;
      const scored = q.reversed ? 8 - raw : raw;
      byScale[q.scale].push(scored);
    });
    const out: Record<ScaleCode, number> = {} as any;
    (Object.keys(byScale) as ScaleCode[]).forEach(k => {
      const arr = byScale[k];
      const mean = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      out[k] = Math.round(((mean - 1) / 6) * 100);
    });
    return out;
  }, [answers]);

  const indexScales: ScaleCode[] = ['SENS', 'PRES', 'SD', 'ST', 'FR', 'RESP', 'VAL', 'VIT'];
  const overallIndex = useMemo(() => {
    const mean = indexScales.reduce((s, k) => s + scores[k], 0) / indexScales.length;
    return Math.round(mean);
  }, [scores]);
  const pFactor = useMemo(() => Math.round((scores.SD + scores.ST) / 2), [scores]);
  const eFactor = useMemo(() => Math.round((scores.FR + scores.RESP) / 2), [scores]);

  const answer36 = answers[questions.findIndex(q => q.id === 36)];
  const showSupport = scores.VIT <= 30 || (answer36 != null && answer36 >= 6);

  const quadKey = `${scores.PRES >= 50 ? 'P+' : 'P-'}${scores.SRCH >= 50 ? 'S+' : 'S-'}`;
  const peKey = `${pFactor >= 50 ? 'Phigh' : 'Plow'}${eFactor >= 50 ? 'Ehigh' : 'Elow'}`;

  const barData = useMemo(() => (
    (['SENS', 'PRES', 'SRCH', 'SD', 'ST', 'FR', 'RESP', 'VAL', 'VIT'] as ScaleCode[]).map(k => ({
      code: k,
      name: scaleNames[k],
      value: scores[k],
      isSearch: k === 'SRCH',
    }))
  ), [scores]);

  const lowestTwoIndexScales = useMemo(() => (
    [...indexScales].sort((a, b) => scores[a] - scores[b]).slice(0, 2)
  ), [scores]);

  const topSources = useMemo(() => {
    return sources
      .map((name, i) => ({ name, rating: srcRatings[i] ?? 0, idx: i }))
      .sort((a, b) => b.rating - a.rating || a.idx - b.idx)
      .slice(0, 3);
  }, [srcRatings]);
  const maxSource = useMemo(() => Math.max(0, ...srcRatings.map(r => r ?? 0)), [srcRatings]);
  const countHighSources = useMemo(() => srcRatings.filter(r => (r ?? 0) >= 4).length, [srcRatings]);

  // --- Answer handlers ---
  const setAnswer = (i: number, v: number) => {
    setAnswers(prev => { const n = [...prev]; n[i] = v; return n; });
  };
  const setSrc = (i: number, v: number) => {
    setSrcRatings(prev => { const n = [...prev]; n[i] = v; return n; });
  };

  // --- Navigation ---
  const [start, end] = stage === 'questions' ? qRanges[qPage] : [0, 0];
  const [sStart, sEnd] = stage === 'sources' ? srcRanges[srcPage] : [0, 0];

  const qPageComplete = stage === 'questions'
    ? answers.slice(start, end).every(a => a != null)
    : false;
  const srcPageComplete = stage === 'sources'
    ? srcRatings.slice(sStart, sEnd).every(a => a != null)
    : false;

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const goNext = () => {
    if (stage === 'questions') {
      if (qPage < qRanges.length - 1) {
        setQPage(p => p + 1);
      } else {
        setStage('sources');
      }
      scrollTop();
    } else if (stage === 'sources') {
      if (srcPage < srcRanges.length - 1) {
        setSrcPage(p => p + 1);
        scrollTop();
      } else {
        submitTest();
      }
    }
  };

  const goBack = () => {
    if (stage === 'questions') {
      if (qPage > 0) { setQPage(p => p - 1); scrollTop(); }
      else { setStage('intro'); scrollTop(); }
    } else if (stage === 'sources') {
      if (srcPage > 0) { setSrcPage(p => p - 1); scrollTop(); }
      else { setStage('questions'); setQPage(qRanges.length - 1); scrollTop(); }
    }
  };

  const submitTest = useCallback(() => {
    setStage('results');
    saveResult(
      { answers, sources: srcRatings },
      { scales: scores, overallIndex, pFactor, eFactor, quadKey, peKey, showSupport },
    );
    scrollTop();
  }, [answers, srcRatings, scores, overallIndex, pFactor, eFactor, quadKey, peKey, showSupport, saveResult]);

  const resetTest = useCallback(() => {
    setStage('intro');
    setQPage(0);
    setSrcPage(0);
    setAnswers(Array(38).fill(null));
    setSrcRatings(Array(16).fill(null));
    scrollTop();
  }, []);

  const downloadPDF = useCallback(async () => {
    const el = resultRef.current;
    if (!el) return;
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf().set({
      margin: [10, 8],
      filename: 'Existential-Profile.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    } as any).from(el).save();
  }, []);

  // --- Progress ---
  const totalSteps = 38 + 16;
  const answered = answers.filter(a => a != null).length + srcRatings.filter(a => a != null).length;
  const progress = (answered / totalSteps) * 100;

  const patternBg = '/pattern-bg.webp';

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section
        className="pt-32 pb-8 bg-primary relative overflow-hidden"
        style={{ backgroundImage: `url(${patternBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-primary/85" />
        <div className="relative z-10 container-custom section-padding py-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-2">
              {stage === 'results' ? 'Ваш екзистенційний профіль' : 'Екзистенційний профіль'}
            </h1>
            {stage === 'intro' && (
              <p className="text-primary-foreground/80 text-lg">Наскільки сповненим і осмисленим є ваше життя зараз?</p>
            )}
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl mx-auto">
          <AnimatePresence mode="wait">

            {stage === 'intro' && (
              <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <Card className="border-border shadow-lg">
                  <CardContent className="p-8 md:p-12">
                    <div className="flex items-center justify-center mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Compass className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-3">
                      Екзистенційний профіль
                    </h2>
                    <p className="text-center text-muted-foreground mb-8 text-lg">
                      Наскільки сповненим і осмисленим є твоє життя зараз?
                    </p>
                    <div className="bg-muted/50 rounded-xl p-6 mb-6 text-muted-foreground leading-relaxed">
                      <p>
                        <strong className="text-foreground">38 коротких тверджень</strong> і <strong className="text-foreground">16 сфер життя</strong>. Приблизно <strong className="text-foreground">10 хвилин</strong>.
                      </p>
                      <p className="mt-3">
                        Тест створено за мотивами класичних підходів екзистенційної психології — традиції Віктора Франкла та Альфріда Ленгле. Він допоможе побачити, де у твоєму житті є сенс і опора, а де — напруга чи порожнеча.
                      </p>
                      <p className="mt-3">
                        Відповідай про те, як є зараз, а не як «має бути»: тут немає правильних відповідей.
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mb-6">
                      Це інструмент самопізнання, а не психологічна діагностика.
                    </p>
                    <Button
                      variant="cta"
                      size="xl"
                      className="w-full"
                      onClick={() => { setStage('questions'); scrollTop(); }}
                    >
                      Почати тест
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {stage === 'questions' && (
              <motion.div key={`q-${qPage}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Питання {start + 1}–{end} з 38</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <Card className="border-border shadow-lg">
                  <CardContent className="p-6 md:p-10 space-y-8">
                    {questions.slice(start, end).map((q, i) => {
                      const idx = start + i;
                      return (
                        <div key={q.id} className="pb-6 border-b border-border last:border-b-0 last:pb-0">
                          <p className="font-display text-lg md:text-xl font-semibold text-foreground mb-4 leading-relaxed">
                            {q.id}. {q.text}
                          </p>
                          <div className="grid grid-cols-7 gap-1.5 md:gap-2 mb-2">
                            {[1, 2, 3, 4, 5, 6, 7].map(v => (
                              <button
                                key={v}
                                onClick={() => setAnswer(idx, v)}
                                className={cn(
                                  "aspect-square rounded-lg border-2 font-display text-sm md:text-base font-bold transition-all duration-150 flex items-center justify-center",
                                  answers[idx] === v
                                    ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
                                    : "border-border bg-background text-muted-foreground hover:border-primary/60 hover:text-foreground"
                                )}
                                aria-label={`Оцінка ${v}`}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Зовсім не про мене</span>
                            <span>Повністю про мене</span>
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <Button variant="ghost" onClick={goBack}>← Назад</Button>
                      <Button variant="cta" onClick={goNext} disabled={!qPageComplete}>
                        {qPage === qRanges.length - 1 ? 'До сфер життя →' : 'Далі →'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {stage === 'sources' && (
              <motion.div key={`s-${srcPage}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Сфери життя {sStart + 1}–{sEnd} з 16</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <Card className="border-border shadow-lg">
                  <CardContent className="p-6 md:p-10 space-y-6">
                    {srcPage === 0 && (
                      <p className="text-foreground font-medium mb-2">
                        Наскільки кожна з цих сфер є для тебе джерелом сенсу зараз?
                      </p>
                    )}
                    {sources.slice(sStart, sEnd).map((name, i) => {
                      const idx = sStart + i;
                      return (
                        <div key={idx} className="pb-4 border-b border-border last:border-b-0 last:pb-0">
                          <p className="text-base md:text-lg font-medium text-foreground mb-3">{name}</p>
                          <div className="grid grid-cols-5 gap-2 mb-2">
                            {[1, 2, 3, 4, 5].map(v => (
                              <button
                                key={v}
                                onClick={() => setSrc(idx, v)}
                                className={cn(
                                  "aspect-square rounded-lg border-2 font-display text-base font-bold transition-all duration-150 flex items-center justify-center",
                                  srcRatings[idx] === v
                                    ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
                                    : "border-border bg-background text-muted-foreground hover:border-primary/60 hover:text-foreground"
                                )}
                                aria-label={`Оцінка ${v}`}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Зовсім ні</span>
                            <span>Дуже сильно</span>
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <Button variant="ghost" onClick={goBack}>← Назад</Button>
                      <Button variant="cta" onClick={goNext} disabled={!srcPageComplete}>
                        {srcPage === srcRanges.length - 1 ? 'Завершити тест' : 'Далі →'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {stage === 'results' && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                <div className="flex justify-end mb-4">
                  <Button variant="outline" size="sm" onClick={downloadPDF} className="gap-2">
                    <Download className="w-4 h-4" />
                    Завантажити звіт (PDF)
                  </Button>
                </div>

                <div ref={resultRef} className="space-y-6">
                  {/* Reading guide */}
                  <Card className="border-border">
                    <CardContent className="p-6 md:p-8">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-2">Як читати результати</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Це знімок твого поточного стану, а не вирок і не «тип особистості»: за місяць чи після значних подій профіль може виглядати інакше. Високі бали — не норма, яку треба скласти, а низькі — не діагноз. Найцінніше в цьому тесті — не цифри, а питання, які він допомагає собі поставити.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Support card */}
                  {showSupport && (
                    <Alert className="border-2 border-destructive/40 bg-destructive/5 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <LifeBuoy className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
                        <AlertDescription className="space-y-2">
                          <p className="font-display font-semibold text-foreground text-lg">Схоже, тобі зараз по-справжньому непросто</p>
                          <p className="text-muted-foreground leading-relaxed">
                            Деякі твої відповіді свідчать про сильну втому від життя. Хочемо сказати прямо: такий стан — не слабкість і не назавжди, і з ним не варто залишатися наодинці. Будь ласка, поговори із психологом чи психотерапевтом, а якщо стане зовсім важко — зателефонуй на національну лінію підтримки <strong className="text-foreground">Lifeline Ukraine за номером 7333</strong> (цілодобово, безкоштовно). Звернутися по допомогу — це і є той відповідальний крок, про який говорить екзистенційна терапія.
                          </p>
                        </AlertDescription>
                      </div>
                    </Alert>
                  )}

                  {/* Overall score */}
                  <Card className="border-border shadow-lg">
                    <CardContent className="p-6 md:p-10 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Індекс екзистенційної сповненості</p>
                      <p className="font-display text-5xl md:text-6xl font-bold text-foreground mb-4">{overallIndex}</p>
                      <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                        {overallBands[bandOf(overallIndex)].title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-left md:text-center">
                        {overallBands[bandOf(overallIndex)].text}
                      </p>
                      {(() => {
                        const lowest = Math.min(...indexScales.map(k => scores[k]));
                        if (lowest < 60) {
                          return (
                            <p className="mt-4 text-sm text-foreground font-medium">
                              Насамперед зверни увагу на: {lowestTwoIndexScales.map(k => scaleNames[k]).join(', ')}.
                            </p>
                          );
                        }
                        return null;
                      })()}
                    </CardContent>
                  </Card>

                  {/* Bar chart */}
                  <Card className="border-border shadow-lg">
                    <CardContent className="p-6 md:p-8">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-4">Профіль 9 шкал</h3>
                      <div className="w-full" style={{ height: 420 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barData} layout="vertical" margin={{ top: 8, right: 30, left: 10, bottom: 8 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(168, 20%, 90%)" />
                            <XAxis type="number" domain={[0, 100]} tick={{ fill: 'hsl(168, 15%, 40%)', fontSize: 11 }} />
                            <YAxis type="category" dataKey="code" width={60} tick={{ fill: 'hsl(168, 30%, 15%)', fontSize: 12, fontWeight: 600 }} />
                            <Tooltip
                              cursor={{ fill: 'hsl(168, 20%, 95%)' }}
                              formatter={(value: number, _n, entry: any) => [`${value}`, entry?.payload?.name]}
                            />
                            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                              {barData.map((d, i) => (
                                <Cell key={i} fill={d.isSearch ? 'hsl(168, 30%, 55%)' : 'hsl(168, 56%, 23%)'} />
                              ))}
                              <LabelList dataKey="value" position="right" fill="hsl(168, 30%, 15%)" fontSize={12} />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        «Пошук сенсу» — нейтральна шкала: високі значення не означають проблему.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Quadrant */}
                  <Card className="border-border shadow-lg">
                    <CardContent className="p-6 md:p-8">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-1">Присутність і пошук сенсу</h3>
                      <p className="font-display text-xl text-primary font-semibold mb-3">{quadrants[quadKey].title}</p>
                      <p className="text-muted-foreground leading-relaxed">{quadrants[quadKey].text}</p>
                    </CardContent>
                  </Card>

                  {/* P/E patterns */}
                  <Card className="border-border shadow-lg">
                    <CardContent className="p-6 md:p-8">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-3">Сприймати і діяти</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-4 rounded-xl bg-muted/40">
                          <p className="text-xs text-muted-foreground mb-1">P-фактор (внутрішня опора)</p>
                          <p className="font-display text-3xl font-bold text-primary">{pFactor}</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-muted/40">
                          <p className="text-xs text-muted-foreground mb-1">E-фактор (дієва опора)</p>
                          <p className="font-display text-3xl font-bold text-primary">{eFactor}</p>
                        </div>
                      </div>
                      <p className="font-display text-xl text-primary font-semibold mb-2">{pePatterns[peKey].title}</p>
                      <p className="text-muted-foreground leading-relaxed">{pePatterns[peKey].text}</p>
                    </CardContent>
                  </Card>

                  {/* Top sources */}
                  <Card className="border-border shadow-lg">
                    <CardContent className="p-6 md:p-8">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-4">Твої провідні джерела сенсу зараз</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {topSources.map((s) => (
                          <span key={s.idx} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-foreground font-medium">
                            {s.name}
                            <span className="text-primary font-bold">{s.rating}/5</span>
                          </span>
                        ))}
                      </div>
                      {maxSource <= 2 ? (
                        <p className="text-muted-foreground leading-relaxed">
                          Зараз жодна сфера не відчувається сильним джерелом сенсу. Це не означає, що джерел немає, — радше зв'язок із ними тимчасово втрачено, як буває при виснаженні чи в кризі. Це важлива інформація: починати варто не з пошуку нового, а з обережного повернення до того, що наповнювало колись.
                        </p>
                      ) : (
                        <p className="text-muted-foreground leading-relaxed">
                          Спирайся на ці сфери у складні періоди — це твій ресурс. Низькі оцінки в інших сферах — не проблема: сенс не мусить бути всюди. Але якщо якась колись важлива для тебе сфера згасла — це варте окремої уваги.
                          {countHighSources >= 6 && (
                            <> {' '}<span className="block mt-3 text-foreground font-medium">У тебе широка опора: сенс приходить із багатьох джерел одразу. Це підвищує стійкість — якщо одна сфера тимчасово недоступна, інші підтримають.</span></>
                          )}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Accordions */}
                  <Card className="border-border shadow-lg">
                    <CardContent className="p-6 md:p-8">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-4">Детально по кожній шкалі</h3>
                      <Accordion type="multiple" className="w-full">
                        {(['SENS', 'PRES', 'SRCH', 'SD', 'ST', 'FR', 'RESP', 'VAL', 'VIT'] as ScaleCode[]).map(k => {
                          const v = scores[k];
                          const b = bandOf(v);
                          return (
                            <AccordionItem key={k} value={k}>
                              <AccordionTrigger className="text-left hover:no-underline">
                                <div className="flex items-center justify-between w-full pr-3">
                                  <span className="font-medium text-foreground">{scaleNames[k]}</span>
                                  <span className="font-display font-bold text-primary text-lg ml-3">{v}</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="text-muted-foreground leading-relaxed">
                                {scaleInterp[k][b]}
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
                      <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-3">
                        Хочеш дослідити свої результати глибше?
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-6 max-w-xl mx-auto">
                        На консультації ми розберемо твій профіль і те, що за ним стоїть.
                      </p>
                      <div className="flex flex-col gap-4">
                        <Button variant="cta" size="xl" className="w-full whitespace-normal h-auto py-4" asChild>
                          <a href="https://t.me/SigurdPSYBot?start=64f8747ec7512692c00d1788" target="_blank" rel="noopener noreferrer">
                            Записатися на консультацію
                          </a>
                        </Button>
                        <Button variant="outline" size="xl" className="w-full" onClick={resetTest}>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Пройти тест ще раз
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <p className="text-xs text-muted-foreground text-center px-4 leading-relaxed">
                    Цей тест створено для самопізнання та рефлексії. Він не є психологічною діагностикою і не замінює консультацію фахівця. Результати описують поточний стан, а не «тип особистості», і можуть змінюватися.
                  </p>
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

export default ExistentialProfileTest;