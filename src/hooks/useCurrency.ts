import { useState, useEffect } from 'react';

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
