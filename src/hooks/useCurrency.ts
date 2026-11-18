import { useState, useEffect } from 'react';
import { PRICE_EUR, PACK_SAVING_EUR, USD_PER_EUR } from '@/config/pricing';

type Currency = 'USD' | 'EUR';

interface PriceMap {
  USD: string;
  EUR: string;
}

// Числа беруться з єдиного файлу цін: src/config/pricing.ts
const fmt = (eur: number): PriceMap => ({
  EUR: `${eur}€`,
  USD: `${Math.round(eur * USD_PER_EUR)}$`,
});

const PRICES = {
  consultation: fmt(PRICE_EUR.consultation),
  mentorship: fmt(PRICE_EUR.mentorship),
  pack5: fmt(PRICE_EUR.pack5),
  pack5saving: fmt(PACK_SAVING_EUR.pack5),
  pack10: fmt(PRICE_EUR.pack10),
  pack10saving: fmt(PACK_SAVING_EUR.pack10),
} satisfies Record<string, PriceMap>;

const USD_COUNTRIES = new Set(['UA', 'IL']);

function fallbackCurrency(): Currency {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (['Europe/Kyiv', 'Europe/Kiev', 'Asia/Jerusalem', 'Asia/Tel_Aviv'].includes(tz)) return 'USD';
  } catch {}
  return 'EUR';
}

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>(fallbackCurrency);

  useEffect(() => {
    // Defer geolocation fetch to idle time so it never competes with LCP/critical path
    const run = () => {
      fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) })
        .then(res => res.json())
        .then(data => {
          if (data?.country_code) {
            setCurrency(USD_COUNTRIES.has(data.country_code) ? 'USD' : 'EUR');
          }
        })
        .catch(() => {
          // keep fallback timezone-based currency
        });
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number };
    if (typeof w.requestIdleCallback === 'function') {
      w.requestIdleCallback(run, { timeout: 4000 });
    } else {
      setTimeout(run, 2500);
    }
  }, []);

  const prices = {
    consultation: PRICES.consultation[currency],
    mentorship: PRICES.mentorship[currency],
    pack5: PRICES.pack5[currency],
    pack5saving: PRICES.pack5saving[currency],
    pack10: PRICES.pack10[currency],
    pack10saving: PRICES.pack10saving[currency],
  };

  return { currency, prices };
}
