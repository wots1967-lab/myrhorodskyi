import { useMemo } from 'react';

type Currency = 'USD' | 'EUR';

interface PriceMap {
  USD: string;
  EUR: string;
}

const PRICES = {
  consultation: { USD: '50$', EUR: '50€' },
  mentorship: { USD: '70$', EUR: '70€' },
  pack5: { USD: '230$', EUR: '230€' },
  pack5saving: { USD: '20$', EUR: '20€' },
  pack10: { USD: '450$', EUR: '450€' },
  pack10saving: { USD: '50$', EUR: '50€' },
} satisfies Record<string, PriceMap>;

const USD_TIMEZONES = new Set([
  'Europe/Kyiv', 'Europe/Kiev',
  'Asia/Jerusalem', 'Asia/Tel_Aviv',
]);

function detectCurrency(): Currency {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (USD_TIMEZONES.has(tz)) return 'USD';
  } catch {}
  return 'EUR';
}

export function useCurrency() {
  const currency = useMemo(detectCurrency, []);

  const p = useMemo(() => {
    const c = currency;
    return {
      consultation: PRICES.consultation[c],
      mentorship: PRICES.mentorship[c],
      pack5: PRICES.pack5[c],
      pack5saving: PRICES.pack5saving[c],
      pack10: PRICES.pack10[c],
      pack10saving: PRICES.pack10saving[c],
    };
  }, [currency]);

  return { currency, prices: p };
}
