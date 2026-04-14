import React from 'react';
import { cn } from '@/lib/utils';
import { financialTestData } from '@/data/financialTestQuestions';

interface ScaleInputProps {
  value: number | null;
  onChange: (value: number) => void;
}

const ScaleInput: React.FC<ScaleInputProps> = ({ value, onChange }) => {
  const labels = financialTestData.scale_labels;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2 sm:gap-4 justify-center">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cn(
              'w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 text-lg font-semibold transition-all duration-200 flex items-center justify-center',
              value === n
                ? 'bg-primary text-primary-foreground border-primary scale-110 shadow-md'
                : 'bg-card text-foreground border-border hover:border-primary/50 hover:bg-primary/10'
            )}
            aria-label={`${n} — ${labels[String(n)]}`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between w-full max-w-xs text-xs text-muted-foreground px-1">
        <span>{labels['1']}</span>
        <span>{labels['5']}</span>
      </div>
    </div>
  );
};

export default ScaleInput;
