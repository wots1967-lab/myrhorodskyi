import { defineTool } from "@lovable.dev/mcp-js";

const SITE_URL = "https://myrhorodskyi.com";

const TESTS: Array<{ slug: string; title: string; description: string }> = [
  { slug: "shkala-tryvohy-beka", title: "Шкала тривоги Бека (BAI)", description: "Оцінює вираженість симптомів тривоги за останній тиждень." },
  { slug: "shkala-depresii-beka", title: "Шкала депресії Бека (BDI-II)", description: "Класичний скринінг депресивних симптомів." },
  { slug: "shkala-stresu-pss10", title: "Шкала сприйнятого стресу PSS-10", description: "Рівень стресу за останній місяць." },
  { slug: "test-neiromediatoriv-brovermana", title: "Тест нейромедіаторів Бровермана", description: "Оцінка домінантного нейромедіаторного профілю." },
  { slug: "temna-triada", title: "Темна тріада (SD3)", description: "Нарцисизм, макіавеллізм, психопатія." },
  { slug: "temperament-aizenka", title: "Темперамент за Айзенком (EPI)", description: "Екстраверсія/інтроверсія, нейротизм." },
  { slug: "profil-ego-staniv", title: "Профіль его-станів", description: "Транзактний аналіз: Батько / Дорослий / Дитина." },
  { slug: "rozshyrenyi-profil-ego-staniv", title: "Розширений профіль его-станів", description: "Розширена версія тесту транзактного аналізу." },
  { slug: "5-mov-lyubovi", title: "5 мов любові", description: "Як ти виражаєш і сприймаєш любов." },
  { slug: "opytuvalnyk-rannih-shem-ysq", title: "Опитувальник ранніх дезадаптивних схем YSQ", description: "Ключовий інструмент схема-терапії Янга." },
  { slug: "diagnostyka-samosti-ifs", title: "Діагностика Самості (IFS)", description: "IFS-скринінг рівня доступу до Самості." },
  { slug: "klinichna-shkala-ifs", title: "Клінічна шкала IFS", description: "Клінічна оцінка внутрішньої системи за моделлю IFS." },
  { slug: "profil-zahysnykiv-ifs", title: "Профіль захисників (IFS)", description: "Профіль менеджерів та пожежників у моделі IFS." },
  { slug: "ekzystentsiinyi-profil", title: "Екзистенційний профіль", description: "Тест на сенс, свободу, відповідальність та життєву наснагу за мотивами Франкла та Ленгле." },
  { slug: "finansova-osobystist", title: "Фінансова особистість", description: "Глибинний тест ставлення до грошей." },
];

export default defineTool({
  name: "list_tests",
  title: "Каталог психологічних тестів",
  description:
    "Повертає перелік усіх психологічних тестів, доступних на сайті myrhorodskyi.com, з назвами, коротким описом і публічними URL.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const items = TESTS.map((t) => ({
      slug: t.slug,
      title: t.title,
      description: t.description,
      url: `${SITE_URL}/tests/${t.slug}`,
    }));
    const text = items
      .map((t) => `• ${t.title} — ${t.description}\n  ${t.url}`)
      .join("\n");
    return {
      content: [{ type: "text", text }],
      structuredContent: { count: items.length, tests: items },
    };
  },
});