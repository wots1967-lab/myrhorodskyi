import React, { useState } from 'react';
import { Question, AnswerValue } from '@/types/financialTest';
import ScaleInput from './ScaleInput';
import BodyMap from './BodyMap';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface QuestionRendererProps {
  question: Question;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
  questionIndex: number;
}

const isBodyMapQuestion = (id: string) => ['4.5', '4.6', '4.7'].includes(id);

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, value, onChange, questionIndex }) => {
  const [charCount, setCharCount] = useState(typeof value === 'string' ? value.length : 0);

  const renderInput = () => {
    switch (question.type) {
      case 'scale_1_5':
        return <ScaleInput value={value as number | null} onChange={onChange} />;

      case 'single_choice':
        return (
          <div className="flex flex-col gap-2">
            {question.options?.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(opt)}
                className={cn(
                  'text-left px-4 py-3 rounded-xl border transition-colors min-h-[48px]',
                  value === opt
                    ? 'bg-primary/10 border-primary text-foreground font-medium'
                    : 'bg-card border-border hover:border-primary/40 text-foreground'
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        );

      case 'multi_choice': {
        if (isBodyMapQuestion(question.id)) {
          const selected = Array.isArray(value) ? value : [];
          const handleToggle = (zone: string) => {
            if (zone === 'Ніде / нейтрально') {
              onChange(selected.includes(zone) ? [] : [zone]);
            } else {
              const without = selected.filter(s => s !== 'Ніде / нейтрально');
              onChange(without.includes(zone) ? without.filter(s => s !== zone) : [...without, zone]);
            }
          };
          return <BodyMap selected={selected} onToggle={handleToggle} />;
        }

        const selected = Array.isArray(value) ? value : [];
        return (
          <div className="flex flex-col gap-2">
            {question.options?.map((opt) => {
              const isChecked = selected.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(isChecked ? selected.filter(s => s !== opt) : [...selected, opt]);
                  }}
                  className={cn(
                    'text-left px-4 py-3 rounded-xl border transition-colors min-h-[48px] flex items-center gap-3',
                    isChecked
                      ? 'bg-primary/10 border-primary text-foreground font-medium'
                      : 'bg-card border-border hover:border-primary/40 text-foreground'
                  )}
                >
                  <span className={cn(
                    'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                    isChecked ? 'bg-primary border-primary' : 'border-muted-foreground/40'
                  )}>
                    {isChecked && <svg viewBox="0 0 16 16" className="w-3 h-3 text-primary-foreground"><path fill="currentColor" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        );
      }

      case 'open_text':
        return (
          <div className="relative">
            <textarea
              value={(value as string) || ''}
              onChange={(e) => { onChange(e.target.value); setCharCount(e.target.value.length); }}
              placeholder="Напиши тут..."
              className="w-full min-h-[120px] p-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/50 resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
              rows={4}
            />
            <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">{charCount}</span>
          </div>
        );

      case 'short_text':
        return (
          <input
            type="text"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Напиши тут..."
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/50 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
          />
        );

      case 'number':
        return (
          <div className="relative max-w-xs">
            {question.prefix && (
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">{question.prefix}</span>
            )}
            <input
              type="number"
              inputMode="numeric"
              value={value !== null && value !== undefined ? String(value) : ''}
              onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
              placeholder="0"
              className={cn(
                'w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors',
                question.prefix && 'pl-8'
              )}
            />
          </div>
        );

      case 'composite_scale':
        return (
          <div className="flex flex-col gap-4">
            {question.subquestions?.map((sub) => {
              const compositeVal = (value as Record<string, number>) || {};
              return (
                <div key={sub.id} className="bg-muted/50 rounded-xl p-4">
                  <p className="text-sm text-foreground mb-3">{sub.text}</p>
                  <ScaleInput
                    value={compositeVal[sub.id] || null}
                    onChange={(v) => onChange({ ...compositeVal, [sub.id]: v })}
                  />
                </div>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mb-8 last:mb-0">
      {question.critical && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span className="text-xs text-amber-700 dark:text-amber-400">Одне з найдіагностичніших питань. Варто сісти і подумати.</span>
        </div>
      )}
      <p className="text-foreground font-medium mb-4">
        <span className="text-muted-foreground mr-2">{questionIndex + 1}.</span>
        {question.text}
      </p>
      {renderInput()}
    </div>
  );
};

export default QuestionRenderer;
