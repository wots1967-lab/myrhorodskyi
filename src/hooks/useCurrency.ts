import { useMemo } from 'react';

type Currency = 'USD' | 'EUR';

interface PriceMap {
  USD: string;
  EUR: string;
}

const PRICES = {
  consultation: { USD: '50$', EUR: '45€' },
  mentorship: { USD: '70$', EUR: '65€' },
  pack5: { USD: '230$', EUR: '210€' },
  pack5saving: { USD: '20$', EUR: '20€' },
  pack10: { USD: '450$', EUR: '410€' },
  pack10saving: { USD: '50$', EUR: '45€' },
} satisfies Record<string, PriceMap>;

function detectCurrency(): Currency {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === 'Europe/Kyiv' || tz === 'Europe/Kiev') return 'USD';
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
