import { motion } from 'framer-motion';
import { Keyboard } from 'lucide-react';

interface KeyHint {
  keys: string[];
  label: string;
}

interface KeyboardHintsProps {
  hints: KeyHint[];
}

const KeyboardHints = ({ hints }: KeyboardHintsProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1, duration: 0.4 }}
    className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none"
  >
    <div className="bg-card/80 backdrop-blur-md border-t border-border/50">
      <div className="container-custom max-w-3xl mx-auto px-4 py-2.5 flex items-center justify-center gap-5 flex-wrap">
        <Keyboard className="w-4 h-4 text-muted-foreground/60 hidden sm:block" />
        {hints.map((hint, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
            <span className="flex items-center gap-1">
              {hint.keys.map((key, j) => (
                <span key={j}>
                  {j > 0 && <span className="mx-0.5">/</span>}
                  <kbd className="inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 rounded bg-muted/60 border border-border/50 text-[10px] font-mono font-medium text-muted-foreground">
                    {key}
                  </kbd>
                </span>
              ))}
            </span>
            <span>{hint.label}</span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default KeyboardHints;

// Presets for common test types
export const HINTS_SCALE = (count: number): KeyHint[] => [
  { keys: ['1', `${count}`], label: 'обрати' },
  { keys: ['↑', '↓'], label: 'змінити' },
  { keys: ['Enter'], label: 'далі' },
  { keys: ['←'], label: 'назад' },
];

export const HINTS_YES_NO: KeyHint[] = [
  { keys: ['1', 'Y'], label: 'так' },
  { keys: ['2', 'N'], label: 'ні' },
  { keys: ['Enter'], label: 'далі' },
  { keys: ['←'], label: 'назад' },
];

export const HINTS_EGO_STATES: KeyHint[] = [
  { keys: ['0', '3'], label: 'обрати бал' },
  { keys: ['↑', '↓'], label: 'змінити' },
  { keys: ['Enter'], label: 'далі' },
  { keys: ['←'], label: 'назад' },
];

export const HINTS_TWO_OPTIONS: KeyHint[] = [
  { keys: ['↑', '↓'], label: 'обрати' },
  { keys: ['Enter'], label: 'підтвердити' },
  { keys: ['←'], label: 'назад' },
];
