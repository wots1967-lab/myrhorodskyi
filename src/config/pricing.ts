// ЄДИНЕ ДЖЕРЕЛО ЦІН.
// Щоб змінити ціни, правимо тільки числа нижче: сторінка «Послуги», FAQ і
// структуровані дані для Google (index.html) оновляться самі під час збірки.

/** Ціни в євро. */
export const PRICE_EUR = {
  consultation: 50, // індивідуальна сесія
  mentorship: 70, // особисте наставництво
  pack5: 230, // пакет із 5 сесій
  pack10: 450, // пакет із 10 сесій
} as const;

/** Скільки доларів у «ціновому» євро для України та Ізраїлю (1 = те саме число: 50€ → 50$). */
export const USD_PER_EUR = 1;

/** Тривалість індивідуальної сесії, хвилин. */
export const SESSION_MINUTES = 50;

export type PriceKey = keyof typeof PRICE_EUR;

/** Скільки клієнт заощаджує на пакеті порівняно з окремими сесіями (в євро). */
export const PACK_SAVING_EUR = {
  pack5: PRICE_EUR.consultation * 5 - PRICE_EUR.pack5,
  pack10: PRICE_EUR.consultation * 10 - PRICE_EUR.pack10,
} as const;

/** Значення для підстановки в index.html (токени {{PRICE_...}}). */
export function htmlPriceTokens(): Record<string, string> {
  const singles = [PRICE_EUR.consultation, PRICE_EUR.mentorship];
  return {
    PRICE_MIN: String(Math.min(...singles)),
    PRICE_MAX: String(Math.max(...singles)),
    PRICE_CONSULTATION: String(PRICE_EUR.consultation),
    PRICE_PACK5: String(PRICE_EUR.pack5),
    PRICE_PACK10: String(PRICE_EUR.pack10),
    SESSION_MINUTES: String(SESSION_MINUTES),
  };
}
