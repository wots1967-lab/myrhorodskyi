import { useEffect } from 'react';

interface UseTestKeyboardOptions {
  /** Only active when true */
  isActive: boolean;
  /** Number of options available (e.g. 4) */
  optionsCount: number;
  /** Currently selected value (null if none) */
  currentValue: number | null;
  /** Callback to select an option */
  onSelect: (value: number) => void;
  /** Callback to go to next question */
  onNext: () => void;
  /** Callback to go to previous question */
  onPrev: () => void;
}

/**
 * Adds keyboard shortcuts for test navigation:
 * - ArrowDown / ArrowRight: select next option
 * - ArrowUp / ArrowLeft: select previous option
 * - 1-4 number keys: select option directly
 * - Enter: go to next question
 * - Backspace: go to previous question
 */
export function useTestKeyboard({
  isActive,
  optionsCount,
  currentValue,
  onSelect,
  onNext,
  onPrev,
}: UseTestKeyboardOptions) {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with input elements
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight': {
          e.preventDefault();
          const next = currentValue === null ? 0 : Math.min(currentValue + 1, optionsCount - 1);
          onSelect(next);
          break;
        }
        case 'ArrowUp':
        case 'ArrowLeft': {
          e.preventDefault();
          const prev = currentValue === null ? optionsCount - 1 : Math.max(currentValue - 1, 0);
          onSelect(prev);
          break;
        }
        case 'Enter': {
          e.preventDefault();
          onNext();
          break;
        }
        case 'Backspace': {
          e.preventDefault();
          onPrev();
          break;
        }
        case '1':
        case '2':
        case '3':
        case '4':
        case '5': {
          const num = parseInt(e.key) - 1;
          if (num < optionsCount) {
            e.preventDefault();
            onSelect(num);
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, optionsCount, currentValue, onSelect, onNext, onPrev]);
}
