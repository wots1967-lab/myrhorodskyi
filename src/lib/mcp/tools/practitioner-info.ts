import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "practitioner_info",
  title: "Про психолога та контакти",
  description:
    "Повертає інформацію про психолога Сергія Миргородського: підхід, спеціалізацію та актуальні контакти для запису на сесію.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const info = {
      name: "Сергій Миргородський",
      role: "Психолог, психотерапевт",
      approach:
        "Інтегративний підхід: когнітивно-поведінкова терапія (CBT), схема-терапія, IFS, юнгіанський аналіз, транзактний аналіз.",
      language: "Українська (звертання на 'ти')",
      focus: [
        "Тривога та панічні атаки",
        "Депресія та вигорання",
        "Стосунки та кризи ідентичності",
        "Робота з дезадаптивними схемами",
      ],
      out_of_scope: [
        "Шизофренія",
        "Залежності",
        "Важкий ПТСР",
        "Параноїдні розлади",
        "Клієнти віком до 16 років",
      ],
      contacts: {
        telegram_bot: "https://t.me/SigurdPSYBot?start=64f8747ec7512692c00d1788",
        telegram_personal: "https://t.me/sigurdpsy",
        instagram: "https://instagram.com/sigurd.psy",
      },
      website: "https://myrhorodskyi.com",
      motto: "Пізнай себе. Я працюю на те, щоб ти більше не потребував психолога.",
    };
    const text =
      `${info.name} — ${info.role}\n` +
      `${info.approach}\n\n` +
      `Фокус: ${info.focus.join(", ")}\n` +
      `Не працює з: ${info.out_of_scope.join(", ")}\n\n` +
      `Записатися: ${info.contacts.telegram_bot}\n` +
      `Telegram: ${info.contacts.telegram_personal}\n` +
      `Instagram: ${info.contacts.instagram}\n` +
      `Сайт: ${info.website}`;
    return {
      content: [{ type: "text", text }],
      structuredContent: info,
    };
  },
});